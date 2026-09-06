Absolutely. For `development.md`, I would make this the **practical guide for another developer who clones your V1 repository and needs to understand how to work on it**.

As with the previous documents, keep it aligned with your actual implementation. For example, if you don't currently use ESLint, Prettier, feature branches, or automated tests, describe them as recommended/future practices rather than claiming they already exist.

# Task Management SaaS — Development Guide

## 1. Development Overview

The Task Management SaaS is a full-stack web application consisting of a React frontend, Node.js/Express backend, and MySQL database.

The development architecture is:

```text
┌──────────────────────┐
│      Frontend        │
│      React.js        │
└──────────┬───────────┘
           │
           │ HTTP / REST API
           ▼
┌──────────────────────┐
│       Backend        │
│    Node.js/Express   │
└──────────┬───────────┘
           │
           │ SQL
           ▼
┌──────────────────────┐
│       Database       │
│        MySQL         │
└──────────────────────┘
```

The development guide explains how to:

- Set up the project locally.
- Configure the development environment.
- Run the frontend and backend.
- Work with the database.
- Add API endpoints.
- Add frontend features.
- Create database migrations.
- Follow Git conventions.
- Run tests.
- Maintain consistent code quality.

---

# 2. Prerequisites

Before developing the project, install the required tools.

### Required

| Tool        | Purpose                  |
| ----------- | ------------------------ |
| Node.js     | Run frontend and backend |
| npm         | Dependency management    |
| MySQL       | Application database     |
| Git         | Version control          |
| Code Editor | Development              |

A modern browser is also required for frontend development.

### Verify Installation

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check Git:

```bash
git --version
```

Check MySQL:

```bash
mysql --version
```

The project should use a Node.js version compatible with the version specified by the repository.

---

# 3. Local Setup

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd task-management-saas
```

The repository contains separate frontend and backend applications.

Example:

```text
task-management-saas/
├── client/
└── server/
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Configure Environment Variables

Create the appropriate environment files.

Backend:

```text
server/.env
```

Frontend:

```text
client/.env
```

Use `.env.example` files when available.

Never commit local secrets to Git.

---

# 4. Repository Structure

The V1 repository follows a separation between frontend and backend responsibilities.

Example:

```text
task-management-saas/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── migrations/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── docs/
├── README.md
└── .gitignore
```

The exact structure should match the current repository.

### Responsibility Separation

Frontend:

```text
UI
State
User Interaction
API Requests
Client-side Routing
```

Backend:

```text
Routes
Controllers
Business Logic
Authentication
Authorization
Validation
Database Access
```

Database:

```text
Users
Tasks
Relationships
Constraints
Migrations
```

---

# 5. Environment Variables

Environment variables contain configuration that should vary between environments.

### Backend

Example:

```env
NODE_ENV=development

PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=task_manager
DATABASE_USER=root
DATABASE_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=

CORS_ORIGIN=http://localhost:3000
```

The exact variable names must match the project's configuration.

### Frontend

Example:

```env
VITE_API_URL=http://localhost:5000
```

The frontend should only contain values that are safe to expose to the browser.

### Security

Never commit:

```text
.env
```

if it contains real secrets.

Instead, provide:

```text
.env.example
```

with placeholder values.

---

# 6. Database Setup

The application uses MySQL.

Create the development database:

```sql
CREATE DATABASE task_manager;
```

Configure the backend:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=task_manager
DATABASE_USER=root
DATABASE_PASSWORD=your_password
```

### Run Migrations

From the backend directory:

```bash
npm run migrate
```

The migration system creates the required tables.

Example:

```text
server/
└── migrations/
    ├── 001_create_users_table.sql
    └── 002_create_tasks_table.sql
```

After running migrations, verify:

```text
users
tasks
```

exist in the database.

---

# 7. Running the Application

The application consists of two development processes.

```text
Frontend
   │
   │ HTTP
   ▼
Backend
   │
   ▼
MySQL
```

## Start Backend

```bash
cd server
npm run dev
```

The backend should start on the configured development port.

Example:

```text
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend development server will provide the local application URL.

