<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\TokenPurchase;
use App\Models\User;
use App\Models\UserSubscription;
use Carbon\Carbon;

class AnalyticsService
{
    public function conversions(Carbon $currentStartDate, Carbon $previousStartDate)
    {
         
        // Current period statistics (e.g., this month)
        $currentStats = Auction::selectRaw(
            'COUNT(*) as total_auctions,
            COUNT(CASE WHEN status = "ended" AND winner_id IS NOT NULL THEN 1 END) as successful_auctions'
        )
        ->whereBetween('end_time', [$currentStartDate, now()])
        ->first();

        // Previous period statistics (e.g., last month)
        $previousStats = Auction::selectRaw(
            'COUNT(*) as total_auctions,
            COUNT(CASE WHEN status = "ended" AND winner_id IS NOT NULL THEN 1 END) as successful_auctions'
        )
        ->whereBetween('end_time', [$previousStartDate, now()->subMonth()])
        ->first();


         // Calculate Conversion Rate for the current period
        $conversionRate = $currentStats->total_auctions > 0 
            ? ($currentStats->successful_auctions / $currentStats->total_auctions) * 100
            : 0;


        // Calculate Auction Success Rate Change (e.g., percentage increase)
        $previousConversionRate = $previousStats->total_auctions > 0 
            ? ($previousStats->successful_auctions / $previousStats->total_auctions) * 100
            : 0;

        // Calculate the percentage change between the current and previous period
        $successRateChange = 0;
        if ($previousConversionRate > 0) {
            $successRateChange = (($conversionRate - $previousConversionRate) / $previousConversionRate) * 100;
        }

        return [
                'conversion_rate' => round($conversionRate, 2), // Conversion Rate
                'success_rate_change' => round($successRateChange, 2), // Auction Success Rate Change (+ or -)
        ];
    }


    public function revenues(Carbon $currentStartDate, Carbon $previousStartDate)
    {
        // Define current and previous month periods
        $currentEnd = $currentStartDate->copy()->endOfMonth();

        $previousEnd = $previousStartDate->copy()->subMonth()->endOfMonth();

        // Current month revenue
        $currentRevenue = TokenPurchase::where('status', 'paid')
            ->whereBetween('created_at', [$currentStartDate, $currentEnd])
            ->sum('amount');

        // Last month revenue
        $lastRevenue = TokenPurchase::where('status', 'paid')
            ->whereBetween('created_at', [$previousStartDate, $previousEnd])
            ->sum('amount');

        // Revenue change (%)
        $revenueChange = $lastRevenue > 0
            ? (($currentRevenue - $lastRevenue) / $lastRevenue) * 100
            : 0;

        return [
            'revenue' => round($currentRevenue, 2),
            'revenue_change' => round($revenueChange, 2)
        ];
    }


    public function bids(Carbon $currentStartDate, Carbon $previousStartDate)
    {
        $currentEnd = $currentStartDate->copy()->endOfMonth();

        $previousEnd = $previousStartDate->copy()->subMonth()->endOfMonth();

        // Total bids this month
        $currentBids = Bid::whereBetween('created_at', [$currentStartDate, $currentEnd])->count();

        // Total bids last month
        $lastBids = Bid::whereBetween('created_at', [$previousStartDate, $previousEnd])->count();

        // % change
        $bidChange = $lastBids > 0
            ? (($currentBids - $lastBids) / $lastBids) * 100
            : 0;

        return [
            'total_bids' => $currentBids,
            'bid_change' => round($bidChange, 2)
        ];
    }

    public function activeAuctions(Carbon $currentStartDate, Carbon $previousStartDate)
    {
        // Current period statistics (e.g., this month)
        $currentLive = Auction::where('status', 'live')
        ->whereBetween('start_time', [$currentStartDate, now()])
        ->count();

        // Previous period statistics (e.g., last month)
        $previousLive = Auction::where('status', 'live')
        ->whereBetween('start_time', [$previousStartDate, now()->subMonth()])
        ->count();

        $change = $previousLive > 0
        ? (($currentLive - $previousLive) / $previousLive) * 100
        : 0;

        return [
            'live_auctions' => $currentLive,
            'live_change' => round($change, 2),
        ];
    }


    public function activeSubscriptions(Carbon $currentStartDate, Carbon $previousStartDate)
    {
        // Current period statistics (e.g., this month)
        $currentActive = UserSubscription::where('active', true)
        ->whereBetween('starts_at', [$currentStartDate, now()])
        ->count();

        // Previous period statistics (e.g., last month)
        $previousActive = UserSubscription::where('active', true)
        ->whereBetween('starts_at', [$previousStartDate, now()->subMonth()])
        ->count();

        $change = $previousActive > 0
        ? (($currentActive - $previousActive) / $previousActive) * 100
        : 0;

        return [
            'active_subscriptions' => $currentActive,
            'subscription_change' => round($change, 2),
        ];
    }

    public function users(Carbon $currentStartDate, Carbon $previousStartDate)
    {
         // Current period statistics (e.g., this month)
        $currentUser = User::where('is_admin', false)
        ->whereBetween('created_at', [$currentStartDate, now()])
        ->count();

        // Previous period statistics (e.g., last month)
        $previousUser = User::where('is_admin', false)
        ->whereBetween('created_at', [$previousStartDate, now()->subMonth()])
        ->count();

        $change = $previousUser > 0
        ? (($currentUser - $previousUser) / $previousUser) * 100
        : 0;

        return [
            'users' => $currentUser,
            'users_change' => round($change, 2),
        ];
    }
}