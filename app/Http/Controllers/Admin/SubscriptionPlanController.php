<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;

class SubscriptionPlanController extends Controller
{
    public function index()
    {
        $plans = SubscriptionPlan::paginate(20);

        return inertia('Admin/SubscriptionPlans/Index', [
            'plans' => $plans
        ]);
    }

    public function create()
    {
        return inertia('Admin/SubscriptionPlans/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|string|max:255',
            'period' => 'required|in:monthly,yearly',
            'is_active' => 'boolean',
            'features' => 'nullable|json'
        ]);

        SubscriptionPlan::create($data);

        return redirect()->route('admin.subscription-plans.index')
            ->with('success', 'Subscription plan created successfully.');
    }

    public function edit(SubscriptionPlan $subscriptionPlan)
    {
        return inertia('Admin/SubscriptionPlans/Edit', [
            'plan' => $subscriptionPlan
        ]);
    }

    public function update(Request $request, SubscriptionPlan $subscriptionPlan)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|string|max:255',
            'period' => 'required|in:monthly,yearly',
            'is_active' => 'boolean',
            'features' => 'nullable|json'
        ]);

        $subscriptionPlan->update($data);

        return redirect()->route('admin.subscription-plans.index')
            ->with('success', 'Subscription plan updated successfully.');
    }

    public function destroy(SubscriptionPlan $subscriptionPlan)
    {
        $subscriptionPlan->delete();

        return back()->with('success', 'Subscription plan deleted successfully.');
    }
}
