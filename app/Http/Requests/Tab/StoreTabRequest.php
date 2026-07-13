<?php

declare(strict_types=1);

namespace App\Http\Requests\Tab;

use Illuminate\Foundation\Http\FormRequest;

final class StoreTabRequest extends FormRequest
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
        ];
    }
}
