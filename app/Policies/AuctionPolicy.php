<?php

namespace App\Policies;

use App\Models\Auction;
use App\Models\User;

class AuctionPolicy
{
    /**
     * Only the seller or an admin can update/force end.
     */
    public function update(User $user, Auction $auction): bool
    {
        return $user->id === $auction->seller_id || $user->is_admin;
    }

    /**
     * Anyone with subscription can bid (extra checks in middleware).
     */
    public function bid(User $user, Auction $auction): bool
    {
        return $auction->status === 'live' && $user->subscribed();
    }
}
