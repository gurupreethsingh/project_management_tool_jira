const express = require("express");
const router = express.Router();

const aiCtrl = require("../controllers/AiController");

router.post("/ask", aiCtrl.askAi);
router.post("/preload-knowledge", aiCtrl.preloadKnowledge);
router.get("/model-info", aiCtrl.modelInfo);

module.exports = router;
