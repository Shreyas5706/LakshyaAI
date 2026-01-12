import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("lakshyaUser"));

    if (!user) {
      setError("Please create an account first");
      return;
    }

    if (email === user.email && password === user.password) {
      navigate("/onboarding/student");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2ff] px-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-[#e0e7ff] p-10">
          <img
            src="/images/3d-illustration-workspace.jpg"
            alt="Workspace"
            className="rounded-2xl w-[420px]"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-10 md:p-14">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2 mb-8">
            Sign in to continue to your workspace
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" />
                Remember me
              </label>
              <span className="text-indigo-600 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Sign In
            </button>
          </div>

          <p className="mt-8 text-sm text-center text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
