# Note

Личное веб-приложение для быстрых заметок: вкладки как в браузере, внутри каждой — список заметок (обычные / важные / мусор).

## Стек

- Laravel 12 + PHP 8.2+
- Inertia.js + React + TypeScript
- Tailwind CSS 4

## Запуск

```bash
composer install
cp .env.example .env   # если ещё нет
php artisan key:generate
php artisan migrate
npm install
composer run dev
```

Приложение: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Git workflow

- Интеграционная ветка: **`dev`**. В `main` мержит только владелец репозитория.
- На каждую задачу — ветка `feature/<slug>` или `chore/<slug>` от `dev`.
- После готовности: commit → push ветки → merge в `dev` → push `dev`.
- Не пушить напрямую в `main`, не делать force-push.

### Пример

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
