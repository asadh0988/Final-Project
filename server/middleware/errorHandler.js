// Centralized error handler middleware
module.exports = (err, req, res, next) => {
  // Log error
  console.error('Error:', err);
  // Set status code
  const status = err.statusCode || 500;
  // Send structured error response
  res.status(status).json({
    success: false,
    data: {},
    message: err.message || 'Internal Server Error',
    error: err.stack
  });
};
