<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubscriptionPlan extends Model
{
    use SoftDeletes;

    protected $fillable = ['name','price','interval'];

    public function userSubscriptions() {
        return $this->hasMany(UserSubscription::class);
    }
}
