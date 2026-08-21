# Task Management Architecture Documentation

## 1. Overview

The Task Management SaaS is a full-stack web application built using a client-server architecture.

The system is divided into three primary layers:

```text
┌──────────────────────┐
│       Client         │
│      React.js        │
└──────────┬───────────┘
           │
           │ HTTP / REST API
           │
           ▼
┌──────────────────────┐
│       Server         │
│ Node.js + Express.js │
└──────────┬───────────┘
           │
           │ SQL
           │
           ▼
┌──────────────────────┐
│      Database        │
│        MySQL         │
└──────────────────────┘
```

The architecture separates responsibilities between the frontend, backend, and database.

---

# 2. Architecture Goals

The architecture is designed to provide:

- Clear separation of concerns
- Maintainable code
- Secure authentication
- Secure task ownership
- Reusable frontend components
- Predictable API behavior
- Reliable database access
- Easy testing
- Easy deployment
- A foundation for future V2 development

---

# 3. Technology Stack

## Frontend

- React.js
- JSX
- CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- JWT
- bcrypt
- MySQL driver

## Database

- MySQL

## Development

- Git
- GitHub
- npm
- Environment variables

---

# 4. High-Level Architecture

The application follows a client-server architecture.

```text
                         ┌─────────────────┐
                         │      User       │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     Client      │
                         │     React       │
                         └────────┬────────┘
                                  │
                           HTTP / REST API
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     Server      │
                         │ Node + Express  │
                         └────────┬────────┘
                                  │
                           SQL / Database
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     MySQL       │
                         └─────────────────┘
```

---

# 5. Client Architecture

The client is responsible for the user interface and interaction with the API.

The frontend should not directly communicate with the database.

```text
User
 ↓
React Component
 ↓
Event Handler
 ↓
API Service
 ↓
HTTP Request
 ↓
Backend API
```

---

# 6. Client Responsibilities

The client is responsible for:

- Rendering the user interface
- Handling user interactions
- Form state
- Client-side validation
- Authentication state
- Storing the authentication token according to the application's security design
- Calling backend APIs
- Displaying API responses
- Displaying errors
- Routing between pages
- Managing loading states

The client is not responsible for:

- Database access
- Password hashing
- JWT signing
- Authorization decisions
- Enforcing task ownership

Those responsibilities belong to the server.

---

# 7. Client Folder Structure

Recommended structure:

```text
client/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── hooks/
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── taskService.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

# 8. Client Components

Components are reusable UI building blocks.

Examples:

```text
Button
Input
Modal
TaskCard
TaskForm
Navbar
Sidebar
LoadingSpinner
ErrorMessage
```

Components should focus primarily on presentation and user interaction.

Business rules and API communication should be kept outside reusable presentation components when practical.

---

# 9. Client Pages

Pages represent application-level screens.

V1 pages include:

```text
Login
Register
Dashboard
```

A page can compose multiple reusable components.

Example:

```text
Dashboard
├── Navbar
├── Sidebar
├── TaskForm
├── TaskList
└── TaskCard
```

---

# 10. API Service Layer

The frontend communicates with the backend through service modules.

Example:

```text
components/pages
        ↓
service layer
        ↓
Axios
        ↓
REST API
```

Example services:

```text
authService.js
taskService.js
```

The service layer centralizes API requests instead of putting HTTP calls throughout the UI.

---

# 11. Authentication Context

Authentication state is managed through an authentication context.

Conceptually:

```text
AuthContext
├── user
├── token
├── login()
├── logout()
└── register()
```

Components can access authentication state without passing it through many levels of props.

---

# 12. Protected Routes

Authenticated pages should be protected.

Example:

```text
                    ┌───────────────┐
                    │ User requests │
                    │  /dashboard   │
                    └───────┬───────┘
                            │
                            ▼
                     Authenticated?
                       /         \
                     No           Yes
                     │             │
                     ▼             ▼
                  Login        Dashboard
```

The frontend route guard improves user experience, but it is not a security boundary.

The backend must independently authenticate and authorize every protected API request.

---

# 13. Server Architecture

The backend follows a layered architecture.

```text
Request
   ↓
Middleware
   ↓
Route
   ↓
