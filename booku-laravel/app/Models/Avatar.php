<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avatar extends Model
{
    protected $table = 'avatars';
    public $timestamps = false;

    protected $fillable = [
        'name', 'image_url'
    ];
}