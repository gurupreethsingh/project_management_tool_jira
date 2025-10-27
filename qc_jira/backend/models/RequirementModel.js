// models/RequirementModel.js
const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  step_number: { type: Number },
  instruction: { type: String, required: true, trim: true },
  for: { type: String, default: "Both", enum: ["Dev", "QA", "Both"] },
  image_url: { type: String },
});

const RequirementSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    project_name: { type: String, trim: true },

    requirement_number: { type: String, trim: true }, // e.g., REQ-PROJ-1
    build_name_or_number: { type: String, trim: true }, // e.g., v1.0

    module_name: { type: String, required: true, trim: true },
    module_name_normalized: { type: String, required: true, index: true },

    requirement_title: { type: String, trim: true },
    description: { type: String, trim: true },

    images: [{ type: String }],

    steps: [StepSchema],

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Allow multiple requirements under the same module within a project
RequirementSchema.index(
  { project_id: 1, module_name_normalized: 1 },
  { unique: false, name: "idx_project_module" }
);

module.exports = mongoose.model("Requirement", RequirementSchema);
