<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ActivityService
{
    public static function recordUserActivity($userId)
    {
        try {
            // 1. Dapatkan waktu lokal (WIB)
            $now = Carbon::now('Asia/Jakarta');
            $todayStr = $now->format('Y-m-d');

            // 2. Masukkan ke log aktivitas (Gunakan insertOrIgnore bawaan Laravel)
            DB::table('user_activity_logs')->insertOrIgnore([
                'id_user' => $userId,
                'activity_date' => $todayStr
            ]);

            // 3. Ambil data user
            $user = DB::table('users')->where('id', $userId)->first(['current_streak', 'last_active_date']);
            
            if (!$user) return;

            // 4. Format last_active_date
            $lastDateStr = $user->last_active_date ? Carbon::parse($user->last_active_date)->format('Y-m-d') : null;
            $newStreak = $user->current_streak ?? 0;

            // Jika sudah tercatat hari ini, hentikan proses
            if ($lastDateStr === $todayStr) return;

            // 5. Hitung Streak Baru (Cek apakah kemarin dia aktif)
            $yesterdayStr = $now->copy()->subDay()->format('Y-m-d');

            if ($lastDateStr === $yesterdayStr) {
                $newStreak += 1; // Lanjut streak
            } else {
                $newStreak = 1; // Reset streak
            }

            // 6. Simpan Streak Baru ke Database
            DB::table('users')->where('id', $userId)->update([
                'current_streak' => $newStreak,
                'last_active_date' => $todayStr
            ]);

        } catch (\Exception $e) {
            Log::error("Gagal update aktivitas dan streak harian: " . $e->getMessage());
        }
    }
}