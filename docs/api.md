# Task Management SaaS — API Documentation

## 1. API Overview

The Task Management SaaS backend provides a RESTful API for user authentication and personal task management.

The API is built with:

* Node.js
* Express.js
* MySQL
* JWT authentication
* Express Validator

The API follows REST principles and returns JSON responses for successful requests and errors.

### API Domains

The V1 API contains three main areas:

```text
Health
  ├── Liveness
  └── Readiness

Authentication
  ├── Register
  ├── Login
  └── Current User

Tasks
  ├── Create
  ├── List
  ├── Statistics
  ├── Get Single Task
  ├── Update
  └── Delete
```

---

## 2. Base URL

### Development

```text
http://localhost:5000
```

### API Base Paths

Authentication:

```text
/api/auth
```

Tasks:

```text
/api/tasks
```

Health:

```text
/health
```

Therefore, for example:

```text
GET http://localhost:5000/api/tasks
```

The production base URL depends on the deployment environment.

---

## 3. Authentication

The API uses **JSON Web Tokens (JWT)** for authentication.

A successful registration or login returns an `accessToken`.

Example:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

The token must be supplied when accessing protected endpoints.

### Public Endpoints

The following endpoints do not require authentication:

```text
POST /api/auth/register
POST /api/auth/login
GET  /health
GET  /health/live
GET  /health/ready
```

### Protected Endpoints

The following endpoints require authentication:

```text
GET    /api/auth/me

POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/stats
GET    /api/tasks/:taskId
PATCH  /api/tasks/:taskId
DELETE /api/tasks/:taskId
```

---

## 4. Authorization Header

Protected endpoints require the following HTTP header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The authentication middleware:

1. Reads the `Authorization` header.
2. Verifies the `Bearer` scheme.
3. Extracts the JWT.
4. Verifies the token using the configured JWT secret.
5. Validates the token payload.
6. Sets the authenticated user on `req.user`.
7. Allows the request to continue.

If authentication fails, the API returns an HTTP `401 Unauthorized` response.

---

# 5. API Response Format

The API uses a consistent JSON response structure.

## 5.1 Success Response

Successful responses use:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

The `data` property contains the resource or result associated with the request.

### Example

```json
{
  "success": true,
  "message": "Task retrieved successfully.",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete documentation",
      "description": "Finish the API documentation.",
      "status": "todo",
      "priority": "high",
      "due_date": "2026-08-30T10:00:00.000Z"
    }
  }
}
```

---

## 5.2 Error Response

Application errors use:

```json
{
  "success": false,
  "message": "Error message.",
  "code": "ERROR_CODE"
}
```

Some errors may also contain a `details` property.

Example:

```json
{
  "success": false,
  "message": "Task not found.",
  "code": "TASK_NOT_FOUND"
}
```

---

## 5.3 Validation Error

Invalid request data is returned as a client error.

Validation responses can contain structured validation details.

Example structure:

```json
{
  "success": false,
  "message": "Validation failed.",
  "code": "VALIDATION_ERROR",
  "details": []
}
```

The exact validation details depend on the invalid request.

---

# 6. Health Endpoints

Health endpoints are used to determine whether the application is running and whether its dependencies are available.

## GET /health/live

Returns the liveness status of the API.

### Endpoint

```http
GET /health/live
```

### Authentication

Not required.

### Headers

No authentication headers required.

### Request Parameters

None.

### Request Body

None.

### Success Response

**200 OK**

```json
{
  "success": true,
  "status": "ok"
}
```

### Error Responses

Unexpected server errors may return:

```text
500 Internal Server Error
```

### Example Request

```bash
curl http://localhost:5000/health/live
```

### Example Response

```json
{
  "success": true,
  "status": "ok"
}
```

---

## GET /health/ready

Checks whether the API is ready to serve requests, including database connectivity.

### Endpoint

```http
GET /health/ready
```

### Authentication

Not required.

### Headers

None required.

### Request Parameters

None.

### Request Body

None.

### Success Response

**200 OK**

```json
{
  "success": true,
  "status": "ready"
}
```

### Error Responses

If the database check fails, the endpoint can return a server error.

```text
500 Internal Server Error
```

### Example Request

```bash
curl http://localhost:5000/health/ready
```

### Example Response

```json
{
  "success": true,
  "status": "ready"
}
```

---

