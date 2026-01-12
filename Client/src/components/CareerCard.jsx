import { useEffect, useState } from "react";

// 🔹 Dummy Data for now
const dummyCareerData = {
  primary_career: "Frontend Developer",
  ai_confidence: 85,
  reasoning: "Based on your skills in HTML, CSS, and JavaScript, this role suits you best.",
  alternate_careers: ["UI/UX Designer", "Full Stack Developer", "React Developer"]
};

export default function CareerCard() {
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setCareer(dummyCareerData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <p className="text-sm text-[#9BA8AB]">
          Loading career recommendation...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">
      
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-[#06141B]">
          Career Recommendation
        </h3>
        <p className="text-sm text-[#4A5C6A]">
          AI-powered career insights
        </p>
      </div>

      {/* Primary Career */}
      <div className="mb-3">
        <h4 className="text-lg font-semibold text-[#11212D]">
          {career.primary_career}
        </h4>
        <p className="text-sm text-[#4A5C6A] mt-1">
          AI Confidence: {career.ai_confidence}%
        </p>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-[#253745] mb-4">
        🧠 {career.reasoning}
      </p>

      {/* Alternate Careers */}
      <div>
        <p className="text-sm font-medium text-[#06141B] mb-2">
          Alternate Paths
        </p>
        <div className="flex flex-wrap gap-2">
          {career.alternate_careers.map((role, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 rounded-full bg-[#CCD0CF]/30 text-[#06141B]"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
