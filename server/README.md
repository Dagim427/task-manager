# Server — Task Manager API

This folder contains the Express API for the Task Manager application. It provides authentication, task CRUD, validation, and basic error handling for a single-user-per-account task store backed by SQLite.

## Requirements

- Node.js 18+ and npm
- SQLite (local file used by default)

## Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Create environment variables (create a `.env` file in `server/`):

```
PORT=3000
DATABASE_URL=./dev.sqlite
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

3. Initialize / migrate the database:

```bash
node scripts/migrate.js
```

The migrations are in `server/migrations/` (e.g., `001_create_users_table.sql`, `002_create_tasks_table.sql`).

## Available scripts

Run in the `server/` directory.

- `npm run dev` — start the server in development (nodemon or equivalent)
- `npm start` — start the server (production)
- `npm test` — run Jest tests
- `node scripts/migrate.js` — apply SQL migrations

## Running (development)

```bash
cd server
npm run dev
```

By default the API will run at `http://localhost:3000` (or the `PORT` you set).

## Tests

Server tests use Jest and are located under `server/tests/`.

```bash
cd server
npm test
```

If tests require a separate test database, set `DATABASE_URL` or `TEST_DATABASE_URL` appropriately before running tests.

## Key files & structure

- `src/app.js` — Express app setup and middleware
- `src/routes/` — API route definitions (`auth.routes.js`, `task.routes.js`)
- `src/controllers/` — controllers handling request/response
- `src/services/` — business logic and DB interactions
- `src/models/` — model helpers and mapping
- `src/middleware/` — auth, validation, error handlers
- `src/validators/` — request validators
- `scripts/migrate.js` — runs SQL migrations
- `migrations/` — SQL migration files

## API (summary)

See the project's `docs/api.md` for detailed examples. Quick reference:

- `POST /api/auth/register` — register new user
- `POST /api/auth/login` — login, returns JWT
- `GET /api/tasks` — list tasks (authenticated)
- `POST /api/tasks` — create task
- `GET /api/tasks/:id` — get task
- `PUT /api/tasks/:id` — update task
- `DELETE /api/tasks/:id` — delete task

Include the `Authorization: Bearer <token>` header for protected endpoints.

## Environment variables

- `PORT` — server port
- `DATABASE_URL` — path/URL to SQLite DB (e.g. `./dev.sqlite`)
- `JWT_SECRET` — secret for signing JWTs
- `NODE_ENV` — `development` / `production` / `test`

## Logging & errors

The project uses `src/config/logger.js` for logging and `src/middleware/error.middleware.js` for centralized error handling. Check these files when troubleshooting.

## Development notes

- Keep business logic in `src/services/` and thin controllers.
- Use validators under `src/validators/` to keep request validation consistent.
- Add tests for edge cases in `server/tests/` when introducing new behavior.

## Contributing

If you change DB schema, add a new migration to `server/migrations/` and update `scripts/migrate.js` if needed. Add or update tests in `server/tests/` for new behavior.

## Troubleshooting

- If migrations fail, inspect `server/migrations/` SQL and ensure `DATABASE_URL` points to a writable location.
- For JWT issues, confirm `JWT_SECRET` matches between processes.

---

If you want, I can also add example curl commands for auth and task flows to this file or expand `docs/api.md` with request/response examples.
