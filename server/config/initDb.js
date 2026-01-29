const pool = require("../db");

const initDb = async () => {
  try {
    console.log("⏳ Initializing database...");

    // USERS
    await pool.query(`
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
    `);

    // migration
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS id_number VARCHAR(50) UNIQUE;
    `);

    // EMAIL TOKENS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_email_token ON email_tokens(token);
    `);

    // PHONE OTPS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS phone_otps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        otp VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

  

// accounts
await pool.query(`
  CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

//indexes
await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
`);

await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
`);


     await pool.query(`
      ALTER TABLE accounts
      ADD COLUMN IF NOT EXISTS account_number VARCHAR(50) UNIQUE;
    `);

    // LOANS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(12,2) NOT NULL,
        repayment_months INTEGER NOT NULL,
        total_payable NUMERIC(12,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'APPROVED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_loans_user ON loans(user_id);
    `);

    // REPAYMENTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS repayments (
        id SERIAL PRIMARY KEY,
        loan_id INTEGER REFERENCES loans(id) ON DELETE CASCADE,
        due_date DATE NOT NULL,
        amount_due NUMERIC(12,2) NOT NULL,
        paid BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_repayments_loan ON repayments(loan_id);
    `);

    // NOTIFICATIONS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    `);

    // DEPOSITS
    await pool.query(`
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
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(user_id);
    `);

    // WITHDRAWALS
    await pool.query(`
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
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON withdrawals(user_id);
    `);

    console.log("✅ Database ready");

  } catch (err) {
    console.error("❌ DB Init failed:", err);
  }
};

module.exports = initDb;
