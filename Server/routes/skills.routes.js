const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middleware')
const skillsController = require('../controllers/skills.controller')

router.put(
  '/skills',
  authMiddleware,
  skillsController.updateSkills
)

module.exports = router
