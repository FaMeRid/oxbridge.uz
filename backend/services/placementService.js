const calculateLevel = (answers, questions) => {
  let score = 0;

  answers.forEach((ans) => {
    const q = questions.find(q => q.id === ans.id);
    if (q && q.answer === ans.answer) {
      score++;
    }
  });

  const percent = (score / questions.length) * 100;

  if (percent < 20) return "A1";
  if (percent < 35) return "A2";
  if (percent < 50) return "B1";
  if (percent < 70) return "B2";
  if (percent < 85) return "C1";
  return "C2";
};

module.exports = { calculateLevel };