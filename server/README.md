# Task Management SaaS — Server

The `server` directory contains the backend API for the Task Management SaaS.

The backend is built with **Node.js**, **Express.js**, and **MySQL** and follows a layered architecture designed for maintainability, security, testing, and future scalability.

---

## 1. Responsibilities

The server is responsible for:

* User registration
* User authentication
* Password hashing
* JWT authentication
* Authorization
* Task CRUD operations
* Request validation
* Database access
* Error handling
* Request logging
* Rate limiting
* CORS configuration
* Health checks
* Database migrations
* Automated testing

---

# 2. Tech Stack

* Node.js
* Express.js
* MySQL
* JWT
* bcrypt
* Jest
* Supertest
* ESLint
* npm

---

# 3. Architecture

The backend follows a layered architecture:

```text
HTTP Request
      │
      ▼
    Routes
      │
      ▼
  Middleware
      │
      ├── Authentication
      ├── Validation
      ├── Request Logging
      └── Error Handling
      │
      ▼
  Controllers
      │
      ▼
   Services
      │
      ▼
    Models
      │
      ▼
    MySQL
```

Each layer has a specific responsibility.

---

# 4. Project Structure

```text
server/
│
├── migrations/
│   ├── 001_create_users_table.sql
│   └── 002_create_tasks_table.sql
│
├── scripts/
│   └── migrate.js
│
├── src/
│   ├── config/
│   │   ├── cors.js
│   │   ├── database.js
│   │   ├── env.js
│   │   ├── logger.js
│   │   └── rate-limit.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   └── health.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── request-logger.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── task.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   └── health.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   └── task.service.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── task.validator.js
│   │
│   └── app.js
│
├── test/
│   ├── auth/
│   │   ├── authentication.test.js
│   │   └── register.test.js
│   │
│   ├── config/
│   │   └── teardown.js
│   │
│   ├── errors/
│   │   └── error-handler.test.js
│   │
│   ├── health/
│   │   └── health.test.js
│   │
│   ├── helpers/
│   │   └── database.js
│   │
│   └── tasks/
│       ├── create-task.test.js
│       ├── delete-task.test.js
│       ├── get-task.test.js
│       └── update-task.test.js
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

> Note: `authication.test.js` in the original structure should preferably be renamed to `authentication.test.js`.

---

# 5. Configuration

The `src/config/` directory contains application configuration.

```text
src/config/
├── cors.js
├── database.js
├── env.js
├── logger.js
└── rate-limit.js
```

## `env.js`

Centralizes environment-variable configuration.

Examples:

```text
PORT
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
```

Application code should use the centralized configuration instead of repeatedly reading environment variables directly.

---

## `database.js`

Responsible for configuring the MySQL connection or connection pool.

The database layer should be reusable by models and tests.

---

## `cors.js`

Defines Cross-Origin Resource Sharing rules.

This controls which frontend origins are allowed to communicate with the API.

---

## `logger.js`

Provides centralized application logging.

Logging can be used for:

* Server startup
* API requests
* Errors
* Authentication failures
* Database failures
* Important application events

Sensitive information must never be logged.

---

## `rate-limit.js`

Configures API rate limiting.

Rate limiting helps protect the API from excessive requests and abuse.

---

# 6. Controllers

Controllers handle HTTP requests and responses.

```text
src/controllers/
├── auth.controller.js
├── task.controller.js
└── health.controller.js
```

## `auth.controller.js`

Handles authentication requests such as:

```text
register
login
get current user
```

---

## `task.controller.js`

Handles task requests:

```text
get tasks
get task
create task
update task
delete task
```

---

## `health.controller.js`

Handles health-check requests.

Example:

```http
GET /api/health
```

A health endpoint allows deployment systems and monitoring tools to determine whether the API is running correctly.

---

# 7. Middleware

Middleware processes requests before they reach controllers.

```text
src/middleware/
├── auth.middleware.js
├── error.middleware.js
├── request-logger.middleware.js
└── validate.middleware.js
```

---

## `auth.middleware.js`

Protects authenticated routes.

Flow:

```text
Request
   │
   ▼
Authorization Header
   │
   ▼
Extract JWT
   │
   ▼
Verify JWT
   │
   ▼
Set req.user
   │
   ▼
Controller
```

Invalid authentication should return:

```text
401 Unauthorized
```

---

## `validate.middleware.js`

Handles request validation.

Example:

```text
POST /api/tasks

        │
        ▼
Task Validator
        │
        ├── Invalid → 400
        │
        ▼
Controller
```

---

## `request-logger.middleware.js`

Records information about incoming HTTP requests.

Possible information:

```text
HTTP method
Request path
Status code
Response time
```

Sensitive information such as passwords and tokens should not be logged.

---

## `error.middleware.js`

Provides centralized error handling.

Instead of every controller implementing its own error-response format, errors can be passed to the centralized error middleware.

Example:

```text
Controller
    │
    ▼
throw ApiError
    │
    ▼
error.middleware.js
    │
    ▼
