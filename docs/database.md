# Task Management SaaS — Database Documentation

## 1. Overview

The Task Management SaaS uses **MySQL** as its relational database.

The database stores:

* User accounts
* Hashed passwords
* Tasks
* Task ownership
* Task status
* Creation and update timestamps

The V1 database is intentionally simple and focuses on the core application requirements.

---

# 2. Database Architecture

```text
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id                  │
│ name                │
│ email               │
│ password_hash       │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
           ▼
┌─────────────────────┐
│       tasks         │
├─────────────────────┤
│ id                  │
│ user_id             │
│ title               │
│ description         │
│ status              │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

# 3. Database Name

Development database:

```text
task_manager
```

The actual database name should be configurable through an environment variable.

Example:

```text
DB_NAME=task_manager
```

---

# 4. Tables

V1 contains two primary tables:

```text
users
tasks
```

---

# 5. Users Table

The `users` table stores user account information.

## Schema

| Column        | Type         | Constraints                 | Description           |
| ------------- | ------------ | --------------------------- | --------------------- |
| id            | INT          | PRIMARY KEY, AUTO_INCREMENT | Unique user ID        |
| name          | VARCHAR(100) | NOT NULL                    | User's name           |
| email         | VARCHAR(255) | NOT NULL, UNIQUE            | User email            |
| password_hash | VARCHAR(255) | NOT NULL                    | bcrypt password hash  |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Account creation time |
| updated_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Last update time      |

---

# 6. Users SQL

Example schema:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 7. Password Storage

Passwords must never be stored directly.

Incorrect:

```text
password = "Password123"
```

Correct:

```text
password_hash = "$2b$..."
```

The application uses bcrypt to generate the password hash.

Registration flow:

```text
User Password
      │
      ▼
    bcrypt
      │
      ▼
Password Hash
      │
      ▼
users.password_hash
```

Login flow:

```text
Entered Password
      │
      ▼
bcrypt.compare()
      │
      ▼
Stored Password Hash
```

---

# 8. Email Uniqueness

The email column is unique:

```sql
UNIQUE (email)
```

This prevents multiple accounts from using the same email address.

Example:

```text
john@example.com
```

can only belong to one user.

---

# 9. Tasks Table

The `tasks` table stores tasks created by users.

## Schema

| Column      | Type         | Constraints                 | Description         |
| ----------- | ------------ | --------------------------- | ------------------- |
| id          | INT          | PRIMARY KEY, AUTO_INCREMENT | Unique task ID      |
| user_id     | INT          | NOT NULL, FOREIGN KEY       | Task owner          |
| title       | VARCHAR(255) | NOT NULL                    | Task title          |
| description | TEXT         | NULL                        | Task description    |
| status      | VARCHAR(50)  | NOT NULL                    | Current task status |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Creation time       |
| updated_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Last update time    |

---

# 10. Tasks SQL

Example schema:

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

---

# 11. Relationship Between Users and Tasks

The relationship is:

```text
One User
   │
   ├── Task 1
   ├── Task 2
   ├── Task 3
   └── Task N
```

This is a:

```text
One-to-Many
```

relationship.

One user can have many tasks.

Each task belongs to exactly one user.

---

# 12. Foreign Key

The relationship is created through:

```text
tasks.user_id
        │
        ▼
users.id
```

Database constraint:

```sql
FOREIGN KEY (user_id)
REFERENCES users(id)
```

This prevents tasks from referencing users that do not exist.

---

# 13. Cascade Delete

The relationship uses:

```sql
ON DELETE CASCADE
```

Therefore, if a user is deleted:

```text
User
 │
 ├── Task 1
 ├── Task 2
 └── Task 3
```

the user's tasks are automatically deleted.

This prevents orphaned task records.

---

# 14. Task Status

V1 uses task statuses such as:

```text
pending
in_progress
completed
```

Example:

```text
pending
   │
   ▼
in_progress
   │
   ▼
completed
```

The application should validate allowed status values before storing them.

---

# 15. Data Ownership

Every task must contain the ID of its owner:

```text
user_id
```

Example:

```text
User ID: 10

Tasks:

Task 1 → user_id = 10
Task 2 → user_id = 10
Task 3 → user_id = 10
```

When retrieving tasks, the backend should query using the authenticated user's ID.

Example:

```sql
SELECT *
FROM tasks
WHERE user_id = ?;
```

The value should come from the authenticated JWT rather than directly from an untrusted client request.

---

# 16. Task Query Examples

## Get all tasks for a user

```sql
SELECT *
FROM tasks
WHERE user_id = ?;
```

## Get one task owned by a user

```sql
SELECT *
FROM tasks
WHERE id = ?
AND user_id = ?;
```

## Create task

```sql
INSERT INTO tasks (
    user_id,
    title,
    description,
    status
)
VALUES (?, ?, ?, ?);
```

## Update task

```sql
UPDATE tasks
SET
    title = ?,
    description = ?,
    status = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?
