<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Enums\NoteKind;
use App\Models\Note;
use App\Models\Tab;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class TabApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_tabs_sorted_by_last_note_at_desc_with_nulls_last(): void
    {
        $older = Tab::factory()->create([
            'title' => 'Older',
            'last_note_at' => now()->subDay(),
            'position' => 0,
        ]);
        $newer = Tab::factory()->create([
            'title' => 'Newer',
            'last_note_at' => now(),
            'position' => 1,
        ]);
        $empty = Tab::factory()->create([
            'title' => 'Empty',
            'last_note_at' => null,
            'position' => 2,
        ]);

        $response = $this->getJson('/api/tabs');

        $response->assertOk();
        $ids = collect($response->json('data'))->pluck('id')->all();

        $this->assertSame([$newer->id, $older->id, $empty->id], $ids);
    }

    public function test_creates_tab_with_default_title(): void
    {
        $response = $this->postJson('/api/tabs');

        $response
            ->assertCreated()
            ->assertJsonPath('data.title', config('notes.default_tab_title'));

        $this->assertDatabaseCount('tabs', 1);
    }

    public function test_updates_and_deletes_tab(): void
    {
        $tab = Tab::factory()->create(['title' => 'Draft']);

        $this->patchJson('/api/tabs/'.$tab->id, ['title' => 'Work'])
            ->assertOk()
            ->assertJsonPath('data.title', 'Work');

        $this->deleteJson('/api/tabs/'.$tab->id)
            ->assertNoContent();

        $this->assertDatabaseMissing('tabs', ['id' => $tab->id]);
    }

    public function test_reorders_tabs(): void
    {
        $first = Tab::factory()->create(['position' => 0]);
        $second = Tab::factory()->create(['position' => 1]);

        $this->patchJson('/api/tabs/reorder', [
            'ids' => [$second->id, $first->id],
        ])->assertOk();

        $this->assertSame(0, $second->fresh()->position);
        $this->assertSame(1, $first->fresh()->position);
    }
}
