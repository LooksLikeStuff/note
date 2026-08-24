<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Note;
use App\Models\User;

/**
 * MVP: auth ещё нет — все действия разрешены.
 */
final class NotePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Note $note): bool
    {
        return true;
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function update(?User $user, Note $note): bool
    {
        return true;
    }

    public function delete(?User $user, Note $note): bool
    {
        return true;
    }
}
