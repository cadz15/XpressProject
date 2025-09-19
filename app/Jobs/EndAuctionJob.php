<?php

namespace App\Jobs;

use App\Models\Auction;
use App\Events\AuctionEnded;
use App\Models\Bid;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class EndAuctionJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels, Dispatchable;

    protected $auctionId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $auction)
    {
        $this->auctionId = $auction;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Reload fresh auction data
        $auction = Auction::find($this->auctionId);
        Log::info("Auction Id {$auction->id} update to ended.");

        if (!$auction || $auction->status == 'ended') {
            return; // already ended
        }

        try {
            $winner = Bid::where('auction_id', $this->auctionId)->latest('amount')->oldest('created_at')->first();
            
            $auction->update([
                'status' => 'ended',
                'winner_id' => $winner->user_id ?? null
            ]);
            
            Log::info('has winner', ['winer'=> $winner]);
            if($winner) {
                Log::info('has winner', ['winer'=> $winner]);
                // create a chat conversation
                $auction->conversations()->create([
                    'seller_id' => $auction->user_id,
                    'buyer_id' =>  $winner->user_id,
                ]);
            }

        } catch (\Throwable $th) {
            Log::error('Error here', ['errror' => $th->getMessage()]);
        }


        // // Broadcast event
        broadcast(new AuctionEnded($auction));

        // // Notify seller and winner if exists
        $seller = $auction->user_id;

        // $winner->notify(new \App\Notifications\AuctionWonNotification($auction));
        // $seller->notify(new \App\Notifications\AuctionEndedNotification($auction));
    }
}
