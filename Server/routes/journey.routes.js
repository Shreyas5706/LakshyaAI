const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const { confirmDomain } = require('../controllers/journey.controller');

// DOMAIN CONFIRMATION ROUTE
router.post(
  '/confirm-domain',
  authMiddleware,
  confirmDomain
);

module.exports = router;
