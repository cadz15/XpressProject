<?php

namespace App\Services;

use App\Models\User;
use App\Models\SubscriptionPlan;
use Stripe\StripeClient;

class SubscriptionService
{
    protected $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Start a Stripe Checkout session for a subscription.
     */
    public function startCheckout(User $user, SubscriptionPlan $plan): string
    {
        // Ensure user exists in Stripe
        if (!$user->stripe_id) {
            $customer = $this->stripe->customers->create([
                'email' => $user->email,
            ]);
            $user->stripe_id = $customer->id;
            $user->save();
        }

        // Create checkout session
        $session = $this->stripe->checkout->sessions->create([
            'payment_method_types' => ['us_bank_account'], // ACH only
            'mode' => 'subscription',
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => intval(round($plan->price * 100)),
                    'recurring' => ['interval' => $plan->interval],
                    'product_data' => ['name' => $plan->name]
                ],
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'customer' => $user->stripe_id,
            'metadata' => [
                'plan_id' => $plan->id,
                'plan_name' => $plan->name,
                'payment_for' => 'subscription',
            ],
            'success_url' => route('waiting.payment') . '?success=1',
            'cancel_url' => route('waiting.payment') . '?canceled=1',
        ]);

        return $session->url;
    }

    /**
     * Cancel subscription manually.
     */
    public function cancelSubscription(User $user)
    {
        $subscription = $user->subscriptions()->latest()->first();
        if ($subscription) {
            $this->stripe->subscriptions->cancel($subscription->stripe_subscription_id);
            $subscription->update(['active' => false]);
        }
    }
}
