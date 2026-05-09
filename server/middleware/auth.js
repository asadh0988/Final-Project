// JWT authentication middleware with role-based access
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authenticate user by JWT
const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, data: {}, message: 'No token provided', error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ success: false, data: {}, message: 'Invalid token', error: error.message });
  }
};

// Authorize admin role
const authorizeAdmin = (req, res, next) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, data: {}, message: 'Admin access required', error: 'Forbidden' });
    }
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(403).json({ success: false, data: {}, message: 'Admin access error', error: error.message });
  }
};

module.exports = { authenticate, authorizeAdmin };
