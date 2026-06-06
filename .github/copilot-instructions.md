# Task Manager - Copilot Instructions

Global instructions and standards for the Task Manager project. All code contributions must follow these guidelines.

## Tech Stack

- **Runtime**: Node.js 18 LTS
- **Backend Framework**: Express 4.x
- **Database**: SQLite with `better-sqlite3` driver
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Testing**: Jest (backend), Vitest + React Testing Library (frontend)
- **Linting**: ESLint with Airbnb config

## Code Style Rules

### Module System

- **ES modules only** — Use `import`/`export`, never `require()` or `module.exports`
- **Named exports only** — Always export functions, classes, and constants by name
  ```javascript
  // ✅ Good
  export async function fetchTasks() { }
  export const API_BASE_URL = '/api/v1';
  
  // ❌ Bad
  export default function() { }
  module.exports = fetchTasks;
  ```

### Async Patterns

- **async/await only** — Never use `.then()` chains or callback-based patterns
  ```javascript
  // ✅ Good
  async function getTasks() {
    const tasks = await db.query('SELECT * FROM tasks');
    return tasks;
  }
  
  // ❌ Bad
  function getTasks() {
    return db.query('SELECT * FROM tasks').then(tasks => tasks);
  }
  ```

### Documentation

- **JSDoc on all functions** — Document parameters, return types, and behavior
  ```javascript
  /**
   * Retrieves all tasks for a user.
   * @async
   * @param {number} userId - The user ID
   * @returns {Promise<Array<Task>>} Array of task objects
   * @throws {Error} If database query fails
   */
  export async function getUserTasks(userId) {
    // implementation
  }
  ```

### Variable Declarations

- **No `var`** — Use `const` by default, `let` when reassignment is needed
  ```javascript
  // ✅ Good
  const taskId = 123;
  let count = 0;
  count += 1;
  
  // ❌ Bad
  var taskId = 123;
  ```

### Console Output

- **No `console.log()` in production** — Remove all debug logging before committing
  - Use proper logging library in backend (e.g., Winston, Pino) for production code
  - Frontend may use `console.error()` or `console.warn()` for critical issues only

## Naming Conventions

### File Naming

- **kebab-case for files** — Separate words with hyphens
  ```
  src/
    backend/
      utils/
        database-query.js
        error-handler.js
        validate-input.js
      routes/
        task-routes.js
    frontend/
      components/
        task-list.jsx
        task-form.jsx
  ```

### Component Naming

- **PascalCase for React components** — Always capitalize
  ```jsx
  // ✅ Good
  export function TaskList({ tasks }) { }
  export function TaskForm() { }
  
  // ❌ Bad
  export function taskList({ tasks }) { }
  export function task_form() { }
  ```

### Database Naming

- **snake_case for tables and columns** — Consistent SQL convention
  ```sql
  -- ✅ Good
  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    task_title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  -- ❌ Bad
  CREATE TABLE Tasks (
    ID INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL
  );
  ```

### Route Naming

- **Use `/api/v1/` prefix for all API routes** — Version your API from day one
  ```javascript
  // ✅ Good
  router.get('/api/v1/tasks', getTasks);
  router.post('/api/v1/tasks', createTask);
  router.put('/api/v1/tasks/:id', updateTask);
  router.delete('/api/v1/tasks/:id', deleteTask);
  
  // ❌ Bad
  router.get('/tasks', getTasks);
  router.get('/task/:id', getTask);
  ```

## API Response Format

- **Consistent response structure** — Always return `{ success, data/error }` format
- **Use HTTP status codes** — Appropriate codes for different scenarios

### Success Response

```javascript
// ✅ Good - 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "completed": false
  }
}

// ✅ Good - 201 Created
{
  "success": true,
  "data": {
    "id": 2,
    "title": "New task",
    "completed": false
  }
}
```

### Error Response

```javascript
// ✅ Good - 400 Bad Request
{
  "success": false,
  "error": "Validation failed: title is required"
}

// ✅ Good - 404 Not Found
{
  "success": false,
  "error": "Task with ID 999 not found"
}

// ✅ Good - 500 Internal Server Error
{
  "success": false,
  "error": "Database connection failed"
}
```

### Response Helper

```javascript
// Backend utility function
export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

export const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({ success: false, error: message });
};
```

## Input Validation

- **Always use `express-validator`** — Validate all incoming requests
- **Validate at middleware level** — Before reaching route handlers

### Express-Validator Middleware

```javascript
import { body, param, validationResult } from 'express-validator';

export const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must be at most 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 'Validation failed: ' + errors.array().map(e => e.msg).join(', '), 400);
  }
  next();
};

// In route
router.post(
  '/api/v1/tasks',
  validateCreateTask,
  handleValidationErrors,
  createTask
);
```

