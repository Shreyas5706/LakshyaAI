import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./index.css";

import LandingPage from "./pages/Landingpage";
import Auth from "./pages/Auth";
import ProtectedRoute from "./auth/ProtectedRoute";

import StudentOnboardingform from "./pages/StudentOnboardingform";
import StudentLayout from "./components/StudentLayout";
import StudentDashboard from "./dashboards/StudentDashboard";
import Profile from "./pages/student/Profile";
import LearningRoadmap from "./pages/student/LearningRoadmap";
import AIChatbot from "./pages/student/Chatbot";
import CounselorBooking from "./pages/student/CounselorBooking";
import CollegeRecommendation from "./pages/student/CollegeRecommendation";
import CareerRecommendation from "./pages/student/CareerRecommendation";
import SkillgapAnalysis from "./pages/student/SkillgapAnalysis";
import Settings from "./pages/student/Settings";
export default function App() {
  const [studentProfile, setStudentProfile] = useState(null);

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />

      {/* ================= STUDENT ONBOARDING ================= */}
      <Route
        path="/onboardingform/student"
        element={
          <ProtectedRoute role="student">
            <StudentOnboardingform />
          </ProtectedRoute>
        }
      />

      {/* ================= STUDENT DASHBOARD (LAYOUT) ================= */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard */}
        <Route
          index
          element={<StudentDashboard studentProfile={studentProfile} />}
        />

        {/* Profile page */}
        <Route path="profile" element={<Profile />} />
         <Route path="learning-roadmap" element={<LearningRoadmap />} />
         <Route path="ai-chatbot" element={<AIChatbot />} />
         <Route path="counselor-booking" element={<CounselorBooking />}/>
          <Route path="college-recommendation" element={<CollegeRecommendation />}/>
          <Route path="Settings" element={<Settings/>}/>
          <Route path="career-recommendation" element={<CareerRecommendation/>}/>
          <Route path="skill-gap" element={<SkillgapAnalysis/>}/>
      </Route>
    </Routes>
  );
}
