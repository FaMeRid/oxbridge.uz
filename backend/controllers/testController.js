const supabase = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { calculateScore, calculateBandScore } = require("../utils/scoring");
const logger = require("../utils/logger");

// GET ALL TESTS
exports.getAllTests = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// GET TEST BY ID
exports.getTestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// CREATE TEST (ADMIN ONLY)
exports.createTest = async (req, res, next) => {
  try {
    const { name, skill, questions, correctAnswers, difficultyLevel } =
      req.validatedData;

    const { data, error } = await supabase
      .from("tests")
      .insert([
        {
          id: uuidv4(),
          name,
          skill,
          questions,
          correct_answers: correctAnswers,
          difficulty_level: difficultyLevel,
          created_by: req.user.userId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    logger.info(`Test created: ${name}`);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// UPDATE TEST (ADMIN ONLY)
exports.updateTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, skill, questions, correctAnswers, difficultyLevel } =
      req.validatedData;

    const { data, error } = await supabase
      .from("tests")
      .update({
        name,
        skill,
        questions,
        correct_answers: correctAnswers,
        difficulty_level: difficultyLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Test updated: ${id}`);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// DELETE TEST (ADMIN ONLY)
exports.deleteTest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("tests")
      .delete()
      .eq("id", id);

    if (error) throw error;

    logger.info(`Test deleted: ${id}`);

    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    next(error);
  }
};