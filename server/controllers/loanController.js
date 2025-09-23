// backend/controllers/loanController.js
const db = require("../db");

const applyLoan = async (req, res) => {
  try {
    const { userId, amount, repaymentMonths } = req.body;

    const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const loanHistory = await db.query(
      "SELECT COUNT(*) FROM loans WHERE user_id = $1",
      [userId]
    );
    const hasLoanHistory = parseInt(loanHistory.rows[0].count) > 0;

    if (!hasLoanHistory && amount > 100) {
      return res
        .status(400)
        .json({ message: "First loan cannot exceed Ksh 100" });
    }

    if (amount < 100 || amount > 50000) {
      return res
        .status(400)
        .json({ message: "Loan amount must be between Ksh 100 and 50,000" });
    }

    const interestRate = 0.03;
    const interest = amount * interestRate * repaymentMonths;
    const totalPayable = amount + interest;

    const loanResult = await db.query(
      `INSERT INTO loans (user_id, amount, repayment_months, total_payable)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, amount, repaymentMonths, totalPayable]
    );

    const loan = loanResult.rows[0];

    const monthlyInstallment = totalPayable / repaymentMonths;
    for (let i = 1; i <= repaymentMonths; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);

      await db.query(
        `INSERT INTO repayments (loan_id, due_date, amount_due)
         VALUES ($1, $2, $3)`,
        [loan.id, dueDate, monthlyInstallment]
      );
    }

    res.json({ message: "Loan application submitted successfully", loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { applyLoan };
