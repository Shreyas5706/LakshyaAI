import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./index.css";

import LandingPage from "./pages/Landingpage";
import Auth from "./pages/Auth";
import ProtectedRoute from "./auth/ProtectedRoute";

import StudentOnboardingform from "./pages/StudentOnboardingform";
import StudentLayout from "./components/StudentLayout";
import StudentDashboard from "./dashboards/StudentDashboard";

/*import ProfileCreation from "./pages/student/ProfileCreation";
import CareerRecommendation from "./pages/student/CareerRecommendation";
import SkillGapAnalysis from "./pages/student/SkillGapAnalysis";
import LearningRoadmap from "./pages/student/LearningRoadmap";
import AIChatbot from "./pages/student/AIChatbot";
import CounselorBooking from "./pages/student/CounselorBooking";
import CollegeRecommendation from "./pages/student/CollegeRecommendation";*/

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
          <ProtectedRoute>
            <StudentOnboardingform />
          </ProtectedRoute>
        }
      />

      {/* ================= STUDENT DASHBOARD LAYOUT ================= */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard */}
        <Route
          index
          element={<StudentDashboard studentProfile={studentProfile} />}
        />

    

        {/* Dashboard pages 
        <Route
          path="profile"
          element={<ProfileCreation setStudentProfile={setStudentProfile} />}
        />

        <Route
          path="career-recommendation"
          element={<CareerRecommendation studentProfile={studentProfile} />}
        />

        <Route
          path="skill-gap"
          element={<SkillGapAnalysis studentProfile={studentProfile} />}
        />

        <Route
          path="learning-roadmap"
          element={<LearningRoadmap studentProfile={studentProfile} />}
        />

        <Route
          path="ai-chatbot"
          element={<AIChatbot studentProfile={studentProfile} />}
        />

        <Route
          path="counselor-booking"
          element={<CounselorBooking />}
        />

        <Route
          path="college-recommendation"
          element={<CollegeRecommendation studentProfile={studentProfile} />}
        />
      </Route>*/}
      </Route>
    </Routes>
  );
}
