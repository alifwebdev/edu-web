<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\NoticesController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\SettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
;
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Public GET endpoints
Route::get('/users', [UserController::class, 'index']);
Route::get('/menus', [MenuController::class, 'index']);
Route::get('/hero', [HeroController::class, 'index']);
Route::get('/about', [AboutController::class, 'index']);
Route::get('/notices', [NoticesController::class, 'index']);
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/teachers', [TeacherController::class, 'index']);
Route::get('/settings', [SettingsController::class, 'index']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole']);
    Route::post('/users/{id}/remove-role', [UserController::class, 'removeRole']);

    // Admin-only edit routes (policies also protect these)
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{id}', [MenuController::class, 'update']);
    Route::delete('/menus/{id}', [MenuController::class, 'destroy']);

    Route::post('/hero', [HeroController::class, 'store']);
    Route::put('/hero/{id?}', [HeroController::class, 'update']);
    Route::delete('/hero/{id}', [HeroController::class, 'destroy']);

    Route::post('/about', [AboutController::class, 'store']);
    Route::put('/about/{id}', [AboutController::class, 'update']);
    Route::delete('/about/{id}', [AboutController::class, 'destroy']);

    Route::apiResource('notices', NoticesController::class)->except(['index']);
    Route::apiResource('programs', ProgramController::class);
    Route::apiResource('gallery', GalleryController::class);
    Route::apiResource('teachers', TeacherController::class);

    Route::post('/settings', [SettingsController::class, 'store']);
});
