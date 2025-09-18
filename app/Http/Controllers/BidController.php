<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Services\BidService;

class BidController extends Controller
{
    protected $service;

    public function __construct(BidService $service)
    {
        $this->service = $service;

        // Require auth + active subscription
        $this->middleware(['auth', 'active.subscriber']);
    }

    /**
     * Show all bids for an auction (for history/log).
     */
    public function index(Auction $auction)
    {
        $this->authorize('view', $auction);

        $bids = $this->service->getBidsForAuction($auction);

        return inertia('Bids/Index', [
            'auction' => $auction,
            'bids' => $bids
        ]);
    }

    /**
     * Place a bid on an auction.
     */
    public function store(Request $request, Auction $auction)
    {
        // $this->authorize('bid', $auction);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0'],
        ]);
        
        try {
            $bid = $this->service->placeBid(
                $request->user(),
                $auction,
                $validated['amount']
            );

            return back()->with('success', 'Bid placed successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
