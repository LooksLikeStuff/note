# Note

Личное веб-приложение для быстрых заметок: вкладки как в браузере, внутри каждой — список заметок (обычные / важные / мусор). Без регистрации в MVP.

## Стек

- Laravel 12 + PHP 8.2+
- Inertia.js + React + TypeScript
- Tailwind CSS 4
- OpenAPI (l5-swagger)

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

- Приложение: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/api/documentation

Перегенерация OpenAPI:

```bash
php artisan l5-swagger:generate
```

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