AND user_id = ?;
```

## Delete task

```sql
DELETE FROM tasks
WHERE id = ?
AND user_id = ?;
```

---

# 17. Indexes

Indexes improve database query performance.

The primary keys automatically create indexes:

```text
users.id
tasks.id
```

The foreign key should also be indexed for efficient user-task queries.

Example:

```sql
CREATE INDEX idx_tasks_user_id
ON tasks(user_id);
```

For larger datasets, additional indexes can be added based on actual query patterns.

---

# 18. Database Connection

The Node.js server connects to MySQL using database configuration.

Example environment variables:

```text
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
```

These values must not be hard-coded into the application.

---

# 19. Database Layer

The backend should isolate database operations from controllers.

Example structure:

```text
server/
├── models/
│   ├── userModel.js
│   └── taskModel.js
│
├── services/
│   ├── authService.js
│   └── taskService.js
│
└── controllers/
    ├── authController.js
    └── taskController.js
```

The flow is:

```text
Controller
    │
    ▼
Service
    │
    ▼
Model
    │
    ▼
MySQL
```

---

# 20. Database Migration

Database schema changes should be managed through migration scripts rather than manually modifying the production database.

Example:

```text
server/
└── scripts/
    └── migrate.js
```

The migration process can:

1. Create the database.
2. Create the users table.
3. Create the tasks table.
4. Create constraints.
5. Create indexes.

Example command:

```bash
npm run migrate
```

---

# 21. Data Integrity

The database uses constraints to maintain valid data.

Important constraints include:

```text
PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
DEFAULT
```

Examples:

```text
users.id
    → PRIMARY KEY

users.email
    → UNIQUE

tasks.user_id
    → FOREIGN KEY

tasks.title
    → NOT NULL
```

---

# 22. Transactions

Transactions should be used when multiple database operations must succeed or fail together.

Example:

```text
Operation A
    │
    ▼
Operation B
    │
    ▼
Operation C
```

If one operation fails:

```text
ROLLBACK
```

If all operations succeed:

```text
COMMIT
```

V1 may not require many complex transactions, but the architecture supports them when needed.

---

# 23. Database Security

The application should follow these rules:

* Never expose database credentials.
* Store credentials in environment variables.
* Never store plain-text passwords.
* Use parameterized queries.
* Validate user input.
* Enforce ownership at the database query level.
* Use foreign keys.
* Limit database permissions in production.
* Do not expose raw database errors to users.

---

# 24. SQL Injection Protection

Queries should use parameterized values.

Unsafe:

```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

Preferred:

```javascript
const query = `
    SELECT *
    FROM users
    WHERE email = ?
`;

const [rows] = await db.execute(query, [email]);
```

Parameterized queries prevent user input from being interpreted as SQL code.

---

# 25. Database Backup

Production databases should have regular backups.

A backup strategy should include:

```text
Regular automated backups
+
Secure backup storage
+
Recovery testing
```

Backup frequency should be based on the production application's requirements.

---

# 26. V1 Entity Relationship Diagram

```text
┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ PK id               │
│ name                │
│ email               │
│ password_hash       │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │
           │ N
           ▼
┌─────────────────────┐
│       TASKS         │
├─────────────────────┤
│ PK id               │
│ FK user_id          │
│ title               │
│ description         │
│ status              │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

# 27. Future Database Evolution

V2 may introduce additional entities:

```text
projects
project_members
task_comments
task_labels
notifications
```

Potential relationship:

```text
users
  │
  ├── projects
  │      │
  │      ├── tasks
  │      └── project_members
  │
  └── notifications
```

V3 could introduce more advanced database requirements such as:

```text
Audit logs
Soft deletes
Advanced indexing
Full-text search
Reporting tables
Analytics data
```

These should be introduced based on actual product requirements.

---

# 28. Database Design Principles

The database follows these principles:

### Data Integrity

Use constraints to keep data valid.

### Referential Integrity

Use foreign keys to maintain relationships.

### Security

Protect credentials and passwords.

### Normalization

Avoid unnecessary duplication of data.

### Performance

Use indexes for frequently queried fields.

### Scalability

Design tables so additional features can be added without breaking existing data.

---

# 29. Database Summary

V1 contains two core entities:

```text
users
tasks
```

Relationship:

```text
User 1 ─────────── N Tasks
```

The database provides:

* Secure user storage
* Password hash storage
* Task ownership
* Referential integrity
* Timestamps
* Query performance through indexes
* A foundation for future features

The database architecture is intentionally simple for V1 while providing a clean foundation for V2 and V3.
