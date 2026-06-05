import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Courses.css"; // Reuse general navbar and theme layout

function SkillgapAnalysis() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => {
      if (res.data?.success) {
        setUser(res.data.user);
      }
    }).catch(err => console.log(err));
  }, []);

  const loggedSkills = user?.skills || ["Communication", "Problem Solving", "Creativity"];
  const targetSkills = ["Advanced Logic", "System Design", "Cloud Infrastructure", "Database Tuning"];

  return (
    <div className="courses-page">
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate("/student/career")}>Career</button>
          <button className="nav-link active-link" onClick={() => navigate("/student/skills")}>Skills</button>
          <button className="nav-link" onClick={() => navigate("/student/learn")}>Learn</button>
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Progress</button>
        </div>
        <div className="navbar-avatar" onClick={() => navigate("/student/dashboard")} style={{ cursor: "pointer" }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      <div className="courses-content" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        <div className="courses-header-section welcome-banner" style={{ minHeight: "auto", padding: "30px 40px" }}>
          <div className="welcome-text-block">
            <h1 className="welcome-heading" style={{ margin: "0 0 10px 0", fontSize: "26px" }}>
              Skills Gap Analysis 📊
            </h1>
            <p className="greeting-line" style={{ opacity: 0.9 }}>
              Compare your current skill level against the skills required for your target career paths.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }} className="filters-container-wrapper">
          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px" }}>💪 Your Current Skills</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {loggedSkills.map((s, idx) => (
                <div key={s} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span>{s}</span>
                    <span>{80 - idx * 10}%</span>
                  </div>
                  <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${80 - idx * 10}%`, background: "linear-gradient(90deg, #2563eb, #3b82f6)" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "20px", background: "#fdf2f8", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px", color: "#be185d" }}>🎯 Target Skills to Learn</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {targetSkills.map((s) => (
                <span 
                  key={s} 
                  style={{ background: "white", border: "1px solid #fbcfe8", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "500", color: "#be185d" }}
                >
                  ➕ {s}
                </span>
              ))}
            </div>
            <button 
              className="task-btn" 
              onClick={() => navigate("/student/learn")}
              style={{ marginTop: "30px", width: "100%", background: "#be185d" }}
            >
              Find Courses to Bridge Gaps →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillgapAnalysis;
