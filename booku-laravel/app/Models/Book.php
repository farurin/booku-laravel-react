<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $table = 'books';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null; // Matikan updated_at jika tidak ada di tabel

    protected $fillable = [
        'id_categories',
        'title_id',
        'title_en',
        'description_id',
        'description_en',
        'image_id', // TAMBAHAN BARU
        'image_en', // TAMBAHAN BARU
        'bg_music_url',
        'title_audio_id_url',
        'title_audio_en_url',
        'youtube_url_id',
        'youtube_url_en',
        'status',
        'views_count'
    ];

    // Relasi: Buku dimiliki oleh satu kategori
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'id_categories', 'id');
    }

    // Relasi: Satu buku punya banyak halaman (scenes)
    public function pages(): HasMany
    {
        return $this->hasMany(BookPage::class, 'id_book', 'id')->orderBy('page_number', 'asc');
    }
}
