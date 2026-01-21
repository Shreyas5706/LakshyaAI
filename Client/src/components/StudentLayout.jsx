import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../pages/student/Header";
import Sidebar from "../pages/student/Sidebar";

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🚫 Disable body scroll (only main scrolls)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="layout-root">
      {/* ===== HEADER (STICKY & TRANSPARENT) ===== */}
      <Header setSidebarOpen={setSidebarOpen} />

      {/* ===== SIDEBAR (FIXED LEFT) ===== */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* ===== MAIN CONTENT (ONLY SCROLL AREA) ===== */}
      <main
        className={`main-content ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Outlet />
      </main>

      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */

const css = `
/* ROOT */
.layout-root{
  height:100vh;
  width:100%;
  background:#F6FBFA;
  overflow:hidden;
}

/* MAIN CONTENT */
.main-content{
  position: relative;
  height:calc(100vh - 72px);
  overflow-y:auto;
  padding:24px;
  transition: margin-left .3s ease;
}

/* Sidebar spacing */
.sidebar-open{
  margin-left:240px;
}

.sidebar-closed{
  margin-left:72px;
}

/*  HIDE SCROLLBAR BUT KEEP SCROLL */
.main-content::-webkit-scrollbar{
  width:0;
  height:0;
}
.main-content{
  scrollbar-width:none;
}
`;
