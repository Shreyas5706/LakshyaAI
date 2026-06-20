const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const chatbotController = require("../controllers/chatbot.controller");

// POST /api/chatbot - Handles message queries from the authenticated user
router.post("/", authMiddleware, chatbotController.handleChat);

module.exports = router;
