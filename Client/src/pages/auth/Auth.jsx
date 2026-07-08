import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { setCookie } from "../../utils/cookies";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/auth.css";
import workspaceImg from "../../assets/Auth-avatar.png";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
];
const EDUCATION_LEVELS = [
  "10th",
  "12th",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
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
  "Design",
];

export default function Auth() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  // ================= SIGNUP STATE =================
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [signupAge, setSignupAge] = useState("");
  const [signupGender, setSignupGender] = useState("");
  const [signupState, setSignupState] = useState("");
  const [signupCity, setSignupCity] = useState("");
  const [signupEducationLevel, setSignupEducationLevel] = useState("");
  const [signupStream, setSignupStream] = useState("");
  const [signupError, setSignupError] = useState("");

  // ================= LOGIN STATE =================
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  // ================= SIGNUP =================
  const handleSignup = async () => {
    if (!signupName.trim()) {
      return setSignupError("Name is required");
    }

    if (!signupEmail.trim()) {
      return setSignupError("Email is required");
    }

    if (!validatePassword(signupPassword)) {
      return setSignupError(
        "Password must contain uppercase, lowercase, number & symbol"
      );
    }

    if (signupRole === "student") {
      if (
        !signupAge ||
        isNaN(signupAge) ||
        Number(signupAge) < 10 ||
        Number(signupAge) > 30
      ) {
        return setSignupError("Please enter a valid age between 10 and 30");
      }
      if (!signupGender) {
        return setSignupError("Please select your gender");
      }
      if (!signupState) {
        return setSignupError("Please select your state");
      }
      if (!signupCity.trim()) {
        return setSignupError("Please enter your city");
      }
      if (!signupEducationLevel) {
        return setSignupError("Please select your education level");
      }
      if (!signupStream) {
        return setSignupError("Please select your stream");
      }
    }

    try {
      setSignupError("");
      await API.post("/auth/signup", {
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        role: signupRole,
        age: signupRole === "student" ? Number(signupAge) : undefined,
        gender: signupRole === "student" ? signupGender : undefined,
        state: signupRole === "student" ? signupState : undefined,
        city: signupRole === "student" ? signupCity.trim() : undefined,
        educationLevel:
          signupRole === "student" ? signupEducationLevel : undefined,
        stream: signupRole === "student" ? signupStream : undefined,
      });

      // Move to login
      setActive(false);
      // Clear signup fields
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupAge("");
      setSignupGender("");
      setSignupState("");
      setSignupCity("");
      setSignupEducationLevel("");
      setSignupStream("");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
      setSignupError(msg);
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    if (!loginEmail.trim()) {
      return setLoginError("Email is required");
    }
    if (!loginPassword) {
      return setLoginError("Password is required");
    }

    try {
      setLoginError("");
      const response = await API.post("/auth/login", {
        email: loginEmail.trim(),
        password: loginPassword,
      });

      const { token, user } = response.data;

      // Determine onboarding completed status:
      // A student has completed onboarding if they already have skills in the backend
      const onboardingCompleted =
        user.role === "student" && user.skills && user.skills.length > 0;

      setCookie(
        "lakshyaSession",
        {
          token,
          role: user.role,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
            state: user.state,
            city: user.city,
            educationLevel: user.educationLevel,
            stream: user.stream,
          },
          onboardingCompleted,
        },
        1
      );

      if (user.role === "student") {
        if (onboardingCompleted) {
          navigate("/student/dashboard");
        } else {
          navigate("/student/onboarding");
        }
      } else if (user.role === "counselor") {
        navigate("/counselor/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setLoginError(msg);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setSignupError("");
      setLoginError("");
      const response = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });

      const { token, user } = response.data;

      // Determine onboarding completed status:
      // A student has completed onboarding if they already have skills in the backend
      const onboardingCompleted =
        user.role === "student" && user.skills && user.skills.length > 0;

      setCookie(
        "lakshyaSession",
        {
          token,
          role: user.role,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
            state: user.state,
            city: user.city,
            educationLevel: user.educationLevel,
            stream: user.stream,
          },
          onboardingCompleted,
        },
        1
      );

      if (user.role === "student") {
        if (onboardingCompleted) {
          navigate("/student/dashboard");
        } else {
          navigate("/student/onboarding");
        }
      } else if (user.role === "counselor") {
        navigate("/counselor/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Google Authentication failed. Please try again.";
      if (active) {
        setSignupError(msg);
      } else {
        setLoginError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#rgba(163,163,255,0.15)] px-6">
      <div className="auth-wrapper">
        <div className={`auth-slider ${active ? "active" : ""}`}>
          {/* ================= FORMS ================= */}
          <div className="auth-forms">
            <div className="field">
              {/* SIGNUP */}
              {active && (
                <div className="auth-card">
                  <h1 className="text-3xl font-bold text-slate-900">Sign Up</h1>
                  <p className="text-slate-500 mt-2 mb-8">
                    Create your account
                  </p>

                  {signupError && (
                    <p className="text-red-500 mb-4">{signupError}</p>
                  )}

                  <div className="form-stack">
                    <div className="form-row">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="input"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <label>Role</label>
                      <select
                        className="input"
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value)}
                      >
                        <option value="student">Student</option>
                        <option value="counselor">Counselor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-row">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="input"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="Create strong password"
                        className="input"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />
                    </div>

                    {signupRole === "student" && (
                      <div
                        className="student-profile-fields"
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          paddingRight: "5px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          border: "1px solid #CEB5B7",
                          borderRadius: "8px",
                          padding: "12px",
                          background: "#F8F8FC",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#564877",
                            marginBottom: "4px",
                          }}
                        >
                          Student Profile Details
                        </h3>
                        <div className="form-row">
                          <label>Age</label>
                          <input
                            type="number"
                            placeholder="Age (e.g. 17)"
                            className="input"
                            value={signupAge}
                            onChange={(e) => setSignupAge(e.target.value)}
                          />
                        </div>
                        <div className="form-row">
                          <label>Gender</label>
                          <select
                            className="input"
                            value={signupGender}
                            onChange={(e) => setSignupGender(e.target.value)}
                          >
                            <option value="">Select Gender</option>
                            {GENDER_OPTIONS.map((g) => (
                              <option key={g} value={g}>
                                {g}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-row">
                          <label>State</label>
                          <select
                            className="input"
                            value={signupState}
                            onChange={(e) => setSignupState(e.target.value)}
                          >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-row">
                          <label>City</label>
                          <input
                            type="text"
                            placeholder="City (e.g. Mumbai)"
                            className="input"
                            value={signupCity}
                            onChange={(e) => setSignupCity(e.target.value)}
                          />
                        </div>
                        <div className="form-row">
                          <label>Education</label>
                          <select
                            className="input"
                            value={signupEducationLevel}
                            onChange={(e) =>
                              setSignupEducationLevel(e.target.value)
                            }
                          >
                            <option value="">Select Education Level</option>
                            {EDUCATION_LEVELS.map((el) => (
                              <option key={el} value={el}>
                                {el}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-row">
                          <label>Stream</label>
                          <select
                            className="input"
                            value={signupStream}
                            onChange={(e) => setSignupStream(e.target.value)}
                          >
                            <option value="">Select Stream</option>
                            {STREAMS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSignup}
                      className="create-btn w-full"
                    >
                      Sign Up
                    </button>

                    <div style={{ display: "flex", alignItems: "center", margin: "14px 0 10px 0" }}>
                      <div style={{ flex: 1, height: "1px", background: "#CEB5B7" }}></div>
                      <span style={{ padding: "0 10px", fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>OR</span>
                      <div style={{ flex: 1, height: "1px", background: "#CEB5B7" }}></div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setSignupError("Google Signup failed. Please try again.")}
                        theme="filled_blue"
                        shape="pill"
                        text="signup_with"
                        size="large"
                        width="320px"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* LOGIN */}
              {!active && (
                <div className="auth-card">
                  <h1 className="text-3xl font-bold text-slate-900">
                    Welcome Back
                  </h1>

                  {loginError && (
                    <p className="text-red-500 mb-4">{loginError}</p>
                  )}

                  <div className="form-stack">
                    <div className="form-row">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="input"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="password"
                        className="input"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>

                    <div style={{ textAlign: "right", marginTop: "-8px" }}>
                      <span
                        onClick={() => navigate("/forgot-password")}
                        style={{
                          fontSize: "13px",
                          color: "#14B8A6",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Forgot Password?
                      </span>
                    </div>

                    <button onClick={handleLogin} className="create-btn w-full">
                      Login
                    </button>

                    <div style={{ display: "flex", alignItems: "center", margin: "14px 0 10px 0" }}>
                      <div style={{ flex: 1, height: "1px", background: "#CEB5B7" }}></div>
                      <span style={{ padding: "0 10px", fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>OR</span>
                      <div style={{ flex: 1, height: "1px", background: "#CEB5B7" }}></div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setLoginError("Google Sign-In failed. Please try again.")}
                        theme="filled_blue"
                        shape="pill"
                        text="signin_with"
                        size="large"
                        width="320px"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= IMAGE ================= */}
          <div className="auth-image">
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <img src={workspaceImg} alt="Workspace" className="relative z-10" />

            <div className="auth-image-text text-white z-20">
              <h2 className="text-3xl font-bold mb-3">
                {active ? "Welcome Back!" : "Hello, Friend!"}
              </h2>
              <p className="text-indigo-100 mb-6">
                {active
                  ? "Sign up to start your journey"
                  : "Login with your credentials"}
              </p>

              <button
                onClick={() => setActive(!active)}
                className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition"
              >
                {active ? "Sign In" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
