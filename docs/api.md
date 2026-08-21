# Task Management API Documentation

## 1. Overview

The Task Management API is a RESTful API for the Task Management SaaS application.

The API provides functionality for:

- User registration
- User authentication
- Current-user information
- Task creation
- Task retrieval
- Task updates
- Task deletion
- Task ownership and authorization
- Input validation
- Consistent error handling

---

## 2. Technology

The API is built using:

- Node.js
- Express.js
- MySQL
- JWT
- bcrypt

---

## 3. Base URL

### Development

```text
http://localhost:5000/api
```

### Production

```text
https://api.example.com/api
```

> Replace the production URL with the actual deployed backend URL.

---

## 4. API Conventions

### 4.1 Content Type

Requests containing JSON data must use:

```http
Content-Type: application/json
```

### 4.2 Authentication

Protected endpoints require a valid JWT access token.

```http
Authorization: Bearer <JWT_TOKEN>
```

### 4.3 HTTP Status Codes

| Status Code | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created |
| `204` | Request successful with no response body |
| `400` | Invalid request |
| `401` | Authentication required or invalid |
| `404` | Resource not found |
| `409` | Resource conflict |
| `429` | Too many requests |
| `500` | Internal server error |

---

## 5. Response Format

### 5.1 Successful Response

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 5.2 Error Response

```json
{
  "message": "Invalid email or password.",
  "code": "INVALID_CREDENTIALS"
}
```

### Error Fields

| Field | Description |
|---|---|
| `message` | Human-readable error message |
| `code` | Stable application error code |

The API must not expose sensitive information such as:

- Database queries
- SQL errors
- Stack traces
- Passwords
- JWT secrets
- Internal file paths

---

# 6. Authentication

Authentication endpoints are available under:

```text
/api/auth
```

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Create a user account |
| `POST` | `/auth/login` | No | Authenticate a user |
| `GET` | `/auth/me` | Yes | Get the current user |

---

## 6.1 Register User

### POST `/auth/register`

Creates a new user account.

**Authentication:** Not required

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | User's name |
| `email` | string | Yes | User's email address |
| `password` | string | Yes | User's password |

### Success

```text
201 Created
```

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

The API must never return:

```text
password
password_hash
```

### Errors

```text
400 Bad Request
409 Conflict
```

Example:

```json
{
  "message": "Invalid registration data.",
  "code": "INVALID_REQUEST"
}
```

---

## 6.2 Login

### POST `/auth/login`

Authenticates an existing user.

**Authentication:** Not required

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success

```text
200 OK
```

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Errors

#### Invalid request

```text
400 Bad Request
```

```json
{
  "message": "Invalid login data.",
  "code": "INVALID_REQUEST"
}
```

#### Invalid credentials

```text
401 Unauthorized
```

```json
{
  "message": "Invalid email or password.",
  "code": "INVALID_CREDENTIALS"
}
```

#### Rate limit

```text
429 Too Many Requests
```

```json
{
  "message": "Too many authentication attempts. Please try again later.",
  "code": "RATE_LIMITED"
}
```

---

## 6.3 Get Current User

### GET `/auth/me`

Returns information about the currently authenticated user.

**Authentication:** Required

### Request

