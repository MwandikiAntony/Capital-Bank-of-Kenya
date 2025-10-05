const pool = require('../db');

async function createNotification(userId, message) {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, message, is_read) VALUES ($1, $2, false)',
      [userId, message]
    );
  } catch (err) {
    console.error('Error inserting notification:', err);
  }
}

module.exports = { createNotification };
