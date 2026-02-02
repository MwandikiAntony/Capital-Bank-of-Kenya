// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");


// Register
router.post('/register', async (req, res) => {
  const { name, email, phone, id_number, pin } = req.body;
  if (!name || !email || !phone || !id_number || !pin) {
    return res.status(400).json({ error: 'All fields (name, email, phone, id_number, pin) are required' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2 OR id_number = $3',
      [email, phone, id_number]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email, phone or ID already exists' });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, id_number, pin, email_verified, phone_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, phone, id_number, email_verified, phone_verified, created_at`,
      [name, email, phone, id_number, hashedPin, false, false]
    );

    const user = result.rows[0];

    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    await pool.query(
      "INSERT INTO accounts (user_id, account_number, balance) VALUES ($1, $2, $3)",
      [user.id, accountNumber, 0]
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO phone_otps (user_id, otp, expires_at, used) VALUES ($1, $2, $3, $4)`,
      [user.id, otp, expiresAt, false]
    );
    await pool.query(
  "INSERT INTO email_otps (user_id, email, otp, expires_at, used) VALUES ($1, $2, $3, $4, $5)",
  [user.id, email, emailOtp, expiresAt, false]
);


    console.log(`📲 OTP for ${phone}: ${otp}`);
    console.log(`📧 Email OTP for ${email}: ${emailOtp}`);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    res.status(201).json({
      message: "Registration successful. Verify your phone and email.",
      userId: user.id,
      token, // include token
      phone_verified: user.phone_verified,
      email_verified: user.email_verified,
    });
    

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
}
// Add this route to get user info
router.get("/user", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          u.id, u.name, u.email, u.phone, u.email_verified, u.phone_verified, 
          u.id_number, u.created_at,
          a.account_number, a.balance
       FROM users u
       LEFT JOIN accounts a ON u.id = a.user_id
       WHERE u.id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Verify Phone OTP
router.post('/verify-phone', async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ error: "User ID and OTP are required" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM phone_otps 
       WHERE user_id = $1 AND otp = $2 AND used = false 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or already used OTP" });
    }

    const otpRecord = result.rows[0];
    if (new Date() > otpRecord.expires_at) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    await pool.query(`UPDATE phone_otps SET used = true WHERE id = $1`, [otpRecord.id]);
    await pool.query(`UPDATE users SET phone_verified = true WHERE id = $1`, [userId]);

    const userCheck = await pool.query(
      "SELECT email_verified FROM users WHERE id = $1",
      [userId]
    );
    const { email_verified } = userCheck.rows[0];

    if (!email_verified) {
      return res.json({
        message: "Phone verified. Please verify your email next.",
        nextStep: "verify-email"
      });
    }

    res.json({ message: "Phone verified. You can now log in.", nextStep: "login" });

  } catch (err) {
    console.error("Phone verification error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Resend Phone OTP
router.post('/resend-phone-otp', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID required" });

  try {
    const result = await pool.query(
      `SELECT phone, phone_verified FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    if (user.phone_verified) {
      return res.status(400).json({ error: "Phone already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query(`UPDATE phone_otps SET used = true WHERE user_id = $1`, [userId]);
    await pool.query(
      `INSERT INTO phone_otps (user_id, otp, expires_at, used)
       VALUES ($1, $2, NOW() + INTERVAL '5 minutes', false)`,
      [userId, otp]
    );

    await sendSmsOtp(user.phone, otp);

    res.json({ message: "New OTP sent successfully" });

  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Verify Email OTP
router.post('/verify-email', async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ error: 'User ID and OTP are required' });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM email_otps WHERE user_id = $1 AND otp = $2 ORDER BY id DESC LIMIT 1",
      [userId, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const record = result.rows[0];
    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    await pool.query("UPDATE users SET email_verified = true WHERE id = $1", [userId]);

    // fetch user to check if phone also verified
    const userCheck = await pool.query(
      "SELECT phone_verified FROM users WHERE id = $1",
      [userId]
    );
    const { phone_verified } = userCheck.rows[0];

    if (!phone_verified) {
      return res.json({ 
        message: "Email verified. Please verify your phone next.", 
        nextStep: "verify-phone" 
      });
    }

    res.json({ message: "Email verified. You can now log in.", nextStep: "login" });

  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { phone, pin } = req.body;

  if (!phone || !pin) return res.status(400).json({ error: 'Phone and PIN are required' });

  try {
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = result.rows[0];

    if (!user.phone_verified || !user.email_verified) {
      return res.status(403).json({ error: "Please verify your phone and email before logging in." });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Optional: store session
    req.session.userId = user.id;

    res.json({
      message: "Login successful",
      token, // ✅ Return token
      user: {
        id: user.id,
        phone_verified: user.phone_verified,
        email_verified: user.email_verified,
        phone: user.phone,
        email: user.email,
        full_name: user.name,
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
