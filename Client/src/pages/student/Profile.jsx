import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Edit } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    gender: "",
    state: "",
    city: "",
    education: "",
    stream: "",
    skills: [],
    interests: [],
    careerGoal: "",
    currentStatus: "",
    preferredIndustry: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("studentProfile"));
    if (stored) setProfile((p) => ({ ...p, ...stored }));
  }, []);

  const handleSave = () => {
    localStorage.setItem("studentProfile", JSON.stringify(profile));
    alert("Profile updated successfully");
  };

  return (
    <section className="min-h-screen bg-[#F6FBFA] flex flex-col items-center py-14">

      {/* ================= PAGE HEADER ================= */}
      <div className="text-center mb-14">
        <div className="icon-box mx-auto mb-4">
          <User className="icon" />
        </div>

        {/* Standing gradient line */}
        </div>

        <h1 className="text-4xl font-bold text-[#064E3B] mt-4">
          Student Profile
        </h1>
        <p className="text-slate-500 mt-2">
          Manage your personal and academic details
        </p>
      

      {/* ================= CARD ================= */}
      <div className="w-full max-w-[960px] glass-card rounded-[34px]">

        {/* 🔧 ADDED INNER SPACING WRAPPER */}
        <div className="card-inner space-y-20">

          {/* ================= BASIC IDENTITY ================= */}
          <Section title="Basic Identity">
            <Grid>
              <Field label="Full Name" value={profile.fullName} />
              <Field label="Email" value={profile.email} icon={Mail} />
              <Field label="Phone" value={profile.phone} icon={Phone} />
              <Field label="Date of Birth" value={profile.dob} />
              <Field label="Age" value={profile.age} />
              <Field label="Gender" value={profile.gender} />
            </Grid>
          </Section>

          {/* ================= LOCATION ================= */}
          <Section title="Location">
            <Grid>
              <Field label="State" value={profile.state} icon={MapPin} />
              <Field label="City" value={profile.city} />
              <Field label="Country" value="India" />
            </Grid>
          </Section>

          {/* ================= EDUCATION ================= */}
          <Section title="Education">
            <Grid>
              <Field label="Education Level" value={profile.education} />
              <Field label="Stream / Domain" value={profile.stream} />
              <Editable
                label="Current Status"
                value={profile.currentStatus}
                placeholder="Studying / Completed"
                onChange={(v) =>
                  setProfile({ ...profile, currentStatus: v })
                }
              />
            </Grid>
          </Section>

          {/* ================= SKILLS ================= */}
          <Section title="Skills">
            <TagList list={profile.skills} />
          </Section>

          {/* ================= INTERESTS ================= */}
          <Section title="Interests">
            <TagList list={profile.interests} />
          </Section>

          {/* ================= EXTRA ================= */}
          <Section title="Additional Information">
            <Grid>
              <Editable
                label="Career Goal"
                value={profile.careerGoal}
                placeholder="e.g. Data Scientist"
                onChange={(v) =>
                  setProfile({ ...profile, careerGoal: v })
                }
              />
              <Editable
                label="Preferred Industry"
                value={profile.preferredIndustry}
                placeholder="IT, Finance, Healthcare"
                onChange={(v) =>
                  setProfile({ ...profile, preferredIndustry: v })
                }
              />
            </Grid>
          </Section>

          {/* ================= FOOTER ACTIONS ================= */}
          <div className="profile-actions">
            <button className="secondary-btn">
              <Edit size={18} />
              Edit
            </button>

            <button onClick={handleSave} className="primary-btn">
              Save Profile
            </button>
          </div>
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

/* ================= COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="space-y-10">
    <h2 className="section-title">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-2 gap-x-14 gap-y-12">
    {children}
  </div>
);

const Field = ({ label, value, icon: Icon }) => (
  <div className="field">
    <label>{label}</label>
    <div className="field-value">
      {Icon && <Icon size={16} />}
      <span>{value || "-"}</span>
    </div>
  </div>
);

const Editable = ({ label, value, onChange, placeholder }) => (
  <div className="field">
    <label>{label}</label>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const TagList = ({ list }) => (
  <div className="flex flex-wrap gap-3">
    {list?.length ? (
      list.map((v) => (
        <span key={v} className="chip">{v}</span>
      ))
    ) : (
      <span className="text-slate-400 text-sm">No data</span>
    )}
  </div>
);

/* ================= CSS ================= */

const css = `
.title-line{
  width:120px;
  height:4px;
  margin:0 auto;
  border-radius:999px;
  background:linear-gradient(90deg,#064E3B,#0E9384,#14B8A6,#99F6E4);
}

.card-inner{
  padding:72px 72px;   /* 🔧 MAIN FIX: space from card border */
}



.field{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.field label{
  font-size:.9rem;
  font-weight:600;
  color:#065F46;
}

.field-value{
  height:52px;
  padding:0 18px;
  border-radius:16px;
  background:#F6FBFA;
  border:1.5px solid #99F6E4;
  display:flex;
  align-items:center;
  gap:10px;
}

.field input{
  height:52px;
  padding:0 18px;
  border-radius:16px;
  border:1.5px solid #99F6E4;
  background:#F6FBFA;
}

.field input:focus{
  outline:none;
  border-color:#14B8A6;
  box-shadow:0 0 0 4px rgba(20,184,166,.25);
}

.chip{
  background:#0E9384;
  color:white;
  padding:8px 18px;
  border-radius:999px;
  font-size:.8rem;
}

.profile-actions{
  display:flex;
  justify-content:space-between; /* 🔧 LEFT / RIGHT buttons */
  padding-top:20px;
}

.icon-box{
  width:68px;height:68px;
  border-radius:16px;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 12px 30px rgba(20,184,166,.35);
}

.icon{color:white;width:30px;height:30px}

.primary-btn{
  height:54px;
  padding:0 32px;
  border-radius:16px;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  font-weight:600;
  border:none;
}

.secondary-btn{
  height:54px;
  padding:0 32px;
  border-radius:16px;
  background:#ECFEFF;
  border:1.5px solid #99F6E4;
  font-weight:600;
  color:#065F46;
}

.glass-card{
  background:rgba(255,255,255,.78);
  backdrop-filter:blur(18px);
  border:1px solid rgba(20,184,166,.25);
  box-shadow:0 30px 80px rgba(14,147,132,.25);
}
`;
