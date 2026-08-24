<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Note;
use App\Models\Tab;
use App\Policies\NotePolicy;
use App\Policies\TabPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Tab::class, TabPolicy::class);
        Gate::policy(Note::class, NotePolicy::class);
    }
}
