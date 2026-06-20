import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Courses.css";

function CollegeRecommendation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => {
      if (res.data?.success) {
        setUser(res.data.user);
      }
    }).catch(err => console.log(err));
  }, []);

  return (
    <div className="courses-page">
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate("/student/career")}>Career</button>
          <button className="nav-link" onClick={() => navigate("/student/skills")}>Skills</button>
          <button className="nav-link" onClick={() => navigate("/student/learn")}>Learn</button>
          <button className="nav-link" onClick={() => navigate("/student/chatbot")}>AI Assistant</button>
        </div>
        <div className="navbar-avatar" onClick={() => navigate("/student/dashboard")} style={{ cursor: "pointer" }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      <div className="courses-content">
        <div className="courses-header-section welcome-banner" style={{ minHeight: "auto", padding: "30px 40px" }}>
          <div className="welcome-text-block">
            <h1 className="welcome-heading" style={{ margin: "0 0 10px 0", fontSize: "26px" }}>
              College Recommendations 🏛️
            </h1>
            <p className="greeting-line" style={{ opacity: 0.9 }}>
              Find the top institutes and courses tailored to your background, budget, and learning preferences.
            </p>
          </div>
        </div>

        <div className="no-courses-placeholder">
          <span className="no-courses-icon">🎓</span>
          <h3>College Recommendations Coming Soon</h3>
          <p>We are currently integrating the College Recommendations pipeline. Soon you'll be able to compare government and private colleges based on cut-offs and placement stats!</p>
          <button className="btn-primary-custom" onClick={() => navigate("/student/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollegeRecommendation;
