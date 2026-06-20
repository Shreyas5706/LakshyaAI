const jwt = require("jsonwebtoken");
const { env }= require( "../config/env.js");

// Utility to parse a specific cookie from the req.headers.cookie string
const getCookieFromHeaders = (cookieHeader, cookieName) => {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";");
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(`${cookieName}=`)) {
      try {
        const decodedValue = decodeURIComponent(c.substring(cookieName.length + 1));
        return JSON.parse(decodedValue);
      } catch (e) {
        // Fallback for string cookie instead of JSON string
        return c.substring(cookieName.length + 1);
      }
    }
  }
  return null;
};

const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    // 1. Try to get token from Authorization header (standard Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fallback: Try to get token from browser cookie "lakshyaSession"
    if (!token && req.headers.cookie) {
      const sessionCookie = getCookieFromHeaders(req.headers.cookie, "lakshyaSession");
      if (sessionCookie && sessionCookie.token) {
        token = sessionCookie.token;
      }
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret);

    // Attach user info to request
    req.user = {
      _id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
