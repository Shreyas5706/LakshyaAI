// careerMapper.js
// PURPOSE: Map student interests & skills to career paths (logic layer)

export function mapCareers(studentProfile, studentSkills) {
  if (!studentProfile) return null;

  const interest = studentProfile.primary_interest?.toLowerCase() || "";

  // 🔁 Rule-based logic for now (ML will replace later)
  const careerRules = {
    "web development": {
      primary: "Frontend Developer",
      alternates: ["UI/UX Designer", "Full Stack Developer"]
    },
    "design": {
      primary: "UI/UX Designer",
      alternates: ["Graphic Designer", "Product Designer"]
    },
    "data science": {
      primary: "Data Analyst",
      alternates: ["ML Engineer", "Business Analyst"]
    }
  };

  const matched = Object.keys(careerRules).find((key) =>
    interest.includes(key)
  );

  if (!matched) {
    return {
      primary_career: "General Software Engineer",
      alternate_careers: ["Frontend Developer", "Backend Developer"],
      confidence: "Low"
    };
  }

  return {
    primary_career: careerRules[matched].primary,
    alternate_careers: careerRules[matched].alternates,
    confidence: "High"
  };
}
