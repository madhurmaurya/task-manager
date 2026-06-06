# API Patterns - Code Reference

This document contains reference patterns used throughout the Task Manager project. Copy and adapt these patterns when creating new code.

## Pattern 1: Standard Route File Structure

Complete route file template with imports, router setup, and CRUD operations.

**File**: `backend/src/routes/task-routes.js`

```javascript
import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import * as taskModel from '../models/task-model.js';
import { sendSuccess, sendError } from '../utils/response-helper.js';

const router = Router();

// ============================================================================
// VALIDATION MIDDLEWARE
// ============================================================================

/**
 * Validation middleware for creating a task.
 * @type {Array}
 */
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
    .withMessage('Due date must be a valid ISO 8601 date'),
];

/**
 * Validation middleware for updating a task.
 * @type {Array}
 */
export const validateUpdateTask = [
  param('id')
    .isInt()
    .withMessage('Task ID must be an integer'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
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
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
];

/**
 * Validation middleware for task ID parameter.
 * @type {Array}
 */
export const validateTaskId = [
  param('id')
    .isInt()
    .withMessage('Task ID must be an integer'),
];

/**
 * Middleware to handle validation errors.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(e => e.msg).join(', ');
    return sendError(res, `Validation failed: ${errorMessages}`, 400);
  }
  next();
};

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

/**
 * Retrieves all tasks with optional pagination.
 * @async
 * @param {Object} req - Express request object
 * @param {number} [req.query.limit=10] - Maximum number of tasks to return
 * @param {number} [req.query.offset=0] - Number of tasks to skip
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success and data
 */
async function getAllTasks(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const tasks = await taskModel.getAllTasks(limit, offset);
    sendSuccess(res, tasks, 200);
  } catch (error) {
    console.error('Failed to retrieve tasks:', error);
    sendError(res, 'Failed to retrieve tasks', 500);
  }
}

/**
 * Retrieves a single task by ID.
 * @async
 * @param {Object} req - Express request object
 * @param {number} req.params.id - Task ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success and data
 */
async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = await taskModel.getTaskById(id);

    if (!task) {
      return sendError(res, `Task with ID ${id} not found`, 404);
    }

    sendSuccess(res, task, 200);
  } catch (error) {
    console.error('Failed to retrieve task:', error);
    sendError(res, 'Failed to retrieve task', 500);
  }
}

/**
 * Creates a new task.
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.title - Task title (required)
 * @param {string} [req.body.description] - Task description (optional)
 * @param {string} [req.body.due_date] - Task due date in ISO 8601 format (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success and created task data
 */
async function createTask(req, res) {
  try {
    const { title, description, due_date } = req.body;

    const newTask = await taskModel.createTask({
      title,
      description: description || null,
      due_date: due_date || null,
      completed: false,
    });

    sendSuccess(res, newTask, 201);
  } catch (error) {
    console.error('Failed to create task:', error);
    sendError(res, 'Failed to create task', 500);
  }
}

/**
 * Updates an existing task.
 * @async
 * @param {Object} req - Express request object
 * @param {number} req.params.id - Task ID
 * @param {string} [req.body.title] - New task title (optional)
 * @param {string} [req.body.description] - New task description (optional)
 * @param {string} [req.body.due_date] - New task due date (optional)
 * @param {boolean} [req.body.completed] - Task completion status (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success and updated task data
 */
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if task exists
    const existingTask = await taskModel.getTaskById(id);
    if (!existingTask) {
      return sendError(res, `Task with ID ${id} not found`, 404);
    }

    const updatedTask = await taskModel.updateTask(id, updates);
    sendSuccess(res, updatedTask, 200);
  } catch (error) {
    console.error('Failed to update task:', error);
    sendError(res, 'Failed to update task', 500);
  }
}

/**
 * Deletes a task by ID.
 * @async
 * @param {Object} req - Express request object
 * @param {number} req.params.id - Task ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success and deleted task ID
 */
async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    // Check if task exists
    const existingTask = await taskModel.getTaskById(id);
    if (!existingTask) {
      return sendError(res, `Task with ID ${id} not found`, 404);
    }

    await taskModel.deleteTask(id);
    sendSuccess(res, { id }, 200);
  } catch (error) {
    console.error('Failed to delete task:', error);
    sendError(res, 'Failed to delete task', 500);
  }
}

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

router.get('/api/v1/tasks', getAllTasks);
router.get('/api/v1/tasks/:id', validateTaskId, handleValidationErrors, getTaskById);
router.post('/api/v1/tasks', validateCreateTask, handleValidationErrors, createTask);
router.put('/api/v1/tasks/:id', validateUpdateTask, handleValidationErrors, updateTask);
router.delete('/api/v1/tasks/:id', validateTaskId, handleValidationErrors, deleteTask);

export default router;
```

