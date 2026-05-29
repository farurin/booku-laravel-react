<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminCategoryController extends Controller
{
    public function getAdminCategories()
    {
        $categories = DB::table('categories as c')
            ->leftJoin('books as b', 'c.id', '=', 'b.id_categories')
            ->select('c.*', DB::raw('COUNT(b.id) as total_books'), DB::raw('COALESCE(SUM(b.views_count), 0) as total_views'))
            ->groupBy('c.id', 'c.name_id', 'c.name_en', 'c.description_id', 'c.description_en', 'c.status', 'c.image_icon', 'c.image_banner', 'c.image_card', 'c.color_hex')
            ->orderByDesc('c.id')
            ->get()
            ->map(function ($cat) {
                $cat->total_books = (int) $cat->total_books;
                $cat->total_views = (int) $cat->total_views;
                $cat->image_icon = str_starts_with($cat->image_icon, 'uploads/') ? asset($cat->image_icon) : $cat->image_icon;
                $cat->image_banner = str_starts_with($cat->image_banner, 'uploads/') ? asset($cat->image_banner) : $cat->image_banner;
                $cat->image_card = str_starts_with($cat->image_card, 'uploads/') ? asset($cat->image_card) : $cat->image_card;
                return $cat;
            });

        return response()->json($categories);
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'name_id' => 'required',
            'description_id' => 'required'
        ]);

        $image_icon = $request->hasFile('image_icon') ? $request->file('image_icon')->store('uploads/categories', 'public') : 'default-icon.png';
        $image_banner = $request->hasFile('image_banner') ? $request->file('image_banner')->store('uploads/categories', 'public') : 'default-banner.png';
        $image_card = $request->hasFile('image_card') ? $request->file('image_card')->store('uploads/categories', 'public') : 'default-card.png';

        $id = DB::table('categories')->insertGetId([
            'name_id' => $request->name_id,
            'name_en' => $request->name_en,
            'description_id' => $request->description_id,
            'description_en' => $request->description_en,
            'status' => $request->status ?? 'active',
            'color_hex' => $request->color_hex ?? '#6B4EFF',
            'image_icon' => $image_icon,
            'image_banner' => $image_banner,
            'image_card' => $image_card
        ]);

        return response()->json(['message' => 'Kategori berhasil ditambahkan!', 'insertId' => $id], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $updateData = [
            'name_id' => $request->name_id,
            'name_en' => $request->name_en,
            'description_id' => $request->description_id,
            'description_en' => $request->description_en,
            'color_hex' => $request->color_hex ?? '#6B4EFF'
        ];

        if ($request->hasFile('image_icon')) {
            $updateData['image_icon'] = $request->file('image_icon')->store('uploads/categories', 'public');
        }
        if ($request->hasFile('image_banner')) {
            $updateData['image_banner'] = $request->file('image_banner')->store('uploads/categories', 'public');
        }
        if ($request->hasFile('image_card')) {
            $updateData['image_card'] = $request->file('image_card')->store('uploads/categories', 'public');
        }

        DB::table('categories')->where('id', $id)->update($updateData);

        return response()->json(['message' => 'Kategori berhasil diperbarui!']);
    }

    public function updateCategoryStatus(Request $request, $id)
    {
        // 1. Ubah status kategori
        DB::table('categories')->where('id', $id)->update(['status' => $request->status]);

        // 2. PERBAIKAN: Jika kategori menjadi inactive, otomatis ubah buku yang 'terbit' menjadi 'arsip'
        if ($request->status === 'inactive') {
            DB::table('books')
                ->where('id_categories', $id)
                ->where('status', 'terbit')
                ->update(['status' => 'arsip']);
        }

        return response()->json(['message' => "Status kategori berhasil diubah menjadi {$request->status}!"]);
    }

    public function deleteCategory($id)
    {
        $booksCount = DB::table('books')->where('id_categories', $id)->count();

        if ($booksCount > 0) {
            return response()->json(['message' => "Gagal menghapus! Ada {$booksCount} buku yang masih menggunakan kategori ini."], 400);
        }

        DB::table('categories')->where('id', $id)->delete();
        return response()->json(['message' => 'Kategori berhasil dihapus permanen!']);
    }
}
