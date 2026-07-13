<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Tab;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Tab
 */
final class TabResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'position' => $this->position,
            'last_note_at' => $this->last_note_at?->toIso8601String(),
            'notes_count' => $this->whenCounted('notes'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
