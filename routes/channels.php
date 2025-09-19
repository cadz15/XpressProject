<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Auction;
use App\Models\Conversation;
use Illuminate\Support\Facades\Log;


Broadcast::channel('notification', function ($user) {
    return true; // Allow only authenticated users
});

/*
 * Private channel for auction events (bids, ended)
 * Name: private-auction.{auctionId}
 */
Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    $conversation = \App\Models\Conversation::find($conversationId);

    if (!$conversation) {
        Log::warning("Conversation ID {$conversationId} not found for user ID {$user->id}");
        return false;
    }
   
    if($user->id == $conversation->seller_id || $user->id == $conversation->buyer_id) {
        return true;
    }

    return false;
});

Broadcast::channel('auction.{auctionId}', function ($user, $auctionId) {
    Log::info("Authorizing user ID {$user->id} for auction ID {$auctionId}");

    $auction = \App\Models\Auction::find($auctionId);

    if (!$auction) {
        Log::warning("Auction ID {$auctionId} not found for user ID {$user->id}");
        return false;
    }

    if ($user->is_admin) {
        Log::info("User ID {$user->id} is admin — authorized");
        return true;
    }

    if ($auction->user_id == $user->id) {
        Log::info("User ID {$user->id} is seller — authorized");
        return true;
    }

    $isParticipant = $auction->participants()->where('user_id', $user->id)->exists();

    Log::info("User ID {$user->id} participation check: " . ($isParticipant ? 'allowed' : 'denied'));

    return $isParticipant;
});

/*
 * Private channel for conversation chat
 * Name: private-conversation.{conversationId}
 */
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = \App\Models\Conversation::find($conversationId);
    if (! $conversation) return false;
    if ($user->is_admin) return true;
    return $conversation->seller_id === $user->id || $conversation->buyer_id === $user->id;
});


Broadcast::channel('payment-status.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
