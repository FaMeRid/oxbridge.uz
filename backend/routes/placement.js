const express = require("express");
const router = express.Router();
const controller = require("../controllers/placementController");

router.get("/", controller.getPlacementTest);
router.post("/submit", controller.submitPlacementTest);

module.exports = router;