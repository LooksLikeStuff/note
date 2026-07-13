# Note

Личное веб-приложение для быстрых заметок: вкладки как в браузере, внутри каждой — список заметок (обычные / важные / мусор). Без регистрации в MVP.

Клиенты общаются только через **REST API** (+ Swagger). Web UI — React SPA на axios. Тот же API рассчитан на будущее Flutter-приложение.

## Стек

- Backend: Laravel 12 + PHP 8.2+ (REST API)
- Docs: OpenAPI / Swagger (l5-swagger)
- Web UI: React + TypeScript + Tailwind CSS 4 (Vite SPA)
- БД: SQLite локально (совместимо с MySQL/Postgres через Eloquent)

## Запуск

```bash
composer install
cp .env.example .env   # если ещё нет
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed   # опционально: вкладка «Входящие» с примерами
npm install
composer run dev
```

- Web SPA: http://127.0.0.1:8000
- REST API: http://127.0.0.1:8000/api/...
- Swagger UI: http://127.0.0.1:8000/api/documentation

Перегенерация OpenAPI:

```bash
php artisan l5-swagger:generate
```

CORS для внешних клиентов (Flutter / отдельный фронт) — `CORS_ALLOWED_ORIGINS` в `.env` (по умолчанию `*`).

## Возможности MVP

- Бесконечные вкладки (`+`), переименование (двойной клик), закрытие
- Заметки: `regular` (мусор), `important`, `trash`
- Сортировка вкладок по `last_note_at`, заметок по `updated_at`
- Полноэкранный режим
- Активная вкладка сохраняется в `localStorage`

## Архитектура backend

`Controller → FormRequest → Service → Model`, ответ через `Resource`, права через `Policy`, Swagger-атрибуты над методами API-контроллеров.

Конфиг лимитов: [`config/notes.php`](config/notes.php).

## Git workflow

Полные правила: [`rules/git-flow.txt`](rules/git-flow.txt).

- Интеграционная ветка: **`dev`**. В `main` мержит только владелец репозитория.
- На каждую задачу — ветка `feature/<slug>` или `chore/<slug>` от `dev`.
- После готовности: commit → push ветки → merge в `dev` → push `dev`.
- Не пушить напрямую в `main`, не делать force-push.

```bash
git checkout dev
git pull
git checkout -b feature/my-task
# ... работа, коммиты ...
git push -u origin HEAD
git checkout dev
git merge feature/my-task
git push origin dev
```
