// server/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); // ✅ for Socket.IO
const { Server } = require('socket.io'); // ✅ Socket.IO

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
app.use('/api/loans', loanRoutes);

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

// ✅ Create HTTP server for Socket.IO
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'], // ✅ ensures fallback to polling if needed
});

// ✅ Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinUserRoom', (userId) => {
    // ✅ join room only if not already joined
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Helper function to emit balance updates
function emitBalanceUpdate(userId) {
  io.to(userId).emit('balanceUpdated');
}

// Export for usage in other modules (like after deposit)
module.exports = { emitBalanceUpdate };

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
