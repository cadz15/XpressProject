<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bid extends Model
{
    use SoftDeletes;

    protected $fillable = ['auction_id','user_id','amount','is_highest'];

    public function auction() {
        return $this->belongsTo(Auction::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
