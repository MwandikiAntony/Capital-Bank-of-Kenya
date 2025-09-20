const express = require('express');
const router = express.Router();
const pool = require('../db'); // path to server/db.js

// Simulated M-Pesa deposit endpoint
router.post('/simulate', async (req, res) => {
  const { phone, amount, userId } = req.body;

  if (!amount || !phone) {
    return res.status(400).json({ message: 'phone and amount are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Find user by id or phone
    const userQuery = await client.query(
      'SELECT id, balance FROM users WHERE id = $1 OR phone = $2 LIMIT 1',
      [userId || null, phone]
    );

    if (userQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'User not found by id or phone' });
    }

    const user = userQuery.rows[0];
    const mpesaRef = `SIM${Date.now()}`; // fake reference

    // Update balance
    const newBalance = parseFloat(user.balance || 0) + parseFloat(amount);
    await client.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, user.id]);

    // Insert transaction (completed immediately in simulation)
    await client.query(
      `INSERT INTO transactions (user_id, type, amount, status, created_at)
       VALUES ($1,$2,$3,$4,NOW())`,
      [user.id, 'Deposit', amount, 'Completed']
    );

    await client.query('COMMIT');

    // Return a simulated Daraja-like response
    return res.json({
      MerchantRequestID: 'SIM-' + mpesaRef,
      CheckoutRequestID: mpesaRef,
      ResponseCode: '0',
      ResponseDescription: 'Simulated success - funds credited',
      CustomerMessage: `Simulated payment of ${amount} from ${phone}. Balance updated.`,
      newBalance
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Simulate MPESA error:', err);
    return res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
