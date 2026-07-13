<?php

declare(strict_types=1);

use App\Http\Controllers\Inertia\AppController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AppController::class, 'index'])->name('home');
