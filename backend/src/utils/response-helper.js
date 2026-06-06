/**
 * Send success response.
 * @param {Object} res - Express response object
 * @param {*} data - Data to send
 * @param {number} [statusCode=200] - HTTP status code
 */
export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Send error response.
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=400] - HTTP status code
 */
export const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