HTTP Error Response
```

---

# 8. Models

Models communicate with the database.

```text
src/models/
├── user.model.js
└── task.model.js
```

## `user.model.js`

Responsible for database operations involving users.

Examples:

```text
findByEmail()
findById()
create()
```

## `task.model.js`

Responsible for task database operations.

Examples:

```text
findAllByUserId()
findById()
create()
update()
delete()
```

Models should focus on database operations rather than HTTP handling.

---

# 9. Services

Services contain application and business logic.

```text
src/services/
├── auth.service.js
└── task.service.js
```

## Authentication Service

Responsible for:

```text
User registration
Password hashing
User lookup
Password verification
JWT generation
```

## Task Service

Responsible for:

```text
Create task
Get tasks
Get task
Update task
Delete task
Verify ownership
```

The service layer separates business logic from HTTP-specific controller code.

---

# 10. Routes

Routes define API endpoints.

```text
src/routes/
├── auth.routes.js
├── task.routes.js
└── health.routes.js
```

### Authentication Routes

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Task Routes

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Health Route

```text
GET /api/health
```

Routes should primarily connect endpoints to middleware and controllers.

---

# 11. Validators

The `validators/` directory contains request validation logic.

```text
src/validators/
├── auth.validator.js
└── task.validator.js
```

## Authentication Validation

Can validate:

```text
name
email
password
```

## Task Validation

Can validate:

```text
title
description
status
```

Validation should occur before business logic is executed.

---

# 12. Utilities

```text
src/utils/
├── ApiError.js
└── asyncHandler.js
```

## `ApiError.js`

Provides a consistent custom error structure.

Example:

```text
ApiError
├── message
├── statusCode
└── additional information
```

---

## `asyncHandler.js`

Provides a reusable way to handle rejected asynchronous controller operations and forward them to the centralized error middleware.

Conceptually:

```text
Async Controller
      │
      ▼
asyncHandler
      │
      ├── Success → Response
      │
      └── Error → Error Middleware
```

---

# 13. Application Entry Point

## `app.js`

`app.js` creates and configures the Express application.

Typical responsibilities:

```text
Create Express app
      │
      ├── JSON parsing
      ├── CORS
      ├── Rate limiting
      ├── Request logging
      ├── Routes
      └── Error middleware
```

---

# 14. Server Entry Point

## `server.js`

`server.js` starts the HTTP server.

Conceptually:

```text
server.js
    │
    ▼
app.js
    │
    ▼
Express Application
    │
    ▼
HTTP Server
```

Keeping application configuration separate from server startup makes the application easier to test.

---

# 15. Database Migrations

Database schema changes are stored in:

```text
migrations/
├── 001_create_users_table.sql
└── 002_create_tasks_table.sql
```

Migrations are executed using:

```text
scripts/migrate.js
```

Run:

```bash
npm run migrate
```

Migration order is important.

```text
001_create_users_table.sql
          │
          ▼
002_create_tasks_table.sql
```

The users table must exist before the tasks table can create its foreign-key relationship to `users`.

---

# 16. Database Relationship

The V1 database contains:

```text
users
  │
  │ 1
  │
  │ N
  ▼
tasks
```

Each task belongs to a specific user.

The server must enforce this ownership at the service/database level.

---

# 17. Authentication Architecture

The authentication flow is:

```text
Register
   │
   ▼
Validate Input
   │
   ▼
Hash Password
   │
   ▼
Create User
```

Login:

```text
Login
   │
   ▼
Validate Input
   │
   ▼
Find User
   │
   ▼
Compare Password
   │
   ▼
Generate JWT
   │
   ▼
Return Token
```

Protected request:

```text
Client
   │
   ▼
Bearer JWT
   │
   ▼
auth.middleware.js
   │
   ▼
Verify Token
   │
   ▼
req.user
   │
   ▼
Controller
```

---

# 18. Task Request Flow

Example: creating a task.

```text
POST /api/tasks
       │
       ▼
task.routes.js
       │
       ▼
auth.middleware.js
       │
       ▼
task.validator.js
       │
       ▼
task.controller.js
       │
       ▼
task.service.js
       │
       ▼
task.model.js
       │
       ▼
MySQL
       │
       ▼
Response
```

This separation keeps each layer focused on one responsibility.

---

# 19. Error Handling

The backend uses centralized error handling.

Example:

```text
Request
   │
   ▼
Controller
   │
   ▼
Service
   │
   ├── Success
   │
   └── Error
        │
        ▼
   error.middleware.js
        │
        ▼
   JSON Response
```

Example response:

```json
{
  "success": false,
  "message": "Task not found"
}
```

Common status codes:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
429 Too Many Requests
500 Internal Server Error
```

---

# 20. Testing

Automated tests are stored in:

```text
test/
├── auth/
├── config/
├── errors/
├── health/
├── helpers/
└── tasks/
```

Testing is separated from application source code.

---

# 21. Authentication Tests

```text
test/auth/
├── authentication.test.js
└── register.test.js
```

Tests should cover:

* Valid authentication
* Invalid credentials
* Missing credentials
* Protected routes
* User registration
* Duplicate email handling

---

# 22. Health Tests

```text
test/health/
└── health.test.js
```

Health tests verify that the API health endpoint responds correctly.

