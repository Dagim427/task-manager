# Task Management SaaS — Requirements

## 1. Document Overview

### 1.1 Purpose

This document defines the functional and non-functional requirements for the Task Management SaaS application.

The purpose of the system is to provide authenticated users with a simple and reliable platform for creating, organizing, viewing, updating, searching, filtering, and deleting tasks.

The V1 application is designed as a complete full-stack web application consisting of:

- React frontend
- Node.js/Express backend
- MySQL database
- REST API
- JWT-based authentication

---

## 2. Product Overview

Task Management SaaS allows users to manage their personal tasks through a web application.

Users can:

- Create an account
- Log in
- Access a protected dashboard
- Create tasks
- View tasks
- View individual tasks
- Update tasks
- Delete tasks
- Search tasks
- Filter tasks
- Navigate through paginated task results
- View task statistics
- Log out

Each task belongs to the authenticated user who created it.

---

# 3. Goals

The primary goals of V1 are:

1. Provide secure user authentication.
2. Allow users to manage their own tasks.
3. Provide a clean and usable dashboard.
4. Provide a RESTful backend API.
5. Persist application data in MySQL.
6. Enforce task ownership and authorization.
7. Validate user input.
8. Handle loading, error, and empty states.
9. Support task search and filtering.
10. Support pagination.
11. Provide dashboard statistics.
12. Maintain a clear and scalable project structure.
13. Provide professional technical documentation.

---

# 4. Users

## 4.1 Standard User

V1 contains one primary user type:

**Authenticated User**

An authenticated user can:

- Register
- Log in
- View their dashboard
- Create tasks
- View their tasks
- Update their tasks
- Delete their tasks
- Search their tasks
- Filter their tasks
- View their task statistics
- Log out

Users cannot access or modify tasks belonging to other users.

---

# 5. Functional Requirements

## FR-001 — User Registration

The system shall allow a new user to create an account.

The registration form shall collect the required user information.

The system shall:

1. Validate the registration data.
2. Check whether the email is already registered.
3. Hash the user's password.
4. Store the user in the database.
5. Generate an authentication token.
6. Return the appropriate user information and authentication data.

Passwords must never be stored in plaintext.

---

## FR-002 — User Login

The system shall allow registered users to log in.

The system shall:

1. Validate the login input.
2. Find the user by email.
3. Compare the supplied password with the stored password hash.
4. Reject invalid credentials.
5. Generate a JWT for valid credentials.
6. Return the authenticated user information and token.

---

## FR-003 — Current User

The system shall provide an endpoint for retrieving the currently authenticated user.

Endpoint:

