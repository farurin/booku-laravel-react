<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $table = 'missions';
    public $timestamps = false;

    protected $fillable = [
        'title', 'description', 'max_progress', 'reward_points', 'badge_image'
    ];
}