<?php

namespace App\Notifications;

use App\Models\Auction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AuctionWonNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $auction;

    public function __construct(Auction $auction)
    {
        $this->auction = $auction;
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // both email + in-app
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Congratulations! You won an auction')
            ->greeting('Hello ' . $notifiable->name)
            ->line('You have won the auction: ' . $this->auction->title)
            ->action('View Auction', url('/auctions/' . $this->auction->id))
            ->line('Please contact the seller to finalize your deal.');
    }

    public function toArray($notifiable)
    {
        return [
            'auction_id' => $this->auction->id,
            'message' => 'You won the auction: ' . $this->auction->title,
        ];
    }
}
