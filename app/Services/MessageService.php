<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;

class MessageService
{
    /**
     * Send a message in auction chat.
     */
    public function sendMessage(User $user, Auction $auction, string $content): Message
    {
        $message = Message::create([
            'auction_id' => $auction->id,
            'user_id'    => $user->id,
            'content'    => $content,
        ]);

        // Dispatch real-time event via Pusher
        event(new MessageSent($message));

        return $message;
    }
}
