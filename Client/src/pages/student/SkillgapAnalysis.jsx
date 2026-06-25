import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./SkillgapAnalysis.css";

// ── Static skill data ──────────────────────────────────────────
const TARGET_SKILLS = [
  { name: "Deep Learning",       priority: "high",   reason: "Core for AI/ML roles" },
  { name: "TensorFlow / PyTorch", priority: "high",  reason: "Most-used ML frameworks" },
  { name: "MLOps",               priority: "medium", reason: "Deployment & pipelines" },
  { name: "Docker & Kubernetes", priority: "medium", reason: "Containerization skills" },
  { name: "Cloud Infrastructure", priority: "medium", reason: "AWS / GCP experience" },
  { name: "System Design",       priority: "low",    reason: "Senior role requirement" },
];

const SKILL_PERCENTAGES = [90, 75, 80, 70, 60, 65];

const ROADMAP_STEPS = [
  { name: "Python Basics",           sub: "Completed",        pct: 100, status: "completed" },
  { name: "Data Analysis",           sub: "Completed",        pct: 100, status: "completed" },
  { name: "Machine Learning Basics", sub: "Completed",        pct: 100, status: "completed" },
  { name: "Deep Learning",           sub: "In progress · 60%", pct: 60,  status: "in-progress" },
  { name: "MLOps",                   sub: "Upcoming",         pct: 0,   status: "upcoming" },
  { name: "Generative AI",           sub: "Upcoming",         pct: 0,   status: "upcoming" },
];

