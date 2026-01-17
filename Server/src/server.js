require("dotenv").config();      // 1️⃣ Load env FIRST
const app = require("./app");
const connectDB = require("../config/db.js"); // adjust path if needed

const PORT = process.env.PORT || 3000;

connectDB();                     // 2️⃣ Connect DB

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
