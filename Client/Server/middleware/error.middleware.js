const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log error stack trace for debugging
  console.error("--> [SERVER ERROR]:", err);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
