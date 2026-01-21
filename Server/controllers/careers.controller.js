const {
  predictDomain,
  predictItCareer,
} = require("../services/mlclient.service.js");
const {
  getCachedResponse,
  saveCachedResponse
} = require("../services/mlcache.service");

const User = require('../models/user.model');
const Journey = require('../models/journey.model.js');
const generateSkillsHash = require('../utils/skillsHash');

const { ensureMlHealthy } = require("../services/mlhealth.guard.js");

/**
 * STEP 1: DOMAIN PREDICTION
 */
const predictCareerDomain = async (req, res) => {
  try {
    await ensureMlHealthy();

    const userId = req.user._id;
    const user = await User.findById(userId);

    const { education, general_skills, interest } = req.body;

    if (!education || !interest || !Array.isArray(general_skills)) {
      return res.status(400).json({
        success: false,
        message: "education, interest and general_skills are required",
      });
    }

    const newSkillsHash = generateSkillsHash(general_skills);
    // 🔁 CACHE CHECK — DOMAIN PREDICTION
    const cachedDomain = await getCachedResponse({
      modelType: "DOMAIN_PREDICTION",
      skillsHash: newSkillsHash
    });

    if (cachedDomain) {
      return res.status(200).json({
        success: true,
        source: "CACHE",
        ...cachedDomain.response
      });
    }

    if (user.lastMlSkillsHash === newSkillsHash) {
      return res.status(200).json({
        success: true,
        cached: true,
        message: "Skills unchanged, domain prediction not re-run",
      });
    }

    const domainResult = await predictDomain({
      education,
      skills: general_skills.join(" "),
      interest,
    });
    // 💾 SAVE DOMAIN ML RESPONSE TO CACHE
    await saveCachedResponse({
      modelType: "DOMAIN_PREDICTION",
      skillsHash: newSkillsHash,
      response: {
        domain: domainResult.domain,
        confidence: domainResult.confidence,
        next_step:
          domainResult.domain === "IT"
            ? "ENTER_IT_SKILLS"
            : "ENTER_NON_IT_DETAILS"
      }
    });


    // 🧭 JOURNEY START / UPDATE
    await Journey.findOneAndUpdate(
      { userId },
      {
        predictedDomain: domainResult.domain,
        currentStep: 'DOMAIN_PREDICTED',
        domainPredictedAt: new Date()
      },
      { upsert: true, new: true }
    );

    user.skillsHash = newSkillsHash;
    user.lastMlSkillsHash = newSkillsHash;
    user.skillsUpdatedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      domain: domainResult.domain,
      confidence: domainResult.confidence,
      next_step:
        domainResult.domain === "IT"
          ? "ENTER_IT_SKILLS"
          : "ENTER_NON_IT_DETAILS",
    });
  } catch (err) {
    console.error("Domain prediction failed:", err.message);

    return res.status(503).json({
      success: false,
      message: "Career service temporarily unavailable",
    });
  }
};

/**
 * STEP 2: IT CAREER PREDICTION
 */
const predictItCareerController = async (req, res) => {
  try {
    await ensureMlHealthy();

    const userId = req.user._id;
    const user = await User.findById(userId);

    // 🧭 JOURNEY CHECK
    const journey = await Journey.findOne({ userId });

    if (!journey || !journey.isDomainConfirmed) {
      return res.status(403).json({
        success: false,
        message: 'Domain not confirmed yet'
      });
    }

    const { it_skills } = req.body;

    if (!Array.isArray(it_skills) || it_skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "it_skills are required",
      });
    }

    const newSkillsHash = generateSkillsHash(it_skills);
    // 🔁 CACHE CHECK — IT CAREER
    const cachedItCareer = await getCachedResponse({
      modelType: "IT_CAREER_PREDICTION",
      skillsHash: newSkillsHash
    });

    if (cachedItCareer) {
      return res.status(200).json({
        success: true,
        source: "CACHE",
        ...cachedItCareer.response
      });
    }


    if (user.lastMlSkillsHash === newSkillsHash) {
      return res.status(200).json({
        success: true,
        cached: true,
        message: "Skills unchanged, IT career prediction not re-run",
      });
    }

    const itResult = await predictItCareer({
      skills: it_skills,
      top_k: 3,
    });
    // 💾 SAVE IT CAREER ML RESPONSE TO CACHE
    await saveCachedResponse({
      modelType: "IT_CAREER_PREDICTION",
      skillsHash: newSkillsHash,
      response: {
        domain: "IT",
        careers: itResult.results
      }
    });

    user.skillsHash = newSkillsHash;
    user.lastMlSkillsHash = newSkillsHash;
    user.skillsUpdatedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      domain: "IT",
      careers: itResult.results,
    });
  } catch (err) {
    console.error("IT career prediction failed:", err.message);

    return res.status(503).json({
      success: false,
      message: "Career service temporarily unavailable",
    });
  }
};

module.exports = {
  predictCareerDomain,
  predictItCareerController,
};
