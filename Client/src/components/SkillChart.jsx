import { useEffect, useState } from "react";
import { skillGapService } from "../services/skillGapService";

export default function SkillChart() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const result = await skillGapService.getSkillGap(
          "STU001",
          "Frontend Developer"
        );
        setSkills(result?.skills || []);
      } catch {
        setSkills([]);
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <p className="text-sm text-[#9BA8AB]">
          Loading skill analysis...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">
      
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-[#06141B]">
          Skill Scores
        </h3>
        <p className="text-sm text-[#4A5C6A]">
          Based on your target career
        </p>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        {skills.map((skill, index) => {
          const progress =
            (skill.current_score / skill.minimum_score) * 100;

          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#253745]">
                  {skill.skill_name}
                </span>
                <span className="text-xs text-[#4A5C6A]">
                  {skill.status}
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#11212D] rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <p className="text-xs text-[#9BA8AB] mt-1">
                {skill.current_score} / {skill.minimum_score} • Priority:{" "}
                {skill.priority}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
