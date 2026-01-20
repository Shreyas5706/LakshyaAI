const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes.js");
const dashboardRoutes = require("./dashboard.routes.js");
const careerRoutes = require ("./careers.routes.js");
const mlHealthRoutes = require("./mlhealth.routes");

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/career", careerRoutes);
router.use("/ml", mlHealthRoutes);

module.exports = router;