# 7. Authentication Endpoints

## POST /api/auth/register

Creates a new user account.

### Endpoint

```http
POST /api/auth/register
```

### Authentication

Not required.

### Headers

```http
Content-Type: application/json
```

### Request Parameters

None.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Validation Rules

#### `name`

* Required
* String
* 2–100 characters

#### `email`

* Required
* Valid email address
* Maximum 255 characters

#### `password`

* Required
* String
* 8–72 characters

### Success Response

**201 Created**

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "accessToken": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-08-26T10:00:00.000Z",
      "updated_at": "2026-08-26T10:00:00.000Z"
    }
  }
}
```

The password hash is never returned.

### Error Responses

#### Invalid Input

```text
400 Bad Request
```

#### Duplicate Email

```text
409 Conflict
```

Example:

```json
{
  "success": false,
  "message": "An account with this email already exists.",
  "code": "EMAIL_ALREADY_EXISTS"
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Example Response

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "accessToken": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## POST /api/auth/login

Authenticates an existing user.

### Endpoint

```http
POST /api/auth/login
```

### Authentication

Not required.

### Headers

```http
Content-Type: application/json
```

### Request Parameters

None.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Validation Rules

#### `email`

* Required
* Valid email address
* Maximum 255 characters

#### `password`

* Required
* Maximum 72 characters

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Error Responses

#### Invalid Credentials

```text
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Invalid email or password.",
  "code": "INVALID_CREDENTIALS"
}
```

#### Invalid Request

```text
400 Bad Request
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Example Response

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## GET /api/auth/me

Returns the currently authenticated user's information.

### Endpoint

```http
GET /api/auth/me
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Parameters

None.

### Request Body

None.

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Current user retrieved successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-08-26T10:00:00.000Z",
      "updated_at": "2026-08-26T10:00:00.000Z"
    }
  }
}
```

### Error Responses

#### Missing Authentication

```text
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Authentication required.",
  "code": "AUTHENTICATION_REQUIRED"
}
```

#### Invalid Token

```text
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Invalid or expired authentication token.",
  "code": "INVALID_TOKEN"
}
```

#### User No Longer Exists

```text
401 Unauthorized
```

```json
{
  "success": false,
  "message": "User account no longer exists.",
  "code": "USER_NOT_FOUND"
}
```

### Example Request

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Example Response

```json
{
  "success": true,
  "message": "Current user retrieved successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

# 8. Task Endpoints

All task endpoints require authentication.

```http
Authorization: Bearer <JWT_TOKEN>
```

Tasks are always scoped to the authenticated user.

---

## GET /api/tasks

Returns a paginated list of tasks belonging to the authenticated user.

### Endpoint

```http
GET /api/tasks
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Parameters

Query parameters are optional.

| Parameter  | Type    | Default | Description                    |
| ---------- | ------- | ------: | ------------------------------ |
| `page`     | integer |     `1` | Page number                    |
| `limit`    | integer |    `20` | Number of tasks per page       |
| `search`   | string  |   empty | Searches title and description |
| `status`   | string  |   empty | Filters by task status         |
| `priority` | string  |   empty | Filters by priority            |

### Supported Status Values

```text
todo
in_progress
completed
```

### Supported Priority Values

```text
low
medium
high
```

### Request Body

None.

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Tasks retrieved successfully.",
  "data": {
    "tasks": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Complete documentation",
        "description": "Finish API documentation.",
        "status": "in_progress",
        "priority": "high",
        "due_date": "2026-08-30T10:00:00.000Z",
        "created_at": "2026-08-26T10:00:00.000Z",
        "updated_at": "2026-08-26T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Error Responses

#### Missing or Invalid Authentication

```text
401 Unauthorized
```

#### Invalid Query Parameters

```text
400 Bad Request
```

### Example Request

```bash
curl "http://localhost:5000/api/tasks?page=1&limit=20&search=documentation&status=in_progress&priority=high" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Example Response

```json
{
  "success": true,
  "message": "Tasks retrieved successfully.",
  "data": {
    "tasks": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

---

## GET /api/tasks/stats

Returns task statistics for the authenticated user.

### Endpoint

```http
GET /api/tasks/stats
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Parameters

None.

### Request Body

None.

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Task statistics retrieved successfully.",
  "data": {
    "stats": {
      "total": 10,
      "todo": 4,
      "in_progress": 3,
      "completed": 3,
      "low": 2,
      "medium": 5,
      "high": 3
    }
  }
}
```

### Error Responses

```text
401 Unauthorized
500 Internal Server Error
```

### Example Request

```bash
curl http://localhost:5000/api/tasks/stats \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Example Response

