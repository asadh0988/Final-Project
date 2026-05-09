// Rate limiting middleware using express-rate-limit
const rateLimit = require('express-rate-limit');

// General rate limiter
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000, // minutes to ms
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    data: {},
    message: 'Too many requests, please try again later.',
    error: 'Rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
