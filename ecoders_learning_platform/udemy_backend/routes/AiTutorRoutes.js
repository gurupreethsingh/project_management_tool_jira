// api/routes/AiTutorRoutes.js

const express = require("express");
const router = express.Router();

const {
  generateTutorAnswer,
  getAiTutorModelInfo,
  reloadAiTutor,
} = require("../controllers/AiTutorController");

// POST /api/ai-tutor/generate
router.post("/generate", generateTutorAnswer);

// GET /api/ai-tutor/model-info
router.get("/model-info", getAiTutorModelInfo);

// POST /api/ai-tutor/reload
router.post("/reload", reloadAiTutor);

module.exports = router;
