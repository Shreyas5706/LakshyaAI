import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  // ================= LOGIN STATE =================
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ================= SIGNUP STATE =================
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [signupError, setSignupError] = useState("");

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  // ================= LOGIN =================
  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("lakshyaUser"));

    if (!user) {
      return setLoginError("Please sign up first");
    }

    if (loginEmail === user.email && loginPassword === user.password) {
      // store session
      localStorage.setItem(
        "lakshyaSession",
        JSON.stringify({
          role: user.role,
          onboardingCompleted: false,
        })
      );

      if (user.role === "student") navigate("/onboarding/student");
      else if (user.role === "counselor") navigate("/dashboard/counselor");
      else navigate("/dashboard/admin");
    } else {
      setLoginError("Invalid email or password");
    }
  };

  // ================= SIGNUP =================
  const handleSignup = () => {
    if (!validatePassword(signupPassword)) {
      return setSignupError(
        "Password must contain uppercase, lowercase, number & symbol"
      );
    }

    localStorage.setItem(
      "lakshyaUser",
      JSON.stringify({
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
      })
    );

    setActive(false); // move to login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2ff] px-6">
      <div className={`auth-slider ${active ? "active" : ""}`}>

        {/* ================= FORMS ================= */}
        <div className="auth-forms">

          {/* LOGIN (LEFT) */}
          {!active && (
            <div className="p-10 md:p-14">
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h1>
              <p className="text-slate-500 mt-2 mb-8">
                Sign in to continue
              </p>

              {loginError && (
                <p className="text-red-500 mb-4">{loginError}</p>
              )}

              <div className="space-y-5">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input"
                  onChange={(e) => setLoginEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  onChange={(e) => setLoginPassword(e.target.value)}
                />

                <button
                  onClick={handleLogin}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* SIGNUP (RIGHT) */}
          {active && (
            <div className="p-10 md:p-14">
              <h1 className="text-3xl font-bold text-slate-900">
                Create Account
              </h1>
              <p className="text-slate-500 mt-2 mb-8">
                Choose your role
              </p>

              {signupError && (
                <p className="text-red-500 mb-4">{signupError}</p>
              )}

              <div className="space-y-5">
                <select
                  className="input"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin</option>
                </select>

                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input"
                  onChange={(e) => setSignupEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Create strong password"
                  className="input"
                  onChange={(e) => setSignupPassword(e.target.value)}
                />

                <button
                  onClick={handleSignup}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ================= IMAGE SLIDER ================= */}
        <div className="auth-image">

          {/* Dark overlay for text visibility */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>

          <img
            src="/images/3d-illustration-workspace.jpg"
            alt="Workspace"
            className="relative z-10"
          />

          <div className="auth-image-text text-white z-20">
            <h2 className="text-3xl font-bold mb-3">
              {active ? "Welcome Back!" : "Hello, Friend!"}
            </h2>
            <p className="text-indigo-100 mb-6">
              {active
                ? "Login with your credentials"
                : "Sign up to start your journey"}
            </p>

            <button
              onClick={() => setActive(!active)}
              className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              {active ? "Sign In" : "Sign Up"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
