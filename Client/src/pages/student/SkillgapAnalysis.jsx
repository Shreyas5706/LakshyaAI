import { useEffect, useState } from "react";
import {
  RefreshCcw,
  Zap,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  PlayCircle,
  Circle,
  Briefcase,
} from "lucide-react";

/* =====================================================
   IMPORTANCE COLORS
===================================================== */

const IMPORTANCE_COLORS = {
  critical: "badge critical",
  high: "badge high",
  medium: "badge medium",
  low: "badge low",
};

/* =====================================================
   MAIN PAGE
===================================================== */

export default function SkillGapAnalysis() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setSkills(MOCK_SKILLS);
  }, []);

  return (
    <section className="skill-page">

      {/* ================= HEADER ================= */}
      <div className="page-header">
        <div>
          <h1>Skill Gap Analysis</h1>
          <p>Track your progress towards your dream career</p>
        </div>

        <button className="refresh-btn">
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* ================= STATS ================= */}
      <StatsCards skills={skills} />

      {/* ================= SECTIONS ================= */}
      <SkillSection
        title="Skills Acquired"
        subtitle="Skills you've already mastered"
        icon={<CheckCircle2 />}
        skills={skills.filter(s => s.status === "acquired")}
        theme="acquired"
      />

      <SkillSection
        title="Gap Skills"
        subtitle="Priority skills to learn for your career"
        icon={<AlertCircle />}
        skills={skills.filter(s => s.status === "gap")}
        theme="gap"
      />

      <SkillSection
        title="Bonus Skills"
        subtitle="Extra skills to stand out from the crowd"
        icon={<Sparkles />}
        skills={skills.filter(s => s.status === "bonus")}
        theme="bonus"
      />

      <p className="updated-text">
        Last updated: Wednesday, January 21, 2026
      </p>

      <style>{css}</style>
    </section>
  );
}

/* =====================================================
   STATS CARDS
===================================================== */

