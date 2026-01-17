// roadmapService.js
// PURPOSE: Learning Roadmap data handler (JSON now → API later)

export const roadmapService = {
  async getRoadmapByCareer(careerName) {
    try {
      const res = await fetch("/data/learning.roadmap.json");
      const data = await res.json();

      // Career-specific roadmap
      const roadmap = data.find(
        (r) => r.career.toLowerCase() === careerName.toLowerCase()
      );

      return roadmap || null;
    } catch (error) {
      console.error("Error fetching learning roadmap:", error);
      return null;
    }
  },

  async getRoadmapProgress(studentId) {
    try {
      // 🔁 Dummy progress for now (future backend)
      return {
        student_id: studentId,
        completed_percentage: 42,
        completed_modules: ["HTML Basics", "CSS Fundamentals"]
      };
    } catch (error) {
      console.error("Error fetching roadmap progress:", error);
      return null;
    }
  }
};
