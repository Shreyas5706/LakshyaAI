import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import logo from "../assets/Logo.png";
import video from "../assets/hero.mp4";
import API from "../services/api";
import "./styles/LandingPage.css";

// Nav link component
function NavItem({ text, target }) {
  return (
    <a href={`#${target}`} className="nav-link">
      {text}
    </a>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState("connecting");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await API.get("/health");
        if (response.data && response.data.status === "ok") {
          setServerStatus("online");
        } else {
          setServerStatus("offline");
        }
      } catch (error) {
        console.error("Server connection check failed:", error);
        setServerStatus("offline");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-inner">

          <div className="nav-left">
            <img src={logo} className="logo" alt="Lakshya Logo" />
            <span className="brand">LAKSHYA</span>
            <div className={`server-status-pill ${serverStatus}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {serverStatus === "connecting" && "Connecting..."}
                {serverStatus === "online" && "Server Connected"}
                {serverStatus === "offline" && "Server Offline"}
              </span>
            </div>
          </div>

          <nav className="nav-center">
            <NavItem text="Home" target="home" />
            <NavItem text="Features" target="features" />
            <NavItem text="User Roles" target="user-roles" />
            <NavItem text="About Us" target="about-us" />
            <NavItem text="Contact" target="contact" />
          </nav>

          <div className="nav-right">
            <button
              className="signup-btn"
              onClick={() => navigate("/auth")}
            >
              Sign Up
            </button>
          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className="hero-section">

        <video autoPlay muted loop playsInline className="hero-video">
          <source src={video} type="video/mp4" />
        </video>

        <div className="hero-content">
          <h1 className="hero-title">
            <Typewriter
              words={["Welcome to LAKSHYA"]}
              loop={1}
              cursor
              cursorStyle="|"
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </h1>

          <p className="hero-subtitle">
            Smart Academic Automation Platform
          </p>
        </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="section features-section">
        <h2 className="section-title">Features</h2>

        <div className="grid-3">
          {[
            ["Instant Marks Notification","Automatically sends marks and remarks to students and parents."],
            ["Attendance Risk Alert","Monitors attendance and alerts when low."],
            ["KSV Exam Eligibility Checker","Checks eligibility based on rules."],
            ["Academic Health Score","Calculates performance score."],
            ["Missed Class Recovery Tracker","Provides recovery materials."],
            ["Parent–Faculty Messaging","Secure communication system."],
            ["Internal Marks Dispute System","Resolve marks queries."],
            ["Monthly Academic Summary","Monthly progress reports."],
            ["Student Profile Vault","Central academic record system."]
          ].map(([title, desc]) => (
            <div className="card feature-card" key={title}>
              <h3 className="feature-h3">{title}</h3>
              <p className="feature-para">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= USER ROLES ================= */}
      <section id="user-roles" className="section roles-section">
        <h2 className="section-title">System User Roles</h2>

        <div className="grid-roles">
          {[
            [
              "Student",
              "Accesses academic records, attendance, marks, eligibility, recovery materials, certificates, and profile information."
            ],
            [
              "Faculty",
              "Manages marks, attendance, monitors students, handles queries, and communicates with parents."
            ],
            [
              "Admin",
              "Supervises academic system, manages rules, monitors performance, and controls operations."
            ]
          ].map(([title, desc]) => (
            <div className="card role-card" key={title}>
              <h3 className="role-h3">{title}</h3>
              <p className="role-para">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about-us" className="section about-section">
        <h2 className="section-title">
          About LDRP Institute of Technology & Research
        </h2>

        <p className="about-text">
          LDRP Institute of Technology and Research, Gandhinagar was established in 2005–2006 and is a leading institute of technical education in Gujarat.
        </p>

        <p className="about-text">
          The institute focuses on quality education, research, and innovation while producing skilled professionals.
        </p>

        <p className="about-text">
          It is a constituent institute of Kadi Sarva Vishwavidyalaya (KSV), approved by UGC.
        </p>

        <div className="about-grid">
          {[
            ["Established", "2005–2006"],
            ["Affiliated University", "KSV"],
            ["Programs Offered", "B.E., M.B.A., M.C.A."]
          ].map(([title, value]) => (
            <div className="about-card" key={title}>
              <div className="about-value">{value}</div>
              <div className="about-label">{title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="footer">

        <div className="footer-grid">

          <div>
            <div className="footer-brand">
              <img src={logo} className="footer-logo" alt="logo" />
              <span className="footer-title">Lakshya</span>
              <span className="footer-sub">@KSV</span>
            </div>

            <p className="footer-text">
              Inspiring students to innovate, collaborate and track academic excellence.
            </p>
          </div>

          <div>
            <h3 className="footer-heading">Quick Links</h3>
            {[
              ["Home", "home"],
              ["Features", "features"],
              ["User Roles", "user-roles"],
              ["About Us", "about-us"],
              ["Contact", "contact"]
            ].map(([text, target]) => (
              <a key={text} href={`#${target}`} className="footer-link">
                {text}
              </a>
            ))}
          </div>

          <div>
            <h3 className="footer-heading">Contact</h3>
            <p className="footer-text">Gandhinagar, Gujarat</p>
            <p className="footer-text">KSV University</p>
            <p className="footer-text">info@collegeerp.in</p>
            <p className="footer-text">+91 79 0000 0000</p>
          </div>

          <div>
            <h3 className="footer-heading">Follow</h3>
            <p className="footer-link">LinkedIn</p>
            <p className="footer-link">Instagram</p>
            <p className="footer-link">Twitter</p>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 College ERP System • Affiliated to KSV University</span>
        <span>Designed for Academic Excellence</span>
        </div>

      </footer>
    </>
  );
}