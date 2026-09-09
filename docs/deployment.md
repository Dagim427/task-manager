# Task Management SaaS — Deployment Documentation

## 1. Deployment Overview

This document explains how to deploy the Task Management SaaS application to a production environment.

The application consists of two main parts:

* **Frontend:** React + Vite
* **Backend:** Node.js + Express
* **Database:** MySQL

Production architecture:

```text
User
 │
 ▼
React Frontend
 │
 │ HTTPS API Requests
 ▼
Node.js + Express API
 │
 │ MySQL Connection
 ▼
MySQL Database
```

The frontend and backend are deployed separately and communicate through the production API URL.

---

## 2. Deployment Requirements

Before deployment, make sure you have:

* A Git repository containing the project
* A production hosting provider for the frontend
* A production hosting provider for the backend
* A production MySQL database
* Node.js installed locally for testing
* Git installed locally
* Production environment variables prepared

---

## 3. Pre-Deployment Checklist

Before deploying, verify that the application works correctly in development.

### Backend

```bash
cd server
npm ci
npm test
npm run lint
```

### Frontend

```bash
cd client
npm ci
npm test
npm run lint
npm run build
```

All tests, linting, and the production build should complete successfully before deployment.

---

## 4. Environment Variables

Environment variables contain configuration that should not be hard-coded into the application.

Do not commit production secrets to Git.

### 4.1 Backend Environment Variables

Create a production `.env` file for the backend.

Example:

```env
NODE_ENV=production

PORT=5000

DATABASE_HOST=your-production-database-host
DATABASE_PORT=3306
DATABASE_USER=your-production-database-user
DATABASE_PASSWORD=your-production-database-password
DATABASE_NAME=task_manager

JWT_SECRET=your-long-random-production-secret

CORS_ORIGINS=https://your-frontend-domain.com
```

### Backend Variable Description

| Variable            | Description                         |
| ------------------- | ----------------------------------- |
| `NODE_ENV`          | Application environment             |
| `PORT`              | Port used by the Express server     |
| `DATABASE_HOST`     | Production MySQL host               |
| `DATABASE_PORT`     | MySQL port                          |
| `DATABASE_USER`     | MySQL username                      |
| `DATABASE_PASSWORD` | MySQL password                      |
| `DATABASE_NAME`     | Production database name            |
| `JWT_SECRET`        | Secret used to sign and verify JWTs |
| `CORS_ORIGINS`      | Allowed frontend origin             |

Use a strong, randomly generated value for `JWT_SECRET`.

Never use a development JWT secret in production.

---

## 5. Frontend Environment Variables

The frontend requires the production backend API URL.

Create the production frontend environment configuration:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

The `/api` path is required because the frontend API client uses the configured API base URL for backend requests.

For example:

```text
Frontend
https://your-frontend-domain.com

Backend API
https://your-backend-domain.com/api
```

---

## 6. Database Deployment

Create a production MySQL database using your selected database provider.

Configure the backend with the production database credentials.

Before running migrations, verify that:

* The database exists
* The database user has the required permissions
* The backend can connect to the database
* The database host is reachable from the backend server

Do not use your local development database for production.

---

## 7. Run Database Migrations

The project uses database migrations to create and update the database schema.

From the backend directory:

```bash
cd server
npm run migrate
```

The migration system should create the required database tables.

After migration, verify that the production database contains the expected tables.

---

## 8. Backend Deployment

Deploy the `server` application to your selected Node.js hosting provider.

The backend should:

1. Install dependencies.
2. Load production environment variables.
3. Connect to the production MySQL database.
4. Start the Express application.
5. Expose the API over HTTPS.

Typical production start command:

```bash
npm start
```

The exact build and start configuration depends on the hosting provider.

---

## 9. Backend Health Check

After deploying the backend, verify that the API is running.

Use the health endpoint:

```text
https://your-backend-domain.com/health
```

The endpoint should return a successful response.

Also verify the readiness endpoint:

```text
https://your-backend-domain.com/ready
```

The readiness check should confirm that the application and required dependencies are available.

---

## 10. Configure CORS

The backend must allow requests from the production frontend.

Set:

```env
CORS_ORIGINS=https://your-frontend-domain.com
```

Do not use:

```env
CORS_ORIGINS=*
```

for the production application when a specific frontend origin can be configured.

If the application is deployed on a different frontend domain, update `CORS_ORIGINS` accordingly.

---

## 11. Frontend Deployment

Deploy the `client` application to your selected frontend hosting provider.

Before building the application, configure:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

Then build the frontend:

```bash
cd client
npm ci
npm run build
```

The generated production files can then be deployed by the selected hosting provider.

---

## 12. Production Application Flow

After deployment, the application should work as follows:

