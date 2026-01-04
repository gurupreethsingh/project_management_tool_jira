const express = require("express");
const router = express.Router();

const {
  generateDashboard,
  getModelInfo,
  reloadModel,
} = require("../controllers/DashboardGenController");

router.post("/generate", generateDashboard);
router.get("/model-info", getModelInfo);
router.post("/reload", reloadModel);

module.exports = router;
