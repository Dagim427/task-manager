# Task Management Database Documentation

## 1. Overview

The Task Management SaaS uses **MySQL** as its relational database.

The V1 database is designed around two core entities:

- `users`
- `tasks`

The relationship is:

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

Each task belongs to exactly one user.

---

# 2. Database Goals

The database is designed to provide:

- Reliable persistent storage
- Clear relationships between users and tasks
- Data integrity
- Secure password storage
- User-level task ownership
- Efficient CRUD operations
- Referential integrity
- Migration-based schema management
- A foundation for future features

---

# 3. Database Technology

| Component | Technology |
|---|---|
| Database | MySQL |
| Database Type | Relational |
| Query Language | SQL |
| Primary Keys | Integer IDs |
| Relationships | Foreign Keys |
| Schema Management | SQL Migrations |

---

# 4. Database Structure

The V1 database contains:

```text
Database
│
├── users
│   ├── id
│   ├── name
│   ├── email
│   ├── password_hash
│   ├── created_at
│   └── updated_at
│
└── tasks
    ├── id
    ├── user_id
    ├── title
    ├── description
    ├── status
    ├── priority
    ├── due_date
    ├── created_at
    └── updated_at
```

---

# 5. Entity Relationship Diagram

```text
┌──────────────────────────┐
│          users           │
├──────────────────────────┤
│ PK id                    │
│    name                  │
│ UK email                 │
│    password_hash         │
│    created_at            │
│    updated_at            │
└────────────┬─────────────┘
             │
             │ 1
             │
             │
             │ N
┌────────────▼─────────────┐
│          tasks           │
├──────────────────────────┤
│ PK id                    │
│ FK user_id               │
│    title                 │
│    description           │
│    status                │
│    priority              │
│    due_date              │
│    created_at            │
│    updated_at            │
└──────────────────────────┘
```

---

# 6. Users Table

The `users` table stores account and authentication information.

## Schema

```sql
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 6.1 Users Columns

| Column | Type | Null | Key | Description |
|---|---|---|---|---|
| `id` | INT UNSIGNED | No | PK | Unique user ID |
| `name` | VARCHAR(100) | No | | User's name |
| `email` | VARCHAR(255) | No | UNIQUE | User's email |
| `password_hash` | VARCHAR(255) | No | | bcrypt password hash |
| `created_at` | TIMESTAMP | No | | Account creation time |
| `updated_at` | TIMESTAMP | No | | Last update time |

---

# 7. User Primary Key

The primary key is:

```text
users.id
```

It uniquely identifies each user.

Example:

```text
id
--
1
2
3
```

The database automatically generates IDs using:

```sql
AUTO_INCREMENT
```

The client should not provide the user ID during registration.

---

# 8. User Email

The email column is unique:

```sql
email VARCHAR(255) NOT NULL UNIQUE
```

This prevents multiple accounts from using the same email address.

Example:

```text
john@example.com
john@example.com
```

The second value should be rejected by the database.

Application-level validation should also provide a user-friendly error.

---

# 9. Password Storage

Passwords must never be stored as plaintext.

Incorrect:

```text
password = "password123"
```

Correct:

```text
password
   ↓
bcrypt
   ↓
password_hash
   ↓
MySQL
```

The database stores only the password hash.

Example:

```text
$2b$12$.......................................................
```

The application uses bcrypt to compare a login password with the stored hash.

---

# 10. Tasks Table

The `tasks` table stores tasks created by users.

## Schema

```sql
CREATE TABLE tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('todo', 'in_progress', 'completed')
        NOT NULL DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high')
        NOT NULL DEFAULT 'medium',
    due_date DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

---

# 11. Tasks Columns

| Column | Type | Null | Key | Description |
|---|---|---|---|---|
| `id` | INT UNSIGNED | No | PK | Unique task ID |
| `user_id` | INT UNSIGNED | No | FK | Owner of task |
| `title` | VARCHAR(255) | No | | Task title |
| `description` | TEXT | Yes | | Optional description |
| `status` | ENUM | No | | Current task status |
| `priority` | ENUM | No | | Task priority |
| `due_date` | DATE | Yes | | Optional due date |
| `created_at` | TIMESTAMP | No | | Creation timestamp |
| `updated_at` | TIMESTAMP | No | | Last update timestamp |

