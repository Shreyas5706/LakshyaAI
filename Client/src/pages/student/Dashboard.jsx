import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie, eraseCookie } from "../../utils/cookies";
import API from "../../services/api";
import logo from "../../assets/Logo.png";
import chatbotImg from "../../assets/Chatbot.png";
import explorerImg from "../../assets/Explorer.png";
import "./Dashboard.css";

// Options list for profile editing
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const EDUCATION_LEVELS = ["10th", "12th", "Diploma", "Undergraduate", "Postgraduate"];
const STREAMS = [
  "Science (PCM)", "Science (PCB)", "Commerce", "Arts", "Computer Science",
  "IT", "Mechanical", "Civil", "Electrical", "Medical", "Law", "MBA", "Design"
];
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
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
    name: "", age: "", gender: "", state: "", city: "", educationLevel: "", stream: ""
  });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Tasks checkboxes state
  const [tasksChecked, setTasksChecked] = useState([false, false, false, false]);

  // ----------------------------------------------------------
  //  Fetch Dashboard Data from Backend
  // ----------------------------------------------------------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/dashboard");
      if (res.data?.success) {
        const freshUser = res.data.user;
        setUser(freshUser);
        setJourney(res.data.journey);
        setCareerRecommendation(res.data.careerRecommendation);

        // Prepopulate edit form
        setEditForm({
          name: freshUser.name || "",
          age: freshUser.age ? String(freshUser.age) : "",
          gender: freshUser.gender || "",
          state: freshUser.state || "",
          city: freshUser.city || "",
          educationLevel: freshUser.educationLevel || "",
          stream: freshUser.stream || "",
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleNavigate = (pageName) => {
    if (onNavigate) {
      onNavigate(pageName);
    } else {
      if (pageName === "dashboard") navigate("/student/dashboard");
      else navigate(`/student/${pageName}`);
    }
  };

  const handleLogout = () => {
    eraseCookie("lakshyaSession");
    localStorage.removeItem("lakshya_student");
    navigate("/auth");
  };

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
        stream: editForm.stream,
      };

      const res = await API.put("/auth/profile", payload);
      if (res.data?.success) {
        setProfileSuccess("Profile updated successfully!");
        setUser(res.data.user);

        // Update Session Cookie
        const session = getCookie("lakshyaSession") || {};
        session.user = { ...session.user, ...res.data.user };
        setCookie("lakshyaSession", session, 1);
        setIsEditingProfile(false);
      }
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.message || "Failed to update profile details.");
    }
  };

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
      const res = await API.put("/auth/profile", { currentPassword, password: newPassword });
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
      setPasswordError(err.response?.data?.message || "Incorrect current password.");
    }
  };

  const toggleTask = (index) => {
    const updated = [...tasksChecked];
    updated[index] = !updated[index];
    setTasksChecked(updated);
  };

  if (loading && !user) {
    return (
      <div className="dashboard-loading-box">
        <div className="pulse-spinner"></div>
        <h3 className="loading-title-custom">Syncing Dashboard...</h3>
      </div>
    );
  }

  // Dynamic names
  const studentName = user?.name || "Diya";
  const targetCareer = careerRecommendation?.careers?.[0]?.role || "AI/ML Engineer";

  return (
    <div className="student-dashboard-root">

      {/* ========================================================
          SIDEBAR NAVIGATION (left side matching reference)
         ======================================================== */}
      <aside className="db-sidebar">
        <div className="sidebar-brand-block">
          <img src={logo} className="sidebar-logo-img" alt="Logo" />
          <span className="sidebar-brand-txt">LAKSHYA AI</span>
        </div>

        <div className="sidebar-menu">
          <span className="menu-group-label">Menu</span>
          <button className="sidebar-menu-btn active" onClick={() => handleNavigate("dashboard")}>
            <span className="btn-icon">🏠</span> Dashboard
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("career")}>
            <span className="btn-icon">🎯</span> Career
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("skills")}>
            <span className="btn-icon">📊</span> Skills
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("learn")}>
            <span className="btn-icon">📚</span> Learn
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("assessments")}>
            <span className="btn-icon">📝</span> Assessments
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("resume")}>
            <span className="btn-icon">📄</span> Resume Builder
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("applications")}>
            <span className="btn-icon">💼</span> Applications
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("mentorship")}>
            <span className="btn-icon">👥</span> Mentorship
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("ai-assistant")}>
            <span className="btn-icon">🤖</span> AI Assistant
          </button>

          <span className="menu-group-label" style={{ marginTop: "20px" }}>Shortcuts</span>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("career")}>
            <span className="btn-icon">➔</span> Roadmap
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("learn")}>
            <span className="btn-icon">➔</span> My Courses
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("learn")}>
            <span className="btn-icon">➔</span> Saved Resources
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("skills")}>
            <span className="btn-icon">➔</span> Skill Gap
          </button>
          <button className="sidebar-menu-btn" onClick={() => handleNavigate("career")}>
            <span className="btn-icon">➔</span> Career Insights
          </button>
        </div>

        {/* Upgrade to Pro Card */}
        <div className="sidebar-promo-card">
          <span className="promo-crown">👑</span>
          <h4>Upgrade to Pro</h4>
          <p>Unlock advanced AI insights, premium roadmaps & more.</p>
          <button className="promo-btn" onClick={() => handleNavigate("pricing")}>
            Upgrade Now &nbsp;➔
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT PANEL (right side)
         ======================================================== */}
      <main className="db-main">

        {/* TOP NAVBAR HEADER */}
        <header className="db-header">
          <div className="header-search-bar">
            <span className="search-glass">🔍</span>
            <input type="text" placeholder="Search skills, courses, careers..." />
            <kbd className="search-kbd">⌘ K</kbd>
          </div>

          <div className="header-right-tools">
            <button className="tool-icon-btn notification-bell" title="Notifications">
              🔔
              <span className="bell-badge">3</span>
            </button>
            <button className="tool-icon-btn" title="Calendar" onClick={() => handleNavigate("learn")}>
              📅
            </button>
            <div
              className="user-profile-widget"
              onClick={() => setShowProfileModal(true)}
              title="Profile Options"
            >
              <div className="user-avatar-circle">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info-text">
                <span className="user-name">{studentName} Sharma</span>
                <span className="user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        <div className="db-content-scroller">

          {/* ==============================================
              WELCOME BANNER WITH MASCOT & METADATA
             ============================================== */}
          <section className="welcome-banner-scene">
            <div className="welcome-banner-left">
              <span className="banner-salutation">{getGreeting()}, {studentName}! 👋</span>
              <h2 className="banner-title-text">Keep learning, keep growing.</h2>
              <p className="banner-subtitle-text">
                You are on the right path to becoming an <strong className="role-hl">{targetCareer}</strong>
              </p>
              <button className="banner-cta-btn" onClick={() => handleNavigate("career")}>
                View Career Roadmap &nbsp;➔
              </button>
            </div>

            {/* Career readiness progress wheel */}
            <div className="readiness-meter-box">
              <span className="meter-label">Career Readiness</span>
              <div className="radial-meter-outer">
                <svg width="86" height="86" viewBox="0 0 36 36">
                  <path className="meter-track" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" />
                  <path className="meter-fill" strokeDasharray="78, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffffff" strokeWidth="3.5" />
                </svg>
                <div className="meter-pct-text">78%</div>
              </div>
              <span className="meter-details">You are ahead of <strong>65%</strong> of students</span>
            </div>

            {/* Mascot visual overlay */}
            <div className="banner-mascot-wrap">
              <img src={explorerImg} className="banner-mascot-img" alt="Explorer mascot" />
            </div>

            {/* AI Mentor Speech bubble */}
            <div className="mentor-speech-overlay">
              <div className="mentor-speech-lbl">✦ AI Mentor Says</div>
              <p className="mentor-speech-quote">
                "You're making great progress! Focus on Deep Learning next."
              </p>
            </div>
          </section>

          {/* ==============================================
              CAREER SNAPSHOT SNAP ROW (4 mini widget cards)
             ============================================== */}
          <section className="snapshot-cards-row">
            {/* Snapshot Card 1 */}
            <div className="snapshot-card">
              <span className="snap-icon-circle c-purple">🎯</span>
              <div>
                <span className="snap-lbl">Target Career</span>
                <h4 className="snap-val">{targetCareer}</h4>
                <button className="snap-link" onClick={() => handleNavigate("career")}>Change Goal</button>
              </div>
            </div>

            {/* Snapshot Card 2 */}
            <div className="snapshot-card">
              <span className="snap-icon-circle c-green">🧠</span>
              <div>
                <span className="snap-lbl">Current Skills</span>
                <h4 className="snap-val">18 Skills</h4>
                <button className="snap-link" onClick={() => handleNavigate("skills")}>View Skills</button>
              </div>
            </div>

            {/* Snapshot Card 3 */}
            <div className="snapshot-card">
              <span className="snap-icon-circle c-red">🔍</span>
              <div>
                <span className="snap-lbl">Missing Skills</span>
                <h4 className="snap-val">7 Skills</h4>
                <button className="snap-link" onClick={() => handleNavigate("skills")}>View Gap</button>
              </div>
            </div>

            {/* Snapshot Card 4 */}
            <div className="snapshot-card">
              <span className="snap-icon-circle c-orange">🔥</span>
              <div>
                <span className="snap-lbl">Learning Streak</span>
                <h4 className="snap-val">24 Days</h4>
                <button className="snap-link" onClick={() => handleNavigate("learn")}>Keep Going! 🔥</button>
              </div>
            </div>
          </section>

          {/* ==============================================
              MIDDLE ROW METRICS (3 detailed column modules)
             ============================================== */}
          <section className="dashboard-grid-middle">

            {/* Module 1: Your Career Roadmap */}
            <div className="grid-module-card">
              <h3 className="module-title">Your Career Roadmap</h3>

              <div className="roadmap-step-timeline">
                {/* Step 1 */}
                <div className="timeline-step-item completed">
                  <div className="timeline-dot-wrap">
                    <span className="dot-icon">✓</span>
                    <span className="dot-line" />
                  </div>
                  <div className="step-info-block">
                    <span className="step-title">Python Basics</span>
                    <span className="step-pct">100%</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="timeline-step-item completed">
                  <div className="timeline-dot-wrap">
                    <span className="dot-icon">✓</span>
                    <span className="dot-line" />
                  </div>
                  <div className="step-info-block">
                    <span className="step-title">Data Analysis with Python</span>
                    <span className="step-pct">100%</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="timeline-step-item completed">
                  <div className="timeline-dot-wrap">
                    <span className="dot-icon">✓</span>
                    <span className="dot-line" />
                  </div>
                  <div className="step-info-block">
                    <span className="step-title">Machine Learning Basics</span>
                    <span className="step-pct">100%</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="timeline-step-item active">
                  <div className="timeline-dot-wrap">
                    <span className="dot-icon-active" />
                    <span className="dot-line" />
                  </div>
                  <div className="step-info-block">
                    <span className="step-title font-bold">Deep Learning</span>
                    <span className="step-pct font-bold color-purple">60%</span>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="timeline-step-item upcoming">
                  <div className="timeline-dot-wrap">
                    <span className="dot-icon-upcoming" />
                    <span className="dot-line" />
                  </div>
                  <div className="step-info-block">
                    <span className="step-title">MLOps</span>
                    <span className="step-pct">Upcoming</span>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="timeline-step-item upcoming">
                  <div className="timeline-dot-wrap">
                    <span className="dot-icon-upcoming" />
                  </div>
                  <div className="step-info-block">
                    <span className="step-title">Generative AI</span>
                    <span className="step-pct">Upcoming</span>
                  </div>
                </div>
              </div>

              <button className="module-footer-btn" onClick={() => handleNavigate("career")}>
                View Full Roadmap
              </button>
            </div>

            {/* Module 2: Skill Gap Analysis */}
            <div className="grid-module-card">
              <div className="module-header-row">
                <h3 className="module-title">Skill Gap Analysis</h3>
                <button className="module-header-link" onClick={() => handleNavigate("skills")}>View Full Report →</button>
              </div>

              <div className="skill-gap-data-layout">
                {/* Left: Your Current Skills progress bar lists */}
                <div className="skills-progress-list">
                  <span className="sg-section-lbl">Your Current Skills</span>

                  <div className="sg-bar-row">
                    <div className="sg-bar-hdr">
                      <span>Python</span>
                      <strong>90%</strong>
                    </div>
                    <div className="sg-bar-track"><div className="sg-bar-fill" style={{ width: "90%" }} /></div>
                  </div>

                  <div className="sg-bar-row">
                    <div className="sg-bar-hdr">
                      <span>JavaScript</span>
                      <strong>75%</strong>
                    </div>
                    <div className="sg-bar-track"><div className="sg-bar-fill" style={{ width: "75%" }} /></div>
                  </div>

                  <div className="sg-bar-row">
                    <div className="sg-bar-hdr">
                      <span>SQL</span>
                      <strong>80%</strong>
                    </div>
                    <div className="sg-bar-track"><div className="sg-bar-fill" style={{ width: "80%" }} /></div>
                  </div>

                  <div className="sg-bar-row">
                    <div className="sg-bar-hdr">
                      <span>Data Analysis</span>
                      <strong>70%</strong>
                    </div>
                    <div className="sg-bar-track"><div className="sg-bar-fill" style={{ width: "70%" }} /></div>
                  </div>

                  <div className="sg-bar-row">
                    <div className="sg-bar-hdr">
                      <span>Machine Learning</span>
                      <strong>60%</strong>
                    </div>
                    <div className="sg-bar-track"><div className="sg-bar-fill" style={{ width: "60%" }} /></div>
                  </div>

                  <div className="sg-bar-row">
                    <div className="sg-bar-hdr">
                      <span>Statistics</span>
                      <strong>65%</strong>
                    </div>
                    <div className="sg-bar-track"><div className="sg-bar-fill" style={{ width: "65%" }} /></div>
                  </div>
                </div>

                {/* Right: Recommended skills capsule tags */}
                <div className="skills-recommendations-list">
                  <span className="sg-section-lbl">Recommended Skills</span>
                  <div className="sg-tags-cloud">
                    <span className="sg-rec-tag active">Deep Learning</span>
                    <span className="sg-rec-tag">TensorFlow</span>
                    <span className="sg-rec-tag">PyTorch</span>
                    <span className="sg-rec-tag">MLOps</span>
                    <span className="sg-rec-tag">Docker</span>
                    <span className="sg-rec-tag">AWS</span>
                  </div>
                </div>
              </div>

              {/* Top Priority Highlight Box */}
              <div className="sg-priority-alert">
                <div className="sg-alert-left">
                  <div className="alert-badge-lbl">⭐ Top Priority</div>
                  <strong className="alert-skill-name">Deep Learning</strong>
                  <p className="alert-desc-txt">High demand skill for AI/ML Engineer roles.</p>
                </div>
                <button className="sg-alert-btn" onClick={() => handleNavigate("learn")}>
                  Start Learning
                </button>
              </div>
            </div>

            {/* Module 3: AI Insights & Resume Score */}
            <div className="insights-double-module">

              {/* Card A: AI Career Insights */}
              <div className="grid-module-card min-height-half">
                <h3 className="module-title">AI Career Insights</h3>

                <div className="insights-stats-grid">
                  <div className="insight-stat-item">
                    <span className="insight-lbl">Average Salary</span>
                    <div className="insight-val">₹14 - 26 LPA</div>
                    <span className="insight-subdesc">For AI/ML Engineers in India</span>
                    <div className="insight-chart-spark">
                      <svg viewBox="0 0 100 30" width="100%" height="24">
                        <path d="M0,25 Q15,10 30,22 T60,5 T90,18" fill="none" stroke="#a3a3ff" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>

                  <div className="insight-stat-item">
                    <span className="insight-lbl">Job Demand</span>
                    <div className="insight-val color-green">+38%</div>
                    <span className="insight-subdesc">Growth in AI/ML Jobs</span>
                    <div className="insight-chart-spark bars-layout">
                      <span className="bar-spark-item h-20" />
                      <span className="bar-spark-item h-40" />
                      <span className="bar-spark-item h-60" />
                      <span className="bar-spark-item h-50" />
                      <span className="bar-spark-item h-90 active" />
                    </div>
                  </div>
                </div>

                <div className="hiring-companies-block">
                  <span className="hiring-lbl">Top Hiring Companies</span>
                  <div className="companies-row">
                    <span className="company-logo g-col">G</span>
                    <span className="company-logo ms-col">ms</span>
                    <span className="company-logo oa-col">oA</span>
                    <span className="company-logo nv-col">nv</span>
                    <button className="hiring-view-all-btn" onClick={() => handleNavigate("career")}>View All →</button>
                  </div>
                </div>
              </div>

              {/* Card B: Resume Score card */}
              <div className="grid-module-card min-height-half">
                <h3 className="module-title">Resume Score</h3>

                <div className="resume-score-layout">
                  <div className="resume-score-wheel">
                    <svg width="68" height="68" viewBox="0 0 36 36">
                      <path className="wheel-track" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <path className="wheel-fill" strokeDasharray="82, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#564877" strokeWidth="3" />
                    </svg>
                    <div className="wheel-text">82<span className="wheel-total">/100</span></div>
                  </div>

                  <div className="resume-score-feedback">
                    <strong className="score-desc-txt">Great Progress! 🚀</strong>
                    <span className="score-sub-txt">Improve your resume strength to attract top employers.</span>
                  </div>
                </div>

                <div className="resume-suggestions-list">
                  <div className="suggestion-item">
                    <span className="sug-bullet">•</span>
                    <span className="sug-txt">Add more projects</span>
                    <strong className="sug-score-up color-green">+10</strong>
                  </div>
                  <div className="suggestion-item">
                    <span className="sug-bullet">•</span>
                    <span className="sug-txt">Add certifications</span>
                    <strong className="sug-score-up color-green">+5</strong>
                  </div>
                  <div className="suggestion-item">
                    <span className="sug-bullet">•</span>
                    <span className="sug-txt">Improve skills section</span>
                    <strong className="sug-score-up color-green">+3</strong>
                  </div>
                </div>

                <button className="resume-improve-btn" onClick={() => handleNavigate("resume")}>
                  Improve Resume
                </button>
              </div>

            </div>

          </section>

          {/* ==============================================
              RECOMMENDED FOR YOU (course cards slider)
             ============================================== */}
          <section className="courses-slider-section">
            <div className="section-header-row">
              <h3 className="section-heading">Recommended for You</h3>
              <button className="section-action-btn" onClick={() => handleNavigate("learn")}>View All Courses →</button>
            </div>

            <div className="courses-slider-container">
              {/* Course Card 1 */}
              <div className="slider-course-card" onClick={() => handleNavigate("learn")}>
                <div className="card-top-bg c-bg-1" />
                <div className="slider-card-body">
                  <span className="c-platform-lbl c-coursera">coursera</span>
                  <h4 className="c-title">Machine Learning Fundamentals</h4>
                  <span className="c-author">Andrew Ng</span>
                  <div className="c-ratings-meta">
                    <span className="star">★</span> 4.8 <span className="reviews">(12.4K)</span>
                  </div>
                  <div className="slider-card-footer">
                    <span className="c-difficulty">Beginner</span>
                    <button className="c-enroll-btn">Enroll Now</button>
                  </div>
                </div>
              </div>

              {/* Course Card 2 */}
              <div className="slider-course-card" onClick={() => handleNavigate("learn")}>
                <div className="card-top-bg c-bg-2" />
                <div className="slider-card-body">
                  <span className="c-platform-lbl c-udemy">udemy</span>
                  <h4 className="c-title">AWS Cloud Practitioner</h4>
                  <span className="c-author">Stephane Maarek</span>
                  <div className="c-ratings-meta">
                    <span className="star">★</span> 4.7 <span className="reviews">(9.1K)</span>
                  </div>
                  <div className="slider-card-footer">
                    <span className="c-difficulty">Beginner</span>
                    <button className="c-enroll-btn">Enroll Now</button>
                  </div>
                </div>
              </div>

              {/* Course Card 3 */}
              <div className="slider-course-card" onClick={() => handleNavigate("learn")}>
                <div className="card-top-bg c-bg-3" />
                <div className="slider-card-body">
                  <span className="c-platform-lbl c-coursera">coursera</span>
                  <h4 className="c-title">Deep Learning Specialization</h4>
                  <span className="c-author">Deeplearning.AI</span>
                  <div className="c-ratings-meta">
                    <span className="star">★</span> 4.9 <span className="reviews">(18.7K)</span>
                  </div>
                  <div className="slider-card-footer">
                    <span className="c-difficulty">Intermediate</span>
                    <button className="c-enroll-btn">Enroll Now</button>
                  </div>
                </div>
              </div>

              {/* Course Card 4 */}
              <div className="slider-course-card" onClick={() => handleNavigate("learn")}>
                <div className="card-top-bg c-bg-4" />
                <div className="slider-card-body">
                  <span className="c-platform-lbl c-edx">edX</span>
                  <h4 className="c-title">Data Science Program</h4>
                  <span className="c-author">IBM</span>
                  <div className="c-ratings-meta">
                    <span className="star">★</span> 4.6 <span className="reviews">(7.8K)</span>
                  </div>
                  <div className="slider-card-footer">
                    <span className="c-difficulty">Intermediate</span>
                    <button className="c-enroll-btn">Enroll Now</button>
                  </div>
                </div>
              </div>

              {/* Course Card 5 */}
              <div className="slider-course-card" onClick={() => handleNavigate("learn")}>
                <div className="card-top-bg c-bg-5" />
                <div className="slider-card-body">
                  <span className="c-platform-lbl c-udemy">udemy</span>
                  <h4 className="c-title">Docker & Kubernetes Mastery</h4>
                  <span className="c-author">TechWorld with Nana</span>
                  <div className="c-ratings-meta">
                    <span className="star">★</span> 4.7 <span className="reviews">(6.3K)</span>
                  </div>
                  <div className="slider-card-footer">
                    <span className="c-difficulty">Intermediate</span>
                    <button className="c-enroll-btn">Enroll Now</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==============================================
              BOTTOM LAYOUT (application tracker & checklists)
             ============================================== */}
          <section className="dashboard-grid-bottom">

            {/* Column A: Application Tracker */}
            <div className="grid-module-card flex-2">
              <h3 className="module-title" style={{ marginBottom: "15px" }}>Application Tracker</h3>

              <div className="tracker-kanban-board">
                {/* Column 1: Wishlist */}
                <div className="kanban-col">
                  <div className="kanban-hdr">
                    <span className="kanban-dot c-purple" />
                    <span>Wishlist (12)</span>
                  </div>
                  <div className="kanban-cards-list">
                    <div className="kanban-card-item">
                      <span className="kb-comp">Google</span>
                      <span className="kb-role">AI Engineer</span>
                    </div>
                    <div className="kanban-card-item">
                      <span className="kb-comp">Microsoft</span>
                      <span className="kb-role">ML Engineer</span>
                    </div>
                  </div>
                  <button className="kanban-view-all" onClick={() => handleNavigate("applications")}>View All</button>
                </div>

                {/* Column 2: Applied */}
                <div className="kanban-col">
                  <div className="kanban-hdr">
                    <span className="kanban-dot c-blue" />
                    <span>Applied (8)</span>
                  </div>
                  <div className="kanban-cards-list">
                    <div className="kanban-card-item">
                      <span className="kb-comp">Amazon</span>
                      <span className="kb-role">Data Scientist</span>
                    </div>
                    <div className="kanban-card-item">
                      <span className="kb-comp">Adobe</span>
                      <span className="kb-role">ML Engineer</span>
                    </div>
                  </div>
                  <button className="kanban-view-all" onClick={() => handleNavigate("applications")}>View All</button>
                </div>

                {/* Column 3: Interview */}
                <div className="kanban-col">
                  <div className="kanban-hdr">
                    <span className="kanban-dot c-orange" />
                    <span>Interview (3)</span>
                  </div>
                  <div className="kanban-cards-list">
                    <div className="kanban-card-item">
                      <span className="kb-comp">TCS</span>
                      <span className="kb-role">Data Analyst</span>
                    </div>
                    <div className="kanban-card-item">
                      <span className="kb-comp">Infosys</span>
                      <span className="kb-role">AI Engineer</span>
                    </div>
                  </div>
                  <button className="kanban-view-all" onClick={() => handleNavigate("applications")}>View All</button>
                </div>

                {/* Column 4: Offer */}
                <div className="kanban-col">
                  <div className="kanban-hdr">
                    <span className="kanban-dot c-green" />
                    <span>Offer (1)</span>
                  </div>
                  <div className="kanban-cards-list">
                    <div className="kanban-card-item offer-card">
                      <span className="kb-comp">NVIDIA</span>
                      <span className="kb-role">AI Research Engineer</span>
                    </div>
                  </div>
                  <button className="kanban-view-all" onClick={() => handleNavigate("applications")}>View All</button>
                </div>
              </div>
            </div>

            {/* Column B: Today's Tasks & Achievements */}
            <div className="insights-double-module flex-1">

              {/* Card 1: Today's Tasks */}
              <div className="grid-module-card flex-grow-1" style={{ paddingBottom: "18px" }}>
                <div className="module-header-row" style={{ marginBottom: "12px" }}>
                  <h3 className="module-title">Today's Tasks</h3>
                  <button className="module-header-link" onClick={() => handleNavigate("learn")}>View All Tasks →</button>
                </div>

                <div className="checklist-container">
                  <div className="check-item-row" onClick={() => toggleTask(0)}>
                    <input type="checkbox" checked={tasksChecked[0]} readOnly />
                    <div className="check-item-content">
                      <span className={tasksChecked[0] ? "check-title line-through" : "check-title"}>Complete Deep Learning Module</span>
                      <span className="check-tag in-progress">In Progress</span>
                    </div>
                  </div>

                  <div className="check-item-row" onClick={() => toggleTask(1)}>
                    <input type="checkbox" checked={tasksChecked[1]} readOnly />
                    <div className="check-item-content">
                      <span className={tasksChecked[1] ? "check-title line-through" : "check-title"}>Take SQL Assessment</span>
                      <span className="check-duration">🕐 20 min</span>
                    </div>
                  </div>

                  <div className="check-item-row" onClick={() => toggleTask(2)}>
                    <input type="checkbox" checked={tasksChecked[2]} readOnly />
                    <div className="check-item-content">
                      <span className={tasksChecked[2] ? "check-title line-through" : "check-title"}>Update Resume</span>
                      <span className="check-duration">🕐 15 min</span>
                    </div>
                  </div>

                  <div className="check-item-row" onClick={() => toggleTask(3)}>
                    <input type="checkbox" checked={tasksChecked[3]} readOnly />
                    <div className="check-item-content">
                      <span className={tasksChecked[3] ? "check-title line-through" : "check-title"}>Solve 3 DSA Problems</span>
                      <span className="check-duration">🕐 30 min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Achievements */}
              <div className="grid-module-card min-height-unset">
                <div className="module-header-row" style={{ marginBottom: "12px" }}>
                  <h3 className="module-title">Achievements</h3>
                  <button className="module-header-link" onClick={() => handleNavigate("skills")}>View All →</button>
                </div>

                <div className="achievements-badges-row">
                  <span className="badge-item badge-g" title="Fast Learner">🏆</span>
                  <span className="badge-item badge-b" title="Streak Master">🔥</span>
                  <span className="badge-item badge-o" title="Quiz Solver">🥇</span>
                  <span className="badge-item badge-p" title="Projects Done">🚀</span>
                  <span className="badge-more-count">+12</span>
                </div>
              </div>

            </div>

          </section>

          {/* ==============================================
              AI MENTOR RECOMMENDATION FOOTER BANNER
             ============================================== */}
          <footer className="mentor-recommendation-banner">
            <div className="mentor-banner-left">
              <h3 className="mentor-banner-title">✦ AI Mentor Recommendation</h3>
              <p className="mentor-banner-txt">
                {studentName}, focus on completing <strong>Deep Learning</strong> this week. It will boost your career readiness by <strong>12%</strong>! 🚀
              </p>
              <button className="mentor-banner-btn" onClick={() => handleNavigate("learn")}>
                Start Deep Learning
              </button>
            </div>

            <div className="mentor-banner-visual">
              <img src={chatbotImg} className="mentor-banner-robot" alt="Robot mascot" />
            </div>
          </footer>

        </div>
      </main>

      {/* ========================================================
          CHAT ASSISTANT OVERLAY WIDGET (bottom right)
         ======================================================== */}
      <div className="floating-chat-overlay" onClick={() => handleNavigate("ai-assistant")}>
        <div className="chat-overlay-header">
          <div className="chat-avatar-mini">
            <img src={explorerImg} alt="Explorer mini" />
          </div>
          <div className="chat-hdr-info">
            <strong>Lakshya AI Assistant</strong>
            <span className="status-lbl-active">● Online</span>
          </div>
        </div>

        <div className="chat-overlay-body">
          <p className="chat-overlay-msg">
            Hi {studentName}! 👋 How can I help you achieve your career goals today?
          </p>
        </div>

        <div className="chat-overlay-input-row" onClick={(e) => e.stopPropagation()}>
          <input type="text" placeholder="Ask anything..." onKeyDown={(e) => {
            if (e.key === "Enter") handleNavigate("ai-assistant");
          }} />
          <button className="chat-send-btn" onClick={() => handleNavigate("ai-assistant")}>➔</button>
        </div>
      </div>

      {/* ========================================================
          PROFILE MODAL (Read / Edit details form overlay)
         ======================================================== */}
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
            <button className="profile-modal-close" onClick={() => {
              setShowProfileModal(false);
              setIsEditingProfile(false);
              setShowChangePassword(false);
              setProfileError("");
              setProfileSuccess("");
              setPasswordError("");
              setPasswordSuccess("");
            }}>×</button>

            <div className="profile-modal-header">
              <div className="profile-modal-avatar">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <h2>{studentName} Sharma</h2>
              <span className="profile-modal-role-badge">Student</span>
            </div>

            <div className="profile-modal-body">
              {!isEditingProfile ? (
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
                    <button className="btn-modal btn-edit-profile" onClick={() => setIsEditingProfile(true)}>
                      ✏️ Edit Profile Info
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  <h3>Edit Profile Details</h3>
                  {profileError && <p className="error-toast">❌ {profileError}</p>}

                  <div className="form-grid-modal">
                    <div className="form-group-modal span-2">
                      <label>Full Name</label>
                      <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                    </div>
                    <div className="form-group-modal">
                      <label>Age</label>
                      <input type="number" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} />
                    </div>
                    <div className="form-group-modal">
                      <label>Gender</label>
                      <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                        <option value="">Select Gender</option>
                        {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="form-group-modal">
                      <label>City</label>
                      <input type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                    </div>
                    <div className="form-group-modal">
                      <label>State</label>
                      <select value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group-modal">
                      <label>Education Level</label>
                      <select value={editForm.educationLevel} onChange={(e) => setEditForm({ ...editForm, educationLevel: e.target.value })}>
                        <option value="">Select Education</option>
                        {EDUCATION_LEVELS.map(el => <option key={el} value={el}>{el}</option>)}
                      </select>
                    </div>
                    <div className="form-group-modal">
                      <label>Stream</label>
                      <select value={editForm.stream} onChange={(e) => setEditForm({ ...editForm, stream: e.target.value })}>
                        <option value="">Select Stream</option>
                        {STREAMS.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="btn-row-modal">
                    <button type="button" className="btn-modal btn-cancel" onClick={() => { setIsEditingProfile(false); setProfileError(""); }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-modal btn-save">
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Password Management */}
              <div className="password-management-section">
                {!showChangePassword ? (
                  <button className="btn-modal btn-reset-password" onClick={() => setShowChangePassword(true)} style={{ width: "100%", margin: "10px 0" }}>
                    🔐 Change Account Password
                  </button>
                ) : (
                  <form onSubmit={handleSavePassword} className="profile-edit-form password-edit-form">
                    <h3>Change Password</h3>
                    {passwordError && <p className="error-toast">❌ {passwordError}</p>}
                    {passwordSuccess && <p className="success-toast">✅ {passwordSuccess}</p>}

                    <div className="form-group-modal">
                      <label>Current Password</label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div className="form-group-modal">
                      <label>New Password (min 8 chars)</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="form-group-modal">
                      <label>Confirm New Password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    <div className="btn-row-modal">
                      <button type="button" className="btn-modal btn-cancel" onClick={() => {
                        setShowChangePassword(false);
                        setPasswordError("");
                        setPasswordSuccess("");
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}>
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
              <button className="btn-modal btn-logout" onClick={handleLogout} style={{ width: "100%" }}>
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
