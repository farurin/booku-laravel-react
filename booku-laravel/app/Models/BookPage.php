<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookPage extends Model
{
    protected $table = 'book_pages';
    public $timestamps = false;

    protected $fillable = [
        'id_book', 'page_number', 'image', 'dubbing_id_url', 
        'dubbing_en_url', 'text_id', 'text_en'
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'id_book', 'id');
    }
}