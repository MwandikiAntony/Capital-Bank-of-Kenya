// server/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const accountRoutes = require('./routes/account');
const authRoutes = require('./routes/auth');
const mpesaRoutes = require('./routes/mpesa');
const usersRoutes = require('./routes/users'); 
const loanRoutes = require('./routes/loanRoutes'); // ✅ Loan routes

const auth = require('./middleware/auth');
const pool = require('./db');

const app = express();

// CORS - allow client at http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ✅ Mount routes
app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/loans', loanRoutes); // ✅ Added loans here

// ✅ Example protected route
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];
    return res.json({ message: `Welcome back, ${user.name}`, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Test route
app.get('/', (req, res) => res.send('Bank API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