```json
{
  "success": true,
  "message": "Task statistics retrieved successfully.",
  "data": {
    "stats": {
      "total": 10,
      "todo": 4,
      "in_progress": 3,
      "completed": 3,
      "low": 2,
      "medium": 5,
      "high": 3
    }
  }
}
```

---

## GET /api/tasks/:taskId

Returns a single task owned by the authenticated user.

### Endpoint

```http
GET /api/tasks/:taskId
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Parameters

| Parameter | Type    | Requirement      |
| --------- | ------- | ---------------- |
| `taskId`  | integer | Positive integer |

Example:

```text
GET /api/tasks/1
```

### Request Body

None.

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Task retrieved successfully.",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete documentation",
      "description": "Finish API documentation.",
      "status": "todo",
      "priority": "high",
      "due_date": "2026-08-30T10:00:00.000Z",
      "created_at": "2026-08-26T10:00:00.000Z",
      "updated_at": "2026-08-26T10:00:00.000Z"
    }
  }
}
```

### Error Responses

#### Invalid Task ID

```text
400 Bad Request
```

#### Task Not Found

```text
404 Not Found
```

```json
{
  "success": false,
  "message": "Task not found.",
  "code": "TASK_NOT_FOUND"
}
```

#### Authentication Failure

```text
401 Unauthorized
```

### Example Request

```bash
curl http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Example Response

```json
{
  "success": true,
  "message": "Task retrieved successfully.",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete documentation",
      "description": "Finish API documentation.",
      "status": "todo",
      "priority": "high",
      "due_date": null
    }
  }
}
```

---

## POST /api/tasks

Creates a new task for the authenticated user.

### Endpoint

```http
POST /api/tasks
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Parameters

None.

### Request Body

```json
{
  "title": "Complete API documentation",
  "description": "Document all V1 API endpoints.",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-08-30T10:00:00Z"
}
```

### Request Fields

| Field         | Required | Type               | Rules                              |
| ------------- | -------- | ------------------ | ---------------------------------- |
| `title`       | Yes      | string             | 1–200 characters                   |
| `description` | No       | string/null        | Maximum 5000 characters            |
| `status`      | No       | string             | `todo`, `in_progress`, `completed` |
| `priority`    | No       | string             | `low`, `medium`, `high`            |
| `dueDate`     | No       | ISO 8601 date/null | Valid ISO 8601 date                |

### Default Values

If omitted:

```text
status   = todo
priority = medium
dueDate  = null
```

### Success Response

**201 Created**

```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete API documentation",
      "description": "Document all V1 API endpoints.",
      "status": "todo",
      "priority": "high",
      "due_date": "2026-08-30T10:00:00.000Z",
      "created_at": "2026-08-26T10:00:00.000Z",
      "updated_at": "2026-08-26T10:00:00.000Z"
    }
  }
}
```

### Error Responses

```text
400 Bad Request
401 Unauthorized
500 Internal Server Error
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete API documentation",
    "description": "Document all V1 API endpoints.",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-08-30T10:00:00Z"
  }'
```

### Example Response

```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete API documentation",
      "description": "Document all V1 API endpoints.",
      "status": "todo",
      "priority": "high",
      "due_date": "2026-08-30T10:00:00.000Z"
    }
  }
}
```

---

## PATCH /api/tasks/:taskId

Updates one or more fields of an existing task.

### Endpoint

```http
PATCH /api/tasks/:taskId
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Parameters

| Parameter | Type    | Requirement      |
| --------- | ------- | ---------------- |
| `taskId`  | integer | Positive integer |

### Request Body

All task fields are optional, but at least one field must be provided.

```json
{
  "title": "Complete API and database documentation",
  "description": "Finish all V1 technical documentation.",
  "status": "completed",
  "priority": "high",
  "dueDate": "2026-08-30T10:00:00Z"
}
```

### Supported Fields

| Field         | Type               | Rules                              |
| ------------- | ------------------ | ---------------------------------- |
| `title`       | string             | Maximum 255 characters             |
| `description` | string/null        | Maximum 5000 characters            |
| `status`      | string             | `todo`, `in_progress`, `completed` |
| `priority`    | string             | `low`, `medium`, `high`            |
| `dueDate`     | ISO 8601 date/null | Valid ISO 8601 date                |

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete API and database documentation",
      "description": "Finish all V1 technical documentation.",
      "status": "completed",
      "priority": "high",
      "due_date": "2026-08-30T10:00:00.000Z",
      "created_at": "2026-08-26T10:00:00.000Z",
      "updated_at": "2026-08-26T12:00:00.000Z"
    }
  }
}
```

