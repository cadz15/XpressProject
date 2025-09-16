<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TokenLedger extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'change', 'reason', 'balance'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
