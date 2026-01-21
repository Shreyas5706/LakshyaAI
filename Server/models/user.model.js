const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "counselor", "admin"],
    default: "student"
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  skillsHash: {
    type: String,
    default: null
  },

  skillsUpdatedAt: {
    type: Date,
    default: null
  },

  lastMlSkillsHash: {
    type: String,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
