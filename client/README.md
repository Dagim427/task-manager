# Task Management SaaS — Client

The `client` directory contains the frontend application for the Task Management SaaS.

The frontend is built with React.js and communicates with the backend through a REST API.

---

## 1. Frontend Responsibilities

The client application is responsible for:

* Rendering the user interface
* User registration
* User login
* Authentication state
* Protected routes
* Dashboard
* Task management UI
* Form handling
* API communication
* Loading states
* Error handling
* User feedback

---

## 2. Tech Stack

* React.js
* JavaScript
* JSX
* CSS
* Axios
* React Router
* npm

---

## 3. Frontend Architecture

```text
React Application
       │
       ├── Pages
       │
       ├── Components
       │
       ├── Context
       │
       ├── Hooks
       │
       ├── Services
       │
       └── Routes
                │
                ▼
            REST API
                │
                ▼
          Node.js Server
```

---

## 4. Folder Structure

```text
client/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── Tasks.jsx
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── taskService.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

## 5. Pages

Pages represent complete application screens.

### Login

Allows existing users to authenticate.

### Register

Allows new users to create an account.

### Dashboard

Displays authenticated user information and task-related information.

### Tasks

Provides the main task-management interface.

---

## 6. Components

Components are reusable UI elements.

Examples:

```text
Navbar
Sidebar
TaskCard
TaskForm
Button
Input
Modal
LoadingSpinner
ErrorMessage
```

Components should be kept reusable and focused.

---

## 7. Common Components

Common components are reusable application-level components.

Example:

```text
components/common/
├── Navbar.jsx
├── Sidebar.jsx
├── Loading.jsx
└── ErrorMessage.jsx
```

These components may be used across multiple pages.

---

## 8. UI Components

UI components represent reusable visual building blocks.

Example:

```text
components/ui/
├── Button.jsx
├── Input.jsx
├── Modal.jsx
└── Card.jsx
```

They should have minimal application-specific logic.

---

## 9. Authentication Context

`AuthContext` manages global authentication state.

Example state:

```text
user
token
isAuthenticated
loading
```

Example operations:

```text
login()
logout()
```

This allows different parts of the application to access authentication information without passing it through many component levels.

---

## 10. Services

The service layer handles communication with the backend.

```text
services/
├── api.js
├── authService.js
└── taskService.js
```

### api.js

Contains the Axios configuration.

### authService.js

Handles authentication API requests.

### taskService.js

Handles task API requests.

---

## 11. API Communication

Example:

```text
React Component
      │
      ▼
taskService.js
      │
      ▼
Axios
      │
      ▼
Express API
```

Components should preferably call service functions instead of directly implementing API requests everywhere.

---

## 12. Authentication Flow

```text
Login Page
    │
    ▼
authService.login()
    │
    ▼
POST /api/auth/login
    │
    ▼
Backend
    │
    ▼
JWT Token
    │
    ▼
AuthContext
    │
    ▼
Authenticated Application
```

---

## 13. Protected Routes

Authenticated pages should only be accessible when the user has a valid authentication state.

Example:

```text
Public Routes
├── /login
└── /register

Protected Routes
├── /dashboard
└── /tasks
```

Unauthenticated users attempting to access protected routes should be redirected to the login page.

---

## 14. Task Flow

```text
Tasks Page
    │
    ▼
taskService.getTasks()
    │
    ▼
GET /api/tasks
    │
    ▼
Backend
    │
    ▼
Tasks
    │
    ▼
React State
    │
    ▼
Task Components
```

Creating a task:

```text
Task Form
    │
    ▼
taskService.createTask()
    │
    ▼
POST /api/tasks
    │
    ▼
Backend
    │
    ▼
Database
```

---

## 15. Environment Variables

Frontend environment variables may contain the backend API URL.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Production:

```env
VITE_API_URL=https://your-production-api.com/api
```

Do not place private secrets in frontend environment variables.

---

## 16. Installation

From the project root:

```bash
cd client
npm install
```

---

## 17. Development

Run the frontend:

```bash
npm run dev
```

The development server URL will be displayed in the terminal.

---

## 18. Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 19. Code Organization Principles

The frontend follows these principles:

### Reusability

Create reusable components instead of duplicating UI.

### Separation of Concerns

Keep UI, state, routing, and API communication separated.

### Maintainability

Use clear names and predictable folder structures.

### Simplicity

Avoid unnecessary state-management libraries and abstractions in V1.

---

## 20. Frontend Data Flow

```text
User Interaction
       │
       ▼
React Component
       │
       ▼
Service Function
       │
       ▼
Axios
       │
       ▼
REST API
       │
       ▼
Response
       │
       ▼
React State
       │
       ▼
UI Update
```

---

## 21. Error Handling

The frontend should handle:

* Invalid login
* Registration errors
* Unauthorized requests
* Validation errors
* Network errors
* Server errors
* Loading states
* Empty task lists

Example:

```text
Loading
   ↓
API Request
   ↓
Success → Display Data

Error → Display Error Message
```

---

## 22. Frontend Security

The frontend should:

* Never store passwords.
* Never expose backend secrets.
* Send JWT with protected requests.
* Handle expired authentication.
* Avoid trusting client-side authorization.
* Validate user input before submission.

The backend remains the source of truth for authentication and authorization.

---

## 23. Testing

Future frontend tests can cover:

```text
Login
Registration
Protected routes
Task creation
Task update
Task deletion
Error states
Loading states
```

---

## 24. Future Improvements

Potential V2 improvements:

* Better dashboard
* Task filtering
* Search
* Pagination
* Drag-and-drop task management
* Improved responsive design
* Reusable form components
* Better loading states
* Automated frontend testing

---

## 25. Frontend Goal

The goal of the V1 frontend is to provide a clean, responsive, maintainable React application that communicates reliably with the backend API.

The frontend should remain simple enough to understand while providing a strong foundation for future versions.
