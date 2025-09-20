// server/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If you deploy to some hosts that require SSL (e.g. Heroku),
  // uncomment below. For local dev it's okay to leave this out.
  // ssl: { rejectUnauthorized: false }
});

module.exports = pool;
