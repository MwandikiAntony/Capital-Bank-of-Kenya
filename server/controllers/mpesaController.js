const axios = require("axios");
const pool = require("../db"); // PostgreSQL connection

// Generate access token
const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return response.data.access_token;
};

/**
 * =======================
 * Deposit (STK Push)
 * =======================
 */
const stkPush = async (req, res) => {
  try {
    const { phone, amount, userId } = req.body;
    if (!phone || !amount) return res.status(400).json({ error: "Phone and amount required" });

    const accessToken = await getAccessToken();
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: `${process.env.MPESA_CALLBACK_BASE}/api/mpesa/deposit/callback`,
        AccountReference: "CapitalBank",
        TransactionDesc: "Deposit"
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Save deposit request as pending
    await pool.query(
      "INSERT INTO deposits(user_id, amount, phone, status, merchant_request_id) VALUES($1,$2,$3,$4,$5)",
      [userId, amount, phone, "pending", response.data.MerchantRequestID]
    );

    res.json({ message: "STK Push initiated", data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate STK push" });
  }
};

/**
 * =======================
 * Withdraw (B2C)
 * =======================
 */
const b2cWithdraw = async (req, res) => {
  try {
    const { phone, amount, userId } = req.body;
    if (!phone || !amount) return res.status(400).json({ error: "Phone and amount required" });

    // ✅ Check balance first
    const checkBalance = await pool.query("SELECT balance FROM accounts WHERE user_id=$1", [userId]);
    if (!checkBalance.rows.length) return res.status(404).json({ error: "Account not found" });

    if (checkBalance.rows[0].balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    const accessToken = await getAccessToken();
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
      {
        InitiatorName: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: "BusinessPayment",
        Amount: amount,
        PartyA: process.env.MPESA_B2C_SHORTCODE,
        PartyB: phone,
        Remarks: "Withdraw",
        QueueTimeOutURL: `${process.env.MPESA_CALLBACK_BASE}/api/mpesa/timeout`,
        ResultURL: `${process.env.MPESA_CALLBACK_BASE}/api/mpesa/withdraw/callback`,
        Occasion: "CapitalBank Withdraw"
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Deduct immediately (optimistic)
    await pool.query(
      "UPDATE accounts SET balance = balance - $1 WHERE user_id = $2",
      [amount, userId]
    );

    // Save withdrawal request as pending
    await pool.query(
      "INSERT INTO withdrawals(user_id, amount, phone, status, conversation_id) VALUES($1,$2,$3,$4,$5)",
      [userId, amount, phone, "pending", response.data.ConversationID]
    );

    res.json({ message: "Withdraw initiated", data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate Withdraw" });
  }
};

/**
 * =======================
 * Callbacks
 * =======================
 */


// Deposit Callback
const depositCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const stkCallback = Body?.stkCallback;
    if (!stkCallback) return res.sendStatus(400);

    const { MerchantRequestID, ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = stkCallback;

    console.log("🧾 Deposit callback received for MerchantRequestID:", MerchantRequestID);
    console.log("✅ ResultCode:", ResultCode, "➡️", ResultDesc);

    // 1. Find deposit record by merchant request ID
const deposit = await pool.query(
  "SELECT * FROM deposits WHERE merchant_request_id = $1",
  [MerchantRequestID]
);

if (!deposit.rows.length) {
  console.error("❌ Deposit not found for MerchantRequestID:", MerchantRequestID);
  // Respond with success to avoid retries but log the error
  return res.status(200).json({ message: "MerchantRequestID not found, callback ignored" });
}

    const depositRow = deposit.rows[0];

    // 2. If transaction was successful
    if (ResultCode === 0) {
      const amount = Number(CallbackMetadata?.Item?.find(i => i.Name === "Amount")?.Value);

      if (!amount || isNaN(amount)) {
        console.error("❌ Invalid or missing amount in callback metadata");
        return res.sendStatus(400);
      }

      // 3. Update deposit status
      await pool.query(
        "UPDATE deposits SET status = $1, transaction_id = $2 WHERE id = $3",
        ["success", CheckoutRequestID, depositRow.id]
      );

      // 4. Update account balance
      await pool.query(
        "UPDATE accounts SET balance = balance + $1 WHERE user_id = $2",
        [amount, depositRow.user_id]
      );

      console.log(`💰 Credited ${amount} to user ${depositRow.user_id}'s account`);

    } else {
      // ❌ BUG IN ORIGINAL CODE HERE (extra comma in query)
      await pool.query(
        "UPDATE deposits SET status = $1, reason = $2 WHERE id = $3",
        ["failed", ResultDesc, depositRow.id]
      );

      console.warn(`❌ Deposit failed: ${ResultDesc}`);
    }

    res.json({ message: "Deposit callback processed successfully" });

  } catch (error) {
    console.error("Deposit Callback Error:", error.message, error.stack);
    res.sendStatus(500);
  }
};

// Withdraw Callback
const withdrawCallback = async (req, res) => {
  try {
    const { Result } = req.body;
    if (!Result) return res.sendStatus(400);

    const { ResultCode, ResultDesc, ConversationID } = Result;

    // Find withdrawal
    const withdrawal = await pool.query(
      "SELECT * FROM withdrawals WHERE conversation_id=$1",
      [ConversationID]
    );
    if (!withdrawal.rows.length) return res.sendStatus(404);

    if (ResultCode === 0) {
      await pool.query(
        "UPDATE withdrawals SET status=$1 WHERE id=$2",
        ["success", withdrawal.rows[0].id]
      );
    } else {
      // ❌ Failed → refund
      await pool.query(
        "UPDATE withdrawals SET status=$1, reason=$2 WHERE id=$3",
        ["failed", ResultDesc, withdrawal.rows[0].id]
      );

      await pool.query(
        "UPDATE accounts SET balance = balance + $1 WHERE user_id=$2",
        [withdrawal.rows[0].amount, withdrawal.rows[0].user_id]
      );
    }

    res.json({ message: "Withdraw callback processed" });
  } catch (error) {
    console.error("Withdraw Callback Error:", error.message);
    res.sendStatus(500);
  }
};

module.exports = {
  getAccessToken,
  stkPush,
  b2cWithdraw,
  depositCallback,
  withdrawCallback
};
