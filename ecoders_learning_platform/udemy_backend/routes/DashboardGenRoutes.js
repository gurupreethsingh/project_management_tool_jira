// api/routes/DashboardGenRoutes.js
const router = require("express").Router();
const ctrl = require("../controllers/DashboardGenController");

router.get("/model-info", ctrl.modelInfo);
router.post("/reload", ctrl.reloadModel);
router.get("/lora-debug", ctrl.loraDebug);

router.post("/generate", ctrl.generateDashboard);

router.get("/history", ctrl.history);
router.delete("/clear", ctrl.clearSession);

module.exports = router;
