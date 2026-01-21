import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const session = JSON.parse(localStorage.getItem("lakshyaSession"));
  const location = useLocation();

  // 1️⃣ Not logged in
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // 2️⃣ Role mismatch
  if (role && session.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Prevent going back to onboarding after completion
  if (
    session.role === "student" &&
    session.onboardingCompleted &&
    location.pathname === "/onboardingform/student"
  ) {
    return <Navigate to="/dashboard/student" replace />;
  }

  // 4️⃣ Lock student dashboard until onboarding is completed
  if (
    session.role === "student" &&
    !session.onboardingCompleted &&
    location.pathname.startsWith("/dashboard")
  ) {
    return <Navigate to="/onboardingform/student" replace />;
  }

  return children;
}
