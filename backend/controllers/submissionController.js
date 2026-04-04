const supabase = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { calculateScore, calculateBandScore } = require("../utils/scoring");
const logger = require("../utils/logger");

// SUBMIT ANSWERS (STUDENT)
exports.submitAnswers = async (req, res, next) => {
  try {
    const { testId, answers, duration } = req.validatedData;
    const userId = req.user.userId;

    // Get test
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("*")
      .eq("id", testId)
      .single();

    if (testError) throw testError;

    let autoScore = null;
    let bandScore = null;

    // Auto-score for listening and reading
    if (["listening", "reading"].includes(test.skill)) {
      autoScore = calculateScore(answers, test.correct_answers);
      bandScore = calculateBandScore(autoScore);
    }

    // Create submission
    const { data: submission, error } = await supabase
      .from("submissions")
      .insert([
        {
          id: uuidv4(),
          user_id: userId,
          test_id: testId,
          answers,
          auto_score: autoScore,
          band_score: bandScore,
          skill: test.skill,
          duration,
          status: ["listening", "reading"].includes(test.skill)
            ? "completed"
            : "pending_review",
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    logger.info(`Submission created: ${submission.id}`);

    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

// GET MY SUBMISSIONS (STUDENT)
exports.getMySubmissions = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// GET STUDENT SUBMISSIONS (TEACHER)
exports.getStudentSubmissions = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", studentId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// GRADE SUBMISSION (TEACHER)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;
    const teacherId = req.user.userId;

    const bandScore = calculateBandScore(score);

    const { data, error } = await supabase
      .from("submissions")
      .update({
        auto_score: score,
        band_score: bandScore,
        feedback,
        teacher_id: teacherId,
        status: "completed",
        graded_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Submission graded: ${id}`);

    res.json(data);
  } catch (error) {
    next(error);
  }
};