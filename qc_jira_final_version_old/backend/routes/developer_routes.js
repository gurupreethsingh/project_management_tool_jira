const express = require("express");
const router = express.Router();
const Project = require("../models/ProjectModel"); // Assuming this is the correct path to your project schema

// Route to fetch developers assigned to a project
router.get("/single-project/:projectId/developers", async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find the project by its ID and populate the 'developers' field
    const project = await Project.findById(projectId).populate(
      "developers",
      "name email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Respond with the developers associated with the project
    res.json({ developers: project.developers });
  } catch (error) {
    console.error("Error fetching developers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
