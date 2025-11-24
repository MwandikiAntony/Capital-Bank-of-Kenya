// routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { phone, national_id } = req.body;

  // Parse and validate ID
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Optional: Validate body inputs
  if (!phone || !national_id) {
    return res.status(400).json({ error: 'Phone and national_id are required' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET phone = $1, national_id = $2 WHERE id = $3 RETURNING *',
      [phone, national_id, parsedId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
