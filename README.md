# Task Manager

A simple full-stack task manager application (Express + SQLite backend, React + Vite frontend) used for learning and demonstration purposes.

## Tech stack

- Server: Node.js, Express, SQLite (via `sqlite3`), Knex-style migrations (scripts/)
- Client: React, Vite
- Testing: Jest (server), React Testing Library (client)

## Repository layout

- `server/` — Express API, models, controllers, services, validators, and tests
- `client/` — React single-page app built with Vite
- `docs/` — API and architecture notes

## Requirements

- Node.js 18+ (or your project's target version)
- npm or yarn

## Quick start (development)

1. Install dependencies for server and client:

```bash
# from repository root
cd server
npm install

cd ../client
npm install
```

2. Environment variables

Create a `.env` file for the server (see `server/src/config/env.js`) with at minimum:

```
PORT=3000
DATABASE_URL=./dev.sqlite
JWT_SECRET=your_jwt_secret
```

3. Run database migrations (server):

```bash
cd server
node scripts/migrate.js
```

4. Run the server and client for development:

```bash
# in one terminal
cd server
npm run dev

# in another terminal
cd client
npm run dev
```

The client should be available at `http://localhost:5173` (Vite default) and the API at the configured server `PORT` (default `3000`).

## Running tests

Server unit/integration tests (Jest):

```bash
cd server
npm test
```

Client tests (React Testing Library):

```bash
cd client
npm test
```

## API

See `docs/api.md` for endpoint documentation and examples. In brief, the API exposes:

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — authenticate and get a JWT
- `GET /api/tasks` — list tasks for the authenticated user
- `POST /api/tasks` — create a task
- `GET /api/tasks/:id` — get a task
- `PUT /api/tasks/:id` — update a task
- `DELETE /api/tasks/:id` — delete a task

API requests require the `Authorization: Bearer <token>` header where applicable.

## Database

- Migrations are in `server/migrations/` and applied with `node scripts/migrate.js`.
- The project uses a local SQLite file by default — change `DATABASE_URL` to point elsewhere if desired.

## Environment variables reference

- `PORT` — server port
- `DATABASE_URL` — path/URL to the SQLite DB
- `JWT_SECRET` — secret for signing JWTs

## Development notes & suggestions

- The server uses modular controllers/services/validators — keep business logic in `services/` and routing in `routes/`.
- Add integration tests for authentication and task flows if you expand endpoints.
- Consider adding a `docker-compose` file if you want reproducible dev environments.

## Contributing

Contributions are welcome. Please open issues for bugs or feature requests and submit pull requests with clear descriptions and tests where applicable.

## License

This project is provided for demonstration and learning. Add a license file if you intend to publish or share under a specific license.
