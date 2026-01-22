const mongoose = require("mongoose");
const { env } = require( "./env.js");
const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("✅MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
