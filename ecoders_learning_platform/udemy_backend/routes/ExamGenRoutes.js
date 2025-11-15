// api/routes/ExamGenRoutes.js

const express = require("express");
const router = express.Router();

const { generateExamPaper } = require("../controllers/ExamGenController");

// POST /api/exam-gen/generate
router.post("/generate", generateExamPaper);

module.exports = router;
