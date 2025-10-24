// controllers/DefectController.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Bug = require("../models/BugModel");
const BugHistory = require("../models/BugHistoryModel");
const DefectAssignment = require("../models/DefectAssignmentModel");
// const Defect = require("../models/DefectModel"); // If you truly have a separate Defect model

// GET /api/projects/:projectId/defects
exports.listDefectsByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const defects = await (typeof Defect !== "undefined"
      ? Defect.find({ project_id: projectId })
      : Bug.find({ project_id: projectId }));
    if (!defects || defects.length === 0) {
      return res
        .status(404)
        .json({ message: "No defects found for this project" });
    }
    res.json(defects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/developer-lead/:userId/assigned-defects
exports.listAssignedDefectsForLead = async (req, res) => {
  const { userId } = req.params;
  try {
    const assignedDefects = await DefectAssignment.find({
      assignedTo: new mongoose.Types.ObjectId(userId),
    });
    res.status(200).json({ defects: assignedDefects });
  } catch (error) {
    console.error("Error fetching assigned defects:", error);
    res.status(500).json({ error: "Failed to fetch assigned defects" });
  }
};

// POST /api/addbug  (uses multer single file "bug_picture")
exports.addBug = async (req, res) => {
  try {
    const newBug = new Bug({
      project_id: req.body.project_id,
      project_name: req.body.project_name,
      scenario_number: req.body.scenario_number,
      test_case_number: req.body.test_case_number,
      test_case_name: req.body.test_case_name,
      bug_id: req.body.bug_id,
      requirement_number: req.body.requirement_number,
      build_number: req.body.build_number,
      module_name: req.body.module_name,
      test_case_type: req.body.test_case_type,
      expected_result: req.body.expected_result,
      actual_result: req.body.actual_result,
      description_of_defect: req.body.description_of_defect,
      priority: req.body.priority,
      severity: req.body.severity,
      status: req.body.status || "Open/New",
      steps_to_replicate: req.body.steps_to_replicate
        ? JSON.parse(req.body.steps_to_replicate)
        : [],
      author: req.body.author,
      reported_date: req.body.reported_date,
      updated_date: new Date(),
      bug_picture: req.file ? req.file.path : "",
      history: [],
    });

    newBug.history.push({
      defect_id: newBug.bug_id,
      updated_by: req.body.author,
      status: req.body.status || "Open/New",
      change_description: "Bug created",
      test_case_number: req.body.test_case_number,
      scenario_number: req.body.scenario_number,
      project_name: req.body.project_name,
      previous_status: null,
      updated_at: new Date(),
    });

    await newBug.save();
    res.status(201).json({ message: "Bug added successfully", bug: newBug });
  } catch (error) {
    console.error("Error adding bug:", error);
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error deleting uploaded file:", err);
      }
    }
    res.status(500).json({
      message: "Error adding bug",
      error: error.message,
      stack: error.stack,
    });
  }
};

// GET /api/single-project/:projectId/all-defects
exports.listAllDefectsForProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const defects = await Bug.find({ project_id: projectId });
    res.status(200).json(defects);
  } catch (error) {
    console.error("Error fetching defects:", error);
    res.status(500).json({ message: "Error fetching defects" });
  }
};

// GET /api/single-project/:projectId/defects-count
exports.countDefectsForProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    const defectsCount = await Bug.countDocuments({
      project_id: projectObjectId,
    });
    res.status(200).json({ totalDefects: defectsCount });
  } catch (error) {
    console.error("Error fetching defects count:", error);
    res.status(500).json({ message: "Error fetching defects count" });
  }
};

// GET /api/single-project/:projectId/defect/:defectId
exports.getDefectByProjectAndId = async (req, res) => {
  const { projectId, defectId } = req.params;
  try {
    const defect = await Bug.findOne({ _id: defectId, project_id: projectId });
    if (!defect) return res.status(404).json({ message: "Defect not found" });
    res.status(200).json(defect);
  } catch (error) {
    console.error("Error fetching defect by projectId and defectId:", error);
    res.status(500).json({ message: "Error fetching defect" });
  }
};

// DELETE /api/deletebug/:id
exports.deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: "Bug not found" });

    if (bug.bug_picture) {
      const filePath = path.resolve(process.cwd(), bug.bug_picture);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Error deleting bug picture:", err);
        }
      }
    }

    await Bug.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Bug and associated picture deleted successfully." });
  } catch (error) {
    console.error("Error deleting bug:", error);
    res.status(500).json({ message: "Error deleting bug", error });
  }
};

// PUT /api/single-project/:projectId/defect/:defectId
exports.updateDefectStatus = async (req, res) => {
  const { defectId } = req.params;
  const { status, updated_by } = req.body;
  try {
    const bug = await Bug.findById(defectId);
    if (!bug) return res.status(404).json({ message: "Bug not found" });

    const previousStatus = bug.status;
    bug.status = status;
    bug.updated_date = Date.now();
    if (status === "Fixed") bug.fixed_date = Date.now();

    const historyEntry = {
      defect_id: bug._id,
      bug_id: bug.bug_id,
      status,
      updated_by,
      previous_status: previousStatus,
      test_case_name: bug.test_case_name,
      test_case_number: bug.test_case_number,
      scenario_number: bug.scenario_number,
      module_name: bug.module_name,
      change_description: `Status changed from ${previousStatus} to ${status}`,
      updated_at: new Date(),
    };

    bug.history.push(historyEntry);
    await bug.save();

    const bugHistory = new BugHistory(historyEntry);
    await bugHistory.save();

    res.status(200).json({ message: "Status updated and history saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// GET /api/single-project/:projectId/defect/:defectId/history
exports.getDefectHistory = async (req, res) => {
  const { defectId } = req.params;
  try {
    const history = await BugHistory.find({ defect_id: defectId });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching bug history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/single-project/:projectId/assign-defect
exports.assignDefect = async (req, res) => {
  const { projectId } = req.params;
  const {
    defectId,
    defectBugId,
    moduleName,
    expectedResult,
    actualResult,
    assignedTo,
    assignedBy,
    projectName,
  } = req.body;
  try {
    const newDefectAssignment = new DefectAssignment({
      projectId,
      projectName,
      moduleName,
      defectId,
      defectBugId,
      expectedResult,
      actualResult,
      assignedTo,
      assignedBy,
    });
    await newDefectAssignment.save();
    res.status(201).json({
      message: "Defect successfully assigned to the developer!",
      defectAssignment: newDefectAssignment,
    });
  } catch (error) {
    console.error("Error assigning defect:", error);
    res.status(500).json({ message: "Failed to assign defect", error });
  }
};

// GET /api/single-project/:projectId/developer/:developerId/view-assigned-defects
exports.viewAssignedDefectsForDeveloper = async (req, res) => {
  const { developerId } = req.params;
  try {
    const assignedDefects = await DefectAssignment.find({
      assignedTo: developerId,
    });
    res.status(200).json(assignedDefects);
  } catch (error) {
    console.error("Error fetching assigned defects:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch assigned defects", error });
  }
};