```text
GET /api/auth/me
````

The endpoint shall require valid authentication.

The server shall determine the user from the authenticated JWT rather than trusting a user ID supplied by the client.

---

## FR-004 — User Logout

The frontend shall provide a logout action.

When the user logs out, the client shall:

1. Clear the authentication state.
2. Remove the stored authentication information according to the application's implementation.
3. Redirect the user to the login page or appropriate public page.

---

## FR-005 — Protected Routes

Authenticated application pages shall be protected from unauthenticated access.

Unauthenticated users attempting to access protected pages shall be redirected to the appropriate authentication page.

Frontend route protection improves user experience.

Backend authentication remains the actual security boundary.

---

# 6. Task Requirements

## FR-006 — Create Task

Authenticated users shall be able to create tasks.

A task may contain:

* Title
* Description
* Status
* Priority
* Due date

The server shall associate the task with the authenticated user.

The client shall validate appropriate input before submitting the request.

The server shall perform authoritative validation.

---

## FR-007 — View Tasks

Authenticated users shall be able to retrieve their tasks.

The API shall return only tasks belonging to the authenticated user.

Users shall not receive another user's tasks.

---

## FR-008 — View Individual Task

Authenticated users shall be able to retrieve an individual task.

Endpoint:

```text
GET /api/tasks/:taskId
```

The server shall verify that the requested task belongs to the authenticated user.

If the task does not exist or does not belong to the user, the appropriate error response shall be returned.

---

## FR-009 — Update Task

Authenticated users shall be able to update their tasks.

Endpoint:

```text
PATCH /api/tasks/:taskId
```

The update operation shall support partial updates.

For example:

```json
{
  "status": "completed"
}
```

Only the supplied field should be changed.

---

## FR-010 — Delete Task

Authenticated users shall be able to delete their own tasks.

Endpoint:

```text
DELETE /api/tasks/:taskId
```

The server shall verify task ownership before deletion.

Users shall not be able to delete tasks belonging to another user.

---

# 7. Task Data Requirements

## FR-011 — Task Title

Every task shall have a title.

The server shall validate that the title satisfies the application's requirements.

---

## FR-012 — Task Description

A task may contain a description.

The description may be nullable if the user intentionally clears it.

Example:

```json
{
  "description": null
}
```

---

## FR-013 — Task Status

Tasks shall support the following statuses:

```text
todo
in_progress
completed
```

The server shall reject unsupported status values.

---

## FR-014 — Task Priority

Tasks shall support the following priorities:

```text
low
medium
high
```

The server shall reject unsupported priority values.

---

## FR-015 — Due Date

A task may contain a due date.

The due date may be cleared when supported by the application.

Example:

```json
{
  "dueDate": null
}
```

---

# 8. Task Search Requirements

## FR-016 — Search Tasks

Authenticated users shall be able to search their tasks.

Search results shall only include tasks belonging to the authenticated user.

The system shall display an appropriate empty state when no matching tasks are found.

---

# 9. Task Filtering Requirements

## FR-017 — Filter by Status

Users shall be able to filter tasks by supported status values.

Example:

```text
todo
in_progress
completed
```

---

## FR-018 — Filter by Priority

Users shall be able to filter tasks by supported priority values.

Example:

```text
low
medium
high
```

---

# 10. Pagination Requirements

## FR-019 — Paginated Task Results

The task list shall support pagination.

Typical parameters include:

```text
page
limit
```

The API shall provide sufficient pagination metadata for the frontend.

Example metadata:

```text
page
limit
total
totalPages
```

Pagination shall prevent the client from loading an unnecessarily large number of tasks in a single response.

---

# 11. Dashboard Requirements

## FR-020 — Dashboard

Authenticated users shall have access to a dashboard.

The dashboard shall provide an overview of the user's tasks.

The dashboard may contain:

* Total tasks
* To-do tasks
* In-progress tasks
* Completed tasks
* Low-priority tasks
* Medium-priority tasks
* High-priority tasks

---

## FR-021 — Task Statistics

The backend shall provide a statistics endpoint:

```text
GET /api/tasks/stats
```

Statistics shall be calculated independently from the current paginated task list.

For example, if a user has 47 total tasks and the current page contains 20 tasks:

```text
Current page: 20
Total tasks: 47
```

The dashboard shall display the global total rather than using:

```javascript
tasks.length
```

as the total.

---

# 12. Authentication and Authorization Requirements

## FR-022 — JWT Authentication

The application shall use JWT-based authentication for protected API requests.

Authenticated requests shall include:

```http
Authorization: Bearer <token>
```

---

## FR-023 — Authentication Middleware

The backend shall provide authentication middleware that:

1. Reads the Authorization header.
2. Extracts the Bearer token.
3. Verifies the JWT.
4. Identifies the authenticated user.
5. Makes the authenticated user available to downstream request handlers.

---

## FR-024 — Task Ownership

Every task shall belong to a user.

The backend shall enforce task ownership for:

* Viewing individual tasks
* Updating tasks
* Deleting tasks

Conceptually:

```sql
WHERE id = ?
AND user_id = ?
```

This prevents users from accessing another user's data.

---

# 13. Validation Requirements

## FR-025 — Request Validation

The backend shall validate incoming requests.

Validation shall include appropriate checks for:

* Required fields
* Email
* Password
* Task title
* Task status
* Task priority
* Due date
* PATCH fields

---

## FR-026 — Partial Update Validation

PATCH requests shall support partial updates.

The server shall distinguish between:

### Field omitted

```json
{}
```

Meaning:

```text
Do not change the existing value.
```

### Field provided

```json
{
  "description": "New description"
}
```

Meaning:

```text
Replace the existing value.
```

### Field set to null

```json
{
  "description": null
}
```

Meaning:

```text
Clear the existing value.
```

---

# 14. Error Handling Requirements

## FR-027 — API Errors

The API shall return appropriate HTTP status codes for errors.

Common status codes include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

## FR-028 — Error Response Format

API errors should use a consistent response structure.

Example:

```json
{
  "success": false,
  "message": "Task not found."
}
```

The exact response structure shall follow the implemented API contract.

---

## FR-029 — Frontend Error Display

The frontend shall provide meaningful feedback when an API request fails.

Examples:

```text
Invalid email or password.
Task could not be created.
Task could not be updated.
Task not found.
Something went wrong.
```

Sensitive backend information shall not be exposed to users.

---

# 15. User Interface Requirements

## FR-030 — Loading States

The frontend shall provide loading feedback during asynchronous operations.

Examples:

```text
Loading tasks...
Loading dashboard...
Creating task...
Updating task...
Deleting task...
```

---

## FR-031 — Empty States

The frontend shall provide appropriate empty states.

### No Tasks

```text
No tasks yet.
Create your first task to get started.
```

### No Search or Filter Results

```text
No tasks match your filters.
Try changing your search or filters.
```

---

## FR-032 — Form Feedback

Forms shall provide appropriate feedback for invalid input.

Users should understand:

* Which field is invalid.
* What needs to be corrected.
* Whether the request is being processed.

---

# 16. Non-Functional Requirements

## NFR-001 — Security

The application shall:

* Hash passwords using bcrypt.
* Use JWT authentication.
* Protect private API endpoints.
* Enforce task ownership.
* Validate incoming data.
* Use parameterized database queries.
* Keep secrets in environment variables.
* Avoid exposing sensitive internal information.

---

## NFR-002 — Performance

The application should provide responsive API and UI interactions.

The system should:

* Use pagination for task lists.
* Avoid unnecessary database queries.
* Avoid loading unnecessary data.
* Keep API responses focused on required data.

---

## NFR-003 — Maintainability

The codebase shall maintain clear separation of responsibilities.

Frontend responsibilities should be separated into:

* Pages
* Components
* Hooks
* Context
* Services

Backend responsibilities should be separated into:

* Routes
* Middleware
* Controllers
* Services
* Models

---

## NFR-004 — Scalability

The architecture should allow future features to be added without requiring a complete rewrite.

Potential future features include:

* Team workspaces
* Task assignment
* Roles
* Notifications
* Comments
* Activity history
* Real-time updates

---

## NFR-005 — Reliability

The application should handle expected failures gracefully.

Examples include:

* Invalid credentials
* Invalid request data
* Missing resources
* Unauthorized requests
* Database errors
* Network failures

---

## NFR-006 — Usability

The application should provide:

* Clear navigation
* Understandable forms
* Meaningful error messages
* Loading feedback
* Empty states
* Consistent UI behavior

---

## NFR-007 — Testability

Important application behavior should be testable independently.

Tests should cover critical functionality such as:

* Authentication
* Authorization
* Task CRUD
* Validation
* Search
* Filtering
* Pagination
* Statistics
* Error handling

---

## NFR-008 — Documentation

The project shall maintain documentation covering:

* Requirements
* Architecture
* API
* Database
* Client
* Server

---

# 17. API Requirements

The main authentication endpoints are:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

The main task endpoints are:

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:taskId
PATCH  /api/tasks/:taskId
DELETE /api/tasks/:taskId
GET    /api/tasks/stats
```

