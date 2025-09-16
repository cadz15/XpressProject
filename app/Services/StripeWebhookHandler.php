<?php

namespace App\Services;

use Stripe\Event;
use App\Models\TokenPurchase;
use App\Models\UserSubscription;
use Illuminate\Support\Facades\Log;

class StripeWebhookHandler
{
    public function __construct(private TokenService $tokens, private SubscriptionService $subscriptions) {}

    /**
     * Accepts a \Stripe\Event instance (validated).
     */
    public function handle(Event $event): void
    {
        $type = $event->type;

        // Handle token purchases via checkout.session.completed or payment_intent.succeeded
        if ($type === 'checkout.session.completed') {
            $this->handleCheckoutSessionCompleted($event->data->object);
            return;
        }

        if ($type === 'payment_intent.succeeded') {
            $this->handlePaymentIntentSucceeded($event->data->object);
            return;
        }

        // Subscription lifecycle events (forward to SubscriptionService or update local model)
        if (in_array($type, ['customer.subscription.created', 'customer.subscription.updated', 'invoice.payment_succeeded', 'invoice.payment_failed'])) {
            $this->handleSubscriptionEvent($event);
            return;
        }

        // Unhandled: just log
        Log::info('Stripe event unhandled', ['type' => $type]);
    }

    protected function handleCheckoutSessionCompleted($obj): void
    {
        // session metadata may include our token_purchase_id or user id
        $sessionId = $obj->id;
        // try finding TokenPurchase by stripe_payment_id (stored as session id earlier)
        $purchase = TokenPurchase::where('stripe_payment_id', $sessionId)->first();
        if ($purchase && $purchase->status !== 'paid') {
            $purchase->update(['status' => 'paid']);
            $this->tokens->award($purchase->user, intval($purchase->tokens), 'purchase', $purchase);
        }
    }

    protected function handlePaymentIntentSucceeded($obj): void
    {
        $piId = $obj->id;
        // If you store payment_intent id on TokenPurchase, check and award.
        $purchase = TokenPurchase::where('stripe_payment_intent_id', $piId)->first();
        if ($purchase && $purchase->status !== 'paid') {
            $purchase->update(['status' => 'paid']);
            $this->tokens->award($purchase->user, intval($purchase->tokens), 'purchase', $purchase);
        }
    }

    protected function handleSubscriptionEvent($event): void
    {
        // For example, update local user_subscriptions table
        // Extract subscription id and customer
        $obj = $event->data->object;
        $subId = $obj->id ?? ($obj->subscription ?? null);
        $customer = $obj->customer ?? null;

        if (! $subId || ! $customer) {
            Log::warning('Subscription event missing fields', ['event' => $event->type]);
            return;
        }

        // Find user by stripe customer id (Cashier stores stripe_id on users)
        $user = \App\Models\User::where('stripe_id', $customer)->first();
        if (! $user) {
            Log::warning('Subscription event: user not found for customer', ['customer' => $customer]);
            return;
        }

        // Update or create local subscription record
        $planPriceId = $obj->items->data[0]->price->id ?? null;
        \App\Models\UserSubscription::updateOrCreate(
            ['stripe_subscription_id' => $subId],
            [
                'user_id' => $user->id,
                'subscription_plan_id' => null, // leave null unless you map price->plan
                'starts_at' => isset($obj->current_period_start) ? date('Y-m-d H:i:s', $obj->current_period_start) : now(),
                'ends_at' => isset($obj->current_period_end) ? date('Y-m-d H:i:s', $obj->current_period_end) : null,
                'active' => in_array($event->type, ['customer.subscription.created', 'customer.subscription.updated', 'invoice.payment_succeeded']),
            ]
        );
    }
}
