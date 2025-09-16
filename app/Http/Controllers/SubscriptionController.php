<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\SubscriptionService;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    protected $service;

    public function __construct(SubscriptionService $service)
    {
        $this->service = $service;
    }

    /**
     * Show all available subscription plans.
     */
    public function index(Request $request)
    {
        $plans = SubscriptionPlan::where('is_active', true)->get();
        $activeSubscription = $request->user()->activeSubscription();
        
        return inertia('Subscription/Index', [
            'plans' => $plans,
            'user' => $request->user()->only('id'),
            'activeSubscription' => $activeSubscription
        ]);
    }
    /**
     * Start a subscription for the logged-in user.
     */
    public function start(Request $request, $planId)
    {
        $plan = SubscriptionPlan::findOrFail($planId);

        try {
            $subscription = $this->service->startCheckout($request->user(), $plan);

            return redirect()
                ->route('subscriptions.index')
                ->with('success', 'Subscription started successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Cancel the current subscription.
     */
    public function cancel(Request $request)
    {
        try {
            $this->service->cancelSubscription($request->user());

            return response()->json([
                'url' => route('subscriptions.index')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e
            ]);
        }
    }


    public function checkout(Request $request)
    {
        $planId = $request->input('plan_id');
        $plan = SubscriptionPlan::findOrFail($planId);

        $checkoutUrl = $this->service->startCheckout($request->user(), $plan);

        return response()->json([
            'url' => $checkoutUrl
        ]);
    }
}
