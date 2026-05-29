<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $table = 'categories'; // Nama tabel di phpMyAdmin
    public $timestamps = false; // Karena tidak ada kolom updated_at

    protected $fillable = [
        'name_id', 'name_en', 'description_id', 'description_en', 'status', 'image_icon', 
        'image_banner', 'image_card', 'color_hex'
    ];

    // Relasi: Satu kategori punya banyak buku
    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'id_categories', 'id');
    }
}