import { updateTask, deleteTask } from '../utils/api';

/**
 * TaskCard component - displays a single task with actions
 * @param {Object} props - Component props
 * @param {Object} props.task - The task object
 * @param {number} props.task.id - Task ID
 * @param {string} props.task.title - Task title
 * @param {string} props.task.description - Task description
 * @param {string} props.task.priority - Task priority (low, medium, high)
 * @param {string} props.task.status - Task status (todo, in-progress, done)
 * @param {Function} props.onTaskDeleted - Callback when task is deleted
 * @param {Function} props.onTaskUpdated - Callback when task is updated
 * @returns {JSX.Element} The task card component
 */
export function TaskCard({ task, onTaskDeleted, onTaskUpdated }) {
  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateTask(task.id, { status: newStatus });
      if (onTaskUpdated) {
        onTaskUpdated(updated);
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await deleteTask(task.id);
        if (onTaskDeleted) {
          onTaskDeleted(task.id);
        }
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };

  return (
    <div className="card mb-4 border-l-4 border-l-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority] || 'bg-gray-100'}`}>
          {task.priority}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || 'bg-gray-100'}`}>
          {task.status}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="input-field text-sm py-1"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {new Date(task.created_at).toLocaleDateString()}
        </p>
        <button
          onClick={handleDelete}
          className="btn btn-danger text-sm py-1 px-3"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
