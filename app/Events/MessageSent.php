<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(string $message)
    {
        // $this->message = $message->load(['user:id,name']);
        $this->message = $message;
    }

    public function broadcastOn()
    {
        // return new PrivateChannel('conversation.' . $this->message->conversation_id);
        return new PrivateChannel('chat');
    }

}
