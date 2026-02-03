// routes/TextCodeRoutes.js
// Mount under /api/text-code

const express = require("express");
const router = express.Router();

const TextCodeController = require("../controllers/TextCodeController");

// GET /api/text-code/model-info
router.get("/model-info", TextCodeController.getModelInfo);

// POST /api/text-code/reload
router.post("/reload", TextCodeController.reloadModel);

// POST /api/text-code/generate
// body: { task: string, use_retrieval?: boolean, max_new_tokens?: number }
router.post("/generate", TextCodeController.generate);

module.exports = router;
