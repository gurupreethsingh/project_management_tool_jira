const mongoose = require("mongoose");

const DefectAssignmentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // Reference to Project schema
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  defectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Defect", // Reference to Defect schema
    required: true,
  },
  defectBugId: {
    type: String,
    required: true,
  },
  expectedResult: {
    type: String,
    required: true,
  },
  actualResult: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Developer (User) schema
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who is assigning the defect
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DefectAssignment", DefectAssignmentSchema);
