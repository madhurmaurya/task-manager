/**
 * API utility functions for communicating with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * Fetch all tasks from the API
 * @async
 * @returns {Promise<Array>} Array of task objects
 * @throws {Error} If the API request fails
 */
export async function fetchTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

/**
 * Fetch a single task by ID
 * @async
 * @param {number} id - The task ID
 * @returns {Promise<Object>} The task object
 * @throws {Error} If the API request fails
 */
export async function fetchTaskById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new task
 * @async
 * @param {Object} taskData - The task data (title, description, priority)
 * @returns {Promise<Object>} The created task object
 * @throws {Error} If the API request fails or validation fails
 */
export async function createTask(taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to create task: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

/**
 * Update an existing task
 * @async
 * @param {number} id - The task ID
 * @param {Object} updates - The task updates (title, description, priority, status)
 * @returns {Promise<Object>} The updated task object
 * @throws {Error} If the API request fails or validation fails
 */
export async function updateTask(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to update task: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a task
 * @async
 * @param {number} id - The task ID
 * @returns {Promise<void>}
 * @throws {Error} If the API request fails
 */
export async function deleteTask(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to delete task: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
}
