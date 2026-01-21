import { useState } from "react";
import { CalendarPlus, Star } from "lucide-react";
import AppointmentModal from "../../components/AppointmentModal";

/*
  BACKEND EXPECTATION:
  - GET /api/counselors?studentId=xyz
    → returns counselors with:
      id, name, qualification, specialization,
      experience, rating, sessions, availability, avatarUrl
*/

export default function CounselorBooking() {
  const [open, setOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);

  /* MOCK DATA – replace with backend response */
  const counselors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      qualification: "PhD in Career Counseling",
      specialization: "Technology & Engineering",
      experience: 12,
      rating: 4.9,
      sessions: 500,
      availability: ["Mon", "Wed", "Fri"],
      avatar: "👩‍💼",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      qualification: "M.A. Psychology",
      specialization: "Business & Management",
      experience: 8,
      rating: 4.8,
      sessions: 350,
      availability: ["Tue", "Thu", "Sat"],
      avatar: "👨‍💼",
    },
    {
      id: 3,
      name: "Anita Desai",
      qualification: "M.Ed, Career Guidance",
      specialization: "Arts & Humanities",
      experience: 10,
      rating: 4.9,
      sessions: 420,
      availability: ["Mon", "Tue", "Wed"],
      avatar: "👩‍🏫",
    },
  ];

  return (
    <section className="booking-page">

      {/* ================= HEADER ================= */}
      <div className="booking-header">
        <div>
          <h1>Book a Counselor</h1>
          <p>
            Schedule one-on-one sessions with expert career counselors
          </p>
        </div>

        <button
          className="appointment-btn"
          onClick={() => setOpen(true)}
        >
          <CalendarPlus size={18} />
          Appointment
        </button>
      </div>

      {/* ================= COUNSELOR CARDS ================= */}
      <div className="counselor-grid">
        {counselors.map((c) => (
          <div
            key={c.id}
            className={`counselor-card ${
              selectedCounselor?.id === c.id ? "active" : ""
            }`}
            onClick={() => setSelectedCounselor(c)}
          >
            {/* Avatar */}
            <div className="avatar">{c.avatar}</div>

            {/* Name */}
            <h3 className="name">{c.name}</h3>
            <p className="qualification">{c.qualification}</p>

            <div className="divider" />

            {/* Details */}
            <div className="details">
              <div>
                <span className="label">Specialization</span>
                <span className="value">{c.specialization}</span>
              </div>

              <div>
                <span className="label">Experience</span>
                <span className="value">{c.experience} years</span>
              </div>

              <div>
                <span className="label">Rating</span>
                <span className="value rating">
                  <Star size={14} /> {c.rating}
                </span>
              </div>

              <div>
                <span className="label">Sessions</span>
                <span className="value">{c.sessions}+</span>
              </div>
            </div>

            <div className="divider" />

            {/* Availability */}
            <div className="availability">
              <span className="label">Available</span>
              <div className="days">
                {c.availability.map((d) => (
                  <span key={d} className="day">{d}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= APPOINTMENT MODAL ================= */}
      {open && (
        <AppointmentModal
          counselor={selectedCounselor}
          onClose={() => setOpen(false)}
        />
      )}

      <style>{css}</style>
    </section>
  );
}

/* ================= CSS ================= */

const css = `
.booking-page{
  display:flex;
  flex-direction:column;
  gap:32px;
}

/* HEADER */
.booking-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.booking-header h1{
  font-size:1.9rem;
  font-weight:700;
  color:#064E3B;
}

.booking-header p{
  color:#64748b;
  margin-top:4px;
}

/* BUTTON */
.appointment-btn{
  display:flex;
  align-items:center;
  gap:8px;
  padding:12px 22px;
  border-radius:999px;
  font-weight:600;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  border:none;
  cursor:pointer;
}

.appointment-btn:disabled{
  opacity:.5;
  cursor:not-allowed;
}

/* GRID */
.counselor-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:24px;
}

/* CARD */
.counselor-card{
  background:white;
  border-radius:22px;
  padding:26px 24px 28px;
  box-shadow:0 14px 40px rgba(0,0,0,.06);
  cursor:pointer;
  transition:.25s;
  display:flex;
  flex-direction:column;
}

.counselor-card:hover{
  transform:translateY(-4px);
}

.counselor-card.active{
  border:2px solid #14B8A6;
}

/* AVATAR */
.avatar{
  font-size:3.2rem;
  text-align:center;
  margin-bottom:14px;
}

/* TEXT */
.name{
  font-size:1.15rem;
  font-weight:700;
  text-align:center;
}

.qualification{
  font-size:.9rem;
  color:#64748b;
  text-align:center;
  margin-top:2px;
}

/* DIVIDER */
.divider{
  height:1px;
  background:#e5e7eb;
  margin:18px 0;
}

/* DETAILS */
.details{
  display:grid;
  gap:10px;
}

.details div{
  display:flex;
  justify-content:space-between;
  font-size:.85rem;
}

.label{
  color:#64748b;
}

.value{
  font-weight:600;
  color:#0f172a;
}

.rating{
  display:flex;
  align-items:center;
  gap:4px;
  color:#f59e0b;
}

/* AVAILABILITY */
.availability{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.days{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

.day{
  padding:4px 10px;
  border-radius:999px;
  background:#ECFEFF;
  font-size:.75rem;
  font-weight:600;
  color:#065F46;
}
`;
