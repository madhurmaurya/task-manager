import { useState } from 'react';
import { createTask } from '../utils/api';

/**
 * TaskForm component - form for creating new tasks
 * @param {Object} props - Component props
 * @param {Function} props.onTaskCreated - Callback when task is created
 * @returns {JSX.Element} The task form component
 */
export function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const newTask = await createTask({
        title: title.trim(),
        description: description.trim() || null,
        priority,
      });

      if (onTaskCreated) {
        onTaskCreated(newTask);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-6 border-t-4 border-t-green-500">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
            {' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="255"
            placeholder="Enter task title"
            className="input-field"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="1000"
            placeholder="Enter task description (optional)"
            className="input-field resize-none"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="input-field"
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}
