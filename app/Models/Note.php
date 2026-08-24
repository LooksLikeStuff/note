<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\NoteKind;
use Database\Factories\NoteFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $tab_id
 * @property string|null $title
 * @property string|null $body
 * @property NoteKind $kind
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Note extends Model
{
    /** @use HasFactory<NoteFactory> */
    use HasFactory;
    use HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'tab_id',
        'title',
        'body',
        'kind',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kind' => NoteKind::class,
        ];
    }

    /**
     * @return BelongsTo<Tab, $this>
     */
    public function tab(): BelongsTo
    {
        return $this->belongsTo(Tab::class);
    }

    /**
     * @param  Builder<Note>  $query
     * @return Builder<Note>
     */
    public function scopeOfKind(Builder $query, NoteKind $kind): Builder
    {
        return $query->where('kind', $kind);
    }

    /**
     * @param  Builder<Note>  $query
     * @return Builder<Note>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('updated_at');
    }
}
