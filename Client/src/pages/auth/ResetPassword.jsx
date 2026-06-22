import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import logo from "../../assets/Logo.png";
import "../styles/auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      return setError(
        "Password must contain uppercase, lowercase, number & symbol and be at least 8 characters"
      );
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      const response = await API.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(
        response.data.message ||
          "Password reset successful! Redirecting to login..."
      );
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired reset token."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-[#F8F8FC] via-[#f1f5f9] to-[#CEB5B7] px-6 py-12 relative overflow-hidden"
      style={{ display: "flex", alignItems: "center" }}
    >
      {/* Background patterns */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.4 }}
      >
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
      <div
        className="auth-wrapper z-10"
        style={{
          width: "100%",
          maxWidth: "480px",
          minHeight: "auto",
          margin: "100px auto 40px",
        }}
      >
        <div
          className="auth-card"
          style={{
            width: "100%",
            padding: "2.5rem 3rem",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                background: "#e6f4ea",
                borderRadius: "50%",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#064E3B",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                style={{ width: "28px", height: "28px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                />
              </svg>
            </div>
          </div>

          <h1
            className="text-center"
            style={{
              color: "#064E3B",
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            Reset Password
          </h1>
          <p
            className="text-center"
            style={{
              color: "#8F8CAC",
              fontSize: "14.5px",
              fontWeight: "500",
              marginBottom: "2rem",
              textAlign: "center",
              lineHeight: "1.5",
            }}
          >
            Enter your new secure password below to complete recovery.
          </p>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#fef2f2",
                color: "#b91c1c",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "1.25rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: "20px", height: "20px", flexShrink: 0 }}
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#f0fdf4",
                color: "#166534",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "1.25rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: "20px", height: "20px", flexShrink: 0 }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{message}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="form-stack"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  fontWeight: "600",
                  color: "#064E3B",
                  fontSize: "14px",
                }}
              >
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter at least 8 characters"
                className="input"
                value={password}
                onChange={(e) => setError("") || setPassword(e.target.value)}
                style={{
                  height: "46px",
                  border: "1.5px solid #a7f3d0",
                  borderRadius: "8px",
                  padding: "0 14px",
                  width: "100%",
                  background: "#f0fdfa",
                  fontSize: "15px",
                }}
                required
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  fontWeight: "600",
                  color: "#064E3B",
                  fontSize: "14px",
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your new password"
                className="input"
                value={confirmPassword}
                onChange={(e) =>
                  setError("") || setConfirmPassword(e.target.value)
                }
                style={{
                  height: "46px",
                  border: "1.5px solid #a7f3d0",
                  borderRadius: "8px",
                  padding: "0 14px",
                  width: "100%",
                  background: "#f0fdfa",
                  fontSize: "15px",
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="create-btn w-full"
              disabled={loading}
              style={{
                background: "#064E3B",
                color: "white",
                border: "none",
                height: "48px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%",
                transition: "all 0.2s ease",
                marginTop: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
