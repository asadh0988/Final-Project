// Migration script to set up all tables using schema.sql
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

try {
  // Read schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  // Execute schema
  db.exec(schema);
  console.log('Database migrated successfully.');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
