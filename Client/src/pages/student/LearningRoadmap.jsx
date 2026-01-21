import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  Layers,
  Info,
  Sparkles,
} from "lucide-react";

/*
================ BACKEND / AI INTEGRATION NOTES =================

1. GET /api/student/profile
   → returns { skills: [] }

2. GET /api/roadmaps?skill=Python
   → returns:
   {
     duration,
     levels: [
       { title, weeks, topics:[ { name, time, reason } ] }
     ]
   }

3. POST /api/roadmap/progress
   → save completed topics

4. AI LOGIC (Gemini / GPT):
   - Identify missing skills
   - Generate step-by-step roadmap
   - Add "reason" per topic (why needed)

===============================================================
*/

/* ================= TEMP STATIC DATA ================= */
const ROADMAP_LIBRARY = {
  "Communication": {
    duration: "12 Weeks",
    levels: [
      {
        title: "Foundation",
        weeks: "1–4",
        topics: [
          { name: "Logic Building", time: "5 days", reason: "Core problem-solving skill" },
          { name: "Variables & Data Types", time: "3 days", reason: "Programming basics" },
          { name: "Loops & Conditions", time: "4 days", reason: "Control program flow" },
        ],
      },
      {
        title: "Intermediate",
        weeks: "5–8",
        topics: [
          { name: "Functions", time: "3 days", reason: "Code reusability" },
          { name: "Arrays & Objects", time: "4 days", reason: "Data organization" },
          { name: "Debugging", time: "2 days", reason: "Fix logical errors" },
        ],
      },
      {
        title: "Advanced",
        weeks: "9–12",
        topics: [
          { name: "Problem Solving Practice", time: "6 days", reason: "Interview readiness" },
          { name: "Mini Project", time: "1 week", reason: "Real-world experience" },
        ],
      },
    ],
  },
  "Leadership": {
    duration: "12 Weeks",
    levels: [
      {
        title: "Foundation",
        weeks: "1–4",
        topics: [
          { name: "Logic Building", time: "5 days", reason: "Core problem-solving skill" },
          { name: "Variables & Data Types", time: "3 days", reason: "Programming basics" },
          { name: "Loops & Conditions", time: "4 days", reason: "Control program flow" },
        ],
      },
      {
        title: "Intermediate",
        weeks: "5–8",
        topics: [
          { name: "Functions", time: "3 days", reason: "Code reusability" },
          { name: "Arrays & Objects", time: "4 days", reason: "Data organization" },
          { name: "Debugging", time: "2 days", reason: "Fix logical errors" },
        ],
      },
      {
        title: "Advanced",
        weeks: "9–12",
        topics: [
          { name: "Problem Solving Practice", time: "6 days", reason: "Interview readiness" },
          { name: "Mini Project", time: "1 week", reason: "Real-world experience" },
        ],
      },
    ],
  },
   "Creativity": {
    duration: "12 Weeks",
    levels: [
      {
        title: "Foundation",
        weeks: "1–4",
        topics: [
          { name: "Logic Building", time: "5 days", reason: "Core problem-solving skill" },
          { name: "Variables & Data Types", time: "3 days", reason: "Programming basics" },
          { name: "Loops & Conditions", time: "4 days", reason: "Control program flow" },
        ],
      },
      {
        title: "Intermediate",
        weeks: "5–8",
        topics: [
          { name: "Functions", time: "3 days", reason: "Code reusability" },
          { name: "Arrays & Objects", time: "4 days", reason: "Data organization" },
          { name: "Debugging", time: "2 days", reason: "Fix logical errors" },
        ],
      },
      {
        title: "Advanced",
        weeks: "9–12",
        topics: [
          { name: "Problem Solving Practice", time: "6 days", reason: "Interview readiness" },
          { name: "Mini Project", time: "1 week", reason: "Real-world experience" },
        ],
      },
    ],
  }

  
};

/* ================= MAIN COMPONENT ================= */

