const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(422).json({
        error: "Validation error",
        details: errors,
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = validateRequest;