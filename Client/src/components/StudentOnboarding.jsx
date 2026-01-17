import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [careerKnown, setCareerKnown] = useState("No");

  // Redirect if onboarding already completed
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("lakshyaSession"));
    if (session?.onboardingCompleted) {
      navigate("/dashboard/student");
    }
  }, [navigate]);

  // Finish button handler
  const handleFinish = () => {
    const session = JSON.parse(localStorage.getItem("lakshyaSession")) || {};
    localStorage.setItem(
      "lakshyaSession",
      JSON.stringify({
        ...session,
        onboardingCompleted: true,
      })
    );
    navigate("/dashboard/student");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* HERO STYLE BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] bg-size-[18px_18px] opacity-40" />

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-[0_30px_80px_rgba(79,70,229,0.25)] p-10">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Student <span className="text-indigo-600">Onboarding</span>
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Step {step} of 5 • Mandatory information only
          </p>
        </div>

        {/* PROGRESS */}
        <div className="w-full h-2 bg-slate-100 rounded-full mb-10">
          <div
            className="h-2 bg-indigo-600 rounded-full transition-all"
            style={{ width: `${step * 20}%` }}
          />
        </div>

        {/* STEP 1 — IDENTITY */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Identity Details</h3>

            <div className="grid md:grid-cols-2 gap-5">
              <input placeholder="Full Name" className="input" />
              <input placeholder="Email Address" className="input" />
              <input placeholder="Mobile Number" className="input" />
              <input placeholder="City" className="input" />

              <select className="input">
                <option>Education Level</option>
                <option>10th</option>
                <option>12th</option>
                <option>Diploma</option>
                <option>UG</option>
                <option>PG</option>
              </select>

              <select className="input">
                <option>Current Stream</option>
                <option>Science</option>
                <option>Commerce</option>
                <option>Arts</option>
                <option>Engineering</option>
                <option>Medical</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2 — ACADEMICS */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Academic Signal</h3>
            <input placeholder="Board / University" className="input" />
            <input placeholder="Latest Academic Score (%) or CGPA" className="input" />
          </div>
        )}

        {/* STEP 3 — SKILLS & INTERESTS */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Skills & Interests</h3>

            <div>
              <p className="text-sm text-gray-600 mb-2">Select Your Skills</p>
              <div className="flex flex-wrap gap-3">
                {["Programming","Data Analysis","Design","Communication","Problem Solving","Leadership","None"].map(s => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>

            <select className="input">
              <option>Skill Confidence (1–5)</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>

            <select className="input">
              <option>Preferred Work Type</option>
              <option>Analytical</option>
              <option>Creative</option>
              <option>People-oriented</option>
              <option>Technical</option>
              <option>Managerial</option>
            </select>
          </div>
        )}

        {/* STEP 4 — CAREER CLARITY */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Career Clarity</h3>

            <select
              className="input"
              onChange={(e) => setCareerKnown(e.target.value)}
            >
              <option>No</option>
              <option>Yes</option>
            </select>

            {careerKnown === "Yes" && (
              <input placeholder="Mention Career Name" className="input" />
            )}

            <select className="input">
              <option>Weekly Learning Time</option>
              <option>&lt; 5 hrs</option>
              <option>5–10 hrs</option>
              <option>10–20 hrs</option>
              <option>20+ hrs</option>
            </select>
          </div>
        )}

        {/* STEP 5 — CONSENT */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Consent</h3>

            <select className="input">
              <option>Do you want Counselor Guidance?</option>
              <option>Yes</option>
              <option>No</option>
            </select>

            <select className="input">
              <option>Agree to AI Career Recommendation</option>
              <option>Yes</option>
            </select>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-700">
              🔒 Required to generate your career roadmap
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-10 flex justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 rounded-xl bg-slate-100 text-gray-700 disabled:opacity-50"
          >
            Back
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white shadow-[0_6px_0_#4338ca]"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white shadow-[0_6px_0_#4338ca]"
            >
              Finish & Get Recommendations
            </button>
          )}
        </div>
      </div>

      {/* INPUT & TAG STYLES */}
      <style>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          outline: none;
        }
        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
        .tag {
          padding: 0.5rem 0.9rem;
          border-radius: 999px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 0.8rem;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