```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

### Success

```text
200 OK
```

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Errors

```text
401 Unauthorized
```

Example:

```json
{
  "message": "Invalid or expired token.",
  "code": "INVALID_TOKEN"
}
```

---

# 7. Task API

Task endpoints are available under:

```text
/api/tasks
```

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `GET` | `/tasks` | Yes | Get user's tasks |
| `GET` | `/tasks/:id` | Yes | Get one task |
| `POST` | `/tasks` | Yes | Create a task |
| `PATCH` | `/tasks/:id` | Yes | Update a task |
| `DELETE` | `/tasks/:id` | Yes | Delete a task |

---

## 7.1 Task Object

```json
{
  "id": 1,
  "title": "Build dashboard",
  "description": "Finish dashboard UI",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2026-08-25",
  "createdAt": "2026-08-20T10:00:00Z",
  "updatedAt": "2026-08-20T11:00:00Z"
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique task ID |
| `title` | string | Task title |
| `description` | string/null | Task description |
| `status` | string | Current task status |
| `priority` | string | Task priority |
| `dueDate` | string/null | Task due date |
| `createdAt` | datetime | Creation timestamp |
| `updatedAt` | datetime | Last update timestamp |

---

## 7.2 Task Status

Allowed values:

```text
todo
in_progress
completed
```

---

## 7.3 Task Priority

Allowed values:

```text
low
medium
high
```

---

# 8. Get All Tasks

### GET `/tasks`

Returns tasks belonging to the authenticated user.

**Authentication:** Required

### Request

```http
GET /api/tasks
Authorization: Bearer <JWT_TOKEN>
```

### Success

```text
200 OK
```

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Build dashboard",
      "description": "Finish dashboard UI",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2026-08-25",
      "createdAt": "2026-08-20T10:00:00Z",
      "updatedAt": "2026-08-20T11:00:00Z"
    }
  ]
}
```

Only tasks belonging to the authenticated user are returned.

---

# 9. Get One Task

### GET `/tasks/:id`

Returns one task belonging to the authenticated user.

### Request

```http
GET /api/tasks/1
Authorization: Bearer <JWT_TOKEN>
```

### Success

```text
200 OK
```

```json
{
  "task": {
    "id": 1,
    "title": "Build dashboard",
    "description": "Finish dashboard UI",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2026-08-25",
    "createdAt": "2026-08-20T10:00:00Z",
    "updatedAt": "2026-08-20T11:00:00Z"
  }
}
```

### Errors

```text
400 Bad Request
404 Not Found
```

Example:

```json
{
  "message": "Task not found.",
  "code": "TASK_NOT_FOUND"
}
```

The API must not return another user's task.

---

# 10. Create Task

### POST `/tasks`

Creates a task for the authenticated user.

### Request

```http
POST /api/tasks
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

```json
{
  "title": "Build dashboard",
  "description": "Finish dashboard UI",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-08-25"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Task title |
| `description` | string | No | Task description |
| `status` | string | No | Task status |
| `priority` | string | No | Task priority |
| `dueDate` | string | No | Task due date |

### Default Values

```text
status   → todo
priority → medium
```

The client must not provide:

```text
userId
createdAt
updatedAt
```

The server determines ownership from the authenticated JWT.

### Success

```text
201 Created
```

```json
{
  "task": {
    "id": 1,
    "title": "Build dashboard",
    "description": "Finish dashboard UI",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-08-25"
  }
}
```

### Errors

```text
400 Bad Request
401 Unauthorized
```

---

# 11. Update Task

### PATCH `/tasks/:id`

Updates an existing task owned by the authenticated user.

### Request

```http
PATCH /api/tasks/1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

```json
{
  "status": "completed"
}
```

Multiple fields can be updated:

```json
{
  "title": "Updated dashboard",
  "priority": "medium"
}
```

### Allowed Fields

```text
title
description
status
priority
dueDate
```

### Protected Fields

```text
id
userId
createdAt
updatedAt
```

### Success

```text
200 OK
```

### Errors

```text
400 Bad Request
401 Unauthorized
404 Not Found
```

---

# 12. Delete Task

### DELETE `/tasks/:id`

Deletes a task owned by the authenticated user.

### Request

```http
DELETE /api/tasks/1
Authorization: Bearer <JWT_TOKEN>
```

### Success

```text
204 No Content
```

### Errors

```text
400 Bad Request
401 Unauthorized
404 Not Found
```

---

# 13. Authorization Rules

Authorization is based on the authenticated user's ID.

The server obtains the user ID from the verified JWT:

```text
JWT
 ↓
Authentication middleware
 ↓
req.user.id
```

The server must not trust a user ID supplied by the client.

For example, this must not determine ownership:

```json
{
  "title": "Test task",
  "userId": 999
}
```

Instead:

