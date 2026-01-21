import { useEffect, useState } from "react";
import {
  Briefcase,
  Star,
  TrendingUp,
  Info,
} from "lucide-react";

/*
================ BACKEND INTEGRATION NOTES =================

1. GET /api/student/profile
   → returns { skills, interests, education, stream }

2. POST /api/career/recommendations
   → body: { skills, interests, education, stream }
   → returns:
     [
       {
         title: "Data Scientist",
         matchScore: 92,
         description: "...",
         requiredSkills: [],
         avgSalary: "₹10–18 LPA",
         growth: "High",
       }
     ]

===========================================================
*/

export default function CareerRecommendation() {
  const [careers, setCareers] = useState([]);

  /* ===== Load recommendations ===== */
  useEffect(() => {
    // 🔹 TEMP: mock data (replace with backend API)
    setCareers(MOCK_RECOMMENDATIONS);
  }, []);

  return (
    <section className="p-6 md:p-10 bg-[#F6FBFA]">

      {/* ================= PAGE HEADER ================= */}
      <div className="career-header">
        <div className="icon-box">
          <Briefcase size={28} />
        </div>

        <h1>Career Recommendations</h1>

        <p>
          Top career paths suggested based on your skills, interests, and academic profile
        </p>
      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="max-w-[1100px] mx-auto glass-card rounded-[36px] p-10 md:p-14 space-y-10">

        {/* ================= CAREER LIST ================= */}
        <div className="space-y-8">
          {careers.map((career, index) => (
            <div key={career.title} className="career-card">

              {/* LEFT */}
              <div className="rank">{index + 1}</div>

              {/* CENTER */}
              <div className="career-center">
                <h3>{career.title}</h3>
                <p className="desc">{career.description}</p>

                <div className="tags">
                  {career.requiredSkills.map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="career-right">
                <div className="metric">
                  <Star size={14} />
                  <span>{career.matchScore}% Match</span>
                </div>

                <div className="metric">
                  <TrendingUp size={14} />
                  <span>{career.growth} Growth</span>
                </div>

                <div className="salary">
                  {career.avgSalary}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

/* ================= MOCK DATA ================= */

const MOCK_RECOMMENDATIONS = [
  {
    title: "Data Scientist",
    matchScore: 92,
    description:
      "Work with data to build predictive models, uncover insights, and support decision-making.",
    requiredSkills: ["Python", "Statistics", "Data Analysis", "ML"],
    avgSalary: "₹10–18 LPA",
    growth: "High",
  },
  {
    title: "Software Engineer",
    matchScore: 88,
    description:
      "Design, develop, and maintain scalable software systems.",
    requiredSkills: ["Programming", "Problem Solving", "DSA"],
    avgSalary: "₹8–15 LPA",
    growth: "High",
  },
  {
    title: "Product Manager",
    matchScore: 81,
    description:
      "Lead product strategy by aligning business goals with technology.",
    requiredSkills: ["Communication", "Leadership", "Strategy"],
    avgSalary: "₹12–20 LPA",
    growth: "Medium",
  },
  {
    title: "UI/UX Designer",
    matchScore: 76,
    description:
      "Design intuitive and engaging user experiences.",
    requiredSkills: ["Creativity", "Design", "User Research"],
    avgSalary: "₹6–12 LPA",
    growth: "Medium",
  },
  {
    title: "Business Analyst",
    matchScore: 72,
    description:
      "Analyze business needs and translate them into data-driven solutions.",
    requiredSkills: ["Analysis", "Communication", "Excel"],
    avgSalary: "₹6–10 LPA",
    growth: "Medium",
  },
];

/* ================= CSS ================= */

const css = `
/* HEADER */
.career-header{
  text-align:center;
  margin-bottom:48px;
}

.career-header h1{
  font-size:2rem;
  font-weight:700;
  color:#064E3B;
  margin-top:14px;
}

.career-header p{
  color:#64748b;
  margin-top:6px;
  max-width:640px;
  margin-inline:auto;
}

/* ICON */
.icon-box{
  width:64px;
  height:64px;
  border-radius:16px;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0 auto;
}

/* GLASS */
.glass-card{
  background:rgba(255,255,255,.78);
  backdrop-filter:blur(18px);
  border:1px solid rgba(20,184,166,.25);
  box-shadow:0 30px 80px rgba(14,147,132,.25);
}

/* INFO STRIP */
.info-strip{
  display:flex;
  align-items:center;
  gap:10px;
  background:#ECFEFF;
  border:1px solid #99F6E4;
  padding:14px 18px;
  border-radius:14px;
  font-size:.9rem;
  color:#065F46;
}

/* CAREER CARD */
.career-card{
  display:grid;
  grid-template-columns:60px 1fr 220px;
  gap:24px;
  padding:26px;
  background:white;
  border-radius:22px;
  border:1px solid #E5F7F5;
  transition:.25s;
}

.career-card:hover{
  transform:translateY(-3px);
}

/* RANK */
.rank{
  width:44px;
  height:44px;
  border-radius:14px;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  font-weight:700;
  display:flex;
  align-items:center;
  justify-content:center;
}

/* CENTER */
.career-center h3{
  font-size:1.15rem;
  font-weight:700;
  color:#064E3B;
}

.desc{
  font-size:.9rem;
  color:#64748b;
  margin-top:6px;
}

.tags{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:10px;
}

.chip{
  padding:6px 14px;
  background:#ECFEFF;
  border-radius:999px;
  font-size:.75rem;
  font-weight:600;
  color:#065F46;
}

/* RIGHT */
.career-right{
  display:flex;
  flex-direction:column;
  gap:10px;
  align-items:flex-end;
  justify-content:center;
}

.metric{
  display:flex;
  align-items:center;
  gap:6px;
  font-size:.8rem;
  color:#065F46;
}

.salary{
  margin-top:6px;
  font-weight:700;
  color:#0f172a;
  font-size:.95rem;
}
`;
