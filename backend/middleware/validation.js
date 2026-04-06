const logger = require("../utils/logger");

const validateRequest = (schema) => {
  return (req, res, next) => {
    // Если schema это функция (Joi validators обычно функции)
    let validationResult;
    
    if (typeof schema === 'function') {
      // Вызываем как функцию
      validationResult = schema(req.body);
    } else if (schema.validate) {
      // Если это Joi object с методом validate
      validationResult = schema.validate(req.body, { abortEarly: false });
    } else {
      return res.status(500).json({ error: "Invalid schema" });
    }

    const { error, value } = validationResult;

    if (error) {
      const messages = error.details?.map(d => d.message).join(", ") || error.message;
      logger.warn(`Validation error: ${messages}`);
      return res.status(400).json({
        error: "Validation failed",
        details: error.details?.map(d => d.message) || [error.message],
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = validateRequest;