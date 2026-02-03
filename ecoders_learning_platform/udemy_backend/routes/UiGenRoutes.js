// routes/UiGenRoutes.js
const express = require("express");
const router = express.Router();

const {
  generateUi,
  getModelInfo,
  reloadModel,
} = require("../controllers/UiGenController");

// ✅ IMPORTANT:
// index.js mounts: app.use("/api", uiGenRoutes)
// so to get /api/ui-gen/* we MUST include "/ui-gen" here.

router.get("/ui-gen/health", (_req, res) => {
  res.json({ ok: true, service: "ui-gen" });
});

router.get("/ui-gen/model-info", getModelInfo);
router.post("/ui-gen/reload", reloadModel);
router.post("/ui-gen/generate", generateUi);

module.exports = router;
