// Notification API routes with error handling and validation
const express = require('express');
const { param, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

// GET /api/notifications/:userId — get user notifications
router.get('/:userId', authenticate, [param('userId').isInt()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    const notifications = await notificationService.getUserNotifications(req.params.userId);
    return res.json({ success: true, data: { notifications }, message: 'Notifications fetched', error: '' });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to fetch notifications', error: error.message });
  }
});

// PATCH /api/notifications/:id/read — mark as read
router.patch('/:id/read', authenticate, [param('id').isInt()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    await notificationService.markAsRead(req.params.id);
    return res.json({ success: true, data: {}, message: 'Notification marked as read', error: '' });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to mark as read', error: error.message });
  }
});

// DELETE /api/notifications/:id — delete notification
router.delete('/:id', authenticate, [param('id').isInt()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, data: {}, message: 'Validation failed', error: errors.array() });
    }
    await notificationService.deleteNotification(req.params.id);
    return res.json({ success: true, data: {}, message: 'Notification deleted', error: '' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({ success: false, data: {}, message: 'Failed to delete notification', error: error.message });
  }
});

module.exports = router;
