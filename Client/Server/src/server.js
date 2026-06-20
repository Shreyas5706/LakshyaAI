const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const app = require("./app");
const connectDB = require("../config/db.js"); // adjust path if needed
const { env }= require( "../config/env.js");
const PORT = env.port || 3000;

connectDB();                     // 2️⃣ Connect DB

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