The complete API contract is documented in:

```text
docs/api.md
```

---

# 18. Database Requirements

The database shall use MySQL.

The primary entities are:

```text
users
tasks
```

Relationship:

```text
User
 |
 | 1
 |
 | N
 v
Tasks
```

Each task shall reference its owner.

The detailed database specification is documented in:

```text
docs/database.md
```

---

# 19. V1 Scope

## Included in V1

### Authentication

* User registration
* User login
* JWT authentication
* Current user
* Logout
* Protected routes

### Task Management

* Create task
* View tasks
* View individual task
* Update task
* Delete task

### Organization

* Search
* Status filtering
* Priority filtering
* Pagination

### Dashboard

* Task statistics
* Task overview

### Application Quality

* Validation
* Authorization
* Error handling
* Loading states
* Empty states
* Database migrations
* Automated tests
* Documentation

---

# 20. Out of Scope for V1

The following features are not required for V1 unless implemented separately:

* Team workspaces
* Multiple organizations
* Task assignment
* Role-based permissions
* Comments
* File attachments
* Notifications
* Real-time collaboration
* Activity history
* Calendar integration
* Advanced analytics
* Audit logging
* Third-party integrations

These features can be considered for future versions.

---

# 21. Acceptance Criteria

V1 is considered complete when:

