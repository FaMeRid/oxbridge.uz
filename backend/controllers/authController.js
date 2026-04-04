const bcrypt = require("bcryptjs");
const supabase = require("../config/database");
const { generateTokens } = require("../utils/jwt");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.validatedData;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          id: uuidv4(),
          email,
          password: hashedPassword,
          displayName,
          role: "student",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    // Find user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    logger.info(`User logged in: ${email}`);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  logger.info(`User logged out: ${req.user.userId}`);
  res.json({ message: "Logged out successfully" });
};