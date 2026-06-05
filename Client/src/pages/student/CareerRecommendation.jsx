import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getCookie } from "../../utils/cookies";
import "./CareerRecommendation.css";

// Dropdown/Checkbox Option Vocabularies
const EDUCATION_OPTIONS = [
  "Animation & Multimedia", "BA", "BA Economics", "BA Psychology", "BA Sociology",
  "BBA", "BCA", "BCom", "BEd", "BFA", "BSc", "BSc Biology", "BSc Chemistry",
  "BSc Data Science", "BSc IT", "Diploma", "Fashion Designing", "Hotel Management",
  "Journalism", "LLB", "LLM", "MA", "MBA", "MCA", "MCom", "MEd", "MFA", "MSc",
  "MSc IT", "MTech", "Mass Communication", "BSc Mathematics", "BSc Physics"
];

const GENERAL_SKILLS = [
  "adaptability", "adaptive learning", "automation mindset", "communication",
  "computational thinking", "content creation", "context switching", "creative thinking",
  "critical thinking", "cross-functional collaboration", "data handling",
  "database concepts", "debugging skills", "decision making", "documentation",
  "general problem solving", "leadership", "learning agility", "logical thinking",
  "multi-disciplinary thinking", "organizational skills", "people management",
  "planning", "presentation skills", "problem analysis", "problem solving",
  "process understanding", "programming fundamentals", "public interaction",
  "research skills", "software logic", "strategic planning", "system design",
  "technical analysis", "web fundamentals"
];

const INTERESTS = [
  "automation and optimization", "building systems", "building versatile skills",
  "business development", "creative expression", "exploring opportunities",
  "learning new domains", "organizational growth", "social impact",
  "solving real-world problems", "solving technical problems", "technical innovation",
  "working across teams", "working with people", "working with software"
];

const IT_SKILLS = [
  "Python", "JavaScript", "SQL", "HTML/CSS", "Java", "C++", "C#", "TypeScript",
  "React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Git", "Docker",
  "AWS", "Linux", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Django", "Flask"
];

