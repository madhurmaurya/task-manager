# Task Manager

A full-stack task management application built with Express.js, React, and SQLite. Organize, track, and manage your tasks with a modern, responsive web interface.

## Features

✅ **Create Tasks** — Add new tasks with title, description, and priority level  
✅ **View All Tasks** — Browse tasks in a responsive card-based layout  
✅ **Update Task Status** — Change task status between To Do, In Progress, and Done  
✅ **Delete Tasks** — Remove completed or unnecessary tasks  
✅ **Priority Management** — Assign Low, Medium, or High priority levels  
✅ **Real-time Updates** — Frontend automatically reflects API changes  
✅ **Input Validation** — Server-side validation for all inputs  
✅ **Error Handling** — Comprehensive error messages and logging  

## Tech Stack

### Backend
- **Runtime**: Node.js 18 LTS
- **Framework**: Express.js 4.x
- **Database**: SQLite with `better-sqlite3` driver
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **Linting**: ESLint (Airbnb config)
- **Code Style**: ES modules, async/await, JSDoc

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 4.x
- **Styling**: TailwindCSS 3.x
- **HTTP Client**: Fetch API
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with React plugins

### DevOps & Quality
- **Module System**: ES modules (import/export) throughout
- **Code Standards**: Strict ESLint Airbnb configuration
- **Documentation**: Comprehensive JSDoc on all functions
- **Environment Management**: `.env` configuration files

## Prerequisites

- **Node.js**: v18 LTS or higher
- **npm**: v9.0.0 or higher
- **Git**: For version control
- **Browser**: Modern browser supporting ES6+ (Chrome, Firefox, Safari, Edge)

Verify installation:
```bash
node --version   # Should output v18.x.x
npm --version    # Should output v9.x.x
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Setup Environment Variables

#### Backend Configuration

Copy `.env.example` to `.env` in the backend directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
# Application Environment
NODE_ENV=development

# Server Configuration
PORT=3001

# Database Configuration
DATABASE_URL=sqlite:///data/tasks.db

# Security
JWT_SECRET=your-secret-key-change-this
```

#### Frontend Configuration

Copy `.env.example` to `.env` in the frontend directory:

```bash
cd frontend
cp .env.example .env
```

The default `.env` should work for local development:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api/v1
```

**Important**: 
- Never commit `.env` files to version control
- Use `.env.example` as a template for other developers
- Keep sensitive data (API keys, secrets) out of the repository

## How to Run Locally

### Start the Backend Server

```bash
cd backend
npm start
```

The backend will start on `http://localhost:3001`

Expected output:
```
[2026-06-06T08:48:52.745Z] INFO: Server running on port 3001 
[2026-06-06T08:48:52.747Z] INFO: Environment: development
```

**Health Check**:
```bash
curl http://localhost:3001/health
# Response: {"success":true,"message":"Server is running"}
```

### Start the Frontend Development Server

In a **new terminal**, navigate to the frontend directory:

```bash
cd frontend
npm run dev
```

The frontend will automatically open at `http://localhost:5173`

The page will automatically reload when you make code changes (hot module replacement).

### Complete Setup (One Command per Terminal)

**Terminal 1 - Backend:**
```bash
cd backend && npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

**Result**: Open http://localhost:5173 in your browser to view the Task Manager application.

## How to Run Tests

### Backend Tests

```bash
cd backend
npm test
```

This runs Jest with coverage reporting. Tests verify:
- ✅ All API endpoints (CRUD operations)
- ✅ Input validation and error handling
- ✅ Database operations
- ✅ Response format compliance

Expected output includes coverage summary:
```
PASS  src/__tests__/routes/tasks.routes.test.js
PASS  src/__tests__/models/task-model.test.js
...
Test Suites: 2 passed, 2 total
Tests: 15 passed, 15 total
Coverage: 82% statements, 75% branches, 80% functions, 80% lines
```

### Frontend Tests

```bash
cd frontend
npm test
```

This runs Vitest with React Testing Library. Tests verify:
- ✅ Component rendering
- ✅ User interactions (form submission, button clicks)
- ✅ API integration
- ✅ Error states and edge cases

### Run Linting

**Backend:**
```bash
cd backend
npm run lint
```

**Frontend:**
```bash
cd frontend
npm run lint
```

Linting checks for:
- ✅ Code style consistency (Airbnb rules)
- ✅ Unused variables and imports
- ✅ Potential bugs and anti-patterns

## API Endpoints Reference

All API endpoints are prefixed with `/api/v1` and located on `http://localhost:3001`

