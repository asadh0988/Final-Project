// Order service for all order-related database operations and audit trail
const db = require('../config/db');
const notificationService = require('./notificationService');

/**
 * Create a new order and trigger notification
 */
async function createOrder(userId, details, scheduledDate) {
  try {
    const stmt = db.prepare('INSERT INTO orders (user_id, status, details, scheduled_date) VALUES (?, ?, ?, ?)');
    const info = stmt.run(userId, 'pending', details, scheduledDate || null);
    // Audit trail: log creation
    db.prepare('INSERT INTO order_audit (order_id, action, user_id, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)')
      .run(info.lastInsertRowid, 'created', userId);
    // Notification
    await notificationService.createNotification(userId, 'Order created', 'order');
    return db.prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid);
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
}

/**
 * Update order status and trigger notification
 */
async function updateOrderStatus(orderId, status, userId) {
  try {
    const stmt = db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(status, orderId);
    // Audit trail
    db.prepare('INSERT INTO order_audit (order_id, action, user_id, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)')
      .run(orderId, `status:${status}`, userId);
    // Notification
    await notificationService.createNotification(userId, `Order status changed to ${status}`, 'order');
    return db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  } catch (error) {
    console.error('Update order status error:', error);
    throw error;
  }
}

module.exports = {
  createOrder,
  updateOrderStatus
};
