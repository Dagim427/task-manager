# Task Management SaaS

A full-stack Task Management SaaS application built with React.js, Node.js, Express.js, and MySQL.

The project demonstrates professional full-stack development practices including authentication, REST API design, database relationships, protected routes, task ownership, and a scalable project architecture.

---

## 1. Project Overview

Task Management SaaS allows authenticated users to:

* Create an account
* Log in securely
* Access a personal dashboard
* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Manage task status
* Access only their own tasks

The project is developed in multiple versions, with V1 focusing on the core task-management functionality.

---

## 2. Tech Stack

### Frontend

* React.js
* JavaScript
* JSX
* CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* JavaScript
* JWT
* bcrypt

### Database

* MySQL

### Development Tools

* Git
* GitHub
* npm
* VS Code

---

## 3. Architecture

The application uses a client-server architecture.

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    │     Client      │
                    └────────┬────────┘
                             │
                         REST API
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express Backend │
                    │     Server      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ MySQL Database  │
                    └─────────────────┘
```

---

## 4. Repository Structure

```text
task-manager/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   ├── scripts/
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── api.md
│   └── database.md
│
├── .gitignore
└── README.md
```

---

## 5. Core Features

### Authentication

* User registration
* User login
* Password hashing
* JWT authentication
* Protected API routes
* Current-user endpoint
* Logout

### Task Management

* Create tasks
* View tasks
* View individual tasks
* Update tasks
* Delete tasks
* Change task status

### Authorization

Users can only access tasks that belong to their account.

---

## 6. Documentation

Project documentation is available in the `docs/` directory.

```text
docs/
├── requirements.md
├── architecture.md
├── api.md
└── database.md
```

### Requirements

Describes the functional and non-functional requirements of the application.

### Architecture

Describes the system architecture, frontend architecture, backend architecture, authentication flow, and future scalability.

### API

Documents all REST API endpoints, request bodies, responses, authentication requirements, and status codes.

### Database

Documents the MySQL database schema, tables, relationships, constraints, indexes, and database security.

---

## 7. Installation

### Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

---

## 8. Install Client Dependencies

```bash
cd client
npm install
```

---

## 9. Install Server Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 10. Environment Variables

Create a `.env` file inside the `server` directory.

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

Never commit `.env` files to GitHub.

---

## 11. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE task_manager;
```

Then run the project's migration command:

```bash
cd server
npm run migrate
```

This creates the required database tables and relationships.

---

## 12. Run the Backend

```bash
cd server
npm run dev
```

The API should be available at:

```text
http://localhost:5000
```

---

## 13. Run the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The React application will run using the development server URL displayed by the terminal.

---

## 14. API

Main API endpoints:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

See:

```text
docs/api.md
```

for complete API documentation.

---

## 15. Authentication Flow

```text
Register
   │
   ▼
Hash Password
   │
   ▼
Create User
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
Client Stores Token
   │
   ▼
Protected Requests
```

---

## 16. Database Relationship

```text
Users
  │
  │ 1
  │
  │ N
  ▼
Tasks
```

One user can have many tasks.

Each task belongs to one user.

---

## 17. Security

The application uses:

* bcrypt for password hashing
* JWT for authentication
* Protected API routes
* User-specific resource authorization
* Environment variables for secrets
* Parameterized database queries
* Input validation

---

## 18. Development Workflow

Recommended development workflow:

```text
1. Create feature branch
       ↓
2. Implement feature
       ↓
3. Test feature
       ↓
4. Review code
       ↓
5. Commit changes
       ↓
6. Push branch
       ↓
7. Create Pull Request
       ↓
8. Merge into main
```

---

## 19. Git Workflow

Example:

```bash
git checkout -b feature/task-update

git add .

git commit -m "feat: add task update functionality"

git push origin feature/task-update
```

---

## 20. V1 Goals

V1 focuses on building a strong full-stack foundation.

```text
Authentication
       +
Task CRUD
       +
Database
       +
REST API
       +
Professional Architecture
```

The goal is to build a functional, maintainable, and production-oriented application rather than adding unnecessary complexity.

---

## 21. Future Versions

### V2

Potential improvements:

* Better UI/UX
* Task filtering
* Task search
* Pagination
* Improved validation
* Automated tests
* Notifications
* Improved dashboard
* Better error handling

### V3

Potential advanced features:

* Projects
* Team collaboration
* Task comments
* File attachments
* Real-time updates
* Redis
* Background jobs
* Docker
* CI/CD
* Advanced monitoring

---

## 22. Project Status

```text
V1 — Core Task Management
Status: In Development / Completed features depend on current branch
```

---

## 23. License

This project is currently intended as a portfolio and learning project.

A production license can be added when the project is published as an open-source application.

---

## 24. Author

**Dagi**

Full-Stack JavaScript Developer

Technologies:

```text
JavaScript
React.js
Node.js
Express.js
MySQL
Git
GitHub
```
