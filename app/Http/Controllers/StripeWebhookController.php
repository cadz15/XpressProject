<?php

namespace App\Http\Controllers;

use App\Events\StripePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\TokenBundle;
use App\Models\TokenLedger;
use App\Models\TokenPurchase;
use Illuminate\Support\Facades\DB;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                $secret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        switch ($event->type) {
            case 'checkout.session.async_payment_succeeded':
                $this->handleCheckoutCompleted($event->data->object);
                break;

            case 'checkout.session.async_payment_failed':
                $this->handlePaymentFailed($event->data->object);
                break;

            case 'charge.updated':
                Log::info('Payment Intent succeeded', ['id' => $event->data->object->id]);
                // You can add any custom logic here if needed
                break;

            case 'payment_intent.succeeded':
                Log::info('Payment Intent succeeded', ['id' => $event->data->object->id]);
                // You can add any custom logic here if needed
                break;

            case 'invoice_payment.paid':
                Log::info('Invoice paid', ['id' => $event->data->object->id]);
                // Handle invoice payment confirmation logic here
                break;

            case 'customer.subscription.updated':
                $this->handleSubscriptionUpdated($event->data->object);
                break;

            case 'customer.subscription.deleted':
                $this->handleSubscriptionDeleted($event->data->object);
                break;

            case 'charge.succeeded':
                Log::info('Charge succeeded', ['id' => $event->data->object->id]);
                break;

            case 'payment_method.attached':
                Log::info('Payment method attached', ['id' => $event->data->object->id]);
                break;

            // You can add more events here as needed

            default:
                Log::info("Unhandled Stripe event: {$event->type}");
        }

        return response()->json(['status' => 'success']);
    }


    /**
     * ✅ Handle completed checkout sessions (token purchases).
     */
    protected function handleCheckoutCompleted($session)
    {
        if ($session->payment_status !== 'paid') {
            Log::warning("Checkout not paid", ['id' => $session->id]);
            return;
        }

        $user = User::where('stripe_id', $session->customer)->first();
        if (!$user) {
            Log::warning("Stripe checkout completed but user not found", ['customer' => $session]);
            return;
        }

        $paymentFor = $session->metadata->payment_for ?? null;

        if(!$paymentFor) {
            Log::warning("Checkout session missing payment for",['customer' => $session]);
            return;
        }

        if($paymentFor == 'subscription') {
            event(new StripePayment($user, $session->subscription, 'subscription', 'success', 'Successful Subscription'));
            return;
        }

        $bundleId = $session->metadata->bundle_id ?? null;
        if (!$bundleId) {
            Log::warning("Checkout session missing bundle id", ['customer' => $session]);
            return;
        }

        $bundle = TokenBundle::find($bundleId);
        if (!$bundle) {
            Log::warning("Token bundle not found for checkout", ['bundle id' => $bundleId]);
            return;
        }

        Log::info("Token bundle credited for user {$user->id}", [
            'bundle_id' => $bundleId,
            'tokens' => $bundle->tokens,
        ]);

        $paymentIntentId = $session->payment_intent ?? null;
        $paymentStatus = $session->payment_status ?? null;

        DB::transaction(function () use ($user, $bundle, $paymentIntentId, $paymentStatus) {
            if (!TokenPurchase::where('stripe_payment_id', $paymentIntentId)->exists()) {
                
                $userToUpdate = User::where('id', $user->id)->lockForUpdate()->first();
                
                // Add to History
                TokenPurchase::create([
                    'user_id' => $userToUpdate->id,
                    'token_bundle_id' => $bundle->id,
                    'stripe_payment_id' => $paymentIntentId,
                    'tokens' => $bundle->tokens,
                    'amount' => $bundle->price,
                    'status' => $paymentStatus
                ]);

                if($paymentStatus == 'paid') {
                    
                    // Credit tokens to user balance
                    $userToUpdate->increment('token_balance', $bundle->tokens);
                    
                    // Record in token ledger
                    TokenLedger::create([
                        'user_id' => $userToUpdate->id,
                        'change'  => $bundle->tokens,
                        'balance' => $userToUpdate->token_balance,
                        'reason' => "Purchased token bundle #{$bundle->id} with {$bundle->tokens} tokens via Stripe",
                    ]);

                    event(new StripePayment($user, $paymentIntentId, 'payment', 'success', 'Successful Token payment'));
        
                }


            }
        });

       
        Log::info("Token bundle credited for user {$user->id}", [
            'bundle_id' => $bundleId,
            'tokens' => $bundle->tokens,
        ]);
    }

    /**
     * ✅ Handle subscription updates/creation.
     */
    protected function handleSubscriptionUpdated($subscription)
    {
        $user = User::where('stripe_id', $subscription->customer)->first();

        if (!$user) {
            Log::warning("Subscription update but user not found", ['customer' => $subscription->customer]);
            return;
        }

        $price = $subscription->items->data[0]->price->unit_amount / 100;
        $plan = SubscriptionPlan::where('price', $price)->first();

        if (!$plan) {
            Log::warning("Stripe plan not found for price ID", ['price_id' => $price]);
            return;
        }

        $user->subscriptions()->updateOrCreate(
            ['stripe_subscription_id' => $subscription->id],
            [
                'subscription_plan_id' => $plan->id,
                'active' => $subscription->status == 'active' ? true : false,
                'starts_at' => $subscription->items->data[0]->current_period_start ? \Carbon\Carbon::createFromTimestamp($subscription->items->data[0]->current_period_start) : null,
                'ends_at' => $subscription->items->data[0]->current_period_end ? \Carbon\Carbon::createFromTimestamp($subscription->items->data[0]->current_period_end) : null,
            ]
        );

        Log::info("Subscription updated for user {$user->id}", [
            'plan_id' => $plan->id,
            'status' => $subscription->status,
        ]);
    }


    /**
     * ✅ Handle subscription cancellations.
     */
    protected function handleSubscriptionDeleted($subscription)
    {
        $user = User::where('stripe_id', $subscription->customer)->first();
        if (!$user) {
            return;
        }

        $local = $user->subscriptions()->where('stripe_id', $subscription->id)->first();
        if ($local) {
            $local->update(['status' => 'canceled']);
        }

        Log::info("Subscription canceled for user {$user->id}");
    }


    protected function handlePaymentFailed($session) 
    {
        
        $user = User::where('stripe_id', $session->customer)->first();
        if (!$user) {
            Log::warning("Stripe checkout completed but user not found", ['customer' => $session]);
            return;
        }

        $paymentFor = $session->metadata->payment_for ?? null;

        if($paymentFor == 'subscription') {
            event(new StripePayment($user, $session->subscription, 'subscription', 'failed', 'Failed Subscription'));
            return;
        }

        $bundleId = $session->metadata->bundle_id ?? null;
        if (!$bundleId) {
            Log::warning("Checkout session missing bundle id", ['customer' => $session]);
            return;
        }


        $bundle = TokenBundle::find($bundleId);
        if (!$bundle) {
            Log::warning("Token bundle not found for checkout", ['bundle id' => $bundleId]);
            return;
        }


        $paymentIntentId = $session->payment_intent ?? null;
        $paymentStatus = $session->payment_status ?? null;


        DB::transaction(function () use ($user, $bundle, $paymentIntentId, $paymentStatus) {
            if (!TokenPurchase::where('stripe_payment_id', $paymentIntentId)->exists()) {
                
                $userToUpdate = User::where('id', $user->id)->lockForUpdate()->first();
                
                // Add to History
                TokenPurchase::create([
                    'user_id' => $userToUpdate->id,
                    'token_bundle_id' => $bundle->id,
                    'stripe_payment_id' => $paymentIntentId,
                    'tokens' => $bundle->tokens,
                    'amount' => $bundle->price,
                    'status' => $paymentStatus
                ]);

            }
        });
 
        // Notify
        event(new StripePayment($user, $paymentIntentId, 'payment', 'failed', 'Payment Failed'));
            
        return;
    }
}
