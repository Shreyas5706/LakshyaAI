import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getCookie } from "../../utils/cookies";
import logo from "../../assets/Logo.png";
import "../styles/auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return setError("Email is required");
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      const response = await API.post("/auth/forgot-password", { email: email.trim() });
      const { resetToken, message: resMessage } = response.data;

      if (resetToken) {
        setMessage("Password reset token generated! Redirecting to password reset screen...");
        setTimeout(() => {
          navigate(`/reset-password/${resetToken}`);
        }, 1500);
      } else {
        setMessage(resMessage || "Request successful.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] px-6 py-12 relative overflow-hidden" style={{ display: "flex", alignItems: "center" }}>
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.4 }}>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#14B8A6]/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#064E3B]/10 blur-[120px]"></div>
      </div>

      {/* Navigation Bar */}
      <header className="auth-navbar">
        <div className="auth-nav-inner">
          <div className="auth-nav-logo-group" onClick={() => navigate("/")}>
            <img src={logo} className="auth-nav-logo" alt="Lakshya Logo" />
            <span className="auth-nav-brand">LAKSHYA</span>
          </div>
          <button className="auth-nav-back-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </header>

      {/* Form Card Container */}
      <div className="auth-wrapper z-10" style={{ width: "100%", maxWidth: "480px", minHeight: "auto", margin: "100px auto 40px" }}>
        <div className="auth-card" style={{ width: "100%", padding: "2.5rem 3rem", background: "rgba(255, 255, 255, 0.95)", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)", backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
            <div style={{ background: "#e6f4ea", borderRadius: "50%", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#064E3B" }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "28px", height: "28px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>

          <h1 className="text-center" style={{ color: "#064E3B", fontSize: "28px", fontWeight: "800", marginBottom: "0.5rem", textAlign: "center" }}>Forgot Password</h1>
          <p className="text-center" style={{ color: "#64748b", fontSize: "14.5px", fontWeight: "500", marginBottom: "2rem", textAlign: "center", lineHeight: "1.5" }}>
            Enter your registered email address and we'll direct you to the recovery screen.
          </p>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fef2f2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", marginBottom: "1.25rem" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: "20px", height: "20px", flexShrink: 0 }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0fdf4", color: "#166534", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", marginBottom: "1.25rem" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: "20px", height: "20px", flexShrink: 0 }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-stack" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", color: "#064E3B", fontSize: "14px" }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ height: "46px", border: "1.5px solid #a7f3d0", borderRadius: "8px", padding: "0 14px", width: "100%", background: "#f0fdfa", fontSize: "15px" }}
                required
              />
            </div>

            <button
              type="submit"
              className="create-btn w-full"
              disabled={loading}
              style={{ background: "#064E3B", color: "white", border: "none", height: "48px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", width: "100%", transition: "all 0.2s ease", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {loading ? "Verifying..." : "Send Reset Link"}
            </button>

            <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
              <span style={{ padding: "0 10px", fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
            </div>

            {getCookie("lakshyaSession") ? (
              <button
                type="button"
                onClick={() => {
                  const sess = getCookie("lakshyaSession") || {};
                  if (sess.role === "student") {
                    navigate("/student/dashboard");
                  } else if (sess.role === "counselor") {
                    navigate("/counselor/dashboard");
                  } else {
                    navigate("/admin/dashboard");
                  }
                }}
                className="w-full"
                style={{ background: "transparent", border: "1.5px solid #064E3B", color: "#064E3B", height: "48px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", width: "100%", transition: "all 0.2s ease" }}
              >
                Back to Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="w-full"
                style={{ background: "transparent", border: "1.5px solid #064E3B", color: "#064E3B", height: "48px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", width: "100%", transition: "all 0.2s ease" }}
              >
                Back to Login
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
