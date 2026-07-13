<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\NoteKind;
use App\Http\Controllers\Controller;
use App\Http\Requests\Note\IndexNotesRequest;
use App\Http\Requests\Note\StoreNoteRequest;
use App\Http\Requests\Note\UpdateNoteRequest;
use App\Http\Resources\NoteResource;
use App\Models\Note;
use App\Models\Tab;
use App\Services\NoteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use OpenApi\Attributes as OA;

final class NoteController extends Controller
{
    public function __construct(
        private readonly NoteService $noteService,
    ) {}

    #[OA\Get(
        path: '/tabs/{tab}/notes',
        summary: 'Список заметок вкладки',
        tags: ['Notes'],
        parameters: [
            new OA\Parameter(
                name: 'tab',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid'),
            ),
            new OA\Parameter(
                name: 'kind',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', enum: ['regular', 'important', 'trash']),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(ref: '#/components/schemas/NoteResource'),
                        ),
                    ],
                ),
            ),
        ],
    )]
    public function index(IndexNotesRequest $request, Tab $tab): AnonymousResourceCollection
    {
        $this->authorize('view', $tab);

        $kind = $request->validated('kind');

        return NoteResource::collection(
            $this->noteService->listForTab(
                $tab,
                is_string($kind) ? NoteKind::from($kind) : null,
            ),
        );
    }

    #[OA\Post(
        path: '/tabs/{tab}/notes',
        summary: 'Создать заметку',
        tags: ['Notes'],
        parameters: [
            new OA\Parameter(
                name: 'tab',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid'),
            ),
        ],
        requestBody: new OA\RequestBody(
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string', nullable: true, maxLength: 120),
                    new OA\Property(property: 'body', type: 'string', nullable: true, maxLength: 20000),
                    new OA\Property(property: 'kind', type: 'string', enum: ['regular', 'important', 'trash']),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Created',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/NoteResource'),
                    ],
                ),
            ),
        ],
    )]
    public function store(StoreNoteRequest $request, Tab $tab): JsonResponse
    {
        $this->authorize('create', Note::class);

        $note = $this->noteService->create($tab, $request->validated());

        return (new NoteResource($note))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    #[OA\Patch(
        path: '/notes/{note}',
        summary: 'Обновить заметку',
        tags: ['Notes'],
        parameters: [
            new OA\Parameter(
                name: 'note',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid'),
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string', nullable: true, maxLength: 120),
                    new OA\Property(property: 'body', type: 'string', nullable: true, maxLength: 20000),
                    new OA\Property(property: 'kind', type: 'string', enum: ['regular', 'important', 'trash']),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/NoteResource'),
                    ],
                ),
            ),
        ],
    )]
    public function update(UpdateNoteRequest $request, Note $note): NoteResource
    {
        $this->authorize('update', $note);

        return new NoteResource(
            $this->noteService->update($note, $request->validated()),
        );
    }

    #[OA\Delete(
        path: '/notes/{note}',
        summary: 'Удалить заметку (в корзину или окончательно из корзины)',
        tags: ['Notes'],
        parameters: [
            new OA\Parameter(
                name: 'note',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid'),
            ),
        ],
        responses: [
            new OA\Response(response: 204, description: 'No Content'),
        ],
    )]
    public function destroy(Note $note): Response
    {
        $this->authorize('delete', $note);
        $this->noteService->delete($note);

        return response()->noContent();
    }
}
