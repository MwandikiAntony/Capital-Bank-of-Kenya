const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const verifyToken = require("../middleware/verifyToken");

router.post("/apply", verifyToken, loanController.applyLoan);
router.post("/:loanId/markRepaid", verifyToken, loanController.markLoanRepaid);

module.exports = router;
