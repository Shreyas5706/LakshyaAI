const { mlHealthCheck } = require("./mlclient.service.js");

let lastHealthStatus = {
  ok: true,
  checkedAt: 0,
};

const HEALTH_TTL = 60 * 1000; // 60 seconds

const ensureMlHealthy = async () => {
  const now = Date.now();

  // If recent health check exists, reuse it
  if (now - lastHealthStatus.checkedAt < HEALTH_TTL) {
    if (!lastHealthStatus.ok) {
      throw new Error("ML service unhealthy");
    }
    return;
  }

  // Re-check health
  try {
    const health = await mlHealthCheck();

    if (health.status !== "ok" || health.model_loaded !== true) {
      throw new Error("ML service unhealthy");
    }

    lastHealthStatus = {
      ok: true,
      checkedAt: now,
    };
  } catch (err) {
    lastHealthStatus = {
      ok: false,
      checkedAt: now,
    };
    throw new Error("ML service unhealthy");
  }
};

// Standard CommonJS export
module.exports = {
  ensureMlHealthy,
};