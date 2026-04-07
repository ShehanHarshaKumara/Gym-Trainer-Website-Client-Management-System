<?php

use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\FeedbackController;
use App\Http\Controllers\Api\Admin\PackageController;
use App\Http\Controllers\Api\Admin\TrainerProfileController;
use App\Http\Controllers\Api\Admin\TransformationController;
use App\Http\Controllers\Api\Admin\ClientController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\PublicSiteController;
use Illuminate\Support\Facades\Route;

Route::get('/site', [PublicSiteController::class, 'home']);
Route::get('/trainer-profile', [PublicSiteController::class, 'trainerProfile']);
Route::get('/packages', [PublicSiteController::class, 'packages']);
Route::get('/transformations', [PublicSiteController::class, 'transformations']);
Route::get('/feedback', [PublicSiteController::class, 'feedback']);
Route::post('/feedback', [PublicSiteController::class, 'submitFeedback']);
Route::post('/contact-messages', [PublicSiteController::class, 'submitContactMessage']);

Route::prefix('admin')->group(function (): void {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::apiResource('/packages', PackageController::class);
        Route::apiResource('/clients', ClientController::class);
        Route::apiResource('/transformations', TransformationController::class);
        Route::apiResource('/feedback', FeedbackController::class);
        Route::apiResource('/contact-messages', ContactMessageController::class);

        Route::get('/trainer-profile', [TrainerProfileController::class, 'show']);
        Route::put('/trainer-profile', [TrainerProfileController::class, 'update']);
    });
});
