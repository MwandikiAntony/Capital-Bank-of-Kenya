const pool = require("../db");

const initDb = async () => {
  try {
    console.log("⏳ Initializing database...");

    await pool.query(`
    -- USERS
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      phone VARCHAR(20) UNIQUE NOT NULL,
      pin TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      phone_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- EMAIL TOKENS
    CREATE TABLE IF NOT EXISTS email_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_email_token ON email_tokens(token);

    -- PHONE OTPS
    CREATE TABLE IF NOT EXISTS phone_otps (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      otp VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- ACCOUNTS
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      balance NUMERIC(12,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- LOANS
    CREATE TABLE IF NOT EXISTS loans (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      repayment_months INTEGER NOT NULL,
      total_payable NUMERIC(12,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'APPROVED',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_loans_user ON loans(user_id);

    -- REPAYMENTS
    CREATE TABLE IF NOT EXISTS repayments (
      id SERIAL PRIMARY KEY,
      loan_id INTEGER REFERENCES loans(id) ON DELETE CASCADE,
      due_date DATE NOT NULL,
      amount_due NUMERIC(12,2) NOT NULL,
      paid BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_repayments_loan ON repayments(loan_id);

    -- NOTIFICATIONS
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50),
      message TEXT,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

    -- DEPOSITS
    CREATE TABLE IF NOT EXISTS deposits (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      phone VARCHAR(20),
      merchant_request_id TEXT UNIQUE,
      transaction_id TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(user_id);

    -- WITHDRAWALS
    CREATE TABLE IF NOT EXISTS withdrawals (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      phone VARCHAR(20),
      conversation_id TEXT UNIQUE,
      status VARCHAR(20) DEFAULT 'pending',
      reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON withdrawals(user_id);
    `);

    // -----------------------------
    // Trigger for auto account
    // -----------------------------
    await pool.query(`
    CREATE OR REPLACE FUNCTION create_account_after_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO accounts(user_id, balance)
      VALUES (NEW.id, 0)
      ON CONFLICT (user_id) DO NOTHING;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_create_account ON users;

    CREATE TRIGGER trg_create_account
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_account_after_user();
    `);

    console.log("✅ Database ready");
  } catch (err) {
    console.error("❌ DB Init failed:", err);
  }
};

module.exports = initDb;
