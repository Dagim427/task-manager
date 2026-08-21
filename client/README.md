# Client — Task Manager (React + Vite)

This folder contains the front-end single-page application for the Task Manager project, implemented with React and Vite.

## Purpose

- Provide a clean UI for users to register, log in, and manage tasks.
- Communicate with the server API for authentication and task CRUD operations.

## Prerequisites

- Node.js 18+ and npm (or yarn)
- A running server API (see `../server/README.md`) or set `VITE_API_URL` to a reachable API endpoint.

## Setup

```bash
cd client
npm install
```

## Environment variables

Create a `.env` file in `client/` for local overrides. Common variables:

```
VITE_API_URL=http://localhost:3000/api
```

Vite exposes variables prefixed with `VITE_` to the client bundle.

## Development (run)

```bash
cd client
npm run dev
```

The dev server typically runs on `http://localhost:5173`.

## Build (production)

```bash
cd client
npm run build
npm run preview
```

`npm run build` produces a `dist/` folder ready for static hosting.

## Tests

Client unit and component tests use React Testing Library.

```bash
cd client
npm test
```

See `src/components/` and `src/hooks/` for example tests.

## Project structure

- `index.html` — app entry HTML
- `src/main.jsx` — app bootstrap
- `src/App.jsx` — top-level routes and providers
- `src/components/` — shared and feature components (`task/`, `common/`, `ui/`)
- `src/pages/` — page-level route components
- `src/services/` — API clients and services (`api.js`, `auth.service.js`, `task.service.js`)
- `src/hooks/` — React hooks (e.g. `useTasks.js`)
- `public/` — static assets

## Key dev notes

- Keep UI logic in components and side effects in hooks (e.g. `useTasks`).
- `src/services/api.js` centralizes HTTP configuration and authorization header handling.
- Prefer testing the behavior of components using React Testing Library rather than implementation details.

## API integration

The client calls the API under `VITE_API_URL`. The main auth flow:

1. `POST /auth/login` — returns JWT
2. Client stores token (in memory or secure storage) and attaches `Authorization: Bearer <token>` for protected requests

Important: avoid storing long-lived secrets in `localStorage` for production apps without secure refresh flows.

## Styling

Global styles are under `src/styles/index.css`. Replace or extend with your preferred CSS strategy (CSS modules, Tailwind, etc.) if needed.

## Linting & Formatting

See `eslint.config.js` in the client root. Run linters or formatters as part of CI or pre-commit if configured.

## Contributing

- Add components under `src/components/` and pages under `src/pages/`.
- Add/update tests alongside components.
- Run `npm run dev` locally and ensure all tests pass before submitting PRs.

## Example requests (quick)

Authenticate and list tasks (replace `VITE_API_URL` and credentials):

```bash
# obtain token
curl -X POST $VITE_API_URL/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"secret"}'

# list tasks
curl -H "Authorization: Bearer <token>" $VITE_API_URL/tasks
```

---

If you want, I can add step-by-step examples for common flows (register/login/create task) and include them in this file or `docs/api.md`.
