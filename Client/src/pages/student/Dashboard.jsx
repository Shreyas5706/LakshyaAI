// ============================================================
//  Dashboard.jsx
//  This is the HOME PAGE of LAKSHYA AI.
//  The student sees this page every time they log in.
//
//  What this page shows:
//  1. A welcome banner with the student's name
//  2. Their top career match
//  3. Quick stats (skills learned, courses done, streak, profile %)
//  4. Today's task card
//  5. Skills snapshot (mini bar chart)
//  6. Recent activity feed
//  7. Navigation cards to go to other sections
//
//  Where does student data come from?
//  We read it from localStorage — the browser's memory.
//  The OnboardingForm.jsx saved the data there earlier.
// ============================================================

// Import React and useState, useEffect from the react library
// useState  — stores values that can change (like the counter animation)
// useEffect — runs code after the page loads (like starting animations)
import React, { useState, useEffect } from "react";

// Import the CSS file that styles this page
import "./Dashboard.css";

// ============================================================
//  DUMMY DATA
//  Since we have no backend yet, we create fake data here.
//  Later you can replace this with real data from a database.
// ============================================================

// These are the student's current skill levels (0 to 100)
const studentSkills = [
  { name: "Creativity", level: 80 },
  { name: "Problem Solving", level: 70 },
  { name: "Communication", level: 60 },
];

// These are recent things the student did
const recentActivities = [
  { text: "Completed: Figma Basics", time: "Yesterday", emoji: "✅" },
  {
    text: "Started: JavaScript for Beginners",
    time: "2 days ago",
    emoji: "▶️",
  },
  { text: "Career path set: UI/UX Designer", time: "3 days ago", emoji: "🎯" },
  { text: "Profile completed: 80%", time: "4 days ago", emoji: "👤" },
];

// Today's recommended task for the student
const todayTask = {
  title: "Watch JavaScript Basics (Part 2)",
  duration: "45 mins",
  type: "Video Course",
};

