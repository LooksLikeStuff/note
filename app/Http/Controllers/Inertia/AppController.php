<?php

declare(strict_types=1);

namespace App\Http\Controllers\Inertia;

use Inertia\Inertia;
use Inertia\Response;

final class AppController
{
    public function index(): Response
    {
        return Inertia::render('Notes/Index');
    }
}