## Testing Requirements

### Coverage Rules

- **Every API route must have tests** — No exceptions
- **Every utility function must have tests** — All helpers and utilities
- **Minimum 80% code coverage** — Aim for high coverage

### Test File Organization

- **Store tests in `__tests__/` folders** — Mirror source structure
  ```
  src/
    backend/
      __tests__/
        routes/
          task-routes.test.js
        utils/
          database-query.test.js
        models/
          task-model.test.js
  ```

### Backend Testing (Jest)

```javascript
// src/backend/__tests__/routes/task-routes.test.js
import request from 'supertest';
import app from '../../app.js';

describe('Task Routes', () => {
  describe('POST /api/v1/tasks', () => {
    test('should create a task with valid input', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Buy milk' });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
    });

    test('should return 400 with missing title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('title');
    });
  });
});
```

### Frontend Testing (Vitest + React Testing Library)

```javascript
// src/frontend/__tests__/components/task-form.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '../../components/task-form.jsx';

describe('TaskForm', () => {
  it('should render form inputs', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const handleSubmit = vi.fn();
    render(<TaskForm onSubmit={handleSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test task' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test task'
    }));
  });
});
```

## What NOT to Do

### ❌ Never Commit `.env` Files

- Environment variables must **never** be committed to version control
- Create `.env.example` with placeholder values instead
- Add `.env*` to `.gitignore`

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

```bash
# .env.example
DATABASE_URL=sqlite:///data.db
NODE_ENV=development
API_PORT=3000
```

### ❌ No Raw SQL String Concatenation

- **Always use parameterized queries** to prevent SQL injection
- Use `better-sqlite3` prepared statements

```javascript
// ✅ Good - Parameterized
const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(userId);

// ❌ Bad - String concatenation
const task = db.prepare(`SELECT * FROM tasks WHERE id = ${taskId}`).get();
const query = `SELECT * FROM tasks WHERE user_id = ${userId}`;
```

### ❌ No Unhandled Promise Rejections

- Wrap async operations in try/catch blocks
- Always handle errors in async/await code

```javascript
// ✅ Good
async function getTasks(req, res) {
  try {
    const tasks = await fetchTasks();
    sendSuccess(res, tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    sendError(res, 'Failed to fetch tasks', 500);
  }
}

// ❌ Bad
async function getTasks(req, res) {
  const tasks = await fetchTasks();
  sendSuccess(res, tasks);
}
```

### ❌ No Hardcoded Sensitive Data

- Never hardcode API keys, database credentials, or secrets
- Always use environment variables

```javascript
// ✅ Good
const databasePath = process.env.DATABASE_URL || 'sqlite:///data.db';
const apiKey = process.env.EXTERNAL_API_KEY;

// ❌ Bad
const databasePath = '/home/user/app/data.db';
const apiKey = 'sk_live_abc123def456';
```

### ❌ No Direct Database Access in Routes

- Use models/services layer for database queries
- Keep routes focused on HTTP handling

```javascript
// ✅ Good - Route
import { getUserTasks } from '../models/task-model.js';

router.get('/api/v1/users/:id/tasks', async (req, res) => {
  const tasks = await getUserTasks(req.params.id);
  sendSuccess(res, tasks);
});

// ✅ Good - Model
export async function getUserTasks(userId) {
  return db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(userId);
}

// ❌ Bad - Direct DB access in route
router.get('/api/v1/users/:id/tasks', async (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.params.id);
  res.json(tasks);
});
```

## ESLint Configuration

- **Airbnb config** is the baseline for this project
- Use `.eslintrc.json` in project root
- Run `npm run lint` before committing

```json
{
  "extends": ["airbnb-base"],
  "env": {
    "node": true,
    "es2021": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

## Project Structure

```
task-manager/
├── .github/
│   └── copilot-instructions.md
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── __tests__/
│   ├── package.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── __tests__/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Quick Reference Checklist

Before committing code:

- [ ] All code uses ES modules (import/export)
- [ ] All functions have JSDoc comments
- [ ] No `var` declarations (use `const`/`let`)
- [ ] All API routes return `{ success, data/error }` format
- [ ] All API endpoints are under `/api/v1/`
- [ ] All user inputs validated with `express-validator`
- [ ] No `.env` files committed (only `.env.example`)
- [ ] No raw SQL string concatenation
- [ ] No `console.log()` in production code
- [ ] Routes follow kebab-case file naming
- [ ] React components use PascalCase
- [ ] Database tables/columns use snake_case
- [ ] All tests pass: `npm test` in backend and frontend
- [ ] Code passes linting: `npm run lint`
- [ ] Tests in `__tests__/` folder, mirroring source structure
- [ ] Test coverage >= 80%

---

**Last Updated**: 2026-06-06
