<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tab\ReorderTabsRequest;
use App\Http\Requests\Tab\StoreTabRequest;
use App\Http\Requests\Tab\UpdateTabRequest;
use App\Http\Resources\TabResource;
use App\Models\Tab;
use App\Services\TabService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use OpenApi\Attributes as OA;

final class TabController extends Controller
{
    public function __construct(
        private readonly TabService $tabService,
    ) {}

    #[OA\Get(
        path: '/tabs',
        summary: 'Список вкладок',
        tags: ['Tabs'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(ref: '#/components/schemas/TabResource'),
                        ),
                    ],
                ),
            ),
        ],
    )]
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Tab::class);

        return TabResource::collection($this->tabService->list());
    }

    #[OA\Post(
        path: '/tabs',
        summary: 'Создать вкладку',
        tags: ['Tabs'],
        requestBody: new OA\RequestBody(
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string', nullable: true, maxLength: 120),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Created',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/TabResource'),
                    ],
                ),
            ),
        ],
    )]
    public function store(StoreTabRequest $request): JsonResponse
    {
        $tab = $this->tabService->create($request->validated('title'));

        return (new TabResource($tab->loadCount('notes')))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    #[OA\Patch(
        path: '/tabs/{tab}',
        summary: 'Обновить вкладку',
        tags: ['Tabs'],
        parameters: [
            new OA\Parameter(
                name: 'tab',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid'),
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string', maxLength: 120),
                    new OA\Property(property: 'position', type: 'integer', minimum: 0),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/TabResource'),
                    ],
                ),
            ),
        ],
    )]
    public function update(UpdateTabRequest $request, Tab $tab): TabResource
    {
        $this->authorize('update', $tab);

        return new TabResource(
            $this->tabService->update($tab, $request->validated()),
        );
    }

    #[OA\Delete(
        path: '/tabs/{tab}',
        summary: 'Удалить вкладку',
        tags: ['Tabs'],
        parameters: [
            new OA\Parameter(
                name: 'tab',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid'),
            ),
        ],
        responses: [
            new OA\Response(response: 204, description: 'No Content'),
        ],
    )]
    public function destroy(Tab $tab): Response
    {
        $this->authorize('delete', $tab);
        $this->tabService->delete($tab);

        return response()->noContent();
    }

    #[OA\Patch(
        path: '/tabs/reorder',
        summary: 'Изменить порядок вкладок',
        tags: ['Tabs'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['ids'],
                properties: [
                    new OA\Property(
                        property: 'ids',
                        type: 'array',
                        items: new OA\Items(type: 'string', format: 'uuid'),
                    ),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(ref: '#/components/schemas/TabResource'),
                        ),
                    ],
                ),
            ),
        ],
    )]
    public function reorder(ReorderTabsRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Tab::class);

        return TabResource::collection(
            $this->tabService->reorder($request->validated('ids')),
        );
    }
}
