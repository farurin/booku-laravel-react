<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     * Menerima parameter tambahan berupa role yang diizinkan (dipisah koma)
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        // 1. Pastikan user sudah login
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // 2. Jika tidak ada parameter role yang dikirim, asumsikan rute ini butuh minimal role 'editor'
        if (empty($roles)) {
            $roles = ['super_admin', 'admin', 'editor'];
        }

        // 3. Cek apakah role user saat ini ada di dalam daftar role yang diizinkan
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk tindakan ini.'
            ], 403);
        }

        return $next($request);
    }
}
