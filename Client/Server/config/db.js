const mongoose = require("mongoose");
const { env } = require( "./env.js");
const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("✅MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    console.warn("⚠️ Server will continue running in a degraded state. Please ensure MongoDB is started locally.");
  }
};

module.exports = connectDB;
