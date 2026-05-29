<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminUserController extends Controller
{
    // GET ALL USERS
    public function getAllUsers()
    {
        $users = DB::table('users')
            ->select(
                'id',
                'username',
                'first_name',
                'last_name',
                'email',
                'role',
                'status',
                'avatar_url',
                'created_at',
                DB::raw('(SELECT COUNT(*) FROM user_progress WHERE user_progress.id_user = users.id) as read_count')
            )
            ->orderByDesc('created_at')
            ->get();

        Carbon::setLocale('id');

        $formattedUsers = $users->map(function ($u) {
            $name = $u->first_name
                ? ($u->last_name ? "{$u->first_name} {$u->last_name}" : $u->first_name)
                : $u->username;

            return [
                'id' => $u->id,
                'firstName' => $u->first_name ?? '',
                'lastName' => $u->last_name ?? '',
                'name' => $name,
                'email' => $u->email,
                'role' => $u->role ?? 'user',
                'status' => $u->status ?? 'active',
                'avatar' => $u->avatar_url ?? 'https://placehold.co/150x150?text=Avatar',
                'date' => Carbon::parse($u->created_at)->translatedFormat('d M Y'),
                'read_count' => $u->read_count,
            ];
        });

        return response()->json($formattedUsers);
    }

    // CREATE ADMIN USER
    public function createAdminUser(Request $request)
    {
        $request->validate([
            'firstName' => 'required',
            'email' => 'required|email|unique:users,email',
            'role' => 'required',
            'password' => 'required'
        ], [
            'email.unique' => 'Email sudah digunakan oleh pengguna lain!'
        ]);

        $baseUsername = explode('@', $request->email)[0];
        $finalUsername = $baseUsername;
        $counter = 1;

        while (DB::table('users')->where('username', $finalUsername)->exists()) {
            $finalUsername = $baseUsername . $counter;
            $counter++;
        }

        DB::table('users')->insert([
            'username' => $finalUsername,
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'status' => 'active',
            'created_at' => now()
        ]);

        return response()->json(['message' => 'Pengguna baru berhasil ditambahkan!'], 201);
    }

    // UPDATE ADMIN USER
    public function updateAdminUser(Request $request, $id)
    {
        $request->validate([
            'firstName' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required'
        ], [
            'email.unique' => 'Email sudah digunakan oleh pengguna lain!'
        ]);

        $updateData = [
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'role' => $request->role
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        DB::table('users')->where('id', $id)->update($updateData);

        return response()->json(['message' => 'Data pengguna berhasil diperbarui!']);
    }

    // DELETE ADMIN USER
    public function deleteAdminUser(Request $request, $id)
    {
        if ($request->user()->id == $id) {
            return response()->json([
                'message' => 'Tindakan ditolak! Anda tidak dapat menghapus akun Anda sendiri.'
            ], 400);
        }

        $deleted = DB::table('users')->where('id', $id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Pengguna tidak ditemukan.'], 404);
        }

        return response()->json(['message' => 'Akses dicabut dan akun berhasil dihapus permanen!']);
    }
}
