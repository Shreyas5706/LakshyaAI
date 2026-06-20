const axios = require("axios");
const { env } = require("../config/env");

const GEMINI_API_KEY = env.geminiApiKey;
const MODEL_NAME = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Call the Gemini API with a system prompt and user input
 */
const callGemini = async (promptText) => {
  try {
    const payload = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000, // 60 seconds timeout
    });

    const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Empty response from Gemini API");
    }

    // Attempt to parse response text as JSON
    try {
      return JSON.parse(candidateText.trim());
    } catch (parseError) {
      console.warn("Gemini did not return clean JSON, attempting to extract it...");
      const cleanText = candidateText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    }
  } catch (err) {
    console.error("Gemini API call failed:", err.message);
    if (err.response) {
      console.error("Gemini API Error details:", JSON.stringify(err.response.data, null, 2));
    }
    throw new Error(`Gemini service error: ${err.message}`);
  }
};

/**
 * Enriches high-confidence IT careers and recommends additional ones if count < 3,
 * generating unique, custom-tailored explanations for each.
 * @param {Array} keptCareers Careers predicted by ML model with confidence >= 30%
 * @param {Array} itSkills User's IT skills
 * @param {Array} interests User's interests
 * @returns {Promise<Array>} List of exactly 3 careers with custom explanations
 */
const getItCareerRecommendationsAndExplanations = async (keptCareers, itSkills, interests) => {
  const prompt = `You are a professional IT career counselor AI.
A user has selected these IT skills: ${itSkills.join(', ')} and has interests: ${interests.join(', ')}.

Our machine learning model predicted the following IT career paths with high confidence (>=30%):
${JSON.stringify(keptCareers, null, 2)}

Your tasks:
1. If there are fewer than 3 career paths in the list above, you MUST recommend additional unique IT career paths matching the user's profile to bring the total to exactly 3. For any path you recommend, assign a confidence score between 0.65 and 0.90 reflecting the match quality, and calculate which of the user's skills match that career.
2. For all 3 career paths (both the ones predicted by the model and the ones suggested by you), generate highly specific, unique, and detailed career explanations.
Each explanation MUST be custom-tailored to that specific career role (no generic templates). It must include:
   - 'about': A detailed 2-3 sentence overview of what the role does and a day-in-the-life summary.
   - 'salary': Realistic salary ranges in India (e.g. Entry level and Experienced). Each role MUST have distinct and realistic numbers (e.g. Software Engineer: ₹4-6 LPA entry, ₹15-22 LPA experienced; Data Scientist: ₹6-8 LPA entry, ₹18-28 LPA experienced).
   - 'growth': Specific future job market demand and growth prospects (next 5-10 years) for this path.
   - 'skills_to_learn': A list of 3-4 specific advanced tools/skills/frameworks they should master next (e.g. PyTorch, Docker, Kubernetes).
   - 'roadmap': A vertical 3-step transition roadmap. The steps must be highly specific to the career path (e.g., for Data Scientist: Step 1: Learn Probability and Python libraries; Step 2: Build regression and classification models; Step 3: Implement deep learning pipelines and learn cloud deployment). Do NOT use generic instructions.

Your response MUST be a JSON array containing exactly 3 objects matching this EXACT schema:
[
  {
    "role": "Role Name (matching the input list if it came from the model, e.g. Data Scientist)",
    "confidence": 0.85,
    "matched_skills": {
      "skill_name_1": 0.08,
      "skill_name_2": 0.05
    },
    "career": {
      "key": "snake_case_role_name (e.g. data_scientist)",
      "title": "Role Name",
      "description": "A brief 1-sentence description of the career path.",
      "domain": "IT",
      "category": "Engineering",
      "isActive": true
    },
    "explanation": {
      "about": "Detailed unique about text...",
      "salary": {
        "entry": "Entry salary range (e.g. ₹6-8 LPA)",
        "experienced": "Experienced salary range (e.g. ₹18-25 LPA)"
      },
      "growth": "Detailed unique growth text...",
      "skills_to_learn": ["skill1", "skill2", "skill3"],
      "roadmap": [
        { "step": 1, "title": "Specific step 1 title", "description": "Specific step 1 description" },
        { "step": 2, "title": "Specific step 2 title", "description": "Specific step 2 description" },
        { "step": 3, "title": "Specific step 3 title", "description": "Specific step 3 description" }
      ]
    }
  }
]`;

  return await callGemini(prompt);
};

