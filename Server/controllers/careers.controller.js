const {
  predictDomain,
  predictItCareer,
} = require("../services/mlclient.service.js");

const {
  getCachedResponse,
  saveCachedResponse
} = require("../services/mlcache.service");

const {
  getItCareerRecommendationsAndExplanations,
  getNonItCareerRecommendations,
} = require("../utils/aiHelper.js");

const careers = require("../database/seed/careers.json");

const User = require('../models/user.model');
const Journey = require('../models/journey.model.js');
const generateSkillsHash = require('../utils/skillsHash');

const { ensureMlHealthy } = require("../services/mlhealth.guard.js");

/* ===============================
   CAREER METADATA HELPERS
================================= */
const normalizeRoleToKey = (role) =>
  role.toLowerCase().replace(/ /g, "_");

const getCareerMeta = (key) =>
  careers.find(c => c.key === key);

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
        confirmedDomain: null,
        isDomainConfirmed: false,
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

    const { it_skills, interest } = req.body;

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

    const itResult = await predictItCareer({
      skills: it_skills,
      top_k: 3,
    });

    let finalCareers = [];

    try {
      // Filter out low-confidence ML results (confidence < 30%)
      const keptCareers = itResult.results.filter(item => item.confidence >= 0.30);
      
      // Get the correct interest for replenishment
      const currentInterests = interest ? [interest] : (user.interests || []);

      // Let Gemini replenish predictions and explain all 3 careers with unique roadmaps
      finalCareers = await getItCareerRecommendationsAndExplanations(
        keptCareers,
        it_skills,
        currentInterests
      );

      if (!Array.isArray(finalCareers) || finalCareers.length === 0) {
        throw new Error("Invalid format returned from Gemini");
      }
    } catch (geminiErr) {
      console.error("Gemini IT prediction/explanation generation failed, using fallback:", geminiErr.message);
      
      // Fallback: Use all original ML predictions and attach a fallback explanation
      finalCareers = itResult.results.map(item => {
        const key = normalizeRoleToKey(item.role);
        const meta = getCareerMeta(key);

        return {
          ...item,
          career: meta || {
            key,
            title: item.role,
            description: `Analyze requirements and build solutions as a ${item.role}.`,
            domain: "IT",
            category: "Engineering",
            isActive: true
          },
          explanation: {
            about: `A professional role as a ${item.role} utilizing skills like ${it_skills.join(", ")}.`,
            salary: { entry: "₹4-6 LPA", experienced: "₹15-25 LPA" },
            growth: "Strong market demand with high growth potential in the technology sector.",
            skills_to_learn: ["Advanced Algorithms", "System Architecture", "Cloud Platforms"],
            roadmap: [
              { step: 1, title: "Learn Fundamentals", description: "Master core concepts and tools for this domain." },
              { step: 2, title: "Build Portfolio Projects", description: "Design and deploy 2-3 real-world application projects." },
              { step: 3, title: "Certifications & Application", description: "Acquire relevant industry certifications and start applying." }
            ]
          }
        };
      });
    }

    const finalResponse = {
      domain: "IT",
      careers: finalCareers
    };

    // 💾 SAVE ENRICHED RESPONSE TO CACHE
    await saveCachedResponse({
      modelType: "IT_CAREER_PREDICTION",
      skillsHash: newSkillsHash,
      response: finalResponse
    });

    // Save student skills and hashes
    user.skillsHash = newSkillsHash;
    user.lastMlSkillsHash = newSkillsHash;
    user.skillsUpdatedAt = new Date();
    user.skills = it_skills;
    if (interest) {
      user.interests = [interest];
    }
    await user.save();

    // Update journey status to CAREER_PREDICTED
    journey.currentStep = 'CAREER_PREDICTED';
    await journey.save();

    return res.status(200).json({
      success: true,
      ...finalResponse
    });
  } catch (err) {
    console.error("IT career prediction failed:", err.message);

    return res.status(503).json({
      success: false,
      message: "Career service temporarily unavailable",
    });
  }
};

/**
 * STEP 2 (ALTERNATIVE): NON-IT CAREER PREDICTION
 */
const predictNonItCareerController = async (req, res) => {
  try {
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

    // Read from request body or fall back to user profile database values
    console.log("--> [NON-IT REQUEST] req.body:", req.body);
    console.log("--> [NON-IT REQUEST] user profile skills:", user?.skills, "interests:", user?.interests, "educationLevel:", user?.educationLevel);

    const education = req.body.education || user.educationLevel || "Undergraduate";
    const skills = req.body.skills || user.skills || [];
    const interest = req.body.interest || (Array.isArray(req.body.interests) ? req.body.interests[0] : null) || (user.interests && user.interests[0]) || "";

    console.log("--> [NON-IT REQUEST] resolved values: education =", education, "skills =", skills, "interest =", interest);

    if (!education || skills.length === 0 || !interest) {
      console.warn("--> [NON-IT REQUEST] Validation failed! Returning 400.");
      return res.status(400).json({
        success: false,
        message: 'education, skills, and interest are required'
      });
    }

    // Generate a unique hash for caching
    const inputSignature = [education, ...skills, interest].join("|");
    const newSkillsHash = generateSkillsHash([inputSignature]);

    // 🔁 CACHE CHECK — NON-IT CAREER
    const cachedNonItCareer = await getCachedResponse({
      modelType: "NON_IT_CAREER_PREDICTION",
      skillsHash: newSkillsHash
    });

    if (cachedNonItCareer) {
      return res.status(200).json({
        success: true,
        source: "CACHE",
        ...cachedNonItCareer.response
      });
    }

    // Call Gemini to generate Non-IT recommendations and explanations
    const nonItCareers = await getNonItCareerRecommendations(
      education,
      skills.join(", "),
      interest
    );

    const finalResponse = {
      domain: "NON_IT",
      careers: nonItCareers
    };

    // 💾 SAVE ENRICHED RESPONSE TO CACHE
    await saveCachedResponse({
      modelType: "NON_IT_CAREER_PREDICTION",
      skillsHash: newSkillsHash,
      response: finalResponse
    });

    // Save student profile details
    user.skillsHash = newSkillsHash;
    user.lastMlSkillsHash = newSkillsHash;
    user.skillsUpdatedAt = new Date();
    user.skills = skills;
    user.interests = [interest];
    user.educationLevel = education;
    await user.save();

    // Update journey status to CAREER_PREDICTED
    journey.currentStep = 'CAREER_PREDICTED';
    await journey.save();

    return res.status(200).json({
      success: true,
      ...finalResponse
    });
  } catch (err) {
    console.error("Non-IT career prediction failed:", err.message);

    return res.status(503).json({
      success: false,
      message: "Non-IT career recommendation service temporarily unavailable"
    });
  }
};

module.exports = {
  predictCareerDomain,
  predictItCareerController,
  predictNonItCareerController,
};
