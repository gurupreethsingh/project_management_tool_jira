// api/routes/AiTutorRoutes.js

const express = require("express");
const router = express.Router();

const { generateTutorAnswer } = require("../controllers/AiTutorController");

// POST /api/ai-tutor/generate
router.post("/generate", generateTutorAnswer);

module.exports = router;
