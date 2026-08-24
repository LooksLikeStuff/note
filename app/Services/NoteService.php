<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\NoteKind;
use App\Models\Note;
use App\Models\Tab;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

final class NoteService
{
    public function __construct(
        private readonly TabService $tabService,
    ) {}

    /**
     * @return Collection<int, Note>
     */
    public function listForTab(Tab $tab, ?NoteKind $kind = null): Collection
    {
        $query = $tab->notes()->ordered();

        if ($kind instanceof NoteKind) {
            $query->ofKind($kind);
        }

        return $query->get();
    }

    /**
     * @param  array{title?: string|null, body?: string|null, kind?: NoteKind|string|null}  $data
     */
    public function create(Tab $tab, array $data): Note
    {
        return DB::transaction(function () use ($tab, $data): Note {
            $note = $tab->notes()->create([
                'title' => $data['title'] ?? null,
                'body' => $data['body'] ?? null,
                'kind' => $data['kind'] ?? NoteKind::Regular,
            ]);

            $this->tabService->syncLastNoteAt($tab->refresh());

            return $note->refresh();
        });
    }

    /**
     * @param  array{title?: string|null, body?: string|null, kind?: NoteKind|string|null}  $data
     */
    public function update(Note $note, array $data): Note
    {
        return DB::transaction(function () use ($note, $data): Note {
            $note->fill($data);
            $note->save();

            $this->tabService->syncLastNoteAt($note->tab()->firstOrFail());

            return $note->refresh();
        });
    }

    public function delete(Note $note): void
    {
        DB::transaction(function () use ($note): void {
            $tab = $note->tab()->firstOrFail();

            if ($this->isBlank($note)) {
                $note->delete();
            } elseif ($note->kind === NoteKind::Trash && (bool) config('notes.hard_delete_from_trash')) {
                $note->delete();
            } else {
                $note->forceFill([
                    'kind' => NoteKind::Trash,
                ])->save();
            }

            $this->tabService->syncLastNoteAt($tab->refresh());
        });
    }

    private function isBlank(Note $note): bool
    {
        return trim((string) $note->title) === ''
            && trim((string) $note->body) === '';
    }
}
