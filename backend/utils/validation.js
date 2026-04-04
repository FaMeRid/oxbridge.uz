const Joi = require("joi");

const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    displayName: Joi.string().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateSubmission = (data) => {
  const schema = Joi.object({
    testId: Joi.string().uuid().required(),
    answers: Joi.array().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateTest = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    skill: Joi.string()
      .valid("listening", "reading", "writing", "speaking")
      .required(),
    questions: Joi.array().required(),
    correctAnswers: Joi.array().required(),
    difficultyLevel: Joi.string().valid("easy", "medium", "hard"),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateRegister,
  validateLogin,
  validateSubmission,
  validateTest,
};