// Main Express server setup with all middleware, routes, and error handling
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();

// Security headers
app.use(helmet());
// CORS config
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
// Logging
app.use(morgan('dev'));
app.use(logger);
// Rate limiting
app.use(rateLimiter);
// JSON body parsing
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
