import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Courses.css";

const CATEGORY_MAP = {
  all: "All Categories",
  ai_ml: "AI & Machine Learning",
  web_development: "Web Development",
  data_science: "Data Science",
  cloud_computing: "Cloud Computing",
  cyber_security: "Cyber Security",
  devops: "DevOps & CI/CD",
  mobile_development: "Mobile App Development",
  software_engineering: "Software Engineering",
  management: "Management & Leadership",
  communication_skills: "Communication Skills",
  business_analysis: "Business Analysis",
  finance: "Finance & Investing",
  marketing: "Marketing & Growth",
  human_resources: "Human Resources",
  sales: "Sales & Negotiation",
  entrepreneurship: "Entrepreneurship",
  career_guidance: "Career Guidance & Prep"
};

function Courses() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [journey, setJourney] = useState(null);
  const [careerRecommendation, setCareerRecommendation] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // all, free, paid
  const [searchQuery, setSearchQuery] = useState("");
  
  // Popup detail state
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Initialize and load data
  useEffect(() => {
    const loadCoursesAndUser = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch user dashboard profile for personalization
        try {
          const profileRes = await API.get("/dashboard");
          if (profileRes.data?.success) {
            setUser(profileRes.data.user);
            setJourney(profileRes.data.journey);
            setCareerRecommendation(profileRes.data.careerRecommendation);
          }
        } catch (e) {
          console.warn("Failed to fetch profile info:", e);
        }

        // 2. Fetch all courses
        const coursesRes = await API.get("/courses");
        if (coursesRes.data?.success) {
          setCourses(coursesRes.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCoursesAndUser();
  }, []);

  // Helper to check if a course is recommended based on specific career roles
  const isRecommended = (course) => {
    // If user has not completed career prediction, no recommendations shown
    if (!careerRecommendation || !careerRecommendation.careers || careerRecommendation.careers.length === 0) {
      return false;
    }

    const courseCat = course.category.toLowerCase();
    const recommendedCategories = new Set();

    // Map each recommended role to matching course categories
    careerRecommendation.careers.forEach((item) => {
      const role = (item.role || "").toLowerCase();
      
      if (
        role.includes("web") || 
        role.includes("frontend") || 
        role.includes("backend") || 
        role.includes("full stack") || 
        role.includes("javascript") ||
        role.includes("developer")
      ) {
        recommendedCategories.add("web_development");
        recommendedCategories.add("software_engineering");
      }
      if (
        role.includes("data scientist") || 
        role.includes("data analyst") || 
        role.includes("analytics")
      ) {
        recommendedCategories.add("data_science");
      }
      if (
        role.includes("machine learning") || 
        role.includes("ml") || 
        role.includes("ai ") || 
        role.includes("artificial intelligence") || 
        role.includes("deep learning")
      ) {
        recommendedCategories.add("ai_ml");
      }
      if (
        role.includes("devops") || 
        role.includes("kubernetes") || 
        role.includes("docker") || 
        role.includes("ci/cd") ||
        role.includes("system")
      ) {
        recommendedCategories.add("devops");
      }
      if (
        role.includes("cybersecurity") || 
        role.includes("cyber security") || 
        role.includes("ethical hacker") || 
        role.includes("security")
      ) {
        recommendedCategories.add("cyber_security");
      }
      if (
        role.includes("cloud") || 
        role.includes("aws") || 
        role.includes("azure")
      ) {
        recommendedCategories.add("cloud_computing");
      }
      if (
        role.includes("mobile") || 
        role.includes("android") || 
        role.includes("ios") || 
        role.includes("flutter") || 
        role.includes("react native")
      ) {
        recommendedCategories.add("mobile_development");
      }
      if (
        role.includes("management") || 
        role.includes("product manager") || 
        role.includes("project manager") || 
        role.includes("leader")
      ) {
        recommendedCategories.add("management");
        recommendedCategories.add("product_management");
      }
      if (
        role.includes("communication") || 
        role.includes("public speaker") || 
        role.includes("storytelling")
      ) {
        recommendedCategories.add("communication_skills");
      }
      if (
        role.includes("business analyst") || 
        role.includes("ba")
      ) {
        recommendedCategories.add("business_analysis");
      }
      if (
        role.includes("finance") || 
        role.includes("stock") || 
        role.includes("investing")
      ) {
        recommendedCategories.add("finance");
      }
      if (
        role.includes("marketing") || 
        role.includes("growth") || 
        role.includes("seo")
      ) {
        recommendedCategories.add("marketing");
      }
      if (
        role.includes("hr") || 
        role.includes("human resources") || 
        role.includes("payroll")
      ) {
        recommendedCategories.add("human_resources");
      }
      if (
        role.includes("sales") || 
        role.includes("seller") || 
        role.includes("negotiation")
      ) {
        recommendedCategories.add("sales");
      }
      if (
        role.includes("entrepreneur") || 
        role.includes("startup") || 
        role.includes("founder")
      ) {
        recommendedCategories.add("entrepreneurship");
      }
      if (
        role.includes("career") || 
        role.includes("guidance")
      ) {
        recommendedCategories.add("career_guidance");
      }
    });

    return recommendedCategories.has(courseCat);
  };

  // Filter courses based on selections
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesType = selectedType === "all" || course.type === selectedType;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="courses-page">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate("/student/career")}>Career</button>
          <button className="nav-link" onClick={() => navigate("/student/skills")}>Skills</button>
          <button className="nav-link active-link">Learn</button>
          <button className="nav-link" onClick={() => navigate("/student/chatbot")}>AI Assistant</button>
        </div>
        <div className="navbar-avatar" onClick={() => navigate("/student/dashboard")} style={{ cursor: "pointer" }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      {/* Main Content */}
      <div className="courses-content">
        {/* Header Block */}
        <div className="courses-header-section welcome-banner" style={{ minHeight: "auto", padding: "30px 40px" }}>
          <div className="welcome-text-block">
            <h1 className="welcome-heading" style={{ margin: "0 0 10px 0", fontSize: "26px" }}>
              Explore Curated Courses 📚
            </h1>
            <p className="greeting-line" style={{ opacity: 0.9 }}>
              Accelerate your transition with high-quality tutorials and masterclasses tailored for your target career paths.
            </p>
          </div>
          <div className="banner-circle banner-circle-1" style={{ width: "90px", height: "90px", right: "20px" }}></div>
          <div className="banner-circle banner-circle-2" style={{ width: "60px", height: "60px", right: "120px" }}></div>
        </div>

        {/* Filter bar & Search */}
        <div className="filters-container-wrapper">
          <div className="filters-header-row">
            <div className="search-bar-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search courses by title, instructor, platform..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery("")}>×</button>
              )}
            </div>

            <div className="type-filter-box">
              <label className="filter-label">Pricing Filter:</label>
              <div className="type-buttons">
                <button 
                  className={`type-btn ${selectedType === "all" ? "active" : ""}`} 
                  onClick={() => setSelectedType("all")}
                >
                  All
                </button>
                <button 
                  className={`type-btn ${selectedType === "free" ? "active" : ""}`} 
                  onClick={() => setSelectedType("free")}
                >
                  Free
                </button>
                <button 
                  className={`type-btn ${selectedType === "paid" ? "active" : ""}`} 
                  onClick={() => setSelectedType("paid")}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>

          <div className="category-scroll-container">
            <label className="category-scroll-label">Filter Category:</label>
            <div className="category-pills">
              {Object.keys(CATEGORY_MAP).map((key) => {
                const isActive = selectedCategory === key;
                return (
                  <button
                    key={key}
                    className={`category-pill-btn ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    {CATEGORY_MAP[key]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="courses-loader-box">
            <div className="pulse-spinner"></div>
            <p>Fetching matching learning resources...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="courses-grid-layout">
            {filteredCourses.map((course) => {
              const isRec = isRecommended(course);
              return (
                <div 
                  key={course._id} 
                  className={`course-card-box ${isRec ? "recommended-glow" : ""}`}
                  onClick={() => setSelectedCourse(course)}
                >
                  {isRec && (
                    <div className="recommended-badge-top">
                      🎯 Recommended
                    </div>
                  )}
                  
                  <div className="course-card-image-wrapper">
                    <img src={course.photo} alt={course.title} onError={(e) => {
                      // Fallback placeholder image on load error
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600";
                    }} />
                    <span className={`course-type-tag ${course.type}`}>
                      {course.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="course-card-body">
                    <div className="course-meta-top">
                      <span className="course-platform">{course.platform}</span>
                      <span className="course-category-badge">{CATEGORY_MAP[course.category] || course.category}</span>
                    </div>

                    <h3 className="course-title-text" title={course.title}>
                      {course.title}
                    </h3>
                    
                    <p className="course-instructor-text">
                      Instructor: <strong>{course.instructor}</strong>
                    </p>

                    <p className="course-desc-preview">
                      {course.description.length > 100 
                        ? `${course.description.substring(0, 100)}...` 
                        : course.description
                      }
                    </p>

                    <div className="course-card-footer">
                      <span className="learn-more-link">Learn More & Apply →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-courses-placeholder">
            <span className="no-courses-icon">📭</span>
            <h3>No courses found</h3>
            <p>We couldn't find any courses matching your search query or filters. Try clearing some selections.</p>
            <button 
              className="btn-primary-custom" 
              onClick={() => {
                setSelectedCategory("all");
                setSelectedType("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ============================================== */}
      {/* DETAILED COURSE POPUP MODAL (BG BLUR)           */}
      {/* ============================================== */}
      {selectedCourse && (
        <div className="profile-modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="course-detail-popup-card profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="profile-modal-close" onClick={() => setSelectedCourse(null)}>×</button>
            
            <div className="popup-course-header">
              <div className="popup-image-container">
                <img src={selectedCourse.photo} alt={selectedCourse.title} onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600";
                }} />
                <span className={`popup-type-badge ${selectedCourse.type}`}>
                  {selectedCourse.type.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="popup-course-body">
              <div className="popup-category-row">
                <span className="popup-platform-tag">{selectedCourse.platform}</span>
                <span className="popup-category-tag">{CATEGORY_MAP[selectedCourse.category] || selectedCourse.category}</span>
              </div>

              <h2 className="popup-course-title">{selectedCourse.title}</h2>
              
              <div className="popup-instructor-row">
                👨‍🏫 Created by <strong>{selectedCourse.instructor}</strong>
              </div>

              <div className="popup-description-box">
                <h4>Course Description</h4>
                <p>{selectedCourse.description}</p>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button 
                className="btn-modal btn-cancel" 
                onClick={() => setSelectedCourse(null)}
              >
                Close
              </button>
              <a 
                href={selectedCourse.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-modal btn-save btn-launch-course"
                style={{ textDecoration: "none" }}
              >
                🚀 Go to Course Video 🎥
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
