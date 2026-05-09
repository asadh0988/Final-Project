// Auth routes: register, login, logout, refresh
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();

// Helper: generate JWT
const generateToken = (user, secret, expiresIn) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn });
};

// Register
router.post('/register', [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const { name, email, password } = req.body;
    const userExists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (userExists) {
      return res.status(409).json({ success: false, data: {}, message: 'Email already registered', error: 'Conflict' });
    }
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, email, 'user', hash);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
    return res.status(201).json({ success: true, data: { user }, message: 'User registered', error: '' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').isString().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ success: false, data: {}, message: 'Invalid credentials', error: 'Unauthorized' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, data: {}, message: 'Invalid credentials', error: 'Unauthorized' });
    }
    const token = generateToken(user, process.env.JWT_SECRET, '15m');
    const refreshToken = generateToken(user, process.env.JWT_REFRESH_SECRET, '7d');
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
    return res.json({ success: true, data: { user, token, refreshToken }, message: 'Login successful', error: '' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Login failed', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return res.json({ success: true, data: {}, message: 'Logged out', error: '' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Logout failed', error: error.message });
  }
});

// Refresh token
router.post('/refresh', (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, data: {}, message: 'No refresh token', error: 'Unauthorized' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, data: {}, message: 'User not found', error: 'Unauthorized' });
    }
    const token = generateToken(user, process.env.JWT_SECRET, '15m');
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ success: true, data: { token }, message: 'Token refreshed', error: '' });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(401).json({ success: false, data: {}, message: 'Invalid refresh token', error: error.message });
  }
});

module.exports = router;
