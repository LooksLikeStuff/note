<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Enums\NoteKind;
use App\Models\Note;
use App\Models\Tab;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class NoteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_note_and_updates_tab_last_note_at(): void
    {
        $tab = Tab::factory()->create(['last_note_at' => null]);

        $response = $this->postJson('/api/tabs/'.$tab->id.'/notes', [
            'title' => 'Hello',
            'body' => 'World',
            'kind' => NoteKind::Important->value,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.title', 'Hello')
            ->assertJsonPath('data.kind', NoteKind::Important->value);

        $this->assertNotNull($tab->fresh()->last_note_at);
    }

    public function test_lists_notes_ordered_by_updated_at_and_filters_by_kind(): void
    {
        $tab = Tab::factory()->create();
        $regular = Note::factory()->for($tab)->create([
            'kind' => NoteKind::Regular,
            'updated_at' => now()->subHour(),
        ]);
        $important = Note::factory()->for($tab)->important()->create([
            'updated_at' => now(),
        ]);
        Note::factory()->for($tab)->trash()->create();

        $this->getJson('/api/tabs/'.$tab->id.'/notes')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $filtered = $this->getJson('/api/tabs/'.$tab->id.'/notes?kind=important');
        $filtered->assertOk()->assertJsonCount(1, 'data');
        $this->assertSame($important->id, $filtered->json('data.0.id'));

        $all = $this->getJson('/api/tabs/'.$tab->id.'/notes');
        $ids = collect($all->json('data'))->pluck('id')->all();
        $this->assertSame($important->id, $ids[0]);
        $this->assertContains($regular->id, $ids);
    }

    public function test_delete_blank_note_hard_deletes(): void
    {
        $tab = Tab::factory()->create();
        $note = Note::factory()->for($tab)->create([
            'title' => '',
            'body' => null,
            'kind' => NoteKind::Regular,
        ]);

        $this->deleteJson('/api/notes/'.$note->id)->assertNoContent();

        $this->assertDatabaseMissing('notes', ['id' => $note->id]);
    }

    public function test_delete_moves_to_trash_then_hard_deletes(): void
    {
        $tab = Tab::factory()->create();
        $note = Note::factory()->for($tab)->create(['kind' => NoteKind::Regular]);

        $this->deleteJson('/api/notes/'.$note->id)->assertNoContent();
        $this->assertSame(NoteKind::Trash, $note->fresh()->kind);

        $this->deleteJson('/api/notes/'.$note->id)->assertNoContent();
        $this->assertDatabaseMissing('notes', ['id' => $note->id]);
    }

    public function test_updates_note(): void
    {
        $note = Note::factory()->create(['title' => 'Old']);

        $this->patchJson('/api/notes/'.$note->id, [
            'title' => 'New',
            'body' => 'Updated',
            'kind' => NoteKind::Important->value,
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'New')
            ->assertJsonPath('data.kind', NoteKind::Important->value);
    }
}
