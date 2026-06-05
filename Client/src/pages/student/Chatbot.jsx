import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Courses.css";

function Chatbot() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI career advisor. Ask me anything about engineering domains, course paths, or recommended transitions!", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    API.get("/dashboard").then((res) => {
      if (res.data?.success) {
        setUser(res.data.user);
      }
    }).catch(err => console.log(err));
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsgs = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMsgs);
    setInputValue("");

    // Mock bot reply
    setTimeout(() => {
      setMessages([
        ...newMsgs,
        { text: "I've logged your request! Since I am in mock counselor mode, you can ask me to help build study routines, transition pathways, or clarify course options. Complete your prediction to refine my answers!", isUser: false }
      ]);
    }, 1000);
  };

  return (
    <div className="courses-page">
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate("/student/career")}>Career</button>
          <button className="nav-link" onClick={() => navigate("/student/skills")}>Skills</button>
          <button className="nav-link" onClick={() => navigate("/student/learn")}>Learn</button>
          <button className="nav-link active-link">AI Assistant</button>
        </div>
        <div className="navbar-avatar" onClick={() => navigate("/student/dashboard")} style={{ cursor: "pointer" }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      <div className="courses-content">
        <div className="filters-container-wrapper" style={{ height: "70vh", display: "flex", flexDirection: "column", padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "15px" }}>
            🤖 AI Career Counselor Chat
          </h3>

          <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "5px" }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{ 
                  maxWidth: "70%",
                  alignSelf: msg.isUser ? "flex-end" : "flex-start",
                  background: msg.isUser ? "#2563eb" : "#f1f5f9",
                  color: msg.isUser ? "white" : "#1e293b",
                  padding: "10px 16px",
                  borderRadius: msg.isUser ? "16px 16px 0 16px" : "16px 16px 16px 0",
                  fontSize: "14px",
                  lineHeight: "1.5"
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ display: "flex", gap: "10px", marginTop: "15px", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
            <input 
              type="text" 
              placeholder="Ask AI Counselor a question..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ flexGrow: 1, height: "40px", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0 12px", outline: "none" }}
            />
            <button type="submit" className="task-btn" style={{ height: "40px" }}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
