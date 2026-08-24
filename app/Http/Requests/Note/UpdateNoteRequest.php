<?php

declare(strict_types=1);

namespace App\Http\Requests\Note;

use App\Enums\NoteKind;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'sometimes',
                'nullable',
                'string',
                'max:'.(int) config('notes.title_max_length'),
            ],
            'body' => [
                'sometimes',
                'nullable',
                'string',
                'max:'.(int) config('notes.body_max_length'),
            ],
            'kind' => [
                'sometimes',
                Rule::enum(NoteKind::class),
            ],
        ];
    }
}
