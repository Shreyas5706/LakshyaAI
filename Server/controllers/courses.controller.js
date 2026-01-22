const Course = require("../models/course.model");

/**
 * GET /api/courses
 * Public – returns all active courses
 */
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Fetch courses failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

module.exports = {
  getAllCourses,
};
