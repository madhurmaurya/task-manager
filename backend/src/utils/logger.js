/**
 * Simple logger utility for backend.
 */
const logger = {
  /**
   * Log info message.
   * @param {string} message - Message to log
   * @param {*} [data] - Optional data to log
   */
  info(message, data) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${message}`, data || '');
  },

  /**
   * Log error message.
   * @param {string} message - Message to log
   * @param {Error} [error] - Optional error object
   */
  error(message, error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, error || '');
  },

  /**
   * Log warning message.
   * @param {string} message - Message to log
   * @param {*} [data] - Optional data to log
   */
  warn(message, data) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN: ${message}`, data || '');
  },
};

export { logger };
