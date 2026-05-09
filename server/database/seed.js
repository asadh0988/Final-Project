// Seed script to insert sample data for testing
require('dotenv').config();
const db = require('../config/db');

try {
  // Insert sample users
  const insertUser = db.prepare('INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)');
  insertUser.run('Admin User', 'admin@example.com', 'admin', '$2a$10$adminhash');
  insertUser.run('Test User', 'user@example.com', 'user', '$2a$10$userhash');

  // Insert sample orders
  const insertOrder = db.prepare('INSERT INTO orders (user_id, status, details) VALUES (?, ?, ?)');
  insertOrder.run(1, 'pending', 'Order details for admin');
  insertOrder.run(2, 'active', 'Order details for user');

  // Insert sample notifications
  const insertNotification = db.prepare('INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)');
  insertNotification.run(1, 'Welcome Admin!', 'info');
  insertNotification.run(2, 'Welcome User!', 'info');

  console.log('Database seeded successfully.');
} catch (error) {
  console.error('Seeding failed:', error.message);
  process.exit(1);
}
