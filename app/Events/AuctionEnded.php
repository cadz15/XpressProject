<?php

namespace App\Events;

use App\Models\Auction;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class AuctionEnded implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public $auction;

    public function __construct(Auction $auction)
    {
        $this->auction = $auction;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('auction.' . $this->auction->id);
    }

    public function broadcastAs()
    {
        return 'auction.ended';
    }
}
