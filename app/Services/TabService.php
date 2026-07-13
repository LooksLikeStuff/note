<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tab;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

final class TabService
{
    /**
     * @return Collection<int, Tab>
     */
    public function list(): Collection
    {
        return Tab::query()
            ->withCount('notes')
            ->ordered()
            ->get();
    }

    public function create(?string $title = null): Tab
    {
        $nextPosition = (int) Tab::query()->max('position') + 1;

        return Tab::query()->create([
            'title' => $title ?: (string) config('notes.default_tab_title'),
            'position' => $nextPosition,
            'last_note_at' => null,
        ]);
    }

    /**
     * @param  array{title?: string, position?: int}  $data
     */
    public function update(Tab $tab, array $data): Tab
    {
        $tab->fill($data);
        $tab->save();

        return $tab->refresh()->loadCount('notes');
    }

    /**
     * @param  list<string>  $orderedIds
     * @return Collection<int, Tab>
     */
    public function reorder(array $orderedIds): Collection
    {
        DB::transaction(function () use ($orderedIds): void {
            foreach ($orderedIds as $index => $tabId) {
                Tab::query()
                    ->whereKey($tabId)
                    ->update(['position' => $index]);
            }
        });

        return $this->list();
    }

    public function delete(Tab $tab): void
    {
        $tab->delete();
    }

    public function syncLastNoteAt(Tab $tab): void
    {
        $latest = $tab->notes()->max('updated_at');

        $tab->forceFill([
            'last_note_at' => $latest,
        ])->save();
    }
}
