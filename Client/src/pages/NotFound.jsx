import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookies";
import "./styles/NotFound.css";

function NotFound() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Retrieve user session cookie
    const activeSession = getCookie("lakshyaSession");
    if (activeSession) {
      setSession(activeSession);
    }
  }, []);

  // Determine correct redirect route based on active session role
  const handleDashboardRedirect = () => {
    if (!session) {
      navigate("/");
      return;
    }
    
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
    } else {
      navigate("/");
    }
  };

  return (
    <div className="notfound-root">
      {/* Cosmic background effects */}
      <div className="notfound-bg-decorations">
        <div className="cosmic-glow cosmic-glow--purple"></div>
        <div className="cosmic-glow cosmic-glow--rose"></div>
        <div className="cosmic-circle cosmic-circle--1"></div>
        <div className="cosmic-circle cosmic-circle--2"></div>
      </div>

      {/* Main glassmorphic container card */}
      <div className="notfound-card">
        <div className="notfound-illustration">
          <div className="radar-sweep"></div>
          <div className="illustration-robot">🔍</div>
          <div className="illustration-shadow"></div>
        </div>

        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-heading">Lost in Space?</h2>
        <p className="notfound-subtext">
          The page you are looking for does not exist, has been moved to another orbit, 
          or you might have entered an incorrect URL.
        </p>

        <div className="notfound-actions">
          {session ? (
            <button 
              className="btn-404-primary" 
              onClick={handleDashboardRedirect}
              aria-label="Navigate to your dashboard"
            >
              <span>Go to Dashboard</span>
              <span>🚀</span>
            </button>
          ) : (
            <button 
              className="btn-404-primary" 
              onClick={() => navigate("/")}
              aria-label="Navigate to homepage"
            >
              <span>Go to Home</span>
              <span>🏠</span>
            </button>
          )}
          
          <button 
            className="btn-404-secondary" 
            onClick={() => navigate(-1)}
            aria-label="Go back to the previous page"
          >
            <span>← Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