### Error Responses

#### Invalid Task ID

```text
400 Bad Request
```

#### No Fields Provided

```text
400 Bad Request
```

```json
{
  "success": false,
  "message": "At least one task field must be provided.",
  "code": "NO_UPDATE_FIELDS"
}
```

#### Task Not Found

```text
404 Not Found
```

```json
{
  "success": false,
  "message": "Task not found.",
  "code": "TASK_NOT_FOUND"
}
```

#### Authentication Failure

```text
401 Unauthorized
```

### Example Request

```bash
curl -X PATCH http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "priority": "high"
  }'
```

### Example Response

```json
{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete API documentation",
      "description": "Document all V1 API endpoints.",
      "status": "completed",
      "priority": "high",
      "due_date": null
    }
  }
}
```

---

## DELETE /api/tasks/:taskId

Deletes a task owned by the authenticated user.

### Endpoint

```http
DELETE /api/tasks/:taskId
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Parameters

| Parameter | Type    | Requirement      |
| --------- | ------- | ---------------- |
| `taskId`  | integer | Positive integer |

### Request Body

None.

### Success Response

**204 No Content**

The API returns no response body when the task is successfully deleted.

### Error Responses

#### Invalid Task ID

```text
400 Bad Request
```

#### Task Not Found

```text
404 Not Found
```

```json
{
  "success": false,
  "message": "Task not found.",
  "code": "TASK_NOT_FOUND"
}
```

#### Authentication Failure

```text
401 Unauthorized
```

### Example Request

```bash
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Example Response

```text
204 No Content
```

---

# 9. Request Validation

The API validates incoming requests using validation middleware.

Validation is applied to:

* Authentication request bodies
* Task request bodies
* Task identifiers
* Task list query parameters

## Authentication Validation

### Registration

```text
name
email
password
```

### Login

```text
email
password
```

## Task Validation

### Create

```text
title
description
status
priority
dueDate
```

### Update

```text
taskId
title
description
status
priority
dueDate
```

### List

```text
page
limit
search
status
priority
```

## Task ID

Task IDs must be positive integers.

Example:

```text
/api/tasks/1
```

Valid:

```text
1
25
100
```

Invalid:

```text
0
-1
abc
1.5
```

---

# 10. Authentication Flow

The V1 authentication flow is:

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                    Register / Login
                           │
                           ▼
                  ┌─────────────────┐
                  │ Request         │
                  │ Validation     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Authentication  │
                  │ Service         │
                  └────────┬────────┘
                           │
                     Password Check
                           │
                           ▼
                  ┌─────────────────┐
                  │ Generate JWT    │
                  └────────┬────────┘
                           │
                           ▼
                     Access Token
                           │
                           ▼
                  ┌─────────────────┐
                  │     Client      │
                  └────────┬────────┘
                           │
                  Authorization Header
                           │
                           ▼
                  ┌─────────────────┐
                  │ Auth Middleware │
                  └────────┬────────┘
                           │
                     Verify JWT
                           │
                           ▼
                  ┌─────────────────┐
                  │ Protected API   │
                  └─────────────────┘
```

### Registration

1. Client submits registration data.
2. Request data is validated.
3. Email uniqueness is checked.
4. Password is hashed.
5. User is created.
6. JWT access token is generated.
7. Sanitized user information and token are returned.

### Login

1. Client submits email and password.
2. Request data is validated.
3. User is found by email.
4. Password is compared with the stored hash.
5. JWT access token is generated.
6. Sanitized user information and token are returned.

---

# 11. Authorization Flow

Authorization is enforced after authentication.

```text
Client
  │
  ▼
JWT Token
  │
  ▼
Authentication Middleware
  │
  ▼
Authenticated User
  │
  ▼
Task Service
  │
  ▼
