<?php
namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StripePayment implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $subscriptionId;
    public $forEvent;
    public $status;
    public $message;

    public function __construct(User $user, string $subscriptionId, string $forEvent, string $status, string $message)
    {
        $this->user = $user;
        $this->subscriptionId = $subscriptionId;
        $this->forEvent = $forEvent;
        $this->status = $status;
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('payment-status.' . $this->user->id);
    }

    public function broadcastAs()
    {
        return 'payment.status.updated';
    }

    public function broadcastWith()
    {
        return [
            'subscription_id' => $this->subscriptionId,
            'status' => $this->status,         // 'success', 'failed', etc.
            'message' => $this->message,       // Custom user-facing message
            'forEvent' => $this->forEvent,
        ];
    }
}

