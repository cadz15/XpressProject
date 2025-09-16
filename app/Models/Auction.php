<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Auction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id','category_id','title','description',
        'starting_price','current_price','bid_increment_pct',
        'start_time','end_time','status','winner_id'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
    ];

    public function seller() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function winner() {
        return $this->belongsTo(User::class, 'winner_id');
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function bids() {
        return $this->hasMany(Bid::class);
    }

    public function images() {
        return $this->hasMany(AuctionImage::class);
    }

    public function conversations() {
        return $this->hasOne(Conversation::class);
    }

    public function participants()
    {
        return $this->hasMany(UserParticipatedAuction::class);
    }
}
