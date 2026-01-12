// skillGapCalculator.js
// PURPOSE: Calculate skill gaps between student & career requirements

export function calculateSkillGap(studentSkills = [], requiredSkills = []) {
  if (!requiredSkills.length) return [];

  return requiredSkills.map((required) => {
    const studentSkill = studentSkills.find(
      (s) =>
        s.skill_name.toLowerCase() ===
        required.skill_name.toLowerCase()
    );

    const currentScore = studentSkill ? studentSkill.score : 0;
    const minimumScore = required.minimum_score || 0;

    const gapValue = minimumScore - currentScore;

    return {
      skill_name: required.skill_name,
      current_score: currentScore,
      required_level: required.required_level,
      minimum_score: minimumScore,
      gap: gapValue > 0 ? gapValue : 0,
      status: gapValue <= 0 ? "Good" : "Needs Improvement",
      priority:
        gapValue > 30
          ? "High"
          : gapValue > 15
          ? "Medium"
          : "Low"
    };
  });
}
