const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get(
  "/students",
  authMiddleware,
  authorize("read:students"),
  teacherController.getStudents
);

router.get(
  "/students/:studentId",
  authMiddleware,
  authorize("read:students"),
  teacherController.getStudentDetail
);

router.get(
  "/analytics",
  authMiddleware,
  authorize("read:class_analytics"),
  teacherController.getClassAnalytics
);

module.exports = router;