Example:

```text
http://localhost:5173
```

The exact port depends on the frontend configuration.

---

# 8. Development Workflow

Development should follow a feature-oriented workflow.

A typical feature process is:

```text
1. Understand Requirement
        ↓
2. Plan Changes
        ↓
3. Update Database if Needed
        ↓
4. Implement Backend
        ↓
5. Test API
        ↓
6. Implement Frontend
        ↓
7. Test User Flow
        ↓
8. Review Code
        ↓
9. Commit Changes
        ↓
10. Update Documentation
```

### Example: New Task Feature

```text
Requirement
    ↓
Database
    ↓
Migration
    ↓
Model/Query
    ↓
Service
    ↓
Controller
    ↓
Route
    ↓
API Test
    ↓
React Service
    ↓
React Component
    ↓
User Test
```

The backend should be completed and verified before depending heavily on the frontend implementation.

---

# 9. Git Workflow

Git is used for version control.

Before starting work:

```bash
git status
```

Pull the latest changes:

```bash
git pull
```

After making changes:

```bash
git status
```

Review changes:

```bash
git diff
```

Stage changes:

```bash
git add .
```

Commit:

```bash
git commit -m "feat: add task filtering"
```

Push:

```bash
git push
```

### Recommended Workflow

```text
Working Tree
     ↓
Review Changes
     ↓
Stage
     ↓
Commit
     ↓
Push
```

Avoid committing unrelated changes together.

---

# 10. Branching Strategy

For a collaborative workflow, feature branches are recommended.

Example:

```text
main
 │
 ├── feature/task-filtering
 ├── feature/password-reset
 └── fix/task-validation
```

### Branch Naming

Feature:

```text
feature/task-filtering
```

Bug fix:

```text
fix/login-validation
```

Documentation:

```text
docs/update-api-documentation
```

Refactoring:

```text
refactor/auth-service
```

### Main Branch

The `main` branch should contain stable code.

Development work should preferably be completed on separate branches before merging.

If your V1 is currently developed by you alone, a simpler workflow using `main` can be acceptable. The branching strategy can become more formal as the project becomes collaborative.

---

# 11. Commit Conventions

Commits should clearly describe the change.

A recommended format is:

```text
type: description
```

### Feature

```bash
git commit -m "feat: add task creation"
```

### Bug Fix

```bash
git commit -m "fix: validate task ownership"
```

### Documentation

```bash
git commit -m "docs: add database documentation"
```

### Refactoring

```bash
git commit -m "refactor: simplify task service"
```

### Tests

```bash
git commit -m "test: add authentication tests"
```

### Chores

```bash
git commit -m "chore: update dependencies"
```

### Examples

Good:

```text
feat: add task update endpoint
fix: prevent unauthorized task access
docs: update API documentation
test: add login validation tests
refactor: extract authentication middleware
```

Avoid vague commits such as:

```text
update
changes
fix
new
final
```

---

# 12. Code Style

Code should prioritize:

- Readability.
- Consistency.
- Maintainability.
- Simple functions.
- Clear naming.
- Separation of responsibilities.

### Naming

Use descriptive names.

Good:

```javascript
const authenticatedUser = req.user;
const taskId = req.params.taskId;
```

Avoid:

```javascript
const x = req.user;
const a = req.params.id;
```

### Functions

Functions should have a clear responsibility.

Prefer:

```text
validateTask()
createTask()
updateTask()
deleteTask()
```

rather than one large function handling every responsibility.

### Controllers

Controllers should primarily handle HTTP concerns:

```text
Request
   ↓
Validation
   ↓
Service
   ↓
Response
```

Business logic should not unnecessarily be placed inside route handlers.

---

# 13. Linting

Linting helps detect common code problems and maintain consistent code quality.

If ESLint is configured, run:

```bash
npm run lint
```

A successful lint should produce no errors.

### Recommended Workflow

Before committing:

```bash
npm run lint
```

Then fix reported issues before pushing.

