const supabase = require("../config/database");
const logger = require("../utils/logger");

// GET STUDENT PROFILE
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { data, error } = await supabase
      .from("users")
      .select("id, email, displayName, role, targetBand, created_at")
      .eq("id", userId)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// UPDATE STUDENT PROFILE
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { displayName, targetBand } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({
        displayName,
        targetBand,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Profile updated: ${userId}`);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// GET STUDENT STATISTICS
exports.getStatistics = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("auto_score, band_score, submitted_at")
      .eq("user_id", userId);

    if (error) throw error;

    const stats = {
      totalTests: submissions.length,
      avgScore:
        submissions.length > 0
          ? Math.round(
              submissions.reduce((sum, s) => sum + (s.auto_score || 0), 0) /
                submissions.length
            )
          : 0,
      bestScore:
        submissions.length > 0
          ? Math.max(...submissions.map((s) => s.auto_score || 0))
          : 0,
      avgBand:
        submissions.length > 0
          ? (
              submissions.reduce((sum, s) => sum + (s.band_score || 0), 0) /
              submissions.length
            ).toFixed(1)
          : 0,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};