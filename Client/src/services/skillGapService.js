// skillGapService.js
// PURPOSE: Skill Gap service (model-ready abstraction)

import { studentService } from "./studentService";
import { calculateSkillGap } from "../utils/skillGapCalculator";

export const skillGapService = {
  async getSkillGap(studentId, targetCareer) {
    try {
      const studentSkills = await studentService.getStudentSkills(studentId);

      // 🔁 Dummy required skills (will come from ML / backend later)
      const requiredSkillsMap = {
        "Frontend Developer": [
          { skill_name: "HTML", required_level: "Advanced", minimum_score: 70 },
          { skill_name: "CSS", required_level: "Advanced", minimum_score: 70 },
          { skill_name: "JavaScript", required_level: "Advanced", minimum_score: 75 },
          { skill_name: "React", required_level: "Intermediate", minimum_score: 65 }
        ],

        "UI/UX Designer": [
          { skill_name: "Figma", required_level: "Advanced", minimum_score: 70 },
          { skill_name: "Wireframing", required_level: "Advanced", minimum_score: 65 },
          { skill_name: "User Research", required_level: "Intermediate", minimum_score: 60 }
        ]
      };

      const requiredSkills =
        requiredSkillsMap[targetCareer] || [];

      const gapAnalysis = calculateSkillGap(
        studentSkills,
        requiredSkills
      );

      return {
        student_id: studentId,
        career: targetCareer,
        skills: gapAnalysis
      };
    } catch (error) {
      console.error("Error calculating skill gap:", error);
      return null;
    }
  }
};
