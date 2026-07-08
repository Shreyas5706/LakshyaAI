const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { env }= require( "../config/env.js");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(env.googleClientId);


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

    // Rate limiting: 1 request per 5 minutes
    const now = Date.now();
    const cooldownPeriod = 5 * 60 * 1000; // 5 minutes
    if (user.lastPasswordResetRequest && (now - user.lastPasswordResetRequest.getTime() < cooldownPeriod)) {
      const remainingTime = cooldownPeriod - (now - user.lastPasswordResetRequest.getTime());
      const remainingMinutes = Math.ceil(remainingTime / 60 / 1000);
      return res.status(429).json({
        message: `A password reset link was already sent recently. Please wait ${remainingMinutes} minute(s) before requesting another link.`
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    user.lastPasswordResetRequest = now;

    await user.save();

    const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;
    console.log(`Password reset requested for email: ${email}. Generated token: ${resetToken}`);
    console.log(`Reset URL: ${resetUrl}`);

    const textMessage = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process: \n\n ${resetUrl}`;
    const htmlMessage = `
      <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8f8fc;">
        <h2 style="color: #564877; text-align: center;">Lakshya AI Password Recovery</h2>
        <p style="color: #1a1035; font-size: 16px;">Hello,</p>
        <p style="color: #555; font-size: 14.5px; line-height: 1.6;">You are receiving this email because you (or someone else) have requested the reset of a password for your account on Lakshya AI.</p>
        <p style="color: #555; font-size: 14.5px; line-height: 1.6;">Please click the button below to reset your password. This link will expire in 15 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #564877; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #8f8cac; font-size: 13px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: 0; border-top: 1px solid #ede9ff; margin: 20px 0;" />
        <p style="color: #8f8cac; font-size: 12px; text-align: center;">&copy; 2026 Lakshya AI. All rights reserved.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Lakshya AI Password Reset Request",
        text: textMessage,
        html: htmlMessage,
      });

      res.status(200).json({
        success: true,
        message: "A password reset link has been sent to your email address.",
      });
    } catch (emailError) {
      console.error("Email delivery failed:", emailError.message || emailError);

      // Graceful fallback for local development testing
      if (env.nodeEnv === "development") {
        console.log("\n========================================================");
        console.log("⚠️  [DEVELOPMENT SMTP FALLBACK] Email delivery failed.");
        console.log("Since you are in development mode, you can copy the link below to test the reset password flow:");
        console.log(resetUrl);
        console.log("========================================================\n");

        return res.status(200).json({
          success: true,
          message: "A password reset link has been generated (check your server terminal logs for the testing link).",
        });
      }

      // Rollback DB changes if email fails in production
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        message: "Unable to send verification email. Please try again later.",
      });
    }

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
      return res.status(400).json({
        message: "This password reset link is invalid or has expired. Please generate a new link to reset the password.",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Auto-login: generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      env.jwtSecret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Password reset successful! Logging you in...",
      token: jwtToken,
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


const googleAuth = async (req, res, next) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: "Google OAuth token is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google OAuth token payload" });
    }

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Sign up a new user using Google details
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        role: "student", // default role is student
      });
      console.log(`New Google user registered successfully: ${user.email}`);
    } else {
      // If user exists but registered via local, link the Google account
      let saveNeeded = false;
      if (!user.googleId) {
        user.googleId = googleId;
        saveNeeded = true;
      }
      if (user.authProvider === "local") {
        user.authProvider = "google";
        saveNeeded = true;
      }
      if (saveNeeded) {
        await user.save();
        console.log(`Google account linked to existing local user: ${user.email}`);
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      env.jwtSecret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token: jwtToken,
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
    console.error("Google Auth failed:", error);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  googleAuth,
};
