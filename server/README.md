# Task Management SaaS — Backend

## 1. Backend Overview

The backend is the server-side application of the Task Management SaaS. It provides the REST API responsible for authentication, task management, validation, authorization, database operations, and application-level business logic.

The backend is built with Node.js and Express.js and uses MySQL for persistent data storage.

The backend communicates with the frontend through HTTP/JSON APIs.

### Main Goals

- Provide a reliable REST API.
- Authenticate users securely.
- Hash user passwords before storing them.
- Generate and validate JWT authentication tokens.
- Authorize access to protected resources.
- Provide task CRUD operations.
- Validate incoming API requests.
- Handle application and database errors.
- Protect database operations from SQL injection.
- Keep backend code modular and maintainable.

---

# 2. Backend Responsibilities

The backend is responsible for the application's server-side logic and data access.

### Responsibilities

- Receive HTTP requests.
- Validate incoming request data.
- Authenticate users.
- Hash and compare passwords.
- Generate JWT tokens.
- Verify JWT tokens.
- Authorize authenticated requests.
- Execute task business logic.
- Communicate with MySQL.
- Return consistent API responses.
- Handle errors.
- Configure CORS.
- Protect sensitive configuration.
- Maintain database migrations.

The backend is the final authority for authentication, authorization, validation, and data integrity.

The frontend must not be trusted to enforce security rules by itself.

---

# 3. Tech Stack

## Node.js

Node.js provides the JavaScript runtime used to execute the backend application.

It is responsible for:

- Running the server.
- Executing JavaScript on the server.
- Managing asynchronous operations.
- Providing the runtime environment for Express.js.

---

## Express.js

Express.js is used as the HTTP server framework.

It provides:

- Routing.
- Middleware.
- Request handling.
- Response handling.
- Error handling.

The application organizes API endpoints using Express routes.

---

## MySQL

MySQL is the relational database used for persistent application data.

The database stores information such as:

- Users.
- Tasks.

MySQL provides:

- Structured data storage.
- Relationships.
- Constraints.
- Transactions.
- SQL queries.

---

## JWT

JSON Web Tokens are used for stateless authentication.

JWTs allow the backend to identify authenticated users when they make protected API requests.

A protected request contains:

```http
Authorization: Bearer <token>
```

The authentication middleware verifies the token before allowing access to protected routes.

---

## bcrypt

bcrypt is used for password hashing.

Passwords are never stored as plaintext.

The authentication flow is:

```text
Plain Password
      ↓
bcrypt Hash
      ↓
Database
```

During login:

```text
Password
   ↓
bcrypt.compare()
   ↓
Stored Hash
   ↓
Match / Reject
```

---

## CORS

CORS (Cross-Origin Resource Sharing) controls which frontend origins are allowed to communicate with the backend.

During local development, the frontend development origin can be allowed.

In production, CORS should be configured to allow only trusted application origins.

---

# 4. Backend Architecture

The backend follows a layered architecture that separates HTTP routing, business logic, authentication, and database access.

A simplified architecture is:

```text
Client
  │
  ↓
Routes
  │
  ↓
Middleware
  │
  ↓
Controllers
  │
  ↓
Services
  │
  ↓
Database
  │
  ↓
MySQL
```

### Routes

Routes define API endpoints and HTTP methods.

### Middleware

Middleware performs cross-cutting operations such as authentication, CORS, and error handling.

### Controllers

Controllers receive HTTP requests and return HTTP responses.

### Services

Services contain reusable business logic and coordinate application operations.

### Database Layer

The database layer handles communication with MySQL.

---

# 5. Repository Structure

A typical backend structure is:

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
│   │
│   ├── config/
│   │   ├── cors.js
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   └── taskService.js
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── taskValidator.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

The exact structure can vary depending on implementation. The important principle is that each directory has a clear responsibility.

---

# 6. Application Flow

## Authentication Flow

The authentication flow is:

```text
Client
  ↓
POST /api/auth/register
  ↓
Authentication Route
  ↓
Validation
  ↓
Authentication Controller
  ↓
Authentication Service
  ↓
Password Hashing
  ↓
MySQL
  ↓
Response
```

