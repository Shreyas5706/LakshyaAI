const User = require('../models/user.model')
const generateSkillsHash = require('../utils/skillsHash')

exports.updateSkills = async (req, res) => {
  const userId = req.user._id
  const { skills } = req.body

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Skills array required'
    })
  }

  const user = await User.findById(userId)

  const newHash = generateSkillsHash(skills)

  if (user.skillsHash === newHash) {
    return res.status(400).json({
      success: false,
      message: 'Skills unchanged'
    })
  }

  user.skills = skills
  user.skillsHash = newHash
  user.skillsUpdatedAt = new Date()

  await user.save()

  return res.json({
    success: true,
    message: 'Skills updated successfully'
  })
}
