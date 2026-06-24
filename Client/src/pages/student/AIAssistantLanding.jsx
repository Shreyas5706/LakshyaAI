import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import API from "../../services/api";
import { getCookie } from "../../utils/cookies";
import chatbotImg from "../../assets/Chatbot.png";
import explorerImg from "../../assets/Explorer.png";
import "./Dashboard.css";
import "./AIAssistantLanding.css";

export default function AIAssistantLanding() {
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState("connecting");
  const [user, setUser] = useState(null);
  const session = getCookie("lakshyaSession");

  /* ── Server status polling ── */
  useEffect(() => {
    const check = async () => {
      try {
        const res = await API.get("/health");
        setServerStatus(res.data?.status === "ok" ? "online" : "offline");
      } catch {
        setServerStatus("offline");
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, []);

  /* ── Fetch student profile context ── */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/dashboard");
        if (res.data?.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn("Failed to load user in assistant landing:", err);
      }
    };
    loadProfile();
  }, []);

  const handleNavigate = (pageName) => {
    if (pageName === "dashboard") {
      navigate("/student/dashboard");
    } else {
      navigate(`/student/${pageName}`);
    }
  };

  return (
    <div className="ail-root">

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => handleNavigate("dashboard")}>
            Dashboard
          </button>
          <button className="nav-link" onClick={() => handleNavigate("career")}>
            Career
          </button>
          <button className="nav-link" onClick={() => handleNavigate("skills")}>
            Skills
          </button>
          <button className="nav-link" onClick={() => handleNavigate("learn")}>
            Learn
          </button>
          <button
            className="nav-link active-link"
            onClick={() => handleNavigate("ai-assistant")}
          >
            AI Assistant
          </button>
        </div>
        <div
          className="navbar-avatar"
          onClick={() => navigate("/student/profile")}
          style={{ cursor: "pointer" }}
          title="View Profile"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      {/* ══════════ HERO PAGE ══════════ */}
      <div className="ail-page">

        {/* ════ LEFT CONTENT ════ */}
        <div className="ail-left">

          {/* Badge */}
          <div className="ail-badge">
            <span className="ail-badge-star">✦</span>
            AI-Powered Learning Platform
          </div>

          {/* Heading */}
          <h1 className="ail-heading">
            Supercharge Your<br />
            Learning with<br />
            <span className="ail-gradient-text">AI Conversations</span>
          </h1>

          {/* Subtitle */}
          <p className="ail-subtitle">
            From doubt solving to personalized guidance —<br />
            automate it all with AI. Empower your students,<br />
            delight your learners.
          </p>

          {/* CTA Buttons */}
          <div className="ail-buttons">
            <button
              className="ail-btn-primary"
              onClick={() => navigate("/student/chatbot")}
              id="ail-get-started-btn"
            >
              Get Started Free &nbsp;→
            </button>
            <button className="ail-btn-outline" id="ail-see-demo-btn">
              <span className="ail-play">▶</span>
              See Demo
            </button>
          </div>

          {/* Trust */}
          <div className="ail-trust">
            <span className="ail-trust-text">Trusted by 10,000+ students worldwide</span>
            <div className="ail-logos">
              {/* Logo: KSV */}
              <div className="ail-logo-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 22,20 2,20" stroke="#564877" strokeWidth="2" fill="none"/>
                </svg>
                <span>KSV</span>
              </div>
              {/* Logo: LDRP */}
              <div className="ail-logo-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#564877" strokeWidth="2"/>
                  <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#564877" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="21" y2="12" stroke="#564877" strokeWidth="2"/>
                </svg>
                <span>LDRP</span>
              </div>
              {/* Logo: GTU */}
              <div className="ail-logo-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" stroke="#564877" strokeWidth="2" fill="none"/>
                </svg>
                <span>GTU</span>
              </div>
              {/* Logo: AICTE */}
              <div className="ail-logo-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3 C8 3 5 7 5 12 L5 17 Q12 22 19 17 L19 12 C19 7 16 3 12 3Z" stroke="#564877" strokeWidth="2" fill="none"/>
                  <line x1="9" y1="17" x2="9" y2="20" stroke="#564877" strokeWidth="2"/>
                  <line x1="15" y1="17" x2="15" y2="20" stroke="#564877" strokeWidth="2"/>
                  <line x1="7" y1="20" x2="17" y2="20" stroke="#564877" strokeWidth="2"/>
                </svg>
                <span>AICTE</span>
              </div>
            </div>
          </div>
        </div>

        {/* ════ RIGHT VISUAL ════ */}
        <div className="ail-right">

          {/* Soft radial glow behind characters */}
          <div className="ail-bg-glow" />

          {/* Sparkle dots scattered */}
          <span className="ail-star s1">✦</span>
          <span className="ail-star s2">✦</span>
          <span className="ail-star s3">✦</span>
          <span className="ail-star s4">✦</span>
          <span className="ail-dot d1" />
          <span className="ail-dot d2" />
          <span className="ail-dot d3" />

          {/* Circular connector line (like in reference — center between chars) */}
          <div className="ail-connector-ring" />

          {/* Chat bubble — Hello AI (left, above explorer) */}
          <div className="ail-bubble ail-bubble-left">
            Hello AI
          </div>

          {/* Chat bubble — How can I help (right, above robot) */}
          <div className="ail-bubble ail-bubble-right">
            How can I help<br />you today?
          </div>

          {/* Characters */}
          <div className="ail-characters">
            <div className="ail-char-wrap ail-explorer-wrap">
              <img
                src={explorerImg}
                alt="Explorer"
                className="ail-char ail-explorer"
              />
            </div>
            <div className="ail-char-wrap ail-robot-wrap">
              <img
                src={chatbotImg}
                alt="AI Chatbot"
                className="ail-char ail-robot"
              />
            </div>
          </div>

          {/* Platform ring under characters */}
          <div className="ail-platform" />
        </div>
      </div>
    </div>
  );
}
