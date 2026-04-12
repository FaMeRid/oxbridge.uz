const { supabaseClient } = require("../config/supabase");
const logger = require("../utils/logger");

// ======================
// СОХРАНЕНИЕ РЕЗУЛЬТАТА ТЕСТА
// ======================
exports.saveTestResult = async (req, res, next) => {
  try {
    const user_id = req.user?.id || req.user?.userId;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: "Не авторизован"
      });
    }

    const { test_type, section, score, band_score, answers, time_taken } = req.body;

    if (!test_type || score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        error: "Поля test_type и score обязательны"
      });
    }

    const { data, error } = await supabaseClient
      .from('test_results')
      .insert({
        user_id,
        test_type,
        section: section || null,
        score,
        band_score: band_score || null,
        answers: answers || null,
        time_taken: time_taken || null
      })
      .select()
      .single();

    if (error) throw error;

    logger.info(`Результат сохранён | User: ${user_id} | ${test_type} | Score: ${score}`);

    res.status(201).json({
      success: true,
      message: "Результат теста успешно сохранён",
      result: data
    });

  } catch (error) {
    logger.error("Save test result error:", error);
    next(error);
  }
};

// ======================
// ПОЛУЧЕНИЕ ВСЕХ РЕЗУЛЬТАТОВ ПОЛЬЗОВАТЕЛЯ
// ======================
exports.getUserTestResults = async (req, res, next) => {
  try {
    const user_id = req.user?.id || req.user?.userId;

    const { data, error } = await supabaseClient
      .from('test_results')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      results: data || []
    });
  } catch (error) {
    logger.error("Get user results error:", error);
    next(error);
  }
};