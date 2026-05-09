// Request logging middleware using morgan for HTTP logs and custom logs
const morgan = require('morgan');

// Custom logger for additional info
const customLogger = (req, res, next) => {
  try {
    // Log method, url, and user if available
    const user = req.user ? req.user.id : 'guest';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} User:${user}`);
    next();
  } catch (error) {
    console.error('Logger error:', error);
    next();
  }
};

module.exports = customLogger;
