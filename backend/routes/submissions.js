const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const validateRequest = require("../middleware/validation");
const { validateSubmission } = require("../utils/validation");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.post(
  "/",
  authMiddleware,
  authorize("create:submission"),
  validateRequest(validateSubmission),
  submissionController.submitAnswers
);

router.get(
  "/my",
  authMiddleware,
  authorize("read:own_submissions"),
  submissionController.getMySubmissions
);

router.get(
  "/student/:studentId",
  authMiddleware,
  authorize("read:student_submissions"),
  submissionController.getStudentSubmissions
);

router.patch(
  "/:id/grade",
  authMiddleware,
  authorize("update:submission_grade"),
  submissionController.gradeSubmission
);

module.exports = router;