function SkillgapAnalysis() {
  const navigate = useNavigate();
  const [user, setUser]   = useState(null);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => { if (res.data?.success) setUser(res.data.user); })
      .catch((err) => console.log(err));
  }, []);

  const studentName  = user?.name || "Student";
  const loggedSkills = user?.skills?.length
    ? user.skills.slice(0, 6)
    : ["Python", "JavaScript", "SQL", "Data Analysis", "Machine Learning", "Statistics"];

  const handleNavigate = (path) => navigate(`/student/${path}`);

  return (
    <div className="skills-page-root">

      {/* ══════════════════════════════
          TOP NAVBAR
         ══════════════════════════════ */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => handleNavigate("dashboard")}>Dashboard</button>
          <button className="nav-link" onClick={() => handleNavigate("career")}>Career</button>
          <button className="nav-link active-link">Skills</button>
          <button className="nav-link" onClick={() => handleNavigate("learn")}>Learn</button>
          <button className="nav-link" onClick={() => handleNavigate("ai-assistant")}>AI Assistant</button>
        </div>
        <div className="navbar-avatar" onClick={() => handleNavigate("dashboard")} style={{ cursor: "pointer" }}>
          {studentName.charAt(0).toUpperCase()}
        </div>
      </nav>

      {/* ── Scrollable content ── */}
      <div className="skills-content-scroller">

          {/* ── Hero Banner ── */}
          <section className="skills-hero-banner">
            <div className="skills-hero-text">
              <h1>Skill Gap Analysis 📊</h1>
              <p>
                Compare your current skills against what's needed for your target career.
                Identify gaps, track progress, and get AI-powered course recommendations.
              </p>
            </div>

            <div className="skills-hero-badge">
              <div className="skills-score-ring">
                <svg width="90" height="90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(86,72,119,0.1)" strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#564877" strokeWidth="3.5"
                    strokeDasharray="73, 100" strokeLinecap="round"
                  />
                </svg>
                <span className="skills-score-num">73%</span>
              </div>
              <span className="skills-score-lbl">Career Readiness</span>
            </div>
          </section>

          {/* ── Stats strip ── */}
          <section className="skills-stats-strip">
            <div className="skills-stat-card">
              <div className="skills-stat-icon ic-purple">🧠</div>
              <div className="skills-stat-body">
                <span className="skills-stat-label">Current Skills</span>
                <span className="skills-stat-val">{loggedSkills.length}</span>
                <span className="skills-stat-sub">Skills mastered</span>
              </div>
            </div>

            <div className="skills-stat-card">
              <div className="skills-stat-icon ic-red">🔍</div>
              <div className="skills-stat-body">
                <span className="skills-stat-label">Skill Gaps</span>
                <span className="skills-stat-val">{TARGET_SKILLS.length}</span>
                <span className="skills-stat-sub">Skills to acquire</span>
              </div>
            </div>

            <div className="skills-stat-card">
              <div className="skills-stat-icon ic-green">✅</div>
              <div className="skills-stat-body">
                <span className="skills-stat-label">Steps Done</span>
                <span className="skills-stat-val">3 / 6</span>
                <span className="skills-stat-sub">Roadmap progress</span>
              </div>
            </div>

            <div className="skills-stat-card">
              <div className="skills-stat-icon ic-amber">🔥</div>
              <div className="skills-stat-body">
                <span className="skills-stat-label">Top Priority</span>
                <span className="skills-stat-val" style={{ fontSize: "13px" }}>Deep Learning</span>
                <span className="skills-stat-sub">AI-recommended</span>
              </div>
            </div>
          </section>

          {/* ── Main grid: Current Skills + Target Gaps ── */}
          <section className="skills-main-grid">

            {/* Card 1: Current Skills */}
            <div className="skills-module-card">
              <div className="skills-module-hdr">
                <h3 className="skills-module-title">💪 Your Current Skills</h3>
                <button className="skills-module-link" onClick={() => handleNavigate("profile")}>
                  Edit Skills →
                </button>
              </div>

              <div className="skills-bar-list">
                {loggedSkills.map((skill, idx) => (
                  <div className="skills-bar-row" key={skill}>
                    <div className="skills-bar-meta">
                      <span className="skills-bar-name">{skill}</span>
                      <span className="skills-bar-pct">{SKILL_PERCENTAGES[idx] ?? 70}%</span>
                    </div>
                    <div className="skills-bar-track">
                      <div
                        className="skills-bar-fill"
                        style={{ width: `${SKILL_PERCENTAGES[idx] ?? 70}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Skill Gaps */}
            <div className="skills-module-card">
              <div className="skills-module-hdr">
                <h3 className="skills-module-title">🎯 Skills to Acquire</h3>
                <button className="skills-module-link" onClick={() => handleNavigate("learn")}>
                  Find Courses →
                </button>
              </div>

              <div className="skills-gap-grid">
                {TARGET_SKILLS.map((s) => (
                  <div className="skills-gap-item" key={s.name}>
                    <div className="skills-gap-left">
                      <span className="skills-gap-dot" />
                      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                        <span className="skills-gap-name">{s.name}</span>
                        <span style={{ fontSize: "11px", color: "#8f8cac" }}>{s.reason}</span>
                      </div>
                    </div>
                    <span className={`skills-gap-badge ${s.priority}`}>
                      {s.priority === "high" ? "🔴 High" : s.priority === "medium" ? "🟡 Medium" : "🟢 Low"}
                    </span>
                  </div>
                ))}
              </div>

              <button className="skills-cta-btn" onClick={() => handleNavigate("learn")}>
                Find Courses to Bridge Gaps &nbsp;→
              </button>
            </div>
          </section>

          {/* ── Priority alert ── */}
          <div className="skills-priority-box">
            <div className="skills-priority-left">
              <span className="skills-priority-lbl">⭐ Top Priority Skill</span>
              <strong className="skills-priority-name">Deep Learning</strong>
              <p className="skills-priority-desc">
                High-demand skill for AI/ML Engineer roles. Start now to stay ahead.
              </p>
            </div>
            <button className="skills-priority-btn" onClick={() => handleNavigate("learn")}>
              Start Learning
            </button>
          </div>

          {/* ── Roadmap progress ── */}
          <section className="skills-bottom-card">
            <div className="skills-module-hdr">
              <h3 className="skills-module-title">🗺️ Learning Roadmap</h3>
              <button className="skills-module-link" onClick={() => handleNavigate("career")}>
                Full Roadmap →
              </button>
            </div>

            <div className="skills-roadmap-grid">
              {ROADMAP_STEPS.map((step) => (
                <div className={`skills-roadmap-step ${step.status}`} key={step.name}>
                  <span className={`step-status-badge ${step.status === "completed" ? "done" : step.status === "in-progress" ? "active" : "upcoming"}`}>
                    {step.status === "completed" ? "✓ Done" : step.status === "in-progress" ? "● In Progress" : "○ Upcoming"}
                  </span>
                  <span className="step-skill-name">{step.name}</span>
                  <span className="step-skill-sub">{step.sub}</span>
                  <div className="step-mini-bar-track">
                    <div className="step-mini-bar-fill" style={{ width: `${step.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

      </div>
    </div>
  );
}

export default SkillgapAnalysis;
