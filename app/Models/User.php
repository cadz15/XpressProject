<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Billable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


      // Relationships
    public function profile() {
        return $this->hasOne(Profile::class);
    }

    public function auctions() {
        return $this->hasMany(Auction::class);
    }

    public function bids() {
        return $this->hasMany(Bid::class);
    }

    public function tokenPurchases() {
        return $this->hasMany(TokenPurchase::class);
    }

    public function tokenLedger() {
        return $this->hasMany(TokenLedger::class);
    }

    public function watchlists() {
        return $this->hasMany(Watchlist::class);
    }

    public function subscriptions() {
        return $this->hasMany(UserSubscription::class);
    }

    public function conversations() {
        return $this->hasMany(Conversation::class, 'seller_id')
            ->orWhere('buyer_id', $this->id);
    }


    public function tokenBalance(): int
    {
        return (int) $this->tokenLedger()->sum('change');
    }


    public function participatingAuctions()
    {
        return $this->hasMany(UserParticipatedAuction::class);
    }

   public function activeSubscription()
    {
        return $this->subscriptions()
                    ->where('active', true)
                    ->where(function ($q) {
                        $q->whereNull('ends_at')
                        ->orWhere('ends_at', '>', now());
                    })
                    ->first();
    }

    public function isSubscribed(): bool
    {
        return $this->activeSubscription() !== null;
    }


}
