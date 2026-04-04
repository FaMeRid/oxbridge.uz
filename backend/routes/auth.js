const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validateRequest = require("../middleware/validation");
const { validateRegister, validateLogin } = require("../utils/validation");
const authMiddleware = require("../middleware/auth");

router.post(
  "/register",
  validateRequest(validateRegister),
  authController.register
);

router.post("/login", validateRequest(validateLogin), authController.login);

router.post("/logout", authMiddleware, authController.logout);

module.exports = router;