import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Moon,
  LogOut,
  Save,
} from "lucide-react";

/*
================ BACKEND INTEGRATION NOTES =================

1. GET /api/student/settings
   → returns saved preferences

2. PUT /api/student/settings
   → save updated preferences

3. POST /api/logout
   → destroy session / token

⚠️ Currently using local state only.
===========================================================
*/

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    counselorAlerts: true,
    darkMode: false,
    profileVisibility: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    /*
      BACKEND:
      PUT /api/student/settings
      body: settings
    */
    alert("Settings saved successfully");
  };

  return (
    <section className="settings-page">

      {/* ================= HEADER ================= */}
      <div className="settings-header">
        <div className="icon-box">
          <User size={26} />
        </div>
        <h1>Settings</h1>
        <p>Manage your account preferences & privacy</p>
      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="settings-card">

        {/* ===== NOTIFICATIONS ===== */}
        <Block
          icon={Bell}
          title="Notifications"
          desc="Control how and when we notify you"
        >
          <Toggle
            label="Email Notifications"
            value={settings.emailNotifications}
            onChange={() => handleToggle("emailNotifications")}
          />
          <Toggle
            label="Counselor Booking Alerts"
            value={settings.counselorAlerts}
            onChange={() => handleToggle("counselorAlerts")}
          />
        </Block>

        {/* ===== APPEARANCE ===== */}
        <Block
          icon={Moon}
          title="Appearance"
          desc="Customize your dashboard experience"
        >
          <Toggle
            label="Dark Mode (Coming Soon)"
            value={settings.darkMode}
            onChange={() => handleToggle("darkMode")}
            disabled
          />
        </Block>

        {/* ===== PRIVACY ===== */}
        <Block
          icon={Shield}
          title="Privacy & Security"
          desc="Control visibility of your profile"
        >
          <Toggle
            label="Make Profile Visible to Counselors"
            value={settings.profileVisibility}
            onChange={() => handleToggle("profileVisibility")}
          />
        </Block>

        {/* ===== ACTIONS ===== */}
        <div className="actions">
          <button className="logout-btn">
            <LogOut size={16} />
            Logout
          </button>

          <button onClick={handleSave} className="save-btn">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Block = ({ icon: Icon, title, desc, children }) => (
  <div className="block">
    <div className="block-header">
      <div className="block-icon">
        <Icon size={18} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
    <div className="block-body">{children}</div>
  </div>
);

const Toggle = ({ label, value, onChange, disabled }) => (
  <div className={`toggle ${disabled ? "disabled" : ""}`}>
    <span>{label}</span>
    <button onClick={onChange} disabled={disabled}>
      <span className={value ? "on" : ""} />
    </button>
  </div>
);

/* ================= CSS ================= */

const css = `
.settings-page{
  display:flex;
  flex-direction:column;
  gap:32px;
}

/* HEADER */
.settings-header{
  text-align:center;
}

.icon-box{
  width:64px;height:64px;
  border-radius:16px;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0 auto;
}

.settings-header h1{
  font-size:2rem;
  font-weight:700;
  color:#064E3B;
  margin-top:14px;
}

.settings-header p{
  color:#64748b;
  margin-top:6px;
}

/* MAIN CARD */
.settings-card{
  background:rgba(255,255,255,.78);
  backdrop-filter:blur(18px);
  border-radius:32px;
  padding:36px;
  border:1px solid rgba(20,184,166,.25);
  box-shadow:0 30px 80px rgba(14,147,132,.25);
  display:flex;
  flex-direction:column;
  gap:28px;
}

/* BLOCK */
.block{
  display:flex;
  flex-direction:column;
  gap:14px;
}

.block-header{
  display:flex;
  gap:14px;
  align-items:center;
}

.block-icon{
  width:42px;height:42px;
  border-radius:12px;
  background:#ECFEFF;
  color:#0E9384;
  display:flex;
  align-items:center;
  justify-content:center;
}

.block-header h3{
  font-size:1.05rem;
  font-weight:700;
  color:#064E3B;
}

.block-header p{
  font-size:.8rem;
  color:#64748b;
}

.block-body{
  display:flex;
  flex-direction:column;
  gap:14px;
  padding-left:56px;
}

/* TOGGLE */
.toggle{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.toggle span{
  font-size:.9rem;
  color:#0f172a;
}

.toggle button{
  width:46px;
  height:26px;
  border-radius:999px;
  border:none;
  background:#E5F7F5;
  position:relative;
  cursor:pointer;
}

.toggle button span{
  position:absolute;
  top:3px;
  left:4px;
  width:20px;
  height:20px;
  border-radius:50%;
  background:white;
  transition:.2s;
}

.toggle button span.on{
  left:22px;
  background:#14B8A6;
}

.toggle.disabled{
  opacity:.5;
}

/* ACTIONS */
.actions{
  display:flex;
  justify-content:space-between;
  margin-top:10px;
}

.logout-btn{
  padding:12px 22px;
  border-radius:14px;
  border:1px solid #fecaca;
  background:#fff;
  color:#991b1b;
  font-weight:600;
  display:flex;
  gap:8px;
  align-items:center;
}

.save-btn{
  padding:12px 26px;
  border-radius:14px;
  border:none;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  font-weight:600;
  display:flex;
  gap:8px;
  align-items:center;
}
`;
