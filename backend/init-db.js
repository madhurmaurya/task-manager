import { runMigrations } from './src/db/migrate.js';

/**
 * Initialize database migrations.
 * @async
 */
async function init() {
  try {
    console.log('🚀 Running database migrations...');
    await runMigrations();
    console.log('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

init();
