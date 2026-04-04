const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const validateRequest = require("../middleware/validation");
const { validateTest } = require("../utils/validation");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get(
  "/",
  authMiddleware,
  authorize("read:tests"),
  testController.getAllTests
);

router.get(
  "/:id",
  authMiddleware,
  authorize("read:tests"),
  testController.getTestById
);

router.post(
  "/",
  authMiddleware,
  authorize("create:test"),
  validateRequest(validateTest),
  testController.createTest
);

router.put(
  "/:id",
  authMiddleware,
  authorize("update:test"),
  validateRequest(validateTest),
  testController.updateTest
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("delete:test"),
  testController.deleteTest
);

module.exports = router;