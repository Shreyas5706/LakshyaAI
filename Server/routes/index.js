const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes.js");
const dashboardRoutes = require("./dashboard.routes.js");
const careerRoutes = require ("./careers.routes.js");
const mlHealthRoutes = require("./mlhealth.routes");
const journeyRoutes = require('./journey.routes');
const courseRoutes = require("./courses.routes");
const skillsRoutes = require("./skills.routes.js");

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/career", careerRoutes);
router.use("/ml", mlHealthRoutes);
router.use('/journey', journeyRoutes);
router.use("/courses", courseRoutes);
router.use("/skills", skillsRoutes);

module.exports = router;
