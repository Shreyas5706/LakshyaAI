const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const { confirmDomain, getJourneyStatus } = require('../controllers/journey.controller');

// GET JOURNEY STATUS
router.get(
  '/status',
  authMiddleware,
  getJourneyStatus
);

// DOMAIN CONFIRMATION ROUTE
router.post(
  '/confirm-domain',
  authMiddleware,
  confirmDomain
);

module.exports = router;