Example:

```http
GET /api/health
```

---

# 23. Error Tests

```text
test/errors/
└── error-handler.test.js
```

These tests verify that errors are converted into consistent HTTP responses.

---

# 24. Task Tests

```text
test/tasks/
├── create-task.test.js
├── delete-task.test.js
├── get-task.test.js
└── update-task.test.js
```

Task tests should verify:

* Task creation
* Task retrieval
* Task updating
* Task deletion
* Authentication requirements
* User ownership
* Invalid task IDs
* Validation errors

---

# 25. Test Helpers

```text
test/helpers/
└── database.js
```

The database helper can provide test-specific database setup and utility functions.

Test data should be isolated from production data.

---

# 26. Test Teardown

```text
test/config/
└── teardown.js
```

Teardown logic ensures test resources are cleaned up after the test suite finishes.

Examples:

```text
Close database connections
Clean test data
Release resources
```

---

# 27. Jest Configuration

The project uses Jest.

Configuration:

```text
jest.config.js
```

Example test command:

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

For coverage:

```bash
npm run test:coverage
```

The exact commands depend on the scripts defined in `package.json`.

---

# 28. ESLint

The project uses ESLint for code quality.

Configuration:

```text
eslint.config.js
```

Example:

```bash
npm run lint
```

Linting helps maintain:

* Consistent code
* Detectable errors
* Maintainable JavaScript
* Cleaner pull requests

---

# 29. Environment Variables

Create a local `.env` file based on:

```text
.env.example
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Never commit `.env` to Git.

Only `.env.example` should be committed.

---

# 30. Installation

From the project root:

```bash
cd server
npm install
```

---

# 31. Database Setup

Create the database:

```sql
CREATE DATABASE task_manager;
```

Then run:

```bash
npm run migrate
```

This executes the SQL migration files.

---

# 32. Development Server

Start the development server:

```bash
npm run dev
```

The API will normally be available at:

```text
http://localhost:5000
```

The actual port is determined by the environment configuration.

---

# 33. Production Server

Start the production server:

```bash
npm start
```

Production should use:

* Secure environment variables
* HTTPS
* Production database
* Database backups
* Restricted database access
* Rate limiting
* Logging
* Monitoring

---

# 34. Security Principles

The backend follows these principles:

### Password Security

Passwords are hashed with bcrypt.

### Authentication

JWT protects private API endpoints.

### Authorization

Users can only access resources they own.

### Validation

Incoming request data is validated.

### SQL Injection Protection

Database queries use parameterized values.

### Rate Limiting

API requests are rate-limited where appropriate.

### CORS

Only approved frontend origins should be allowed.

### Error Security

Internal implementation details should not be exposed through production error responses.

### Secret Management

Secrets are stored in environment variables.

---

# 35. API Documentation

Complete API documentation is maintained separately:

```text
../docs/api.md
```

The API includes:

```text
Authentication
Task Management
Health Checks
Error Responses
Authentication Headers
HTTP Status Codes
```

---

# 36. Database Documentation

Complete database documentation is maintained separately:

```text
../docs/database.md
```

It documents:

* Tables
* Columns
* Relationships
* Foreign keys
* Indexes
* Constraints
* Migrations
* Database security

---

# 37. Backend Development Workflow

Recommended workflow:

```text
Create Feature
      │
      ▼
Create/Update Validator
      │
      ▼
Create/Update Route
      │
      ▼
Implement Controller
      │
      ▼
Implement Service
      │
      ▼
Implement Model
      │
      ▼
Write Tests
      │
      ▼
Run Tests
      │
      ▼
Run ESLint
      │
      ▼
Review Code
      │
      ▼
Commit
```

---

# 38. Example Feature Flow

For a new task feature:

```text
task.routes.js
      │
      ▼
task.validator.js
      │
      ▼
task.controller.js
      │
      ▼
task.service.js
      │
      ▼
task.model.js
      │
      ▼
MySQL
```

Tests should then verify the complete behavior.

---

# 39. Backend Principles

The backend follows:

* Separation of concerns
* Single responsibility
* Secure authentication
* Explicit authorization
* Input validation
* Centralized error handling
* Automated testing
* Database integrity
* Maintainable code organization
* Minimal unnecessary complexity

---

# 40. Future Improvements

Potential V2 improvements:

* More comprehensive API validation
* Pagination
* Filtering
* Search
* API versioning
* More integration tests
* Improved logging
* Request tracing
* Rate-limit policies
* Better API documentation

Potential V3 improvements:

* Redis
* Background jobs
* Email notifications
* WebSockets
* Docker
* CI/CD
* Cloud deployment
* Observability
* Distributed architecture

---

# 41. Backend Goal

The V1 backend provides a professional foundation consisting of:

```text
Express API
     +
Layered Architecture
     +
JWT Authentication
     +
Authorization
     +
Validation
     +
MySQL
     +
Migrations
     +
Error Handling
     +
Logging
     +
Rate Limiting
     +
Automated Tests
```

The goal is to keep V1 understandable and maintainable while making the architecture strong enough to evolve into the future versions of the Task Management SaaS.
