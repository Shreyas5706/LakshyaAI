const dotenv = require("dotenv");

dotenv.config();

/* ===============================
   Required Environment Variables
================================= */
const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "ML_API_KEY",
  "ML_BACKEND_URL",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

/* ===============================
   Exported Config Object
================================= */
const env = {
  // Server
  port: Number(process.env.PORT),

  // Database
  mongoUri: process.env.MONGO_URI,

  // Auth
  jwtSecret: process.env.JWT_SECRET,

  // Email (optional – used only for reset password)
  email: {
    service: process.env.EMAIL_SERVICE || null,
    user: process.env.EMAIL_USER || null,
    pass: process.env.EMAIL_PASS || null,
    from: process.env.EMAIL_FROM || null,
  },

  // Client
  clientUrl: process.env.CLIENT_URL || null,

  // ML Backend
  ml: {
    apiKey: process.env.ML_API_KEY,
    backendUrl: process.env.ML_BACKEND_URL,
    timeoutMs: Number(process.env.ML_TIMEOUT_MS) || 12000,
  },

  // Environment
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = { env };
