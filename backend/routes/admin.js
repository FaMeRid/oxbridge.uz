// backend/routes/admin.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const ctrl = require("../controllers/adminController");

// Все роуты требуют JWT + роль admin
router.use(auth);
router.use(authorize("manage_users", "view_analytics", "admin"));
// ☝️ Если в твоём constants/roles.js нет таких permissions —
// замени на конкретный permission, который у админа в PERMISSIONS.admin

router.get("/users",                ctrl.getAllUsers);
router.patch("/users/:userId/role", ctrl.updateUserRole);
router.delete("/users/:userId",     ctrl.deleteUser);
router.get("/analytics",            ctrl.getSystemAnalytics);

module.exports = router;