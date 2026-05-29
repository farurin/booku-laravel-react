<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name_id' => $this->name_id,
            'name_en' => $this->name_en,
            'description_id' => $this->description_id,
            'description_en' => $this->description_en,
            'status' => $this->status,
            'image_icon' => str_starts_with($this->image_icon, 'uploads/') ? asset($this->image_icon) : $this->image_icon,
            'image_banner' => str_starts_with($this->image_banner, 'uploads/') ? asset($this->image_banner) : $this->image_banner,
            'image_card' => str_starts_with($this->image_card, 'uploads/') ? asset($this->image_card) : $this->image_card,
            'color_hex' => $this->color_hex,
            'books' => BookResource::collection($this->whenLoaded('books')),
        ];
    }
}