```text
Authenticated User
       ↓
    req.user.id
       ↓
   task.user_id
```

---

# 14. Task Ownership

Each task belongs to one user.

```text
User A
├── Task 1
└── Task 2

User B
├── Task 3
└── Task 4
```

User A can read, update, and delete Tasks 1 and 2.

User A cannot access Tasks 3 and 4.

Conceptually, task queries should enforce ownership:

```sql
SELECT *
FROM tasks
WHERE id = ?
AND user_id = ?;
```

---

# 15. Validation Rules

## Task Title

The title:

- Must be provided when creating a task.
- Must be a string.
- Must not be empty or only whitespace.
- Must not exceed the application's maximum length.

## Description

The description is optional.

## Status

Allowed values:

```text
todo
in_progress
completed
```

## Priority

Allowed values:

```text
low
medium
high
```

## Task ID

Task IDs must be valid integer IDs.

---

# 16. Rate Limiting

Authentication endpoints are rate limited to reduce repeated login attempts.

When the limit is exceeded:

```text
429 Too Many Requests
```

```json
{
  "message": "Too many authentication attempts. Please try again later.",
  "code": "RATE_LIMITED"
}
```

---

# 17. Security

The API uses:

- Helmet for security-related HTTP headers
- CORS configuration
- Request body limits
- JWT authentication
- Authorization checks
- Input validation
- bcrypt password hashing
- Parameterized database queries
- Rate limiting
- Environment variables for secrets

Passwords must never be stored as plaintext.

```text
Plain password
      ↓
bcrypt
      ↓
password_hash
      ↓
Database
```

---

# 18. Authentication Flow

```text
1. User registers
        ↓
2. Server validates input
        ↓
3. Password is hashed
        ↓
4. User is stored in database
        ↓
5. User logs in
        ↓
6. Server validates credentials
        ↓
7. Server creates JWT
        ↓
8. Client receives JWT
        ↓
9. Client sends JWT with protected requests
        ↓
10. Server verifies JWT
        ↓
11. Server identifies authenticated user
        ↓
12. Authorization rules are applied
        ↓
13. Request reaches controller
```

---

# 19. Example API Flow

```text
POST /auth/register
        ↓
Account created
        ↓
POST /auth/login
        ↓
JWT returned
        ↓
GET /auth/me
        ↓
Current user returned
        ↓
GET /tasks
        ↓
User's tasks returned
        ↓
POST /tasks
        ↓
New task created
        ↓
PATCH /tasks/:id
        ↓
Task updated
        ↓
DELETE /tasks/:id
        ↓
Task deleted
```

---

# 20. Example cURL Requests

## Register

```bash
curl -X POST \
  http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Login

```bash
curl -X POST \
  http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Get Current User

```bash
curl \
  http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Get Tasks

```bash
curl \
  http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Create Task

```bash
curl -X POST \
  http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Build dashboard",
    "description": "Finish dashboard UI",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-08-25"
  }'
```

## Update Task

```bash
curl -X PATCH \
  http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

## Delete Task

```bash
curl -X DELETE \
  http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

# 21. Endpoint Summary

| Method | Endpoint | Auth | Success |
|---|---|---:|---:|
| POST | `/auth/register` | No | `201` |
| POST | `/auth/login` | No | `200` |
| GET | `/auth/me` | Yes | `200` |
| GET | `/tasks` | Yes | `200` |
| GET | `/tasks/:id` | Yes | `200` |
| POST | `/tasks` | Yes | `201` |
| PATCH | `/tasks/:id` | Yes | `200` |
| DELETE | `/tasks/:id` | Yes | `204` |

---

# 22. Error Code Reference

