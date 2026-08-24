<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\NoteKind;
use App\Models\Note;
use App\Models\Tab;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Note>
 */
class NoteFactory extends Factory
{
    protected $model = Note::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tab_id' => Tab::factory(),
            'title' => fake()->sentence(3),
            'body' => fake()->paragraph(),
            'kind' => NoteKind::Regular,
        ];
    }

    public function important(): static
    {
        return $this->state(fn (): array => [
            'kind' => NoteKind::Important,
        ]);
    }

    public function trash(): static
    {
        return $this->state(fn (): array => [
            'kind' => NoteKind::Trash,
        ]);
    }
}
