<?php

declare(strict_types=1);

namespace App\Http\Requests\Tab;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class ReorderTabsRequest extends FormRequest
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
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'uuid', Rule::exists('tabs', 'id')],
        ];
    }
}
