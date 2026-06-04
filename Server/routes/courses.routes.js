const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  getAllCourses,
} = require("../controllers/courses.controller");

// Protected route
router.get("/", authMiddleware, getAllCourses);

module.exports = router;
