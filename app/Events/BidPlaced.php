<?php

namespace App\Events;

use App\Models\Bid;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class BidPlaced implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public $bid;

    public function __construct(Bid $bid)
    {
        $this->bid = $bid->load(['user:id,name']);
    }

    public function broadcastOn()
    {
        return new PrivateChannel('auction.' . $this->bid->auction_id);
    }

    public function broadcastAs()
    {
        return 'bid.placed';
    }
}
