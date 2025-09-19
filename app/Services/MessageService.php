<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use App\Models\Conversation;

class MessageService
{
    /**
     * Send a message in auction chat.
     */
    public function sendMessage(User $user, Conversation $conversation, string $content): Message
    {
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id'    => $user->id,
            'content'    => $content,
        ]);

        // Dispatch real-time event via Pusher
        event(new MessageSent($message, $conversation));

        return $message;
    }
}