### Authentication

* [ ] A user can register.
* [ ] Duplicate email registration is rejected.
* [ ] A user can log in.
* [ ] Invalid credentials are rejected.
* [ ] Passwords are securely hashed.
* [ ] JWT authentication works.
* [ ] Protected endpoints reject unauthenticated requests.
* [ ] The current user can be retrieved.
* [ ] A user can log out.

### Tasks

* [ ] An authenticated user can create a task.
* [ ] A user can view their tasks.
* [ ] A user can view an individual task.
* [ ] A user can update their task.
* [ ] A user can partially update a task.
* [ ] Nullable fields can be cleared.
* [ ] A user can delete their task.
* [ ] Users cannot access another user's tasks.

### Organization

* [ ] Task search works.
* [ ] Status filtering works.
* [ ] Priority filtering works.
* [ ] Pagination works.
* [ ] Pagination metadata is returned correctly.

### Dashboard

* [ ] Total task statistics are correct.
* [ ] Status statistics are correct.
* [ ] Priority statistics are correct.
* [ ] Statistics are independent of the current task page.

### Frontend

* [ ] Loading states are displayed.
* [ ] Errors are displayed clearly.
* [ ] Empty states are handled.
* [ ] Protected routes work.
* [ ] Forms provide useful validation feedback.

### Backend

* [ ] Input validation works.
* [ ] Authentication middleware works.
* [ ] Authorization works.
* [ ] Database queries are parameterized.
* [ ] Errors are handled consistently.

### Documentation

* [ ] Root README exists.
* [ ] Client README exists.
* [ ] Server README exists.
* [ ] Architecture documentation exists.
* [ ] API documentation exists.
* [ ] Database documentation exists.
* [ ] Requirements documentation exists.

---

# 22. Future Requirements

Future versions may introduce:

## V2

* Team workspaces
* Task assignment
* Role-based access
* Improved filtering
* Improved search
* Notifications
* Comments

## V3

* Real-time collaboration
* Activity history
* Advanced analytics
* File attachments
* Audit logging
* Integrations
* Advanced workspace management

These are future considerations and are not part of the V1 acceptance criteria.

---

# 23. Requirement Summary

The V1 system provides a complete task management workflow:

```text
Register
   |
   v
Login
   |
   v
Dashboard
   |
   +----> Create Task
   |
   +----> View Tasks
   |
   +----> Search
   |
   +----> Filter
   |
   +----> Update Task
   |
   +----> Delete Task
   |
   +----> View Statistics
   |
   v
Logout
```

The core requirement of V1 is to provide a secure, maintainable, and functional full-stack task management application for authenticated users.

````

