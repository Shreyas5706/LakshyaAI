import { useState } from "react";
import { Users, AlertTriangle, BarChart3, Target } from "lucide-react";

import TopBar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import MetricCard from "../components/dashboard/MetricCard";
import StudentAnalytics from "../components/dashboard/StudentAnalytics";
import SkillGapInsights from "../components/dashboard/SkillGapInshights";
import CareerTrends from "../components/dashboard/CareerTrends";
import AICounselingPanel from "../components/dashboard/AICounselingPanel";
import QuickActions from "../components/dashboard/QuickActions";

const CounselorDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Embedded CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        :root {
          --background: 207 54% 6%;
          --foreground: 160 4% 81%;
          --card: 207 45% 12%;
          --card-foreground: 160 4% 81%;
          --popover: 207 45% 12%;
          --popover-foreground: 160 4% 81%;
          --primary: 200 15% 24%;
          --primary-foreground: 160 4% 81%;
          --secondary: 207 42% 11%;
          --secondary-foreground: 160 4% 81%;
          --muted: 200 15% 24%;
          --muted-foreground: 195 7% 63%;
          --accent: 200 15% 24%;
          --accent-foreground: 160 4% 81%;
          --destructive: 0 40% 35%;
          --destructive-foreground: 160 4% 81%;
          --border: 200 15% 35%;
          --input: 200 15% 24%;
          --ring: 200 15% 35%;
          --radius: 0.75rem;
          --lakshya-bg-primary: 207 54% 6%;
          --lakshya-bg-secondary: 207 42% 11%;
          --lakshya-card: 207 30% 21%;
          --lakshya-border: 200 15% 35%;
          --lakshya-text-secondary: 195 7% 63%;
          --lakshya-text-primary: 160 4% 81%;
          --chart-1: 200 40% 45%;
          --chart-2: 180 30% 40%;
          --chart-3: 220 35% 50%;
          --chart-4: 160 25% 45%;
          --chart-5: 240 30% 45%;
          --sidebar-background: 207 42% 11%;
          --sidebar-foreground: 160 4% 81%;
          --sidebar-primary: 200 15% 24%;
          --sidebar-primary-foreground: 160 4% 81%;
          --sidebar-accent: 200 15% 28%;
          --sidebar-accent-foreground: 160 4% 81%;
          --sidebar-border: 200 15% 35%;
          --sidebar-ring: 200 15% 35%;
          --risk-low: 160 30% 40%;
          --risk-medium: 40 40% 45%;
          --risk-high: 0 35% 45%;
          --gradient-card: linear-gradient(135deg, hsl(207 30% 21%) 0%, hsl(207 35% 18%) 100%);
          --gradient-sidebar: linear-gradient(180deg, hsl(207 42% 11%) 0%, hsl(207 45% 8%) 100%);
        }

        body {
          font-family: 'Inter', sans-serif;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }

        h1,h2,h3,h4,h5,h6 {
          font-family: 'Space Grotesk', sans-serif;
        }

        .card-gradient {
          background: var(--gradient-card);
        }

        .sidebar-gradient {
          background: var(--gradient-sidebar);
        }

        .glass-effect {
          backdrop-filter: blur(12px);
          background: hsl(var(--secondary) / 0.8);
        }

        .metric-value {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 2rem;
        }

        .risk-low {
          color: hsl(var(--risk-low));
          background: hsl(var(--risk-low) / 0.15);
        }

        .risk-medium {
          color: hsl(var(--risk-medium));
          background: hsl(var(--risk-medium) / 0.15);
        }

        .risk-high {
          color: hsl(var(--risk-high));
          background: hsl(var(--risk-high) / 0.15);
        }
      `}</style>

      <TopBar />
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
     <main className="relative z-10 pt-16 pl-64 transition-all duration-300">

        <div className="p-6 lg:p-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              Welcome back, Dr. Sharma
            </h2>
            <p className="text-muted-foreground">
              Here's an overview of your students' progress and career readiness.
            </p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Total Students"
              value="67"
              subtitle="Across 3 batches"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              delay={0}
            />

            <MetricCard
              title="Students at Risk"
              value="8"
              subtitle="Require attention"
              icon={AlertTriangle}
              trend={{ value: 2, isPositive: false }}
              delay={100}
            />

            <MetricCard
              title="Average Skill Score"
              value="72%"
              subtitle="+5% from last month"
              icon={BarChart3}
              trend={{ value: 5, isPositive: true }}
              delay={150}
            />

            <MetricCard
              title="Career Readiness"
              value="68%"
              subtitle="Industry benchmark: 75%"
              icon={Target}
              trend={{ value: 3, isPositive: true }}
              delay={200}
            />
          </div>

          {/* Student Analytics */}
          <div className="mb-8">
            <StudentAnalytics />
          </div>

          {/* Charts & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SkillGapInsights />
            <CareerTrends />
          </div>

          {/* AI Panel & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AICounselingPanel />
            </div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CounselorDashboard;
