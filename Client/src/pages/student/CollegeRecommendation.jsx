import { useEffect, useState } from "react";
import {
  GraduationCap,
  MapPin,
  Star,
  IndianRupee,
  Info,
  ExternalLink,
  Bookmark,
} from "lucide-react";

/*
================ BACKEND INTEGRATION NOTES =================

1. GET /api/student/profile
   → { education, stream, skills, interests, state, budget }

2. GET /api/college/recommendations?studentId=xyz
   → Returns AI-ranked colleges sorted by relevance

3. AI RECOMMENDATION BASIS:
   - Stream & education match
   - Skills & interests overlap
   - Budget compatibility
   - Location preference
   - Placement & career outcomes

4. Optional:
   - POST /api/college/save
   - GET /api/college/details/:id

============================================================
*/

export default function CollegeRecommendation() {
  const [colleges, setColleges] = useState([]);

  /* ===== LOAD COLLEGE DATA (MOCK → API LATER) ===== */
  useEffect(() => {
    setColleges([
      {
        id: 1,
        name: "Indian Institute of Technology, Bombay",
        location: "Mumbai, Maharashtra",
        type: "Government",
        rating: 4.9,
        match: 92,
        fees: "₹2.3L / year",
        courses: ["B.Tech CSE", "AI & Data Science"],
        reason:
          "Strong alignment with your programming skills and AI career interest.",
      },
      {
        id: 2,
        name: "Vellore Institute of Technology",
        location: "Vellore, Tamil Nadu",
        type: "Private",
        rating: 4.6,
        match: 86,
        fees: "₹1.9L / year",
        courses: ["Computer Science", "Information Technology"],
        reason:
          "Balanced option considering your academic background and budget.",
      },
      {
        id: 3,
        name: "Manipal Institute of Technology",
        location: "Manipal, Karnataka",
        type: "Private",
        rating: 4.5,
        match: 81,
        fees: "₹2.1L / year",
        courses: ["CSE", "Cyber Security"],
        reason:
          "Recommended for modern curriculum and strong industry exposure.",
      },
    ]);
  }, []);

  return (
    <section className="college-page">

      {/* ================= HEADER ================= */}
      <div className="college-header">
        <div className="icon-box">
          <GraduationCap size={28} />
        </div>

        <h1>College Recommendations</h1>
        <p>
          AI-powered college suggestions tailored to your profile and goals
        </p>
      </div>

      {/* ================= INFO NOTE ================= */}
      <div className="info-box">
        <Info size={18} />
        <span>
          These colleges are recommended using your skills, interests,
          education level, and career direction.
        </span>
      </div>

      {/* ================= COLLEGE LIST ================= */}
      <div className="college-list">
        {colleges.map((c) => (
          <div key={c.id} className="college-card">

            {/* TOP */}
            <div className="top">
              <div>
                <h3>{c.name}</h3>
                <p className="location">
                  <MapPin size={14} /> {c.location}
                </p>
              </div>

              <span className="type">{c.type}</span>
            </div>

            {/* MATCH */}
            <div className="match">
              <span>Profile Match</span>
              <strong>{c.match}%</strong>
            </div>

            <div className="progress">
              <div style={{ width: `${c.match}%` }} />
            </div>

            {/* DETAILS */}
            <div className="details">
              <div>
                <IndianRupee size={16} />
                <span>{c.fees}</span>
              </div>

              <div className="rating">
                <Star size={16} />
                {c.rating}
              </div>
            </div>

            {/* COURSES */}
            <div className="courses">
              <span>Popular Courses:</span>
              <p>{c.courses.join(", ")}</p>
            </div>

            {/* REASON */}
            <div className="reason">
              <strong>Why this college?</strong>
              <p>{c.reason}</p>
            </div>

            {/* ACTIONS */}
            <div className="actions">
              <button className="save-btn">
                <Bookmark size={16} />
                Save
              </button>

              <button className="view-btn">
                View Details
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{css}</style>
    </section>
  );
}

/* ================= CSS ================= */

const css = `
.college-page{
  display:flex;
  flex-direction:column;
  gap:32px;
}

/* HEADER */
.college-header{
  text-align:center;
}

.college-header h1{
  font-size:2rem;
  font-weight:700;
  color:#064E3B;
  margin-top:14px;
}

.college-header p{
  color:#64748b;
  margin-top:6px;
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

/* INFO */
.info-box{
  display:flex;
  gap:10px;
  align-items:flex-start;
  background:#ECFEFF;
  border:1px solid #99F6E4;
  padding:14px 16px;
  border-radius:14px;
  font-size:.85rem;
  color:#065F46;
}

/* LIST */
.college-list{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:26px;
}

/* CARD */
.college-card{
  background:white;
  border-radius:26px;
  padding:26px;
  box-shadow:0 16px 40px rgba(0,0,0,.06);
  display:flex;
  flex-direction:column;
  gap:18px;
}

/* TOP */
.top{
  display:flex;
  justify-content:space-between;
  gap:12px;
}

.top h3{
  font-size:1.1rem;
  font-weight:700;
  color:#064E3B;
}

.location{
  font-size:.8rem;
  color:#64748b;
  display:flex;
  gap:4px;
  align-items:center;
}

.type{
  padding:6px 12px;
  border-radius:999px;
  font-size:.75rem;
  font-weight:600;
  background:#ECFEFF;
  color:#065F46;
}

/* MATCH */
.match{
  display:flex;
  justify-content:space-between;
  font-size:.85rem;
  font-weight:600;
  color:#065F46;
}

.progress{
  height:8px;
  background:#E5F7F5;
  border-radius:999px;
  overflow:hidden;
}

.progress div{
  height:100%;
  background:linear-gradient(90deg,#064E3B,#14B8A6);
}

/* DETAILS */
.details{
  display:flex;
  justify-content:space-between;
  font-size:.85rem;
  color:#0f172a;
}

.details div{
  display:flex;
  gap:6px;
  align-items:center;
}

.rating{
  color:#f59e0b;
  font-weight:600;
}

/* COURSES */
.courses span{
  font-size:.75rem;
  font-weight:600;
  color:#64748b;
}

.courses p{
  font-size:.85rem;
  margin-top:2px;
}

/* REASON */
.reason{
  background:#F6FBFA;
  border:1px solid #E5F7F5;
  padding:14px;
  border-radius:14px;
  font-size:.85rem;
  color:#475569;
}

.reason strong{
  color:#065F46;
}

/* ACTIONS */
.actions{
  display:flex;
  justify-content:space-between;
  gap:12px;
}

.save-btn{
  flex:1;
  padding:10px;
  border-radius:12px;
  border:1px solid #99F6E4;
  background:#ECFEFF;
  color:#065F46;
  font-weight:600;
  display:flex;
  gap:6px;
  align-items:center;
  justify-content:center;
}

.view-btn{
  flex:1;
  padding:10px;
  border-radius:12px;
  border:none;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  font-weight:600;
  display:flex;
  gap:6px;
  align-items:center;
  justify-content:center;
}
`;