export default function LearningRoadmap() {
  const [skills, setSkills] = useState([]);
  const [activeSkill, setActiveSkill] = useState(null);
  const [completed, setCompleted] = useState({});

  /* ===== Load skills from onboarding ===== */
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("studentProfile"));
    if (profile?.skills?.length) {
      setSkills(profile.skills);
      setActiveSkill(profile.skills[0]);
    }
  }, []);

  if (!activeSkill || !ROADMAP_LIBRARY[activeSkill]) {
    return (
      <div className="text-center py-24 text-slate-500">
        <Info className="mx-auto mb-3" />
        No roadmap available yet for your selected skills.
      </div>
    );
  }

  const roadmap = ROADMAP_LIBRARY[activeSkill];
  const allTopics = roadmap.levels.flatMap(l => l.topics);
  const completedCount = Object.keys(completed).length;
  const progress = Math.round((completedCount / allTopics.length) * 100);

  const toggleComplete = (topic) => {
    setCompleted(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  return (
    <section className="roadmap-page">

      {/* ================= HEADER ================= */}
      <div className="roadmap-header">
        <div className="icon-box">
          <BookOpen size={26} />
        </div>
        <h1>Learning Roadmap</h1>
        <p>
          A personalized step-by-step learning journey based on your skills
        </p>
      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="roadmap-card">

        {/* ===== SKILL SELECTOR ===== */}
        <div className="skill-selector">
          {skills.map(skill => (
            <button
              key={skill}
              onClick={() => {
                setActiveSkill(skill);
                setCompleted({});
              }}
              className={activeSkill === skill ? "active" : ""}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW ===== */}
        <div className="overview">
          <Overview label="Duration" value={roadmap.duration} icon={Clock} />
          <Overview label="Topics" value={allTopics.length} icon={Layers} />
          <Overview label="Progress" value={`${progress}%`} icon={CheckCircle} />
        </div>

        {/* ===== PROGRESS BAR ===== */}
        <div className="progress-wrap">
          <div className="bar">
            <div style={{ width: `${progress}%` }} />
          </div>
          <span>
            {completedCount} / {allTopics.length} topics completed
          </span>
        </div>

        {/* ===== ROADMAP TIMELINE ===== */}
        <div className="timeline">
          {roadmap.levels.map((level, idx) => (
            <div key={idx} className="level">

              <div className="level-title">
                <Sparkles size={16} />
                {level.title}
                <span>Weeks {level.weeks}</span>
              </div>

              <div className="topics">
                {level.topics.map(topic => {
                  const done = completed[topic.name];
                  return (
                    <div key={topic.name} className={`topic ${done ? "done" : ""}`}>
                      <button onClick={() => toggleComplete(topic.name)}>
                        {done ? <CheckCircle /> : <Circle />}
                      </button>

                      <div className="topic-info">
                        <h4>{topic.name}</h4>
                        <p>{topic.reason}</p>
                        <span>{topic.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

      </div>

      <style>{css}</style>
    </section>
  );
}

/* ================= SMALL COMPONENT ================= */

const Overview = ({ label, value, icon: Icon }) => (
  <div className="overview-card">
    <div className="icon">
      <Icon size={20} />
    </div>
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  </div>
);

/* ================= CSS ================= */

const css = `
.roadmap-page{
  display:flex;
  flex-direction:column;
  gap:32px;
}

/* HEADER */
.roadmap-header{
  text-align:center;
}

.icon-box{
  width:64px;height:64px;
  border-radius:16px;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0 auto;
}

.roadmap-header h1{
  font-size:2rem;
  font-weight:700;
  color:#064E3B;
  margin-top:14px;
}

.roadmap-header p{
  color:#64748b;
  margin-top:6px;
}

/* CARD */
.roadmap-card{
  background:rgba(255,255,255,.78);
  backdrop-filter:blur(18px);
  border-radius:32px;
  padding:40px;
  border:1px solid rgba(20,184,166,.25);
  box-shadow:0 30px 80px rgba(14,147,132,.25);
}

/* SKILLS */
.skill-selector{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.skill-selector button{
  padding:8px 16px;
  border-radius:999px;
  border:none;
  font-weight:600;
  background:#ECFEFF;
  color:#065F46;
}

.skill-selector button.active{
  background:#0E9384;
  color:white;
}

/* OVERVIEW */
.overview{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:20px;
  margin-top:24px;
}

.overview-card{
  background:#ECFEFF;
  padding:18px;
  border-radius:18px;
  display:flex;
  gap:14px;
  align-items:center;
}

.overview-card .icon{
  width:42px;height:42px;
  border-radius:12px;
  background:linear-gradient(135deg,#064E3B,#14B8A6);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
}

.overview-card span{
  font-size:.75rem;
  color:#64748b;
}

.overview-card strong{
  font-size:1.1rem;
  color:#064E3B;
}

/* PROGRESS */
.progress-wrap{
  margin-top:20px;
}

.bar{
  height:10px;
  background:#E5F7F5;
  border-radius:999px;
  overflow:hidden;
}

.bar div{
  height:100%;
  background:linear-gradient(90deg,#064E3B,#14B8A6);
}

.progress-wrap span{
  font-size:.8rem;
  color:#64748b;
}

/* TIMELINE */
.timeline{
  margin-top:36px;
  display:flex;
  flex-direction:column;
  gap:32px;
}

.level-title{
  font-weight:700;
  color:#064E3B;
  display:flex;
  align-items:center;
  gap:8px;
}

.level-title span{
  font-size:.75rem;
  color:#64748b;
  margin-left:auto;
}

.topics{
  margin-top:16px;
  display:flex;
  flex-direction:column;
  gap:14px;
}

.topic{
  display:flex;
  gap:14px;
  padding:16px;
  border-radius:18px;
  border:1px solid #E5F7F5;
  background:white;
}

.topic.done{
  background:#ECFEFF;
  border-color:#14B8A6;
}

.topic button{
  border:none;
  background:none;
  cursor:pointer;
  color:#0E9384;
}

.topic-info h4{
  font-weight:600;
  color:#064E3B;
}

.topic-info p{
  font-size:.8rem;
  color:#64748b;
}

.topic-info span{
  font-size:.7rem;
  color:#94a3b8;
}
`;
