<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminProfileController extends Controller
{
    public function getAdminProfile(Request $request)
    {
        $userId = $request->user()->id;
        $user = DB::table('users')
            ->where('id', $userId)
            ->select('first_name', 'last_name', 'email', 'phone_number', 'gender', 'avatar_url')
            ->first();

        if (!$user) return response()->json(['message' => 'Admin tidak ditemukan'], 404);

        return response()->json($user);
    }

    public function updateAdminProfile(Request $request)
    {
        $userId = $request->user()->id;
        $avatarUrl = $request->existing_avatar;

        if ($request->hasFile('avatar')) {
            $avatarUrl = $request->file('avatar')->store('uploads/avatars', 'public');
        }

        DB::table('users')->where('id', $userId)->update([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'phone_number' => $request->phone,
            'gender' => $request->gender,
            'avatar_url' => $avatarUrl
        ]);

        return response()->json(['message' => 'Profil berhasil diperbarui!', 'avatar_url' => $avatarUrl]);
    }

    public function updateAdminPassword(Request $request)
    {
        $userId = $request->user()->id;
        $user = DB::table('users')->where('id', $userId)->first();

        if (!$user) return response()->json(['message' => 'User tidak ditemukan'], 404);

        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Password saat ini salah!'], 400);
        }

        DB::table('users')->where('id', $userId)->update([
            'password' => Hash::make($request->newPassword)
        ]);

        return response()->json(['message' => 'Password berhasil diubah!']);
    }
}