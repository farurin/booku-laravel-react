<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\BookPage;
use App\Http\Resources\BookResource;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\ActivityService;

class BookController extends Controller
{
    // Replikasi: getCategories
    public function getCategories()
    {
        $categories = Category::with(['books' => function ($query) {
            $query->where('status', 'terbit')
                ->orderBy('created_at', 'desc');
        }])
            ->where('status', 'active') // Hanya ambil kategori yang 'active'
            ->get();

        return CategoryResource::collection($categories);
    }

    // Replikasi: getBooks
    public function getBooks()
    {
        $books = Book::with('category')
            ->select('books.*')
            ->selectRaw('(SELECT COUNT(*) FROM user_favorites WHERE user_favorites.id_book = books.id) as favorites_count')
            ->selectRaw('(SELECT COUNT(*) FROM user_saved WHERE user_saved.id_book = books.id) as saved_count')

            // TAMBAHAN BARU: Ambil rata-rata rating dan jumlah orang yang nge-rate
            ->selectRaw('(SELECT ROUND(AVG(rating), 1) FROM user_ratings WHERE user_ratings.id_book = books.id) as rating_avg')
            ->selectRaw('(SELECT COUNT(*) FROM user_ratings WHERE user_ratings.id_book = books.id) as rating_count')

            ->where('status', 'terbit')
            ->orderBy('created_at', 'desc')
            ->get();

        return BookResource::collection($books);
    }

    public function getBookPages($id)
    {
        $pages = BookPage::where('id_book', $id)
            ->orderBy('page_number', 'asc')
            ->get()
            ->map(function ($page) {
                if ($page->dubbing_id_url && str_starts_with($page->dubbing_id_url, 'uploads/')) {
                    $page->dubbing_id_url = asset($page->dubbing_id_url);
                }
                if ($page->dubbing_en_url && str_starts_with($page->dubbing_en_url, 'uploads/')) {
                    $page->dubbing_en_url = asset($page->dubbing_en_url);
                }
                return $page;
            });

        return response()->json($pages);
    }

    // Fungsi tambah jumlah baca
    public function incrementView($id)
    {
        Book::where('id', $id)->increment('views_count');
        return response()->json(['message' => 'View counted']);
    }

    // --- FITUR INTERAKSI MEMBACA ---

    public function finishBook(Request $request, $id)
    {
        $userId = $request->user()->id;
        ActivityService::recordUserActivity($userId);
        $bookId = $id;

        $existing = DB::table('user_progress')
            ->where('id_user', $userId)
            ->where('id_book', $bookId)
            ->first();

        if ($existing) {
            DB::table('user_progress')
                ->where('id', $existing->id)
                ->update([
                    'reading_progress' => 100,
                    'status' => 'completed',
                    'last_read_at' => now()
                ]);
        } else {
            DB::table('user_progress')->insert([
                'id_user' => $userId,
                'id_book' => $bookId,
                'reading_progress' => 100,
                'status' => 'completed',
                'last_read_at' => now()
            ]);
        }

        // --- FITUR MISI (DI-KOMEN SEMENTARA UNTUK MVP) ---
        /*
        DB::update("
            UPDATE user_missions um
            JOIN missions m ON um.id_mission = m.id
            SET um.progress = um.progress + 1
            WHERE um.id_user = ? AND um.is_claimed = 0 AND um.progress < m.max_progress
        ", [$userId]);
        */

        return response()->json([
            'message' => 'Sinyal diterima! Buku selesai dibaca.'
        ]);
    }

