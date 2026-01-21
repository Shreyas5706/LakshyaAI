const MlCache = require("../models/mlcache.model.js");

/**
 * Fetch cached ML response
 */
exports.getCachedResponse = async ({ modelType, skillsHash }) => {
  return await MlCache.findOne({
    modelType,
    skillsHash
  }).lean();
};

/**
 * Save ML response to cache
 * (safe against race conditions)
 */
exports.saveCachedResponse = async ({
  modelType,
  skillsHash,
  response
}) => {
  try {
    await MlCache.create({
      modelType,
      skillsHash,
      response
    });
  } catch (err) {
    // Duplicate cache entry → ignore
    if (err.code !== 11000) {
      throw err;
    }
  }
};
