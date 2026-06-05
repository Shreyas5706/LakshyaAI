const express = require("express");

const {
  predictCareerDomain,
  predictItCareerController,
  predictNonItCareerController,
} = require("../controllers/careers.controller.js");

const { checkMlHealthFromNode } = require("../controllers/mlhealth.controller.js");

const authMiddleware = require('../middleware/auth.middleware');
const loadJourney = require('../middleware/loadjourney');
const requireDomainConfirmed = require('../middleware/journey.guard');

const router = express.Router();

// STEP 1: Domain prediction (NO journey guard here)
router.post(
  "/domain",
  authMiddleware,
  predictCareerDomain
);

// STEP 2: IT career prediction (JOURNEY ENFORCED)
router.post(
  "/it",
  authMiddleware,
  loadJourney,
  requireDomainConfirmed,
  predictItCareerController
);

// STEP 2 (ALTERNATIVE): Non-IT career prediction (JOURNEY ENFORCED)
router.post(
  "/non-it",
  authMiddleware,
  loadJourney,
  requireDomainConfirmed,
  predictNonItCareerController
);

module.exports = router;
