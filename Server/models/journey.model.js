const mongoose = require('mongoose')

const JourneySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },

  predictedDomain: {
    type: String, // IT / NON_IT
    default: null
  },

  confirmedDomain: {
    type: String,
    default: null
  },

  isDomainConfirmed: {
    type: Boolean,
    default: false
  },

  currentStep: {
    type: String,
    enum: [
      'NOT_STARTED',
      'DOMAIN_PREDICTED',
      'DOMAIN_CONFIRMED',
      'CAREER_PREDICTED'
    ],
    default: 'NOT_STARTED'
  },

  domainPredictedAt: Date,
  domainConfirmedAt: Date

}, { timestamps: true })

module.exports = mongoose.model('Journey', JourneySchema)
