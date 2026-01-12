import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const roles = [
  {
    id: "student",
    title: "Student",
    icon: "🎓",
  },
  {
    id: "counselor",
    title: "Counselor",
    icon: "🧑‍🏫",
  },
  {
    id: "institution",
    title: "Institution",
    icon: "🏫",
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  const handleSignup = () => {
    if (!validatePassword(password)) {
      setError(
        "Password must contain uppercase, lowercase, number & special character"
      );
      return;
    }

    localStorage.setItem(
      "lakshyaUser",
      JSON.stringify({ email, password, role })
    );

    navigate("/login");
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
            Create your account
          </h1>
          <p className="text-slate-500 mt-2 mb-6">
            Choose your role to get started
          </p>

          {/* ROLE SELECT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {roles.map((r) => (
              <div
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`cursor-pointer border rounded-xl p-4 text-center transition
                  ${
                    role === r.id
                      ? "border-indigo-600 bg-indigo-50 shadow"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
              >
                <div className="text-2xl mb-2">{r.icon}</div>
                <h3 className="font-semibold text-slate-800">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          {/* FORM */}
          <div className="space-y-5">
            <input
              type="email"
              placeholder="email@example.com"
              className="input"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Create strong password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleSignup}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
            </button>
          </div>

          <p className="mt-8 text-sm text-center text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
