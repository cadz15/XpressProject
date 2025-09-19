<?php

use App\Events\MessageSent;
use App\Events\StripePayment;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\AuctionParticipationController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TokenBundleController;
use App\Http\Controllers\Admin\SubscriptionPlanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use App\Jobs\EndAuctionJob;
use App\Models\Auction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Pusher\Pusher;

Route::middleware(['auth', 'active.subscriber'])->group(function () {

    Route::get('/', function() {
        return redirect()->intended(Auth::user()->is_admin ? route('admin.dashboard') : route('auctions.index'));
    })->name('dashboard');

    // Auctions (list + detail + create)
    Route::get('/my-auctions', [AuctionController::class, 'myAuction'])->name('my.auctions');

    Route::get('/auctions', [AuctionController::class, 'index'])->name('auctions.index');
    Route::get('/auctions/new', [AuctionController::class, 'create'])->name('auctions.create');
    Route::get('/auctions/{auction}', [AuctionController::class, 'show'])->name('auctions.show');
    Route::get('/auctions/{auction}/edit', [AuctionController::class, 'edit'])
        ->name('auctions.edit');
    Route::put('/auctions/{auction}', [AuctionController::class, 'update'])
        ->name('auctions.update');

    Route::post('/auctions', [AuctionController::class, 'store'])
        ->name('auctions.store')
        ->middleware('tokenRequired.creation');

    Route::post('/auctions/{auction}/force-end', [AuctionController::class, 'forceEnd'])
        ->name('auctions.forceEnd');

    // Participation (requires token payment)
    Route::post('/auctions/{auction}/participate', [AuctionParticipationController::class, 'store'])
        ->name('auctions.participate')
        ->middleware('tokenRequired.participation');

    // Bidding
    Route::post('/auctions/{auction}/bids', [BidController::class, 'store'])->middleware('tokenRequired.participation')->name('bids.store');
    Route::get('/auctions/{auction}/bids', [BidController::class, 'index'])->name('bids.index');

    // Chat (winner ↔ seller)
    Route::get('/auctions/{auction}/chat', [ChatController::class, 'show'])->name('chat.show');
    Route::post('/auctions/{conversation}/chat', [ChatController::class, 'store'])->name('chat.store');

    // Tokens
    Route::get('/tokens', [TokenController::class, 'index'])->name('tokens.index');
    Route::post('/tokens/checkout/{bundle}', [TokenController::class, 'checkout'])->name('tokens.checkout');
    Route::get('/tokens/history', [TokenController::class, 'history'])->name('tokens.history');

    // Subscriptions
    Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::post('/subscriptions/{plan}/start', [SubscriptionController::class, 'start'])->name('subscriptions.start');
    Route::post('/subscriptions/cancel', [SubscriptionController::class, 'cancel'])->name('subscriptions.cancel');

    // Profiles (subscribers only)
    Route::get('/profiles/{username}', [ProfileController::class, 'show'])->name('profiles.show');

});

Route::middleware(['auth'])->group(function () {
    Route::get('/waiting-for-payment', function() {
        return Inertia::render('WaitingForPayment', [
            'user' => Auth::user()
        ]);
    })->name('waiting.payment');

    Route::get('/test-notification', function() {
        $auction = Auction::first();
            EndAuctionJob::dispatch($auction->id);
        // event(new \App\Events\TestNotification('This is testing data'));
    });

    // Route::get('/test-notification', function() {
    //     $user = Auth::user();
    //     event(new StripePayment($user, 1111, 'payment', 'failed', 'Payment Failed'));
    // });

    Route::get('/file/{id}', [AuctionController::class, 'getFile'])->name('get.file');
    Route::get('/subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::post('/subscription/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('categories', CategoryController::class);
    Route::resource('token-bundles', TokenBundleController::class);
    Route::resource('subscription-plans', SubscriptionPlanController::class);

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/{user}', [UserController::class, 'show'])->name('show');
        Route::patch('/{user}/toggle-admin', [UserController::class, 'toggleAdmin'])->name('toggleAdmin');
        Route::patch('/{user}/toggle-ban', [UserController::class, 'toggleBan'])->name('toggleBan');
    });

});

require __DIR__.'/auth.php';
