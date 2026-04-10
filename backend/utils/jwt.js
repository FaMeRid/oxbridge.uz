const jwt = require("jsonwebtoken");

/**
 * Генерирует access и refresh токены
 * @param {string} userId 
 * @param {string} role 
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (userId, role) => {
  if (!userId) {
    throw new Error("userId is required to generate tokens");
  }

  const accessToken = jwt.sign(
    { 
      userId, 
      role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || "24h" 
    }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" 
    }
  );

  return { accessToken, refreshToken };
};

/**
 * Проверяет access token
 */
const verifyToken = (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
};

/**
 * Проверяет refresh token
 */
const verifyRefreshToken = (token) => {
  if (!token) {
    throw new Error("No refresh token provided");
  }

  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token");
    }
    throw new Error("Refresh token verification failed");
  }
};

module.exports = { 
  generateTokens, 
  verifyToken, 
  verifyRefreshToken 
};