| Error Code | HTTP Status | Description |
|---|---:|---|
| `INVALID_REQUEST` | `400` | Request data is invalid |
| `INVALID_TITLE` | `400` | Task title is invalid |
| `INVALID_STATUS` | `400` | Task status is invalid |
| `INVALID_PRIORITY` | `400` | Task priority is invalid |
| `INVALID_TASK_ID` | `400` | Task ID is invalid |
| `AUTHENTICATION_REQUIRED` | `401` | Authentication is required |
| `INVALID_TOKEN` | `401` | JWT is invalid or expired |
| `INVALID_CREDENTIALS` | `401` | Login credentials are invalid |
| `TASK_NOT_FOUND` | `404` | Task does not exist or is inaccessible |
| `REGISTRATION_CONFLICT` | `409` | Account conflicts with existing data |
| `RATE_LIMITED` | `429` | Request rate limit exceeded |
| `INTERNAL_ERROR` | `500` | Unexpected server error |

---

# 23. API Security Rules

The following rules must always be maintained:

1. Never trust the frontend for authorization.
2. Never trust `userId` from the request body.
3. Always derive ownership from the authenticated user.
4. Never return password hashes.
5. Never return JWT secrets.
6. Never log passwords.
7. Never log authentication tokens.
8. Never expose stack traces to clients.
9. Validate all incoming data.
10. Use parameterized database queries.
11. Protect authentication endpoints with rate limiting.
12. Use HTTPS in production.
13. Keep secrets in environment variables.
14. Keep `.env` files out of Git.
15. Keep database credentials out of source code.

---

# 24. API Versioning

The V1 API currently uses:

```text
/api
```

Future versions may use:

```text
/api/v2
```

API versioning should be introduced when breaking API changes are required.

---

# 25. Documentation Maintenance

API documentation must remain synchronized with the implementation.

Whenever an API endpoint changes, update:

- Route implementation
- Controller
- Validation
- Tests
- `docs/api.md`
- Related frontend API service
- README if necessary

The API documentation is part of the project and should be reviewed whenever the API changes.

---

# 26. Related Documentation

- `docs/requirements.md` — Product and functional requirements
- `docs/architecture.md` — System architecture
- `docs/database.md` — Database design
- `docs/api.md` — API documentation
- `README.md` — Project overview and setup instructions

---

# 27. V1 API Scope

## Included

- User registration
- User login
- JWT authentication
- Current user
- Task CRUD
- Task ownership
- Input validation
- Error handling
- Basic API security
- Database integrity

## Not Included in V1

- Teams
- Organizations
- Role-based permissions
- Real-time collaboration
- Notifications
- Billing
- Subscriptions
- Advanced analytics
- AI features
- WebSockets
- Complex search
- Advanced filtering
- Pagination

These features can be evaluated for future versions.

---

# 28. V1 API Completion Criteria

- [ ] All documented endpoints work.
- [ ] Authentication works.
- [ ] Protected endpoints reject unauthenticated requests.
- [ ] JWT validation works.
- [ ] Users can only access their own tasks.
- [ ] Task CRUD works.
- [ ] Input validation works.
- [ ] Invalid task IDs are rejected.
- [ ] Invalid status values are rejected.
- [ ] Invalid priority values are rejected.
- [ ] Passwords are securely hashed.
- [ ] Sensitive information is not returned.
- [ ] Rate limiting works on authentication endpoints.
- [ ] Database constraints are enforced.
- [ ] Database migrations work.
- [ ] API tests cover critical behavior.
- [ ] Production configuration uses environment variables.
- [ ] API documentation matches the implementation.

---

# 29. Final API Architecture

```text
                         Client
                           │
                           ↓
                    HTTP Request
                           │
                           ↓
                         CORS
                           │
                           ↓
                        Helmet
                           │
                           ↓
                   Request Limits
                           │
                           ↓
                    Rate Limiting
                           │
                           ↓
                       Routing
                           │
                           ↓
                     Validation
                           │
                           ↓
                   Authentication
                           │
                           ↓
                    Authorization
                           │
                           ↓
                     Controller
                           │
                           ↓
                      Database
                           │
                           ↓
                    Error Handler
                           │
                           ↓
                   HTTP Response
```

---

# 30. V1 API Principle

> The API is responsible for validating requests, authenticating users, enforcing authorization, protecting data, and providing a predictable contract for clients.
