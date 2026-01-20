const {
  predictDomain,
  predictItCareer,
} = require("../services/mlclient.service.js");

const { ensureMlHealthy } = require("../services/mlhealth.guard.js");

/**
 * STEP 1: DOMAIN PREDICTION
 * Uses GENERAL (NON-DOMAINED) SKILLS
 */
const predictCareerDomain = async (req, res) => {
  try {
    await ensureMlHealthy();

    const { education, general_skills, interest } = req.body;

    if (!education || !interest || !Array.isArray(general_skills)) {
      return res.status(400).json({
        success: false,
        message: "education, interest and general_skills are required",
      });
    }

    const domainResult = await predictDomain({
      education,
      skills: general_skills.join(" "), // <-- generic skills
      interest,
    });

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
 * Uses DOMAIN-SPECIFIC IT SKILLS ONLY
 */
const predictItCareerController = async (req, res) => {
  try {
    await ensureMlHealthy();

    const { it_skills } = req.body;

    if (!Array.isArray(it_skills) || it_skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "it_skills are required",
      });
    }

    const itResult = await predictItCareer({
      skills: it_skills, // <-- hard IT skills
      top_k: 3,
    });

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