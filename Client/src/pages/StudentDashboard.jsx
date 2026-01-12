import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatbotWidget from "../components/ChatbotWidget";
import StudyPlannerCard from "../components/StudyPlannerCard";
import CareerCard from "../components/CareerCard";
import InternshipCard from "../components/InternshipCard";
import CourseCard from "../components/CourseCard";
import AlertCard from "../components/AlertCard";
import SkillChart from "../components/SkillChart";
import RoadmapList from "../components/RoadmapList";

/**
 * Student Dashboard
 * - Career Recommendation & Skill Gap are core (logic-ready)
 * - Other modules are structured dummy (API-ready)
 */
export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">

      {/* Fixed Layout */}
      <Topbar />
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-64 pt-20 px-10 pb-14 max-w-[1600px]">


        {/* Page Intro */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back 👋
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Track your career journey, skill growth, and personalized AI
            recommendations — all in one place.
          </p>
        </section>

        {/* Chatbot (Home View Only) */}
        <ChatbotWidget />

        {/* DASHBOARD SECTIONS */}
        <div className="space-y-8 mt-8">

          {/* A. Alerts & Notifications */}
          <AlertCard />

          {/* B. AI Career Recommendation */}
         <CareerCard/>

            {/* Later connect:
                - careerService
                - careerMapper / ML output
            */}
          

          {/* C. Skill Gap Analysis */}
         
            {/* SkillGapService + SkillGapCalculator will plug here */}
         <SkillChart/>

          {/* D. Learning Roadmap */}
          

            {/* roadmapService → ML-ready */}
         <RoadmapList/>

          {/* E + F + G Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Courses */}
            <CourseCard />

            {/* Internships */}
            <InternshipCard />

            {/* Study Planner */}
            <StudyPlannerCard />
          </section>
        </div>
      </main>
    </div>
  );
}
