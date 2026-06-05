import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Courses.css";

function Profile() {
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
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Progress</button>
        </div>
        <div className="navbar-avatar" onClick={() => navigate("/student/dashboard")} style={{ cursor: "pointer" }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      <div className="courses-content">
        <div className="no-courses-placeholder">
          <span className="no-courses-icon">👤</span>
          <h3>User Profile Detail View</h3>
          <p>Please access your student profile directly from the avatar circle in the top right of your Dashboard to edit details or reset passwords!</p>
          <button className="btn-primary-custom" onClick={() => navigate("/student/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