For login:

```text
Client
  ↓
POST /api/auth/login
  ↓
Validation
  ↓
Find User
  ↓
Compare Password
  ↓
Generate JWT
  ↓
Return Token + User
```

---

## Task Management Flow

```text
Client
  ↓
Task Route
  ↓
Authentication Middleware
  ↓
Validation
  ↓
Task Controller
  ↓
Task Service
  ↓
MySQL
  ↓
Response
  ↓
Client
```

Every protected task operation must verify the authenticated user before accessing task data.

---

## API Request Flow

A typical request follows:

```text
HTTP Request
     ↓
Express Application
     ↓
CORS Middleware
     ↓
Route
     ↓
Authentication Middleware
     ↓
Validation
     ↓
Controller
     ↓
Service
     ↓
Database
     ↓
Service
     ↓
Controller
     ↓
HTTP Response
```

---

## Database Request Flow

Database operations should be performed through the database connection or appropriate service/data-access layer.

```text
Service
   ↓
Database Connection
   ↓
SQL Query
   ↓
MySQL
   ↓
Query Result
   ↓
Service
   ↓
Controller
   ↓
API Response
```

Parameterized queries should be used when handling user-controlled values.

---

# 7. API Routes

## Authentication Routes

Authentication endpoints handle user registration, login, and current-user information.

Typical endpoints:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Protected authentication endpoints require a valid JWT where applicable.

---

## Task Routes

Task endpoints provide CRUD functionality.

Typical endpoints:

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Task routes require authentication.

The exact route definitions should remain consistent with `api.md`.

---

# 8. Controllers

## Authentication Controller

The authentication controller handles HTTP-level authentication operations.

Responsibilities include:

- Receiving registration requests.
- Receiving login requests.
- Calling authentication services.
- Returning appropriate HTTP responses.
- Handling authentication-related errors.

The controller should avoid containing large amounts of business logic.

---

## Task Controller

The task controller handles task-related HTTP requests.

Responsibilities include:

- Creating tasks.
- Retrieving tasks.
- Retrieving individual tasks.
- Updating tasks.
- Deleting tasks.
- Returning appropriate HTTP responses.

Business logic should remain in services where practical.

---

# 9. Middleware

## Authentication Middleware

Authentication middleware protects routes that require an authenticated user.

The middleware:

1. Reads the `Authorization` header.
2. Extracts the Bearer token.
3. Verifies the JWT.
4. Retrieves the user identity from the token.
5. Adds authenticated user information to the request.
6. Allows the request to continue.

Conceptually:

```text
Authorization Header
        ↓
Extract Token
        ↓
Verify JWT
        ↓
Valid?
   ↙       ↘
 Yes        No
  ↓          ↓
req.user   401 Error
```

---

## Error Handling Middleware

Centralized error handling provides consistent API responses.

It should:

- Catch unhandled errors.
- Log appropriate server-side information.
- Return safe client-facing messages.
- Set appropriate HTTP status codes.

Sensitive implementation details should not be returned to clients in production.

---

## CORS Middleware

CORS middleware controls which origins can access the API.

The configuration should be environment-aware.

For example:

```text
Development
Frontend → localhost origin → Backend

Production
Frontend → trusted production origin → Backend
```

---

# 10. Services

## Authentication Service

The authentication service contains authentication-related business logic.

Responsibilities include:

- Creating users.
- Finding users.
- Hashing passwords.
- Comparing passwords.
- Generating JWT tokens.
- Retrieving authenticated users.

---

## Task Service

The task service contains task-related business logic.

Responsibilities include:

- Creating tasks.
- Retrieving tasks.
- Retrieving individual tasks.
- Updating tasks.
- Deleting tasks.
- Ensuring task ownership where required.

---

# 11. Database

## Database Connection

The backend uses a MySQL connection or connection pool.

Database configuration should be loaded from environment variables rather than hardcoded into the source code.

Typical configuration values include:

```text
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USER
DATABASE_PASSWORD
```

---

