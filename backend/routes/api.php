<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\NoticesController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Middleware\AdminMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']); // optional
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
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

// Protected routes: require auth
Route::middleware('auth:api')->group(function () {
    // user management
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store'])->middleware(AdminMiddleware::class);
    Route::put('/users/{id}', [UserController::class, 'update'])->middleware(AdminMiddleware::class);
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware(AdminMiddleware::class);
    Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole'])->middleware(AdminMiddleware::class);
    Route::post('/users/{id}/remove-role', [UserController::class, 'removeRole'])->middleware(AdminMiddleware::class);

    // menus
    Route::post('/menus', [MenuController::class, 'store'])->middleware(AdminMiddleware::class);
    Route::put('/menus/{id}', [MenuController::class, 'update'])->middleware(AdminMiddleware::class);
    Route::delete('/menus/{id}', [MenuController::class, 'destroy'])->middleware(AdminMiddleware::class);

    // hero
    Route::post('/hero', [HeroController::class, 'store'])->middleware(AdminMiddleware::class);
    Route::put('/hero/{id?}', [HeroController::class, 'update'])->middleware(AdminMiddleware::class);
    Route::delete('/hero/{id}', [HeroController::class, 'destroy'])->middleware(AdminMiddleware::class);

    // about
    Route::post('/about', [AboutController::class, 'store'])->middleware(AdminMiddleware::class);
    Route::put('/about/{id}', [AboutController::class, 'update'])->middleware(AdminMiddleware::class);
    Route::delete('/about/{id}', [AboutController::class, 'destroy'])->middleware(AdminMiddleware::class);

    // notices (resource except index)
    Route::post('/notices', [NoticesController::class, 'store'])->middleware(AdminMiddleware::class);
    Route::get('/notices/{id}', [NoticesController::class, 'show']);
    Route::put('/notices/{id}', [NoticesController::class, 'update'])->middleware(AdminMiddleware::class);
    Route::delete('/notices/{id}', [NoticesController::class, 'destroy'])->middleware(AdminMiddleware::class);

    // programs resource
    Route::post('/programs', [ProgramController::class, 'store'])->middleware(AdminMiddleware::class);
    Route::get('/programs/{id}', [ProgramController::class, 'show']);
    Route::put('/programs/{id}', [ProgramController::class, 'update'])->middleware(AdminMiddleware::class);
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy'])->middleware(AdminMiddleware::class);

    // gallery
    Route::post('/gallery', [GalleryController::class, 'store'])->middleware(AdminMiddleware::class);
    Route::get('/gallery/{id}', [GalleryController::class, 'show']);
    Route::put('/gallery/{id}', [GalleryController::class, 'update'])->middleware(AdminMiddleware::class);
    Route::delete('/gallery/{id}', [GalleryController::class, 'destroy'])->middleware(AdminMiddleware::class);

    // teachers
    Route::post('/teachers', [TeacherController::class, 'store'])->middleware(AdminMiddleware::class);
    Route::get('/teachers/{id}', [TeacherController::class, 'show']);
    Route::put('/teachers/{id}', [TeacherController::class, 'update'])->middleware(AdminMiddleware::class);
    Route::delete('/teachers/{id}', [TeacherController::class, 'destroy'])->middleware(AdminMiddleware::class);

    // settings
    Route::post('/settings', [SettingsController::class, 'store'])->middleware(AdminMiddleware::class);
});
