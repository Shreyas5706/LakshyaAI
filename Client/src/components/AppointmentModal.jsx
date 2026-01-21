import { useState } from "react";
import { X, Clock, CalendarDays } from "lucide-react";

/*
  BACKEND INTEGRATION NOTES:
  - GET /api/counselors
  - GET /api/availability?counselorId=1&date=YYYY-MM-DD
  - POST /api/appointments
*/

export default function AppointmentModal({ onClose }) {
  const counselors = [
    { id: 1, name: "Dr. Priya Sharma" },
    { id: 2, name: "Rajesh Kumar" },
    { id: 3, name: "Anita Desai" },
  ];

  // 🔹 MOCK AVAILABILITY (replace via API)
  const availability = {
    "2024-02-20": ["10:00", "11:00", "15:00"],
    "2024-02-21": ["09:00", "14:00"],
    "2024-02-22": ["11:00", "16:00"],
  };

  const availableDates = Object.keys(availability);

  const [form, setForm] = useState({
    name: "",
    email: "",
    counselorId: "",
    date: "",
    time: "",
  });

  const availableTimes = availability[form.date] || [];

  const handleSubmit = () => {
    /*
      SEND TO BACKEND:
      POST /api/appointments
      body: form
    */
    console.log("Appointment booked:", form);
    alert("Appointment booked successfully!");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* FORM */}
        <div className="modal-body">

          {/* NAME */}
          <div className="field">
            <label>Name</label>
            <input
              placeholder="Your full name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div className="field">
            <label>Email</label>
            <input
              placeholder="your@email.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* COUNSELOR */}
          <div className="field">
            <label>Counselor</label>
            <select
              onChange={(e) =>
                setForm({ ...form, counselorId: e.target.value })
              }
            >
              <option value="">Select counselor</option>
              {counselors.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* CALENDAR */}
          <div className="field">
            <label className="flex items-center gap-6">
              <CalendarDays size={16} /> Select Date
            </label>

            <div className="calendar-grid">
              {availableDates.map((d) => (
                <button
                  key={d}
                  className={form.date === d ? "date active" : "date"}
                  onClick={() =>
                    setForm({ ...form, date: d, time: "" })
                  }
                >
                  {new Date(d).toDateString().slice(0, 10)}
                </button>
              ))}
            </div>
          </div>

          {/* TIME SLOTS */}
          <div className="field">
            <label>Available Time</label>

            <div className="time-grid">
              {!form.date && (
                <p className="muted">Select a date to view time slots</p>
              )}

              {form.date && availableTimes.length === 0 && (
                <p className="muted">No slots available</p>
              )}

              {availableTimes.map((t) => (
                <button
                  key={t}
                  className={form.time === t ? "time active" : "time"}
                  onClick={() => setForm({ ...form, time: t })}
                >
                  <Clock size={14} /> {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button
            disabled={
              !form.name ||
              !form.email ||
              !form.counselorId ||
              !form.date ||
              !form.time
            }
            onClick={handleSubmit}
            className="confirm-btn"
          >
            Confirm Booking
          </button>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */

const css = `
.modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card{
  width: 100%;
  max-width: 540px;
  background: white;
  border-radius: 28px;
  padding: 26px;
}

.modal-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:18px;
}

.modal-header h2{
  font-size:1.45rem;
  font-weight:700;
  color:#064E3B;
}

.modal-body{
  display:grid;
  gap:18px;
}

.field{
  display:flex;
  flex-direction:column;
  gap:6px;
}

.field label{
  font-size:.85rem;
  font-weight:600;
  color:#065F46;
}

.field input,
.field select{
  height:48px;
  padding:0 14px;
  border-radius:12px;
  border:1px solid #99F6E4;
}

.calendar-grid{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.date{
  padding:10px 14px;
  border-radius:14px;
  border:1px solid #99F6E4;
  background:#F6FBFA;
  cursor:pointer;
  font-size:.85rem;
}

.date.active{
  background:#14B8A6;
  color:white;
}

.time-grid{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.time{
  padding:8px 14px;
  border-radius:999px;
  border:1px solid #99F6E4;
  background:#F6FBFA;
  cursor:pointer;
  display:flex;
  gap:6px;
  align-items:center;
}

.time.active{
  background:#0E9384;
  color:white;
}

.confirm-btn{
  width:100%;
  height:52px;
  border-radius:16px;
  background:linear-gradient(135deg,#0E9384,#14B8A6);
  color:white;
  font-weight:600;
  border:none;
}

.confirm-btn:disabled{
  opacity:.45;
}

.muted{
  font-size:.85rem;
  color:#94a3b8;
}
`;
