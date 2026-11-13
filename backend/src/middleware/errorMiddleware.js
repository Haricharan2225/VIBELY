/**
 * 404 Not Found route handler
 */
export const notFoundHandler = (req, res, _next) => {
  return res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Central Express error handling middleware
 */
export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Handle Mongoose CastError (bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format for parameter: ${err.path}`,
      error: isDev ? err.message : undefined
    });
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: isDev ? errors : errors[0]
    });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return res.status(409).json({
      success: false,
      message: `Duplicate entry for field(s): ${fields.join(', ')}`,
      error: isDev ? err.message : undefined
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred',
    error: isDev ? { stack: err.stack, details: err } : undefined
  });
};

export default errorHandler;
