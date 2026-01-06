const express = require("express");
const router = express.Router();

const {
  generateTutorAnswer,
  getAiTutorModelInfo,
  reloadAiTutor,
} = require("../controllers/AiTutorController");

router.post("/generate", generateTutorAnswer);
router.get("/model-info", getAiTutorModelInfo);
router.post("/reload", reloadAiTutor);

module.exports = router;
