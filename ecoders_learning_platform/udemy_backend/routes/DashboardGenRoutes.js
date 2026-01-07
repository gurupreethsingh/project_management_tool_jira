const express = require("express");
const router = express.Router();

const {
  generateDashboard,
  getModelInfo,
  reloadModel,
} = require("../controllers/DashboardGenController");

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "dashboard-gen" });
});

router.get("/model-info", getModelInfo);
router.post("/reload", reloadModel);
router.post("/generate", generateDashboard);

module.exports = router;
