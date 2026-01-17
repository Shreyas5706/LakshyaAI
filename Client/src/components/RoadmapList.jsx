import { useEffect, useState } from "react";

/**
 * RoadmapList.jsx
 * PURPOSE:
 * - Display learning roadmap items
 * - Dummy data now (from learning.roadmap.json)
 * - Backend / AI integration ready later
 */

export default function RoadmapList() {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Dummy roadmap data
    const dummyRoadmapData = [
      {
        roadmap_id: "RM01",
        topic: "Advanced JavaScript",
        suggested_course: "JavaScript Deep Dive",
        practice_task: "Build utility functions & async handlers",
        completed: true
      },
      {
        roadmap_id: "RM02",
        topic: "React Hooks & State Management",
        suggested_course: "React Advanced Patterns",
        practice_task: "Create dashboard with Context API",
        completed: false
      },
      {
        roadmap_id: "RM03",
        topic: "UI/UX Fundamentals",
        suggested_course: "Google UX Design Basics",
        practice_task: "Redesign login & dashboard screens",
        completed: false
      },
      {
        roadmap_id: "RM04",
        topic: "Portfolio Development",
        suggested_course: "Frontend Portfolio Masterclass",
        practice_task: "Deploy portfolio on Vercel",
        completed: false
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setRoadmap(dummyRoadmapData);
      setLoading(false);
    }, 400);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <p className="text-sm text-[#9BA8AB]">
          Loading learning roadmap...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">
      
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-[#06141B]">
          Learning Roadmap
        </h3>
        <p className="text-sm text-[#4A5C6A]">
          Step-by-step skill progression
        </p>
      </div>

      {/* Roadmap Items */}
      <ul className="space-y-3">
        {roadmap.length === 0 && (
          <li className="text-sm text-[#9BA8AB]">
            No roadmap data available
          </li>
        )}

        {roadmap.map((item) => (
          <li
            key={item.roadmap_id}
            className="border border-[#4A5C6A]/50 rounded-lg p-3 bg-[#CCD0CF]/10"
          >
            <div className="flex items-start gap-3">
              {/* Status */}
              <span className={`mt-1 text-sm ${item.completed ? "text-green-500" : "text-yellow-400"}`}>
                {item.completed ? "✔" : "⏳"}
              </span>

              {/* Content */}
              <div className="flex-1">
                <p className={`text-sm font-medium ${item.completed ? "text-[#06141B]" : "text-[#11212D]"}`}>
                  {item.topic}
                </p>

                <p className="text-xs text-[#4A5C6A] mt-1">
                  📘 Course: {item.suggested_course}
                </p>

                <p className="text-xs text-[#4A5C6A]">
                  🛠 Practice: {item.practice_task}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
