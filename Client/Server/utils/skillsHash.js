const crypto = require('crypto')

module.exports = function generateSkillsHash(skills) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify([...skills].sort()))
    .digest('hex')
}
