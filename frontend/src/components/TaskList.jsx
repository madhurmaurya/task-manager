import { useEffect, useState } from 'react';
import { fetchTasks } from '../utils/api';
import { TaskCard } from './TaskCard';

/**
 * TaskList component - fetches and displays all tasks
 * @param {Object} props - Component props
 * @param {Array} props.tasks - Array of task objects to display
 * @param {Function} props.onTasksRefresh - Callback to refresh task list
 * @returns {JSX.Element} The task list component
 */
export function TaskList({ tasks, onTasksRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTaskDeleted = (taskId) => {
    if (onTasksRefresh) {
      onTasksRefresh();
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    if (onTasksRefresh) {
      onTasksRefresh();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No tasks yet. Create one to get started!</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {tasks.length}
            {' '}
            task
            {tasks.length !== 1 ? 's' : ''}
          </p>
          <div>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onTaskDeleted={handleTaskDeleted}
                onTaskUpdated={handleTaskUpdated}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
