// ============================================================
//  OnboardingForm.jsx
//  This is the first screen a student sees when they open
//  LAKSHYA AI for the first time.
//
//  What this file does:
//  1. Shows a form split into 5 steps (like 5 pages of a quiz)
//  2. Collects: name/age/city, interests, skills, career goal
//  3. Shows a confirmation summary at the end
//  4. Saves all the data into the browser's localStorage
//     (so the app remembers the student next time)
//
//  Libraries used:
//  - React (for building the UI)
//  - useState (for storing data that changes on screen)
// ============================================================

// We import React and useState from the react library.
// useState lets us store values that can change — like which
// step we are on, or what the student typed in a field.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getCookie, setCookie } from "../../utils/cookies";
// We import the CSS file that styles this page
import "../styles/OnboardingForm.css";

// ============================================================
//  DATA: List of interests the student can pick from
//  Each item has a label (text shown on screen) and an emoji
// ============================================================

const INTERESTS_LIST = [
  { label: "Technology", emoji: "💻" },
  { label: "AI & Data Science", emoji: "🤖" },
  { label: "Healthcare", emoji: "🏥" },
  { label: "Business", emoji: "💼" },
  { label: "Finance", emoji: "💰" },
  { label: "Arts & Design", emoji: "🎨" },
  { label: "Music", emoji: "🎵" },
  { label: "Sports", emoji: "⚽" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Photography", emoji: "📷" },
  { label: "Writing", emoji: "✍️" },
  { label: "Teaching", emoji: "📚" },
  { label: "Research", emoji: "🔬" },
  { label: "Travel", emoji: "✈️" },
  { label: "Entrepreneurship", emoji: "🚀" },
  { label: "Environment", emoji: "🌱" },
  { label: "Social Work", emoji: "🤝" },
  { label: "Public Speaking", emoji: "🎤" },
];
// ============================================================
//  DATA: List of skills the student can pick from
// ============================================================
const SKILLS_LIST = [
  // Soft Skills
  { label: "Communication", emoji: "💬" },
  { label: "Leadership", emoji: "👑" },
  { label: "Teamwork", emoji: "🤝" },
  { label: "Problem Solving", emoji: "🧩" },
  { label: "Critical Thinking", emoji: "🧠" },
  { label: "Time Management", emoji: "⏰" },
  { label: "Creativity", emoji: "🎨" },

  // Tech Skills
  { label: "Programming", emoji: "💻" },
  { label: "Web Development", emoji: "🌐" },
  { label: "App Development", emoji: "📱" },
  { label: "Data Analysis", emoji: "📊" },
  { label: "AI/ML", emoji: "🤖" },
  { label: "Cybersecurity", emoji: "🔐" },
  { label: "Cloud Computing", emoji: "☁️" },

  // Creative
  { label: "Graphic Design", emoji: "🖌️" },
  { label: "Video Editing", emoji: "🎬" },
  { label: "Writing", emoji: "✍️" },

  // Business
  { label: "Marketing", emoji: "📢" },
  { label: "Sales", emoji: "💸" },
  { label: "Entrepreneurship", emoji: "🚀" },
];

// ============================================================
//  DATA: Career suggestions for the search field on step 4
//  When the student types, we show matching careers from here
// ============================================================
const CAREER_SUGGESTIONS = [
  "Software Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Graphic Designer",
  "Game Developer",
  "Digital Marketer",
  "Content Writer",
  "Video Editor",
  "Business Analyst",
  "Cybersecurity Expert",
  "Cloud Engineer",
  "Machine Learning Engineer",
  "Product Manager",
  "Web Developer",
  "Mobile App Developer",
  "Network Engineer",
  "Database Administrator",
  "DevOps Engineer",
  "Animator",
  "Photographer",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
];

const EDUCATION_LEVELS = [
  "10th",
  "12th",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
];

const STREAMS = [
  "Science (PCM)",
  "Science (PCB)",
  "Commerce",
  "Arts",
  "Computer Science",
  "IT",
  "Mechanical",
  "Civil",
  "Electrical",
  "Medical",
  "Law",
  "MBA",
  "Design",
];

const LEARNING_STYLES = ["Visual", "Practical", "Reading", "Listening"];

const PERSONALITY_TYPES = ["Introvert", "Extrovert", "Ambivert"];

const BUDGET_OPTIONS = ["Below 50K", "50K-1L", "1L-3L", "3L-5L", "5L+"];

const COLLEGE_TYPES = ["Government", "Private", "Either"];

// ============================================================
//  TOTAL STEPS in our form
//  Step 1: Basic Info
//  Step 2: Interests
//  Step 3: Skills
//  Step 4: Career Goal
//  Step 5: Confirmation
// ============================================================
const TOTAL_STEPS = 5;

// ============================================================
//  MAIN COMPONENT: OnboardingForm
//
//  A "component" in React is like a building block.
//  This is the main building block for the whole onboarding page.
// ============================================================
function OnboardingForm({ onComplete }) {
  const navigate = useNavigate();
  // ----------------------------------------------------------
  //  STATE: "state" means data that can change.
  //  When state changes, React automatically updates the screen.
  // ----------------------------------------------------------

  // currentStep tracks which step (1 to 5) the student is on
  // We start at step 1
  const [currentStep, setCurrentStep] = useState(1);

  // Retrieve user basic details from cookie
  const session = getCookie("lakshyaSession") || {};
  const sessionUser = session.user || {};

  // formData stores everything the student fills in.
  // It's an object (like a box) with many fields inside.
  const [formData, setFormData] = useState({
    name: sessionUser.name || "",
    age: sessionUser.age ? String(sessionUser.age) : "",
    gender: sessionUser.gender || "",
    state: sessionUser.state || "",
    city: sessionUser.city || "",

    educationLevel: sessionUser.educationLevel || "",
    stream: sessionUser.stream || "",

    class10Percentage: "",
    class12Percentage: "",

    interests: [],
    skills: [],

    careerGoal: "",

    learningStyle: "",
    personality: "",

    budget: "",
    collegeType: "",
  });

  // errors stores any validation messages to show the user
  // e.g. { name: "Please enter your name" }
  const [errors, setErrors] = useState({});

  // careerSearch is the text typed in the career search box
  const [careerSearch, setCareerSearch] = useState("");

  // showSuggestions controls whether the dropdown list is visible
  const [showSuggestions, setShowSuggestions] = useState(false);

  // isSubmitted becomes true after the student clicks "Let's Go!"
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate("/student/dashboard");
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate, onComplete]);

  // ----------------------------------------------------------
  //  FUNCTION: handleBasicInfoChange
  //
  //  This runs whenever the student types in the name, age,
  //  or city input box.
  //
  //  "e" is the event — it contains info about what was typed.
  //  "e.target.name" is which input field (e.g. "name", "age")
  //  "e.target.value" is what the student typed
  // ----------------------------------------------------------
  function handleBasicInfoChange(e) {
    // We get the field name and the new value
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    // We update only that one field in formData.
    // "...formData" means "keep all the old fields",
    // then we overwrite just the one that changed.
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });

    // If there was an error for this field, clear it now
    // because the student started typing something
    if (errors[fieldName]) {
      setErrors({
        ...errors,
        [fieldName]: "",
      });
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: toggleInterest
  //
  //  This runs when the student clicks an interest card.
  //  If the interest is already selected, we remove it.
  //  If it's not selected, we add it.
  // ----------------------------------------------------------
  function toggleInterest(interestLabel) {
    // Check if this interest is already in the selected list
    const isAlreadySelected = formData.interests.includes(interestLabel);

    if (isAlreadySelected) {
      // Remove it — filter() keeps everything EXCEPT this one
      const updatedInterests = formData.interests.filter(function (item) {
        return item !== interestLabel;
      });
      setFormData({ ...formData, interests: updatedInterests });
    } else {
      // Add it — spread the old list and add the new one at the end
      const updatedInterests = [...formData.interests, interestLabel];
      setFormData({ ...formData, interests: updatedInterests });
    }

    // Clear any interest-related error
    if (errors.interests) {
      setErrors({ ...errors, interests: "" });
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: toggleSkill
  //
  //  Same logic as toggleInterest, but for skills.
  // ----------------------------------------------------------
  function toggleSkill(skillLabel) {
    const isAlreadySelected = formData.skills.includes(skillLabel);

    if (isAlreadySelected) {
      const updatedSkills = formData.skills.filter(function (item) {
        return item !== skillLabel;
      });
      setFormData({ ...formData, skills: updatedSkills });
    } else {
      const updatedSkills = [...formData.skills, skillLabel];
      setFormData({ ...formData, skills: updatedSkills });
    }

    if (errors.skills) {
      setErrors({ ...errors, skills: "" });
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: handleCareerSearchChange
  //
  //  This runs when the student types in the career goal box.
  //  It updates the search text and shows the dropdown list.
  // ----------------------------------------------------------
  function handleCareerSearchChange(e) {
    const typedText = e.target.value;
    setCareerSearch(typedText);

    // If the student cleared the box, clear the career goal too
    if (typedText === "") {
      setFormData({ ...formData, careerGoal: "" });
    }

    // Show suggestions whenever the student is typing
    setShowSuggestions(true);

    if (errors.careerGoal) {
      setErrors({ ...errors, careerGoal: "" });
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: selectCareer
  //
  //  This runs when the student clicks a suggestion from
  //  the dropdown list.
  // ----------------------------------------------------------
  function selectCareer(careerName) {
    // Save the selected career into formData
    setFormData({ ...formData, careerGoal: careerName });

    // Also show it in the search box
    setCareerSearch(careerName);

    // Hide the dropdown list
    setShowSuggestions(false);

    if (errors.careerGoal) {
      setErrors({ ...errors, careerGoal: "" });
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: getFilteredSuggestions
  //
  //  This looks through CAREER_SUGGESTIONS and returns only
  //  the ones that match what the student has typed so far.
  //
  //  Example: student types "soft" → returns "Software Developer"
  // ----------------------------------------------------------
  function getFilteredSuggestions() {
    // If the student hasn't typed anything, show nothing
    if (careerSearch.trim() === "") {
      return [];
    }

    // Convert what the student typed to lowercase for comparison
    const searchText = careerSearch.toLowerCase();

    // Keep only careers that include the typed text
    const filtered = CAREER_SUGGESTIONS.filter(function (career) {
      return career.toLowerCase().includes(searchText);
    });

    return filtered;
  }

  // ----------------------------------------------------------
  //  FUNCTION: validateCurrentStep
  //
  //  Before going to the next step, we check if the student
  //  filled everything required.
  //
  //  Returns true if everything is OK.
  //  Returns false if something is missing.
  // ----------------------------------------------------------
  function validateCurrentStep() {
    // We'll collect any errors in a new object
    const newErrors = {};

    if (currentStep === 1) {
      // Student must pick at least 1 interest
      if (formData.interests.length === 0) {
        newErrors.interests =
          "Pick at least one interest — what do you enjoy? 🎯";
      }
    }

    if (currentStep === 2) {
      // Student must pick at least 1 skill
      if (formData.skills.length === 0) {
        newErrors.skills = "Select at least one skill you already have! 💪";
      }
    }

    if (currentStep === 3) {
      // Career goal must be selected
      if (formData.careerGoal.trim() === "") {
        newErrors.careerGoal =
          "Please pick or type a career goal to continue. 🚀";
      }
    }

    // Save all the errors to state so they show on screen
    setErrors(newErrors);

    // If there are no errors, the object will be empty
    return Object.keys(newErrors).length === 0;
  }

  // ----------------------------------------------------------
  //  FUNCTION: goToNextStep
  //
  //  This runs when the student clicks the "Next" button.
  //  It first validates, then moves to the next step.
  // ----------------------------------------------------------
  function goToNextStep() {
    // Check if current step is valid
    const isValid = validateCurrentStep();

    // Only go forward if everything is filled correctly
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: goToPreviousStep
  //
  //  This runs when the student clicks the "Back" button.
  //  We just go one step back.
  // ----------------------------------------------------------
  function goToPreviousStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear any errors when going back
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: goToStep
  //
  //  This is called when the student clicks on a step dot
  //  at the top (only completed dots are clickable).
  // ----------------------------------------------------------
  function goToStep(stepNumber) {
    // Only allow going to a step that is already done
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      setErrors({});
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: handleSubmit
  //
  //  This runs when the student clicks "Let's Go! 🚀"
  //  on the final confirmation step.
  //
  //  It saves the student's data to localStorage.
  //  localStorage is like a notebook inside the browser
  //  that remembers things even after the tab is closed.
  // ----------------------------------------------------------
  async function handleSubmit() {
    // JSON.stringify converts the object into text so we can save it
    localStorage.setItem("lakshya_student", JSON.stringify(formData));
    const session = getCookie("lakshyaSession") || {};

    try {
      // Save selected skills to backend database
      await API.put("/skills/skills", { skills: formData.skills });
    } catch (err) {
      console.error("Failed to save skills on backend:", err);
    }

    // Mark the form as submitted — this shows the success animation
    setCookie("lakshyaSession", {
      ...session,
      onboardingCompleted: true,
    }, 1);
    setIsSubmitted(true);
  }

  // ----------------------------------------------------------
  //  RENDER: Show a success screen after submission
  // ----------------------------------------------------------
  if (isSubmitted) {
    return (
      <div className="onboarding-wrapper">
        <div className="success-screen">
          <div className="success-icon">🚀</div>
          <h2 className="success-title">You're all set, {formData.name}!</h2>
          <p className="success-subtitle">
            Taking you to your personalized dashboard...
          </p>
          <div className="success-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  //  RENDER: Main onboarding form
  //
  //  This is the HTML (JSX) that appears on screen.
  //  We use {currentStep === 1 && <div>...</div>} to show
  //  only the section that matches the current step.
  // ----------------------------------------------------------
  return (
    <div className="onboarding-wrapper">
      {/* -------------------------------------------------- */}
      {/* Right side — the actual form */}
      {/* -------------------------------------------------- */}
      <div className="onboarding-right">
        {/* Step indicator dots at the top */}
        <div className="step-indicator">
          {/* We create an array [1, 2, 3, 4, 5] and render a dot for each */}
          {[1, 2, 3, 4, 5].map(function (stepNumber) {
            // Figure out the CSS class for this dot
            // "done" = already completed, "active" = current, "pending" = future
            let dotClass = "step-dot";
            if (stepNumber < currentStep) {
              dotClass = "step-dot done";
            }
            if (stepNumber === currentStep) {
              dotClass = "step-dot active";
            }
            if (stepNumber > currentStep) {
              dotClass = "step-dot pending";
            }

            return (
              <button
                key={stepNumber}
                className={dotClass}
                onClick={function () {
                  goToStep(stepNumber);
                }}
                title={"Step " + stepNumber}
              >
                {/* Show a checkmark ✓ for completed steps, else the number */}
                {stepNumber < currentStep ? "✓" : stepNumber}
              </button>
            );
          })}
        </div>

        {/* Progress bar that fills up as steps complete */}
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100 + "%",
            }}
            // We calculate the percentage:
            // Step 1 → 0%, Step 2 → 25%, Step 3 → 50%, Step 4 → 75%, Step 5 → 100%
          ></div>
        </div>

        {/* Step label text */}
        <p className="step-label">
          Step {currentStep} of {TOTAL_STEPS}
        </p>

        {currentStep === 1 && (
          <div className="form-step">
            <h2 className="step-title">What do you enjoy? 🎨</h2>
            <p className="step-description">
              No pressure — just pick what you genuinely like 👍
            </p>

            {errors.interests && (
              <p className="error-message">{errors.interests}</p>
            )}

            <div className="card-grid">
              {INTERESTS_LIST.map((i) => {
                const selected = formData.interests.includes(i.label);
                return (
                  <button
                    key={i.label}
                    className={"selection-card" + (selected ? " selected" : "")}
                    onClick={() => toggleInterest(i.label)}
                    type="button"
                  >
                    <span className="card-emoji">{i.emoji}</span>
                    <span className="card-label">{i.label}</span>
                    {selected && <span className="card-check">✓</span>}
                  </button>
                );
              })}
            </div>

            <p className="selection-count">
              {formData.interests.length} selected — nice choices 🔥
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h2 className="step-title">What are you good at? 💪</h2>
            <p className="step-description">
              Be honest here — this helps us recommend better paths 🚀
            </p>

            {errors.skills && <p className="error-message">{errors.skills}</p>}

            <div className="card-grid">
              {SKILLS_LIST.map((s) => {
                const selected = formData.skills.includes(s.label);
                return (
                  <button
                    key={s.label}
                    className={"selection-card" + (selected ? " selected" : "")}
                    onClick={() => toggleSkill(s.label)}
                    type="button"
                  >
                    <span className="card-emoji">{s.emoji}</span>
                    <span className="card-label">{s.label}</span>
                    {selected && <span className="card-check">✓</span>}
                  </button>
                );
              })}
            </div>

            <p className="selection-count">
              {formData.skills.length} skills selected — solid 💯
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h2 className="step-title">What's your dream career? 🚀</h2>
            <p className="step-description">
              Don’t overthink — just type what comes to your mind 💭
            </p>

            <div className="form-group">
              <input
                value={careerSearch}
                onChange={handleCareerSearchChange}
                className={
                  "form-input" + (errors.careerGoal ? " input-error" : "")
                }
                placeholder="Try typing something like Software Developer..."
              />

              {showSuggestions && getFilteredSuggestions().length > 0 && (
                <ul className="suggestions-dropdown">
                  {getFilteredSuggestions().map((c) => (
                    <li key={c} onClick={() => selectCareer(c)}>
                      🎯 {c}
                    </li>
                  ))}
                </ul>
              )}

              {errors.careerGoal && (
                <p className="error-message">{errors.careerGoal}</p>
              )}
            </div>

            {formData.careerGoal && (
              <div className="selected-career-badge">
                ✅ Locked in: <strong>{formData.careerGoal}</strong>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step">
            <h2 className="step-title">Tell us a bit more 🧠</h2>
            <p className="step-description">
              This helps us personalize your recommendations even better 🎯
            </p>

            <div className="form-group">
              <label>How do you learn best?</label>
              <select
                name="learningStyle"
                onChange={handleBasicInfoChange}
                className={
                  "form-input" + (errors.learningStyle ? " input-error" : "")
                }
              >
                <option value="">Pick one</option>
                {LEARNING_STYLES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Your personality type</label>
              <select
                name="personality"
                onChange={handleBasicInfoChange}
                className={
                  "form-input" + (errors.personality ? " input-error" : "")
                }
              >
                <option value="">Choose one</option>
                {PERSONALITY_TYPES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Your budget range</label>
              <select
                name="budget"
                onChange={handleBasicInfoChange}
                className={"form-input" + (errors.budget ? " input-error" : "")}
              >
                <option value="">Select budget</option>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>College preference</label>
              <select
                name="collegeType"
                onChange={handleBasicInfoChange}
                className={
                  "form-input" + (errors.collegeType ? " input-error" : "")
                }
              >
                <option value="">Choose type</option>
                {COLLEGE_TYPES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="form-step">
            <h2 className="step-title">Looks good, {formData.name}! 🌟</h2>
            <p className="step-description">
              Please review your details before building your career roadmap 🚀
            </p>
            
            <div className="onboarding-summary-box" style={{ background: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0", marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "350px", overflowY: "auto", textAlign: "left" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <div><strong>Age:</strong> {formData.age || "N/A"}</div>
                <div><strong>Gender:</strong> {formData.gender || "N/A"}</div>
                <div><strong>City:</strong> {formData.city || "N/A"}</div>
                <div><strong>State:</strong> {formData.state || "N/A"}</div>
                <div style={{ gridColumn: "span 2" }}><strong>Education:</strong> {formData.educationLevel || "N/A"} ({formData.stream || "N/A"})</div>
              </div>
              
              <div>
                <strong>Interests:</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                  {formData.interests.map(i => (
                    <span key={i} style={{ background: "#fdf2f8", color: "#be185d", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", border: "1px solid #fbcfe8" }}>{i}</span>
                  ))}
                </div>
              </div>

              <div>
                <strong>Skills:</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                  {formData.skills.map(s => (
                    <span key={s} style={{ background: "#f0fdf4", color: "#15803d", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", border: "1px solid #bbf7d0" }}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <strong>Dream Career:</strong>
                <div style={{ marginTop: "4px", fontSize: "15px", color: "#0f172a", fontWeight: "600" }}>
                  🎯 {formData.careerGoal}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* Navigation Buttons (Back / Next / Submit)     */}
        {/* ============================================== */}
        <div className="button-row">
          {/* Show "Back" button on all steps except step 1 */}
          {currentStep > 1 && (
            <button
              className="btn btn-secondary"
              onClick={goToPreviousStep}
              type="button"
            >
              ← Back
            </button>
          )}

          {/* Show "Next" button for steps 1 to 4 */}
          {currentStep < TOTAL_STEPS && (
            <button
              className="btn btn-primary"
              onClick={goToNextStep}
              type="button"
            >
              Next →
            </button>
          )}

          {/* Show "Let's Go!" button only on step 5 (confirmation) */}
          {currentStep === TOTAL_STEPS && (
            <button
              className="btn btn-submit"
              onClick={handleSubmit}
              type="button"
            >
              Let's Go! 🚀
            </button>
          )}
        </div>
      </div>{" "}
      {/* end onboarding-right */}
    </div> // end onboarding-wrapper
  );
}

// We export the component so other files can import and use it
// e.g. in App.jsx you would write: import OnboardingForm from './student/pages/OnboardingForm';
export default OnboardingForm;