### Health Check

**Endpoint**: `GET /health`

**Description**: Verify the server is running

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

### Get All Tasks

**Endpoint**: `GET /api/v1/tasks`

**Description**: Retrieve all tasks with optional pagination

**Query Parameters**:
- `limit` (optional, integer): Maximum number of tasks to return (default: 10)
- `offset` (optional, integer): Number of tasks to skip (default: 0)

**Example Request**:
```bash
curl http://localhost:3001/api/v1/tasks?limit=5&offset=0
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "priority": "medium",
      "status": "todo",
      "created_at": "2026-06-06T08:49:49.392Z",
      "updated_at": "2026-06-06T08:49:49.392Z"
    }
  ]
}
```

---

### Get Single Task

**Endpoint**: `GET /api/v1/tasks/:id`

**Description**: Retrieve a specific task by ID

**Path Parameters**:
- `id` (required, integer): Task ID

**Example Request**:
```bash
curl http://localhost:3001/api/v1/tasks/1
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "medium",
    "status": "todo",
    "created_at": "2026-06-06T08:49:49.392Z",
    "updated_at": "2026-06-06T08:49:49.392Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Task with ID 999 not found"
}
```

---

### Create Task

**Endpoint**: `POST /api/v1/tasks`

**Description**: Create a new task

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Complete project documentation",
  "description": "Write API documentation and setup guide",
  "priority": "high"
}
```

**Body Parameters**:
- `title` (required, string): Task title (max 255 characters)
- `description` (optional, string): Task description (max 1000 characters)
- `priority` (optional, string): Priority level: `low`, `medium`, `high` (default: `medium`)

**Example Request**:
```bash
curl -X POST http://localhost:3001/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write API documentation and setup guide",
    "priority": "high"
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Complete project documentation",
    "description": "Write API documentation and setup guide",
    "priority": "high",
    "status": "todo",
    "created_at": "2026-06-06T10:30:15.123Z",
    "updated_at": "2026-06-06T10:30:15.123Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Validation failed: Title is required and must be at most 255 characters"
}
```

---

### Update Task

**Endpoint**: `PUT /api/v1/tasks/:id`

**Description**: Update an existing task (partial or full update)

**Path Parameters**:
- `id` (required, integer): Task ID

**Request Headers**:
```
Content-Type: application/json
```

**Request Body** (any combination of these fields):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "low",
  "status": "in-progress"
}
```

**Body Parameters** (all optional):
- `title` (string): New title (max 255 characters)
- `description` (string): New description (max 1000 characters)
- `priority` (string): New priority: `low`, `medium`, `high`
- `status` (string): New status: `todo`, `in-progress`, `done`

**Example Request** (change status):
```bash
curl -X PUT http://localhost:3001/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{ "status": "in-progress" }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "medium",
    "status": "in-progress",
    "created_at": "2026-06-06T08:49:49.392Z",
    "updated_at": "2026-06-06T10:35:22.456Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Validation failed: Status must be todo, in-progress, or done"
}
```

---

### Delete Task

**Endpoint**: `DELETE /api/v1/tasks/:id`

**Description**: Delete a task permanently

**Path Parameters**:
- `id` (required, integer): Task ID

**Example Request**:
```bash
curl -X DELETE http://localhost:3001/api/v1/tasks/1
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Task with ID 999 not found"
}
```

---

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### HTTP Status Codes
- **200 OK** — Successful GET/PUT/DELETE request
- **201 Created** — Successful POST request (resource created)
- **400 Bad Request** — Validation error or malformed request
- **404 Not Found** — Resource does not exist
- **500 Internal Server Error** — Server error (check logs)

