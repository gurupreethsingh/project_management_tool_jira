// api/routes/DashboardGenRoutes.js

const router = require("express").Router();
const C = require("../controllers/DashboardGenController");

// Dashboard generator endpoints
router.get("/dashboard-gen/model-info", C.modelInfo);
router.post("/dashboard-gen/reload", C.reload);
router.post("/dashboard-gen/ask", C.ask);

// Optional: history
router.get("/dashboard-gen/interactions/:id", C.getById);
router.get("/dashboard-gen/interactions", C.list);

module.exports = router;