Controller
   ↓
Database / Model Layer
   ↓
Response
```

Each layer has a specific responsibility.

---

# 14. Server Responsibilities

The server is responsible for:

- API routing
- Request validation
- Authentication
- Authorization
- Password hashing
- JWT creation and verification
- Business logic
- Database access
- Error handling
- Security middleware
- Rate limiting

---

# 15. Server Folder Structure

Recommended structure:

```text
server/
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
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
├── migrations/
├── scripts/
│   └── migrate.js
├── tests/
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# 16. Application Entry Point

The backend starts from the server entry point.

Conceptually:

```text
server.js
   ↓
app.js
   ↓
middleware
   ↓
routes
```

The separation allows the Express application to be configured independently from the process that starts the server.

---

# 17. Middleware Layer

Middleware runs during the request lifecycle.

Example:

```text
HTTP Request
     ↓
CORS
     ↓
Helmet
     ↓
Body Parser
     ↓
Rate Limiter
     ↓
Authentication
     ↓
Validation
     ↓
Route Handler
```

Middleware can:

- Modify requests
- Reject requests
- Authenticate users
- Validate input
- Handle errors
- Add security controls

---

# 18. Authentication Middleware

Protected endpoints use authentication middleware.

Flow:

```text
Authorization Header
        ↓
Extract Bearer Token
        ↓
Verify JWT
        ↓
Decode User Information
        ↓
req.user
        ↓
Controller
```

Example request:

```http
Authorization: Bearer <JWT_TOKEN>
```

The middleware should reject:

- Missing tokens
- Malformed tokens
- Invalid tokens
- Expired tokens

---

# 19. Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> Is this user allowed to access this resource?

For task operations:

```text
Authenticated User
        ↓
      req.user.id
        ↓
      Task Owner
        ↓
   Access Allowed?
      /       \
    Yes        No
     ↓          ↓
Continue      Reject
```

The server must enforce ownership.

---

# 20. Controller Layer

Controllers handle HTTP requests and responses.

Examples:

```text
authController.js
taskController.js
```

Responsibilities include:

- Reading request data
- Calling application logic
- Returning HTTP responses
- Handling expected errors

Controllers should avoid becoming large blocks of unrelated business logic.

---

# 21. Service Layer

Services contain reusable application/business logic.

Example:

```text
Controller
    ↓
Service
    ↓
Database
```

For authentication:

```text
authController
      ↓
authService
      ↓
user database
```

For tasks:

```text
taskController
      ↓
taskService
      ↓
task database
```

This separation makes the application easier to test and maintain.

---

# 22. Database Layer

The application uses MySQL as its relational database.

The database stores persistent application data.

V1 primary entities include:

```text
users
tasks
```

Relationship:

```text
users
  │
  │ 1
  │
  │
  │ many
  ▼
tasks
```

Each task belongs to a user.

---

# 23. Database Access Flow

```text
HTTP Request
     ↓
Route
     ↓
Controller
     ↓
Service
     ↓
Database Query
     ↓
MySQL
     ↓
Database Result
     ↓
Service
     ↓
Controller
     ↓
HTTP Response
```

The client never connects directly to MySQL.

---

# 24. Database Migrations

Database schema changes are managed using migration files.

Example:

```text
migrations/
├── 001_create_users.sql
└── 002_create_tasks.sql
```

Migration execution:

```text
npm run migrate
        ↓
scripts/migrate.js
        ↓
Read migration files
        ↓
Execute SQL
        ↓
Record completed migration
```

The migration system prevents already executed migrations from being run again.

---

# 25. Data Flow: Registration

```text
User
 ↓
Register Form
 ↓
POST /api/auth/register
 ↓
Auth Route
 ↓
Validation
 ↓
Auth Controller
 ↓
Hash Password
 ↓
Create User
 ↓
MySQL
 ↓
User Created
 ↓
HTTP Response
 ↓
Client
```

The plaintext password must never be stored in the database.

---

# 26. Data Flow: Login

```text
User
 ↓
Login Form
 ↓
POST /api/auth/login
 ↓
Auth Route
 ↓
Validation
 ↓
Auth Controller
 ↓
Find User
 ↓
Compare Password
 ↓
Create JWT
 ↓
HTTP Response
 ↓
Client
```

