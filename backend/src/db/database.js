import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory mock database for demonstration
class MockDatabase {
  constructor() {
    this.tasks = new Map();
    this.nextId = 1;
  }

  prepare(sql) {
    return {
      get: (id) => {
        return this.tasks.get(parseInt(id, 10)) || null;
      },
      all: (limit = 10, offset = 0) => {
        return Array.from(this.tasks.values())
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(offset, offset + limit);
      },
      run: (...params) => {
        const [title, description, priority, status] = params;
        const id = this.nextId++;
        const now = new Date().toISOString();
        const task = { id, title, description, priority, status, created_at: now, updated_at: now };
        this.tasks.set(id, task);
        return { lastInsertRowid: id, changes: 1 };
      },
      update: (id, updates) => {
        const task = this.tasks.get(id);
        if (task) {
          const updated = { ...task, ...updates, updated_at: new Date().toISOString() };
          this.tasks.set(id, updated);
          return { changes: 1 };
        }
        return { changes: 0 };
      },
      delete: (id) => {
        return this.tasks.delete(parseInt(id, 10)) ? { changes: 1 } : { changes: 0 };
      },
    };
  }

  exec(sql) {
    // Mock exec for migrations
    return true;
  }

  pragma(pragma) {
    // Mock pragma
    return true;
  }
}

/**
 * Initialize and return SQLite database connection.
 * @returns {MockDatabase} Database instance
 */
export function initializeDatabase() {
  return new MockDatabase();
}

const db = initializeDatabase();

export default db;

