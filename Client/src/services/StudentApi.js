/**
 * LAKSHYA – Student API Service (Mock, Future-Ready)
 * -------------------------------------------------
 * Uses existing local JSON files
 * Can be replaced with real backend APIs later
 */

/* Simulate network delay (UX realism) */
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

/* Generic fetch helper */
async function fetchJson(path) {
  await delay();

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load: ${path}`);
  }

  return response.json();
}

/* ===========================
   STUDENT PROFILE
=========================== */
export const getStudentProfile = async () => {
  return fetchJson("/data/student.profile.json");
};

/* ===========================
   CAREER RECOMMENDATION
=========================== */
export const getCareerRecommendation = async () => {
  return fetchJson("/data/career.recommendation.json");
};

/* ===========================
   STUDY PLANNER
=========================== */
export const getStudyPlanner = async () => {
  return fetchJson("/data/studyPlanner.data.json");
};

/* ===========================
   LEARNING ROADMAP
=========================== */
export const getLearningRoadmap = async () => {
  return fetchJson("/data/learning.roadmap.json");
};

/* ===========================
   COURSES
=========================== */
export const getCourses = async () => {
  return fetchJson("/data/courses.data.json");
};

/* ===========================
   INTERNSHIPS
=========================== */
export const getInternships = async () => {
  return fetchJson("/data/internship.data.json");
};

/* ===========================
   SKILL SCORES (Charts)
=========================== */
export const getSkillScores = async () => {
  return fetchJson("/data/student.skillScore.json");
};

export const getStudentAlerts = async () => {
  // Temporary: reuse career recommendations as alert data
  const recommendations = await fetchJson("/data/career.recommendation.json");
  // map to alert format
  return recommendations.slice(0, 5).map((r, i) => ({
    id: i,
    message: `New recommendation: ${r.title || r.careerName || "Career"}`,
  }));
};
