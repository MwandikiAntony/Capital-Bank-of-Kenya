const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// simulate SMS OTP (for now we just log it)
const sendSmsOtp = (phone, otp) => {
  console.log(`📱 OTP sent to ${phone}: ${otp}`);
};

// setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or Mailgun, Sendgrid, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    // generate email token
    const emailToken = crypto.randomBytes(20).toString("hex");
    await pool.query(
      "INSERT INTO email_tokens(user_id, token) VALUES($1,$2)",
      [userId, emailToken]
    );

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${emailToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your Capital Bank email",
      html: `<p>Hello ${name},</p>
             <p>Click below to verify your email:</p>
             <a href="${verifyLink}">${verifyLink}</a>`,
    });

    // generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await pool.query("INSERT INTO phone_otps(user_id, otp) VALUES($1,$2)", [userId, otp]);

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
