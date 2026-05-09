// Admin dashboard API routes with role-based protection, validation, and error handling
const express = require('express');
const { param, validationResult } = require('express-validator');
const db = require('../config/db');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats — total orders, users, revenue, by status
router.get('/stats', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const byStatus = db.prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status').all();
    // Revenue is not implemented in schema, so set to 0
    return res.json({
      success: true,
      data: { totalOrders, totalUsers, byStatus, revenue: 0 },
      message: 'Stats fetched',
      error: ''
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to fetch stats', error: error.message });
  }
});

// GET /api/admin/orders — all orders with filters and search
router.get('/orders', authenticate, authorizeAdmin, async (req, res) => {
  try {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    if (req.query.status) {
      query += ' AND status = ?';
      params.push(req.query.status);
    }
    if (req.query.user_id) {
      query += ' AND user_id = ?';
      params.push(req.query.user_id);
    }
    if (req.query.search) {
      query += ' AND details LIKE ?';
      params.push(`%${req.query.search}%`);
    }
    query += ' ORDER BY created_at DESC';
    const orders = db.prepare(query).all(...params);
    return res.json({ success: true, data: { orders }, message: 'Orders fetched', error: '' });
  } catch (error) {
    console.error('Admin orders error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to fetch orders', error: error.message });
  }
});

// GET /api/admin/users — all users
router.get('/users', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, role, created_at FROM users').all();
    return res.json({ success: true, data: { users }, message: 'Users fetched', error: '' });
  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to fetch users', error: error.message });
  }
});

// PATCH /api/admin/orders/:id/status — change order status
router.patch('/orders/:id/status', authenticate, authorizeAdmin, [
  param('id').isInt(),
  // status in body
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const { status } = req.body;
    const validStatuses = ['pending', 'active', 'scheduled', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, data: {}, message: 'Invalid status', error: 'Invalid status' });
    }
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, data: {}, message: 'Order not found', error: 'Not found' });
    }
    db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(status, req.params.id);
    db.prepare('INSERT INTO order_audit (order_id, action, user_id) VALUES (?, ?, ?)')
      .run(req.params.id, `admin-status:${status}`, req.user.id);
    // Notification
    const notificationService = require('../services/notificationService');
    await notificationService.createNotification(order.user_id, `Order status changed to ${status}`, 'order');
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    return res.json({ success: true, data: { order: updatedOrder }, message: 'Order status updated', error: '' });
  } catch (error) {
    console.error('Admin change status error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to update order status', error: error.message });
  }
});

module.exports = router;
