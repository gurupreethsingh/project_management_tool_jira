const express = require("express");
const router = express.Router();
const projectController = require("../controllers/ProjectController");

// RESTful endpoint
router.get("/projects/:id", projectController.getProjectById);

// Optional legacy alias so existing code that calls /api/single-project/:id also works
router.get("/single-project/:id", projectController.getProjectById);

module.exports = router;
