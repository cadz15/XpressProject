<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\AuctionTokenSetting;
use App\Services\TokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuctionParticipationController extends Controller
{
    

    public function store(Request $request, Auction $auction, TokenService $tokens)
    {
        $user = $request->user();

        // Auction must be live to join participation (business rule)
        if ($auction->status !== 'live') {
            return back()->withErrors('Auction is not live.');
        }

        // If already joined, short-circuit
        if ($auction->participants()->where('user_id', $user->id)->exists()) {
            return back()->with('info', 'You have already joined this auction.');
        }

        $auctionTokenSetting = AuctionTokenSetting::where('action_type', 'participation')->first();
        $cost = 1;

        if($auctionTokenSetting) {
            $cost = (int) $auctionTokenSetting->amount;
        }

        DB::transaction(function () use ($user, $auction, $tokens, $cost) {
            // Spend tokens (will throw if insufficient)
            $tokens->spend($user, $cost, 'participation', $auction);
        });

        return back()->with('success', 'Participation fee paid. You can now place bids.');
    }
}
