import { Menu, Bell } from "lucide-react";

export default function Header({ setSidebarOpen }) {
  return (
    <header className="student-header">
      {/* Left side */}
      <div className="header-left">
        <button
          className="icon-btn"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <Menu size={22} />
        </button>

        <h1 className="header-title">Student Dashboard</h1>
      </div>

      {/* Right side */}
      <div className="header-right">
        <button className="icon-btn">
          <Bell size={20} />
        </button>

        <div className="avatar">S</div>
      </div>

      {/* Inline CSS */}
      <style>{css}</style>
    </header>
  );
}

/* ================= CSS ================= */

const css = `
.student-header{
  position: sticky;
  top: 0;
  z-index: 40;

  height: 72px;
  padding: 0 28px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  border-bottom: 1px solid rgba(20,184,166,0.25);
}

/* LEFT */
.header-left{
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-title{
  font-size: 1.15rem;
  font-weight: 700;
  color: #064E3B;
}

/* RIGHT */
.header-right{
  display: flex;
  align-items: center;
  gap: 14px;
}

/* ICON BUTTON */
.icon-btn{
  width: 40px;
  height: 40px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  color: #065F46;
  border: none;
  cursor: pointer;

  transition: background .2s ease;
}

.icon-btn:hover{
  background: rgba(20,184,166,0.12);
}

/* AVATAR */
.avatar{
  width: 38px;
  height: 38px;
  border-radius: 50%;

  background: linear-gradient(135deg, #0E9384, #14B8A6);
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
}
`;
