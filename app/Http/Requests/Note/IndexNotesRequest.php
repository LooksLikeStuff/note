<?php

declare(strict_types=1);

namespace App\Http\Requests\Note;

use App\Enums\NoteKind;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class IndexNotesRequest extends FormRequest
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
            'kind' => [
                'sometimes',
                'nullable',
                Rule::enum(NoteKind::class),
            ],
        ];
    }
}
