const express = require("express");
const {
  checkMlHealthFromNode,
} = require("../controllers/mlhealth.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/health", authMiddleware, checkMlHealthFromNode);

module.exports = router;