---

# 12. Task Primary Key

The primary key is:

```text
tasks.id
```

It uniquely identifies each task.

Example:

```text
id
--
1
2
3
4
```

---

# 13. User-Task Relationship

The relationship is:

```text
One User
   │
   ├── Many Tasks
   │
   ├── Task 1
   ├── Task 2
   └── Task 3
```

Database relationship:

```text
users.id
   │
   │
   ▼
tasks.user_id
```

`tasks.user_id` is a foreign key referencing `users.id`.

---

# 14. Foreign Key

The foreign key is:

```sql
FOREIGN KEY (user_id)
REFERENCES users(id)
```

This prevents a task from referencing a user that does not exist.

For example, this should fail if user `999` does not exist:

```sql
INSERT INTO tasks (user_id, title)
VALUES (999, 'Test task');
```

---

# 15. Cascade Delete

The V1 relationship uses:

```sql
ON DELETE CASCADE
```

Therefore:

```text
Delete User
     ↓
User's Tasks
     ↓
Deleted automatically
```

Example:

```text
User 1
├── Task 1
├── Task 2
└── Task 3
```

If User 1 is deleted:

```text
User 1
   ↓
Task 1 ─┐
Task 2 ─┼─ deleted
Task 3 ─┘
```

This prevents orphaned tasks.

---

# 16. Task Status

The task status is limited to:

```text
todo
in_progress
completed
```

Database definition:

```sql
status ENUM(
    'todo',
    'in_progress',
    'completed'
)
```

Default:

```text
todo
```

Example:

```text
New task
   ↓
todo
   ↓
in_progress
   ↓
completed
```

---

# 17. Task Priority

Allowed priorities:

```text
low
medium
high
```

Database definition:

```sql
priority ENUM(
    'low',
    'medium',
    'high'
)
```

Default:

```text
medium
```

---

# 18. Due Date

The task due date is optional.

```sql
due_date DATE NULL
```

Example:

```text
2026-08-25
```

If a task does not have a due date:

```text
NULL
```

---

# 19. Timestamps

Both tables contain:

```text
created_at
updated_at
```

### `created_at`

Stores when the record was created.

### `updated_at`

Stores when the record was last updated.

Example:

```text
created_at: 2026-08-20 10:00:00
updated_at: 2026-08-20 11:30:00
```

The database manages these timestamps.

---

# 20. Indexes

Primary keys automatically have indexes.

The user email has a unique index because of:

```sql
UNIQUE (email)
```

The task ownership column should be indexed to improve queries that retrieve tasks for a user.

Example:

```sql
CREATE INDEX idx_tasks_user_id
ON tasks(user_id);
```

A composite index may also be useful for common filtering patterns in future versions.

For V1, the primary ownership index is sufficient.

---

# 21. Common Database Queries

## Find User by Email

```sql
SELECT
    id,
    name,
    email,
    password_hash
FROM users
WHERE email = ?;
```

The parameter should be passed using a parameterized query.

---

## Find User by ID

```sql
SELECT
    id,
    name,
    email
FROM users
WHERE id = ?;
```

---

## Get User's Tasks

```sql
SELECT
    id,
    title,
    description,
    status,
    priority,
    due_date,
    created_at,
    updated_at
FROM tasks
WHERE user_id = ?
ORDER BY created_at DESC;
```

---

## Get One User's Task

```sql
SELECT
    id,
    title,
    description,
    status,
    priority,
    due_date,
    created_at,
    updated_at
FROM tasks
WHERE id = ?
AND user_id = ?;
```

The `user_id` condition is important for authorization.

---

## Create Task

```sql
INSERT INTO tasks (
    user_id,
    title,
    description,
    status,
    priority,
    due_date
)
VALUES (?, ?, ?, ?, ?, ?);
```

---

## Update Task

```sql
UPDATE tasks
SET
    title = ?,
    description = ?,
    status = ?,
    priority = ?,
    due_date = ?
WHERE id = ?
AND user_id = ?;
```

---

## Delete Task

```sql
DELETE FROM tasks
WHERE id = ?
AND user_id = ?;
```

---

# 22. Parameterized Queries

All user-controlled database values must use parameterized queries.

Do not build SQL like:

```js
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

Use parameters instead:

```js
const query = `
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = ?
`;