> If ESLint is not currently configured in V1, add it to the development tooling roadmap rather than documenting it as an existing requirement.

---

# 14. Formatting

Code formatting keeps the codebase consistent.

If Prettier is configured, use:

```bash
npm run format
```

or:

```bash
npx prettier --write .
```

Formatting should cover:

```text
JavaScript
JSX
JSON
CSS
Markdown
```

The project should use one consistent formatting configuration rather than allowing every developer to use different formatting rules.

---

# 15. Testing

Testing should be performed after implementing a feature.

The testing process is:

```text
Implementation
     ↓
Unit Tests
     ↓
Integration/API Tests
     ↓
Frontend Tests
     ↓
Manual User Flow
```

### Backend

Test:

```text
Authentication
Authorization
Validation
Task CRUD
Error Handling
Database Operations
```

### Frontend

Test:

```text
Rendering
Forms
User Interactions
Loading States
Error States
API Integration
```

### Manual Testing

For V1, manually verify important user flows:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create Task
   ↓
View Task
   ↓
Update Task
   ↓
Delete Task
   ↓
Logout
```

Security workflow:

```text
User A
   ↓
Create Task
   ↓
User B Login
   ↓
Attempt Access
   ↓
Access Denied
```

---

# 16. Adding a New API Endpoint

When adding a new API endpoint, follow the backend architecture.

### Step 1 — Define the Requirement

Example:

```text
Allow users to mark a task as completed.
```

### Step 2 — Define the Endpoint

Example:

```http
PATCH /api/tasks/:taskId/complete
```

### Step 3 — Add Validation

Define the required:

- Parameters.
- Request body.
- Query parameters.

### Step 4 — Add Service Logic

The service should contain the business operation.

```text
Controller
    ↓
Task Service
    ↓
Database
```

### Step 5 — Add Controller

The controller should:

1. Read the request.
2. Get the authenticated user.
3. Call the service.
4. Return the response.

### Step 6 — Add Route

Register the endpoint in the appropriate route file.

### Step 7 — Add Authorization

Verify that the authenticated user owns the task.

### Step 8 — Test API

Test:

```text
Successful request
Invalid input
Missing authentication
Invalid authentication
Non-existent task
Another user's task
```

### Step 9 — Update Documentation

Update:

```text
api.md
requirements.md
testing.md
security.md
```

where applicable.

---

# 17. Adding a New Frontend Feature

Frontend features should follow the existing component architecture.

### Step 1 — Define the User Flow

Example:

```text
User clicks "Edit Task"
        ↓
Edit Form Opens
        ↓
User Changes Task
        ↓
Submit
        ↓
API Request
        ↓
Task Updated
        ↓
UI Refreshes
```

### Step 2 — Add API Service

Keep API communication separate from UI components.

Example:

```javascript
taskService.updateTask(taskId, data);
```

### Step 3 — Create/Update Components

Create reusable components where appropriate.

Example:

```text
components/
└── tasks/
    ├── TaskCard.jsx
    ├── TaskForm.jsx
    └── TaskList.jsx
```

### Step 4 — Handle States

The UI should handle:

```text
Loading
Success
Error
Empty State
```

### Step 5 — Test the Feature

Verify the complete user flow.

### Step 6 — Update Documentation

Update relevant documentation if the feature changes:

- Requirements.
- API.
- Architecture.
- Testing.
- Security.

---

# 18. Database Migrations

Database schema changes must be performed through migrations.

Do not manually modify production tables without documenting the change.

### Create Migration

Example:

```text
003_add_task_completed_at.sql
```

### Migration Responsibilities

A migration should:

- Make one logical schema change.
- Be deterministic.
- Be reviewable.
- Avoid unnecessary destructive operations.
- Maintain data integrity.

Example:

```sql
ALTER TABLE tasks
ADD COLUMN completed_at DATETIME NULL;
```

### Migration Workflow

```text
Create Migration
       ↓
Review SQL
       ↓
Run Locally
       ↓
Test Application
       ↓
Commit Migration
       ↓
Deploy
       ↓
