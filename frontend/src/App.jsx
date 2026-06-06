import { useEffect, useState } from 'react';
import { fetchTasks } from './utils/api';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';

/**
 * App - Main application component
 * @returns {JSX.Element} The main app component
 */
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please refresh the page.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleRefreshTasks = () => {
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container">
          <div className="py-6">
            <h1 className="text-4xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-gray-600 mt-2">Organize and track your tasks efficiently</p>
          </div>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={handleRefreshTasks}
              className="ml-2 underline font-bold"
            >
              Retry
            </button>
          </div>
        )}

        <TaskForm onTaskCreated={handleTaskCreated} />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading tasks...</p>
          </div>
        ) : (
          <TaskList tasks={tasks} onTasksRefresh={handleRefreshTasks} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container">
          <div className="py-8 text-center text-gray-600 text-sm">
            <p>Task Manager © 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
