// routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { phone, national_id } = req.body;

  try {
    const result = await db.query(
      'UPDATE users SET phone = $1, national_id = $2 WHERE id = $3 RETURNING *',
      [phone, national_id, id]
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
