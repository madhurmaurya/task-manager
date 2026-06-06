import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Run all pending migrations.
 * @async
 * @returns {Promise<void>}
 */
export async function runMigrations() {
  const migrationsDir = __dirname;

  // Get all migration files in order
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    try {
      // Execute each SQL statement
      db.exec(sql);
      console.log(`✓ Migration executed: ${file}`);
    } catch (error) {
      console.error(`✗ Migration failed: ${file}`);
      throw error;
    }
  }
}

export default runMigrations;
