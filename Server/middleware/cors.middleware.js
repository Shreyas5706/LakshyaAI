const cors = require("cors");
const { env } = require("../config/env");

const origins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (env.clientUrl) {
  const trimmed = env.clientUrl.trim();
  if (!origins.includes(trimmed)) {
    origins.push(trimmed);
  }
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or postman)
    if (!origin) return callback(null, true);
    
    if (origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
