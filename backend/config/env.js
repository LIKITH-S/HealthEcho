// Centralized env loader and exports
const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root by default
dotenv.config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || null,
  JWT_SECRET: process.env.JWT_SECRET || 'change_me',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || null,
};
