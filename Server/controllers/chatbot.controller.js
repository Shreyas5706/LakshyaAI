const User = require("../models/user.model");
const Journey = require("../models/journey.model");
const MlCache = require("../models/mlcache.model");
const { getChatCompletion } = require("../services/groq.service");

/**
 * Handles incoming chat messages, enriches the request with student profile
 * and career roadmap context, and queries Groq Cloud.
 */
const handleChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required",
      });
    }

    // 1. Fetch user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Fetch user's prediction journey status
    const journey = await Journey.findOne({ userId });

    // 3. Fetch active career recommendations from cache if available
    let careerRecommendation = null;
    if (journey && journey.currentStep === "CAREER_PREDICTED" && user.lastMlSkillsHash) {
      const modelType =
        journey.confirmedDomain === "IT"
          ? "IT_CAREER_PREDICTION"
          : "NON_IT_CAREER_PREDICTION";

      const cacheEntry = await MlCache.findOne({
        skillsHash: user.lastMlSkillsHash,
        modelType: modelType,
      }).lean();

      if (cacheEntry) {
        careerRecommendation = cacheEntry.response;
      }
    }

    // 4. Compile detailed student profile context for Groq
    let studentContext = `Student Profile:
- Name: ${user.name || "Student"}
- Age: ${user.age || "N/A"}
- Gender: ${user.gender || "N/A"}
- Location: ${user.city ? `${user.city}, ${user.state}` : "N/A"}
- Education Level: ${user.educationLevel || "N/A"}
- Stream/Major: ${user.stream || "N/A"}
- Current Skills: ${user.skills && user.skills.length > 0 ? user.skills.join(", ") : "None specified"}
- Interests: ${user.interests && user.interests.length > 0 ? user.interests.join(", ") : "None specified"}
`;

    if (journey) {
      studentContext += `- Journey Step: ${journey.currentStep}\n`;
      if (journey.confirmedDomain) {
        studentContext += `- Confirmed Domain: ${journey.confirmedDomain}\n`;
      }
    }

    if (careerRecommendation && Array.isArray(careerRecommendation.careers)) {
      studentContext += `\nRecommended Career Paths & Custom Roadmaps:\n`;
      careerRecommendation.careers.forEach((item, index) => {
        studentContext += `${index + 1}. Role: ${item.role} (Confidence: ${(item.confidence * 100).toFixed(0)}%)\n`;
        if (item.explanation) {
          studentContext += `   - About: ${item.explanation.about}\n`;
          studentContext += `   - Salary in India: Entry: ${item.explanation.salary?.entry || "N/A"}, Experienced: ${item.explanation.salary?.experienced || "N/A"}\n`;
          studentContext += `   - Growth Outlook: ${item.explanation.growth || "N/A"}\n`;
          studentContext += `   - Recommended Skills to Learn: ${item.explanation.skills_to_learn ? item.explanation.skills_to_learn.join(", ") : "N/A"}\n`;
          if (Array.isArray(item.explanation.roadmap)) {
            studentContext += `   - Transition Roadmap:\n`;
            item.explanation.roadmap.forEach((step) => {
              studentContext += `     Step ${step.step}: ${step.title} - ${step.description}\n`;
            });
          }
        }
        studentContext += `\n`;
      });
    } else {
      studentContext += `\nNote: This student has not completed the career prediction assessment yet. Encourage them to take the career assessment under the 'Career' page to see their personalized roadmaps and recommendations.\n`;
    }

    // 5. Construct AI Counselor System Prompt
    const systemPrompt = `You are LAKSHYA AI, an expert, empathetic AI Career Counselor and Academic Advisor for Indian engineering and technology students.
Your goal is to guide students on their educational journey, skill gap analysis, course selections, resume building, and transitioning into their target career roles.

Here is the background context about the student you are advising:
-----------------------------------------
${studentContext}
-----------------------------------------

Guidelines:
1. Refer to the student's name, current skills, and target career paths/roadmaps naturally in conversation.
2. Be action-oriented: Give specific, practical steps (e.g., suggesting resources, languages, or tools based on their roadmaps).
3. If they haven't completed the career prediction, politely guide them to the 'Career' tab to run their ML domain and career assessment.
4. Keep your responses encouraging, professional, and clear. Use bold text and bullet points to structure your advice.
5. Do NOT output code blocks unless they explicitly ask for code assistance.
6. Keep your responses concise (around 150-250 words) to ensure the chat window is readable.
7. Avoid repeating the same background facts unless relevant to their direct query.
`;

    // 6. Map message objects from client to standard OpenAI format
    const formattedMessages = messages.map((msg) => {
      if (msg.role) {
        return { role: msg.role, content: msg.content };
      }
      return {
        role: msg.isUser ? "user" : "assistant",
        content: msg.text || msg.content || "",
      };
    });

    const finalMessages = [
      { role: "system", content: systemPrompt },
      ...formattedMessages,
    ];

    // 7. Call Groq Service
    const botReply = await getChatCompletion(finalMessages);

    return res.status(200).json({
      success: true,
      message: "Chat response generated successfully",
      reply: botReply,
    });
  } catch (err) {
    console.error("Chatbot Controller Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while communicating with the AI Counselor. Please try again.",
    });
  }
};

module.exports = {
  handleChat,
};