---

## Pattern 2: Validation Middleware with express-validator

Reusable validation middleware setup.

**File**: `backend/src/middleware/validation.js`

```javascript
import { validationResult } from 'express-validator';
import { sendError } from '../utils/response-helper.js';

/**
 * Middleware to handle validation errors from express-validator.
 * Should be placed after all validation middleware.
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Collect all error messages
    const errorMessages = errors
      .array()
      .map(error => error.msg)
      .join(', ');

    return sendError(
      res,
      `Validation failed: ${errorMessages}`,
      400
    );
  }

  // No validation errors, proceed to next middleware
  next();
};
```

**Usage Example**:

```javascript
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

// Define validation rules
const validateCreateUser = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
];

// Use in route
router.post(
  '/api/v1/users',
  validateCreateUser,
  handleValidationErrors,
  createUser
);
```

---

## Pattern 3: Error Response Pattern

Standard response helper functions for consistent API responses.

**File**: `backend/src/utils/response-helper.js`

```javascript
/**
 * Sends a success response.
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in response
 * @param {number} [statusCode=200] - HTTP status code (default: 200)
 * @returns {void}
 */
export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Sends an error response.
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=400] - HTTP status code (default: 400)
 * @returns {void}
 */
export const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
```

**Response Examples**:

```javascript
// Success - 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "created_at": "2026-06-06T10:00:00Z"
  }
}

// Success - 201 Created
{
  "success": true,
  "data": {
    "id": 2,
    "title": "New task",
    "completed": false,
    "created_at": "2026-06-06T10:05:00Z"
  }
}

// Error - 400 Bad Request
{
  "success": false,
  "error": "Validation failed: Title is required, Description must be at most 1000 characters"
}

// Error - 404 Not Found
{
  "success": false,
  "error": "Task with ID 999 not found"
}

// Error - 500 Internal Server Error
{
  "success": false,
  "error": "Failed to retrieve tasks"
}
```

---

## Pattern 4: Parameterized SQL Queries with better-sqlite3

Safe database queries using prepared statements.

**File**: `backend/src/models/task-model.js`

```javascript
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../../data/tasks.db'));

/**
 * Retrieves all tasks with pagination.
 * @param {number} [limit=10] - Maximum number of tasks to return
 * @param {number} [offset=0] - Number of tasks to skip
 * @returns {Array<Object>} Array of task objects
 * @throws {Error} If database query fails
 */
export function getAllTasks(limit = 10, offset = 0) {
  try {
    // ✅ GOOD - Uses parameterized query with ?
    const stmt = db.prepare(`
      SELECT 
        id, 
        title, 
        description, 
        completed, 
        due_date, 
        created_at, 
        updated_at
      FROM tasks
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    return stmt.all(limit, offset);
  } catch (error) {
    throw new Error(`Failed to retrieve tasks: ${error.message}`);
  }
}

/**
 * Retrieves a single task by ID.
 * @param {number} id - Task ID
 * @returns {Object|null} Task object or null if not found
 * @throws {Error} If database query fails
 */
export function getTaskById(id) {
  try {
    // ✅ GOOD - Uses parameterized query with ?
    const stmt = db.prepare(`
      SELECT 
        id, 
        title, 
        description, 
        completed, 
        due_date, 
        created_at, 
        updated_at
      FROM tasks
      WHERE id = ?
    `);

    return stmt.get(id);
  } catch (error) {
    throw new Error(`Failed to retrieve task: ${error.message}`);
  }
}

/**
 * Creates a new task.
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title
 * @param {string} [taskData.description] - Task description
 * @param {string} [taskData.due_date] - Task due date
 * @param {boolean} [taskData.completed] - Task completion status
 * @returns {Object} Created task object with ID
 * @throws {Error} If database insertion fails
 */
