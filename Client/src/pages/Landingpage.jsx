const btn={
padding:"8px 16px",borderRadius:20,border:"1px solid #ddd",marginLeft:8,background:"#fff"
}
const cta={
padding:"14px 32px",borderRadius:30,border:0,background:"#fff",color:"#99F6E4",margin:10
}
const footTitle = {
  color: "#ffffff",
  marginBottom: 18,
  fontWeight: 600,
  fontSize: 18,
};
const footLink = {
  marginBottom: 10,
  cursor: "pointer",
  color: "#99F6E4",
  transition: "0.3s",
};
const aboutPara = {
  color: "#475569",
  lineHeight: 1.75,
  fontSize: 15,
  marginBottom: 18,
  textAlign: "justify",
};


import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import logo from "../assets/Logo.png";
import ksv from "../assets/ksv.svg";
import svkm from "../assets/svkm.svg";
import video from "../assets/hero.mp4";

import React from "react";
function NavItem({ text, target }) {
  const [hover, setHover] = React.useState(false);

  return (
    <a
      href={`#${target}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
         position: "relative",
        textDecoration: "none",
        color: hover ? "#14B8A6" : "#064E3B",
        fontWeight: hover ? 600 : 500,
        padding: "6px 2px",
        transition: "0.3s",
      }}
    >
      {text}

       <span
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-6px",
          width: hover ? "70%" : "0%",
          height: "2px",
          background: "linear-gradient(90deg,#064E3B,#0E9384,#14B8A6,#99F6E4)",
          transform: "translateX(-50%)",
          transition: "0.3s",
        }}
      />
    </a>
  );
}

export default function Landingpage() {
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <div style={{
        position: "fixed",
        top: 0,
         left: 0,
        width: "100%",
        background: "rgba(255,255,255,0.95)",
         backdropFilter: "blur(10px)",
        borderBottom: "1px solid #99F6E4",
        boxShadow: "0 4px 25px rgba(0,0,0,0.05)",
        zIndex: 999
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
            {/* LOGO */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 ,fontSize: "18px" }}>
            <img src={logo} height="60" />
            <span>
            <b style={{ color: "#064E3B", fontSize: 22 }}>LAKSHYA</b></span>
          </div>

          <div style={{ display: "flex", gap: 22 ,fontSize: "18px"}}>
            <NavItem text="Home" target="home" />
            <NavItem text="Features" target="features" />
            <NavItem text="User Roles" target="user roles"/>
            <NavItem text="Rules" target="rules"/>
             <NavItem text="About Us" target="about us"/>
            <NavItem text="Contact" target="contact" />
          </div>
           {/* BUTTON */} {/* SIGNUP */}
           <button
            onClick={() => navigate("/auth")}
            style={{
              padding: "8px 22px",
              borderRadius: 22,
              color :"#ffffff",
              border: "2px solid transparent",
              background: "linear-gradient(135deg,#0E9384,#14B8A6)",
              backgroundOrigin: "border-box",
               backgroundClip: "padding-box, border-box",
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(20,184,166,.4)",
              transition: "0.3s",
            }}>
            Sign Up
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px" }}>
                  
              <img src={svkm} height="62"/>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px" }}>
                  
              <img src={ksv} height="62"/>
              </div>
        </div>

         
      </div>
{/* RESPONSIVE FIX */}
  <style>{`
    @media (max-width: 900px) {
      section > div { grid-template-columns: repeat(2,1fr); }
    }
    @media (max-width: 600px) {
      section > div { grid-template-columns: 1fr; }
    }
  `}</style>
      {/* HERO */}
      <section id="home" style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#F6FBFA",
         overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       
      }}>
        {/* VIDEO BACKGROUND */}
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
         {/* HERO TEXT */}
        <div style={{ textAlign: "center", 
            position: "relative",
      zIndex: 5,
      maxWidth: 800 ,
       margin: "auto",
      color: "#fff",
      padding: "0 20px",}}>
          <h1 style={{ fontSize: 56, color: "#064E3B", fontWeight: 800, marginBottom: 20,
        letterSpacing: "-1px", }}>
            <Typewriter words={["Welcome to LAKSHYA"]} loop={1} cursor
        cursorStyle="|"
        typeSpeed={80}
        deleteSpeed={50}
        delaySpeed={2000} />
          </h1>
          <p style={{ color: "#0E9384", fontSize: 20}}>
            Smart Academic Automation Platform
          </p>
        </div>
      </section>
       {/* ================= FEATURES ================= */}
    {/* ================= FEATURES ================= */}
<section id="features"
  style={{
    maxWidth: 1100,
    margin: "140px auto",
    padding: "60px 32px",
    background: "#F8FAFC",           // Soft section background
    borderRadius: 28
  }}
>
  <h2
    style={{
      textAlign: "center",
      fontSize: 36,
      marginBottom: 70,
      color: "#0F172A",
      fontWeight: 700,
      letterSpacing: "-0.5px"
    }}
  >
    Features
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 32
    }}
  >
    {[
      ["Instant Marks Notification","Automatically sends marks and remarks to students and parents through secure notifications after faculty entry."],
      ["Attendance Risk Alert","Monitors attendance continuously and alerts stakeholders when attendance falls below the required threshold."],
      ["KSV Exam Eligibility Checker","Evaluates subject-wise eligibility based on official KSV academic rules and institutional criteria."],
      ["Academic Health Score","Calculates a consolidated academic performance score using attendance, marks, and submission trends."],
      ["Missed Class Recovery Tracker","Identifies missed lectures and provides structured recovery material and guidance for students."],
      ["Parent–Faculty Messaging","Enables secure and transparent communication between parents and faculty within the platform."],
      ["Internal Marks Dispute System","Provides a formal digital channel for raising and resolving marks-related queries."],
      ["Monthly Academic Summary","Automatically generates and delivers monthly academic progress summaries to parents and mentors."],
      ["Student Profile & Academic Record Vault","Maintains a centralized digital academic record and mentoring file for each student."]
    ].map(([title, desc]) => (
      <div
        key={title}
        style={{
          background: "#F1F5F9",            // Light card background
          borderRadius: 18,
          padding: "26px 28px",
          minHeight: 170,
          border: "1px solid #E2E8F0",
          transition: "0.35s ease",
          boxShadow: "0 10px 25px rgba(15,23,42,.04)"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(15,23,42,.12)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(15,23,42,.04)";
        }}
      >
        <h3
          style={{
            marginBottom: 12,
            color: "#0F172A",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.3px"
          }}
        >
          {title}
        </h3>

        <p style={{ color: "#475569", lineHeight: 1.65, fontSize: 14 }}>
          {desc}
        </p>
      </div>
    ))}
  </div>

  {/* RESPONSIVE FIX */}
  <style>{`
    @media (max-width: 900px) {
      section > div { grid-template-columns: repeat(2,1fr); }
    }
    @media (max-width: 600px) {
      section > div { grid-template-columns: 1fr; }
    }
  `}</style>
</section>
       
{/* ================= USER ROLES ================= */}
<section id="user roles"
  style={{
    maxWidth: 1100,
    margin: "140px auto",
    padding: "80px 40px",
    background: "#F8FAFC",
    borderRadius: 28,
  }}
>
  <h2
    style={{
      textAlign: "center",
      fontSize: 34,
      marginBottom: 60,
      color: "#0F172A",
      fontWeight: 700,
    }}
  >
    System User Roles
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 62,
    }}
  >
    {[
      [
        "Student",
        "Accesses academic records, attendance status, marks, eligibility, recovery materials, certificates, and personal profile information."
      ],
      [
        "Faculty",
        "Enters marks, attendance, manages queries, monitors at-risk students, and communicates with parents and mentors."
      ],
      [
        "Admin",
        "Supervises mentoring activities, monitors academic health, manages eligibility rules, and oversees system operations."
      ],
    ].map(([title, desc]) => (
      <div
        key={title}
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 18,
          padding: "28px 26px",
          minHeight: 200,
          boxShadow: "0 10px 30px rgba(15,23,42,.05)",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 20px 45px rgba(15,23,42,.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,.05)";
        }}
      >
        <h3 style={{ marginBottom: 12, color: "#0F172A", fontSize: 18, fontWeight: 600 }}>
          {title}
        </h3>
        <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.65 }}>
          {desc}
        </p>
      </div>
    ))}
  </div>

  {/* RESPONSIVE */}
  <style>{`
    @media (max-width: 900px) {
      section > div { grid-template-columns: repeat(2,1fr); }
    }
    @media (max-width: 600px) {
      section > div { grid-template-columns: 1fr; }
    }
  `}</style>
</section>
    {/* ================= ABOUT US ================= */}
<section id="about us"
  style={{
    maxWidth: 1100,
    margin: "140px auto",
    padding: "80px 40px",
    background: "#FFFFFF",
    borderRadius: 28,
    boxShadow: "0 20px 60px rgba(15,23,42,.05)",
  }}
>
  <h2
    style={{
      textAlign: "center",
      fontSize: 34,
      marginBottom: 40,
      color: "#0F172A",
      fontWeight: 700,
    }}
  >
    About LDRP Institute of Technology & Research
  </h2>

  <p style={aboutPara}>
    LDRP Institute of Technology and Research, Gandhinagar was established in the academic year 2005–2006 and has steadily progressed as a leading institute of technical education in Gujarat. The institute offers undergraduate and postgraduate programs in Engineering, Management, and Computer Applications.
  </p>

  <p style={aboutPara}>
    The institute is recognized for imparting quality education, encouraging research-based learning, and fostering innovation among students. It plays a vital role in producing skilled professionals equipped to meet industry and societal demands.
  </p>

  <p style={aboutPara}>
    LDRP Institute of Technology and Research is a constituent institute of Kadi Sarva Vishwavidyalaya (KSV), a state university established by the Government of Gujarat under Act 21 of 2007 and approved by the University Grants Commission (UGC).
  </p>

  <div
    style={{
      marginTop: 50,
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 30,
      textAlign: "center",
    }}
  >
    {[
      ["Established", "2005–2006"],
      ["Affiliated University", "Kadi Sarva Vishwavidyalaya"],
      ["Programs Offered", "B.E., M.B.A., M.C.A."],
    ].map(([title, value]) => (
      <div
        key={title}
        style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: "26px 20px",
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, color: "#0F172A" }}>
          {value}
        </div>
        <div style={{ marginTop: 6, color: "#64748B", fontSize: 14 }}>
          {title}
        </div>
      </div>
    ))}
  </div>
</section>



      {/* FOOTER */}
      <footer id="contact"
      style={{
        background: "#064E3B",
        color: "#99F6E4",
        textAlign: "center",
         padding: "90px 20px 40px",
          marginTop: 120,
    position: "relative",
      }}>
        <div
    style={{
      maxWidth: 1200,
      margin: "auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
      gap: 60,
    }}
  >
     {/* BRAND */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <img src={logo} height="62" />
            <span style={{ fontSize: 22 }}>
              <b style={{ color: "#99F6E4" }}>Lakshya</b>
            </span>
            <span style={{ color: "#ffffff", fontSize: 18 }}>@KSV</span>
          </div>
    
          <p style={{ maxWidth: 280, lineHeight: 1.7, color: "#99F6E4" }}>
            Inspiring students to innovate, collaborate and track academic excellence under KSV University.
          </p>
        </div>
    
        {/* QUICK LINKS */}
        <div>
          <h3 style={footTitle}>Quick Links</h3>
          {["Home","Features","User Roles","Rules","About Us","Contact"].map((l)=>(
            <p key={l} style={footLink}>{l}</p>
          ))}
        </div>
    
        {/* CONTACT */}
        <div>
          <h3 style={footTitle}>Contact Us</h3>
          <p>Gandhinagar, Gujarat</p>
          <p>KSV University</p>
          <p>info@collegeerp.in</p>
          <p>+91 79 0000 0000</p>
        </div>
    
        {/* FOLLOW */}
        <div>
          <h3 style={footTitle}>Follow Us</h3>
          <p style={footLink}>LinkedIn</p>
          <p style={footLink}>Instagram</p>
          <p style={footLink}>Twitter</p>
        </div>
      </div>
    
      {/* BOTTOM BAR */}
      <div
        style={{
          marginTop: 70,
          paddingTop: 22,
          borderTop: "1px solid rgba(255,255,255,.08)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          marginInline: "auto",
          color: "#99F6E4",
          fontSize: 14,
        }}
      >
        <span>© 2026 College ERP System • Affiliated to KSV University</span>
        <span style={{ color: "#99F6E4" }}>Designed for Academic Excellence</span>
      </div>
    </footer>
    
        </>
      );
    }
    
