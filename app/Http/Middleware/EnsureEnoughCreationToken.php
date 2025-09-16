<?php

namespace App\Http\Middleware;

use App\Models\AuctionTokenSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEnoughCreationToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $tokensRequired = 1;
        $auctionTokenSetting = AuctionTokenSetting::where('action_type', 'creation')->first();

        if($auctionTokenSetting) {
            $tokensRequired = $auctionTokenSetting->amount;
        }

        if (! $user || $user->token_balance < (int)$tokensRequired) {
            
            return redirect()->route('auctions.create')
                ->withErrors("You need at least {$tokensRequired} tokens.");
        }
        return $next($request);
    }
}
