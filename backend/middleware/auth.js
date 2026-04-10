const { verifyToken } = require("../utils/jwt");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Проверка наличия заголовка
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Use format: Bearer <token>"
      });
    }

    const token = authHeader.split(" ")[1];

    // Дополнительная проверка на пустой токен
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Invalid token format"
      });
    }

    // Верификация токена
    const decoded = verifyToken(token);

    // Приводим данные пользователя к удобному формату
    req.user = {
      id: decoded.userId,        // большинство мест используют id
      userId: decoded.userId,    // оставляем для совместимости
      role: decoded.role,
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