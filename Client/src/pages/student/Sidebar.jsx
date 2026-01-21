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
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const menu = [
    { name: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
    { name: "Profile", path: "/dashboard/student/profile", icon: User },
    { name: "Careers", path: "/dashboard/student/career-recommendation", icon: Compass },
    { name: "Skills", path: "/dashboard/student/skill-gap", icon: BarChart3 },
    { name: "Roadmap", path: "/dashboard/student/learning-roadmap", icon: Map },
    { name: "AI Chat", path: "/dashboard/student/ai-chatbot", icon: Bot },
    { name: "Counselor", path: "/dashboard/student/counselor-booking", icon: Calendar },
    { name: "Colleges", path: "/dashboard/student/college-recommendation", icon: GraduationCap },
    { name: "Settings", path: "/dashboard/student/settings", icon: Settings },
  ];

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <nav className="menu">
        {menu.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className="menu-item"
            onClick={() => setOpen(false)}
          >
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
  position:fixed;
  top:72px;
  left:0;
  height:calc(100vh - 72px);
  width:72px;
  background:rgba(255,255,255,0.75);
  backdrop-filter:blur(16px);
  border-right:1px solid rgba(20,184,166,0.25);
  transition:width .3s ease;
  z-index:40;
}

.sidebar.open{
  width:240px;
}

.menu{
  padding:14px 10px;
  display:flex;
  flex-direction:column;
  gap:6px;
}

.menu-item{
  display:flex;
  align-items:center;
  gap:14px;
  padding:12px;
  border-radius:12px;
  color:#064E3B;
  font-weight:500;
  text-decoration:none;
  transition:background .2s ease;
}

.menu-item:hover{
  background:rgba(20,184,166,0.12);
}

.menu-item.active{
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
}

.menu-item span{
  white-space:nowrap;
}
`;
