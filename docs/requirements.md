# Task Manager Requirements and Setup

## 1. Overview

This project is a full-stack task management application with:

- a React + Vite frontend in the `client` folder
- an Express.js backend in the `server` folder
- a MySQL database for persistent data
- JWT-based authentication for protected routes
- CRUD operations for user tasks

The application allows users to register, log in, manage tasks, and keep track of task status, priority, and due dates.

---

## 2. Objectives

The system should:

- allow users to create an account securely
- authenticate users with JWT tokens
- protect task endpoints behind authentication
- support creating, listing, viewing, updating, and deleting tasks
- validate client input before writing to the database
- keep development and test environments isolated from production data

---

## 3. Functional Requirements

### 3.1 Authentication

Users must be able to:

- register with a valid name, email, and password
- log in with email and password
- receive a JWT after successful authentication
- access protected routes using the token
- fetch the current authenticated user profile

Validation rules:

- Name: required, 2-100 characters
- Email: required, valid format, max 255 characters
- Password: required, 8-72 characters

### 3.2 Task Management

Authenticated users must be able to:

- create a new task
- list all tasks belonging to the logged-in user
- view a single task by ID
- update an existing task
- delete a task

Task fields:

- `title`: required, 1-200 characters
- `description`: optional, up to 5000 characters
- `status`: one of `todo`, `in_progress`, `completed`
- `priority`: one of `low`, `medium`, `high`
- `dueDate`: optional ISO 8601 date

### 3.3 Authorization

Users can only access their own tasks. The backend must ensure that task operations are scoped to the authenticated user ID.

### 3.4 Error Handling

The API should return structured validation and error responses for:

- invalid input
- missing authentication
- unauthorized access
- database failures
- resource not found

---

## 4. Non-Functional Requirements

### 4.1 Security

- password hashing should be used before storing user credentials
- JWT secrets must be kept in environment variables
- CORS should be restricted to allowed origins
- rate limiting should be enabled for auth-related endpoints
- request validation should run before business logic

### 4.2 Performance

- support pagination for task listing
- use a connection pool for database access
- avoid exposing unnecessary internal details in responses

### 4.3 Reliability

- database connections should be checked on startup
- tests should use a dedicated database to avoid modifying production data
- clean teardown between tests is required

---

## 5. System Architecture

### Frontend

Location: `client`

- React application using Vite
- routes for authentication and dashboard screens
- task forms and task list UI
- API calls to the backend via environment-configured endpoints

### Backend

Location: `server`

- Express application
- route-level validation
- controller/service/model structure
- environment-based configuration
- MySQL database access using `mysql2/promise`

### Database

The project stores data in MySQL tables including:

- `users`
- `tasks`

The application reads database settings from environment variables such as:

- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_NAME`
- `DATABASE_USER`
- `DATABASE_PASSWORD`

---

## 6. API Summary

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks

- `POST /api/tasks/`
- `GET /api/tasks/`
- `GET /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

All task routes require authentication.

---

## 7. Environment Configuration

The backend expects an environment file for development or test mode.

### Example development values

```env
NODE_ENV=development
PORT=5000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=task_manager
DATABASE_USER=task_manager_admin
DATABASE_PASSWORD=1234567890
JWT_SECRET=your_long_secret_here
JWT_EXPIRES_IN=1h
CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=debug
```

### Test setup

For testing, the project should use a separate database such as:

```env
NODE_ENV=test
DATABASE_NAME=task_manager_test
```

This is required to prevent test cleanup commands from deleting real application data.

---

## 8. Testing and Database Safety

The test script runs in test mode and should connect to the test database, not the production database.

Important rules:

- never run tests against the main application database
- keep a dedicated `task_manager_test` database for automated tests
- reset or clear the test database before each test suite if needed
- avoid destructive commands such as `DELETE FROM users` or schema drops against the live database

If the application is accidentally pointing to the real database during tests, the test cleanup logic may delete live user records.

---

## 9. Local Development Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Run tests

```bash
cd server
npm test
```

---

## 10. Acceptance Criteria

The project is complete when:

- users can register and log in
- protected task APIs require JWT authentication
- tasks can be created, listed, updated, and deleted
- user data is properly isolated by account
- validation prevents invalid task or auth payloads
- tests run against a dedicated test database instead of production data
- the app can be started locally with documented environment variables

---

## 11. Notes

This project is designed as a practical task management backend and frontend with production-style structure, validation, and clean separation of concerns. The most important operational requirement is keeping test data isolated from the live database to prevent accidental data loss.