    public function updateProgress(Request $request, $id)
    {
        $userId = $request->user()->id;
        $bookId = $id;
        $progress = $request->progress;

        ActivityService::recordUserActivity($userId);

        $existing = DB::table('user_progress')
            ->where('id_user', $userId)
            ->where('id_book', $bookId)
            ->first();

        // FIX BUG: Status otomatis berubah jadi 'completed' jika progress mencapai 100
        $currentStatus = $progress >= 100 ? 'completed' : 'reading';

        if ($existing) {
            DB::table('user_progress')
                ->where('id', $existing->id)
                ->update([
                    'reading_progress' => $progress,
                    'status' => $currentStatus, // Variabel Dinamis
                    'last_read_at' => now()
                ]);
        } else {
            DB::table('user_progress')->insert([
                'id_user' => $userId,
                'id_book' => $bookId,
                'reading_progress' => $progress,
                'status' => $currentStatus, // Variabel Dinamis
                'last_read_at' => now()
            ]);
        }

        return response()->json(['message' => 'Progres baca diperbarui!']);
    }

    public function getBookStatus(Request $request, $id)
    {
        $userId = $request->user()->id;
        $bookId = $id;

        $isFavorite = DB::table('user_favorites')->where('id_user', $userId)->where('id_book', $bookId)->exists();
        $isSaved = DB::table('user_saved')->where('id_user', $userId)->where('id_book', $bookId)->exists();

        // AMBIL DATA PROGRESS BACAAN
        $progressRecord = DB::table('user_progress')->where('id_user', $userId)->where('id_book', $bookId)->first();

        // TAMBAHAN BARU: Ambil nilai rating user jika ada
        $userRating = DB::table('user_ratings')->where('id_user', $userId)->where('id_book', $bookId)->value('rating');

        return response()->json([
            'isFavorite' => $isFavorite,
            'isSaved' => $isSaved,
            'progress' => $progressRecord ? (int)$progressRecord->reading_progress : 0,
            // Kembalikan nilai rating, jika belum rate kembalikan 0
            'userRating' => $userRating ? (int)$userRating : 0
        ]);
    }

    public function toggleFavorite(Request $request, $id)
    {
        $userId = $request->user()->id;
        $bookId = $id;

        $exists = DB::table('user_favorites')->where('id_user', $userId)->where('id_book', $bookId)->exists();

        if ($exists) {
            DB::table('user_favorites')->where('id_user', $userId)->where('id_book', $bookId)->delete();
            return response()->json(['isFavorite' => false, 'message' => 'Dihapus dari favorit']);
        } else {
            DB::table('user_favorites')->insert(['id_user' => $userId, 'id_book' => $bookId]);
            return response()->json(['isFavorite' => true, 'message' => 'Ditambahkan ke favorit']);
        }
    }

    public function toggleSaved(Request $request, $id)
    {
        $userId = $request->user()->id;
        $bookId = $id;

        $exists = DB::table('user_saved')->where('id_user', $userId)->where('id_book', $bookId)->exists();

        if ($exists) {
            DB::table('user_saved')->where('id_user', $userId)->where('id_book', $bookId)->delete();
            return response()->json(['isSaved' => false, 'message' => 'Dihapus dari simpanan']);
        } else {
            DB::table('user_saved')->insert(['id_user' => $userId, 'id_book' => $bookId, 'saved_at' => now()]);
            return response()->json(['isSaved' => true, 'message' => 'Disimpan untuk nanti']);
        }
    }

    public function rateBook(Request $request, $id)
    {
        // Validasi agar rating wajib diisi dan hanya berupa angka 1 sampai 5
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $userId = $request->user()->id;
        $bookId = $id;
        $rating = $request->rating;

        // Cek apakah user sudah pernah memberi rating pada buku ini
        $existing = DB::table('user_ratings')
            ->where('id_user', $userId)
            ->where('id_book', $bookId)
            ->first();

        if ($existing) {
            // Jika sudah ada, update nilainya (Mencegah double rating)
            DB::table('user_ratings')
                ->where('id', $existing->id)
                ->update(['rating' => $rating]);

            return response()->json(['message' => 'Rating berhasil diperbarui!', 'rating' => $rating]);
        } else {
            // Jika belum ada, buat data baru
            DB::table('user_ratings')->insert([
                'id_user' => $userId,
                'id_book' => $bookId,
                'rating' => $rating,
                'created_at' => now()
            ]);

            return response()->json(['message' => 'Rating berhasil ditambahkan!', 'rating' => $rating]);
        }
    }
}
