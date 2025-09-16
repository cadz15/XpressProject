<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\User;
use App\Events\BidPlaced;
use App\Models\AuctionTokenSetting;
use Illuminate\Support\Facades\DB;

class BidService
{
    /**
     * Get all bids for a given auction.
     */
    public function getBidsForAuction(Auction $auction)
    {
        return $auction->bids()
            ->with('user:id,name') // preload minimal user info
            ->latest()
            ->get();
    }

    /**
     * Place a new bid on an auction.
     */
    public function placeBid(User $user, Auction $auction, float $amount)
    {
        return DB::transaction(function () use ($user, $auction, $amount) {
            // ✅ Ensure auction is live
            if ($auction->status !== 'live') {
                throw new \Exception('Auction is not live.');
            }

            // ✅ Ensure amount is higher than current highest
            $highestBid = $auction->bids()->max('amount');
            if ($highestBid !== null && $amount <= $highestBid) {
                throw new \Exception('Your bid must be higher than the current highest bid.');
            }

            $auction->update([
                'current_price' => $amount
            ]);
            
            // Create bid
            $bid = Bid::create([
                'user_id'    => $user->id,
                'auction_id' => $auction->id,
                'amount'     => $amount,
            ]);

            // Broadcast event
            event(new BidPlaced($bid));

            return $bid;
        });
    }
}
