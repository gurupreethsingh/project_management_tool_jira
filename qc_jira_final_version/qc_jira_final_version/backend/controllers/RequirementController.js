const Requirement = require("../models/RequirementModel");
const mongoose = require("mongoose");

// ✅ CREATE: Add a new requirement
exports.createRequirement = async (req, res) => {
  try {
    const {
      project_id,
      project_name,
      requirement_number,
      build_name_or_number,
      module_name,
      requirement_title,
      description,
      steps,
      created_by,
    } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    const newRequirement = new Requirement({
      project_id,
      project_name,
      requirement_number,
      build_name_or_number,
      module_name,
      requirement_title,
      description,
      images,
      steps,
      created_by,
    });

    await newRequirement.save();
    res.status(201).json({ message: "Requirement created", data: newRequirement });
  } catch (error) {
    res.status(500).json({ error: "Failed to create requirement", details: error.message });
  }
};

// ✅ READ: Get all requirements
exports.getAllRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find().sort({ createdAt: -1 });
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requirements", details: error.message });
  }
};

// ✅ READ: Get a single requirement by ID
exports.getRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) return res.status(404).json({ error: "Requirement not found" });
    res.status(200).json(requirement);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requirement", details: error.message });
  }
};

// ✅ UPDATE: Update a requirement by ID
exports.updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Handle new images if any
    const newImages = req.files ? req.files.map(file => file.path) : [];
    if (newImages.length > 0) {
      updateFields.$push = { images: { $each: newImages } };
    }

    const updatedRequirement = await Requirement.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedRequirement)
      return res.status(404).json({ error: "Requirement not found" });

    res.status(200).json({ message: "Requirement updated", data: updatedRequirement });
  } catch (error) {
    res.status(500).json({ error: "Failed to update requirement", details: error.message });
  }
};

// ✅ DELETE: Remove a requirement by ID
exports.deleteRequirement = async (req, res) => {
  try {
    const deleted = await Requirement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Requirement not found" });
    res.status(200).json({ message: "Requirement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete requirement", details: error.message });
  }
};

// ✅ COUNT: Total number of requirements
exports.countRequirements = async (req, res) => {
  try {
    const count = await Requirement.countDocuments();
    res.status(200).json({ totalRequirements: count });
  } catch (error) {
    res.status(500).json({ error: "Failed to count requirements", details: error.message });
  }
};

// ✅ Get requirements by project ID
exports.getRequirementsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const requirements = await Requirement.find({ project_id: projectId });
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project requirements", details: error.message });
  }
};

// ✅ Get requirements by module name (within a project)
exports.getRequirementsByModule = async (req, res) => {
  try {
    const { projectId, moduleName } = req.params;
    const requirements = await Requirement.find({
      project_id: projectId,
      module_name: moduleName,
    });
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch module requirements", details: error.message });
  }
};

// ✅ Search requirements by title or requirement number
exports.searchRequirements = async (req, res) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(keyword, "i"); // case-insensitive
    const results = await Requirement.find({
      $or: [{ requirement_title: regex }, { requirement_number: regex }],
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Search failed", details: error.message });
  }
};
