<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Allow only users with role 'admin'
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('api')->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Forbidden. Admins only.'], 403);
        }
        return $next($request);
    }
}
