<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TokenBundle;
use App\Services\TokenService;

class TokenController extends Controller
{
    protected $service;

    public function __construct(TokenService $service)
    {
        $this->service = $service;
    }

    /**
     * Show available token bundles (active only).
     */
    public function index()
    {
        $bundles = TokenBundle::get();

        return inertia('Tokens/Index', [
            'bundles' => $bundles
        ]);
    }

    /**
     * Start a token checkout session.
     */
    public function checkout(Request $request, $bundleId)
    {
        $bundle = TokenBundle::findOrFail($bundleId);

        try {
            $checkoutUrl = $this->service->createCheckout($request->user(), $bundle);
            
            return response()->json([
                'url' => $checkoutUrl
            ]);
        } catch (\Exception $e) {
            return response()->json([
            'url' => '',
            'message' => 'Unable to checkout. Please try again.',
            'error' => env('STRIPE_SECRET_KEY')
        ]);
        }
    }

    /**
     * (Optional) Show user token history and balance.
     */
    public function history(Request $request)
    {
        $ledger = $request->user()->tokenLedger()->latest()->paginate(20);

        return inertia('Tokens/History', [
            'ledger'  => $ledger,
            'balance' => $request->user()->token_balance ?? 0,
        ]);
    }

    /**
     * Stripe webhook to confirm purchases.
     */
    public function webhook(Request $request)
    {
        $this->service->handleWebhook($request);

        return response()->json(['status' => 'ok']);
    }
}
