// backend/middleware/auth.js
const { supabaseAdmin } = require("../config/supabase");
const logger = require("../utils/logger");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Use format: Bearer <token>"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Invalid token format"
      });
    }

    // ✅ Верификация токена через Supabase (самый правильный способ)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.warn(`Invalid Supabase token: ${error?.message || 'User not found'}`);
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token"
      });
    }

    // Добавляем удобные данные пользователя в req.user
    req.user = {
      id: user.id,
      userId: user.id,                    // для совместимости со старым кодом
      email: user.email,
      role: user.user_metadata?.role || "student",
      full_name: user.user_metadata?.full_name,
      class: user.user_metadata?.class,
      // Можно добавить другие поля из metadata при необходимости
    };

    next();
  } catch (error) {
    logger.error("Auth middleware error:", error.message || error);
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;