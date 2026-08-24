<?php

declare(strict_types=1);

namespace App\Enums;

enum NoteKind: string
{
    case Regular = 'regular';
    case Important = 'important';
    case Trash = 'trash';
}