function CareerRecommendation() {
  const navigate = useNavigate();

  // States
  const [step, setStep] = useState("LOADING"); // LOADING, FORM, CONFIRM_DOMAIN, SELECT_IT_SKILLS, CALCULATING, RESULTS
  const [loadingMsg, setLoadingMsg] = useState("Initializing career guidance system...");
  const [user, setUser] = useState(null);

  // Form Inputs
  const [selectedEducation, setSelectedEducation] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [selectedGeneralSkills, setSelectedGeneralSkills] = useState([]);
  const [selectedItSkills, setSelectedItSkills] = useState([]);

  // Prediction Outputs
  const [predictedDomain, setPredictedDomain] = useState("");
  const [domainConfidence, setDomainConfidence] = useState(0);
  const [confirmedDomain, setConfirmedDomain] = useState("");
  const [careersList, setCareersList] = useState([]);
  const [activeCareerIndex, setActiveCareerIndex] = useState(0);

  // Initial Load & Health Polling
  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        setLoadingMsg("Spinning up AI Models... This takes about 45-60 seconds on Render's free tier. Thank you for your patience! 🚀");
        
        // 1. Poll health endpoint
        let isHealthy = false;
        while (active && !isHealthy) {
          try {
            const healthRes = await API.get("/ml/health");
            if (healthRes.data?.success || healthRes.data?.message === "ML service is healthy") {
              isHealthy = true;
            }
          } catch (err) {
            console.log("ML service sleeping, retrying...");
          }
          if (!isHealthy) {
            await new Promise((r) => setTimeout(r, 4000)); // wait 4 seconds before next check
          }
        }

        if (!active) return;

        // 2. Fetch user details
        const profileRes = await API.get("/dashboard");
        const userData = profileRes.data?.user;
        setUser(userData);

        if (userData?.educationLevel) setSelectedEducation(userData.educationLevel);
        if (userData?.interests?.length > 0) setSelectedInterest(userData.interests[0]);
        if (userData?.skills?.length > 0) {
          // prefill general skills that match our vocabulary
          const matchingSkills = userData.skills.filter(s => GENERAL_SKILLS.includes(s));
          setSelectedGeneralSkills(matchingSkills);
        }

        // 3. Fetch Journey status
        const journeyRes = await API.get("/journey/status");
        const journey = journeyRes.data?.journey;

        if (!journey || journey.currentStep === "NOT_STARTED") {
          setStep("FORM");
        } else if (journey.currentStep === "DOMAIN_PREDICTED") {
          setPredictedDomain(journey.predictedDomain);
          setDomainConfidence(0.95); // default mock UI confidence if missing
          setStep("CONFIRM_DOMAIN");
        } else if (journey.currentStep === "DOMAIN_CONFIRMED") {
          setConfirmedDomain(journey.confirmedDomain);
          if (journey.confirmedDomain === "IT") {
            setStep("SELECT_IT_SKILLS");
          } else {
            // Predict Non-IT
            await fetchNonItPredictions(
              userData.educationLevel || "Undergraduate",
              userData.skills || [],
              userData.interests?.[0] || "business development"
            );
          }
        } else if (journey.currentStep === "CAREER_PREDICTED") {
          setConfirmedDomain(journey.confirmedDomain || (journey.predictedDomain === "IT" ? "IT" : "NON_IT"));
          if (journey.confirmedDomain === "IT" || journey.predictedDomain === "IT") {
            await fetchItPredictions(userData.skills.length > 0 ? userData.skills : ["Python", "SQL"]);
          } else {
            await fetchNonItPredictions(
              userData.educationLevel || "Undergraduate",
              userData.skills || [],
              userData.interests?.[0] || "business development"
            );
          }
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        setStep("FORM"); // fallback
      }
    };

    initialize();

    return () => {
      active = false;
    };
  }, []);

  // Helper: Fetch Non-IT recommendations from backend
  const fetchNonItPredictions = async (edu = selectedEducation, skills = selectedGeneralSkills, interest = selectedInterest) => {
    try {
      setStep("CALCULATING");
      setLoadingMsg("Generating personalized Non-IT career options and roadmaps via Gemini...");
      const res = await API.post("/career/non-it", {
        education: edu,
        skills: skills,
        interest: interest
      });
      if (res.data?.success) {
        setCareersList(res.data.careers);
        setActiveCareerIndex(0);
        setStep("RESULTS");
      } else {
        throw new Error(res.data?.message || "Failed to load Non-IT paths");
      }
    } catch (err) {
      console.error(err);
      alert("Error loading Non-IT career recommendations. Please try again.");
      setStep("FORM");
    }
  };

  // Helper: Fetch IT recommendations from backend
  const fetchItPredictions = async (skillsArr) => {
    try {
      setStep("CALCULATING");
      setLoadingMsg("Predicting matches via ML model and building visual roadmaps via Gemini...");
      const res = await API.post("/career/it", {
        it_skills: skillsArr,
        interest: selectedInterest
      });
      if (res.data?.success) {
        setCareersList(res.data.careers);
        setActiveCareerIndex(0);
        setStep("RESULTS");
      } else {
        throw new Error(res.data?.message || "Failed to load IT paths");
      }
    } catch (err) {
      console.error(err);
      alert("Error loading IT career recommendations. Please try again.");
      setStep("SELECT_IT_SKILLS");
    }
  };

  // Step 1 Submit: Domain Prediction
  const handleDomainSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEducation || !selectedInterest || selectedGeneralSkills.length === 0) {
      alert("Please fill in all fields and select at least one general skill.");
      return;
    }

    try {
      setStep("CALCULATING");
      setLoadingMsg("Running domain classifier model...");
      const res = await API.post("/career/domain", {
        education: selectedEducation,
        general_skills: selectedGeneralSkills,
        interest: selectedInterest
      });

      if (res.data?.success) {
        setPredictedDomain(res.data.domain);
        setDomainConfidence(res.data.confidence);
        setStep("CONFIRM_DOMAIN");
      } else {
        throw new Error(res.data?.message || "Domain classification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Service error during domain prediction. Please try again.");
      setStep("FORM");
    }
  };

  // Step 2 Submit: Confirm Domain
  const handleConfirmDomain = async () => {
    try {
      setStep("CALCULATING");
      setLoadingMsg("Locking in selected career domain...");
      const res = await API.post("/journey/confirm-domain", { domain: predictedDomain });
      
      if (res.data?.success) {
        setConfirmedDomain(predictedDomain);
        if (predictedDomain === "IT") {
          setStep("SELECT_IT_SKILLS");
        } else {
          await fetchNonItPredictions();
        }
      } else {
        throw new Error(res.data?.message || "Failed to confirm domain");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to confirm domain. Please try again.");
      setStep("CONFIRM_DOMAIN");
    }
  };

  // Step 3 Submit: IT Skills Selection
  const handleItSkillsSubmit = async () => {
    if (selectedItSkills.length === 0) {
      alert("Please select at least one IT skill.");
      return;
    }

    // Save selected skills to profile first
    try {
      await API.put("/skills/skills", { skills: selectedItSkills });
    } catch (e) {
      console.warn("Failed to update profile skills, continuing with prediction:", e);
    }

    await fetchItPredictions(selectedItSkills);
  };

  // General Skill Selection Toggler
  const toggleGeneralSkill = (skill) => {
    if (selectedGeneralSkills.includes(skill)) {
      setSelectedGeneralSkills(selectedGeneralSkills.filter((s) => s !== skill));
    } else {
      setSelectedGeneralSkills([...selectedGeneralSkills, skill]);
    }
  };

  // IT Skill Selection Toggler
  const toggleItSkill = (skill) => {
    if (selectedItSkills.includes(skill)) {
      setSelectedItSkills(selectedItSkills.filter((s) => s !== skill));
    } else {
      setSelectedItSkills([...selectedItSkills, skill]);
    }
  };

  const activeCareer = careersList[activeCareerIndex];

  return (
    <div className="career-recommendation-page">
      {/* Top Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Dashboard</button>
          <button className="nav-link active-link">Career</button>
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Skills</button>
          <button className="nav-link" onClick={() => navigate("/student/learn")}>Learn</button>
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Progress</button>
        </div>
        <div className="navbar-avatar" onClick={() => navigate("/student/dashboard")} style={{ cursor: "pointer" }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      <div className="career-content">
        {/* Step 0: Loading / Polling */}
        {step === "LOADING" && (
          <div className="glass-container">
            <div className="loading-box-custom">
              <div className="rocket-loader">🚀</div>
              <div className="pulse-spinner"></div>
              <h3 className="loading-title-custom">Initializing AI Engine</h3>
              <p className="loading-desc-custom">{loadingMsg}</p>
            </div>
          </div>
        )}

        {/* Step 1: Input Form */}
        {step === "FORM" && (
          <div className="glass-container">
            <div className="step-header">
              <h2 className="step-title-text">AI Career Prediction</h2>
              <p className="step-subtitle-text">Enter your details and let our AI models discover your ideal career path.</p>
            </div>

            <form onSubmit={handleDomainSubmit} className="form-section">
              <div className="form-group-custom">
                <label className="form-label-custom">🎓 Select Education Level</label>
                <select
                  className="select-custom"
                  value={selectedEducation}
                  onChange={(e) => setSelectedEducation(e.target.value)}
                  required
                >
                  <option value="">-- Choose Education --</option>
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">💡 Choose Primary Interest</label>
                <select
                  className="select-custom"
                  value={selectedInterest}
                  onChange={(e) => setSelectedInterest(e.target.value)}
                  required
                >
                  <option value="">-- Choose Interest --</option>
                  {INTERESTS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">💪 Select Your General Skills (Select at least 1)</label>
                <div className="skills-grid-custom">
                  {GENERAL_SKILLS.map((skill) => {
                    const active = selectedGeneralSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        className={`skill-pill-btn ${active ? "active" : ""}`}
                        onClick={() => toggleGeneralSkill(skill)}
                      >
                        <span>{skill}</span>
                        {active && <span className="skill-check-mark">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <button type="submit" className="btn-primary-custom">
                  Analyze Domain →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Confirm Domain */}
        {step === "CONFIRM_DOMAIN" && (
          <div className="glass-container">
            <div className="step-header">
              <h2 className="step-title-text">Domain Analysis Result</h2>
              <p className="step-subtitle-text">Our models have analyzed your inputs and identified your optimal career domain.</p>
            </div>

            <div className="domain-card-custom">
              <div className="domain-icon-large">
                {predictedDomain === "IT" ? "💻" : "💼"}
              </div>
              <h3 className="domain-name-title">
                {predictedDomain === "IT" ? "Information Technology (IT)" : "Non-IT Domain"}
              </h3>
              <span className="domain-confidence-badge">
                Confidence: {Math.round(domainConfidence * 100)}%
              </span>
              <p className="domain-desc-text">
                Based on your background in {selectedEducation} and interest in "{selectedInterest}", 
                an {predictedDomain === "IT" ? "IT-oriented" : "expert Non-IT"} career path will best capitalize on your strengths.
              </p>
            </div>

            <div className="btn-row-custom" style={{ justifyContent: "center" }}>
              <button
                className="btn-secondary-custom"
                onClick={() => setStep("FORM")}
              >
                ← Edit Profile Details
              </button>
              <button
                className="btn-primary-custom"
                onClick={handleConfirmDomain}
              >
                Confirm Domain & Proceed →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select IT Skills */}
        {step === "SELECT_IT_SKILLS" && (
          <div className="glass-container">
            <div className="step-header">
              <h2 className="step-title-text">Select IT-Specific Skills</h2>
              <p className="step-subtitle-text">Pick the programming languages, database concepts, or tools you are familiar with.</p>
            </div>

            <div className="form-section">
              <div className="form-group-custom">
                <label className="form-label-custom">💻 Select IT Skills (Select at least 1)</label>
                <div className="skills-grid-custom" style={{ maxHeight: "350px" }}>
                  {IT_SKILLS.map((skill) => {
                    const active = selectedItSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        className={`skill-pill-btn ${active ? "active" : ""}`}
                        onClick={() => toggleItSkill(skill)}
                      >
                        <span>{skill}</span>
                        {active && <span className="skill-check-mark">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="btn-row-custom" style={{ justifyContent: "flex-end" }}>
                <button
                  className="btn-secondary-custom"
                  onClick={() => setStep("CONFIRM_DOMAIN")}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary-custom"
                  onClick={handleItSkillsSubmit}
                >
                  Predict Careers →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Loading Predictions */}
        {step === "CALCULATING" && (
          <div className="glass-container">
            <div className="loading-box-custom">
              <div className="rocket-loader">🧠</div>
              <div className="pulse-spinner"></div>
              <h3 className="loading-title-custom">Processing Predictions</h3>
              <p className="loading-desc-custom">{loadingMsg}</p>
            </div>
          </div>
        )}

        {/* Step 5: Dashboard Results */}
        {step === "RESULTS" && (
          <div>
            <div className="glass-container" style={{ paddingBottom: "20px" }}>
              <div className="results-grid-header">
                <h2 className="step-title-text">Your Personalized Career Recommendations</h2>
                <p className="step-subtitle-text">
                  Here are the top 3 career paths matched for you in the <strong>{confirmedDomain === "IT" ? "IT" : "Non-IT"}</strong> domain. 
                  Click on any card to view its detailed career roadmap.
                </p>
              </div>

              <div className="results-overview-cards">
                {careersList.map((item, index) => {
                  const isActive = index === activeCareerIndex;
                  return (
                    <div
                      key={item.role}
                      className={`career-select-card ${isActive ? "active" : ""}`}
                      onClick={() => setActiveCareerIndex(index)}
                    >
                      <div>
                        <div className="card-num-badge">0{index + 1}</div>
                        <h3 className="card-title-name">{item.role}</h3>
                        <span className="card-title-category">
                          {item.career?.category || "Career Path"}
                        </span>
                      </div>
                      <div className="card-match-score">
                        <span>🎯 Match Score:</span>
                        <strong>{Math.round(item.confidence * 100)}%</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Career Explanation & Roadmap section */}
            {activeCareer && (
              <div className="detailed-info-wrapper">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <h3 className="step-title-text" style={{ margin: 0 }}>
                      {activeCareer.role} Deep Dive
                    </h3>
                    <p className="step-subtitle-text" style={{ marginTop: "4px" }}>
                      {activeCareer.career?.description || "Visualizing entry steps, requirements, and salary details."}
                    </p>
                  </div>
                  <span className="domain-confidence-badge" style={{ background: "#dcfce7", color: "#166534", fontSize: "14px", padding: "6px 16px" }}>
                    {confirmedDomain === "IT" ? "💻 IT Career" : "💼 Non-IT Career"}
                  </span>
                </div>

                {/* About Section */}
                <div className="detail-section-title">Overview & Day-in-the-Life</div>
                <p className="detail-about-text">
                  {activeCareer.explanation?.about || "A professional path specialized in managing, planning, and executing key operations inside this specific discipline."}
                </p>

                {/* Salary Cards */}
                <div className="detail-section-title">Compensation Insights (India)</div>
                <div className="salary-row-cards">
                  <div className="salary-box-item">
                    <div className="salary-box-icon">🌱</div>
                    <div className="salary-box-meta">
                      <span className="salary-box-label">Entry Level Salary</span>
                      <span className="salary-box-val">
                        {activeCareer.explanation?.salary?.entry || "₹3 - 5 LPA"}
                      </span>
                    </div>
                  </div>
                  <div className="salary-box-item">
                    <div className="salary-box-icon exp">📈</div>
                    <div className="salary-box-meta">
                      <span className="salary-box-label">Experienced Salary (5+ yrs)</span>
                      <span className="salary-box-val">
                        {activeCareer.explanation?.salary?.experienced || "₹12 - 20 LPA"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="insights-row-two-col">
                  {/* Growth Block */}
                  <div className="insight-block">
                    <div className="detail-section-title">Industry Demand & Future Growth</div>
                    <p className="detail-about-text" style={{ fontSize: "14px", marginTop: "6px" }}>
                      {activeCareer.explanation?.growth || "This field exhibits strong resilience and demand due to digital transformation and corporate expansion."}
                    </p>
                  </div>

                  {/* Skills to Learn Block */}
                  <div className="insight-block">
                    <div className="detail-section-title">Skills & Tools to Master Next</div>
                    <div className="tag-list-custom">
                      {activeCareer.explanation?.skills_to_learn?.map((skill) => (
                        <span key={skill} className="tag-pill-custom">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vertical Timeline Roadmap */}
                <div className="detail-section-title">Step-by-Step Transition Roadmap</div>
                <div className="timeline-vertical-track">
                  {activeCareer.explanation?.roadmap?.map((stepItem, idx) => (
                    <div key={idx} className="timeline-step-item">
                      <div className="timeline-step-dot">{stepItem.step || idx + 1}</div>
                      <h4 className="timeline-step-title">{stepItem.title}</h4>
                      <p className="timeline-step-desc">{stepItem.description}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "40px", textAlign: "left" }}>
                  <button
                    className="btn-secondary-custom"
                    onClick={() => {
                      // reset and let them predict again
                      setStep("FORM");
                    }}
                  >
                    ← Get Recommendations for Different Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerRecommendation;
