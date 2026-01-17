// studentService.js
// PURPOSE: Fetch student profile data (JSON now, API later)

export const studentService = {
  async getStudentProfile(studentId) {
    try {
      // 🔁 Replace this with API later
      const res = await fetch("/data/student.profile.json");
      const data = await res.json();

      // If multi-student supported later
      return data.find((s) => s.student_id === studentId) || data[0];
    } catch (error) {
      console.error("Error fetching student profile:", error);
      return null;
    }
  },

  async getStudentSkills(studentId) {
    try {
      const res = await fetch("/data/student.skillScore.json");
      const data = await res.json();

      return data.filter((skill) => skill.student_id === studentId);
    } catch (error) {
      console.error("Error fetching skill scores:", error);
      return [];
    }
  }
};
