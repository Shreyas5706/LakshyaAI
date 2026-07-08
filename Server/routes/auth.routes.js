const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  googleAuth,
} = require("../controllers/auth.controller");

const {
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimit.middleware");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login", loginLimiter , login);
router.post("/forgot-password", forgotPasswordLimiter , forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google", googleAuth);
router.put("/profile", authMiddleware, updateProfile);


module.exports = router;
