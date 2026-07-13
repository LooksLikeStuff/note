<?php

declare(strict_types=1);

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Note API',
    description: 'JSON API для вкладок и заметок',
)]
#[OA\Server(url: '/api', description: 'API')]
final class OpenApiSpec {}
