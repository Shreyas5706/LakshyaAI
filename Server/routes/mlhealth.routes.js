const express = require("express");
const {
  checkMlHealthFromNode,
} = require("../controllers/mlhealth.controller");

const router = express.Router();

router.get("/health", checkMlHealthFromNode);

module.exports = router;
