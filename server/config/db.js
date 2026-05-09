// Database connection using better-sqlite3 with error handling and environment variables
require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

let db;
try {
  // Use environment variable for DB path, fallback to local file
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../database/app.db');
  db = new Database(dbPath, { verbose: console.log });
  console.log('Database connection established:', dbPath);
} catch (error) {
  console.error('Database connection error:', error.message);
  process.exit(1);
}

module.exports = db;
