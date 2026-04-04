const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get(
  "/profile",
  authMiddleware,
  authorize("read:own_profile"),
  studentController.getProfile
);

router.put(
  "/profile",
  authMiddleware,
  authorize("update:own_profile"),
  studentController.updateProfile
);

router.get(
  "/statistics",
  authMiddleware,
  authorize("read:own_results"),
  studentController.getStatistics
);

module.exports = router;