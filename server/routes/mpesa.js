const express = require("express");
const { stkPush, b2cWithdraw, mpesaCallback } = require("../controllers/mpesaController");

const router = express.Router();

router.post("/stkpush", stkPush);           // Deposit request
router.post("/withdraw", b2cWithdraw);      // Withdraw request
router.post("/callback", mpesaCallback);    // Callback for both
console.log("✅ Mpesa routes loaded");


module.exports = router;
