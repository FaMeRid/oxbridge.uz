const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get(
  "/users",
  authMiddleware,
  authorize("read:all_users"),
  adminController.getAllUsers
);

router.put(
  "/users/:userId/role",
  authMiddleware,
  authorize("update:user_role"),
  adminController.updateUserRole
);

router.delete(
  "/users/:userId",
  authMiddleware,
  authorize("delete:user"),
  adminController.deleteUser
);

router.get(
  "/analytics",
  authMiddleware,
  authorize("read:system_analytics"),
  adminController.getSystemAnalytics
);

module.exports = router;