// ============================================================
//  MAIN COMPONENT: Dashboard
//
//  Props (inputs this component accepts):
//  - onNavigate: a function that is called when the student
//    clicks a navigation card. It tells the parent (App.jsx)
//    which page to go to next.
// ============================================================
function Dashboard({ onNavigate }) {
  // ----------------------------------------------------------
  //  STATE: Student data read from localStorage
  //  We start with an empty object {} and fill it after load
  // ----------------------------------------------------------
  const [student, setStudent] = useState({
    name: "",
    careerGoal: "",
    skills: [],
    interests: [],
  });

  // ----------------------------------------------------------
  //  STATE: The animated counter values for the stats row
  //  They start at 0 and count up to the real value
  // ----------------------------------------------------------
  const [statsCounter, setStatsCounter] = useState({
    skillsLearned: 0,
    coursesDone: 0,
    streak: 0,
    profilePct: 0,
  });

  // The real (final) values the counters will count up to
  const realStats = {
    skillsLearned: 3,
    coursesDone: 2,
    streak: 5,
    profilePct: 80,
  };

  // ----------------------------------------------------------
  //  STATE: Controls whether skill bars are animated
  //  We flip this to true after the page loads so bars grow
  // ----------------------------------------------------------
  const [showBars, setShowBars] = useState(false);

  // ----------------------------------------------------------
  //  useEffect: Runs once when the page first loads
  //
  //  useEffect(function, []) — the empty [] means
  //  "run this only one time, when the component first appears"
  // ----------------------------------------------------------
  useEffect(function () {
    // --- Step 1: Read student data from localStorage ---
    // localStorage.getItem() reads what OnboardingForm saved
    const savedData = localStorage.getItem("lakshya_student");

    if (savedData) {
      // JSON.parse() converts the saved text back into an object
      const parsedStudent = JSON.parse(savedData);
      setStudent(parsedStudent);
    }

    // --- Step 2: Animate the skill bars after a short delay ---
    // setTimeout waits 400ms then sets showBars to true
    // This triggers the CSS animation on the bars
    setTimeout(function () {
      setShowBars(true);
    }, 400);

    // --- Step 3: Animate the stat counters ---
    // We count from 0 to the real value over 1.5 seconds
    // We use setInterval to increment the numbers gradually
    animateCounters();
  }, []); // The [] means run only once on page load

  // ----------------------------------------------------------
  //  FUNCTION: animateCounters
  //
  //  This makes the stat numbers count up from 0.
  //  We use setInterval which runs a function repeatedly
  //  every X milliseconds until we tell it to stop.
  // ----------------------------------------------------------
  function animateCounters() {
    // How long the animation should take (in milliseconds)
    const duration = 1500;

    // How often we update the number (every 30ms = ~33 times/second)
    const interval = 30;

    // Total number of steps = duration / interval
    const steps = duration / interval;

    // We track how many steps we've done
    let currentStep = 0;

    // setInterval runs the function inside it every 30ms
    const timer = setInterval(function () {
      currentStep = currentStep + 1;

      // Calculate what fraction of the animation is done (0 to 1)
      const progress = currentStep / steps;

      // Update the counters based on progress
      // Math.round() rounds to nearest whole number
      setStatsCounter({
        skillsLearned: Math.round(realStats.skillsLearned * progress),
        coursesDone: Math.round(realStats.coursesDone * progress),
        streak: Math.round(realStats.streak * progress),
        profilePct: Math.round(realStats.profilePct * progress),
      });

      // When we reach the last step, stop the interval
      // and make sure counters show exact final values
      if (currentStep >= steps) {
        clearInterval(timer);
        setStatsCounter({
          skillsLearned: realStats.skillsLearned,
          coursesDone: realStats.coursesDone,
          streak: realStats.streak,
          profilePct: realStats.profilePct,
        });
      }
    }, interval);
  }

  // ----------------------------------------------------------
  //  FUNCTION: getGreeting
  //
  //  Returns "Good Morning", "Good Afternoon", or "Good Evening"
  //  based on the current time of day.
  // ----------------------------------------------------------
  function getGreeting() {
    // new Date().getHours() gives the current hour (0 to 23)
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  // ----------------------------------------------------------
  //  FUNCTION: handleNavigate
  //
  //  Called when the student clicks a navigation card.
  //  It calls the onNavigate function from the parent (App.jsx)
  //  so the parent can switch to the right page.
  // ----------------------------------------------------------
  function handleNavigate(pageName) {
    if (onNavigate) {
      onNavigate(pageName);
    }
  }

  // ----------------------------------------------------------
  //  RENDER: The HTML (JSX) that appears on screen
  // ----------------------------------------------------------
  return (
    <div className="dashboard-page">
      {/* -------------------------------------------------- */}
      {/* TOP NAVIGATION BAR                                  */}
      {/* -------------------------------------------------- */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">LAKSHYA AI</div>
        <div className="navbar-links">
          <button className="nav-link active-link">Dashboard</button>
          <button
            className="nav-link"
            onClick={function () {
              handleNavigate("career");
            }}
          >
            Career
          </button>
          <button
            className="nav-link"
            onClick={function () {
              handleNavigate("skills");
            }}
          >
            Skills
          </button>
          <button
            className="nav-link"
            onClick={function () {
              handleNavigate("learn");
            }}
          >
            Learn
          </button>
          <button
            className="nav-link"
            onClick={function () {
              handleNavigate("progress");
            }}
          >
            Progress
          </button>
        </div>
        {/* User avatar circle showing first letter of name */}
        <div className="navbar-avatar">
          {student.name ? student.name.charAt(0).toUpperCase() : "S"}
        </div>
      </nav>
      {/* -------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                   */}
      {/* -------------------------------------------------- */}
      <div className="dashboard-content">
        {/* ============================================== */}
        {/* WELCOME BANNER                                  */}
        {/* ============================================== */}
        <div className="welcome-banner">
          <div className="welcome-text-block">
            {/* Greeting changes based on time of day */}
            <p className="greeting-line">{getGreeting()} 👋</p>

            {/* Main welcome heading with student's name */}
            <h1 className="welcome-heading">
              Hey {student.name || "there"}, ready to move closer
              <br />
              to your dream career?
            </h1>

            {/* Career match pill — clickable */}
            <button
              className="career-match-pill"
              onClick={function () {
                handleNavigate("career");
              }}
            >
              ✨ Your top career match: {student.careerGoal || "UI/UX Designer"}{" "}
              →
            </button>
          </div>

          {/* Decorative circles in the background of the banner */}
          <div className="banner-circle banner-circle-1"></div>
          <div className="banner-circle banner-circle-2"></div>
          <div className="banner-circle banner-circle-3"></div>
        </div>

        {/* ============================================== */}
        {/* QUICK STATS ROW — 4 metric cards               */}
        {/* ============================================== */}
        <div className="stats-row">
          {/* Stat Card 1: Skills Learned */}
          <div className="stat-card stat-card-1">
            <div className="stat-icon">🧠</div>
            <div className="stat-number">
              {/* Show counter value — total skills is fixed at 8 */}
              {statsCounter.skillsLearned}
              <span className="stat-total">/8</span>
            </div>
            <div className="stat-label">Skills Learned</div>
          </div>

          {/* Stat Card 2: Courses Done */}
          <div className="stat-card stat-card-2">
            <div className="stat-icon">📚</div>
            <div className="stat-number">{statsCounter.coursesDone}</div>
            <div className="stat-label">Courses Done</div>
          </div>

          {/* Stat Card 3: Day Streak */}
          <div className="stat-card stat-card-3">
            <div className="stat-icon">🔥</div>
            <div className="stat-number">{statsCounter.streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>

          {/* Stat Card 4: Profile Complete */}
          <div className="stat-card stat-card-4">
            <div className="stat-icon">👤</div>
            <div className="stat-number">
              {statsCounter.profilePct}
              <span className="stat-total">%</span>
            </div>
            <div className="stat-label">Profile Complete</div>
          </div>
        </div>

        {/* ============================================== */}
        {/* MIDDLE SECTION — Task card + Skills snapshot   */}
        {/* We use a two-column layout here                */}
        {/* ============================================== */}
        <div className="middle-row">
          {/* --- TODAY'S TASK CARD --- */}
          <div className="todays-task-card">
            {/* Glowing label at the top */}
            <div className="task-label">⚡ Today's Task</div>

            <h3 className="task-title">{todayTask.title}</h3>

            {/* Task details row */}
            <div className="task-details">
              <span className="task-badge">{todayTask.type}</span>
              <span className="task-duration">🕐 {todayTask.duration}</span>
            </div>

            {/* Start Now button */}
            <button
              className="task-btn"
              onClick={function () {
                handleNavigate("learn");
              }}
            >
              Start Now →
            </button>
          </div>

          {/* --- SKILLS SNAPSHOT --- */}
          <div className="skills-snapshot-card">
            <h3 className="card-heading">Skills Snapshot 📊</h3>
            <p className="card-subtext">Your top current skills</p>

            {/* We loop through the skills array and create one bar for each */}
            <div className="skills-bar-list">
              {studentSkills.map(function (skill) {
                return (
                  <div key={skill.name} className="skill-bar-row">
                    {/* Skill name and percentage label */}
                    <div className="skill-bar-header">
                      <span className="skill-bar-name">{skill.name}</span>
                      <span className="skill-bar-percent">{skill.level}%</span>
                    </div>

                    {/* The track (gray background) of the bar */}
                    <div className="skill-bar-track">
                      {/* The filled portion — width depends on skill level */}
                      {/* We only set the width after showBars is true */}
                      {/* This triggers the CSS animation */}
                      <div
                        className="skill-bar-fill"
                        style={{
                          width: showBars ? skill.level + "%" : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Link to full skill analysis page */}
            <button
              className="see-full-link"
              onClick={function () {
                handleNavigate("skills");
              }}
            >
              See full analysis →
            </button>
          </div>
        </div>

        {/* ============================================== */}
        {/* RECENT ACTIVITY FEED                           */}
        {/* ============================================== */}
        <div className="activity-card">
          <h3 className="card-heading">Recent Activity 📋</h3>
          <p className="card-subtext">Here's what you've been up to</p>

          {/* List of activity items */}
          <div className="activity-list">
            {recentActivities.map(function (activity, index) {
              return (
                // Each item gets a slight delay in its animation
                // so they appear one after another (stagger effect)
                <div
                  key={index}
                  className="activity-item"
                  style={{ animationDelay: index * 0.1 + "s" }}
                >
                  {/* Emoji icon */}
                  <div className="activity-icon">{activity.emoji}</div>

                  {/* Activity text and time */}
                  <div className="activity-text-block">
                    <p className="activity-text">{activity.text}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================== */}
        {/* NAVIGATION CARDS — Go to other sections        */}
        {/* ============================================== */}
        <div className="nav-cards-section">
          <h3 className="card-heading">Explore Sections</h3>
          <p className="card-subtext">Jump to any section of your journey</p>

          <div className="nav-cards-grid">
            {/* Career Card */}
            <button
              className="nav-card nav-card-career"
              onClick={function () {
                handleNavigate("career");
              }}
            >
              <div className="nav-card-icon">🎯</div>
              <div className="nav-card-title">Career</div>
              <div className="nav-card-desc">See your matched career paths</div>
              <div className="nav-card-arrow">→</div>
            </button>

            {/* Skills Card */}
            <button
              className="nav-card nav-card-skills"
              onClick={function () {
                handleNavigate("skills");
              }}
            >
              <div className="nav-card-icon">📊</div>
              <div className="nav-card-title">Skills</div>
              <div className="nav-card-desc">Analyse gaps and strengths</div>
              <div className="nav-card-arrow">→</div>
            </button>

            {/* Learn Card */}
            <button
              className="nav-card nav-card-learn"
              onClick={function () {
                handleNavigate("learn");
              }}
            >
              <div className="nav-card-icon">📚</div>
              <div className="nav-card-title">Learn</div>
              <div className="nav-card-desc">Courses and tasks for you</div>
              <div className="nav-card-arrow">→</div>
            </button>

            {/* Progress Card */}
            <button
              className="nav-card nav-card-progress"
              onClick={function () {
                handleNavigate("progress");
              }}
            >
              <div className="nav-card-icon">📈</div>
              <div className="nav-card-title">Progress</div>
              <div className="nav-card-desc">Track your growth over time</div>
              <div className="nav-card-arrow">→</div>
            </button>
          </div>
        </div>
      </div>{" "}
      {/* end dashboard-content */}
    </div> /* end dashboard-page */
  );
}

// Export so App.jsx can import and use this component
export default Dashboard;
