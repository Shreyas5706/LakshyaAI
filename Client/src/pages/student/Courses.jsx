import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import logo from "../../assets/Logo.png";
import chatbotImg from "../../assets/Chatbot.png";
import explorerImg from "../../assets/Explorer.png";
import "./Dashboard.css";
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

const MOCK_COURSES = [
  {
    _id: "mock-1",
    title: "Machine Learning Fundamentals",
    instructor: "Andrew Ng",
    rating: 4.8,
    reviewsCount: "12.4K",
    duration: "12h",
    studentsCount: "78K",
    platform: "coursera",
    category: "ai_ml",
    type: "paid",
    difficulty: "Beginner",
    price: "$49",
    photo: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600"
  },
  {
    _id: "mock-2",
    title: "Full Stack Web Development",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    reviewsCount: "8.7K",
    duration: "42h",
    studentsCount: "65K",
    platform: "udemy",
    category: "web_development",
    type: "paid",
    difficulty: "Intermediate",
    price: "$59",
    photo: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600"
  },
  {
    _id: "mock-3",
    title: "Cyber Security Essentials",
    instructor: "IBM Security",
    rating: 4.5,
    reviewsCount: "6.1K",
    duration: "10h",
    studentsCount: "43K",
    platform: "coursera",
    category: "cyber_security",
    type: "free",
    difficulty: "Beginner",
    price: "Free",
    photo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600"
  },
  {
    _id: "mock-4",
    title: "Data Analytics with Python",
    instructor: "Jose Portilla",
    rating: 4.7,
    reviewsCount: "9.3K",
    duration: "32h",
    studentsCount: "54K",
    platform: "udemy",
    category: "data_science",
    type: "paid",
    difficulty: "Intermediate",
    price: "$49",
    photo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600"
  },
  {
    _id: "mock-5",
    title: "AWS Cloud Practitioner",
    instructor: "Neal Davis",
    rating: 4.8,
    reviewsCount: "7.2K",
    duration: "8h",
    studentsCount: "33K",
    platform: "aws",
    category: "cloud_computing",
    type: "paid",
    difficulty: "Beginner",
    price: "$39",
    photo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600"
  },
  {
    _id: "mock-6",
    title: "Mobile App Development with Flutter",
    instructor: "Maximilian Schwarzmüller",
    rating: 4.6,
    reviewsCount: "5.8K",
    duration: "18h",
    studentsCount: "28K",
    platform: "udemy",
    category: "mobile_development",
    type: "paid",
    difficulty: "Intermediate",
    price: "$54",
    photo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600"
  },
  {
    _id: "mock-7",
    title: "Communication Skills for Professionals",
    instructor: "Dale Carnegie",
    rating: 4.7,
    reviewsCount: "4.2K",
    duration: "6h",
    studentsCount: "22K",
    platform: "coursera",
    category: "communication_skills",
    type: "paid",
    difficulty: "Beginner",
    price: "$29",
    photo: "https://images.unsplash.com/photo-1521791136368-1a46827d091c?q=80&w=600"
  },
  {
    _id: "mock-8",
    title: "Product Management Foundations",
    instructor: "Google",
    rating: 4.6,
    reviewsCount: "5.3K",
    duration: "15h",
    studentsCount: "31K",
    platform: "coursera",
    category: "management",
    type: "paid",
    difficulty: "Intermediate",
    price: "$49",
    photo: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600"
  },
  {
    _id: "mock-9",
    title: "Digital Marketing Mastery",
    instructor: "Neil Patel",
    rating: 4.7,
    reviewsCount: "7.1K",
    duration: "9h",
    studentsCount: "26K",
    platform: "udemy",
    category: "marketing",
    type: "paid",
    difficulty: "Beginner",
    price: "$34",
    photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600"
  },
  {
    _id: "mock-10",
    title: "Career Preparation Bootcamp",
    instructor: "Jenny Blake",
    rating: 4.6,
    reviewsCount: "3.8K",
    duration: "7h",
    studentsCount: "18K",
    platform: "coursera",
    category: "career_guidance",
    type: "paid",
    difficulty: "Beginner",
    price: "$24",
    photo: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600"
  },
  {
    _id: "mock-11",
    title: "SQL for Data Analysis",
    instructor: "Alex The Analyst",
    rating: 4.7,
    reviewsCount: "5.5K",
    duration: "6h",
    studentsCount: "19K",
    platform: "youtube",
    category: "data_science",
    type: "free",
    difficulty: "Beginner",
    price: "Free",
    photo: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600"
  },
  {
    _id: "mock-12",
    title: "Docker & Kubernetes Mastery",
    instructor: "TechWorld with Nana",
    rating: 4.8,
    reviewsCount: "4.6K",
    duration: "11h",
    studentsCount: "17K",
    platform: "youtube",
    category: "devops",
    type: "paid",
    difficulty: "Advanced",
    price: "$59",
    photo: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600"
  }
];

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
  
  // Ref for category pills scrolling
  const categoryContainerRef = useRef(null);

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
    if (!careerRecommendation || !careerRecommendation.careers || careerRecommendation.careers.length === 0) {
      return false;
    }

    const courseCat = course.category ? course.category.toLowerCase() : "";
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

  // Merge database fetched courses with mock courses (deduped by title)
  const getMergedCourses = () => {
    const merged = [...courses];
    MOCK_COURSES.forEach((mock) => {
      if (!merged.some((c) => c.title.toLowerCase() === mock.title.toLowerCase())) {
        merged.push(mock);
      }
    });
    return merged;
  };

  // Filter courses based on selections
  const mergedCourses = getMergedCourses();
  const filteredCourses = mergedCourses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesType = selectedType === "all" || course.type === selectedType;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.platform && course.platform.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const scrollCategoriesRight = () => {
    if (categoryContainerRef.current) {
      categoryContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleLaunchCourse = (course) => {
    if (course.url) {
      window.open(course.url, "_blank", "noopener,noreferrer");
    }
  };

  const renderPlatformLogo = (platform) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("coursera")) {
      return <span className="platform-lbl p-coursera">coursera</span>;
    } else if (p.includes("udemy")) {
      return <span className="platform-lbl p-udemy">udemy</span>;
    } else if (p.includes("youtube")) {
      return <span className="platform-lbl p-youtube">YouTube</span>;
    } else if (p.includes("aws")) {
      return <span className="platform-lbl p-aws">AWS</span>;
    } else if (p.includes("ibm")) {
      return <span className="platform-lbl p-ibm">IBM</span>;
    } else if (p.includes("google")) {
      return <span className="platform-lbl p-google">Google</span>;
    }
    return <span className="platform-lbl p-generic">{platform}</span>;
  };

  return (
    <div className="courses-page">
      {/* ---------------- NAVBAR ---------------- */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => navigate("/student/dashboard")}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate("/student/career")}>Career</button>
          <button className="nav-link" onClick={() => navigate("/student/skills")}>Skills</button>
          <button className="nav-link active-link">Learn</button>
          <button className="nav-link" onClick={() => navigate("/student/ai-assistant")}>AI Assistant</button>
        </div>
        <div className="navbar-avatar" onClick={() => navigate("/student/profile")} style={{ cursor: "pointer" }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>

      <div className="courses-content-wrapper">
        
        {/* ========================================================
            HERO/HEADER SECTION (matching reference)
           ======================================================== */}
        <section className="courses-hero">
          <div className="courses-hero-left">
            <h1 className="courses-hero-title">
              Learn Skills That<br />Build Your Future
            </h1>
            <p className="courses-hero-subtitle">
              Discover curated courses aligned with your career goals, skill gaps, and industry demand.
            </p>
            
            {/* Search Bar inside Hero */}
            <div className="hero-search-box">
              <input 
                type="text" 
                placeholder="Search courses, skills, instructors, platforms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="hero-search-btn" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            {/* Stat Cards inside Hero */}
            <div className="hero-stats-row">
              <div className="hero-stat-card">
                <span className="stat-card-icon">📚</span>
                <div>
                  <div className="stat-card-num">10,000+</div>
                  <div className="stat-card-lbl">Courses</div>
                </div>
              </div>
              <div className="hero-stat-card">
                <span className="stat-card-icon">🤝</span>
                <div>
                  <div className="stat-card-num">500+</div>
                  <div className="stat-card-lbl">Learning Partners</div>
                </div>
              </div>
              <div className="hero-stat-card">
                <span className="stat-card-icon">🎓</span>
                <div>
                  <div className="stat-card-num">100,000+</div>
                  <div className="stat-card-lbl">Students</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Mascot Visual (matching reference image) */}
          <div className="courses-hero-right">
            <div className="hero-visual-bg" />
            
            {/* Floating Card: Skill Progress 72% */}
            <div className="float-progress-card float-c1">
              <div className="progress-radial-mini">
                <svg width="34" height="34" viewBox="0 0 36 36">
                  <path className="r-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3" />
                  <path className="r-fill" strokeDasharray="72, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#564877" strokeWidth="3" />
                </svg>
                <span className="progress-text-mini">72%</span>
              </div>
              <div className="float-card-txt">
                <div className="fc-title">Skill Progress</div>
              </div>
            </div>

            {/* Floating Card: Career Match 95% */}
            <div className="float-progress-card float-c2">
              <div className="float-card-txt">
                <div className="fc-title">Career Match</div>
                <div className="fc-desc">95% Match</div>
              </div>
            </div>

            {/* Floating elements */}
            <span className="decor-spark s-1">✦</span>
            <span className="decor-spark s-2">✦</span>
            <span className="decor-cap">🎓</span>

            {/* Mascot Characters inside a desk scene */}
            <div className="mascot-scene">
              <div className="mascot-avatar-container explorer-avatar">
                <img src={explorerImg} alt="Explorer Goggles Kid" className="m-img-explorer" />
              </div>
              <div className="mascot-avatar-container robot-avatar">
                <img src={chatbotImg} alt="AI Assistant Mascot" className="m-img-robot" />
              </div>
              {/* Laptop visual element */}
              <div className="desk-laptop">
                <div className="laptop-screen">
                  <div className="screen-inner-glow" />
                </div>
                <div className="laptop-keyboard" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            FILTER BAR (second row matching reference image)
           ======================================================== */}
        <section className="courses-filters-row">
          <div className="filters-upper-line">
            {/* Search Input */}
            <div className="filter-search-box">
              <input 
                type="text" 
                placeholder="Search courses, skills, instructors, platforms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="filter-search-icon">🔍</span>
            </div>

            {/* Pricing Filter */}
            <div className="filter-pricing-box">
              <span className="pricing-lbl">Pricing:</span>
              <div className="pricing-capsules">
                <button 
                  className={`pricing-cap-btn ${selectedType === "all" ? "active" : ""}`} 
                  onClick={() => setSelectedType("all")}
                >
                  All
                </button>
                <button 
                  className={`pricing-cap-btn ${selectedType === "free" ? "active" : ""}`} 
                  onClick={() => setSelectedType("free")}
                >
                  Free
                </button>
                <button 
                  className={`pricing-cap-btn ${selectedType === "paid" ? "active" : ""}`} 
                  onClick={() => setSelectedType("paid")}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>

          {/* Categories Horizontal Scroll Pills */}
          <div className="filter-categories-line">
            <span className="categories-lbl">Categories:</span>
            <div className="categories-scroll-wrapper">
              <div className="categories-pills-container" ref={categoryContainerRef}>
                {Object.keys(CATEGORY_MAP).map((key) => {
                  const isActive = selectedCategory === key;
                  return (
                    <button
                      key={key}
                      className={`cat-pill-btn ${isActive ? "active" : ""}`}
                      onClick={() => setSelectedCategory(key)}
                    >
                      {CATEGORY_MAP[key]}
                    </button>
                  );
                })}
              </div>
              <button className="categories-arrow-btn" onClick={scrollCategoriesRight} aria-label="Scroll Categories">
                ➔
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            FEATURED COURSES SECTION
           ======================================================== */}
        <section className="courses-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-title-icon">✦</span>
              Featured Courses
            </h2>
            <button className="view-all-btn" onClick={() => setSelectedCategory("all")}>
              View All Courses &nbsp;➔
            </button>
          </div>

          {loading ? (
            <div className="loader-box-custom">
              <div className="pulse-spinner"></div>
              <p>Fetching matching learning resources...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="featured-courses-grid">
              {filteredCourses.map((course) => {
                const isRec = isRecommended(course);
                
                // Set default display values if database course lacks them
                const ratingVal = course.rating || 4.7;
                const reviewsVal = course.reviewsCount || "8.5K";
                const durationVal = course.duration || "18h";
                const studentsVal = course.studentsCount || "42K";
                const difficultyVal = course.difficulty || "Beginner";
                const priceVal = course.price || (course.type === "free" ? "Free" : "$49");

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
                      <img 
                        src={course.photo} 
                        alt={course.title} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600";
                        }} 
                      />
                      <span className={`cat-card-tag ${course.category || "web_development"}`}>
                        {CATEGORY_MAP[course.category] || course.category}
                      </span>
                      <button className="course-bookmark-btn" onClick={(e) => e.stopPropagation()} aria-label="Bookmark Course">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="course-card-body">
                      <h3 className="course-title-text" title={course.title}>
                        {course.title}
                      </h3>
                      
                      <p className="course-instructor-text">
                        {course.instructor || "Instructor"}
                      </p>

                      <div className="course-rating-row">
                        <span className="rating-star">★</span>
                        <span className="rating-score">{ratingVal}</span>
                        <span className="rating-count">({reviewsVal})</span>
                        <span className="duration-tag">◷ {durationVal}</span>
                      </div>

                      <div className="students-count-row">
                        {studentsVal} students
                      </div>

                      <div className="course-card-meta-bottom">
                        {renderPlatformLogo(course.platform)}
                        <span className="difficulty-lbl">{difficultyVal}</span>
                        <span className="price-lbl-tag">{priceVal}</span>
                      </div>

                      <div className="course-card-action-row">
                        <button className="card-btn-outline" onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); }}>
                          Register
                        </button>
                        <button className="card-btn-primary" onClick={(e) => { e.stopPropagation(); handleLaunchCourse(course); }}>
                          Enroll Now
                        </button>
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
        </section>

        {/* ========================================================
            POPULAR LEARNING PATHS SECTION (matching reference)
           ======================================================== */}
        <section className="courses-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-title-icon">✦</span>
              Popular Learning Paths
            </h2>
            <button className="view-all-btn">
              View All Paths &nbsp;➔
            </button>
          </div>

          <div className="paths-grid">
            {/* Path Card 1: AI Engineer */}
            <div className="path-card">
              <div className="path-header">
                <h3 className="path-title">AI Engineer Roadmap</h3>
                <span className="path-meta-lbl">8-10 Months · 28 Courses</span>
              </div>
              <p className="path-desc">
                Become an AI engineer and build intelligent systems of the future.
              </p>
              <div className="path-progress-box">
                <div className="path-progress-txt">
                  <span>Progress</span>
                  <strong>81% Complete</strong>
                </div>
                <div className="path-progress-bar-track">
                  <div className="path-progress-bar-fill" style={{ width: "81%" }} />
                </div>
              </div>
              <div className="path-skills-block">
                <span className="path-section-lbl">Skills you'll gain:</span>
                <div className="path-skills-row">
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">PyTorch</span>
                  <span className="skill-tag">TensorFlow</span>
                  <span className="skill-tag">NLP</span>
                </div>
              </div>
              <div className="path-footer">
                <span>Career Outcome:</span>
                <strong>AI Engineer 👤</strong>
              </div>
            </div>

            {/* Path Card 2: Data Scientist */}
            <div className="path-card">
              <div className="path-header">
                <h3 className="path-title">Data Scientist Roadmap</h3>
                <span className="path-meta-lbl">6-8 Months · 22 Courses</span>
              </div>
              <p className="path-desc">
                Master data science and solve real-world problems with data analytics.
              </p>
              <div className="path-progress-box">
                <div className="path-progress-txt">
                  <span>Progress</span>
                  <strong>63% Complete</strong>
                </div>
                <div className="path-progress-bar-track">
                  <div className="path-progress-bar-fill" style={{ width: "63%" }} />
                </div>
              </div>
              <div className="path-skills-block">
                <span className="path-section-lbl">Skills you'll gain:</span>
                <div className="path-skills-row">
                  <span className="skill-tag">R Studio</span>
                  <span className="skill-tag">SQL</span>
                  <span className="skill-tag">Pandas</span>
                  <span className="skill-tag">Tableau</span>
                </div>
              </div>
              <div className="path-footer">
                <span>Career Outcome:</span>
                <strong>Data Scientist 📊</strong>
              </div>
            </div>

            {/* Path Card 3: Full Stack Developer */}
            <div className="path-card">
              <div className="path-header">
                <h3 className="path-title">Full Stack Developer Roadmap</h3>
                <span className="path-meta-lbl">6-9 Months · 20 Courses</span>
              </div>
              <p className="path-desc">
                Become a full stack developer and build modern responsive web applications.
              </p>
              <div className="path-progress-box">
                <div className="path-progress-txt">
                  <span>Progress</span>
                  <strong>72% Complete</strong>
                </div>
                <div className="path-progress-bar-track">
                  <div className="path-progress-bar-fill" style={{ width: "72%" }} />
                </div>
              </div>
              <div className="path-skills-block">
                <span className="path-section-lbl">Skills you'll gain:</span>
                <div className="path-skills-row">
                  <span className="skill-tag">React.js</span>
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">MongoDB</span>
                  <span className="skill-tag">Docker</span>
                </div>
              </div>
              <div className="path-footer">
                <span>Career Outcome:</span>
                <strong>Full Stack Developer 💻</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            RECOMMENDED FOR YOU SECTION (matching reference)
           ======================================================== */}
        <section className="courses-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span className="section-title-icon">✦</span>
                Recommended for You
              </h2>
              <p className="section-subtitle">Based on your career goal: <span className="rec-role-highlight">Data Scientist</span></p>
            </div>
            <button className="view-all-btn">
              View All Recommendations &nbsp;➔
            </button>
          </div>

          <div className="recommendations-row">
            {/* Rec Card 1 */}
            <div className="rec-card">
              <div className="rec-card-logo">IBM</div>
              <h3 className="rec-card-title">Python for Data Science</h3>
              <div className="rec-progress-box">
                <div className="rec-progress-lbl">70% Complete</div>
                <div className="rec-progress-track">
                  <div className="rec-progress-fill" style={{ width: "70%" }} />
                </div>
              </div>
              <button className="rec-card-btn">Continue Learning</button>
            </div>

            {/* Rec Card 2 */}
            <div className="rec-card">
              <div className="rec-card-logo g-logo">G</div>
              <h3 className="rec-card-title">Statistics & Probability</h3>
              <div className="rec-progress-box">
                <div className="rec-progress-lbl">40% Complete</div>
                <div className="rec-progress-track">
                  <div className="rec-progress-fill" style={{ width: "40%" }} />
                </div>
              </div>
              <button className="rec-card-btn">Continue Learning</button>
            </div>

            {/* Rec Card 3 */}
            <div className="rec-card">
              <div className="rec-card-logo c-logo">C</div>
              <h3 className="rec-card-title">Data Visualization with Tableau</h3>
              <div className="rec-progress-box">
                <div className="rec-progress-lbl">15% Complete</div>
                <div className="rec-progress-track">
                  <div className="rec-progress-fill" style={{ width: "15%" }} />
                </div>
              </div>
              <button className="rec-card-btn">Continue Learning</button>
            </div>

            {/* Rec Card 4 */}
            <div className="rec-card">
              <div className="rec-card-logo u-logo">û</div>
              <h3 className="rec-card-title">Machine Learning A-Z</h3>
              <div className="rec-progress-box">
                <div className="rec-progress-lbl">85% Complete</div>
                <div className="rec-progress-track">
                  <div className="rec-progress-fill" style={{ width: "85%" }} />
                </div>
              </div>
              <button className="rec-card-btn">Continue Learning</button>
            </div>
          </div>
        </section>

        {/* ========================================================
            PARTNERS LOGOS ROW (matching reference)
           ======================================================== */}
        <section className="partners-section">
          <span className="partners-lbl">Our Learning Partners</span>
          <div className="partners-logos-row">
            <span className="p-logo-item coursera">coursera</span>
            <span className="p-logo-item udemy">udemy</span>
            <span className="p-logo-item edx">edX</span>
            <span className="p-logo-item google">Google</span>
            <span className="p-logo-item microsoft">Microsoft</span>
            <span className="p-logo-item aws">AWS</span>
            <span className="p-logo-item youtube">YouTube Learning</span>
          </div>
        </section>

        {/* ========================================================
            CTA FOOTER BANNER (matching reference)
           ======================================================== */}
        <section className="courses-cta-banner">
          <div className="cta-banner-content">
            <h2 className="cta-banner-title">Start Learning Today</h2>
            <p className="cta-banner-desc">
              Build in-demand skills and unlock better career opportunities.
            </p>
            <button className="cta-banner-btn" onClick={() => setSelectedCategory("all")}>
              Explore Courses &nbsp;➔
            </button>
          </div>
          <div className="cta-banner-visual">
            <span className="cta-decor-cap">🎓</span>
            <div className="cta-avatars-pile">
              <span className="avatar-pile-item av-1">👤</span>
              <span className="avatar-pile-item av-2">👤</span>
              <span className="avatar-pile-item av-3">👤</span>
              <span className="avatar-pile-item av-4">👤</span>
            </div>
            <span className="cta-student-count">20K+ students already learning</span>
          </div>
        </section>

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
                <img 
                  src={selectedCourse.photo} 
                  alt={selectedCourse.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600";
                  }} 
                />
                <span className={`popup-type-badge ${selectedCourse.type || "paid"}`}>
                  {(selectedCourse.type || "paid").toUpperCase()}
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
                👨‍🏫 Created by <strong>{selectedCourse.instructor || "Instructor"}</strong>
              </div>

              <div className="popup-description-box">
                <h4>Course Description</h4>
                <p>{selectedCourse.description || "Learn core conceptual principles, real world problem analysis, and industry applications from this expert-led syllabus."}</p>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button 
                className="btn-modal btn-cancel" 
                onClick={() => setSelectedCourse(null)}
              >
                Close
              </button>
              <button 
                className="btn-modal btn-save btn-launch-course"
                onClick={() => handleLaunchCourse(selectedCourse)}
              >
                🚀 Go to Course Video 🎥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
