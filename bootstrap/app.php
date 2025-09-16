<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'active.subscriber' => \App\Http\Middleware\EnsureActiveSubscription::class,
            'tokens' => \App\Http\Middleware\EnsureSufficientTokens::class,
            'ownerOrAdmin' => \App\Http\Middleware\EnsureOwnerOrAdmin::class,
            'tokenRequired.creation' =>\App\Http\Middleware\EnsureEnoughCreationToken::class,
            'tokenRequired.participation' =>\App\Http\Middleware\EnsureEnoughParticipationToken::class,
            'admin' => \App\Http\Middleware\EnsureAdmin::class, // add EnsureAdmin (see below)
        ]);
        //
    })
    ->withBroadcasting(
        __DIR__.'/../routes/channels.php',
        ['middleware' => ['web', 'auth']]
    )
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
