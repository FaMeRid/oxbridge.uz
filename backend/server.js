// backend/server.js
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const testResultsRoutes = require('./routes/testResults');

// Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const teacherRoutes = require("./routes/teachers");
const testRoutes = require("./routes/tests");
const submissionRoutes = require("./routes/submissions");
const adminRoutes = require("./routes/admin");

// Middleware
const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Utils
const logger = require("./utils/logger");

const app = express();

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use('/api/test-results', testResultsRoutes);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Слишком много запросов, попробуйте позже.",
});

app.use("/api", limiter);

// ========== HEALTH CHECK ==========
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ========== API ROUTES ==========
app.use("/api/auth", authRoutes);                    // ← без authMiddleware (регистрация/логин)
app.use("/api/students", authMiddleware, studentRoutes);
app.use("/api/teachers", authMiddleware, teacherRoutes);
app.use("/api/tests", testRoutes);                   // тесты можно читать без авторизации
app.use("/api/submissions", authMiddleware, submissionRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ========== ERROR HANDLER ==========
app.use(errorHandler);

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`
╔═══════════════════════════════════╗
║  🚀 OXBRIDGE BACKEND RUNNING      ║
╠═══════════════════════════════════╣
║  Port: ${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  URL: http://localhost:${PORT}
║  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
╚═══════════════════════════════════╝
  `);
});

module.exports = app;
