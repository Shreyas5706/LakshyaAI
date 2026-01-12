import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  BookOpen,
  Briefcase,
  BarChart2,
  Calendar,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button.jsx";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Home", icon: Home, path: "/dashboard/student" },
    { name: "Courses", icon: BookOpen, path: "/dashboard/student/courses" },
    { name: "Internships", icon: Briefcase, path: "/dashboard/student/internships" },
    { name: "Skill Scores", icon: BarChart2, path: "/dashboard/student/skills" },
    { name: "Roadmap", icon: Calendar, path: "/dashboard/student/roadmap" },
    { name: "Study Planner", icon: MessageCircle, path: "/dashboard/student/study-planner" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-[#11212D] border-r border-[#4A5C6A]/50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="relative flex flex-col h-full py-4">
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#11212D] border border-[#4A5C6A]/50 shadow-md",
            "hover:bg-white/10"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-[#CCD0CF]" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-[#CCD0CF]" />
          )}
        </Button>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1 mt-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                style={{ animationDelay: `${index * 50}ms` }}
                className={({ isActive }) =>
                  cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "text-[#9BA8AB] hover:text-[#CCD0CF] hover:bg-white/5",
                    "animate-slide-in-left",
                    isActive && "bg-white/10 text-[#CCD0CF] shadow-sm"
                  )
                }
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    "text-[#9BA8AB]"
                  )}
                />

                {!collapsed && (
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        {!collapsed && (
          <div className="px-4 py-4 border-t border-[#4A5C6A]/50">
            <div className="p-3 rounded-lg bg-white/5 border border-[#4A5C6A]/30">
              <p className="text-xs text-[#9BA8AB] mb-1">
                Academic Year
              </p>
              <p className="text-sm font-medium text-[#CCD0CF]">
                2024–2025
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
