<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    protected $service;

    public function __construct(MessageService $service)
    {
        $this->service = $service;
    }

    /**
     * Show chat thread for a specific auction (between seller & winner).
     */
    public function show(Auction $auction)
    {
        $this->authorizeChat($auction);

        $messages = $auction->messages()->with('user')->latest()->paginate(20);

        return inertia('Chat/Show', [
            'auction'  => $auction,
            'messages' => $messages,
        ]);
    }

    /**
     * Send a new message in the chat.
     */
    public function store(Request $request, Auction $auction)
    {
        $this->authorizeChat($auction);

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = $this->service->sendMessage(Auth::user(), $auction, $validated['content']);

        return back()->with('success', 'Message sent.');
    }

    /**
     * Ensure only seller and winner can chat.
     */
    protected function authorizeChat(Auction $auction)
    {
        $user = Auth::user();

        if ($auction->status !== 'ended') {
            abort(403, 'Chat is only available after auction ends.');
        }

        if (! in_array($user->id, [$auction->seller_id, $auction->highest_bidder_id])) {
            abort(403, 'You are not authorized to access this chat.');
        }
    }
}
