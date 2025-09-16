<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/stripe/webhook', [\App\Http\Controllers\StripeWebhookController::class, 'handle'])
    ->name('stripe.webhook');
