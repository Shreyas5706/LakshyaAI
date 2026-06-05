const mongoose = require("mongoose");

const mlCacheSchema = new mongoose.Schema(
  {
    modelType: {
      type: String,
      enum: ["DOMAIN_PREDICTION", "IT_CAREER_PREDICTION", "NON_IT_CAREER_PREDICTION"],
      required: true,
      index: true
    },

    skillsHash: {
      type: String,
      required: true,
      index: true
    },

    response: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    meta: {
      modelVersion: {
        type: String,
        default: "v1"
      }
    }
  },
  { timestamps: true }
);

// 🔒 One cache per (modelType + skillsHash)
mlCacheSchema.index(
  { modelType: 1, skillsHash: 1 },
  { unique: true }
);

module.exports = mongoose.model("MlCache", mlCacheSchema);
