// internshipService.js
// PURPOSE: Fetch internship data (JSON now → API later)

export const internshipService = {
  async getInternships() {
    try {
      const res = await fetch("/data/internships.data.json");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching internships:", error);
      return [];
    }
  }
};
