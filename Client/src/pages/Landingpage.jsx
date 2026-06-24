import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import logo from "../assets/Logo.png";
import API from "../services/api";
import { getCookie } from "../utils/cookies";
import "./styles/LandingPage.css";
import GradientText from "../components/GradientText";
import Prism from "../components/Prism";
import TextType from "../components/TextType";
import AnimatedContent from "../components/AnimatedContent";
import BorderGlow from "../components/BorderGlow";
import studentImg from "../assets/student.png";
import facultyImg from "../assets/faculty.png";
import adminImg from "../assets/admin.png";
import heroAvatar from "../assets/hero-avatar.png";
import aboutAvatar from "../assets/about-avatar.png";
import footerAvatar from "../assets/footer-avatar.png";
import { FaLinkedinIn, FaInstagram, FaTwitter } from "react-icons/fa";

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
  const session = getCookie("lakshyaSession");

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

  const handleDashboardRedirect = () => {
    if (!session) return;
    if (session.role === "student") {
      if (session.onboardingCompleted) {
        navigate("/student/dashboard");
      } else {
        navigate("/student/onboarding");
      }
    } else if (session.role === "counselor") {
      navigate("/counselor/dashboard");
    } else if (session.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

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

            <button className="signup-btn" onClick={() => navigate("/auth")}>
              Sign Up
            </button>

          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className="hero-section">
        <div className="hero-visual">
          <div className="hero-avatar-container">
            <img
              src={heroAvatar}
              alt="Lakshya Student"
              className="hero-avatar"
            />
          </div>
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
            bloom={2}
          />

          <div className="hero-text-overlay">
            <TextType
              text={["WELCOM TO LAKSHYA", "Smart Academic Automation Platform"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              variableSpeedEnabled={false}
              variableSpeedMin={60}
              variableSpeedMax={120}
              cursorBlinkDuration={0.5}
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <AnimatedContent
        distance={100}
        direction="vertical"
        reverse={false}
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.1}
        delay={0}
      >
        <div>
          <section id="features" className="section features-section">
            <GradientText
              colors={["#564877", "#9596C4", "#C381B0"]}
              animationSpeed={8}
              showBorder={false}
              className="custom-class"
            >
              Features
            </GradientText>

            <div style={{ padding: "2em" }}>
              <div className="grid-3">
                {[
                  [
                    "Instant Marks Notification",
                    "Automatically sends marks and remarks to students and parents.",
                  ],
                  [
                    "Attendance Risk Alert",
                    "Monitors attendance and alerts when low.",
                  ],
                  [
                    "KSV Exam Eligibility Checker",
                    "Checks eligibility based on rules.",
                  ],
                  ["Academic Health Score", "Calculates performance score."],
                  [
                    "Missed Class Recovery Tracker",
                    "Provides recovery materials.",
                  ],
                  ["Parent–Faculty Messaging", "Secure communication system."],
                  ["Internal Marks Dispute System", "Resolve marks queries."],
                  ["Monthly Academic Summary", "Monthly progress reports."],
                  ["Student Profile Vault", "Central academic record system."],
                ].map(([title, desc]) => (
                  <BorderGlow
                    edgeSensitivity={30}
                    glowColor="163 163 255"
                    backgroundColor="#FFFFFF"
                    borderRadius={28}
                    glowRadius={40}
                    glowIntensity={1}
                    coneSpread={25}
                    animated={false}
                    colors={["#564877", "#9596C4", "#C381B0"]}
                  >
                    <div className="feature-content" key={title}>
                      <h3 className="feature-h3">{title}</h3>
                      <p className="feature-para">{desc}</p>
                    </div>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </section>
        </div>
      </AnimatedContent>

      {/* ================= USER ROLES ================= */}
      <AnimatedContent
        distance={100}
        direction="vertical"
        reverse={false}
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.1}
        delay={0}
      >
        <div>
          <section id="user-roles" className="section roles-section">
            <GradientText
              colors={["#564877", "#9596C4", "#C381B0"]}
              animationSpeed={8}
              showBorder={false}
              className="custom-class"
            >
              User Roles
            </GradientText>
            <div className="grid-roles">
              {[
                [
                  "Student",
                  studentImg,
                  "Accesses academic records, attendance, marks, eligibility, recovery materials, certificates, and profile information.",
                ],
                [
                  "Faculty",
                  facultyImg,
                  "Manages marks, attendance, monitors students, handles queries, and communicates with parents.",
                ],
                [
                  "Admin",
                  adminImg,
                  "Supervises academic system, manages rules, monitors performance, and controls operations.",
                ],
              ].map(([title, image, desc]) => (
                <div className="card role-card" key={title}>
                  <img src={image} alt={title} className="role-image" />
                  <h3 className="role-h3">{title}</h3>
                  <p className="role-para">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </AnimatedContent>

      {/* ================= ABOUT ================= */}
      <AnimatedContent
        distance={100}
        direction="vertical"
        reverse={false}
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.1}
        delay={0}
      >
        <section id="about-us" className="section about-section">
          <div className="about-layout">
            {/* Left Side Image */}
            <div className="about-image-side">
              <img src={aboutAvatar} alt="About" className="about-avatar" />
            </div>

            {/* Right Side Content */}
            <div className="about-content-side">
              <GradientText
                colors={["#564877", "#9596C4", "#C381B0"]}
                animationSpeed={8}
                showBorder={false}
                className="about-heading"
              >
                About Us
              </GradientText>

              <div className="about-description-card">
                <p>
                  LDRP Institute of Technology and Research, Gandhinagar was
                  established in 2005–2006 and is a leading institute of
                  technical education in Gujarat.
                </p>

                <p>
                  The institute focuses on quality education, research and
                  innovation while producing skilled professionals.
                </p>

                <p>
                  It is a constituent institute of Kadi Sarva Vishwavidyalaya
                  (KSV), approved by UGC.
                </p>
              </div>

              <div className="about-grid">
                {[
                  ["2005+", "Established"],
                  ["10+", "Departments"],
                  ["5000+", "Students"],
                ].map(([value, label]) => (
                  <div className="about-stat" key={label}>
                    <h3>{value}</h3>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <button className="about-btn">Learn More</button>
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="footer-section">
        <div className="footer-card">
          <div className="footer-wave"></div>

          <div className="footer-grid">
            <img
              src={footerAvatar}
              alt="Footer Avatar"
              className="footer-avatar"
            />
            {/* Brand */}
            <div className="footer-brand-column">
              <div className="footer-brand">
                <img src={logo} className="footer-logo" alt="logo" />

                <div>
                  <h3 className="footer-title">Lakshya</h3>
                  <span className="footer-sub">@KSV</span>
                </div>
              </div>

              <p className="footer-text">
                Inspiring students to innovate, collaborate and track academic
                excellence through a modern ERP platform.
              </p>
            </div>

            {/* Links */}
            <div className="footer-links-column">
              <h3 className="footer-heading">Quick Links</h3>

              {[
                ["Home", "home"],
                ["Features", "features"],
                ["User Roles", "user-roles"],
                ["About Us", "about-us"],
                ["Contact", "contact"],
              ].map(([text, target]) => (
                <a key={text} href={`#${target}`} className="footer-link">
                  {text}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="footer-contact-column">
              <h3 className="footer-heading">Contact</h3>

              <p className="footer-link">Gandhinagar, Gujarat</p>
              <p className="footer-link">KSV University</p>
              <p className="footer-link">info@lakshya.com</p>
              <p className="footer-link">+91 79 0000 0000</p>
            </div>

            {/* Social */}
            <div className="footer-social-column">
              <h3 className="footer-heading">Follow Us</h3>

              <div className="social-icons">
                <a href="/">
                  <FaLinkedinIn />
                </a>

                <a href="/">
                  <FaInstagram />
                </a>

                <a href="/">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Lakshya ERP. All Rights Reserved.</span>

            <span>Designed for Academic Excellence</span>
          </div>
        </div>
      </footer>
    </>
  );
}