const [rows] = await db.execute(query, [email]);
```

This helps protect the application against SQL injection.

---

# 23. Database Connection

The server connects to MySQL through a database configuration module.

Conceptually:

```text
Express Application
        ↓
Database Connection Pool
        ↓
MySQL
```

A connection pool is preferred because multiple requests may access the database concurrently.

Example environment variables:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=task_manager
```

Database credentials must not be hardcoded in source code.

---

# 24. Connection Pool

The server should use a connection pool rather than opening a new database connection for every request.

Conceptually:

```text
             ┌──────────────┐
Request 1 ──►│              │
Request 2 ──►│ Connection   │──► MySQL
Request 3 ──►│    Pool      │
Request 4 ──►│              │
             └──────────────┘
```

Benefits include:

- Better performance
- Connection reuse
- Controlled database connections
- Better handling of concurrent requests

---

# 25. Database Migrations

Database schema changes are managed using migrations.

Recommended structure:

```text
server/
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_tasks.sql
│   └── 003_add_task_indexes.sql
│
└── scripts/
    └── migrate.js
```

Migration files should be executed in order.

---

# 26. Migration Process

```text
npm run migrate
       ↓
scripts/migrate.js
       ↓
Read migration files
       ↓
Check migration history
       ↓
Execute pending migrations
       ↓
Record completed migrations
```

The migration process should be repeatable and should not reapply completed migrations.

---

# 27. Migration History

A migration tracking table can be used:

```sql
CREATE TABLE migrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Example:

```text
id | migration_name              | executed_at
---|-----------------------------|-------------------
1  | 001_create_users.sql        | ...
2  | 002_create_tasks.sql        | ...
3  | 003_add_task_indexes.sql    | ...
```

This allows the migration script to determine which migrations have already run.

---

# 28. Recommended Migration Order

```text
001_create_users.sql
        ↓
002_create_tasks.sql
        ↓
003_add_task_indexes.sql
```

The `users` table must exist before `tasks` because `tasks.user_id` references `users.id`.

---

# 29. Database Constraints

The database should enforce important integrity rules.

### Users

```text
id → PRIMARY KEY
email → UNIQUE + NOT NULL
name → NOT NULL
password_hash → NOT NULL
```

### Tasks

```text
id → PRIMARY KEY
user_id → FOREIGN KEY + NOT NULL
title → NOT NULL
status → allowed values
priority → allowed values
```

Application validation should still be performed before database operations.

---

# 30. Application Validation vs Database Constraints

Both layers are important.

```text
Client
  ↓
Client Validation
  ↓
Server Validation
  ↓
Database Constraints
```

The client improves user experience.

The server provides the security boundary.

The database provides final data integrity.

The backend must never rely only on frontend validation.

---

# 31. Data Ownership

A task is owned by the user represented by:

```text
tasks.user_id
```

The authenticated user's ID comes from the verified JWT:

```text
JWT
 ↓
authMiddleware
 ↓
req.user.id
 ↓
Database Query
```

Example:

```sql
SELECT *
FROM tasks
WHERE id = ?
AND user_id = ?;
```

The second parameter must come from the authenticated user.

---

# 32. Preventing Cross-User Access

Incorrect:

```sql
SELECT *
FROM tasks
WHERE id = ?;
```

This could allow a user to request another user's task if authorization is not handled elsewhere.

Correct:

```sql
SELECT *
FROM tasks
WHERE id = ?
AND user_id = ?;
```

This ensures that the task belongs to the authenticated user.

The same ownership condition should be applied to:

- Get task
- Update task
- Delete task

---

# 33. Example Data

## Users

```text
+----+----------+-------------------+
| id | name     | email             |
+----+----------+-------------------+
| 1  | John Doe | john@example.com  |
| 2  | Jane Doe | jane@example.com  |
+----+----------+-------------------+
```

## Tasks

```text
+----+---------+-------------------+-------------+
| id | user_id | title             | status      |
+----+---------+-------------------+-------------+
| 1  | 1       | Build dashboard   | todo        |
| 2  | 1       | Write tests       | completed   |
| 3  | 2       | Update portfolio  | in_progress |
+----+---------+-------------------+-------------+
```

User 1 can access Tasks 1 and 2.

User 2 can access Task 3.

---

# 34. Normalization

The V1 schema follows basic relational database normalization principles.

User information is stored in:

```text
users
```

Task information is stored in:

```text
tasks
```

Instead of repeating user information in every task:

```text
tasks
├── user_name
├── user_email
└── ...
```

the task stores only:

```text
user_id
```

This reduces unnecessary duplication.

---

# 35. Transaction Considerations

Transactions should be used when multiple related database operations must succeed or fail together.

Example:

```text
Operation A
    ↓