Task Ownership Check
  │
  ├── Authorized ──► Continue
  │
  └── Not Found ──► 404 TASK_NOT_FOUND
```

The API does not rely only on the task ID.

Task queries use both:

```text
taskId
+
authenticated user ID
```

This ensures that task operations are scoped to the current user.

---

# 12. Task Ownership

Every task belongs to a specific user.

The database stores this relationship through:

```text
tasks.user_id
```

When a task is created, the authenticated user's ID is used as the owner.

Task retrieval, updating, and deletion use the authenticated user's ID together with the task ID.

For example:

```text
Authenticated user:
user_id = 5

Requested task:
task_id = 10
```

The backend effectively checks:

```text
task.id = 10
AND
task.user_id = 5
```

If the task does not belong to the authenticated user, the API treats it as not found.

This prevents users from accessing another user's task by guessing or changing a task ID.

---

# 13. HTTP Status Codes

The V1 API uses standard HTTP status codes.

| Status | Meaning                                          |
| -----: | ------------------------------------------------ |
|  `200` | Request completed successfully                   |
|  `201` | Resource created successfully                    |
|  `204` | Request completed with no response body          |
|  `400` | Invalid request or validation failure            |
|  `401` | Authentication required or authentication failed |
|  `404` | Resource not found                               |
|  `409` | Resource conflict                                |
|  `500` | Unexpected internal server error                 |

### Common Examples

```text
201 Created
POST /api/auth/register
POST /api/tasks
```

```text
200 OK
POST /api/auth/login
GET /api/auth/me
GET /api/tasks
GET /api/tasks/stats
GET /api/tasks/:taskId
PATCH /api/tasks/:taskId
```

```text
204 No Content
DELETE /api/tasks/:taskId
```

```text
400 Bad Request
Invalid input
Invalid task ID
Invalid query parameters
No update fields
```

```text
401 Unauthorized
Missing token
Invalid authorization header
Invalid or expired token
Invalid credentials
```

```text
404 Not Found
Task does not exist or is not owned by the authenticated user
```

```text
409 Conflict
Email already exists
```

---

# 14. Error Codes

The application uses machine-readable error codes in addition to human-readable messages.

Common V1 error codes include:

| Error Code                     | HTTP Status | Description                                    |
| ------------------------------ | ----------: | ---------------------------------------------- |
| `AUTHENTICATION_REQUIRED`      |         401 | Authentication token was not provided          |
| `INVALID_AUTHORIZATION_HEADER` |         401 | Authorization header format is invalid         |
| `INVALID_TOKEN`                |         401 | JWT is invalid or expired                      |
| `USER_NOT_FOUND`               |         401 | Authenticated user no longer exists            |
| `INVALID_CREDENTIALS`          |         401 | Email or password is incorrect                 |
| `EMAIL_ALREADY_EXISTS`         |         409 | Email is already registered                    |
| `TASK_NOT_FOUND`               |         404 | Task does not exist for the authenticated user |
| `NO_UPDATE_FIELDS`             |         400 | Update request contains no fields              |
| `INTERNAL_SERVER_ERROR`        |         500 | Unexpected server error                        |

Validation middleware may also return validation-related errors containing detailed field information.

---

# 15. API Security

The V1 API applies several security controls.

### Password Security

Passwords are hashed using bcrypt before being stored.

Plain-text passwords are never returned in API responses.

### JWT Authentication

Protected endpoints require a valid JWT.

The JWT secret is stored in environment configuration and is not hardcoded into the application.

### Authorization

Task operations are scoped to the authenticated user.

### Input Validation

Request bodies, URL parameters, and query parameters are validated before processing.

### SQL Injection Protection

Database operations use parameterized SQL queries.

### Rate Limiting

Rate limiting is configured at the application level, with additional rate limiting for authentication endpoints.

### HTTP Security Headers

Helmet is used to provide security-related HTTP headers.

### CORS

Cross-Origin Resource Sharing is configured through the application's CORS configuration.

### Request Size Limits

JSON and URL-encoded request bodies have a configured size limit.

### Sensitive Information

The API does not return password hashes or other sensitive authentication information to clients.

---

# 16. API Endpoint Summary

| Method   | Endpoint             | Auth | Description              | Success |
| -------- | -------------------- | :--: | ------------------------ | ------: |
| `GET`    | `/health`            |  No  | API health               |   `200` |
| `GET`    | `/health/live`       |  No  | Liveness check           |   `200` |
| `GET`    | `/health/ready`      |  No  | Readiness/database check |   `200` |
| `POST`   | `/api/auth/register` |  No  | Register user            |   `201` |
| `POST`   | `/api/auth/login`    |  No  | Authenticate user        |   `200` |
| `GET`    | `/api/auth/me`       |  Yes | Get current user         |   `200` |
| `POST`   | `/api/tasks`         |  Yes | Create task              |   `201` |
| `GET`    | `/api/tasks`         |  Yes | List tasks               |   `200` |
| `GET`    | `/api/tasks/stats`   |  Yes | Get task statistics      |   `200` |
| `GET`    | `/api/tasks/:taskId` |  Yes | Get single task          |   `200` |
| `PATCH`  | `/api/tasks/:taskId` |  Yes | Update task              |   `200` |
| `DELETE` | `/api/tasks/:taskId` |  Yes | Delete task              |   `204` |

---

# 17. Example API Workflow

A typical user workflow is:

### Step 1 — Register

```http
POST /api/auth/register
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

