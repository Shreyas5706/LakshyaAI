const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes.js");
const dashboardRoutes = require("./dashboard.routes.js");

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
module.exports = router;
