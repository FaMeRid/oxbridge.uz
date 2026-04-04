const supabase = require("../config/database");
const logger = require("../utils/logger");

// GET ALL STUDENTS
exports.getStudents = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, displayName, targetBand, created_at")
      .eq("role", "student");

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// GET STUDENT DETAIL
exports.getStudentDetail = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", studentId)
      .single();

    if (userError) throw userError;

    const { data: submissions } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", studentId);

    res.json({
      user,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// GET CLASS ANALYTICS
exports.getClassAnalytics = async (req, res, next) => {
  try {
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("*");

    if (error) throw error;

    const analytics = {
      totalSubmissions: submissions.length,
      avgScore: Math.round(
        submissions.reduce((sum, s) => sum + (s.auto_score || 0), 0) /
          submissions.length
      ),
      pendingReview: submissions.filter(
        (s) => s.status === "pending_review"
      ).length,
    };

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};