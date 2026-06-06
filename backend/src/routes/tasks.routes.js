import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import * as taskModel from '../models/task-model.js';
import { sendSuccess, sendError } from '../utils/response-helper.js';
import { logger } from '../utils/logger.js';

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
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
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
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
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

    const tasks = taskModel.getAllTasks(limit, offset);
    sendSuccess(res, tasks, 200);
  } catch (error) {
    logger.error('Failed to retrieve tasks:', error);
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
    const task = taskModel.getTaskById(id);

    if (!task) {
      return sendError(res, `Task with ID ${id} not found`, 404);
    }

    sendSuccess(res, task, 200);
  } catch (error) {
    logger.error('Failed to retrieve task:', error);
    sendError(res, 'Failed to retrieve task', 500);
  }
}

/**
 * Creates a new task.
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.title - Task title (required)
 * @param {string} [req.body.description] - Task description (optional)
 * @param {string} [req.body.priority] - Task priority: low, medium, high (optional)
 * @param {string} [req.body.status] - Task status: todo, in-progress, done (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success and created task data
 */
async function createTask(req, res) {
  try {
    const { title, description, priority, status } = req.body;

    const newTask = taskModel.createTask({
      title,
      description: description || null,
      priority: priority || 'medium',
      status: status || 'todo',
    });

    sendSuccess(res, newTask, 201);
  } catch (error) {
    logger.error('Failed to create task:', error);
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
 * @param {string} [req.body.priority] - New task priority (optional)
 * @param {string} [req.body.status] - New task status (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success and updated task data
 */
async function updateTaskHandler(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if task exists
    const existingTask = taskModel.getTaskById(id);
    if (!existingTask) {
      return sendError(res, `Task with ID ${id} not found`, 404);
    }

    const updatedTask = taskModel.updateTask(id, updates);
    sendSuccess(res, updatedTask, 200);
  } catch (error) {
    logger.error('Failed to update task:', error);
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
async function deleteTaskHandler(req, res) {
  try {
    const { id } = req.params;

    // Check if task exists
    const existingTask = taskModel.getTaskById(id);
    if (!existingTask) {
      return sendError(res, `Task with ID ${id} not found`, 404);
    }

    taskModel.deleteTask(id);
    sendSuccess(res, { id }, 200);
  } catch (error) {
    logger.error('Failed to delete task:', error);
    sendError(res, 'Failed to delete task', 500);
  }
}

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

router.get('/api/v1/tasks', getAllTasks);
router.get('/api/v1/tasks/:id', validateTaskId, handleValidationErrors, getTaskById);
router.post('/api/v1/tasks', validateCreateTask, handleValidationErrors, createTask);
router.put('/api/v1/tasks/:id', validateUpdateTask, handleValidationErrors, updateTaskHandler);
router.delete('/api/v1/tasks/:id', validateTaskId, handleValidationErrors, deleteTaskHandler);

export default router;
