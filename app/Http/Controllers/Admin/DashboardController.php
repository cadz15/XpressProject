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
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $metrics = [
            'total_users' => User::count(),
            'active_subscriptions' => SubscriptionPlan::where('is_active', true)->count(),
            'total_revenue' => TokenPurchase::where('status', 'purchase')->sum('amount'),
            'active_auctions' => Auction::where('status', 'active')->count(),
            'total_bids' => Bid::count(),
        ];

        return inertia('Admin/Dashboard/Index', [
            'metrics' => $metrics,
        ]);
    }
}
