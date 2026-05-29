<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CornerController extends Controller
{
    public function getFavorites(Request $request)
    {
        $userId = $request->user()->id;

        $favorites = DB::table('user_favorites as uf')
            ->join('books as b', 'uf.id_book', '=', 'b.id')
            ->leftJoin('categories as c', 'b.id_categories', '=', 'c.id')
            ->where('uf.id_user', $userId)
            ->where('b.status', 'terbit')
            ->select('b.*', 'c.name_id as category_name_id', 'c.name_en as category_name_en', 'c.color_hex as category_color')
            ->get();

        return response()->json($favorites);
    }

    public function getSaved(Request $request)
    {
        $userId = $request->user()->id;

        $saved = DB::table('user_saved as us')
            ->join('books as b', 'us.id_book', '=', 'b.id')
            ->leftJoin('categories as c', 'b.id_categories', '=', 'c.id')
            ->where('us.id_user', $userId)
            ->where('b.status', 'terbit')
            ->select('b.*', 'us.saved_at', 'c.name_id as category_name_id', 'c.name_en as category_name_en', 'c.color_hex as category_color')
            ->orderBy('us.saved_at', 'desc')
            ->get();

        return response()->json($saved);
    }

    public function getHistory(Request $request)
    {
        $userId = $request->user()->id;

        $history = DB::table('user_progress as up')
            ->join('books as b', 'up.id_book', '=', 'b.id')
            ->leftJoin('categories as c', 'b.id_categories', '=', 'c.id')
            ->where('up.id_user', $userId)
            ->where('b.status', 'terbit')
            ->select('b.*', 'up.reading_progress', 'up.last_read_at', 'c.name_id as category_name_id', 'c.name_en as category_name_en', 'c.color_hex as category_color')
            ->orderBy('up.last_read_at', 'desc')
            ->get();

        return response()->json($history);
    }
}
