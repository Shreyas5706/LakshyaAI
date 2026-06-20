const Journey = require('../models/journey.model');

const loadJourney = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const journey = await Journey.findOne({ userId });

    req.journey = journey; // ho sakta hai null bhi ho
    next();
  } catch (err) {
    console.error('Load journey failed:', err.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to load journey'
    });
  }
};

module.exports = loadJourney;
