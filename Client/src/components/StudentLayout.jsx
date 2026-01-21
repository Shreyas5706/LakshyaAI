import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../pages/student/Header";
import Sidebar from "../pages/student/Sidebar";

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🚫 Disable body scroll (VERY IMPORTANT)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="h-screen w-full bg-[#F6FBFA] overflow-hidden">

      {/* ===== STICKY HEADER ===== */}
      <Header setSidebarOpen={setSidebarOpen} />

      {/* ===== FIXED SIDEBAR ===== */}
      <Sidebar open={sidebarOpen} />

      {/* ===== SCROLLABLE CONTENT ONLY ===== */}
      <main
        className={`
          pt-[72px]                     /* header height */
          transition-all duration-300
          ${sidebarOpen ? "ml-[240px]" : "ml-[72px]"}
          h-[calc(100vh-72px)]
          overflow-y-auto
          px-6 py-6
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
