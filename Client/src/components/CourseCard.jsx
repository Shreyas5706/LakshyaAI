import coursesData from "../data/courses.data.json";

export default function CourseCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">
      
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-[#06141B]">
          Recommended Courses
        </h3>
        <p className="text-sm text-[#4A5C6A]">
          Learn & upgrade your skills
        </p>
      </div>

      {/* Course Items */}
      <div className="space-y-4">
        {coursesData.map((course) => (
          <div
            key={course.course_id}
            className="border border-[#4A5C6A]/50 rounded-lg p-4 bg-[#CCD0CF]/10"
          >
            {/* Title */}
            <h4 className="text-sm font-medium text-[#11212D] mb-1">
              {course.title}
            </h4>

            {/* Platform & Level */}
            <p className="text-xs text-[#253745]">
              🎓 {course.platform} • {course.level}
            </p>

            {/* Duration */}
            <p className="text-xs text-[#253745] mt-1">
              ⏱ Duration: {course.duration}
            </p>

            {/* Link */}
            <a
              href={course.link}
              className="inline-block mt-2 text-xs text-blue-600 hover:underline"
            >
              View Course →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
