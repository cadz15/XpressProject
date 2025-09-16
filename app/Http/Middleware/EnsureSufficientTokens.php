<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSufficientTokens
{
    public function handle(Request $request, Closure $next, $tokensRequired = 1)
    {
        $user = $request->user();
        if (! $user || $user->tokens < (int)$tokensRequired) {
            return redirect()->route('tokens.index')
                ->withErrors("You need at least {$tokensRequired} tokens.");
        }
        return $next($request);
    }
}
