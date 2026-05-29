<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class AdminBookController extends Controller
{
    public function getAdminBooks()
    {
        $books = DB::table('books as b')
            ->leftJoin('categories as c', 'b.id_categories', '=', 'c.id')
            ->select(
                'b.id',
                'b.title_id',
                'b.title_en',
                'b.description_id',
                'b.description_en',
                // cover baru
                'b.image_id',  // Perbaikan nama kolom DB
                'b.image_en',  // Perbaikan nama kolom DB
                'b.status',
                'b.views_count',
                'b.created_at',
                'c.name_id as category_name_id',
                DB::raw('(SELECT COUNT(*) FROM user_favorites WHERE user_favorites.id_book = b.id) as favorites_count'),
                DB::raw('(SELECT COUNT(*) FROM user_saved WHERE user_saved.id_book = b.id) as saved_count')
            )
            ->orderByDesc('b.created_at')
            ->get()
            ->map(function ($book) {
                // Baru
                $book->image_id = $book->image_id && str_starts_with($book->image_id, 'uploads/')
                    ? asset($book->image_id)
                    : $book->image_id;

                $book->image_en = $book->image_en && str_starts_with($book->image_en, 'uploads/')
                    ? asset($book->image_en)
                    : $book->image_en;

                return $book;
            });

        return response()->json($books);
    }

    // =========================================================================
    // CREATE BOOK
    // =========================================================================

    public function createBook(Request $request)
    {
        if (!$request->title_id || !$request->description_id || !$request->id_categories) {
            return response()->json([
                'message' => 'Judul (ID), Deskripsi (ID), dan Kategori wajib diisi!'
            ], 400);
        }

        // =========================================================
        // DEFAULT VALUES
        // =========================================================

        $coverImageIdUrl = 'default-cover.png';
        $coverImageEnUrl = 'default-cover.png';

        $bgMusicUrl = null;
        $titleAudioIdUrl = null;
        $titleAudioEnUrl = null;

        // =========================================================
        // COVER INDONESIA
        // =========================================================

        if ($request->hasFile('cover_image_id')) {
            $coverImageIdUrl = $request
                ->file('cover_image_id')
                ->store('uploads/books/covers', 'public');
        }

        // =========================================================
        // COVER ENGLISH
        // =========================================================

        if ($request->hasFile('cover_image_en')) {
            $coverImageEnUrl = $request
                ->file('cover_image_en')
                ->store('uploads/books/covers', 'public');
        }

        // =========================================================
        // AUDIO & MUSIC
        // =========================================================

        if ($request->hasFile('bg_music')) {
            $bgMusicUrl = $request
                ->file('bg_music')
                ->store('uploads/books/music', 'public');
        }

        if ($request->hasFile('title_audio_id')) {
            $titleAudioIdUrl = $request
                ->file('title_audio_id')
                ->store('uploads/books/dubbing', 'public');
        }

        if ($request->hasFile('title_audio_en')) {
            $titleAudioEnUrl = $request
                ->file('title_audio_en')
                ->store('uploads/books/dubbing', 'public');
        }

        try {

            $bookId = DB::table('books')->insertGetId([

                'id_categories' => $request->id_categories,

                'title_id' => $request->title_id,
                'title_en' => $request->title_en,

                'description_id' => $request->description_id,
                'description_en' => $request->description_en,

                // =====================================================
                // TRANSITIONAL
                // =====================================================

                // =====================================================
                // BARU
                // =====================================================

                'image_id' => $coverImageIdUrl,
                'image_en' => $coverImageEnUrl,

                'bg_music_url' => $bgMusicUrl,

                'title_audio_id_url' => $titleAudioIdUrl,
                'title_audio_en_url' => $titleAudioEnUrl,

                'youtube_url_id' => $request->youtube_url_id,
                'youtube_url_en' => $request->youtube_url_en,

                'status' => $request->status ?? 'review',

                'views_count' => 0,
                'created_at' => now()
            ]);

            return response()->json([
                'message' => 'Draft Buku berhasil dibuat! Silakan tambahkan halaman.',
                'bookId' => $bookId
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'error' => 'Gagal menyimpan buku: ' . $e->getMessage()
            ], 500);
        }
    }

    // =========================================================================
    // GET DETAIL
    // =========================================================================

    public function getAdminBookDetail($id)
    {
        $book = DB::table('books as b')
            ->leftJoin('categories as c', 'b.id_categories', '=', 'c.id')
            ->select(
                'b.*',
                'c.name_id as category_name_id',
                DB::raw('(SELECT COUNT(*) FROM user_favorites WHERE user_favorites.id_book = b.id) as favorites_count'),
                DB::raw('(SELECT COUNT(*) FROM user_saved WHERE user_saved.id_book = b.id) as saved_count')
            )
            ->where('b.id', $id)
            ->first();

        if (!$book) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        $pages = DB::table('book_pages')
            ->where('id_book', $id)
            ->orderBy('page_number', 'asc')
            ->get();

        Carbon::setLocale('id');

        $responseData = [
            'id' => $book->id,

            'id_categories' => $book->id_categories,

            'title_id' => $book->title_id,
            'title_en' => $book->title_en,

            'description_id' => $book->description_id,
            'description_en' => $book->description_en,

            'author' => 'Funtasya Team',

            'date' => Carbon::parse($book->created_at)
                ->translatedFormat('d F Y'),

            'category_name_id' => $book->category_name_id,

            'status' => $book->status,
            'views_count' => $book->views_count,

            'favorites_count' => $book->favorites_count,
            'saved_count' => $book->saved_count,

            'youtube_url_id' => $book->youtube_url_id,
            'youtube_url_en' => $book->youtube_url_en,

            // =====================================================
            // BARU
            // =====================================================

            'cover_image_id' => $book->image_id && str_starts_with($book->image_id, 'uploads/')
                ? asset($book->image_id)
                : $book->image_id,

            'cover_image_en' => $book->image_en && str_starts_with($book->image_en, 'uploads/')
                ? asset($book->image_en)
                : $book->image_en,

            'bg_music' => $book->bg_music_url && str_starts_with($book->bg_music_url, 'uploads/')
                ? asset($book->bg_music_url)
                : $book->bg_music_url,

            'title_audio_id_url' => $book->title_audio_id_url && str_starts_with($book->title_audio_id_url, 'uploads/')
                ? asset($book->title_audio_id_url)
                : $book->title_audio_id_url,

            'title_audio_en_url' => $book->title_audio_en_url && str_starts_with($book->title_audio_en_url, 'uploads/')
                ? asset($book->title_audio_en_url)
                : $book->title_audio_en_url,

            'scenes' => $pages->map(function ($page) {

                return [
                    'id' => $page->id,

                    'page_number' => $page->page_number,

                    'image' => str_starts_with($page->image, 'uploads/')
                        ? asset($page->image)
                        : $page->image,

                    'text_id' => $page->text_id,
                    'text_en' => $page->text_en,

                    'dubbing_id_url' => $page->dubbing_id_url && str_starts_with($page->dubbing_id_url, 'uploads/')
                        ? asset($page->dubbing_id_url)
                        : $page->dubbing_id_url,

                    'dubbing_en_url' => $page->dubbing_en_url && str_starts_with($page->dubbing_en_url, 'uploads/')
                        ? asset($page->dubbing_en_url)
                        : $page->dubbing_en_url,

                    'has_dubbing_id' => !empty($page->dubbing_id_url),
                    'has_dubbing_en' => !empty($page->dubbing_en_url),
                ];
            })
        ];

        return response()->json($responseData);
    }

    // =========================================================================
    // UPDATE STATUS
    // =========================================================================

    public function updateBookStatus(Request $request, $id)
    {
        $validStatuses = ['terbit', 'ditolak', 'review', 'arsip', 'dihapus'];

        if (!in_array($request->status, $validStatuses)) {
            return response()->json([
                'message' => 'Status tidak valid'
            ], 400);
        }

        DB::table('books')
            ->where('id', $id)
            ->update([
                'status' => $request->status
            ]);

        return response()->json([
            'message' => "Buku berhasil diubah menjadi " . strtoupper($request->status) . "!"
        ]);
    }

    // =========================================================================
    // UPDATE BOOK
    // =========================================================================

    public function updateBook(Request $request, $id)
    {
        $updateData = [

            'id_categories' => $request->id_categories,

            'title_id' => $request->title_id,
            'title_en' => $request->title_en,

            'description_id' => $request->description_id,
            'description_en' => $request->description_en,

            'youtube_url_id' => $request->youtube_url_id,
            'youtube_url_en' => $request->youtube_url_en,

            'status' => $request->status
        ];

        // =========================================================
        // COVER ID
        // =========================================================

        if ($request->hasFile('cover_image_id')) {

            $coverIdPath = $request
                ->file('cover_image_id')
                ->store('uploads/books/covers', 'public');

            // baru
            $updateData['image_id'] = $coverIdPath;
        }

        // =========================================================
        // COVER EN
        // =========================================================

        if ($request->hasFile('cover_image_en')) {

            $coverEnPath = $request
                ->file('cover_image_en')
                ->store('uploads/books/covers', 'public');

            $updateData['image_en'] = $coverEnPath;
        }

        // =========================================================
        // AUDIO & MUSIC
        // =========================================================

        if ($request->hasFile('bg_music')) {
            $updateData['bg_music_url'] = $request
                ->file('bg_music')
                ->store('uploads/books/music', 'public');
        }

        if ($request->hasFile('title_audio_id')) {
            $updateData['title_audio_id_url'] = $request
                ->file('title_audio_id')
                ->store('uploads/books/dubbing', 'public');
        }

        if ($request->hasFile('title_audio_en')) {
            $updateData['title_audio_en_url'] = $request
                ->file('title_audio_en')
                ->store('uploads/books/dubbing', 'public');
        }

        try {

            DB::table('books')
                ->where('id', $id)
                ->update($updateData);

            return response()->json([
                'message' => 'Informasi Buku berhasil diperbarui!'
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'error' => 'Gagal memperbarui buku: ' . $e->getMessage()
            ], 500);
        }
    }

    // =========================================================================
    // HAPUS BUKU PERMANEN (HARD DELETE)
    // =========================================================================

    public function deleteBook($id)
    {
        $book = DB::table('books')->where('id', $id)->first();

        if (!$book) {
            return response()->json([
                'message' => 'Buku tidak ditemukan'
            ], 404);
        }

        // 1. HAPUS FILE MILIK SCENE (GAMBAR & DUBBING)
        $pages = DB::table('book_pages')->where('id_book', $id)->get();
        foreach ($pages as $page) {
            if ($page->image && str_starts_with($page->image, 'uploads/')) {
                Storage::disk('public')->delete($page->image);
            }
            if ($page->dubbing_id_url && str_starts_with($page->dubbing_id_url, 'uploads/')) {
                Storage::disk('public')->delete($page->dubbing_id_url);
            }
            if ($page->dubbing_en_url && str_starts_with($page->dubbing_en_url, 'uploads/')) {
                Storage::disk('public')->delete($page->dubbing_en_url);
            }
        }

        // 2. HAPUS DATA SCENE DARI DATABASE
        DB::table('book_pages')->where('id_book', $id)->delete();

        // 3. HAPUS FILE MILIK BUKU UTAMA (COVER & AUDIO)
        if ($book->image_id && str_starts_with($book->image_id, 'uploads/')) {
            Storage::disk('public')->delete($book->image_id);
        }
        if ($book->image_en && str_starts_with($book->image_en, 'uploads/')) {
            Storage::disk('public')->delete($book->image_en);
        }
        if ($book->bg_music_url && str_starts_with($book->bg_music_url, 'uploads/')) {
            Storage::disk('public')->delete($book->bg_music_url);
        }
        if ($book->title_audio_id_url && str_starts_with($book->title_audio_id_url, 'uploads/')) {
            Storage::disk('public')->delete($book->title_audio_id_url);
        }
        if ($book->title_audio_en_url && str_starts_with($book->title_audio_en_url, 'uploads/')) {
            Storage::disk('public')->delete($book->title_audio_en_url);
        }

        // 4. BERSIHKAN RELASI USER (RIWAYAT, FAVORIT, DISIMPAN)
        DB::table('user_favorites')->where('id_book', $id)->delete();
        DB::table('user_saved')->where('id_book', $id)->delete();
        DB::table('user_progress')->where('id_book', $id)->delete();

        // 5. HAPUS DATA BUKU UTAMA DARI DATABASE
        DB::table('books')->where('id', $id)->delete();

        return response()->json([
            'message' => 'Buku beserta seluruh data dan medianya berhasil dihapus permanen!'
        ]);
    }

    // =========================================================================
    // FASE 2: MANAJEMEN SCENE
    // =========================================================================

    public function addBookPage(Request $request, $id)
    {
        $imgUrl = 'default-scene.png';
        $dubIdUrl = null;
        $dubEnUrl = null;

        $maxPage = DB::table('book_pages')
            ->where('id_book', $id)
            ->max('page_number');

        $nextPage = $maxPage ? $maxPage + 1 : 1;

        if ($request->hasFile("scene_image")) {
            $imgUrl = $request->file("scene_image")
                ->store('uploads/books/scenes', 'public');
        }

        if ($request->hasFile("scene_dubbing_id")) {
            $dubIdUrl = $request->file("scene_dubbing_id")
                ->store('uploads/books/dubbing', 'public');
        }

        if ($request->hasFile("scene_dubbing_en")) {
            $dubEnUrl = $request->file("scene_dubbing_en")
                ->store('uploads/books/dubbing', 'public');
        }

        DB::table('book_pages')->insert([
            'id_book' => $id,
            'page_number' => $nextPage,
            'image' => $imgUrl,
            'dubbing_id_url' => $dubIdUrl,
            'dubbing_en_url' => $dubEnUrl,
            'text_id' => $request->text_id ?? '',
            'text_en' => $request->text_en ?? ''
        ]);

        return response()->json([
            'message' => 'Halaman berhasil ditambahkan!'
        ]);
    }

    public function updateBookPage(Request $request, $pageId)
    {
        $updateData = [
            'text_id' => $request->text_id ?? '',
            'text_en' => $request->text_en ?? ''
        ];

        if ($request->hasFile("scene_image")) {
            $updateData['image'] = $request->file("scene_image")
                ->store('uploads/books/scenes', 'public');
        }

        if ($request->hasFile("scene_dubbing_id")) {
            $updateData['dubbing_id_url'] = $request->file("scene_dubbing_id")
                ->store('uploads/books/dubbing', 'public');
        }

        if ($request->hasFile("scene_dubbing_en")) {
            $updateData['dubbing_en_url'] = $request->file("scene_dubbing_en")
                ->store('uploads/books/dubbing', 'public');
        }

        DB::table('book_pages')
            ->where('id', $pageId)
            ->update($updateData);

        return response()->json([
            'message' => 'Halaman berhasil diperbarui!'
        ]);
    }

    public function deleteBookPage($pageId)
    {
        $page = DB::table('book_pages')
            ->where('id', $pageId)
            ->first();

        if (!$page) {
            return response()->json([
                'message' => 'Halaman tidak ditemukan'
            ], 404);
        }

        $bookId = $page->id_book;

        DB::table('book_pages')
            ->where('id', $pageId)
            ->delete();

        $remainingPages = DB::table('book_pages')
            ->where('id_book', $bookId)
            ->orderBy('page_number', 'asc')
            ->get();

        foreach ($remainingPages as $index => $p) {

            DB::table('book_pages')
                ->where('id', $p->id)
                ->update([
                    'page_number' => $index + 1
                ]);
        }

        return response()->json([
            'message' => 'Halaman berhasil dihapus!'
        ]);
    }
}
