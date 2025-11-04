// routes/uiGenRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/UiGenController");

router.post("/ui-gen/ask", ctrl.ask);
router.get("/ui-gen/model-info", ctrl.modelInfo);
router.post("/ui-gen/reload", ctrl.reload);
router.get("/ui-gen/get-by-id/:id", ctrl.getById);
router.get("/ui-gen/list", ctrl.list);

module.exports = router;
