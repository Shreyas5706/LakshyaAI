import internshipsData from "../data/internships.data.json";

export default function InternshipCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full">

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-800">
          Internships
        </h3>
        <p className="text-sm text-gray-500">
          Opportunities aligned with your skills
        </p>
      </div>

      {/* Internship Items */}
      <div className="space-y-4">
        {internshipsData.map((item) => (
          <div
            key={item.internship_id}
            className="border border-gray-200 rounded-lg p-4"
          >
            {/* Role */}
            <h4 className="text-sm font-medium text-gray-800 mb-1">
              {item.role}
            </h4>

            {/* Company & Location */}
            <p className="text-sm text-gray-600">
              🏢 {item.company} • 📍 {item.location}
            </p>

            {/* Stipend */}
            <p className="text-sm text-gray-600 mt-1">
              💰 {item.stipend}
            </p>

            {/* Link */}
            <a
              href={item.link}
              className="inline-block mt-2 text-sm text-blue-600 hover:underline"
            >
              View Internship →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