The client receives authentication information required for subsequent protected requests.

---

# 27. Data Flow: Get Current User

```text
Client
 ↓
GET /api/auth/me
 ↓
Authorization Header
 ↓
Auth Middleware
 ↓
Verify JWT
 ↓
req.user
 ↓
Auth Controller
 ↓
User Data
 ↓
HTTP Response
 ↓
Client
```

---

# 28. Data Flow: Create Task

```text
Client
 ↓
Task Form
 ↓
POST /api/tasks
 ↓
Auth Middleware
 ↓
Validation
 ↓
Task Controller
 ↓
Task Service
 ↓
MySQL
 ↓
Task Created
 ↓
HTTP Response
 ↓
Client
```

The server obtains the task owner from the authenticated user.

---

# 29. Data Flow: Update Task

```text
Client
 ↓
PATCH /api/tasks/:id
 ↓
Auth Middleware
 ↓
Validation
 ↓
Task Controller
 ↓
Check Task Ownership
 ↓
Update Task
 ↓
MySQL
 ↓
HTTP Response
 ↓
Client
```

---

# 30. Data Flow: Delete Task

```text
Client
 ↓
DELETE /api/tasks/:id
 ↓
Auth Middleware
 ↓
Task Controller
 ↓
Check Task Ownership
 ↓
Delete Task
 ↓
MySQL
 ↓
HTTP Response
 ↓
Client
```

---

# 31. Error Handling Architecture

Errors should be handled consistently.

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Error
   ↓
Error Middleware
   ↓
Standard JSON Response
```

Example:

```json
{
  "message": "Task not found.",
  "code": "TASK_NOT_FOUND"
}
```

Internal errors should not expose sensitive implementation details.

---

# 32. Security Architecture

Security is implemented in multiple layers.

```text
                    Client
                      │
                      ▼
                     CORS
                      │
                      ▼
                    Helmet
                      │
                      ▼
                Rate Limiting
                      │
                      ▼
                  Validation
                      │
                      ▼
                Authentication
                      │
                      ▼
                Authorization
                      │
                      ▼
               Parameterized SQL
                      │
                      ▼
                   MySQL
```

Important security principles:

1. Never trust client-provided ownership information.
2. Never store plaintext passwords.
3. Never expose secrets.
4. Validate incoming data.
5. Use parameterized queries.
6. Protect private routes.
7. Use HTTPS in production.
8. Keep secrets in environment variables.
9. Do not commit `.env`.
10. Do not expose internal errors.

---

# 33. Environment Configuration

Environment-specific configuration is stored in environment variables.

Example:

```env
NODE_ENV=development
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=task_manager

JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:5173
```

The actual `.env` file must not be committed to Git.

A safe example file can be committed:

```text
.env.example
```

---

# 34. Request Lifecycle

The complete backend request lifecycle is:

```text
┌───────────────┐
│ HTTP Request  │
└───────┬───────┘
        ↓
┌───────────────┐
│    CORS       │
└───────┬───────┘
        ↓
┌───────────────┐
│   Security    │
│   Middleware  │
└───────┬───────┘
        ↓
┌───────────────┐
│ Authentication │
└───────┬───────┘
        ↓
┌───────────────┐
│  Validation   │
└───────┬───────┘
        ↓
┌───────────────┐
│     Route     │
└───────┬───────┘
        ↓
┌───────────────┐
│  Controller   │
└───────┬───────┘
        ↓
┌───────────────┐
│    Service    │
└───────┬───────┘
        ↓
┌───────────────┐
│    MySQL      │
└───────┬───────┘
        ↓
┌───────────────┐
│   Response    │
└───────────────┘
```

---

# 35. Separation of Responsibilities

| Layer | Responsibility |
|---|---|
| React Components | UI and interaction |
| Pages | Screen composition |
| API Services | HTTP communication |
| Context | Shared authentication state |
| Routes | Endpoint definitions |
| Middleware | Cross-cutting request processing |
| Controllers | HTTP request/response handling |
| Services | Application/business logic |
| Database | Persistent data |
| Migrations | Database schema changes |

A layer should not unnecessarily take responsibility for another layer.

---

# 36. Dependency Direction

The application follows a controlled dependency direction.

```text
Client
  ↓
