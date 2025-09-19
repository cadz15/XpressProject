<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    use AuthorizesRequests;
    
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
        $this->authorize('chat', $auction);

        $conversation = Conversation::where('auction_id', $auction->id)->with('seller', 'buyer', 'messages')->first();
        
        if(!$conversation) return abort(404);

        return inertia('Conversations/Show', [
            'auction'  => $auction,
            'conversation' => $conversation,
            'user' => Auth::user()
        ]);
    }

    /**
     * Send a new message in the chat.
     */
    public function store(Request $request, Conversation $conversation)
    {
        $auction = Auction::where('id', $conversation->auction_id)->first();
        
        $this->authorize('chat', $auction);

        $validated = $request->validate([
            'body' => 'required|string|max:1000',
        ]);
        
        $message = $this->service->sendMessage(Auth::user(), $conversation, $validated['body']);

        return back()->with('success', 'Message sent.');
    }

}
