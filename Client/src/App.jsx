import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// public pages
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/auth/Auth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// protected route
import ProtectedRoute from "./pages/auth/ProtectedRoute";

// dashboards
import StudentDashboard from "./pages/student/Dashboard";
import OnboardingForm from "./pages/student/OnboardingForm";
import CareerRecommendation from "./pages/student/CareerRecommendation";
import Courses from "./pages/student/Courses";
import SkillgapAnalysis from "./pages/student/SkillgapAnalysis";
import Chatbot from "./pages/student/Chatbot";
import CollegeRecommendation from "./pages/student/CollegeRecommendation";
import Profile from "./pages/student/Profile";
import CounselorDashboard from "./pages/counselor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* public routes : open for all */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
          path="/student/career"
          element={
            <ProtectedRoute role="student">
              <CareerRecommendation />
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

        <Route
          path="/student/learn"
          element={
            <ProtectedRoute role="student">
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/skills"
          element={
            <ProtectedRoute role="student">
              <SkillgapAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/chatbot"
          element={
            <ProtectedRoute role="student">
              <Chatbot />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/colleges"
          element={
            <ProtectedRoute role="student">
              <CollegeRecommendation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <Profile />
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
