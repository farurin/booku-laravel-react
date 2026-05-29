<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserController extends Controller
{
    public function getCharacters(Request $request)
    {
        $userId = $request->user()->id;

        $characters = DB::table('characters as c')
            ->crossJoin('users as u')
            ->where('u.id', $userId)
            ->select(
                'c.id',
                'c.name',
                'c.image_url as image',
                DB::raw("EXISTS(SELECT 1 FROM user_characters uc WHERE uc.id_character = c.id AND uc.id_user = $userId) as isUnlocked"),
                DB::raw("(u.active_character_id = c.id) as isActive")
            )
            ->orderBy('c.id', 'asc')
            ->get()
            ->map(function ($char) {
                $char->isUnlocked = (bool) $char->isUnlocked;
                $char->isActive = (bool) $char->isActive;
                return $char;
            });

        return response()->json($characters);
    }

    public function updateActiveCharacter(Request $request)
    {
        $userId = $request->user()->id;
        $characterId = $request->characterId;

        if (!$characterId) {
            return response()->json(['message' => 'ID Karakter wajib dikirim'], 400);
        }

        $exists = DB::table('user_characters')
            ->where('id_user', $userId)
            ->where('id_character', $characterId)
            ->exists();

        if (!$exists) {
            return response()->json(['message' => 'Akses ditolak!'], 403);
        }

        DB::table('users')->where('id', $userId)->update(['active_character_id' => $characterId]);

        return response()->json(['message' => 'Karakter berhasil diubah!']);
    }

    public function getUserProfile(Request $request)
    {
        $userId = $request->user()->id;

        $user = DB::table('users')
            ->where('id', $userId)
            ->select('username', 'email', 'age', 'avatar_url', 'current_streak', 'total_points', 'current_rank')
            ->first();

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $totalAchievements = DB::table('user_characters')
            ->where('id_user', $userId)
            ->where('id_character', '>', 7)
            ->count();

        // Mengambil log aktivitas 7 hari terakhir
        $activeDates = DB::table('user_activity_logs')
            ->where('id_user', $userId)
            ->where('activity_date', '>=', Carbon::today()->subDays(6))
            ->pluck('activity_date')
            ->toArray();

        $daysName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        $calendar = [];
        $today = Carbon::today();

        for ($i = 6; $i >= 0; $i--) {
            $d = $today->copy()->subDays($i);
            $calendar[] = [
                'day' => $daysName[$d->dayOfWeek],
                'date' => $d->day,
                'isActive' => in_array($d->toDateString(), $activeDates),
                'isToday' => $i === 0,
            ];
        }

        return response()->json([
            'username' => $user->username,
            'email' => $user->email,
            'age' => $user->age,
            'avatar_url' => $user->avatar_url,
            'current_streak' => $user->current_streak,
            'total_points' => $user->total_points,
            'current_rank' => $user->current_rank,
            'rank' => $user->current_rank ?: 0,
            'total_achievements' => $totalAchievements,
            'calendar' => $calendar,
        ]);
    }

    public function getLeaderboard()
    {
        $leaderboard = DB::table('users as u')
            ->select(
                'u.id',
                'u.username as name',
                'u.avatar_url as avatar',
                'u.current_streak as streak',
                'u.total_pages as pages',
                DB::raw('(SELECT COUNT(*) FROM user_characters uc WHERE uc.id_user = u.id AND uc.id_character > 7) as awards')
            )
            ->orderByDesc('u.total_points')
            ->orderByDesc('u.current_streak')
            ->limit(30)
            ->get()
            ->map(function ($user, $key) {
                $user->rank = $key + 1;
                return $user;
            });

        return response()->json($leaderboard);
    }

    public function getMissions(Request $request)
    {
        $userId = $request->user()->id;

        $missions = DB::table('missions as m')
            ->leftJoin('user_missions as um', function ($join) use ($userId) {
                $join->on('m.id', '=', 'um.id_mission')
                     ->where('um.id_user', '=', $userId);
            })
            ->select(
                'm.id',
                'm.title',
                'm.description as desc',
                'm.max_progress as maxProgress',
                'm.reward_points as rewardPoints',
                'm.badge_image as badgeImg',
                DB::raw('COALESCE(um.progress, 0) as progress'),
                DB::raw('COALESCE(um.is_claimed, 0) as isClaimed')
            )
            ->get()
            ->map(function ($mission) {
                $mission->isClaimed = (bool) $mission->isClaimed;
                return $mission;
            });

        $userTotalPoints = DB::table('users')->where('id', $userId)->value('total_points') ?? 0;

        return response()->json([
            'totalPoints' => $userTotalPoints,
            'missions' => $missions
        ]);
    }

    public function claimMission(Request $request, $id)
    {
        $userId = $request->user()->id;
        $missionId = $id;

        $mission = DB::table('user_missions as um')
            ->join('missions as m', 'um.id_mission', '=', 'm.id')
            ->where('um.id_user', $userId)
            ->where('um.id_mission', $missionId)
            ->select('um.progress', 'm.max_progress', 'm.reward_points', 'um.is_claimed')
            ->first();

        if (!$mission) {
            return response()->json(['message' => 'Misi tidak ditemukan'], 404);
        }
        if ($mission->is_claimed) {
            return response()->json(['message' => 'Hadiah sudah pernah diambil!'], 400);
        }
        if ($mission->progress < $mission->max_progress) {
            return response()->json(['message' => 'Misi belum selesai!'], 400);
        }

        DB::transaction(function () use ($userId, $missionId, $mission) {
            DB::table('user_missions')
                ->where('id_user', $userId)
                ->where('id_mission', $missionId)
                ->update(['is_claimed' => 1]);

            DB::table('users')
                ->where('id', $userId)
                ->increment('total_points', $mission->reward_points);
        });

        return response()->json([
            'message' => 'Berhasil mengambil hadiah!',
            'addedPoints' => $mission->reward_points,
        ]);
    }

    public function updateUserProfile(Request $request)
    {
        $userId = $request->user()->id;
        
        $request->validate([
            'username' => 'required',
            'age' => 'required',
            'avatar_url' => 'required'
        ]);

        DB::table('users')->where('id', $userId)->update([
            'username' => $request->username,
            'age' => $request->age,
            'avatar_url' => $request->avatar_url
        ]);

        return response()->json(['message' => 'Profil berhasil diperbarui!']);
    }

    public function getAvatars()
    {
        $avatars = DB::table('avatars')->get();
        return response()->json($avatars);
    }
}