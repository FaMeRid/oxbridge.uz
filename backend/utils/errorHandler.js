class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorCodes = {
  INVALID_CREDENTIALS: { code: 401, message: "Invalid credentials" },
  UNAUTHORIZED: { code: 401, message: "Unauthorized" },
  FORBIDDEN: { code: 403, message: "Forbidden" },
  NOT_FOUND: { code: 404, message: "Not found" },
  VALIDATION_ERROR: { code: 422, message: "Validation error" },
  CONFLICT: { code: 409, message: "Conflict" },
  INTERNAL_ERROR: { code: 500, message: "Internal server error" },
};

module.exports = { AppError, errorCodes };