Operation B
    ↓
Operation C
```

If all operations succeed:

```text
COMMIT
```

If an operation fails:

```text
ROLLBACK
```

Simple V1 CRUD operations generally do not require complex transactions, but future multi-step operations may.

---

# 36. Backup and Recovery

Production databases should have:

- Regular backups
- Backup retention policies
- Recovery procedures
- Secure backup storage
- Periodic restore testing

Backups are an operational concern and should be configured for the production MySQL environment.

---

# 37. Database Security

Database security requirements:

1. Do not commit database passwords.
2. Use environment variables.
3. Use a dedicated application database user.
4. Avoid using the MySQL root account from the application.
5. Grant only required database permissions.
6. Use parameterized queries.
7. Restrict production database network access.
8. Use encrypted connections when required by the deployment environment.
9. Back up production data securely.
10. Never expose MySQL directly to the public internet without appropriate controls.

---

# 38. V1 Database Scope

## Included

- Users table
- Tasks table
- User-task relationship
- Primary keys
- Foreign keys
- Unique email
- Task status
- Task priority
- Due dates
- Timestamps
- Ownership queries
- Indexes
- Database migrations
- Password hash storage

## Not Included

- Teams
- Organizations
- Task comments
- Task attachments
- Notifications
- Activity history
- Billing
- Subscriptions
- Advanced analytics
- Audit logs
- Soft deletion
- Full-text search

These can be considered for future versions.

---

# 39. Future Database Evolution

Possible V2 tables:

```text
users
tasks
teams
team_members
comments
notifications
attachments
activity_logs
```

Possible V3 additions:

```text
organizations
subscriptions
payments
audit_logs
```

New tables should be introduced through migrations rather than modifying production databases manually.

---

# 40. Database Testing

Database-related tests should verify:

- User creation
- Duplicate email rejection
- Password hash storage
- Task creation
- Task ownership
- Task retrieval
- Task update
- Task deletion
- Foreign key constraints
- Invalid status rejection
- Invalid priority rejection
- User deletion behavior
- Migration behavior

---

# 41. Database Completion Criteria

The V1 database is considered complete when:

- [ ] `users` table exists.
- [ ] `tasks` table exists.
- [ ] Primary keys are configured.
- [ ] Foreign key relationship is configured.
- [ ] User email is unique.
- [ ] Passwords are stored as hashes.
- [ ] Task status is constrained.
- [ ] Task priority is constrained.
- [ ] Task ownership is enforced.
- [ ] Relevant indexes exist.
- [ ] Timestamps are stored.
- [ ] Migrations execute successfully.
- [ ] Migration history is tracked.
- [ ] Parameterized queries are used.
- [ ] Database credentials are stored in environment variables.
- [ ] Database tests cover critical behavior.

---

# 42. Related Documentation

- `README.md` — Project overview and setup
- `docs/requirements.md` — Product requirements
- `docs/architecture.md` — Application architecture
- `docs/api.md` — REST API documentation
- `docs/database.md` — Database schema and data design

---

# 43. Final Database Architecture

```text
                    ┌────────────────────┐
                    │       users        │
                    ├────────────────────┤
                    │ PK id              │
                    │ name               │
                    │ UK email           │
                    │ password_hash      │
                    │ created_at         │
                    │ updated_at         │
                    └─────────┬──────────┘
                              │
                              │ 1:N
                              │
                    ┌─────────▼──────────┐
                    │       tasks        │
                    ├────────────────────┤
                    │ PK id              │
                    │ FK user_id         │
                    │ title              │
                    │ description        │
                    │ status             │
                    │ priority           │
                    │ due_date           │
                    │ created_at         │
                    │ updated_at         │
                    └────────────────────┘
```

## Database Principle

> **Store each piece of data in the appropriate table, enforce relationships with database constraints, and always enforce user ownership at the server/database query level.**
