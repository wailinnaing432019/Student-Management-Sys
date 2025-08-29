<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class LogoutOnSessionExpired
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if ($request->expectsJson() && $request->session()->isStarted() === false) {
            Auth::logout();
            return redirect()->route('login')->with('session_expired', 'Your session has expired. Please login again.');
        }

        return $next($request);
    }
}
