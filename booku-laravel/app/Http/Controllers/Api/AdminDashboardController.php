<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function getDashboardStats()
    {
        // 1. STATISTIK UTAMA
        $totalBooks = DB::table('books')->count();
        $totalUsers = DB::table('users')->where('role', 'user')->count();
        $totalViews = DB::table('books')->sum('views_count') ?? 0;
        $totalCategories = DB::table('categories')->count();

        // 2. STATUS BUKU
        $popularBooks = DB::table('books as b')
            ->leftJoin('categories as c', 'b.id_categories', '=', 'c.id')
            ->select(
                'b.id',
                'b.title_id as title',
                'b.image_id as cover_image_id', // Perbaikan dengan alias
                'b.image_en as cover_image_en', // Perbaikan dengan alias
                'c.name_id as category',
                'b.views_count'
            )
            ->where('b.status', 'terbit')
            ->orderByDesc('b.views_count')
            ->limit(4)
            ->get();

        $latestBooks = DB::table('books as b')
            ->leftJoin('categories as c', 'b.id_categories', '=', 'c.id')
            ->select(
                'b.id',
                'b.title_id as title',
                'b.image_id as cover_image_id', // Perbaikan dengan alias
                'b.image_en as cover_image_en', // Perbaikan dengan alias
                'c.name_id as category',
            )
            ->where('b.status', 'terbit')
            ->orderByDesc('b.created_at')
            ->limit(4)
            ->get();

        // PERBAIKAN: Query untuk "Paling Sedikit Dilihat"
        $leastViewedBooks = DB::table('books as b')
            ->leftJoin('categories as c', 'b.id_categories', '=', 'c.id')
            ->select(
                'b.id',
                'b.title_id as title',
                'b.image_id as cover_image_id', // Perbaikan dengan alias
                'b.image_en as cover_image_en', // Perbaikan dengan alias
                'c.name_id as category',
                'b.views_count'
            )
            ->where('b.status', 'terbit')
            ->orderBy('b.views_count', 'asc') // Urutkan dari views terkecil
            ->limit(4)
            ->get();

        // 3. STATISTIK DEMOGRAFI
        $categoryStats = DB::table('categories as c')
            ->leftJoin('books as b', function ($join) {
                $join->on('c.id', '=', 'b.id_categories')
                    ->where('b.status', '=', 'terbit');
            })
            ->select('c.name_id as label', 'c.color_hex as color', DB::raw('COUNT(b.id) as count'))
            ->groupBy('c.id', 'c.name_id', 'c.color_hex')
            ->get();

        $validTotalBooks = $totalBooks > 0 ? $totalBooks : 1;
        $demography = $categoryStats->map(function ($cat) use ($validTotalBooks) {
            return [
                'label' => $cat->label,
                'count' => $cat->count,
                'pct' => round(($cat->count / $validTotalBooks) * 100),
                'color' => $cat->color ?: '#FBBF24'
            ];
        });

        // 4. SIDEBAR (Manajemen Autor dihapus)
        $recentSidebarBooks = $latestBooks->take(5);

        return response()->json([
            'stats' => [
                'totalBooks' => $totalBooks,
                'totalUsers' => $totalUsers,
                'totalViews' => (int) $totalViews,
                'totalCategories' => $totalCategories,
            ],
            'bookStatus' => [
                'popular' => $popularBooks,
                'latest' => $latestBooks,
                'least_viewed' => $leastViewedBooks, // Menggunakan array baru
            ],
            'demography' => $demography,
            'recentSidebarBooks' => $recentSidebarBooks,
        ]);
    }
}
