// routes/roadmapGenRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/RoadmapGenController");

// Mirror the UiGen routing style/namespacing
router.post("/ask", ctrl.ask);
router.get("/model-info", ctrl.modelInfo);
router.post("/reload", ctrl.reload);
router.get("/get-by-id/:id", ctrl.getById);
router.get("/list", ctrl.list);

module.exports = router;
