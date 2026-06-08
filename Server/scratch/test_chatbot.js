const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db.js");
const User = require("../models/user.model");
const Journey = require("../models/journey.model");
const MlCache = require("../models/mlcache.model");
const { getChatCompletion } = require("../services/groq.service");

async function runTest() {
  console.log("=== Starting AI Chatbot Backend Verification ===");

  // 1. Connect to Database
  await connectDB();

  try {
    // 2. Fetch a student (or create a mock student if none exist)
    let user = await User.findOne({ role: "student" });
    if (!user) {
      console.log("No student user found. Creating a temporary test user...");
      user = await User.create({
        name: "Test Student",
        email: "test.student@example.com",
        password: "hashedpassword123",
        role: "student",
        age: 21,
        gender: "Male",
        state: "Karnataka",
        city: "Bengaluru",
        educationLevel: "Undergraduate",
        stream: "Computer Science",
        skills: ["Python", "SQL", "HTML"],
        interests: ["Data Analytics", "Software Engineering"],
        lastMlSkillsHash: "mock_hash_123"
      });
      console.log("Created test user:", user.email);
    } else {
      console.log(`Found existing test user: ${user.name} (${user.email})`);
    }

    // 3. Ensure a journey exists for the user
    let journey = await Journey.findOne({ userId: user._id });
    if (!journey) {
      journey = await Journey.create({
        userId: user._id,
        predictedDomain: "IT",
        confirmedDomain: "IT",
        isDomainConfirmed: true,
        currentStep: "CAREER_PREDICTED",
        domainPredictedAt: new Date(),
        domainConfirmedAt: new Date()
      });
      console.log("Created mock journey for test user");
    }

    // 4. Ensure a mock MlCache entry exists for IT prediction if not present
    let cacheEntry = await MlCache.findOne({
      skillsHash: user.lastMlSkillsHash || "mock_hash_123",
      modelType: "IT_CAREER_PREDICTION"
    });

    if (!cacheEntry) {
      console.log("No cache entry found for mock skills hash. Seeding a mock career prediction cache...");
      cacheEntry = await MlCache.create({
        modelType: "IT_CAREER_PREDICTION",
        skillsHash: user.lastMlSkillsHash || "mock_hash_123",
        response: {
          domain: "IT",
          careers: [
            {
              role: "Data Analyst",
              confidence: 0.85,
              career: {
                key: "data_analyst",
                title: "Data Analyst",
                description: "Analyze dataset details to help companies make better decisions.",
                domain: "IT",
                category: "Data Science",
                isActive: true
              },
              explanation: {
                about: "A Data Analyst gathers, cleans, and interprets data to solve problems and assist business strategies.",
                salary: { entry: "₹4-6 LPA", experienced: "₹12-18 LPA" },
                growth: "Very high growth due to increasing enterprise reliance on data.",
                skills_to_learn: ["Power BI", "Tableau", "Advanced Excel"],
                roadmap: [
                  { step: 1, title: "Master Excel & SQL", description: "Learn data query filters and basic data modeling." },
                  { step: 2, title: "Learn Python & Pandas", description: "Analyze larger structured datasets programmatically." },
                  { step: 3, title: "Visualization Tools", description: "Design dashboards using Tableau or Power BI." }
                ]
              }
            }
          ]
        }
      });
    }

    // 5. Gather context like the controller does
    let careerRecommendation = null;
    if (journey.currentStep === "CAREER_PREDICTED" && user.lastMlSkillsHash) {
      const modelType = journey.confirmedDomain === "IT" ? "IT_CAREER_PREDICTION" : "NON_IT_CAREER_PREDICTION";
      const activeCache = await MlCache.findOne({
        skillsHash: user.lastMlSkillsHash,
        modelType: modelType
      }).lean();
      if (activeCache) {
        careerRecommendation = activeCache.response;
      }
    }

    let studentContext = `Student Profile:
- Name: ${user.name}
- Age: ${user.age}
- Gender: ${user.gender}
- Location: ${user.city}, ${user.state}
- Education Level: ${user.educationLevel}
- Stream/Major: ${user.stream}
- Current Skills: ${user.skills.join(", ")}
- Interests: ${user.interests.join(", ")}
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
          studentContext += `   - Salary: Entry: ${item.explanation.salary?.entry}, Experienced: ${item.explanation.salary?.experienced}\n`;
          studentContext += `   - Growth: ${item.explanation.growth}\n`;
          studentContext += `   - Recommended Skills to Learn: ${item.explanation.skills_to_learn?.join(", ")}\n`;
          if (Array.isArray(item.explanation.roadmap)) {
            studentContext += `   - Roadmap:\n`;
            item.explanation.roadmap.forEach((step) => {
              studentContext += `     Step ${step.step}: ${step.title} - ${step.description}\n`;
            });
          }
        }
        studentContext += `\n`;
      });
    }

    // 6. Define user test query
    const userQuery = "Hello! I am looking at my recommendations. Could you explain the entry salary and growth prospects for a Data Analyst, and how my current python skills can help?";
    console.log(`\n[User Query]: "${userQuery}"`);

    // 7. Compile instructions
    const systemPrompt = `You are LAKSHYA AI, an expert, empathetic AI Career Counselor and Academic Advisor for Indian engineering and technology students.
Your goal is to guide students on their educational journey, skill gap analysis, course selections, resume building, and transitioning into their target career roles.

Here is the background context about the student you are advising:
-----------------------------------------
${studentContext}
-----------------------------------------

Guidelines:
1. Refer to the student's name, current skills, and target career paths/roadmaps naturally in conversation.
2. Be action-oriented: Give specific, practical steps.
3. Keep your responses encouraging, professional, and clear.
4. Keep your responses concise (around 150-250 words) to ensure readability.
`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery }
    ];

    console.log("\nQuerying Groq API...");
    const reply = await getChatCompletion(messages);

    console.log("\n=== [Groq AI Counselor Reply] ===");
    console.log(reply);
    console.log("==================================");

    console.log("\n✅ Backend Test Succeeded! Groq AI successfully answered using student database details.");

  } catch (error) {
    console.error("\n❌ Backend Test Failed:", error.message);
  } finally {
    // Disconnect DB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runTest();