export function createTask(taskData) {
  try {
    // ✅ GOOD - Uses parameterized query with ? for all inputs
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, due_date, completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const result = stmt.run(
      taskData.title,
      taskData.description,
      taskData.due_date,
      taskData.completed ? 1 : 0
    );

    // Return the created task
    return getTaskById(result.lastInsertRowid);
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

/**
 * Updates an existing task.
 * @param {number} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated task object
 * @throws {Error} If database update fails
 */
export function updateTask(id, updates) {
  try {
    // Build dynamic update query
    const allowedFields = ['title', 'description', 'due_date', 'completed'];
    const fieldsToUpdate = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map(key => `${key} = ?`);

    if (fieldsToUpdate.length === 0) {
      return getTaskById(id);
    }

    // ✅ GOOD - Uses parameterized query with ? for all values
    const values = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map(key => {
        if (key === 'completed') {
          return updates[key] ? 1 : 0;
        }
        return updates[key];
      });

    const stmt = db.prepare(`
      UPDATE tasks
      SET ${fieldsToUpdate.join(', ')}, updated_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(...values, id);

    return getTaskById(id);
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
}

/**
 * Deletes a task by ID.
 * @param {number} id - Task ID
 * @returns {void}
 * @throws {Error} If database deletion fails
 */
export function deleteTask(id) {
  try {
    // ✅ GOOD - Uses parameterized query with ?
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
  } catch (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
}

// ❌ BAD EXAMPLES - DO NOT USE

// ❌ BAD - String concatenation (SQL injection vulnerability!)
// const badStmt = db.prepare(`SELECT * FROM tasks WHERE id = ${id}`);
// const task = badStmt.get();

// ❌ BAD - String interpolation in query
// const query = `SELECT * FROM tasks WHERE title = '${title}'`;
// const tasks = db.prepare(query).all();

// ❌ BAD - Mixing parameterized and non-parameterized
// const mixedStmt = db.prepare(`SELECT * FROM tasks WHERE id = ${id} AND completed = ?`);
```

---

## Pattern 5: Jest Integration Test Structure for Routes

Complete test file template for API route testing.

**File**: `backend/src/routes/__tests__/task-routes.test.js`

```javascript
import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../../app.js';
import * as taskModel from '../../models/task-model.js';

// Mock the task model module
jest.mock('../../models/task-model.js');

describe('Task Routes', () => {
  // Setup: Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // GET /api/v1/tasks - Get All Tasks
  // ============================================================================

  describe('GET /api/v1/tasks', () => {
    it('should retrieve all tasks successfully', async () => {
      // Arrange
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          due_date: null,
          created_at: '2026-06-06T10:00:00Z',
          updated_at: '2026-06-06T10:00:00Z',
        },
        {
          id: 2,
          title: 'Task 2',
          description: null,
          completed: true,
          due_date: '2026-06-10T00:00:00Z',
          created_at: '2026-06-05T10:00:00Z',
          updated_at: '2026-06-06T09:00:00Z',
        },
      ];

      taskModel.getAllTasks.mockReturnValue(mockTasks);

      // Act
      const response = await request(app).get('/api/v1/tasks');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTasks);
      expect(taskModel.getAllTasks).toHaveBeenCalledWith(10, 0);
    });

    it('should handle pagination with query parameters', async () => {
      // Arrange
      const mockTasks = [];
      taskModel.getAllTasks.mockReturnValue(mockTasks);

      // Act
      const response = await request(app)
        .get('/api/v1/tasks')
        .query({ limit: 20, offset: 10 });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(taskModel.getAllTasks).toHaveBeenCalledWith(20, 10);
    });

    it('should handle empty task list', async () => {
      // Arrange
      taskModel.getAllTasks.mockReturnValue([]);

      // Act
      const response = await request(app).get('/api/v1/tasks');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should return 500 when database query fails', async () => {
      // Arrange
      taskModel.getAllTasks.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      // Act
      const response = await request(app).get('/api/v1/tasks');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Failed to retrieve tasks');
    });
  });

  // ============================================================================
  // GET /api/v1/tasks/:id - Get Task by ID
  // ============================================================================

  describe('GET /api/v1/tasks/:id', () => {
    it('should retrieve a task by ID successfully', async () => {
      // Arrange
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        due_date: null,
        created_at: '2026-06-06T10:00:00Z',
        updated_at: '2026-06-06T10:00:00Z',
      };

      taskModel.getTaskById.mockReturnValue(mockTask);

      // Act
      const response = await request(app).get('/api/v1/tasks/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTask);
      expect(taskModel.getTaskById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when task does not exist', async () => {
      // Arrange
      taskModel.getTaskById.mockReturnValue(null);

      // Act
      const response = await request(app).get('/api/v1/tasks/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return 400 when ID is not a valid integer', async () => {
      // Act
      const response = await request(app).get('/api/v1/tasks/invalid');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });
  });

  // ============================================================================
  // POST /api/v1/tasks - Create Task
  // ============================================================================

  describe('POST /api/v1/tasks', () => {
    it('should create a task with valid input', async () => {
      // Arrange
      const requestBody = {
        title: 'New Task',
        description: 'Task description',
      };

      const mockCreatedTask = {
        id: 3,
        title: 'New Task',
        description: 'Task description',
        completed: false,
        due_date: null,
        created_at: '2026-06-06T10:30:00Z',
        updated_at: '2026-06-06T10:30:00Z',
      };

      taskModel.createTask.mockReturnValue(mockCreatedTask);

      // Act
      const response = await request(app)
        .post('/api/v1/tasks')
        .send(requestBody);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(3);
      expect(response.body.data.title).toBe('New Task');
      expect(taskModel.createTask).toHaveBeenCalled();
    });

    it('should return 400 when title is missing', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ description: 'No title provided' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Title is required');
      expect(taskModel.createTask).not.toHaveBeenCalled();
    });

    it('should return 400 when title exceeds 255 characters', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'x'.repeat(256) });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('255 characters');
    });

    it('should trim whitespace from title', async () => {
      // Arrange
      const mockCreatedTask = {
        id: 3,
        title: 'Trimmed Task',
        description: null,
        completed: false,
        due_date: null,
        created_at: '2026-06-06T10:30:00Z',
        updated_at: '2026-06-06T10:30:00Z',
      };

      taskModel.createTask.mockReturnValue(mockCreatedTask);

      // Act
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: '  Trimmed Task  ' });

      // Assert
      expect(response.status).toBe(201);
      expect(taskModel.createTask).toHaveBeenCalled();
    });

    it('should handle database error gracefully', async () => {
      // Arrange
      taskModel.createTask.mockImplementation(() => {
        throw new Error('Database error');
      });

      // Act
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'New Task' });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Failed to create task');
    });
  });

  // ============================================================================
  // PUT /api/v1/tasks/:id - Update Task
  // ============================================================================

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update a task successfully', async () => {
      // Arrange
      const mockUpdatedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated description',
        completed: true,
        due_date: null,
        created_at: '2026-06-06T10:00:00Z',
        updated_at: '2026-06-06T10:45:00Z',
      };

      taskModel.getTaskById.mockReturnValue(mockUpdatedTask);
      taskModel.updateTask.mockReturnValue(mockUpdatedTask);

      // Act
      const response = await request(app)
        .put('/api/v1/tasks/1')
        .send({ title: 'Updated Task', completed: true });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Task');
      expect(taskModel.updateTask).toHaveBeenCalled();
    });

    it('should return 404 when task does not exist', async () => {
      // Arrange
      taskModel.getTaskById.mockReturnValue(null);

      // Act
      const response = await request(app)
        .put('/api/v1/tasks/999')
        .send({ title: 'Updated' });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(taskModel.updateTask).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid task ID', async () => {
      // Act
      const response = await request(app)
        .put('/api/v1/tasks/invalid')
        .send({ title: 'Updated' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid completion status', async () => {
      // Act
      const response = await request(app)
        .put('/api/v1/tasks/1')
        .send({ completed: 'not-a-boolean' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation failed');
    });
  });

  // ============================================================================
  // DELETE /api/v1/tasks/:id - Delete Task
  // ============================================================================

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete a task successfully', async () => {
      // Arrange
      const mockTask = { id: 1, title: 'Task to delete' };
      taskModel.getTaskById.mockReturnValue(mockTask);

      // Act
      const response = await request(app).delete('/api/v1/tasks/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      expect(taskModel.deleteTask).toHaveBeenCalledWith('1');
    });

    it('should return 404 when task does not exist', async () => {
      // Arrange
      taskModel.getTaskById.mockReturnValue(null);

      // Act
      const response = await request(app).delete('/api/v1/tasks/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(taskModel.deleteTask).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid task ID', async () => {
      // Act
      const response = await request(app).delete('/api/v1/tasks/invalid');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

---

## Quick Copy-Paste Snippets

### Express Router Setup
```javascript
import { Router } from 'express';

const router = Router();

// Define routes here

export default router;
```

### Function with JSDoc
```javascript
/**
 * Brief description of what this function does.
 * 
 * More detailed explanation if needed.
 * 
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * @throws {Error} When specific error occurs
 */
export async function functionName(paramName) {
  // Implementation
}
```

### Try/Catch Error Handler
```javascript
async function routeHandler(req, res) {
  try {
    // Your logic here
    sendSuccess(res, data, 200);
  } catch (error) {
    console.error('Error context:', error);
    sendError(res, 'User-friendly error message', 500);
  }
}
```

### Database Query with Parameters
```javascript
const stmt = db.prepare('SELECT * FROM table WHERE column = ?');
const result = stmt.get(value);
```

### Describe/It Test Block
```javascript
describe('FunctionName', () => {
  it('should do something when condition is met', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionName(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```