/**
 * Generates top 3 Non-IT career recommendations and explanations based on user profile
 * @param {string} education User's education level
 * @param {string} skills User's general skills (space or comma-separated)
 * @param {string} interest User's primary interests
 * @returns {Promise<Array>} List of recommended Non-IT careers matching the unified interface
 */
const getNonItCareerRecommendations = async (education, skills, interest) => {
  const prompt = `You are a professional career counselor AI.
A user has submitted the following profile:
- Education: ${education}
- General Skills: ${skills}
- Interests: ${interest}

Please recommend the top 3 Non-IT (non-Information Technology, e.g. Business, Finance, Marketing, HR, Designing, Writing, Healthcare, Law, Teaching, Social Work, Operations, Hospitality) career paths for them.
Calculate a confidence score (from 0.0 to 1.0) showing how well each career matches their profile, identify which of their general skills match it, and provide a detailed explanation.
Each explanation MUST be custom-tailored to that specific career role (no generic templates). It must include:
   - 'about': A detailed 2-3 sentence overview of what the role does and a day-in-the-life summary.
   - 'salary': Realistic salary ranges in India (e.g. Entry level and Experienced). Each role MUST have distinct and realistic numbers (e.g. Marketing Manager: ₹4-6 LPA entry, ₹12-18 LPA experienced; Graphic Designer: ₹3-5 LPA entry, ₹9-14 LPA experienced).
   - 'growth': Specific future job market demand and growth prospects (next 5-10 years) for this path.
   - 'skills_to_learn': A list of 3-4 specific tools/skills they should master next (e.g. Figma, HubSpot, Excel, SPSS).
   - 'roadmap': A vertical 3-step transition roadmap. The steps must be highly specific to the career path (e.g., for Graphic Designer: Step 1: Master design theory and software like Illustrator/Photoshop; Step 2: Build a portfolio of branding and layouts; Step 3: Learn UI design and collaborate with developers). Do NOT use generic instructions.

Your response MUST be a JSON array containing exactly 3 objects matching this EXACT schema:
[
  {
    "role": "Career Role Title (e.g. Graphic Designer, Marketing Executive, Financial Analyst)",
    "confidence": 0.85,
    "matched_skills": {
      "skill_name_matching_user_skills_1": 0.08,
      "skill_name_matching_user_skills_2": 0.06
    },
    "career": {
      "key": "snake_case_role_name (e.g. graphic_designer)",
      "title": "Career Role Title",
      "description": "A brief 1-sentence description of the career path.",
      "domain": "NON_IT",
      "category": "Category name (e.g. Creative, Business, Finance, Writing)",
      "isActive": true
    },
    "explanation": {
      "about": "Detailed unique about text...",
      "salary": {
        "entry": "Entry salary range (e.g. ₹3-5 LPA)",
        "experienced": "Experienced salary range (e.g. ₹10-15 LPA)"
      },
      "growth": "Detailed unique growth text...",
      "skills_to_learn": ["skill1", "skill2", "skill3"],
      "roadmap": [
        { "step": 1, "title": "Specific step 1 title", "description": "Specific step 1 description" },
        { "step": 2, "title": "Specific step 2 title", "description": "Specific step 2 description" },
        { "step": 3, "title": "Specific step 3 title", "description": "Specific step 3 description" }
      ]
    }
  }
]`;

  return await callGemini(prompt);
};

module.exports = {
  getItCareerRecommendationsAndExplanations,
  getNonItCareerRecommendations,
};