Run Production Migration
```

### Important

Never modify an existing migration that has already been applied to shared or production environments.

Create a new migration instead.

---

# 19. Pull Request Checklist

Before merging a feature or bug fix, verify the following.

## Code

- [ ] Code is readable.
- [ ] Naming is clear.
- [ ] No unnecessary duplication.
- [ ] No debugging code remains.
- [ ] No secrets are committed.
- [ ] Changes follow the existing architecture.

## Backend

- [ ] Routes are correct.
- [ ] Validation exists.
- [ ] Authentication is handled.
- [ ] Authorization is handled.
- [ ] Database queries are parameterized.
- [ ] Errors are handled correctly.

## Frontend

- [ ] UI works correctly.
- [ ] Loading state handled.
- [ ] Error state handled.
- [ ] API errors handled.
- [ ] No unnecessary duplicated logic.

## Database

- [ ] Migration added if required.
- [ ] Foreign keys reviewed.
- [ ] Constraints reviewed.
- [ ] Migration tested locally.

## Testing

- [ ] Existing tests pass.
- [ ] New functionality tested.
- [ ] Error cases tested.
- [ ] Authorization tested where applicable.
- [ ] Manual user flow verified.

## Documentation

- [ ] README updated if necessary.
- [ ] API documentation updated.
- [ ] Requirements updated if necessary.
- [ ] Architecture documentation updated if necessary.
- [ ] Security documentation updated if necessary.

## Git

- [ ] Commit messages are meaningful.
- [ ] No unrelated files are included.
- [ ] Branch is up to date.
- [ ] No secrets are committed.

---

# 20. Development Principles

The project follows several development principles.

## Separation of Concerns

Each layer should have a clear responsibility.

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Database
```

Frontend:

```text
Component
  ↓
Hook / State
  ↓
Service
  ↓
API
```

---

## Keep Functions Small

A function should ideally have one clear responsibility.

Instead of:

```text
createTask()
 ├── validate request
 ├── authenticate user
 ├── build SQL
 ├── execute SQL
 ├── format response
 └── send email
```

separate responsibilities where appropriate.

---

## Validate Early

Invalid input should be rejected as early as possible.

```text
Request
  ↓
Validation
  ↓
Business Logic
  ↓
Database
```

---

## Security by Default

Never assume that client input is trustworthy.

Always verify:

- Authentication.
- Authorization.
- Ownership.
- Input validity.

---

## Don't Duplicate Business Logic

If the same business operation is needed in multiple places, extract reusable logic rather than copying it.

---

## Document Important Decisions

Important architectural and technical decisions should be documented.

The project documentation should explain:

```text
Why the architecture exists
How authentication works
How the database is structured
How APIs work
How security is implemented
How the application is deployed
How developers should work on it
```

---

## Keep V1 Focused

V1 should solve the core task-management problem without unnecessary complexity.

The current core should remain focused on:

```text
Authentication
      ↓
Task Management
      ↓
Task Ownership
      ↓
Validation
      ↓
Secure API
```

Advanced features can be introduced in later versions.

---

# Development Workflow Summary

A professional development workflow for this project looks like:

```text
                 REQUIREMENT
                     │
                     ▼
                  DESIGN
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
       Backend               Frontend
          │                     │
          ▼                     ▼
      Database                UI/UX
          │                     │
          └──────────┬──────────┘
                     ▼
                   TEST
                     │
                     ▼
                  REVIEW
                     │
                     ▼
               DOCUMENTATION
                     │
                     ▼
                   COMMIT
                     │
                     ▼
                   PUSH
                     │
                     ▼
                  DEPLOY
```

### The key rule for your V1

Don't treat documentation as something you write only at the end. When you add a meaningful feature, update the relevant documentation at the same time:

```text
Feature
 ├── requirements.md
 ├── api.md
 ├── database.md       ← if DB changes
 ├── testing.md
 ├── security.md       ← if security changes
 └── architecture.md   ← if architecture changes
```

This will make your GitHub repository look much more like a **real software engineering project** rather than simply a collection of source code.
