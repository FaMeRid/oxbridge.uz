// backend/controllers/authController.js

const { supabaseClient, supabaseAdmin } = require("../config/supabase");

/**
 * REGISTER
 */
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      class: studentClass,
      role = "student",
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email и пароль обязательны",
      });
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || null,
          student_class: studentClass || null,
          role,
          display_name: full_name || null,
        },
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // ⚠️ Supabase иногда не возвращает user сразу
    if (!data.user) {
      return res.status(400).json({
        success: false,
        error:
          "Пользователь не создан. Возможно требуется подтверждение email.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Пользователь успешно создан",
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        class: data.user.user_metadata?.student_class,
        role: data.user.user_metadata?.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

/**
 * LOGIN
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email и пароль обязательны",
      });
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    if (!data.session || !data.user) {
      return res.status(401).json({
        success: false,
        error: "Не удалось войти в систему",
      });
    }

    // ⚠️ НЕ используем supabaseAdmin здесь (это была твоя ошибка)
    const user = data.user;

    return res.status(200).json({
      success: true,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,

      user: {
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.display_name,
        class: user.user_metadata?.student_class,
        role: user.user_metadata?.role || "student",
        email_confirmed_at: user.email_confirmed_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

/**
 * LOGOUT (frontend responsibility mostly)
 */
const logout = async (req, res) => {
  try {
    // Supabase logout обычно делается на фронте
    return res.status(200).json({
      success: true,
      message: "Успешный выход",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};