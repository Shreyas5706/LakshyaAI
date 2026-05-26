import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// public pages
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/auth/Auth";

// protected route
import ProtectedRoute from "./pages/auth/ProtectedRoute";

// dashboards
import StudentDashboard from "./pages/student/Dashboard";
import OnboardingForm from "./pages/student/OnboardingForm";
import CounselorDashboard from "./pages/counselor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* public routes : open for all */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />

        {/* student dashboard */}
        <Route
          path="/student/onboarding"
          element={
            <ProtectedRoute role="student">
              <OnboardingForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* counselor dashboard */}
        <Route
          path="/counselor/dashboard"
          element={
            <ProtectedRoute role="counselor">
              <CounselorDashboard />
            </ProtectedRoute>
          }
        />

        {/* admin dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
