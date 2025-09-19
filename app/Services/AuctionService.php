<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\User;
use App\Events\AuctionEnded;
use App\Jobs\EndAuctionJob;
use App\Jobs\StartAuctionJob;
use App\Models\AuctionTokenSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AuctionService
{
    /**
     * Create a new auction.
     */
    public function createAuction(User $seller, array $data): Auction
    {
        $auctionToken = AuctionTokenSetting::where('action_type', 'creation')->first();
        $tokenRequired = 1;
        if($auctionToken) {
            $tokenRequired = (int)$auctionToken->amount;
        }

        return DB::transaction(function () use ($seller, $data, $tokenRequired) {
            $startTime = Carbon::parse($data['start_time']);
            $endTime = Carbon::parse($data['end_time']);

            $seller->decrement('token_balance', $tokenRequired);
            $seller->tokenLedger()->create([
                'change' => -$tokenRequired,
                'balance' => $seller->token_balance,
                'reason' => 'Created an auction.'
            ]);

            $status = 'ended';
            if($startTime > now() && now() < $endTime) {
                $status = 'pending';
            }else if($startTime <= now() && now() < $endTime) {
                $status = 'live';
            }
            
            $auction = $seller->auctions()->create([
                'seller_id'   => $seller->id,
                'category_id' => $data['category_id'],
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'starting_price' => $data['starting_price'],
                'current_price' => $data['starting_price'],
                'bid_increment_pct' => 5.00, // default
                'start_time' => $startTime,
                'end_time' => $endTime,
                'status' => $status,
            ]);

            // Handle images if present in $data
            if (!empty($data['images']) && is_array($data['images'])) {
                foreach ($data['images'] as $image) {
                    // If $image is an instance of UploadedFile (from controller), store it
                    if ($image instanceof \Illuminate\Http\UploadedFile) {
                        $filename = 'auction_image_' . time() . '.' . $image->getClientOriginalExtension();

                        $path = $image->storeAs('auctions/' . $auction->id, $filename, 'public');

                        // Save path in auction_images table
                        $auction->images()->create([
                            'path' => $path,
                        ]);
                    }
                }
            }

            StartAuctionJob::dispatch($auction->id)->delay($auction->start_time);
            EndAuctionJob::dispatch($auction->id)->delay($auction->end_time);

            return $auction;
        });

    }

    /**
     * Force end an auction early.
     */
    public function forceEnd(Auction $auction): void
    {
        DB::transaction(function () use ($auction) {
            if ($auction->status !== 'live') {
                return;
            }
            
            $auction->end_time = Carbon::now();
            $auction->save();

            // fire event for notifications / jobs
            event(new AuctionEnded($auction));            
            EndAuctionJob::dispatch($auction->id);
        });
    }

    /**
     * Called by scheduler or job when time expires.
     */
    public function autoEnd(Auction $auction): void
    {
        try {
            if ($auction->status === 'live' && Carbon::now()->gte($auction->end_time)) {
                $this->forceEnd($auction);
            }
        } catch (\Throwable $e) {
            Log::error('Failed to auto end auction: ' . $e->getMessage());
        }
    }

    public function updateAuction(Auction $auction, array $data)
    {
        $auction->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'starting_price' => $data['starting_price'],
            'ends_at' => $data['ends_at'],
            'category_id' => $data['category_id'],
        ]);

        return $auction;
    }
}
