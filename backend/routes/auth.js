// backend/routes/auth.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const telegramAuthController = require("../controllers/telegramAuthController");

// Email + пароль
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Telegram Login Widget
router.post("/telegram", telegramAuthController.telegramLogin);

module.exports = router;
