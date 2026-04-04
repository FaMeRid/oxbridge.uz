const supabase = require("../config/database");
const logger = require("../utils/logger");

// GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// UPDATE USER ROLE
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    logger.info(`User role updated: ${userId} -> ${role}`);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// DELETE USER
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) throw error;

    logger.info(`User deleted: ${userId}`);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET SYSTEM ANALYTICS
exports.getSystemAnalytics = async (req, res, next) => {
  try {
    const { data: users } = await supabase.from("users").select("*");
    const { data: submissions } = await supabase
      .from("submissions")
      .select("*");
    const { data: tests } = await supabase.from("tests").select("*");

    const analytics = {
      totalUsers: users.length,
      totalTests: tests.length,
      totalSubmissions: submissions.length,
      usersByRole: {
        students: users.filter((u) => u.role === "student").length,
        teachers: users.filter((u) => u.role === "teacher").length,
        admins: users.filter((u) => u.role === "admin").length,
      },
    };

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};