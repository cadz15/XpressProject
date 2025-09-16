<?php

namespace App\Jobs;

use App\Models\Auction;
use App\Events\AuctionEnded;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EndAuctionJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    protected $auction;

    /**
     * Create a new job instance.
     */
    public function __construct(Auction $auction)
    {
        $this->auction = $auction;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Reload fresh auction data
        $auction = Auction::find($this->auction->id);

        if (!$auction || $auction->ended) {
            return; // already ended
        }

        $auction->ended = true;
        $auction->save();

        // Broadcast event
        broadcast(new AuctionEnded($auction));

        // Notify seller and winner if exists
        if ($auction->highestBid) {
            $winner = $auction->highestBid->user;
            $seller = $auction->seller;

            $winner->notify(new \App\Notifications\AuctionWonNotification($auction));
            $seller->notify(new \App\Notifications\AuctionEndedNotification($auction));
        }
    }
}
