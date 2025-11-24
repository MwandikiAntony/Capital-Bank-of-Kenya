// server/index.js

const express = require('express');
const cors = require('cors');
const session = require('express-session'); // ✅ Added for session support
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const accountRoutes = require('./routes/account');
const authRoutes = require('./routes/auth');
const mpesaRoutes = require('./routes/mpesa');
const usersRoutes = require('./routes/users');
const loanRoutes = require('./routes/loanRoutes');

const pool = require('./db');

const app = express();

// ✅ Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true in production with HTTPS
    httpOnly: true,
  },
}));

// CORS 
app.use(cors({
  origin: 'https://capital-bank-of-kenya.vercel.app', // frontend URL
  credentials: true, // allow cookies
}));

app.use(express.json());

// ✅ Mount routes

app.use('/api', accountRoutes);  // ✅ So /api/notifications will work

app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/loans', loanRoutes);

// ✅ Replace JWT-based auth with session-based check
app.get('/api/dashboard', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.session.userId]
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



const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://capital-bank-of-kenya.vercel.app'  // production frontend
      : 'http://localhost:3000',                     // local dev
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});


// ✅ Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinUserRoom', (userId) => {
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Emit balance updates to specific user
function emitBalanceUpdate(userId) {
  io.to(userId).emit('balanceUpdated');
}

// Export function for other modules
module.exports = { emitBalanceUpdate };

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
