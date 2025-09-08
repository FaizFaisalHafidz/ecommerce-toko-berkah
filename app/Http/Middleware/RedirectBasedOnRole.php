<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek jika user sudah login dan mencoba akses dashboard
        if (Auth::check() && $request->is('dashboard*')) {
            $user = Auth::user();
            
            // Jika user tidak punya role admin, redirect ke home
            if ($user && !$user->roles->contains('name', 'admin')) {
                return redirect('/');
            }
        }
        
        return $next($request);
    }
}