```text
User
 │
 ▼
Production React Application
 │
 │ HTTPS
 ▼
Production Express API
 │
 ├── Authentication
 │
 ├── Task Management
 │
 ├── Validation
 │
 └── Authorization
 │
 ▼
Production MySQL
```

Authentication flow:

```text
User
 │
 ▼
Login
 │
 ▼
Frontend
 │
 ▼
POST /api/auth/login
 │
 ▼
Express API
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Frontend receives JWT
 │
 ▼
Authenticated API Requests
```

---

## 13. Production Security Checklist

Before making the application publicly available, verify:

* [ ] `NODE_ENV=production`
* [ ] Strong production `JWT_SECRET`
* [ ] Production database credentials are configured securely
* [ ] Production secrets are not committed to Git
* [ ] CORS is restricted to the production frontend
* [ ] HTTPS is enabled
* [ ] Helmet security middleware is enabled
* [ ] Rate limiting is enabled
* [ ] Passwords are hashed with bcrypt
* [ ] SQL queries use parameterized values
* [ ] Authentication middleware protects private routes
* [ ] Users can only access their own tasks
* [ ] Production error responses do not expose sensitive information

---

## 14. Post-Deployment Testing

After both frontend and backend are deployed, test the complete application.

### Authentication

* [ ] Register a new account
* [ ] Login with valid credentials
* [ ] Reject invalid credentials
* [ ] Access the authenticated dashboard
* [ ] Logout successfully

### Task Management

* [ ] Create a task
* [ ] View tasks
* [ ] Search tasks
* [ ] Filter tasks
* [ ] Update a task
* [ ] Change task status
* [ ] Change task priority
* [ ] Set a due date
* [ ] Delete a task

### Authorization

Create two test accounts.

Verify that:

```text
User A
  │
  └── Task A

User B
  │
  └── Task B
```

User B must not be able to view, update, or delete User A's task.

### Error Handling

Test:

* Invalid login
* Invalid registration
* Missing authentication token
* Expired/invalid JWT
* Invalid task ID
* Invalid task data
* Unauthorized task access
* Invalid API requests

---

## 15. Production Smoke Test

After deployment, perform one complete end-to-end test:

```text
Open Production Website
        ↓
Register
        ↓
Login
        ↓
Open Dashboard
        ↓
Create Task
        ↓
View Task
        ↓
Edit Task
        ↓
Filter/Search
        ↓
Change Status
        ↓
Change Priority
        ↓
Delete Task
        ↓
Logout
```

The complete flow should work without errors.

---

## 16. Monitoring and Logs

After deployment, monitor the backend for:

* Application startup errors
* Database connection errors
* Authentication errors
* API errors
* Unexpected 4xx/5xx responses
* Rate-limit events
* Production crashes

Use the hosting provider's logs and monitoring tools to investigate production issues.

---

## 17. Deployment Updates

When deploying future changes:

```text
Make Changes
     ↓
Run Tests
     ↓
Run Lint
     ↓
Build Frontend
     ↓
Review Changes
     ↓
Commit
     ↓
Push to Git
     ↓
Deploy
     ↓
Run Production Smoke Test
```

Do not deploy untested changes directly to production.

---

## 18. Rollback

If a deployment introduces a serious production problem:

1. Identify the failing release.
2. Check application and database logs.
3. Revert the problematic code if necessary.
4. Redeploy the last known working version.
5. Verify the production health endpoints.
6. Perform the production smoke test again.

Database migrations should be handled carefully because schema changes may not always be safely reversible.

---

## 19. Production Completion Checklist

The deployment is considered complete when:

* [ ] Production MySQL database is created
* [ ] Database migrations have been executed
* [ ] Backend is deployed
* [ ] Backend health endpoint works
* [ ] Backend readiness endpoint works
* [ ] Production CORS is configured
* [ ] Frontend production API URL is configured
* [ ] Frontend is deployed
* [ ] HTTPS works
* [ ] Registration works
* [ ] Login works
* [ ] Task CRUD works
* [ ] Search and filtering work
* [ ] Authorization works
* [ ] Logout works
* [ ] Production smoke test passes
* [ ] No production secrets are exposed in Git

---

## 20. Deployment Architecture

Final production architecture:

```text
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               │ HTTPS
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ HTTPS API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      Backend API     │
                    └──────────┬───────────┘
                               │
                               │ MySQL
                               ▼
                    ┌──────────────────────┐
                    │    MySQL Database    │
                    └──────────────────────┘
```

---

## 21. Important Production Notes

* Never commit `.env` files containing real credentials.
* Keep `.env.example` files free of real secrets.
* Use HTTPS for production traffic.
* Use a strong unique JWT secret.
* Restrict CORS to the actual production frontend.
* Keep production database credentials private.
* Run tests before every deployment.
* Run database migrations carefully.
* Verify the application after every deployment.
