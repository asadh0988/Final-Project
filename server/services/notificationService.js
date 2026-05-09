// Notification service for creating and managing notifications
const db = require('../config/db');

/**
 * Create a notification for a user
 * @param {number} userId
 * @param {string} message
 * @param {string} type
 */
async function createNotification(userId, message, type) {
  try {
    const stmt = db.prepare('INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)');
    stmt.run(userId, message, type);
  } catch (error) {
    console.error('Notification creation error:', error);
    throw error;
  }
}

/**
 * Get notifications for a user
 * @param {number} userId
 */
async function getUserNotifications(userId) {
  try {
    const stmt = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
}

/**
 * Mark a notification as read
 * @param {number} id
 */
async function markAsRead(id) {
  try {
    const stmt = db.prepare('UPDATE notifications SET read = 1 WHERE id = ?');
    stmt.run(id);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
}

/**
 * Delete a notification
 * @param {number} id
 */
async function deleteNotification(id) {
  try {
    const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
    stmt.run(id);
  } catch (error) {
    console.error('Delete notification error:', error);
    throw error;
  }
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification
};
