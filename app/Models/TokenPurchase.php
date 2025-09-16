<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TokenPurchase extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'token_bundle_id', 'stripe_payment_id', 'tokens', 'amount', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function bundle() {
        return $this->belongsTo(TokenBundle::class, 'token_bundle_id');
    }
}
