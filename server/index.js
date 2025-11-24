// server/index.js
const express = require('express');
const cors = require('cors');
const session = require('express-session'); 
const pgSession = require('connect-pg-simple')(session); // ✅ PostgreSQL session store
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const accountRoutes = require('./routes/account');
const authRoutes = require('./routes/auth');
const mpesaRoutes = require('./routes/mpesa');
const usersRoutes = require('./routes/users');
const loanRoutes = require('./routes/loanRoutes');

const pool = require('./db'); // your postgres pool

const app = express();

// ✅ Session setup with PostgreSQL
app.use(session({
  store: new pgSession({
    pool: pool,              // Use your PostgreSQL pool
    tableName: 'session',    // Optional: default 'session'
  }),
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // allow cookies
}));

app.use(express.json());

// Routes
app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/loans', loanRoutes);

// Test route
app.get('/', (req, res) => res.send('Bank API is running'));

// Create HTTP server & Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('joinUserRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Emit balance update
function emitBalanceUpdate(userId) {
  io.to(userId).emit('balanceUpdated');
}
module.exports = { emitBalanceUpdate };

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
