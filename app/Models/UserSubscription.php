<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserSubscription extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id','subscription_plan_id','stripe_subscription_id','starts_at','ends_at','active'];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'active' => 'boolean',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function plan() {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }
}
