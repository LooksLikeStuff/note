<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\TabFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $title
 * @property int $position
 * @property Carbon|null $last_note_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Tab extends Model
{
    /** @use HasFactory<TabFactory> */
    use HasFactory;
    use HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'position',
        'last_note_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'last_note_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<Note, $this>
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    /**
     * @param  Builder<Tab>  $query
     * @return Builder<Tab>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderByRaw('last_note_at IS NULL')
            ->orderByDesc('last_note_at')
            ->orderBy('position');
    }
}
