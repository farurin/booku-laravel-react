<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            // PERBAIKAN: Di-cast menjadi integer (int) dan ditambahkan fallback properti 
            // agar filter 'parseInt(id)' di React selalu sukses terbaca.
            'id' => (int) $this->id,
            'id_categories' => (int) ($this->id_categories ?? $this->category_id),

            'title_id' => $this->title_id,
            'title_en' => $this->title_en,
            'description_id' => $this->description_id,
            'description_en' => $this->description_en,
            // dua image
            'image_id' => $this->image_id && str_starts_with($this->image_id, 'uploads/') ? asset($this->image_id) : $this->image_id,
            'image_en' => $this->image_en && str_starts_with($this->image_en, 'uploads/') ? asset($this->image_en) : $this->image_en,
            'bg_music_url' => $this->bg_music_url && str_starts_with($this->bg_music_url, 'uploads/') ? asset($this->bg_music_url) : $this->bg_music_url,
            'title_audio_id_url' => $this->title_audio_id_url && str_starts_with($this->title_audio_id_url, 'uploads/') ? asset($this->title_audio_id_url) : $this->title_audio_id_url,
            'title_audio_en_url' => $this->title_audio_en_url && str_starts_with($this->title_audio_en_url, 'uploads/') ? asset($this->title_audio_en_url) : $this->title_audio_en_url,

            'youtube_url_id' => $this->youtube_url_id,
            'youtube_url_en' => $this->youtube_url_en,
            'is_recommended' => $this->is_recommended,
            'status' => $this->status,
            'views_count' => $this->views_count,
            'favorites_count' => $this->favorites_count ?? 0,
            'saved_count' => $this->saved_count ?? 0,
            'rating_avg' => (float) ($this->rating_avg ?? 0),
            'rating_count' => (int) ($this->rating_count ?? 0),
            'created_at' => $this->created_at,
            'category_name_id' => $this->whenLoaded('category', function () {
                return $this->category->name_id;
            }),
            'category_name_en' => $this->whenLoaded('category', function () {
                return $this->category->name_en;
            }),
        ];
    }
}
