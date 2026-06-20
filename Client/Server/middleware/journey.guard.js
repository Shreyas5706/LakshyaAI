const requireDomainConfirmed = (req, res, next) => {
  const journey = req.journey;

  if (!journey || !journey.isDomainConfirmed) {
    return res.status(403).json({
      success: false,
      message: 'Domain not confirmed'
    });
  }

  next();
};

module.exports = requireDomainConfirmed;
