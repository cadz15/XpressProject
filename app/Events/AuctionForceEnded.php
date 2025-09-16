<?php

namespace App\Events;

use App\Models\Auction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class AuctionForceEnded implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $auction;

    public function __construct(Auction $auction)
    {
        $this->auction = $auction;
    }

    public function broadcastOn()
    {
        return new Channel('auction.' . $this->auction->id);
    }

    public function broadcastAs()
    {
        return 'auction.forceEnded';
    }
}
