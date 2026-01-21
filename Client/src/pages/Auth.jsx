import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import workspaceImg from "../assets/3d-illustration-workspace.jpg";

export default function Auth() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  
  // ================= SIGNUP STATE =================
  const [signupName, setSignupName] = useState(""); // ✅ added
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [signupError, setSignupError] = useState("");
// ================= LOGIN STATE =================
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

 

  // ================= SIGNUP =================
  const handleSignup = () => {
    if (!signupName.trim()) {
      return setSignupError("Name is required");
    }

    if (!validatePassword(signupPassword)) {
      return setSignupError(
        "Password must contain uppercase, lowercase, number & symbol"
      );
    }

    localStorage.setItem(
      "lakshyaUser",
      JSON.stringify({
        name: signupName,     // ✅ added
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
      })
    );

    setActive(false); // move to login
  };

   // ================= LOGIN =================
  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("lakshyaUser"));

    if (!user) {
      return setLoginError("Please sign up first");
    }

    if (loginEmail === user.email && loginPassword === user.password) {
      localStorage.setItem(
        "lakshyaSession",
        JSON.stringify({
          role: user.role,
          onboardingCompleted: false,
        })
      );

      if (user.role === "student") navigate("/onboardingform/student");
      else if (user.role === "counselor") navigate("/dashboard/counselor");
      else navigate("/dashboard/admin");
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleRoleBasedNavigation = () => {
  if (signupRole === "student") {
    navigate("/onboardingform/student");
  } else if (signupRole === "counselor") {
    navigate("/dashboard/counselor");
  } else if (signupRole === "admin") {
    navigate("/dashboard/admin");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2ff] px-6">
      <div className={`auth-slider ${active ? "active" : ""}`}>

        

        {/* ================= FORMS ================= */}
        <div className="auth-forms">
          <div className="field">

        
          {/* SIGNUP */}
          {active && (
            <div className="auth-card">
              <h1 className="text-3xl font-bold text-slate-900">
                Sign Up
              </h1>
              <p className="text-slate-500 mt-2 mb-8">
                Create your account
              </p>

              {signupError && (
                <p className="text-red-500 mb-4">{signupError}</p>
              )}

              <div className="from-stack">

                {/* ✅ Name field added */}
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input"
                  onChange={(e) => setSignupName(e.target.value)}
                />
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

                <label>Email</label>

                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input"
                  onChange={(e) => setSignupEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Create strong password"
                  className="input"
                  onChange={(e) => setSignupPassword(e.target.value)}
                />

                <button
  onClick={() => setActive(false)}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
>
  Sign In
</button>


                
              </div>
            </div>
          )}

            {/* LOGIN */}
          {!active && (
            <div className="auth-card">
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h1>
              <p className="text-slate-500 mt-2 mb-8">
                Sign in
              </p>

              {loginError && (
                <p className="text-red-500 mb-4">{loginError}</p>
              )}

              <div className="from-stack">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input"
                  onChange={(e) => setLoginEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input"
                  onChange={(e) => setLoginPassword(e.target.value)}
                />

                <button
  onClick={handleRoleBasedNavigation}
  className="w-full mt-2 border border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50"
>
  Continue as {signupRole.charAt(0).toUpperCase() + signupRole.slice(1)}
</button>

               <button
  onClick={() => setActive(true)}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
>
  Create Account
</button>

                
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