## Database Schema

The V1 database contains the core entities required for authentication and task management.

Typical structure:

```text
users
  │
  │ 1
  │
  │
  │ many
tasks
```

A user can own multiple tasks.

### Users

Typical fields:

```text
id
name
email
password
created_at
updated_at
```

### Tasks

Typical fields:

```text
id
user_id
title
description
status
priority
created_at
updated_at
```

The actual schema should be defined by the migration files and documented in `database.md`.

---

## Migrations

Database migrations provide version-controlled database schema changes.

Example:

```text
migrations/
├── 001_create_users_table.sql
└── 002_create_tasks_table.sql
```

Migrations should be:

- Ordered.
- Reproducible.
- Committed to Git.
- Safe to execute in a predictable environment.

---

## Queries

Database queries should use parameterized values.

Example:

```javascript
const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
```

Parameterized queries reduce the risk of SQL injection.

---

# 12. Authentication

## Registration

Registration creates a new user account.

Flow:

```text
Registration Request
        ↓
Validate Input
        ↓
Check Existing Email
        ↓
Hash Password
        ↓
Create User
        ↓
Return Response
```

Passwords must never be stored in plaintext.

---

## Login

Login verifies the user's credentials.

Flow:

```text
Email + Password
       ↓
Find User
       ↓
Compare Password
       ↓
Valid?
  ↙      ↘
Yes       No
 ↓         ↓
JWT      Error
 ↓
Response
```

---

## Password Hashing

Passwords are hashed using bcrypt before being stored.

The backend should never store or return a user's plaintext password.

When authenticating:

```text
Submitted Password
        ↓
bcrypt.compare()
        ↓
Stored Password Hash
        ↓
Match
```

---

## JWT Authentication

After successful login, the backend generates a JWT.

The token contains the minimum information required to identify the authenticated user.

The client sends the token on protected requests:

```http
Authorization: Bearer <token>
```

The backend verifies the token before processing protected operations.

---

## Current User

The current authenticated user can be retrieved through:

```text
GET /api/auth/me
```

The endpoint:

1. Verifies the JWT.
2. Identifies the user.
3. Retrieves current user information.
4. Returns the appropriate user data.

Sensitive fields such as password hashes must never be returned.

---

## Logout

JWT authentication is stateless in V1.

Logout is primarily handled on the client by removing the stored authentication token and clearing authentication state.

If server-side token revocation is required in the future, a token blacklist, refresh-token system, or another session-management mechanism can be introduced.

---

# 13. Task Management

## Create Task

Authenticated users can create tasks.

Typical flow:

```text
POST /api/tasks
       ↓
Authenticate User
       ↓
Validate Task
       ↓
Create Task
       ↓
Database
       ↓
Return Created Task
```

The task must be associated with the authenticated user's ID.

---

## View Tasks

Authenticated users can retrieve their tasks:

```text
GET /api/tasks
```

The backend should ensure that users only receive tasks they are authorized to access.

---

## View Single Task

A specific task can be retrieved using:

```text
GET /api/tasks/:id
```

The backend must verify that the authenticated user has permission to access the requested task.

---

## Update Task

A task can be updated using:

```text
PATCH /api/tasks/:id
```

The backend should:

1. Authenticate the user.
2. Validate the task ID.
3. Verify task ownership/authorization.
4. Validate updated fields.
5. Update the database.
6. Return the updated task.

---

## Delete Task

A task can be deleted using:

```text
DELETE /api/tasks/:id
```

The backend must verify that the authenticated user is authorized to delete the task.

---

# 14. Request Validation

## Authentication Validation

Authentication requests should validate:

- Required fields.
- Email format.
- Password requirements.
- Name requirements where applicable.

Validation should occur before database operations.

---

## Task Validation

Task requests should validate:

- Title.
- Description.
- Status.
- Priority.
- Task ID.

The backend must validate all task data even if the frontend already performs client-side validation.

---

# 15. Error Handling

## HTTP Status Codes

The API should use appropriate HTTP status codes.

Common examples:

