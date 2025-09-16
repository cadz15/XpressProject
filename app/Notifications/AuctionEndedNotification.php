<?php

namespace App\Notifications;

use App\Models\Auction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AuctionEndedNotification extends Notification implements ShouldQueue
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
            ->subject('Your auction has ended')
            ->greeting('Hello ' . $notifiable->name)
            ->line('Your auction "' . $this->auction->title . '" has ended.')
            ->action('View Auction', url('/auctions/' . $this->auction->id))
            ->line('The winning bidder has been notified.');
    }

    public function toArray($notifiable)
    {
        return [
            'auction_id' => $this->auction->id,
            'message' => 'Your auction "' . $this->auction->title . '" has ended.',
        ];
    }
}