---

## Folder Structure Explanation

### Root Level
```
task-manager/
├── .github/                    # GitHub-specific files and documentation
├── backend/                    # Express.js API server
├── frontend/                   # React SPA application
├── README.md                   # This file
└── .gitignore                  # Git ignore rules
```

### Backend Structure (`backend/`)

```
backend/
├── src/
│   ├── db/
│   │   ├── database.js         # SQLite connection and initialization
│   │   ├── migrate.js          # Database migration runner
│   │   └── migrations/
│   │       └── 001_create_tasks.sql  # Schema: tasks table definition
│   ├── models/
│   │   └── task-model.js       # Task database queries (CRUD operations)
│   ├── routes/
│   │   └── tasks.routes.js     # API endpoints: GET, POST, PUT, DELETE /api/v1/tasks
│   └── utils/
│       ├── logger.js           # Logging utility with timestamps
│       └── response-helper.js  # Helper functions for consistent API responses
├── .env                        # Environment variables (GITIGNORED - local only)
├── .env.example                # Template for .env file
├── .eslintrc.json              # ESLint configuration (Airbnb rules)
├── .gitignore                  # Git ignore for backend
├── init-db.js                  # Database initialization script
├── jest.config.js              # Jest testing framework configuration
├── package.json                # Backend dependencies and scripts
├── package-lock.json           # Locked dependency versions
└── server.js                   # Express app initialization (entry point)
```

**Key Files**:
- `server.js` — Main entry point; sets up Express middleware, routes, error handling
- `src/routes/tasks.routes.js` — All CRUD endpoints with validation
- `src/models/task-model.js` — Database abstraction layer
- `src/db/database.js` — SQLite connection pool
- `src/db/migrations/001_create_tasks.sql` — Database schema

### Frontend Structure (`frontend/`)

```
frontend/
├── src/
│   ├── components/
│   │   ├── TaskCard.jsx        # Individual task display with actions (delete, status change)
│   │   ├── TaskForm.jsx        # Form to create new tasks
│   │   └── TaskList.jsx        # Container displaying all tasks
│   ├── utils/
│   │   └── api.js              # Fetch wrapper functions for all API operations
│   ├── App.jsx                 # Root React component (orchestrates TaskForm + TaskList)
│   ├── index.css               # Global TailwindCSS styles and custom components
│   ├── main.jsx                # React entry point (ReactDOM.createRoot)
├── .env                        # Environment variables (GITIGNORED - local only)
├── .env.example                # Template for .env file
├── .eslintrc.json              # ESLint configuration (Airbnb + React rules)
├── .gitignore                  # Git ignore for frontend
├── index.html                  # HTML entry point
├── package.json                # Frontend dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── postcss.config.js           # PostCSS configuration for TailwindCSS
├── tailwind.config.js          # TailwindCSS theme configuration
└── vite.config.js              # Vite build tool configuration
```

**Key Files**:
- `App.jsx` — Main component managing task state and API calls
- `src/components/TaskForm.jsx` — Form for creating tasks
- `src/components/TaskList.jsx` — Displays all tasks by rendering TaskCard components
- `src/components/TaskCard.jsx` — Individual task display with update/delete buttons
- `src/utils/api.js` — All fetch() calls abstracted and documented
- `index.css` — TailwindCSS + custom utility classes

### GitHub Configuration (`/.github/`)

```
.github/
├── agents/                     # Custom Copilot AI agents
│   ├── backend-expert.md       # Backend development expert agent
│   ├── code-reviewer.md        # Code review specialist agent
│   └── test-writer.md          # Test writing expert agent
├── prompts/                    # Reusable prompt templates
│   ├── new-api-route.prompt.md # Template for scaffolding API routes
│   ├── new-component.prompt.md # Template for React components
│   └── write-tests.prompt.md   # Template for writing tests
├── skills/                     # Skill documentation
│   └── api-patterns.md         # Reference patterns for API development
└── copilot-instructions.md     # Global project standards and guidelines
```

