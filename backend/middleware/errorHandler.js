const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error("Error:", err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  if (err.message?.includes("Unique constraint")) {
    return res.status(409).json({
      error: "Email already registered",
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
};

module.exports = errorHandler;