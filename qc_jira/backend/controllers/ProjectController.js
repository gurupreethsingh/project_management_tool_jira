const mongoose = require("mongoose");
const Project = require("../models/ProjectModel");

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const proj = await Project.findById(id).lean();
    if (!proj) return res.status(404).json({ error: "Project not found" });

    // return both keys so the frontend can read either
    return res.status(200).json({
      ...proj,
      projectName: proj.project_name ?? proj.projectName ?? "",
    });
  } catch (err) {
    console.error("getProjectById error:", err);
    return res.status(500).json({ error: "Failed to fetch project", details: err.message });
  }
};
