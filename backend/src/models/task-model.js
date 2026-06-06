import db from '../db/database.js';

/**
 * Retrieves all tasks with pagination.
 * @param {number} [limit=10] - Maximum number of tasks to return
 * @param {number} [offset=0] - Number of tasks to skip
 * @returns {Array<Object>} Array of task objects
 * @throws {Error} If database query fails
 */
export function getAllTasks(limit = 10, offset = 0) {
  try {
    const stmt = db.prepare('SELECT * FROM tasks');
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
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
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
 * @param {string} [taskData.priority] - Task priority (low/medium/high)
 * @param {string} [taskData.status] - Task status (todo/in-progress/done)
 * @returns {Object} Created task object with ID
 * @throws {Error} If database insertion fails
 */
export function createTask(taskData) {
  try {
    const stmt = db.prepare('INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(
      taskData.title,
      taskData.description || null,
      taskData.priority || 'medium',
      taskData.status || 'todo'
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
    const stmt = db.prepare('UPDATE tasks SET title = ?, description = ?, priority = ?, status = ? WHERE id = ?');
    const task = getTaskById(id);
    
    const updated = {
      title: updates.title !== undefined ? updates.title : task.title,
      description: updates.description !== undefined ? updates.description : task.description,
      priority: updates.priority !== undefined ? updates.priority : task.priority,
      status: updates.status !== undefined ? updates.status : task.status,
    };

    stmt.update(id, updated);
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
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.delete(id);
  } catch (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
}
