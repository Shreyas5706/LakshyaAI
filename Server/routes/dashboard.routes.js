const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/user.model");
const Journey = require("../models/journey.model");
const MlCache = require("../models/mlcache.model");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch or create journey
    let journey = await Journey.findOne({ userId });
    if (!journey) {
      journey = await Journey.create({
        userId,
        currentStep: "NOT_STARTED"
      });
    }

    // Fetch career recommendations if completed
    let careerRecommendation = null;
    if (journey.currentStep === "CAREER_PREDICTED" && user.lastMlSkillsHash) {
      const modelType = journey.confirmedDomain === "IT" ? "IT_CAREER_PREDICTION" : "NON_IT_CAREER_PREDICTION";
      const cacheEntry = await MlCache.findOne({
        skillsHash: user.lastMlSkillsHash,
        modelType: modelType
      }).lean();
      
      if (cacheEntry) {
        careerRecommendation = cacheEntry.response;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      user,
      journey: {
        predictedDomain: journey.predictedDomain,
        confirmedDomain: journey.confirmedDomain,
        isDomainConfirmed: journey.isDomainConfirmed,
        currentStep: journey.currentStep
      },
      careerRecommendation
    });
  } catch (err) {
    console.error("Dashboard route failed:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard details"
    });
  }
});

module.exports = router;
