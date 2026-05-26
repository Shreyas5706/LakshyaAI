const axios =require("axios");
const { env }= require( "../config/env.js");
// ENV CONFIG
const ML_BASE_URL =env.ml.backendUrl;
const ML_API_KEY = env.ml.apiKey;
const TIMEOUT = Number(env.ML_TIMEOUT_MS || 12000);

if (!ML_BASE_URL) {
  throw new Error("ML_BACKEND_URL is missing");
}

if (!ML_API_KEY) {
  throw new Error("ML_API_KEY is missing");
}

// AXIOS INSTANCE
const mlApi = axios.create({
  baseURL: ML_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": ML_API_KEY, 
  },
});

// INTERNAL ERROR NORMALIZER
const normalizeError = (err, endpoint) => {
  // Timeout (Render cold start, network issue)
  if (err.code === "ECONNABORTED") {
    throw new Error(`ML service timeout at ${endpoint}`);
  }

  // ML responded with an error
  if (err.response) {
    const status = err.response.status;
    const message =
      err.response.data?.detail ||
      err.response.data?.message ||
      "ML service error";

    throw new Error(`ML ${endpoint} failed (${status}): ${message}`);
  }

  // Network / DNS / service down
  throw new Error(`ML service unreachable at ${endpoint}`);
};

// PUBLIC ML CLIENT METHODS

/**
 * DOMAIN PREDICTOR
 * POST /predict/domain
 */
const predictDomain = async ({ education, skills, interest }) => {
  try {
    const payload = {
      education,
      skills: Array.isArray(skills) ? skills.join(" ") : skills,
      interest,
    };

    const { data } = await mlApi.post("/predict/domain", payload);

    // Defensive contract validation
    if (!data?.domain || typeof data.confidence !== "number") {
      throw new Error("Invalid response from domain predictor");
    }

    return {
      domain: data.domain,
      confidence: data.confidence,
    };
  } catch (err) {
    normalizeError(err, "/predict/domain");
  }
};

/**
 * IT CAREER PREDICTOR
 * POST /predict/it-career
 */
const predictItCareer = async ({ skills, top_k = 3 }) => {
  try {
    const payload = { skills, top_k };

    const { data } = await mlApi.post("/predict/it-career", payload);

    if (!Array.isArray(data?.results)) {
      throw new Error("Invalid response from IT career predictor");
    }

    return {
      results: data.results,
    };
  } catch (err) {
    normalizeError(err, "/predict/it-career");
  }
};

/**
 * ML HEALTH CHECK
 * GET /health
 */
const mlHealthCheck = async () => {
  try {
    const { data } = await mlApi.get("/health");

    if (typeof data?.status !== "string") {
      throw new Error("Invalid ML health response");
    }

    return data;
  } catch (err) {
    normalizeError(err, "/health");
  }
};

module.exports = { predictDomain, predictItCareer, mlHealthCheck };