API
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Database
```

The database does not depend on the React client.

The React client does not directly depend on MySQL.

---

# 37. Scalability Considerations

The V1 architecture is intentionally simple.

Future versions can introduce:

- Redis caching
- Background jobs
- Message queues
- File/object storage
- WebSockets
- Search infrastructure
- Load balancing
- Database read replicas
- Monitoring
- Logging infrastructure

These are not required for the V1 application.

---

# 38. Testing Architecture

Testing should exist at multiple levels.

```text
Tests
├── Unit Tests
├── Integration Tests
└── API Tests
```

### Unit Tests

Test isolated application logic.

### Integration Tests

Test interactions between application components.

### API Tests

Test complete HTTP behavior such as:

```text
Request
 ↓
Middleware
 ↓
Controller
 ↓
Database
 ↓
Response
```

Critical authentication and authorization behavior should be tested.

---

# 39. Deployment Architecture

A production deployment can follow:

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │   React Client  │
              │     Hosting     │
              └────────┬────────┘
                       │
                       │ HTTPS
                       ▼
              ┌─────────────────┐
              │  Express API    │
              │   Node.js       │
              └────────┬────────┘
                       │
                       │ Secure DB connection
                       ▼
              ┌─────────────────┐
              │      MySQL      │
              │     Database    │
              └─────────────────┘
```

The exact hosting providers are deployment decisions and are not part of the core application architecture.

---

# 40. V1 Architecture Scope

## Included

- React frontend
- Node.js backend
- Express REST API
- MySQL database
- JWT authentication
- bcrypt password hashing
- Task CRUD
- User-task ownership
- Validation
- Error handling
- Security middleware
- Database migrations

## Not Included

- Microservices
- Kubernetes
- Message queues
- Redis
- WebSockets
- AI services
- Advanced analytics
- Multi-tenant organizations
- Complex role-based access control
- Event-driven architecture

The V1 architecture prioritizes simplicity and maintainability.

---

# 41. Architecture Principles

The project follows these principles:

### Separation of Concerns

Each layer has a focused responsibility.

### Security by Design

Authentication and authorization are enforced by the backend.

### Single Responsibility

Modules should have clear and focused responsibilities.

### Reusability

Common frontend components and backend services should be reusable.

### Maintainability

The project structure should make future changes easy.

### Simplicity

V1 avoids unnecessary infrastructure and complexity.

### API Contract

The frontend and backend communicate through a defined REST API contract.

---

# 42. V1 Architecture Completion Criteria

The architecture is considered complete for V1 when:

- [ ] Client and server are separated.
- [ ] Client communicates with server through REST APIs.
- [ ] Server communicates with MySQL.
- [ ] Authentication middleware protects private routes.
- [ ] Authorization enforces task ownership.
- [ ] Controllers and services have clear responsibilities.
- [ ] Database migrations work.
- [ ] Environment variables are used for secrets.
- [ ] Error handling is centralized.
- [ ] Input validation is implemented.
- [ ] Security middleware is configured.
- [ ] Critical API behavior is tested.
- [ ] Documentation matches the implementation.

---

# 43. Related Documentation

- `README.md` — Project overview and setup
- `docs/requirements.md` — Product and functional requirements
- `docs/architecture.md` — System architecture
- `docs/api.md` — REST API documentation
- `docs/database.md` — Database design

---

# 44. Final Architecture

The final V1 architecture is:

```text
                         ┌──────────────┐
                         │     User     │
                         └──────┬───────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   React Client      │
                    │                     │
                    │ Pages               │
                    │ Components          │
                    │ Context             │
                    │ API Services        │
                    └──────────┬──────────┘
                               │
                         HTTPS / REST
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node + Express    │
                    │                     │
                    │ Routes              │
                    │ Middleware          │
                    │ Controllers         │
                    │ Services            │
                    └──────────┬──────────┘
                               │
                              SQL
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │                     │
                    │ users               │
                    │ tasks               │
                    └─────────────────────┘
```

## Architecture Principle

> **Keep the client focused on user experience, the server responsible for application logic and security, and the database responsible for persistent data.**
