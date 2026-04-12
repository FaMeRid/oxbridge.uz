const questions = require("../data/placementQuestions.json");
const { calculateLevel } = require("../services/placementService");

exports.getPlacementTest = (req, res) => {
  res.json(questions);
};

exports.submitPlacementTest = (req, res) => {
  const { answers } = req.body;

  const level = calculateLevel(answers, questions);

  // можно сохранить в БД
  // await User.update({ level })

  res.json({
    level,
    message: `Your level is ${level}`
  });
};