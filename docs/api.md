# Task Management SaaS — API Documentation

## 1. Overview

The Task Management SaaS backend provides a RESTful API for authentication and task management.

### Base URL

Development:

```text
http://localhost:5000/api
```

Production:

```text
https://your-domain.com/api
```

---

# 2. Authentication

Authentication uses **JSON Web Tokens (JWT)**.

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 3. API Response Format

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# 4. Authentication Endpoints

## 4.1 Register User

Creates a new user account.

### Endpoint

```http
POST /api/auth/register
```

### Authentication

Not required.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Success Response

```http
201 Created
```

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Possible Errors

```text
400 Bad Request
409 Conflict
500 Internal Server Error
```

Examples:

```json
{
  "success": false,
  "message": "All fields are required"
}
```

```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

# 5. Login

Authenticates an existing user.

### Endpoint

```http
POST /api/auth/login
```

### Authentication

Not required.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Success Response

```http
200 OK
```

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "<JWT_TOKEN>"
  }
}
```

### Possible Errors

```text
400 Bad Request
401 Unauthorized
500 Internal Server Error
```

---

# 6. Get Current User

Returns information about the currently authenticated user.

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

### Success Response

```http
200 OK
```

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Possible Errors

```text
401 Unauthorized
404 Not Found
500 Internal Server Error
```

---

# 7. Task Endpoints

All task endpoints require authentication.

---

# 8. Get All Tasks

Returns all tasks belonging to the authenticated user.

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

### Success Response

```http
200 OK
```

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete documentation",
        "description": "Finish project documentation",
        "status": "pending",
        "user_id": 1,
        "created_at": "2026-08-22T10:00:00Z",
        "updated_at": "2026-08-22T10:00:00Z"
      }
    ]
  }
}
```

### Possible Errors

```text
401 Unauthorized
500 Internal Server Error
```

---

# 9. Get Single Task

Returns one task owned by the authenticated user.

### Endpoint

```http
GET /api/tasks/:id
```

### Example

```http
GET /api/tasks/1
```

### Authentication

Required.

### Success Response

```http
200 OK
```

```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "title": "Complete documentation",
      "description": "Finish project documentation",
      "status": "pending",
      "user_id": 1
    }
  }
}
```

### Possible Errors

```text
401 Unauthorized
404 Not Found
500 Internal Server Error
```

---

# 10. Create Task

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

### Request Body

```json
{
  "title": "Complete documentation",
  "description": "Finish API and database documentation",
  "status": "pending"
}
```

### Success Response

```http
201 Created
```

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": 1,
      "title": "Complete documentation",
      "description": "Finish API and database documentation",
      "status": "pending",
      "user_id": 1
    }
  }
}
```

### Possible Errors

```text
400 Bad Request
401 Unauthorized
500 Internal Server Error
```

---

# 11. Update Task

Updates an existing task.

### Endpoint

```http
PUT /api/tasks/:id
```

### Example

```http
PUT /api/tasks/1
```

### Authentication

Required.

### Request Body

```json
{
  "title": "Complete API documentation",
  "description": "Finish API documentation",
  "status": "completed"
}
```

### Success Response

```http
200 OK
```

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": 1,
      "title": "Complete API documentation",
      "description": "Finish API documentation",
      "status": "completed",
      "user_id": 1
    }
  }
}
```

### Possible Errors

```text
400 Bad Request
401 Unauthorized
404 Not Found
500 Internal Server Error
```

---

# 12. Delete Task

Deletes an existing task.

### Endpoint

```http
DELETE /api/tasks/:id
```

### Example

```http
DELETE /api/tasks/1
```

### Authentication

Required.

### Success Response

```http
200 OK
```

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Possible Errors

```text
401 Unauthorized
404 Not Found
500 Internal Server Error
```

---

# 13. HTTP Status Codes

| Status | Meaning                            |
| ------ | ---------------------------------- |
| 200    | Request successful                 |
| 201    | Resource created                   |
| 400    | Invalid request                    |
| 401    | Authentication required or invalid |
| 403    | Access denied                      |
| 404    | Resource not found                 |
| 409    | Resource conflict                  |
| 500    | Internal server error              |

---

# 14. Authentication Flow

```text
Register
   │
   ▼
Create User
   │
   ▼
Hash Password
   │
   ▼
Store User
   │
   ▼
Login
   │
   ▼
Verify Password
   │
   ▼
Generate JWT
   │
   ▼
Return Token
   │
   ▼
Client Stores Token
   │
   ▼
Protected API Request
   │
   ▼
JWT Middleware
   │
   ▼
Controller
```

---

# 15. Protected Request Example

```http
GET /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The authentication middleware:

1. Checks the `Authorization` header.
2. Extracts the Bearer token.
3. Verifies the JWT.
4. Extracts the user information.
5. Sets `req.user`.
6. Allows the request to continue.

Invalid tokens return:

```http
401 Unauthorized
```

---

# 16. Resource Ownership

Task endpoints must always enforce ownership.

For example:

```text
Authenticated User ID = 5

GET /api/tasks/10
```

The backend should verify:

```text
task.user_id === authenticatedUser.id
```

A user must never be able to retrieve, modify, or delete another user's task by changing the task ID.

---

# 17. API Security Rules

The API should follow these rules:

* Never return passwords.
* Never store plain-text passwords.
* Validate request data.
* Protect private endpoints with JWT.
* Verify task ownership.
* Keep JWT secrets in environment variables.
* Do not expose database credentials.
* Return appropriate HTTP status codes.
* Return consistent error responses.

---

# 18. API Endpoint Summary

| Method | Endpoint             | Auth | Description      |
| ------ | -------------------- | ---: | ---------------- |
| POST   | `/api/auth/register` |   No | Register user    |
| POST   | `/api/auth/login`    |   No | Login user       |
| GET    | `/api/auth/me`       |  Yes | Get current user |
| GET    | `/api/tasks`         |  Yes | Get user's tasks |
| GET    | `/api/tasks/:id`     |  Yes | Get one task     |
| POST   | `/api/tasks`         |  Yes | Create task      |
| PUT    | `/api/tasks/:id`     |  Yes | Update task      |
| DELETE | `/api/tasks/:id`     |  Yes | Delete task      |

---

# 19. Future API Extensions

Potential V2 endpoints:

```text
GET    /api/tasks?status=pending
GET    /api/tasks?search=keyword
GET    /api/tasks?page=1&limit=10
PATCH  /api/tasks/:id/status
```

Potential V3 endpoints:

```text
POST   /api/projects
GET    /api/projects
POST   /api/projects/:id/members
POST   /api/comments
GET    /api/notifications
```

These endpoints should only be introduced when the corresponding features are implemented.

---

# 20. Conclusion

The API provides a clean REST interface between the React frontend and Node.js backend.

The V1 API focuses on two core domains:

```text
Authentication
      +
Task Management
```

The API architecture provides a foundation for adding more features while maintaining authentication, authorization, and resource ownership.
