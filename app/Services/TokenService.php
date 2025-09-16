<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\TokenBundle;
use App\Models\TokenPurchase;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Ramsey\Uuid\Type\Integer;
use Stripe\StripeClient;

class TokenService
{
    protected $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Start a Stripe Checkout Session for buying a token bundle.
     */
    public function startCheckout($user, TokenBundle $bundle): string
    {
        return DB::transaction(function () use ($user, $bundle) {
            // Create pending purchase record
            $purchase = TokenPurchase::create([
                'user_id' => $user->id,
                'bundle_id' => $bundle->id,
                'status' => 'pending',
                'tokens_awarded' => $bundle->tokens,
            ]);

            // Stripe Checkout
            $session = $this->stripe->checkout->sessions->create([
                'customer_email' => $user->email,
                'payment_method_types' => ['us_bank_account'],
                'mode' => 'payment',
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $bundle->name,
                        ],
                        'unit_amount' => $bundle->price_cents,
                    ],
                    'quantity' => 1,
                ]],
                'metadata' => [
                    'purchase_id' => $purchase->id,
                    'user_id' => $user->id,
                ],
                'success_url' => route('waiting.payment') . '?success=1',
                'cancel_url' => route('waiting.payment') . '?canceled=1',
            ]);

            // Save intent id
            $purchase->update([
                'stripe_payment_intent_id' => $session->payment_intent ?? null,
            ]);

            return $session->url;
        });
    }

    /**
     * Handle successful payment (from Stripe webhook).
     */
    public function handleSuccessfulPurchase(TokenPurchase $purchase): void
    {
        if ($purchase->status === 'paid') {
            return; // already processed
        }

        $purchase->update(['status' => 'paid']);

        // Add tokens to ledger
        $purchase->user->tokenLedger()->create([
            'change' => $purchase->tokens_awarded,
            'reason' => 'purchase',
            'reference_type' => TokenPurchase::class,
            'reference_id' => $purchase->id,
            'balance_after' => $purchase->user->tokenLedger()->sum('change') + $purchase->tokens_awarded,
        ]);
    }


    /**
     * Handle Stripe webhook for token purchases.
     */
    public function handleWebhook($request)
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

            if ($event->type === 'checkout.session.completed') {
                $session = $event->data->object;

                $userId = $session->metadata->user_id;
                $bundleId = $session->metadata->bundle_id;

                $bundle = TokenBundle::find($bundleId);

                if ($bundle) {
                    $user = User::find($userId);
                    $user->tokens += $bundle->amount;
                    $user->save();
                }
            }
        } catch (\Exception $e) {
            Log::error('Stripe webhook failed: ' . $e->getMessage());
            return response()->json(['error' => 'Webhook failed'], 400);
        }
    }
    

    public function createCheckout(User $user, TokenBundle $bundle)
    {
        return $this->stripe->checkout->sessions->create([
            'payment_method_types' => ['us_bank_account'], // ACH only
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => $bundle->price * 100,
                    'product_data' => [
                        'name' => $bundle->name . " Tokens",
                    ],
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'customer' => $user->stripe_id,
            'success_url' => route('waiting.payment') ,
            'cancel_url'  => route('waiting.payment') ,
            'metadata' => [
                'user_id' => $user->id,
                'bundle_id' => $bundle->id,
                'payment_for' => 'payment',
            ],
        ])->url; // return URL for redirect
    }


    public function spend(User $user, int $tokenRequired, string $action, Auction $auction)
    {
        DB::transaction(function() use($user, $tokenRequired, $action, $auction){

            if($action == 'participation') {
                $user->decrement('token_balance', $tokenRequired);
    
                $user->tokenLedger()->create([
                    'change' => -$tokenRequired,
                    'balance' => $user->token_balance,
                    'reason' => "User participated in auction {$auction->id}."
                ]);
    
                $user->participatingAuctions()->create([
                    'auction_id' => $auction->id
                ]);
            }
        });
    }
}
