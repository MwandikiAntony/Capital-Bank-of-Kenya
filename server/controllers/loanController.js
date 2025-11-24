// backend/controllers/loanController.js
const db = require("../db");

const applyLoan = async (req, res) => {
  try {
    let { amount, repaymentMonths } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Parse and validate inputs
    amount = parseFloat(amount);
    repaymentMonths = parseInt(repaymentMonths);

    if (isNaN(amount) || isNaN(repaymentMonths) || amount <= 0 || repaymentMonths <= 0) {
      return res.status(400).json({ message: "Invalid amount or repayment period" });
    }

    // Check user exists
    const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count fully repaid loans
    const repaidResult = await db.query(
      "SELECT COUNT(*) FROM loans WHERE user_id = $1 AND status = 'REPAID'",
      [userId]
    );
    const repaidCount = parseInt(repaidResult.rows[0].count);

    // Determine max allowed based on history
    let maxAllowed = 100;
    if (repaidCount === 1) maxAllowed = 500;
    else if (repaidCount === 2) maxAllowed = 1000;
    else if (repaidCount === 3) maxAllowed = 2000;
    else if (repaidCount === 4) maxAllowed = 5000;
    else if (repaidCount === 5) maxAllowed = 10000;
    else if (repaidCount >= 6) maxAllowed = 20000;

    // Enforce individual and global limits
    if (amount > maxAllowed) {
      return res.status(400).json({
        message: `You are eligible to borrow up to Ksh ${maxAllowed} based on your repayment history.`,
      });
    }

    if (amount < 100 || amount > 50000) {
      return res.status(400).json({
        message: "Loan amount must be between Ksh 100 and 50,000",
      });
    }

    // Calculate interest and total
    const interestRate = 0.03;
    const interest = amount * interestRate * repaymentMonths;
    const totalPayable = amount + interest;

    // Insert loan
    const loanResult = await db.query(
      `INSERT INTO loans (user_id, amount, repayment_months, total_payable, status)
       VALUES ($1, $2, $3, $4, 'APPROVED') RETURNING *`,
      [userId, amount, repaymentMonths, totalPayable]
    );
    const loan = loanResult.rows[0];
    // Insert notification for admin
await db.query(
  `INSERT INTO notifications (user_id, type, message)
   VALUES ($1, $2, $3)`,
  [1, 'loan_request', `New loan application received with ID ${loan.id} by user ${userId}`]
);

// Also insert notification for the user who applied
await db.query(
  `INSERT INTO notifications (user_id, type, message)
   VALUES ($1, $2, $3)`,
  [userId, 'loan_status', `Your loan application with ID ${loan.id} has been submitted.`]
);

    // Insert repayment schedule
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

    res.json({ message: "Loan approved", loan });

  } catch (err) {
    console.error("Loan application error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



const markLoanRepaid = async (req, res) => {
  const { loanId } = req.params;

  try {
    // Mark the loan as repaid
    const result = await db.query(
      "UPDATE loans SET status = 'REPAID' WHERE id = $1 RETURNING *",
      [loanId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Optional: mark all repayments as paid (simplified)
    await db.query(
      "UPDATE repayments SET paid = true WHERE loan_id = $1",
      [loanId]
    );

    res.json({ message: "Loan marked as repaid successfully", loan: result.rows[0] });
  } catch (err) {
    console.error("Error marking loan repaid:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { applyLoan, markLoanRepaid };
