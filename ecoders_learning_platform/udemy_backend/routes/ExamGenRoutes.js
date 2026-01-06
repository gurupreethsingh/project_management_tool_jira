const express = require("express");
const router = express.Router();

const {
  generateExamPaper,
  modelInfo,
  reloadModel,
} = require("../controllers/ExamGenController");

// POST /api/exam-gen/generate
router.post("/generate", generateExamPaper);

// GET /api/exam-gen/model-info
router.get("/model-info", modelInfo);

// POST /api/exam-gen/reload
router.post("/reload", reloadModel);

module.exports = router;
