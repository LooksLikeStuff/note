<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Tab;
use App\Models\User;

/**
 * MVP: auth ещё нет — все действия разрешены.
 */
final class TabPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Tab $tab): bool
    {
        return true;
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function update(?User $user, Tab $tab): bool
    {
        return true;
    }

    public function delete(?User $user, Tab $tab): bool
    {
        return true;
    }
}
