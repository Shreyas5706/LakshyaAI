import { Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/Landingpage";
import Auth from "./pages/Auth";
import StudentOnboarding from "./components/StudentOnboarding";
import ProtectedStudentRoute from "./routes/ProtectedStudentRoute";
import StudentDashboard from "./pages/StudentDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding/student" element={<StudentOnboarding />} />
      
  <Route path="/auth" element={<Auth />} />
  <Route
    path="/onboarding/student"
    element={
      <ProtectedStudentRoute>
        <StudentOnboarding />
      </ProtectedStudentRoute>
    }
  />
    <Route
          path="/dashboard/student"
          element={<StudentDashboard />}
        />
      <Route path="/dashboard/counselor" element={<CounselorDashboard />} />
    </Routes>
  );
}

export default App;