| Status | Meaning                            |
| ------ | ---------------------------------- |
| `200`  | Successful request                 |
| `201`  | Resource created                   |
| `400`  | Invalid request                    |
| `401`  | Authentication required or invalid |
| `403`  | Access denied                      |
| `404`  | Resource not found                 |
| `409`  | Resource conflict                  |
| `500`  | Internal server error              |

The exact status code used should depend on the specific API behavior.

---

## API Error Responses

Error responses should use a consistent structure.

Example:

```json
{
  "message": "Invalid email or password"
}
```

For validation errors, additional information may be returned when appropriate.

---

## Validation Errors

Invalid requests should return a client error rather than allowing invalid data to reach the database.

Example:

```json
{
  "message": "Title is required"
}
```

---

## Authentication Errors

Authentication failures should return an appropriate `401 Unauthorized` response.

Examples:

- Missing token.
- Invalid token.
- Expired token.
- Invalid credentials.

---

## Database Errors

Database errors should be handled centrally where possible.

The client should receive a safe error message rather than raw database errors or SQL statements.

Server-side logs may contain additional diagnostic information.

---

# 16. Security

## Password Security

Passwords must:

- Never be stored as plaintext.
- Be hashed using bcrypt.
- Never be returned through API responses.
- Never be logged.

---

## JWT Security

JWT security requirements include:

- Keep the JWT secret on the server.
- Never commit secrets to Git.
- Use a strong secret in production.
- Validate token signatures.
- Validate token expiration where configured.
- Avoid putting unnecessary sensitive information inside tokens.

---

## Authentication

Protected endpoints must verify authentication on the server.

Frontend route protection alone is insufficient.

---

## Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> Is this user allowed to access this resource?

For task operations, the backend should verify task ownership or another applicable permission rule before returning, modifying, or deleting a task.

---

## CORS

CORS should allow only trusted origins in production.

Avoid configuring production CORS more broadly than necessary.

---

## Environment Variables

Sensitive configuration must be stored outside the source code.

Examples:

```text
JWT_SECRET
DATABASE_PASSWORD
DATABASE_USER
DATABASE_HOST
DATABASE_NAME
```

The `.env` file should not be committed to Git.

---

## SQL Injection Prevention

User-controlled values must not be directly concatenated into SQL queries.

Unsafe pattern:

```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

Use parameterized queries instead:

```javascript
const query = "SELECT * FROM users WHERE email = ?";
const [rows] = await db.execute(query, [email]);
```

---

## Sensitive Data

The API should never expose:

- Password hashes.
- JWT secrets.
- Database credentials.
- Internal server configuration.
- Private API keys.
- Unnecessary database information.

---

# 17. Environment Variables

The backend uses environment variables for configuration.

Example:

```env
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=task_manager
DATABASE_USER=root
DATABASE_PASSWORD=your_password

JWT_SECRET=your_jwt_secret

