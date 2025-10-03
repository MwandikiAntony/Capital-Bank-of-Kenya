const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/verify-phone", auth.verifyPhone);
router.get("/verify-email/:token", auth.verifyEmail);

module.exports = router;
