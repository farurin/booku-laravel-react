<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CornerController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\AdminProfileController;
use App\Http\Controllers\Api\AdminBookController;
use App\Http\Controllers\Api\AdminUserController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Tidak butuh Token / Login)
|--------------------------------------------------------------------------
*/

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/categories', [BookController::class, 'getCategories']);
Route::get('/books', [BookController::class, 'getBooks']);
Route::get('/books/{id}/pages', [BookController::class, 'getBookPages']);
Route::post('/books/{id}/view', [App\Http\Controllers\Api\BookController::class, 'incrementView']);

// Avatars bisa diakses publik (misal saat register)
Route::get('/avatars', [UserController::class, 'getAvatars']);
Route::get('/user/avatars', [UserController::class, 'getAvatars']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Wajib menyertakan Token dari Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // --- AUTH ---
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // --- CORNER ROUTES ---
    Route::get('/corner/favorites', [CornerController::class, 'getFavorites']);
    Route::get('/corner/saved', [CornerController::class, 'getSaved']);
    Route::get('/corner/history', [CornerController::class, 'getHistory']);

    // --- USER PROFILE ---
    Route::get('/user/profile', [UserController::class, 'getUserProfile']);
    Route::put('/user/profile', [UserController::class, 'updateUserProfile']);

    // --- FITUR NON-MVP (DI-KOMEN) ---
    // Route::get('/user/characters', [UserController::class, 'getCharacters']);
    // Route::put('/user/active-character', [UserController::class, 'updateActiveCharacter']);
    // Route::get('/user/missions', [UserController::class, 'getMissions']);
    // Route::post('/user/missions/{id}/claim', [UserController::class, 'claimMission']);
    // Route::get('/leaderboard', [UserController::class, 'getLeaderboard']);
    // Route::get('/user/leaderboard', [UserController::class, 'getLeaderboard']);

    // --- BOOK INTERACTION ---
    Route::post('/books/{id}/finish', [BookController::class, 'finishBook']);
    Route::post('/books/{id}/progress', [BookController::class, 'updateProgress']);
    Route::get('/books/{id}/status', [BookController::class, 'getBookStatus']);
    Route::post('/books/{id}/favorite', [BookController::class, 'toggleFavorite']);
    Route::post('/books/{id}/saved', [BookController::class, 'toggleSaved']);
    Route::post('/books/{id}/rate', [BookController::class, 'rateBook']);


    // =========================================================================
    // --- ADMIN ROUTES (Dibatasi oleh Middleware Role) ---
    // =========================================================================

    // 1. AREA UMUM ADMIN (Bisa diakses Super Admin, Admin, dan Editor)
    Route::middleware('role:super_admin,admin,editor')->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'getDashboardStats']);

        // Manajemen Buku
        Route::get('/admin/books', [AdminBookController::class, 'getAdminBooks']);
        Route::post('/admin/books', [AdminBookController::class, 'createBook']);
        Route::get('/admin/books/{id}', [AdminBookController::class, 'getAdminBookDetail']);
        Route::put('/admin/books/{id}/status', [AdminBookController::class, 'updateBookStatus']);

        // PERBAIKAN: Gunakan match put/post untuk update buku
        Route::match(['put', 'post'], '/admin/books/{id}', [AdminBookController::class, 'updateBook']);

        Route::delete('/admin/books/{id}', [AdminBookController::class, 'deleteBook']);

        // Manajemen Scene (Halaman Buku)
        Route::post('/admin/books/{id}/pages', [AdminBookController::class, 'addBookPage']);

        // PERBAIKAN: Gunakan match put/post untuk update scene
        Route::match(['put', 'post'], '/admin/pages/{pageId}', [AdminBookController::class, 'updateBookPage']);
        Route::delete('/admin/pages/{pageId}', [AdminBookController::class, 'deleteBookPage']);

        // Profile Setting Admin
        Route::get('/admin/profile', [AdminProfileController::class, 'getAdminProfile']);

        // Gunakan match put/post untuk update profil
        Route::match(['put', 'post'], '/admin/profile', [AdminProfileController::class, 'updateAdminProfile']);
        Route::put('/admin/profile/password', [AdminProfileController::class, 'updateAdminPassword']);

        // Izin Editor untuk Membaca (GET) Kategori
        Route::get('/admin/categories', [AdminCategoryController::class, 'getAdminCategories']);
    });

    // 2. AREA MANAJERIAL (Hanya untuk Super Admin dan Admin)
    Route::middleware('role:super_admin,admin')->group(function () {
        // Kategori & Tag
        // Rute GET /admin/categories dihapus di sini agar tidak menimpa rute di Area Umum Admin

        Route::post('/admin/categories', [AdminCategoryController::class, 'createCategory']);

        // PERBAIKAN: Gunakan match put/post untuk update kategori
        Route::match(['put', 'post'], '/admin/categories/{id}', [AdminCategoryController::class, 'updateCategory']);

        // Status & Delete Kategori
        Route::put('/admin/categories/{id}/status', [AdminCategoryController::class, 'updateCategoryStatus']);
        Route::delete('/admin/categories/{id}', [AdminCategoryController::class, 'deleteCategory']);

        // Izin Admin untuk membaca data user (keperluan fitur Backup)
        Route::get('/admin/users', [AdminUserController::class, 'getAllUsers']);
    });

    // 3. AREA SUPER ADMIN (Strictly Super Admin Only)
    Route::middleware('role:super_admin')->group(function () {
        // Manajemen Pengguna (Aksi merubah data hanya untuk Super Admin)
        Route::post('/admin/users', [AdminUserController::class, 'createAdminUser']);
        Route::put('/admin/users/{id}', [AdminUserController::class, 'updateAdminUser']);
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'deleteAdminUser']);
    });
});
