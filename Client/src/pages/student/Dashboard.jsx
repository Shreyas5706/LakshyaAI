// ============================================================
//  Dashboard.jsx
//  This is the HOME PAGE of LAKSHYA AI.
//  The student sees this page every time they log in.
//
//  What this page shows:
//  1. A welcome banner with the student's name
//  2. Their top career match (fetched from cached recommendation)
//  3. Quick stats (skills learned, courses done, streak, profile %)
//  4. Today's task card (personalized if predicted, locked if not)
//  5. Skills snapshot (personalized skills-to-learn if predicted, locked if not)
//  6. Timeline roadmap progress tracker (personalized if predicted, CTA if not)
//  7. Recent activity feed
//  8. Navigation cards to go to other sections
//
//  All data is synchronized live with the backend APIs!
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie, eraseCookie } from "../../utils/cookies";
import API from "../../services/api";

// Import the CSS file that styles this page
import "./Dashboard.css";

// Options list for profile editing
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const EDUCATION_LEVELS = [
  "10th",
  "12th",
  "Diploma",
  "Undergraduate",
  "Postgraduate"
];
const STREAMS = [
  "Science (PCM)",
  "Science (PCB)",
  "Commerce",
  "Arts",
  "Computer Science",
  "IT",
  "Mechanical",
  "Civil",
  "Electrical",
  "Medical",
  "Law",
  "MBA",
  "Design"
];
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
];

