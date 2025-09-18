<?php

namespace App\Jobs;

use App\Models\Auction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class StartAuctionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    
     protected $auctionId;
     

    /**
     * Create a new job instance.
     */
     public function __construct(int $auctionId)
    {
        $this->auctionId = $auctionId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $auction = Auction::find($this->auctionId);
            //code...
    
            $auction->update(([
                'status' => 'live'
            ]));
    
            Log::info("Updated auction {$auction->id} with status {$auction->status}.");
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('Job error');
        }
    }
}
