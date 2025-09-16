<?php

namespace App\Http\Middleware;

use App\Models\AuctionTokenSetting;
use App\Models\UserParticipatedAuction;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEnoughParticipationToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $user = $request->user();
        $auctionId = $request->route('auction');

        //check if user is already participated in auction
        $userParticipation = UserParticipatedAuction::where('user_id', $user->id)->where('auction_id', $auctionId)->first();
        if($userParticipation) return $next($request);

        $tokensRequired = 1; //default

        $auctionTokenSetting = AuctionTokenSetting::where('action_type', 'participation')->first();

        if($auctionTokenSetting) {
            $tokensRequired = $auctionTokenSetting->amount;
        }

        if (! $user || $user->token_balance < (int)$tokensRequired) {
            return redirect()->back()
                ->withErrors("You need at least {$tokensRequired} tokens.");
        }
        return $next($request);
    }
}
