<?php

namespace App\Policies;

use App\Models\Auction;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuctionPolicy
{
    /**
     * Only the seller or an admin can update/force end.
     */
    public function update(User $user, Auction $auction): bool
    {
        return $user->id === $auction->user_id || $user->is_admin;
    }

    /**
     * Anyone with subscription can bid (extra checks in middleware).
     */
    public function bid(User $user, Auction $auction): bool
    {
        return $auction->status === 'live' && $user->isSubscribed();
    }

    public function chat(User $user, Auction $auction): bool
    {
        if(!$auction->winner_id) return false;
        
        return $auction->user_id == $user->id || $auction->winner_id == $user->id;
    }
}