CORS_ORIGINS=http://localhost:5173
```

The exact variable names should match the application's configuration implementation.

### Environment File

Local development can use:

```text
.env
```

The `.env` file should be included in `.gitignore`.

A safe example file can be provided as:

```text
.env.example
```

Example:

```env
PORT=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
JWT_SECRET=
CORS_ORIGINS=
```

---

# 18. Local Development

## Prerequisites

Install the following:

- Node.js.
- npm.
- MySQL.
- Git.

The required versions should follow the project's supported development environment.

---

## Installation

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

## Environment Setup

Create the environment file:

```text
.env
```

Configure the required database, JWT, server, and frontend-origin variables.

---

## Database Setup

Create the MySQL database before running migrations.

Example:

```sql
CREATE DATABASE task_manager;
```

Use the actual database name configured in `.env`.

---

## Run Migrations

Run the migration command:

```bash
npm run migrate
```

This applies the SQL migration files to the configured database.

Check the project's `package.json` for the exact available migration commands.

---

## Start Development Server

Start the development server:

```bash
npm run dev
```

The server should start on the configured port.

For example:

```text
http://localhost:5000
```

The actual URL depends on the environment configuration.

---

# 19. Production

## Production Environment

Production configuration should use:

- Production database.
- Strong JWT secret.
- HTTPS.
- Restricted CORS.
- Production environment variables.
- Secure database credentials.
- Appropriate logging.

Secrets should be provided through the production environment rather than committed to the repository.

---

## Production Build

Node.js backend applications generally do not require a frontend-style compilation step unless the project uses TypeScript or another build process.

If the project uses plain JavaScript, deployment typically runs the server directly.

Example:

```bash
npm start
```

The exact production command should match `package.json`.

---

## Database Migration

Database migrations should be executed against the production database using the project's approved migration process.

Before applying production migrations:

1. Verify the target database.
2. Back up important production data where appropriate.
3. Review the migration.
4. Apply the migration.
5. Verify the database schema.

---

## Start Server

The production server should run using the production environment configuration.

Example:

```bash
npm start
```

The exact command depends on the project's `package.json`.

---

# 20. Testing

## Unit Testing

Unit tests verify individual functions or modules.

Potential targets include:

- Validators.
- Authentication utilities.
- Services.
- Helper functions.

---

## Integration Testing

Integration tests verify multiple backend components working together.

Examples:

- Controller + service + database.
- Authentication middleware + protected route.
- Task service + database.

---

## API Testing

API tests verify complete HTTP endpoints.

Important scenarios include:

### Authentication

- Successful registration.
- Duplicate email.
- Successful login.
- Invalid credentials.
- Missing authentication token.
- Invalid authentication token.

### Tasks

- Create task.
- Retrieve tasks.
- Retrieve single task.
- Update task.
- Delete task.
- Access another user's task.
- Invalid task ID.
- Invalid task data.

---

# 21. Development Workflow

## Adding an API Endpoint

When adding an endpoint:

1. Define the requirement.
2. Define the HTTP method and route.
3. Add validation.
4. Add controller logic.
5. Add service logic if required.
6. Add database operation.
7. Add authentication/authorization if required.
8. Handle errors.
9. Test the endpoint.
10. Update API documentation.

---

## Adding a Controller

When adding a controller:

1. Create the controller file.
2. Define request handling.
3. Validate required inputs.
4. Call the appropriate service.
5. Return an appropriate HTTP response.
6. Pass unexpected errors to centralized error handling.

Controllers should remain focused on HTTP concerns.

---

## Adding Middleware

Before adding middleware:

1. Identify the cross-cutting responsibility.
2. Keep middleware focused.
3. Define expected request/response behavior.
4. Handle errors consistently.
5. Add the middleware at the correct application or route level.
6. Test it against valid and invalid requests.

---

## Adding a Database Migration

When changing the database:

1. Create a new migration.
2. Give it the next migration number.
3. Write the SQL.
4. Test it locally.
5. Verify existing functionality.
6. Commit the migration.
7. Update database documentation if required.

Existing migrations should not normally be modified after they have been applied to shared environments.

---

## Adding a Feature

A backend feature should follow:

```text
Requirement
    ↓
API Design
    ↓
Database Changes
    ↓
Validation
    ↓
Service
    ↓
Controller
    ↓
Route
    ↓
Middleware
    ↓
Testing
    ↓
