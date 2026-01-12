import { useState, useEffect } from "react";
import { Bell, Moon, Sun, User } from "lucide-react";
// import { getStudentProfile, getStudentAlerts } from "../services/StudentApi";

export default function TopBar() {
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // getStudentProfile().then(setProfile);
    // getStudentAlerts().then(setAlerts);

    // Dummy data
    setProfile({ name: "Dr. Sharma" });
    setAlerts([
      { message: "New student assigned" },
      { message: "Session scheduled at 4 PM" },
    ]);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50 h-16
        backdrop-blur-md
        bg-[#11212D]/80
        border-b border-[#4A5C6A]/50
      "
    >
      <div className="flex items-center justify-between h-full px-6">

        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <span className="text-[#CCD0CF] font-semibold text-lg tracking-wide">
            LAKSHYA
          </span>

          <div className="h-6 w-px bg-[#4A5C6A]/60" />

          <h1 className="text-[#9BA8AB] font-medium">
            Counselor Dashboard
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <Bell className="w-5 h-5 text-[#CCD0CF]" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F9C74F]" />
              )}
            </button>

            {showAlerts && (
              <div className="absolute right-0 mt-2 w-64 bg-[#253745] rounded-xl shadow-lg overflow-hidden">
                <h4 className="px-4 py-2 text-sm font-semibold text-[#CCD0CF] border-b border-[#4A5C6A]">
                  Notifications
                </h4>

                {alerts.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-[#9BA8AB]">
                    No new alerts
                  </p>
                ) : (
                  alerts.map((a, i) => (
                    <p
                      key={i}
                      className="px-4 py-2 text-sm text-[#CCD0CF] hover:bg-white/5 cursor-pointer"
                    >
                      {a.message}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-[#CCD0CF]" />
            ) : (
              <Moon className="w-5 h-5 text-[#CCD0CF]" />
            )}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition"
            >
              <User className="w-5 h-5 text-[#CCD0CF]" />
              <span className="text-sm text-[#CCD0CF]">
                {profile?.name || "Counselor"}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[#253745] rounded-xl shadow-lg">
                {["Profile", "Settings", "Logout"].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 text-sm text-[#CCD0CF] hover:bg-white/5"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
