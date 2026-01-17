// careerService.js
// PURPOSE: Career recommendations (ML-ready)

export const careerService = {
  async getCareerRecommendations(studentId) {
    try {
      const res = await fetch("/data/career.recommendation.json");
      const data = await res.json();

      return data.find((c) => c.student_id === studentId) || data[0];
    } catch (error) {
      console.error("Error fetching career recommendations:", error);
      return null;
    }
  }
};
