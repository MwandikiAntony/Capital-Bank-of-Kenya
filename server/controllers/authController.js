const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendSmsOtp } = require("../utils/sms");
const { sendEmailOtp } = require("../utils/mail");
const { generateOtp } = require("../utils/otp");


// =======================
// Register
// =======================
exports.register = async (req, res) => {
  try {
    const { name, email, phone, pin } = req.body;

    if (!name || !email || !phone || !pin) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check duplicate
    const existing = await pool.query("SELECT * FROM users WHERE email=$1 OR phone=$2", [
      email,
      phone,
    ]);
    if (existing.rows.length) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash pin
    const hashedPin = await bcrypt.hash(pin, 10);

    // create user
    const newUser = await pool.query(
      `INSERT INTO users(name, email, phone, pin, email_verified, phone_verified)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING id, email, phone`,
      [name, email, phone, hashedPin, false, false]
    );

    const userId = newUser.rows[0].id;
// generate OTPs
const phoneOtp = generateOtp();
const emailOtp = generateOtp();

const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

// save to DB
await pool.query(
  "INSERT INTO phone_otps(user_id, otp, expires_at, used) VALUES($1,$2,$3,false)",
  [userId, phoneOtp, expiresAt]
);

await pool.query(
  "INSERT INTO email_otps(user_id, otp, expires_at, used) VALUES($1,$2,$3,false)",
  [userId, emailOtp, expiresAt]
);

// send real SMS
await sendSmsOtp(phone, phoneOtp);

// send real email
await sendEmailOtp(email, name, emailOtp);

    

    sendSmsOtp(phone, otp);

    res.json({ message: "Registration successful. Verify your phone & email.", userId });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
};

// =======================
// Verify Phone
// =======================
exports.verifyPhone = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const check = await pool.query("SELECT * FROM phone_otps WHERE user_id=$1 AND otp=$2", [
      userId,
      otp,
    ]);

    if (!check.rows.length) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // mark verified
    await pool.query("UPDATE users SET phone_verified=true WHERE id=$1", [userId]);

    // delete OTP
    await pool.query("DELETE FROM phone_otps WHERE user_id=$1", [userId]);

    res.json({ message: "Phone verified successfully" });
  } catch (err) {
    console.error("Verify phone error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
};

// =======================
// Verify Email
// =======================
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const check = await pool.query("SELECT * FROM email_tokens WHERE token=$1", [token]);
    if (!check.rows.length) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const userId = check.rows[0].user_id;

    await pool.query("UPDATE users SET email_verified=true WHERE id=$1", [userId]);
    await pool.query("DELETE FROM email_tokens WHERE user_id=$1", [userId]);

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify email error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
};

// =======================
// Login
// =======================
exports.login = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    const userRes = await pool.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (!userRes.rows.length) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userRes.rows[0];

    const validPin = await bcrypt.compare(pin, user.pin);
    if (!validPin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user.phone_verified || !user.email_verified) {
      return res.status(400).json({ error: "Please verify phone and email first" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
};
