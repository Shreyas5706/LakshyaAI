const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { env }= require( "../config/env.js");


// =======================
// SIGNUP
// =======================
const signup = async (req, res, next) => {
  console.log("--> [SIGNUP REQUEST] Received payload:", req.body);
  const {
    name,
    email,
    password,
    role,
    age,
    gender,
    state,
    city,
    educationLevel,
    stream
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      age,
      gender,
      state,
      city,
      educationLevel,
      stream
    });

    console.log("New user registered successfully:", newUser);

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error); // ✅ pass to global error handler
  }
};

// =======================
// LOGIN
// =======================
const login = async (req, res, next) => {
  console.log("--> [LOGIN REQUEST] Received email:", req.body?.email);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      env.jwtSecret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        age: user.age,
        gender: user.gender,
        state: user.state,
        city: user.city,
        educationLevel: user.educationLevel,
        stream: user.stream,
        skills: user.skills || [],
        interests: user.interests || [],
      },
    });
  } catch (error) {
    next(error);
  }
};


// =======================
// forgot PASSWORD
// =======================
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    console.log(`Password reset requested for email: ${email}. Generated token: ${resetToken}`);

    res.status(200).json({
      message: "Password reset token generated successfully",
      resetToken: resetToken,
    });

  } catch (error) {
    next(error);
  }
};

// =======================
// RESET PASSWORD
// =======================
const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

// =======================
// UPDATE PROFILE AND PASSWORD
// =======================
const updateProfile = async (req, res, next) => {
  const userId = req.user._id;
  console.log("--> [UPDATE PROFILE REQUEST] Received for userId:", userId, req.body);
  const {
    name,
    age,
    gender,
    state,
    city,
    educationLevel,
    stream,
    skills,
    interests,
    password,        // new password (optional)
    currentPassword  // required if password is provided
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update simple fields if they are in req.body
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age ? Number(age) : null;
    if (gender !== undefined) user.gender = gender;
    if (state !== undefined) user.state = state;
    if (city !== undefined) user.city = city;
    if (educationLevel !== undefined) user.educationLevel = educationLevel;
    if (stream !== undefined) user.stream = stream;

    // Update skills & generate skillsHash if skills are provided
    if (skills !== undefined && Array.isArray(skills)) {
      user.skills = skills;
      const generateSkillsHash = require("../utils/skillsHash");
      const newHash = generateSkillsHash(skills);
      user.skillsHash = newHash;
      user.skillsUpdatedAt = new Date();
      // Ensure we keep this in sync
      user.lastMlSkillsHash = newHash;
    }

    // Update interests
    if (interests !== undefined && Array.isArray(interests)) {
      user.interests = interests;
    }

    // Change password logic
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect current password" });
      }
      // Password validation
      const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!pwdRegex.test(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    console.log("User profile updated successfully in MongoDB:", user._id);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        age: user.age,
        gender: user.gender,
        state: user.state,
        city: user.city,
        educationLevel: user.educationLevel,
        stream: user.stream,
        skills: user.skills || [],
        interests: user.interests || []
      }
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    next(error);
  }
};


module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
};
