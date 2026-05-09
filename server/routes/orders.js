// Orders API routes with validation, error handling, and notification triggers
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

const ORDER_STATUSES = ['pending', 'active', 'scheduled', 'completed', 'cancelled'];

// Helper: validate order status
function isValidStatus(status) {
  return ORDER_STATUSES.includes(status);
}

// GET /api/orders — fetch all orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders').all();
    return res.json({ success: true, data: { orders }, message: 'Orders fetched', error: '' });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to fetch orders', error: error.message });
  }
});

// GET /api/orders/:id — fetch single order
router.get('/:id', authenticate, [param('id').isInt()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, data: {}, message: 'Order not found', error: 'Not found' });
    }
    return res.json({ success: true, data: { order }, message: 'Order fetched', error: '' });
  } catch (error) {
    console.error('Fetch order error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to fetch order', error: error.message });
  }
});

// POST /api/orders — create order
router.post('/', authenticate, [
  body('details').isString().notEmpty(),
  body('scheduled_date').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const { details, scheduled_date } = req.body;
    const stmt = db.prepare('INSERT INTO orders (user_id, status, details, scheduled_date) VALUES (?, ?, ?, ?)');
    const info = stmt.run(req.user.id, 'pending', details, scheduled_date || null);
    // Audit trail
    db.prepare('INSERT INTO order_audit (order_id, action, user_id) VALUES (?, ?, ?)')
      .run(info.lastInsertRowid, 'created', req.user.id);
    // Notification
    await notificationService.createNotification(req.user.id, 'Order created', 'order');
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid);
    return res.status(201).json({ success: true, data: { order }, message: 'Order created', error: '' });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to create order', error: error.message });
  }
});

// PUT /api/orders/:id — edit order details
router.put('/:id', authenticate, [
  param('id').isInt(),
  body('details').isString().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const { details } = req.body;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, data: {}, message: 'Order not found', error: 'Not found' });
    }
    db.prepare('UPDATE orders SET details = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(details, req.params.id);
    db.prepare('INSERT INTO order_audit (order_id, action, user_id) VALUES (?, ?, ?)')
      .run(req.params.id, 'edited', req.user.id);
    await notificationService.createNotification(order.user_id, 'Order updated', 'order');
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    return res.json({ success: true, data: { order: updatedOrder }, message: 'Order updated', error: '' });
  } catch (error) {
    console.error('Edit order error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to update order', error: error.message });
  }
});

// PATCH /api/orders/:id/cancel — cancel order
router.patch('/:id/cancel', authenticate, [param('id').isInt()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, data: {}, message: 'Order not found', error: 'Not found' });
    }
    db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run('cancelled', req.params.id);
    db.prepare('INSERT INTO order_audit (order_id, action, user_id) VALUES (?, ?, ?)')
      .run(req.params.id, 'cancelled', req.user.id);
    await notificationService.createNotification(order.user_id, 'Order cancelled', 'order');
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    return res.json({ success: true, data: { order: updatedOrder }, message: 'Order cancelled', error: '' });
  } catch (error) {
    console.error('Cancel order error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to cancel order', error: error.message });
  }
});

// PATCH /api/orders/:id/schedule — schedule order
router.patch('/:id/schedule', authenticate, [
  param('id').isInt(),
  body('scheduled_date').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const { scheduled_date } = req.body;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, data: {}, message: 'Order not found', error: 'Not found' });
    }
    db.prepare('UPDATE orders SET status = ?, scheduled_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run('scheduled', scheduled_date, req.params.id);
    db.prepare('INSERT INTO order_audit (order_id, action, user_id) VALUES (?, ?, ?)')
      .run(req.params.id, 'scheduled', req.user.id);
    await notificationService.createNotification(order.user_id, 'Order scheduled', 'order');
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    return res.json({ success: true, data: { order: updatedOrder }, message: 'Order scheduled', error: '' });
  } catch (error) {
    console.error('Schedule order error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to schedule order', error: error.message });
  }
});

module.exports = router;
