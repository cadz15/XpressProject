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

        if (!$auction || $auction->status == 'ended') {
            return; // already ended
        }
        $winner = optional($auction->bids->orderByDesc('amount')->orderBy('created_at')->first())->user;

        $auction->status = 'ended';
        $auction->winner_id = $winner->id;
        $auction->save();

        // Broadcast event
        broadcast(new AuctionEnded($auction));

        // Notify seller and winner if exists
        $seller = $auction->seller;


        $winner->notify(new \App\Notifications\AuctionWonNotification($auction));
        $seller->notify(new \App\Notifications\AuctionEndedNotification($auction));
    }
}
