const express = require("express");
const router = express.Router();

const {
  getAllCourses,
} = require("../controllers/courses.controller");

// Public route
router.get("/", getAllCourses);

module.exports = router;
