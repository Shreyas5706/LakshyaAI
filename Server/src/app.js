const express = require("express");
const errorHandler = require("../middleware/error.middleware");
const routes = require("../routes");
const { generalLimiter } = require("../middleware/rateLimit.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});
app.use("/api", generalLimiter , routes);

// ❗ Error handler MUST be last
app.use(errorHandler);

module.exports = app;