**Purpose**: Contains documentation and AI assistant configurations to maintain consistent code quality and developer productivity.

---

## Database Schema

The application uses SQLite with one main table:

### Tasks Table

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK(status IN ('todo', 'in-progress', 'done')) DEFAULT 'todo',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks(status);
```

**Columns**:
- `id` — Primary key (auto-increment)
- `title` — Task title (required, string)
- `description` — Task description (optional, string)
- `priority` — Priority level (default: medium; values: low, medium, high)
- `status` — Task status (default: todo; values: todo, in-progress, done)
- `created_at` — Task creation timestamp
- `updated_at` — Last update timestamp

---

## Code Standards

This project follows strict coding standards to ensure consistency and maintainability:

### Module System
- ✅ ES modules only (`import`/`export`)
- ✅ Named exports on all functions/classes
- ✅ No CommonJS (`require`/`module.exports`)

### Async Patterns
- ✅ `async/await` only (no `.then()` chains)
- ✅ `try/catch` for error handling
- ✅ Promise-based functions

### Documentation
- ✅ JSDoc comments on all exported functions
- ✅ Parameter types documented
- ✅ Return types specified
- ✅ Error conditions noted

### Naming Conventions
- ✅ Files: `kebab-case` (e.g., `task-model.js`)
- ✅ React components: `PascalCase` (e.g., `TaskCard.jsx`)
- ✅ Database: `snake_case` (e.g., `created_at`, `task_id`)
- ✅ Routes: `/api/v1/` prefix

### Input Validation
- ✅ All user inputs validated via `express-validator`
- ✅ Server-side validation (never trust client)
- ✅ Clear error messages returned

### Security
- ✅ Parameterized SQL queries (no injection vulnerabilities)
- ✅ CORS enabled for frontend integration
- ✅ No hardcoded secrets (use `.env` variables)
- ✅ `.env` files not committed to version control

---

## Troubleshooting

### Backend Won't Start

**Problem**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**: Port 3001 is already in use. Either:
- Kill the process using port 3001, or
- Change `PORT` in `backend/.env`

```bash
# Windows - Find process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

---

### Frontend Can't Connect to Backend

**Problem**: CORS error or API calls fail

**Solution**: 
- Ensure backend is running on port 3001
- Check `frontend/.env` has correct `VITE_API_URL=http://localhost:3001/api/v1`
- Verify backend has CORS enabled

---

### Database Errors

**Problem**: `Database is locked` or migration fails

**Solution**:
- Restart the backend server (clears database connection)
- Delete `data/tasks.db` and let migrations recreate it
- Check `backend/.env` for valid `DATABASE_URL`

---

### npm Install Fails

**Problem**: `npm ERR! 404 Not Found`

**Solution**:
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Contributing

When adding new features, ensure:
1. ✅ All code follows standards in `.github/copilot-instructions.md`
2. ✅ New functions have JSDoc comments
3. ✅ Tests are written for new functionality
4. ✅ ESLint passes: `npm run lint`
5. ✅ All tests pass: `npm test`
6. ✅ `.env` files are not committed

---

## Project Structure Diagram

```
Frontend (React 18 + Vite + TailwindCSS)
    ↓ (HTTP/REST API)
Backend (Express.js + Node.js)
    ↓ (SQL queries)
Database (SQLite)
```

**Data Flow**:
1. User interacts with React components (TaskForm, TaskList, TaskCard)
2. Components call API functions from `utils/api.js`
3. Fetch requests sent to backend on `http://localhost:3001/api/v1`
4. Backend validates input and queries SQLite database
5. Response formatted as `{ success, data/error }` and returned
6. Frontend updates component state and re-renders

---

## License

This project is proprietary and confidential.

---

## Support

For issues or questions:
- Check this README first
- Review `.github/copilot-instructions.md` for code standards
- Check backend logs (check terminal output for errors)
- Ensure both backend and frontend servers are running

---

**Last Updated**: June 6, 2026  
**Version**: 1.0.0
