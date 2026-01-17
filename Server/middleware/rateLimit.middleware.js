const rateLimit = require("express-rate-limit");

/**
 * Generic rate limiter factory
 * @param {number} maxRequests - Max requests allowed
 * @param {number} windowMinutes - Time window in minutes
 */
const createRateLimiter = (maxRequests, windowMinutes) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });
};

/**
 * Specific limiters
 */
const loginLimiter = createRateLimiter(5, 15); // 5 attempts / 15 min
const forgotPasswordLimiter = createRateLimiter(3, 15); // 3 attempts / 15 min
const generalLimiter = createRateLimiter(100, 15); // General API protection

module.exports = {
  loginLimiter,
  forgotPasswordLimiter,
  generalLimiter,
};
