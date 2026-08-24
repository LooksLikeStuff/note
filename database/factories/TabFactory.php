<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Tab;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tab>
 */
class TabFactory extends Factory
{
    protected $model = Tab::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->words(2, true),
            'position' => fake()->numberBetween(0, 20),
            'last_note_at' => fake()->optional()->dateTimeBetween('-1 month'),
        ];
    }
}
