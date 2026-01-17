const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const {
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimit.middleware");

router.post("/signup", signup);
router.post("/login", loginLimiter , login);
router.post("/forgot-password", forgotPasswordLimiter , forgotPassword);
router.post("/reset-password/:token", resetPassword);


module.exports = router;
