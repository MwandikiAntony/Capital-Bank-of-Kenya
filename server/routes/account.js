// server/routes/account.js
const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();




/**
 * GET balance, transactions, and user name
 */
router.get('/', auth, async (req, res) => {
  try {
    // account
    const acc = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [req.user.id]
    );
    const account = acc.rows[0];

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // user name
    const userRes = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userRes.rows[0];

    // transactions
    const tx = await pool.query(
      'SELECT * FROM transactions WHERE account_id = $1 ORDER BY created_at DESC',
      [account.id]
    );

    res.json({
      balance: account.balance,
      transactions: tx.rows,
      user: { name: user?.name || 'User' }, // ✅ include user name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Middleware to check session authentication
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// GET /api/account/notifications


router.get('/notifications', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT id, message, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );
console.log("Notifications found:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




/**
 * POST deposit
 */
router.post('/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const acc = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [req.user.id]
    );
    const account = acc.rows[0];
    if (!account) return res.status(404).json({ error: 'Account not found' });

    const newBalance = Number(account.balance) + Number(amount);

    await pool.query('BEGIN');

    await pool.query(
      'UPDATE accounts SET balance = $1 WHERE id = $2',
      [newBalance, account.id]
    );

    await pool.query(
      'INSERT INTO transactions (account_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [account.id, 'deposit', amount, 'Deposit into account']
    );

    await pool.query('COMMIT');

    res.json({ balance: newBalance });
  } catch (err) {
    console.error(err);
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  }
});

//GET BALANCE AFTER WITHDRAW AND DEPOSIT

router.get("/balance", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT balance FROM accounts WHERE user_id = $1",
      [req.user.id]
    );
    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});
/**
 * POST withdraw
 */
router.post('/withdraw', auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const acc = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [req.user.id]
    );
    const account = acc.rows[0];
    if (!account) return res.status(404).json({ error: 'Account not found' });

    if (amount > account.balance) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    const newBalance = Number(account.balance) - Number(amount);

    await pool.query('BEGIN');

    await pool.query(
      'UPDATE accounts SET balance = $1 WHERE id = $2',
      [newBalance, account.id]
    );

    await pool.query(
      'INSERT INTO transactions (account_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [account.id, 'withdraw', amount, 'Withdrawal from account']
    );

    await pool.query('COMMIT');

    res.json({ balance: newBalance });
  } catch (err) {
    console.error(err);
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST transfer (to another user by email)
 */
router.post('/transfer', auth, async (req, res) => {
  const { email, amount } = req.body;
  if (!amount || amount <= 0 || !email) {
    return res.status(400).json({ error: 'Invalid transfer' });
  }

  try {
    // sender
    const senderAcc = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [req.user.id]
    );
    const sender = senderAcc.rows[0];

    if (!sender) {
      return res.status(404).json({ error: 'Sender account not found' });
    }
    if (amount > sender.balance) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // recipient
    const recipientUser = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );
    if (recipientUser.rows.length === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const recipientAcc = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [recipientUser.rows[0].id]
    );
    const recipient = recipientAcc.rows[0];
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient account not found' });
    }

    // new balances
    const newSenderBalance = Number(sender.balance) - Number(amount);
    const newRecipientBalance = Number(recipient.balance) + Number(amount);

    // begin transaction
    await pool.query('BEGIN');

    await pool.query(
      'UPDATE accounts SET balance = $1 WHERE id = $2',
      [newSenderBalance, sender.id]
    );
    await pool.query(
      'UPDATE accounts SET balance = $1 WHERE id = $2',
      [newRecipientBalance, recipient.id]
    );

    await pool.query(
      'INSERT INTO transactions (account_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [sender.id, 'transfer', amount, `Transfer to ${recipientUser.rows[0].email}`]
    );
    await pool.query(
      'INSERT INTO transactions (account_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [recipient.id, 'transfer', amount, `Transfer from ${req.user.id}`]
    );

    await pool.query('COMMIT');

    res.json({ balance: newSenderBalance });
  } catch (err) {
    console.error(err);
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
