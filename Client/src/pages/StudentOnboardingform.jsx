import React, { useState, useEffect } from "react";
import { GraduationCap, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ================= STATIC DATA ================= */

const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir",
  "Ladakh","Puducherry","Chandigarh"
];

const educationLevels = [
  "10th (Secondary)",
  "12th (Higher Secondary)",
  "Undergraduate (UG)",
  "Postgraduate (PG)"
];

const streams = [
  "Computer Science","Information Technology","Data Science & AI",
  "Commerce","Arts / Humanities","Mechanical Engineering",
  "Civil Engineering","Electrical Engineering","Medical","Law","MBA","Other"
];

const skillsList = [
  "Communication","Problem Solving","Critical Thinking","Leadership","Teamwork",
  "Time Management","Creativity","Programming","Data Analysis","Public Speaking",
  "Writing","Research","Project Management","Graphic Design","Video Editing"
];

const interestsList = [
  "Technology","Healthcare","Business","Arts & Culture","Sports","Music","Travel",
  "Reading","Gaming","Photography","Cooking","Writing","Social Work",
  "Environment","Finance","Education","Research","Entrepreneurship"
];

const genderOptions = ["Male", "Female", "Other"];

/* ================= MAIN COMPONENT ================= */

export default function StudentOnboardingForm() {
  const navigate = useNavigate();

  const handleSubmit = () => {
  // 1️⃣ Save profile (optional)
  localStorage.setItem("studentProfile", JSON.stringify(form));

  // 2️⃣ Update session
  const session = JSON.parse(localStorage.getItem("lakshyaSession"));

  localStorage.setItem(
    "lakshyaSession",
    JSON.stringify({
      ...session,
      onboardingCompleted: true,
    })
  );

  // 3️⃣ Navigate
  navigate("/dashboard/student");
};


  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    education: "",
    stream: "",
    skills: [],
    interests: []
  });

  /* ===== AUTO AGE CALCULATION ===== */
  useEffect(() => {
    if (!form.dob) return;
    const dob = new Date(form.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) age--;
    setForm(prev => ({ ...prev, age: age > 0 ? age : "" }));
  }, [form.dob]);

  /* ===== MULTI SELECT TOGGLE ===== */
  const toggle = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  return (
    <section className=" min-h-screen flex justify-center items-center p-10 glass-bg">
      <div className="w-full max-w-[980px] glass-card rounded-[32px] p-12 space-y-14 animate-fade">

        {/* ===== HEADER ===== */}
        <div className="text-center">
          <div className="icon-box">
            <GraduationCap className="icon" />
          </div>
          <h1 className="text-4xl font-bold text-[#064E3B]">Student Corner</h1>
          <p className="text-slate-500 mt-2">
            Your permanent academic profile for AI career mapping
          </p>
        </div>

        {/* ===== BASIC IDENTITY INFORMATION ===== */}
        <div className="basic-section">
          <h2 className="section-title">Basic Identity Information</h2>

          <div className="basic-grid">
            {/* FULL NAME */}
            <div className="field full">
              <label>Full Name <span>*</span></label>
              <input
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            {/* DOB */}
            <div className="field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
              />
            </div>

            {/* AGE */}
            <div className="field">
              <label>Age (Auto-calculated)</label>
              <input disabled placeholder="Will be calculated" value={form.age} />
            </div>

            {/* GENDER */}
            <div className="field">
              <label>Gender</label>
              <select onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option>Select gender</option>
                {genderOptions.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>

            {/* PHONE */}
            <div className="field">
              <label>Phone Number <span>*</span></label>
              <input
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {/* EMAIL */}
            <div className="field full">
              <label>Email Address <span>*</span></label>
              <input
                placeholder="your.email@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* STATE */}
            <div className="field">
              <label>State</label>
              <select onChange={e => setForm({ ...form, state: e.target.value })}>
                <option>Select your state</option>
                {indianStates.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* CITY */}
            <div className="field">
              <label>City</label>
              <input
                placeholder="Enter your city"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
              />
            </div>

            {/* EDUCATION */}
            <div className="field">
              <label>Education Level</label>
              <select onChange={e => setForm({ ...form, education: e.target.value })}>
                <option>Select education level</option>
                {educationLevels.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>

            {/* STREAM */}
            <div className="field">
              <label>Stream / Domain</label>
              <select onChange={e => setForm({ ...form, stream: e.target.value })}>
                <option>Select your stream</option>
                {streams.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ===== SKILLS ===== */}
        <Multi title="Your Skills" list={skillsList} state={form.skills} toggle={v => toggle("skills", v)} />

        {/* ===== INTERESTS ===== */}
        <Multi title="Your Interests" list={interestsList} state={form.interests} toggle={v => toggle("interests", v)} />

        {/* ===== SUBMIT ===== */}
        <div className="flex justify-center pt-6">
          <button
            onClick={handleSubmit}
            className="w-[320px] h-16 rounded-2xl gradient-btn text-white font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Save & Continue
          </button>
        </div>

      </div>

      <style>{css}</style>
    </section>
  );
}

/* ================= MULTI SELECT ================= */

const Multi = ({ title, list, state, toggle }) => (
  <div className="space-y-4">
    <h2 className="section-title">{title}</h2>
    <div className="box">
      {list.map(v => (
        <label key={v} className="chk">
          <input type="checkbox" checked={state.includes(v)} onChange={() => toggle(v)} />
          {v}
        </label>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {state.map(v => (
        <span key={v} className="chip">
          {v} <X size={12} />
        </span>
      ))}
    </div>
  </div>
);

/* ================= CSS ================= */

const css = `
/* BASIC GRID */
.basic-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:26px 36px;
}

.field{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.field.full{
  grid-column:span 2;
}

.field label{
  font-size:14px;
  font-weight:600;
  color:#065F46;
}

.field label span{
  color:#EF4444;
}

.field input,
.field select{
  height:56px;
  padding:0 18px;
  border-radius:14px;
  border:1.5px solid #99F6E4;
  background:#F6FBFA;
  font-size:15px;
}

.field input:focus,
.field select:focus{
  outline:none;
  border-color:#14B8A6;
  box-shadow:0 0 0 4px rgba(20,184,166,0.25);
}

.field input:disabled{
  background:#ECFEFF;
}

/* ICON */
.icon-box{
  width:64px;height:64px;border-radius:14px;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 18px;
  box-shadow:0 10px 25px rgba(20,184,166,.35);
}
.icon{width:32px;height:32px;color:white}

/* GLASS */
.glass-bg{
  background:
    radial-gradient(circle at top left,rgba(20,184,166,.18),transparent 45%),
    radial-gradient(circle at bottom right,rgba(14,147,132,.18),transparent 45%),
    linear-gradient(180deg,#F6FBFA,#ECFEFF);
}
.glass-card{
  background:rgba(255,255,255,.78);
  backdrop-filter:blur(18px);
  border:1px solid rgba(20,184,166,.25);
  box-shadow:0 30px 80px rgba(14,147,132,.25);
}

/* MULTI */
.box{
  border:1px solid #99F6E4;
  border-radius:18px;
  padding:20px;
  background:#F6FBFA;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
}
.chk{display:flex;gap:10px;font-size:.9rem}
.chk input{accent-color:#14B8A6}
.chip{
  background:#0E9384;color:white;
  padding:6px 14px;border-radius:999px;
  display:flex;align-items:center;gap:6px;
}

/* BUTTON */
.gradient-btn{
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  box-shadow:0 10px 25px rgba(20,184,166,.35);
}
`;
