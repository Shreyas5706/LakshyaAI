const { ensureMlHealthy } = require("../services/mlhealth.guard.js");

const checkMlHealthFromNode = async (req, res) => {
  try {
    await ensureMlHealthy();

    return res.status(200).json({
      success: true,
      message: "ML service is healthy",
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "ML service is NOT healthy",
    });
  }
};
module.exports = {
  checkMlHealthFromNode,
};