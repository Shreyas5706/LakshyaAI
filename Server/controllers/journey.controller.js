const Journey = require('../models/journey.model');

/**
 * DOMAIN CONFIRMATION
 * User confirms the predicted domain
 */
const confirmDomain = async (req, res) => {
  try {
    const userId = req.user._id;
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Domain is required'
      });
    }

    const journey = await Journey.findOne({ userId });

    // 1️⃣ Journey must exist
    if (!journey) {
      return res.status(400).json({
        success: false,
        message: 'Journey not started yet'
      });
    }

    // 2️⃣ Domain must be predicted first
    if (journey.currentStep !== 'DOMAIN_PREDICTED') {
      return res.status(400).json({
        success: false,
        message: 'Domain not ready for confirmation'
      });
    }

    // 3️⃣ Already confirmed?
    if (journey.isDomainConfirmed) {
      return res.status(400).json({
        success: false,
        message: 'Domain already confirmed'
      });
    }

    // 4️⃣ User confirmation must match ML prediction
    if (domain !== journey.predictedDomain) {
      return res.status(400).json({
        success: false,
        message: 'Confirmed domain does not match predicted domain'
      });
    }

    // ✅ CONFIRM DOMAIN
    journey.confirmedDomain = domain;
    journey.isDomainConfirmed = true;
    journey.currentStep = 'DOMAIN_CONFIRMED';
    journey.domainConfirmedAt = new Date();

    await journey.save();

    return res.status(200).json({
      success: true,
      message: 'Domain confirmed successfully',
      domain
    });
  } catch (err) {
    console.error('Domain confirmation failed:', err.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to confirm domain'
    });
  }
};

module.exports = {
  confirmDomain
};
