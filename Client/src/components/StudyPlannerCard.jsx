import studyPlannerData from "../data/studyPlanner.data.json";

export default function StudyPlannerCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">
      
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-800">
          Study Planner
        </h3>
        <p className="text-sm text-gray-500">
          Weekly study focus & exam strategy
        </p>
      </div>

      {/* Planner Items */}
      <div className="space-y-4">
        {studyPlannerData.map((item) => (
          <div
            key={item.planner_id}
            className="border border-gray-200 rounded-lg p-4"
          >
            {/* Subject & Difficulty */}
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-800">
                {item.subject}
              </h4>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                {item.difficulty}
              </span>
            </div>

            {/* Hours */}
            <p className="text-sm text-gray-600 mb-1">
              ⏱ Suggested Hours / Week:{" "}
              <span className="font-medium text-gray-800">
                {item.hours_per_week}
              </span>
            </p>

            {/* Strategy */}
            <p className="text-sm text-gray-600">
              📌 Strategy:{" "}
              <span className="text-gray-700">
                {item.exam_strategy}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
