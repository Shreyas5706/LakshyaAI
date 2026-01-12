import { Navigate } from "react-router-dom";

export default function ProtectedStudentRoute({ children }) {
  const session = JSON.parse(localStorage.getItem("lakshyaSession"));

  // Not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but onboarding not completed
  if (!session.onboardingCompleted) {
    return <Navigate to="/student/onboarding" replace />;
  }

  // Authorized student
  return children;
}
