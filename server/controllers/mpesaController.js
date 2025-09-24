const axios = require("axios");
const pool = require("../db"); // PostgreSQL connection

// Generate access token
const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` }
    }
  );

  return response.data.access_token;
};

// STK Push Deposit
const stkPush = async (req, res) => {
    console.log("✅ Mpesa routes loaded");

  try {
    const { phone, amount, userId } = req.body;

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
        CallBackURL: "https://your-domain.com/api/mpesa/callback",
        AccountReference: "CapitalBank",
        TransactionDesc: "Deposit"
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    await pool.query(
      "INSERT INTO deposits(user_id, amount, status) VALUES($1,$2,$3)",
      [userId, amount, "pending"]
    );

    res.json({ message: "STK Push initiated", data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate STK push" });
  }
};

// B2C Withdraw
const b2cWithdraw = async (req, res) => {
  try {
    const { phone, amount, userId } = req.body;
    const accessToken = await getAccessToken();

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
      {
        InitiatorName: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL, // generated with certificate
        CommandID: "BusinessPayment", // or "SalaryPayment"/"PromotionPayment"
        Amount: amount,
        PartyA: process.env.MPESA_B2C_SHORTCODE,  
        PartyB: "254708374149",  // Customer phone
        Remarks: "Withdraw",
        QueueTimeOutURL: "https://your-domain.com/api/mpesa/timeout",
        ResultURL: "https://your-domain.com/api/mpesa/withdraw/callback",
        Occasion: "CapitalBank Withdraw"
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    await pool.query(
      "INSERT INTO withdrawals(user_id, amount, status) VALUES($1,$2,$3)",
      [userId, amount, "pending"]
    );

    res.json({ message: "Withdraw initiated", data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate Withdraw" });
  }
};

// Callback
const mpesaCallback = async (req, res) => {
  console.log("M-Pesa Callback:", req.body);
  res.json({ message: "Callback received" });
};

module.exports = { getAccessToken, stkPush, b2cWithdraw, mpesaCallback };
