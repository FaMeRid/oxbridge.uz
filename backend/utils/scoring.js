const calculateScore = (answers, correctAnswers) => {
  let correctCount = 0;

  answers.forEach((answer, index) => {
    if (answer.toLowerCase() === correctAnswers[index].toLowerCase()) {
      correctCount++;
    }
  });

  const score = (correctCount / correctAnswers.length) * 40;
  return Math.round(score * 10) / 10;
};

const calculateBandScore = (score) => {
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 20) return 5.5;
  if (score >= 16) return 5.0;
  return 4.0;
};

module.exports = { calculateScore, calculateBandScore };