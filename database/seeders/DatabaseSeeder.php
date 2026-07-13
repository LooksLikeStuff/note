<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\NoteKind;
use App\Models\Note;
use App\Models\Tab;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $inbox = Tab::query()->create([
            'title' => 'Входящие',
            'position' => 0,
            'last_note_at' => now(),
        ]);

        Note::query()->create([
            'tab_id' => $inbox->id,
            'title' => 'Добро пожаловать',
            'body' => "Сюда можно скидывать мусорные заметки и помечать важное.\nНажми + чтобы открыть ещё одну вкладку.",
            'kind' => NoteKind::Important,
        ]);

        Note::query()->create([
            'tab_id' => $inbox->id,
            'title' => 'Пример мусора',
            'body' => 'Купить молоко / не забыть зарядку',
            'kind' => NoteKind::Regular,
        ]);
    }
}
