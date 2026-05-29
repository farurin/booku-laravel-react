<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProgress extends Model
{
    protected $table = 'user_progress';
    public $timestamps = false;

    protected $fillable = [
        'id_user', 'id_book', 'reading_progress', 'status', 'last_read_at'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'id_book', 'id');
    }
}