function StatsCards({ skills }) {
  const acquired = skills.filter(s => s.status === "acquired").length;
  const gap = skills.filter(s => s.status === "gap").length;
  const inProgress = skills.filter(s => s.progressStatus === "in_progress").length;
  const hours = skills
    .filter(s => s.status === "gap")
    .reduce((t, s) => t + s.estimatedHours * (1 - s.progress / 100), 0);

  const stats = [
    { label: "Skills Acquired", value: acquired, icon: Zap },
    { label: "Skills to Learn", value: gap, icon: BookOpen },
    { label: "In Progress", value: inProgress, icon: TrendingUp },
    { label: "Hours Remaining", value: `${Math.round(hours)}h`, icon: Clock },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-icon">
            <s.icon size={18} />
          </div>
          <div>
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   SKILL SECTION
===================================================== */

function SkillSection({ title, subtitle, icon, skills, theme }) {
  if (!skills.length) return null;

  return (
    <div className="section">
      <div className={`section-header ${theme}`}>
        <div className="section-icon">{icon}</div>
        <div className="section-text">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span className="count">{skills.length} skills</span>
      </div>

      <div className="card-grid">
        {skills.map(skill => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   SKILL CARD
===================================================== */

function SkillCard({ skill }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="skill-card">
      <div className="skill-main" onClick={() => setOpen(!open)}>
        <div className="skill-icon">
          {skill.status === "acquired" && <CheckCircle2 />}
          {skill.status === "gap" && <Circle />}
          {skill.status === "bonus" && <PlayCircle />}
        </div>

        <div className="skill-content">
          <div className="skill-head">
            <div>
              <h3>{skill.name}</h3>
              <p>{skill.description}</p>
            </div>
            <ImportanceBadge level={skill.importance} />
          </div>

          <div className="skill-meta">
            <span>{skill.estimatedHours}h to learn</span>
            <span>{skill.progressStatus.replace("_", " ")}</span>
          </div>

          {skill.progress > 0 && (
            <div className="progress-bar">
              <div style={{ width: `${skill.progress}%` }} />
            </div>
          )}
        </div>

        <ChevronDown className={open ? "rotate" : ""} />
      </div>

      {open && (
        <div className="skill-extra">
          <div>
            <h4><BookOpen size={14} /> Why you need this skill</h4>
            <p>{skill.whyNeeded}</p>
          </div>

          <div>
            <h4><Briefcase size={14} /> Used in real jobs</h4>
            <ul>
              {skill.realWorldUsage.map(u => <li key={u}>{u}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   IMPORTANCE BADGE
===================================================== */

function ImportanceBadge({ level }) {
  return <span className={IMPORTANCE_COLORS[level]}>{level}</span>;
}

/* =====================================================
   MOCK DATA
===================================================== */

const MOCK_SKILLS = [
  {
    id: "js",
    name: "JavaScript",
    description: "Core programming language for web development",
    status: "acquired",
    importance: "critical",
    estimatedHours: 120,
    progress: 100,
    progressStatus: "completed",
    whyNeeded: "JavaScript powers modern web applications.",
    realWorldUsage: ["Frontend", "Backend", "APIs"],
  },
  {
    id: "react",
    name: "React",
    description: "UI library for building interfaces",
    status: "acquired",
    importance: "critical",
    estimatedHours: 80,
    progress: 100,
    progressStatus: "completed",
    whyNeeded: "Industry-standard frontend framework.",
    realWorldUsage: ["Dashboards", "SPAs"],
  },
  {
    id: "ts",
    name: "TypeScript",
    description: "Typed JavaScript",
    status: "gap",
    importance: "critical",
    estimatedHours: 50,
    progress: 35,
    progressStatus: "in_progress",
    whyNeeded: "Improves scalability and safety.",
    realWorldUsage: ["Large apps"],
  },
  {
    id: "node",
    name: "Node.js & Express",
    description: "Backend runtime",
    status: "gap",
    importance: "critical",
    estimatedHours: 60,
    progress: 20,
    progressStatus: "in_progress",
    whyNeeded: "Required for backend development.",
    realWorldUsage: ["APIs"],
  },
  {
    id: "docker",
    name: "Docker",
    description: "Containerization tool",
    status: "bonus",
    importance: "medium",
    estimatedHours: 25,
    progress: 0,
    progressStatus: "not_started",
    whyNeeded: "Helps with deployment.",
    realWorldUsage: ["DevOps"],
  },
];

/* =====================================================
   CSS
===================================================== */

const css = `
.skill-page{
  background:#F6FBFA;
  padding:32px;
  min-height:100vh;
}

.page-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.page-header h1{
  font-size:1.8rem;
  font-weight:700;
  color:#064E3B;
}

.page-header p{
  color:#64748B;
}

.refresh-btn{
  display:flex;
  align-items:center;
  gap:8px;
  padding:10px 16px;
  border-radius:12px;
  border:1px solid #99F6E4;
  background:white;
  cursor:pointer;
}

.stats-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:18px;
}

.stat-card{
  background:white;
  padding:18px;
  border-radius:18px;
  display:flex;
  gap:14px;
  box-shadow:0 10px 25px rgba(0,0,0,.06);
}

.stat-icon{
  background:#ECFEFF;
  padding:10px;
  border-radius:12px;
}

.section{
  margin-top:32px;
}

.section-header{
  display:flex;
  align-items:center;
  gap:14px;
  padding:18px;
  border-radius:18px;
}

.section-header.acquired{background:#ECFEFF}
.section-header.gap{background:#FFF7ED}
.section-header.bonus{background:#F5F3FF}

.section-icon{
  background:white;
  padding:10px;
  border-radius:12px;
}

.count{
  margin-left:auto;
  background:white;
  padding:6px 14px;
  border-radius:999px;
  font-size:.85rem;
}

.card-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:20px;
  margin-top:18px;
}

.skill-card{
  background:white;
  border-radius:20px;
  box-shadow:0 12px 30px rgba(0,0,0,.08);
}

.skill-main{
  display:flex;
  gap:14px;
  padding:18px;
  cursor:pointer;
}

.skill-icon{
  background:#ECFEFF;
  padding:10px;
  border-radius:12px;
}

.skill-head{
  display:flex;
  justify-content:space-between;
}

.skill-meta{
  display:flex;
  gap:16px;
  font-size:.85rem;
  color:#64748B;
}

.progress-bar{
  height:6px;
  background:#E5F7F5;
  border-radius:999px;
  overflow:hidden;
  margin-top:8px;
}

.progress-bar div{
  height:100%;
  background:#14B8A6;
}

.skill-extra{
  padding:18px;
  border-top:1px solid #E5F7F5;
}

.badge{
  padding:4px 12px;
  border-radius:999px;
  font-size:.75rem;
  border:1px solid;
}

.badge.critical{color:#DC2626;border-color:#FCA5A5}
.badge.high{color:#EA580C;border-color:#FDBA74}
.badge.medium{color:#CA8A04;border-color:#FDE68A}
.badge.low{color:#16A34A;border-color:#86EFAC}

.updated-text{
  text-align:center;
  font-size:.8rem;
  color:#64748B;
  margin-top:40px;
}
`;
