// server/routes/mpesa.js

const express = require("express");
const {
  stkPush,
  b2cWithdraw,
  depositCallback,
  withdrawCallback,
} = require("../controllers/mpesaController");

const router = express.Router();

// Deposit request
router.post("/stkpush", stkPush);

// Withdraw request
router.post("/withdraw", b2cWithdraw);

// Callbacks
router.post("/deposit/callback", depositCallback);
router.post("/withdraw/callback", withdrawCallback);

// Test route to confirm it's working
router.get("/test", (req, res) => {
  res.send("✅ Mpesa route is working");
});

console.log("✅ Mpesa routes loaded");

module.exports = router;
