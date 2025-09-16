<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureOwnerOrAdmin
{
    public function handle(Request $request, Closure $next, $modelClass, $idParam = 'id')
    {
        $user = $request->user();
        $model = $modelClass::findOrFail($request->route($idParam));

        if ($user->id !== $model->seller_id && !$user->is_admin) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