Receive:

```text
accessToken
+
user
```

### Step 2 — Create Task

```http
POST /api/tasks
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "title": "Build dashboard",
  "description": "Complete the task dashboard.",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-08-30T10:00:00Z"
}
```

### Step 3 — Retrieve Tasks

```http
GET /api/tasks
Authorization: Bearer <JWT_TOKEN>
```

### Step 4 — Filter Tasks

```http
GET /api/tasks?status=todo&priority=high
Authorization: Bearer <JWT_TOKEN>
```

### Step 5 — Search Tasks

```http
GET /api/tasks?search=dashboard
Authorization: Bearer <JWT_TOKEN>
```

### Step 6 — Retrieve Statistics

```http
GET /api/tasks/stats
Authorization: Bearer <JWT_TOKEN>
```

### Step 7 — Update Task

```http
PATCH /api/tasks/1
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "status": "completed"
}
```

### Step 8 — Delete Task

```http
DELETE /api/tasks/1
Authorization: Bearer <JWT_TOKEN>
```

The API returns:

```text
204 No Content
```

---

# 18. Future API Extensions

Future API features should be added only when the corresponding application functionality is implemented.

### V2 Potential Extensions

Possible additions include:

```text
GET /api/tasks?sortBy=dueDate&sortOrder=asc
```

```text
GET /api/tasks?dueDate=today
```

```text
GET /api/tasks/overdue
```

```text
PATCH /api/tasks/:taskId/status
```

```text
PATCH /api/tasks/:taskId/priority
```

Potential notification endpoints:

```text
GET    /api/notifications
PATCH  /api/notifications/:notificationId/read
```

### V3 Potential Extensions

If collaboration features are introduced:

```text
POST   /api/projects
GET    /api/projects
GET    /api/projects/:projectId
PATCH  /api/projects/:projectId
DELETE /api/projects/:projectId
```

Team functionality could introduce:

```text
POST   /api/projects/:projectId/members
DELETE /api/projects/:projectId/members/:userId
```

Comments could introduce:

```text
POST   /api/tasks/:taskId/comments
GET    /api/tasks/:taskId/comments
PATCH  /api/comments/:commentId
DELETE /api/comments/:commentId
```

These are future possibilities and are **not part of the current V1 API**.

---

# API Documentation Summary

The V1 API provides a complete foundation for authentication and personal task management.

```text
                    TASK MANAGEMENT API

                         ┌──────────┐
                         │  Health  │
                         └──────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
       ┌──────────────┐                ┌──────────────┐
       │     Auth     │                │    Tasks     │
       ├──────────────┤                ├──────────────┤
       │ Register     │                │ Create       │
       │ Login        │                │ List         │
       │ Current User │                │ Statistics   │
       └──────────────┘                │ Get          │
              │                        │ Update       │
              │ JWT                    │ Delete       │
              └────────────┬───────────┴──────────────┘
                           │
                    Authorization
                           │
                           ▼
                    User Ownership
```

The API is designed around four core principles:

1. **Authentication** — verify who the user is.
2. **Authorization** — verify what the user can access.
3. **Validation** — reject invalid input before processing.
4. **Ownership** — ensure users can only manage their own tasks.
