<?php

declare(strict_types=1);

use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\TabController;
use Illuminate\Support\Facades\Route;

Route::get('/tabs', [TabController::class, 'index']);
Route::post('/tabs', [TabController::class, 'store']);
Route::patch('/tabs/reorder', [TabController::class, 'reorder']);
Route::patch('/tabs/{tab}', [TabController::class, 'update']);
Route::delete('/tabs/{tab}', [TabController::class, 'destroy']);

Route::get('/tabs/{tab}/notes', [NoteController::class, 'index']);
Route::post('/tabs/{tab}/notes', [NoteController::class, 'store']);
Route::patch('/notes/{note}', [NoteController::class, 'update']);
Route::delete('/notes/{note}', [NoteController::class, 'destroy']);
