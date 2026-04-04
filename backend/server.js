const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Middleware
const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const teacherRoutes = require("./routes/teachers");
const testRoutes = require("./routes/tests");
const submissionRoutes = require("./routes/submissions");
const adminRoutes = require("./routes/admin");

// Utils
const logger = require("./utils/logger");

// Initialize Express
const app = express();

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});

app.use(limiter);

// ========== HEALTH CHECK ==========
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ========== API ROUTES ==========
app.use("/api/auth", authRoutes);
app.use("/api/students", authMiddleware, studentRoutes);
app.use("/api/teachers", authMiddleware, teacherRoutes);
app.use("/api/tests", testRoutes);
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
║  Environment: ${process.env.NODE_ENV}
║  URL: http://localhost:${PORT}
║  Frontend: ${process.env.FRONTEND_URL}
╚═══════════════════════════════════╝
  `);
});

module.exports = app;