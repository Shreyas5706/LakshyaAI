import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/cookies";

export default function ProtectedRoute({ children, role }) {
  // get user session from cookie : (login data)
  const session = getCookie("lakshyaSession");

  // get current page path : (where user is now)
  const location = useLocation();

  // check login : if no session → redirect to auth page
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // check role : if role not matching → redirect to home
  if (role && session.role !== role) {
    return <Navigate to="/" replace />;
  }

  // student flow : prevent going back to onboarding after completion
  // student flow control
  if (session.role === "student") {
    // If onboarding NOT completed → force onboarding
    if (!session.onboardingCompleted) {
      if (location.pathname !== "/student/onboarding") {
        return <Navigate to="/student/onboarding" replace />;
      }
    }

    // If onboarding completed → block going back
    if (session.onboardingCompleted) {
      if (location.pathname === "/student/onboarding") {
        return <Navigate to="/student/dashboard" replace />;
      }
    }
  }

  // allow access : if all conditions passed
  return children;
}
