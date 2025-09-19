<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserParticipatedAuction extends Model
{
    use SoftDeletes;
    
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function user()
    {
        return $this->hasOne(User::class);
    }

    public function auction()
    {
        return $this->hasOne(Auction::class, 'id', 'auction_id');
    }
}
