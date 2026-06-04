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


module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
};