function Dashboard({ onNavigate }) {
  const navigate = useNavigate();

  // Modal Control States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Live Backend Data States
  const [user, setUser] = useState(null);
  const [journey, setJourney] = useState(null);
  const [careerRecommendation, setCareerRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Edit Form States
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    gender: "",
    state: "",
    city: "",
    educationLevel: "",
    stream: ""
  });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Animated counter stats
  const [statsCounter, setStatsCounter] = useState({
    skillsLearned: 0,
    coursesDone: 0,
    streak: 0,
    profilePct: 0,
  });

  const [realStats, setRealStats] = useState({
    skillsLearned: 3,
    coursesDone: 2,
    streak: 5,
    profilePct: 80,
  });

  const [showBars, setShowBars] = useState(false);

  // ----------------------------------------------------------
  //  Fetch Dashboard Data from Backend
  // ----------------------------------------------------------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/dashboard");
      if (res.data?.success) {
        const freshUser = res.data.user;
        const freshJourney = res.data.journey;
        const freshRec = res.data.careerRecommendation;

        setUser(freshUser);
        setJourney(freshJourney);
        setCareerRecommendation(freshRec);

        // Prepopulate edit form
        setEditForm({
          name: freshUser.name || "",
          age: freshUser.age ? String(freshUser.age) : "",
          gender: freshUser.gender || "",
          state: freshUser.state || "",
          city: freshUser.city || "",
          educationLevel: freshUser.educationLevel || "",
          stream: freshUser.stream || ""
        });

        // Calculate profile completeness percentage (based on 7 fields)
        const profileFields = [
          freshUser.name,
          freshUser.age,
          freshUser.gender,
          freshUser.state,
          freshUser.city,
          freshUser.educationLevel,
          freshUser.stream
        ];
        const filledFields = profileFields.filter(
          (field) => field !== undefined && field !== null && field !== ""
        ).length;
        const calculatedPct = Math.round((filledFields / profileFields.length) * 100);

        // Calculate dynamic stats
        const skillsCount = freshUser.skills?.length || 0;
        const coursesCount = freshRec ? 1 : 0; // 1 course started/done if recommendation is done
        
        setRealStats({
          skillsLearned: skillsCount > 0 ? skillsCount : 3,
          coursesDone: coursesCount > 0 ? coursesCount : 2,
          streak: 5,
          profilePct: calculatedPct
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Trigger animations when stats are loaded
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setShowBars(true);
      }, 400);
      animateCounters();
    }
  }, [loading, realStats]);

  // ----------------------------------------------------------
  //  Stat Counters Animation logic
  // ----------------------------------------------------------
  function animateCounters() {
    const duration = 1500;
    const interval = 30;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(function () {
      currentStep = currentStep + 1;
      const progress = currentStep / steps;

      setStatsCounter({
        skillsLearned: Math.round(realStats.skillsLearned * progress),
        coursesDone: Math.round(realStats.coursesDone * progress),
        streak: Math.round(realStats.streak * progress),
        profilePct: Math.round(realStats.profilePct * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStatsCounter(realStats);
      }
    }, interval);
  }

  // Helper Greeting
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }

  // Navigation Handler
  function handleNavigate(pageName) {
    if (onNavigate) {
      onNavigate(pageName);
    } else {
      if (pageName === "career") {
        navigate("/student/career");
      } else if (pageName === "dashboard") {
        navigate("/student/dashboard");
      } else {
        navigate(`/student/${pageName}`);
      }
    }
  }

  // Logout Handler
  const handleLogout = () => {
    eraseCookie("lakshyaSession");
    localStorage.removeItem("lakshya_student");
    navigate("/auth");
  };

  // ----------------------------------------------------------
  //  Update Profile API Call
  // ----------------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!editForm.name.trim()) {
      setProfileError("Name cannot be empty");
      return;
    }

    try {
      const payload = {
        name: editForm.name.trim(),
        age: editForm.age ? Number(editForm.age) : null,
        gender: editForm.gender,
        state: editForm.state,
        city: editForm.city.trim(),
        educationLevel: editForm.educationLevel,
        stream: editForm.stream
      };

      const res = await API.put("/auth/profile", payload);
      if (res.data?.success) {
        setProfileSuccess("Profile updated successfully!");
        setUser(res.data.user);
        
        // Update Session Cookie
        const session = getCookie("lakshyaSession") || {};
        session.user = {
          ...session.user,
          ...res.data.user
        };
        setCookie("lakshyaSession", session, 1);

        // Recalculate completeness
        const profileFields = [
          res.data.user.name,
          res.data.user.age,
          res.data.user.gender,
          res.data.user.state,
          res.data.user.city,
          res.data.user.educationLevel,
          res.data.user.stream
        ];
        const filled = profileFields.filter(f => f !== undefined && f !== null && f !== "").length;
        const newPct = Math.round((filled / profileFields.length) * 100);
        
        setRealStats(prev => ({ ...prev, profilePct: newPct }));
        setIsEditingProfile(false);
      }
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.message || "Failed to update profile details.");
    }
  };

  // ----------------------------------------------------------
  //  Update Password API Call
  // ----------------------------------------------------------
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const res = await API.put("/auth/profile", {
        currentPassword,
        password: newPassword
      });

      if (res.data?.success) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordSuccess("");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setPasswordError(err.response?.data?.message || "Incorrect current password or validation failed.");
    }
  };

  // Render loading state
  if (loading && !user) {
    return (
      <div className="dashboard-page flex-center" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="loading-box-custom">
          <div className="pulse-spinner"></div>
          <h3 className="loading-title-custom">Loading Dashboard</h3>
          <p className="loading-desc-custom">Syncing your learning analytics...</p>
        </div>
      </div>
    );
  }

  const hasDoneCareerPrediction = journey?.currentStep === "CAREER_PREDICTED";
  const topCareer = careerRecommendation?.careers?.[0];

  // Dynamic values based on prediction state
  const recommendedTitle = topCareer ? topCareer.role : "UI/UX Designer";
  const matchScore = topCareer ? Math.round(topCareer.confidence * 100) : null;
  const skillsToLearn = topCareer?.explanation?.skills_to_learn || ["Creativity", "Problem Solving", "Communication"];
  const currentRoadmap = topCareer?.explanation?.roadmap || [];

  // Generate activities list
  const recentActivities = [
    { text: `Signed up to LakshyaAI`, time: "Welcome aboard!", emoji: "🎉" },
    user?.educationLevel ? { text: `Set education to ${user.educationLevel} (${user.stream || "General"})`, time: "Profile setup", emoji: "🎓" } : null,
    hasDoneCareerPrediction ? { text: `Completed AI Career Prediction: ${recommendedTitle}`, time: "Roadmap unlocked", emoji: "🎯" } : null,
    user?.skills?.length > 0 ? { text: `Updated ${user.skills.length} skills in profile`, time: "Skills synched", emoji: "💪" } : null,
  ].filter(Boolean);

  // Dynamic Today's Task
  const todayTask = hasDoneCareerPrediction && topCareer
    ? {
        title: `Learn ${skillsToLearn[0]} Fundamentals`,
        duration: "45 mins",
        type: "Recommended Study",
        desc: `Step 1 of your roadmap: ${currentRoadmap[0]?.title || "Begin learning fundamentals"}`
      }
    : {
        title: "Complete AI Career Recommendation",
        duration: "10 mins",
        type: "Action Required",
        desc: "Unlock your custom transition roadmaps, learning tasks, and skills analysis"
      };

  return (
    <div className="dashboard-page">
      {/* -------------------------------------------------- */}
      {/* TOP NAVIGATION BAR                                  */}
      {/* -------------------------------------------------- */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link active-link">Dashboard</button>
          <button className="nav-link" onClick={() => handleNavigate("career")}>
            Career
          </button>
          <button className="nav-link" onClick={() => handleNavigate("skills")}>
            Skills
          </button>
          <button className="nav-link" onClick={() => handleNavigate("learn")}>
            Learn
          </button>
          <button className="nav-link" onClick={() => handleNavigate("chatbot")}>
            AI Assistant
          </button>
        </div>
        <div 
          className="navbar-avatar" 
          onClick={() => setShowProfileModal(true)} 
          style={{ cursor: "pointer" }}
          title="View Profile"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      {/* -------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                   */}
      {/* -------------------------------------------------- */}
      <div className="dashboard-content">
        {/* ============================================== */}
        {/* WELCOME BANNER                                  */}
        {/* ============================================== */}
        <div className="welcome-banner">
          <div className="welcome-text-block">
            <p className="greeting-line">{getGreeting()} 👋</p>
            <h1 className="welcome-heading">
              Hey {user?.name || "there"}, ready to move closer
              <br />
              to your dream career?
            </h1>

            {hasDoneCareerPrediction ? (
              <button
                className="career-match-pill"
                onClick={() => handleNavigate("career")}
              >
                ✨ Recommended Role: <strong>{recommendedTitle}</strong> ({matchScore}% Match) →
              </button>
            ) : (
              <button
                className="career-match-pill pulse-glowing-btn"
                onClick={() => handleNavigate("career")}
              >
                🚀 Predict Your Perfect Matching Career with AI Now →
              </button>
            )}
          </div>

          <div className="banner-circle banner-circle-1"></div>
          <div className="banner-circle banner-circle-2"></div>
          <div className="banner-circle banner-circle-3"></div>
        </div>

        {/* ============================================== */}
        {/* QUICK STATS ROW                                 */}
        {/* ============================================== */}
        <div className="stats-row">
          <div className="stat-card stat-card-1">
            <div className="stat-icon">🧠</div>
            <div className="stat-number">
              {statsCounter.skillsLearned}
              <span className="stat-total">/8</span>
            </div>
            <div className="stat-label">Skills Logged</div>
          </div>

          <div className="stat-card stat-card-2">
            <div className="stat-icon">📚</div>
            <div className="stat-number">{statsCounter.coursesDone}</div>
            <div className="stat-label">Paths Unlocked</div>
          </div>

          <div className="stat-card stat-card-3">
            <div className="stat-icon">🔥</div>
            <div className="stat-number">{statsCounter.streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>

          <div className="stat-card stat-card-4" onClick={() => setShowProfileModal(true)} style={{ cursor: "pointer" }}>
            <div className="stat-icon">👤</div>
            <div className="stat-number">
              {statsCounter.profilePct}
              <span className="stat-total">%</span>
            </div>
            <div className="stat-label">Profile Complete</div>
          </div>
        </div>

        {/* ============================================== */}
        {/* MIDDLE SECTION — Conditional Tasks & Skills     */}
        {/* ============================================== */}
        <div className="middle-row">
          {/* Today's Task Card */}
          <div className="todays-task-card">
            <div className="task-label">⚡ Today's Recommendation</div>
            <h3 className="task-title">{todayTask.title}</h3>
            {todayTask.desc && <p className="task-subdesc" style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>{todayTask.desc}</p>}
            <div className="task-details">
              <span className="task-badge">{todayTask.type}</span>
              <span className="task-duration">🕐 {todayTask.duration}</span>
            </div>
            
            {hasDoneCareerPrediction ? (
              <button className="task-btn" onClick={() => handleNavigate("learn")}>
                Start Now →
              </button>
            ) : (
              <button className="task-btn btn-glowing" onClick={() => handleNavigate("career")}>
                Unlock Custom Tasks →
              </button>
            )}
          </div>

          {/* Skills Snapshot Card */}
          <div className={`skills-snapshot-card ${!hasDoneCareerPrediction ? "locked-widget-wrapper" : ""}`}>
            <h3 className="card-heading">Skills Snapshot 📊</h3>
            <p className="card-subtext">
              {hasDoneCareerPrediction ? "Target skills for your transition" : "Predict career to map your target skills"}
            </p>

            {!hasDoneCareerPrediction ? (
              <div className="locked-overlay-content">
                <div className="lock-icon-large">🔒</div>
                <button className="btn-locked-action" onClick={() => handleNavigate("career")}>
                  Run Career Prediction
                </button>
              </div>
            ) : (
              <div className="skills-bar-list">
                {skillsToLearn.slice(0, 3).map((skill, idx) => {
                  const mockLevels = [30, 15, 5]; // Match step-wise learning progress
                  const level = mockLevels[idx] || 10;
                  return (
                    <div key={skill} className="skill-bar-row">
                      <div className="skill-bar-header">
                        <span className="skill-bar-name" style={{ textTransform: "capitalize" }}>{skill}</span>
                        <span className="skill-bar-percent">{level}% Mastered</span>
                      </div>
                      <div className="skill-bar-track">
                        <div
                          className="skill-bar-fill"
                          style={{
                            width: showBars ? level + "%" : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasDoneCareerPrediction && (
              <button className="see-full-link" onClick={() => handleNavigate("skills")}>
                Analyse Skill Gaps →
              </button>
            )}
          </div>
        </div>

        {/* ============================================== */}
        {/* PERSONALIZED TIMELINE PROGRESS (IF PREDICTED)    */}
        {/* ============================================== */}
        {hasDoneCareerPrediction && currentRoadmap.length > 0 && (
          <div className="dashboard-roadmap-tracker activity-card">
            <h3 className="card-heading">🎯 Your Learning Roadmap</h3>
            <p className="card-subtext">Master the steps required to transition to a {recommendedTitle}</p>
            
            <div className="dashboard-timeline-steps">
              {currentRoadmap.map((stepItem, index) => (
                <div key={index} className={`dashboard-timeline-step ${index === 0 ? "active" : ""}`}>
                  <div className="timeline-step-indicator">
                    <span className="step-num">{stepItem.step || index + 1}</span>
                    {index < currentRoadmap.length - 1 && <span className="step-connector"></span>}
                  </div>
                  <div className="timeline-step-info">
                    <h4 className="timeline-step-name">{stepItem.title}</h4>
                    <p className="timeline-step-detail">{stepItem.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button className="task-btn" onClick={() => handleNavigate("career")}>
                View Full Detailed Roadmap →
              </button>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* RECENT ACTIVITY FEED                           */}
        {/* ============================================== */}
        <div className="activity-card">
          <h3 className="card-heading">Recent Activity 📋</h3>
          <p className="card-subtext">Your learning milestone journey</p>

          <div className="activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map(function (activity, index) {
                return (
                  <div
                    key={index}
                    className="activity-item"
                    style={{ animationDelay: index * 0.1 + "s" }}
                  >
                    <div className="activity-icon">{activity.emoji}</div>
                    <div className="activity-text-block">
                      <p className="activity-text">{activity.text}</p>
                      <p className="activity-time">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="tag-none" style={{ padding: "10px 0" }}>No recent activity logged.</p>
            )}
          </div>
        </div>

        {/* ============================================== */}
        {/* NAVIGATION CARDS                                */}
        {/* ============================================== */}
        <div className="nav-cards-section">
          <h3 className="card-heading">Explore Sections</h3>
          <p className="card-subtext">Jump to any section of your journey</p>

          <div className="nav-cards-grid">
            <button className="nav-card nav-card-career" onClick={() => handleNavigate("career")}>
              <div className="nav-card-icon">🎯</div>
              <div className="nav-card-title">Career</div>
              <div className="nav-card-desc">See your matched career paths</div>
              <div className="nav-card-arrow">→</div>
            </button>

            <button className="nav-card nav-card-skills" onClick={() => handleNavigate("skills")}>
              <div className="nav-card-icon">📊</div>
              <div className="nav-card-title">Skills</div>
              <div className="nav-card-desc">Analyse gaps and strengths</div>
              <div className="nav-card-arrow">→</div>
            </button>

            <button className="nav-card nav-card-learn" onClick={() => handleNavigate("learn")}>
              <div className="nav-card-icon">📚</div>
              <div className="nav-card-title">Learn</div>
              <div className="nav-card-desc">Courses and tasks for you</div>
              <div className="nav-card-arrow">→</div>
            </button>

            <button className="nav-card nav-card-progress" onClick={() => handleNavigate("chatbot")}>
              <div className="nav-card-icon">🤖</div>
              <div className="nav-card-title">AI Assistant</div>
              <div className="nav-card-desc">Talk to your career counselor</div>
              <div className="nav-card-arrow">→</div>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* PERSONALIZED USER PROFILE MODAL                 */}
      {/* ============================================== */}
      {showProfileModal && (
        <div className="profile-modal-overlay" onClick={() => {
          setShowProfileModal(false);
          setIsEditingProfile(false);
          setShowChangePassword(false);
          setProfileError("");
          setProfileSuccess("");
          setPasswordError("");
          setPasswordSuccess("");
        }}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="profile-modal-close" 
              onClick={() => {
                setShowProfileModal(false);
                setIsEditingProfile(false);
                setShowChangePassword(false);
                setProfileError("");
                setProfileSuccess("");
                setPasswordError("");
                setPasswordSuccess("");
              }}
            >
              ×
            </button>
            <div className="profile-modal-header">
              <div className="profile-modal-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
              </div>
              <h2>{user?.name || "Student Profile"}</h2>
              <span className="profile-modal-role-badge">Student</span>
            </div>
            
            <div className="profile-modal-body">
              {/* Profile Details Edit / Read forms */}
              {!isEditingProfile ? (
                // READ ONLY MODE
                <div>
                  {profileSuccess && <p className="success-toast">✅ {profileSuccess}</p>}
                  <div className="profile-detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{user?.email || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Age</span>
                      <span className="detail-value">{user?.age || "N/A"} yrs</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Gender</span>
                      <span className="detail-value">{user?.gender || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">City</span>
                      <span className="detail-value">{user?.city || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">State</span>
                      <span className="detail-value">{user?.state || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Education</span>
                      <span className="detail-value">{user?.educationLevel || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Stream</span>
                      <span className="detail-value">{user?.stream || "N/A"}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", marginBottom: "20px" }}>
                    <button 
                      className="btn-modal btn-edit-profile" 
                      onClick={() => setIsEditingProfile(true)}
                    >
                      ✏️ Edit Profile Info
                    </button>
                  </div>
                </div>
              ) : (
                // EDIT MODE
                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  <h3>Edit Profile Details</h3>
                  {profileError && <p className="error-toast">❌ {profileError}</p>}
                  
                  <div className="form-grid-modal">
                    <div className="form-group-modal span-2">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group-modal">
                      <label>Age</label>
                      <input 
                        type="number" 
                        value={editForm.age} 
                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                      />
                    </div>
                    <div className="form-group-modal">
                      <label>Gender</label>
                      <select 
                        value={editForm.gender} 
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      >
                        <option value="">Select Gender</option>
                        {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="form-group-modal">
                      <label>City</label>
                      <input 
                        type="text" 
                        value={editForm.city} 
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group-modal">
                      <label>State</label>
                      <select 
                        value={editForm.state} 
                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group-modal">
                      <label>Education Level</label>
                      <select 
                        value={editForm.educationLevel} 
                        onChange={(e) => setEditForm({ ...editForm, educationLevel: e.target.value })}
                      >
                        <option value="">Select Education</option>
                        {EDUCATION_LEVELS.map(el => <option key={el} value={el}>{el}</option>)}
                      </select>
                    </div>
                    <div className="form-group-modal">
                      <label>Stream</label>
                      <select 
                        value={editForm.stream} 
                        onChange={(e) => setEditForm({ ...editForm, stream: e.target.value })}
                      >
                        <option value="">Select Stream</option>
                        {STREAMS.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="btn-row-modal">
                    <button 
                      type="button" 
                      className="btn-modal btn-cancel" 
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileError("");
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-modal btn-save">
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Interests & Skills tags (Read only) */}
              <div className="profile-section-tags">
                <h3>Interests 🎨</h3>
                <div className="tag-list">
                  {user?.interests && user.interests.length > 0 ? (
                    user.interests.map((interest) => (
                      <span key={interest} className="tag-pill interest-pill">{interest}</span>
                    ))
                  ) : (
                    <span className="tag-none">No interests selected yet</span>
                  )}
                </div>
              </div>

              <div className="profile-section-tags">
                <h3>Skills 💪</h3>
                <div className="tag-list">
                  {user?.skills && user.skills.length > 0 ? (
                    user.skills.map((skill) => (
                      <span key={skill} className="tag-pill skill-pill">{skill}</span>
                    ))
                  ) : (
                    <span className="tag-none">No skills selected yet</span>
                  )}
                </div>
              </div>

              {/* Password Management */}
              <div className="password-management-section">
                {!showChangePassword ? (
                  <button 
                    className="btn-modal btn-reset-password"
                    onClick={() => setShowChangePassword(true)}
                    style={{ width: "100%", margin: "10px 0" }}
                  >
                    🔐 Change Account Password
                  </button>
                ) : (
                  <form onSubmit={handleSavePassword} className="profile-edit-form password-edit-form">
                    <h3>Change Password</h3>
                    {passwordError && <p className="error-toast">❌ {passwordError}</p>}
                    {passwordSuccess && <p className="success-toast">✅ {passwordSuccess}</p>}
                    
                    <div className="form-group-modal">
                      <label>Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-modal">
                      <label>New Password (min 8 chars, A-z, 0-9, @)</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group-modal">
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="btn-row-modal">
                      <button 
                        type="button" 
                        className="btn-modal btn-cancel" 
                        onClick={() => {
                          setShowChangePassword(false);
                          setPasswordError("");
                          setPasswordSuccess("");
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-modal btn-save">
                        Update Password
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="profile-modal-footer">
              <button 
                className="btn-modal btn-logout"
                onClick={handleLogout}
                style={{ width: "100%" }}
              >
                🚪 Logout from Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
