<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureActiveSubscription
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        
        if (! $user || (! $user->activeSubscription() && !$user->is_admin)) {
            return redirect()->route('subscription.index')
                ->withErrors('You must have an active subscription.');
        }
        return $next($request);
    }
}
