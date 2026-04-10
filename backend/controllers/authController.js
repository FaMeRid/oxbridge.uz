const { supabaseAdmin } = require("../config/supabase");
const { generateTokens } = require("../utils/jwt");
const logger = require("../utils/logger");

// REGISTER — через Supabase Auth (рекомендуемый способ)
exports.register = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.validatedData;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,                    // в разработке — сразу подтверждаем email
      user_metadata: {
        display_name: displayName,
        role: "student"
      }
    });

    if (error) {
      if (error.message.toLowerCase().includes("already exists") || 
          error.message.toLowerCase().includes("already registered")) {
        return res.status(409).json({ error: "Email already registered" });
      }
      throw error;
    }

    const user = data.user;

    // Генерируем свои JWT (пока оставляем твою функцию)
    const { accessToken, refreshToken } = generateTokens(user.id, "student");

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: displayName,
        role: "student"
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN — исправленный вариант
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    // Для логина лучше использовать обычный клиент (с anon key), но чтобы не плодить клиенты — используем admin + getUserByEmail + проверку
    // Самый надёжный способ для backend:
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = signInData.user;

    const role = user.user_metadata?.role || "student";

    const { accessToken, refreshToken } = generateTokens(user.id, role);

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.user_metadata?.display_name || null,
        role: role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT (пока простой, можно улучшить позже)
exports.logout = async (req, res) => {
  logger.info(`User logged out: ${req.user?.userId || 'unknown'}`);
  res.json({ success: true, message: "Logged out successfully" });
};