<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\TokenLedger;
use App\Models\TokenPurchase;
use App\Models\UserSubscription;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request, AnalyticsService $analyticsService)
    {
        // Get the current date and calculate the start of the current period (week or month)
        $currentStartDate = now()->startOfMonth(); // or startOfWeek() depending on your preference
        $previousStartDate = now()->subMonth()->startOfMonth(); // or subWeek() for weekly

        $metrics = [
            'total_users' => $analyticsService->users($currentStartDate, $previousStartDate),
            'active_subscriptions' => $analyticsService->activeSubscriptions($currentStartDate, $previousStartDate),
            'total_revenue' => $analyticsService->revenues($currentStartDate, $previousStartDate),
            'active_auctions' => $analyticsService->activeAuctions($currentStartDate, $previousStartDate),
            'total_bids' => $analyticsService->bids($currentStartDate, $previousStartDate),
            'successful_auctions' => $analyticsService->conversions($currentStartDate, $previousStartDate),
        ];

        return inertia('Admin/Dashboard/Index', [
            'metrics' => $metrics,
        ]);
    }
}
