import {
  LayoutDashboard,
  User,
  Compass,
  BarChart3,
  Map,
  Bot,
  Calendar,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open }) {
  const menu = [
    { name: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
    { name: "Profile", path: "/dashboard/student/profile", icon: User },
    { name: "Career Recommendation", path: "/dashboard/student/career-recommendation", icon: Compass },
    { name: "Skill Gap", path: "/dashboard/student/skill-gap", icon: BarChart3 },
    { name: "Learning Roadmap", path: "/dashboard/student/learning-roadmap", icon: Map },
    { name: "AI Chatbot", path: "/dashboard/student/ai-chatbot", icon: Bot },
    { name: "Counselor Booking", path: "/dashboard/student/counselor-booking", icon: Calendar },
    { name: "College Recommendation", path: "/dashboard/student/college-recommendation", icon: GraduationCap },
    { name: "Settings", path: "/dashboard/student/settings", icon: Settings },
  ];

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <nav className="menu">
        {menu.map(({ name, path, icon: Icon }) => (
          <NavLink key={name} to={path} className="menu-item" onClick={() => setSidebarOpen?.(false)}>
            <Icon size={22} />
            {open && <span>{name}</span>}
          </NavLink>
        ))}

       
      </nav>

      <style>{css}</style>
    </aside>
  );
}

/* ================= CSS ================= */

const css = `
.sidebar{
  position: fixed;
  top: 72px; /* below header */
  left: 0;
  height: calc(100vh - 72px);
  width: 72px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(16px);
  border-right: 1px solid rgba(20,184,166,0.25);
  transition: width .3s ease;
  z-index: 30;
}

.sidebar.open{
  width: 240px;
}

.menu{
  padding: 18px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-item{
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  color: #064E3B;
  font-weight: 500;
  text-decoration: none;
  transition: background .2s ease;
}

.menu-item:hover{
  background: rgba(20,184,166,0.12);
}

.menu-item.active{
  background: linear-gradient(135deg, #0E9384, #14B8A6);
  color: white;
}

.menu-item span{
  white-space: nowrap;
}

.divider{
  height: 1px;
  margin: 10px 0;
  background: rgba(20,184,166,0.25);
}

.logout{
  background: none;
  border: none;
  cursor: pointer;
  color: #991B1B;
}
`;
