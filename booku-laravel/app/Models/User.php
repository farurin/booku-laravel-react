<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'users';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null; // Karena tabel tidak punya updated_at

    protected $fillable = [
        'username', 'first_name', 'last_name', 'phone_number', 'gender',
        'email', 'role', 'status', 'age', 'avatar_url', 'password',
        'active_character_id', 'current_streak', 'total_points', 
        'total_pages', 'current_rank', 'last_active_date'
    ];

    protected $hidden = [
        'password',
    ];
}