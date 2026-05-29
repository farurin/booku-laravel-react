<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Fungsi bantuan untuk mencatat aktivitas
    private function recordUserActivity($userId)
    {
        $today = now()->toDateString();
        $activityExists = UserActivityLog::where('id_user', $userId)
            ->where('activity_date', $today)
            ->exists();

        if (!$activityExists) {
            UserActivityLog::create([
                'id_user' => $userId,
                'activity_date' => $today
            ]);
        }
    }

    // REPLIKASI: Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal!',
                'errors' => $validator->errors()
            ], 400);
        }

        // Buat Username Unik
        $baseUsername = explode('@', $request->email)[0];
        $finalUsername = $baseUsername;
        $counter = 1;

        while (User::where('username', $finalUsername)->exists()) {
            $finalUsername = $baseUsername . $counter;
            $counter++;
        }

        // Masukkan ke Database
        $user = User::create([
            'username' => $finalUsername,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Enkripsi Bcrypt
            'role' => 'user',
            'status' => 'active',
            'age' => 0,
            'avatar_url' => '/images/avatars/cat-avatar.png', 
            'active_character_id' => 1,
            'total_points' => 0,
            'current_streak' => 0,
            'total_pages' => 0,
            'current_rank' => 0 
        ]);

        // Buat Token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Catat Aktivitas
        $this->recordUserActivity($user->id);

        return response()->json([
            'message' => 'Pendaftaran sukses!',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 201);
    }

    // REPLIKASI: Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        // Cek Email & Password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau password salah!'], 401);
        }

        // Buat Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Catat Aktivitas
        $this->recordUserActivity($user->id);

        return response()->json([
            'message' => 'Login sukses!',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }

    // BONUS: Logout (Menghapus token)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout']);
    }
}