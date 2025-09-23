// backend/routes/loanRoutes.js
const express = require("express");
const { applyLoan } = require("../controllers/loanController");

const router = express.Router();

router.post("/apply", applyLoan);

module.exports = router;
