import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getCookie } from "../../utils/cookies";
import logo from "../../assets/Logo.png";
import ExplorerImg from "../../assets/Explorer.png";
import ChatbotImg from "../../assets/Chatbot.png";
import "./Chatbot.css";

const NavItem = ({ text, target }) => (
  <a href={`#${target}`} className="nav-link">
    {text}
  </a>
);

function Chatbot() {
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  // Dashboard & user details
  const [user, setUser] = useState(null);
  const [journey, setJourney] = useState(null);
  const [careerRecommendation, setCareerRecommendation] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am LAKSHYA AI, your career advisor. Ask me anything about engineering domains, course paths, or recommended transitions!",
      isUser: false,
    },
  ]);
  const [showLanding, setShowLanding] = useState(false);
  const [serverStatus, setServerStatus] = useState("connecting");
  const [session] = useState(() => getCookie("lakshyaSession"));
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize and load user dashboard details
  useEffect(() => {
    const loadProfileContext = async () => {
      try {
        const res = await API.get("/dashboard");
        if (res.data?.success) {
          setUser(res.data.user);
          setJourney(res.data.journey);
          setCareerRecommendation(res.data.careerRecommendation);

          // Personalize the welcome message if name is available
          if (res.data.user?.name) {
            const hasRoadmaps =
              res.data.careerRecommendation?.careers &&
              res.data.careerRecommendation.careers.length > 0;
            setMessages([
              {
                text: `Hello **${res.data.user.name}**! I am LAKSHYA AI, your career counselor. I have loaded your profile details${hasRoadmaps ? " and personalized career roadmaps" : ""}. Ask me anything about engineering domains, skill gaps, or course options!`,
                isUser: false,
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard context for chatbot:", err);
      }
    };

    loadProfileContext();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await API.get("/health");
        if (response.data && response.data.status === "ok") {
          setServerStatus("online");
        } else {
          setServerStatus("offline");
        }
      } catch (error) {
        console.error("Server connection check failed:", error);
        setServerStatus("offline");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Dynamic Suggestion Chips
  const getSuggestions = () => {
    if (
      journey &&
      journey.currentStep === "CAREER_PREDICTED" &&
      careerRecommendation?.careers?.length > 0
    ) {
      return [
        "How do I transition into my recommended roles?",
        "What skills am I missing for my target careers?",
        "Help me build a study routine for my roadmap.",
        "What resources or courses should I take next?",
      ];
    }
    return [
      "How does the career prediction work?",
      "What engineering domains are popular in India?",
      "Why should I complete the career prediction?",
      "What skills are in demand for software roles?",
    ];
  };

  // Trigger send from chip click
  const handleSuggestionClick = (suggestion) => {
    if (loading) return;
    sendMessage(suggestion);
  };

  // Submit handler
  const handleSendSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  // API sender
  const sendMessage = async (textToSend) => {
    const newMessages = [...messages, { text: textToSend, isUser: true }];
    setMessages(newMessages);
    setLoading(true);

    let retries = 1;
    const attemptSend = async () => {
      try {
        const res = await API.post("/chatbot", { messages: newMessages });
        if (res.data?.success) {
          setMessages([
            ...newMessages,
            { text: res.data.reply, isUser: false },
          ]);
        } else {
          throw new Error(res.data?.message || "Incomplete response payload");
        }
      } catch (err) {
        // Automatically retry once after 1.5s if we hit a rate limit (429)
        if (err.response?.status === 429 && retries > 0) {
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return attemptSend();
        }

        console.error("Chatbot response error:", err);
        const errorMsg =
          err.response?.status === 429
            ? "LAKSHYA AI is currently receiving too many requests. Please wait a moment and try sending your message again."
            : "I apologize, but I'm having trouble connecting to my brain right now. Please verify your connection or try again shortly.";

        setMessages([
          ...newMessages,
          {
            text: errorMsg,
            isUser: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    await attemptSend();
  };

  // Helper to parse basic markdown tags (bolding and lists) to JSX elements
  const renderFormattedMessage = (text) => {
    if (!text) return null;

    // Bold text regex parser (**bold** -> <strong>bold</strong>)
    const parseBoldText = (str) => {
      const parts = str.split(/\*\*([^*]+)\*\*/g);
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index}>{part}</strong>;
        }
        return part;
      });
    };

    // Helper to parse links [Label](/student/path) and bold text
    const parseTextElements = (str) => {
      // Regex matches [Label](/student/something)
      const linkRegex = /\[([^\]]+)\]\((\/student\/[^)]+)\)/g;
      const parts = str.split(linkRegex);
      const result = [];

      for (let i = 0; i < parts.length; i += 3) {
        const textSegment = parts[i];
        if (textSegment) {
          result.push(...parseBoldText(textSegment));
        }
        if (i + 1 < parts.length) {
          const label = parts[i + 1];
          const path = parts[i + 2];
          result.push(
            <button
              key={`link-${i}`}
              className="chat-action-btn"
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          );
        }
      }
      return result;
    };

    const lines = text.split("\n");
    const elements = [];

    // Accumulators for grouped elements
    let currentList = [];
    let listType = null; // "bullet" | "numbered" | "checkbox"
    let currentBlockquote = [];

    // Helper to flush lists
    const flushList = (key) => {
      if (currentList.length > 0) {
        if (listType === "bullet") {
          elements.push(
            <ul key={`list-${key}`} className="msg-bullet-list">
              {currentList.map((item, i) => (
                <li key={i} className="msg-bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          );
        } else if (listType === "numbered") {
          elements.push(
            <ol key={`list-${key}`} className="msg-numbered-list">
              {currentList.map((item, i) => (
                <li key={i} className="msg-numbered-item">
                  {item}
                </li>
              ))}
            </ol>
          );
        } else if (listType === "checkbox") {
          elements.push(
            <ul
              key={`list-${key}`}
              className="msg-checkbox-list"
              style={{ paddingLeft: 0, margin: "8px 0 12px 0" }}
            >
              {currentList.map((item, i) => (
                <li
                  key={i}
                  className="msg-checkbox-item"
                  style={{
                    listStyleType: "none",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    style={{ marginRight: "8px", cursor: "pointer" }}
                  />
                  <span>{item.content}</span>
                </li>
              ))}
            </ul>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    // Helper to flush blockquotes
    const flushBlockquote = (key) => {
      if (currentBlockquote.length > 0) {
        elements.push(
          <div key={`blockquote-${key}`} className="chat-callout-box">
            {currentBlockquote.map((line, i) => (
              <p key={i} className="msg-paragraph" style={{ margin: 0 }}>
                {line}
              </p>
            ))}
          </div>
        );
        currentBlockquote = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Blockquote check
      if (trimmed.startsWith("> ")) {
        flushList(index);
        const content = trimmed.substring(2);
        currentBlockquote.push(parseTextElements(content));
      }
      // Checkbox list check: e.g. "- [ ] " or "- [x] "
      else if (
        trimmed.startsWith("- [ ] ") ||
        trimmed.startsWith("* [ ] ") ||
        trimmed.startsWith("- [x] ") ||
        trimmed.startsWith("* [x] ")
      ) {
        flushBlockquote(index);
        if (listType !== "checkbox") {
          flushList(index);
          listType = "checkbox";
        }
        const isChecked = trimmed.includes("[x]");
        const contentStr = trimmed.substring(6);
        currentList.push({
          checked: isChecked,
          content: parseTextElements(contentStr),
        });
      }
      // Bullet list check: e.g. "- " or "* "
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushBlockquote(index);
        if (listType !== "bullet") {
          flushList(index);
          listType = "bullet";
        }
        const content = trimmed.substring(2);
        currentList.push(parseTextElements(content));
      }
      // Numbered list check: e.g. "1. "
      else if (/^\d+\.\s+/.test(trimmed)) {
        flushBlockquote(index);
        if (listType !== "numbered") {
          flushList(index);
          listType = "numbered";
        }
        const content = trimmed.replace(/^\d+\.\s+/, "");
        currentList.push(parseTextElements(content));
      }
      // Regular text line
      else {
        flushList(index);
        flushBlockquote(index);
        if (trimmed !== "") {
          elements.push(
            <p key={index} className="msg-paragraph">
              {parseTextElements(line)}
            </p>
          );
        }
      }
    });

    // Final flushes
    flushList(lines.length);
    flushBlockquote(lines.length);

    return elements;
  };

  const isAssessmentCompleted = journey?.currentStep === "CAREER_PREDICTED";

  const handleDashboardRedirect = () => {
    if (!session) return;
    if (session.role === "student") {
      if (session.onboardingCompleted) {
        navigate("/student/dashboard");
      } else {
        navigate("/student/onboarding");
      }
    } else if (session.role === "counselor") {
      navigate("/counselor/dashboard");
    } else if (session.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  if (showLanding) {
    return (
      <div className="landing-page">
        <div className="landing-bg">
          <div className="landing-glow landing-glow--purple" />
          <div className="landing-glow landing-glow--blue" />
          <svg className="constellation-svg" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="20%" x2="30%" y2="50%" />
            <line x1="30%" y1="50%" x2="55%" y2="15%" />
            <line x1="55%" y1="15%" x2="80%" y2="40%" />
            <line x1="80%" y1="40%" x2="95%" y2="70%" />
            <line x1="10%" y1="80%" x2="40%" y2="65%" />
            <line x1="40%" y1="65%" x2="65%" y2="85%" />
            <line x1="65%" y1="85%" x2="90%" y2="55%" />
            <line x1="20%" y1="35%" x2="45%" y2="75%" />
            <line x1="70%" y1="20%" x2="85%" y2="60%" />
            <circle cx="10%" cy="20%" r="2" />
            <circle cx="30%" cy="50%" r="2" />
            <circle cx="55%" cy="15%" r="2" />
            <circle cx="80%" cy="40%" r="2" />
            <circle cx="95%" cy="70%" r="2" />
            <circle cx="10%" cy="80%" r="2" />
            <circle cx="40%" cy="65%" r="2" />
            <circle cx="65%" cy="85%" r="2" />
            <circle cx="90%" cy="55%" r="2" />
            <circle cx="20%" cy="35%" r="2" />
            <circle cx="70%" cy="20%" r="2" />
            <circle cx="85%" cy="60%" r="2" />
          </svg>
        </div>

        <header className="navbar">
          <div className="nav-inner">
            <div className="nav-left">
              <img src={logo} className="logo" alt="Lakshya Logo" />
              <span className="brand">LAKSHYA</span>
              <div className={`server-status-pill ${serverStatus}`}>
                <span className="status-dot"></span>
                <span className="status-text">
                  {serverStatus === "connecting" && "Connecting..."}
                  {serverStatus === "online" && "Server Connected"}
                  {serverStatus === "offline" && "Server Offline"}
                </span>
              </div>
            </div>

            <nav className="nav-center">
              <NavItem text="Home" target="home" />
              <NavItem text="Features" target="features" />
              <NavItem text="User Roles" target="user-roles" />
              <NavItem text="About Us" target="about-us" />
              <NavItem text="Contact" target="contact" />
            </nav>

            <div className="nav-right">
              {session ? (
                <button
                  className="signup-btn"
                  onClick={handleDashboardRedirect}
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  className="signup-btn"
                  onClick={() => navigate("/auth")}
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="landing-hero">
          <div className="landing-left">
            <span className="landing-badge">✦ AI Career Assistant</span>
            <h1 className="landing-heading">
              Supercharge Your Future with{" "}
              <span className="landing-heading--gradient">
                AI Career Guidance
              </span>
            </h1>
            <p className="landing-subtext">
              Powered by cutting-edge AI, Lakshya maps your skills, predicts
              your ideal career path, and gives you a step-by-step roadmap to
              get there — personalized just for you.
            </p>
            <div className="landing-cta-row">
              <button
                className="landing-btn landing-btn--primary"
                onClick={() => setShowLanding(false)}
              >
                <span>Get Started Free</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="landing-btn landing-btn--ghost"
                onClick={() => setShowLanding(false)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Open Chat</span>
              </button>
            </div>
          </div>

          <div className="landing-center">
            <div className="explorer-wrapper">
              <div className="explorer-glow" />
              <div className="floating-career-card">
                <div className="floating-card__label">Career Match</div>
                <div className="floating-card__role">AI Product Manager</div>
                <div className="floating-card__match">
                  <span className="match-bar">
                    <span
                      className="match-bar__fill"
                      style={{ width: "92%" }}
                    />
                  </span>
                  <span className="match-pct">92% Match</span>
                </div>
              </div>
              <img
                src={ExplorerImg}
                alt="Explorer Mascot"
                className="explorer-img"
              />
            </div>
          </div>

          <div className="landing-right">
            <div className="robot-wrapper">
              <div className="floating-bubble">
                <span className="floating-bubble__dot" />
                <span className="floating-bubble__dot" />
                <span className="floating-bubble__dot" />
                How can I help you today?
              </div>
              <img src={ChatbotImg} alt="AI Robot" className="robot-img" />
              <div className="floating-skills-card">
                <div className="floating-card__label">Top Skills</div>
                <div className="skills-pill-row">
                  <span className="skills-pill">Machine Learning</span>
                  <span className="skills-pill">Data Analysis</span>
                  <span className="skills-pill">Python & SQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── EXISTING CHATBOT UI ───────────────────────────────────────────────────
  return (
    <div className="chatbot-page">
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button
            className="nav-link"
            onClick={() => navigate("/student/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="nav-link"
            onClick={() => navigate("/student/career")}
          >
            Career
          </button>
          <button
            className="nav-link"
            onClick={() => navigate("/student/skills")}
          >
            Skills
          </button>
          <button
            className="nav-link"
            onClick={() => navigate("/student/learn")}
          >
            Learn
          </button>
          <button className="nav-link active-link">AI Assistant</button>
        </div>
        <div
          className="navbar-avatar"
          onClick={() => navigate("/student/dashboard")}
          style={{ cursor: "pointer" }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      <div className="chatbot-content">
        <div className="chatbot-layout-wrapper">
          {/* Sidebar - Context Panel */}
          <div className="chatbot-sidebar">
            {isAssessmentCompleted ? (
              <>
                <div className="student-brief-card">
                  <div className="sidebar-section-title">Student Profile</div>
                  <h3 className="student-name-header">
                    {user?.name || "Student"}
                  </h3>
                  {user?.stream && (
                    <span className="student-stream-badge">{user.stream}</span>
                  )}
                  {user?.educationLevel && (
                    <div className="student-meta-item">
                      <strong>Education:</strong>{" "}
                      <span>{user.educationLevel}</span>
                    </div>
                  )}
                  {user?.city && user?.state && (
                    <div className="student-meta-item">
                      <strong>Location:</strong>{" "}
                      <span>
                        {user.city}, {user.state}
                      </span>
                    </div>
                  )}
                </div>

                {user?.skills && user.skills.length > 0 && (
                  <div>
                    <div className="sidebar-section-title">My Skills</div>
                    <div className="tags-list-container">
                      {user.skills.map((skill, idx) => (
                        <span key={idx} className="context-pill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user?.interests && user.interests.length > 0 && (
                  <div>
                    <div className="sidebar-section-title">My Interests</div>
                    <div className="tags-list-container">
                      {user.interests.map((interest, idx) => (
                        <span key={idx} className="context-pill-tag interest">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {careerRecommendation?.careers &&
                  careerRecommendation.careers.length > 0 && (
                    <div>
                      <div className="sidebar-section-title">
                        Target Careers
                      </div>
                      <div className="sidebar-careers-list">
                        {careerRecommendation.careers.map((career, idx) => (
                          <div key={idx} className="sidebar-career-card">
                            <h4 className="sidebar-career-role">
                              {career.role}
                            </h4>
                            <span className="sidebar-career-confidence">
                              Match: {(career.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <div className="sidebar-warning-card">
                <span className="warning-card-icon">⚠️</span>
                <h3 className="warning-card-title">Profile Incomplete</h3>
                <p className="warning-card-text">
                  Complete your domain and career assessment predicting target
                  pathways to enable personalized context.
                </p>
                <button
                  className="warning-card-btn"
                  onClick={() => navigate("/student/career")}
                >
                  Go to Career Flow
                </button>
              </div>
            )}
          </div>

          {/* Main Chat Panel */}
          <div className="chatbot-chat-panel">
            {/* Header */}
            <div className="chatbot-chat-header">
              <div className="chat-header-title">
                <h2>🤖 LAKSHYA Career Advisor</h2>
              </div>
              <div className="status-badge-container">
                <span className="status-dot-active"></span>
                <span className="status-text">Active Counsel</span>
              </div>
            </div>

            {/* Messages Scroll List */}
            <div className="chatbot-messages-list" ref={chatContainerRef}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message-row ${msg.isUser ? "user" : "advisor"}`}
                >
                  <div className="message-bubble">
                    {msg.isUser ? msg.text : renderFormattedMessage(msg.text)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-message-row advisor">
                  <div className="loading-bubble">
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions Chips */}
            <div className="chatbot-suggestions-row">
              {getSuggestions().map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="chatbot-input-container">
              <form onSubmit={handleSendSubmit} className="chatbot-input-form">
                <div className="chatbot-input-box-wrapper">
                  <input
                    type="text"
                    className="chatbot-input-field"
                    placeholder={
                      loading
                        ? "LAKSHYA AI is thinking..."
                        : "Ask your career counselor..."
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="chatbot-send-button"
                  disabled={loading || !inputValue.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