Documentation
```

---

# 22. Code Organization Principles

## Separation of Concerns

Each layer should have a clear responsibility.

```text
Routes       → URL + HTTP method
Middleware   → Cross-cutting request processing
Controllers  → HTTP request/response
Services     → Business logic
Database     → Data persistence
```

---

## Single Responsibility

Functions and modules should have focused responsibilities.

Avoid large controllers containing validation, authentication, business logic, and SQL operations all together.

---

## Reusability

Common logic should be reused rather than duplicated.

Examples:

- Authentication utilities.
- Validation functions.
- Database helpers.
- Error handling.

---

## Consistent Naming

Use descriptive and consistent names.

Examples:

```text
authController.js
taskController.js
authService.js
taskService.js
authMiddleware.js
taskRoutes.js
```

---

## Predictable API Behavior

Similar endpoints should use consistent:

- Status codes.
- Response structures.
- Error structures.
- Authentication requirements.

---

# 23. Logging and Monitoring

The backend should provide enough logging to diagnose application problems without exposing sensitive information.

Useful development logs may include:

```text
Server started
Database connected
Migration completed
API request failed
Authentication failure
Unexpected server error
```

Production logging should avoid sensitive values such as:

- Passwords.
- JWT tokens.
- Database passwords.
- Private API keys.

Future versions can introduce structured logging and application monitoring.

---

# 24. Known V1 Limitations

The V1 backend intentionally provides a focused set of features.

Current limitations may include:

- Basic authentication.
- Stateless JWT authentication.
- Basic task CRUD.
- No refresh-token system.
- No server-side session management.
- No email verification.
- No password reset.
- No multi-factor authentication.
- No team/workspace system.
- No task assignment.
- No role-based access control.
- No real-time communication.
- Limited filtering and search.
- Limited rate limiting.
- Limited automated test coverage.
- Basic logging.
- No advanced audit logging.

These limitations define the scope of V1 rather than representing permanent architectural restrictions.

---

# 25. Future Backend Improvements

## V2

Potential V2 backend improvements include:

- Task filtering.
- Task sorting.
- Search.
- Pagination.
- Refresh tokens.
- Password reset.
- Email verification.
- Better request validation.
- Rate limiting.
- Improved API error structure.
- More comprehensive automated testing.
- Improved logging.
- API documentation improvements.

---

## V3

Potential V3 improvements include:

- Team workspaces.
- Task assignment.
- Role-based access control.
- Collaboration.
- Real-time updates.
- Notifications.
- Activity history.
- Audit logging.
- Advanced search.
- Background jobs.
- Caching.
- File attachments.
- Advanced analytics.
- Production monitoring and observability.

Future features should be introduced without compromising authentication, authorization, data integrity, or maintainability.

---

# 26. Related Documentation

The backend should be understood together with the project's other documentation.

## Root README

Provides the high-level project overview, features, setup, and usage information.

## Requirements

Defines functional and non-functional requirements.

## Architecture

Describes the complete system architecture and relationships between frontend, backend, and database components.

## Frontend Documentation

Documents the React frontend, pages, components, state, routing, and API integration.

## API Documentation

Documents API endpoints, methods, authentication requirements, request bodies, responses, and errors.

## Database Documentation

Documents database tables, relationships, indexes, constraints, and migrations.

## Testing Documentation

Defines the testing strategy and procedures.

## Security Documentation

Documents security requirements, authentication, authorization, data protection, and security practices.

## Deployment Documentation

Explains production deployment and infrastructure configuration.

## Development Guide

Documents development prerequisites, repository structure, environment configuration, workflow, Git conventions, and development practices.

---

# 27. Project Status

**Current Version:** V1

**Status:** In Development / V1

### V1 Core Backend Features

- User registration.
- User login.
- Password hashing with bcrypt.
- JWT authentication.
- Current-user endpoint.
- Authentication middleware.
- Protected task routes.
- Task creation.
- Task listing.
- Single task retrieval.
- Task updates.
- Task deletion.
- Request validation.
- Centralized error handling.
- MySQL persistence.
- Database migrations.
- CORS configuration.
- Environment-based configuration.

The backend provides the core API required by the V1 frontend.

---

# 28. License

This project is licensed under the license specified in the repository's root `LICENSE` file.

If a license has not yet been added, choose an appropriate license before distributing the project publicly.

---

# Backend Summary

The Task Management SaaS backend provides the secure server-side foundation for the application.

The main architecture is:

```text
                    Client
                      │
                      ↓
                  Express.js
                      │
                      ↓
                    Routes
                      │
                      ↓
                  Middleware
                      │
              ┌───────┴───────┐
              ↓               ↓
        Authentication     Validation
              │               │
              └───────┬───────┘
                      ↓
                 Controllers
                      │
                      ↓
                   Services
                      │
                      ↓
                MySQL Database
```

The V1 backend focuses on secure authentication and task CRUD functionality while maintaining a modular architecture that can support future V2 and V3 features.
