<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\AuctionImage;
use App\Models\AuctionTokenSetting;
use App\Models\Category;
use App\Models\User;
use App\Models\UserParticipatedAuction;
use App\Services\AuctionService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class AuctionController extends Controller
{
    
    use AuthorizesRequests;

    protected $service;

    public function __construct(AuctionService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of live auctions with filters.
     */
    public function index(Request $request)
    {
        $query = Auction::with('seller.profile', 'category', 'images')
            ->withCount('participants');

        if ($request->filled('status')) {
            if($request->input('status') != "all") {
                $query->where('status', $request->input('status'));
            }
        }

        if ($request->filled('category') && $request->input('category') != 'all') {
            $category = Category::where('name', $request->input('category'))->first();
            //get all childs category
            $categoryIds = $category->children()->pluck('id');

            if($category) $query->whereIn('category_id', array_merge([$category->id], $categoryIds->toArray()));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }

        $auctions = $query->latest('end_time')->paginate(20);

        return inertia('Auctions/Index', [
            'auctions' => $auctions,
            'filters' => $request->only(['category', 'search', 'status']),
            'categories' => Category::all(),
        ]);
    }

    /**
     * Show the form for creating a new auction.
     */
    public function create()
    {
        $auctionSetting = AuctionTokenSetting::where('action_type', 'creation')->first();
        $tokenRequired = 1; // for default

        if($auctionSetting) {
            $tokenRequired = $auctionSetting->amount;
        }

        return inertia('Auctions/Create', [
            'categories' => Category::all(),
            'tokenRequired' => $tokenRequired
        ]);
    }

    /**
     * Store a newly created auction.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'starting_price' => 'required|numeric|min:1',
            'start_time' => [
                'required',
                'date',
                'date_format:Y-m-d\TH:i', // Format for datetime-local input
              
            ],
            'end_time' => [
                'required',
                'date',
                'date_format:Y-m-d\TH:i',
                'after:start_time', // End time must be after start time
            ],
            'category_id' => 'required|exists:categories,id',
            'images' => 'required|array', 
            'images.*' => 'image|max:2048',
        ]);

        $auction = $this->service->createAuction(Auth::user(), $request->all());

        return redirect()->route('auctions.show', $auction->id)
            ->with('success', 'Auction created successfully.');
    }

    /**
     * Display a specific auction.
     */
    public function show(Auction $auction)
    {
        $auction->load('seller.profile', 'category', 'images');
        $isParticipant = UserParticipatedAuction::where('auction_id', $auction->id)->first();
        $isOwner = $auction->user_id == Auth::user()->id;

        return inertia('Auctions/Show', [
            'auction' => $auction,
            'isParticipant' => $isParticipant,
            'isOwner' => $isOwner
        ]);
    }

    /**
     * Force end an auction early (seller or admin only).
     */
    public function forceEnd(Auction $auction)
    {
        $this->authorize('update', $auction);

        $this->service->forceEnd($auction);

        return redirect()->route('auctions.show', $auction->id)
            ->with('success', 'Auction was force-ended.');
    }

     /**
     * Show the edit form.
     */
    public function edit(Auction $auction)
    {
        $this->authorize('update', $auction);

        if ($auction->status === 'live') {
            return redirect()
                ->route('auctions.show', $auction->id)
                ->withErrors(['error' => 'Live auctions cannot be edited.']);
        }

        $categories = Category::all();

        return inertia('Auctions/Edit', [
            'auction' => $auction,
            'categories' => $categories,
        ]);
    }


    public function update(Request $request, Auction $auction)
    {
        $this->authorize('update', $auction);

        if ($auction->status === 'live') {
            return back()->withErrors(['error' => 'Ongoing auctions cannot be edited.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'starting_price' => 'required|numeric|min:1',
            'ends_at' => 'required|date|after:now',
            'category_id' => 'required|exists:categories,id',
        ]);

        $this->service->updateAuction($auction, $validated);

        return redirect()->route('auctions.show', $auction)->with('success', 'Auction updated.');
    }

    public function destroy(Auction $auction)
    {
        $this->authorize('update', $auction);
        
        if ($auction->status === 'live') {
            return back()->withErrors(['error' => 'Ongoing auctions cannot be deleted.']);
        }

        $auction->delete();

        return redirect()->route('auctions.index')->with('success', 'Auction deleted.');
    }


    public function getFile($id) {
        $image = AuctionImage::where('id', $id)->first();

        if(!$image) return abort(404);
        
        if(!$image->path) return abort(404);
        
        $path = storage_path('app/public/'.$image->path);
        
        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }

    public function myAuction()
    {
        $userId = Auth::user()->id;
        $auctions = Auction::where('user_id', $userId)->with('images', 'winner')->withCount('participants')->paginate(15);
        $participatedAuctions = UserParticipatedAuction::where('user_id', $userId)->with( 'auction', 'auction.images')->paginate(15);

        return Inertia::render('Auctions/MyAuctions', [
            'auctions' => $auctions,
            'participatedAuctions' => $participatedAuctions
        ]);
    }
}
