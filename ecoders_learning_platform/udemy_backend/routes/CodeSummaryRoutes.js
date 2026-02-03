// routes/CodeSummaryRoutes.js
// Mount these under /api/code-summary in your main Express app.

const express = require("express");
const router = express.Router();

const CodeSummaryController = require("../controllers/CodeSummaryController");

// GET /api/code-summary/model-info
router.get("/model-info", CodeSummaryController.getModelInfo);

// POST /api/code-summary/reload
router.post("/reload", CodeSummaryController.reloadModel);

// POST /api/code-summary/generate
// body: { task | prompt | code | query | text : string, ... }
router.post("/generate", CodeSummaryController.generate);

// OPTIONAL alias if you want parity with other services
router.post("/ask", CodeSummaryController.generate);

module.exports = router;
