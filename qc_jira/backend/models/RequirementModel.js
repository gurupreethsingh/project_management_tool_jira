// models/RequirementModel.js
const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema(
  {
    step_number: { type: Number, required: true },
    instruction: { type: String, required: true, trim: true },
    for: { type: String, default: "Both", enum: ["Dev", "QA", "Both"] },
    image_url: { type: String },
  },
  { _id: false }
);

const UpdateLogSchema = new mongoose.Schema(
  {
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by_name: { type: String, default: "" },
    changed_fields: { type: [String], default: [] },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RequirementSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    project_name: { type: String, trim: true },

    // Human-visible helpers
    requirement_number: { type: String, trim: true }, // e.g., REQ-PROJ-1
    build_name_or_number: { type: String, trim: true }, // e.g., v1.0

    // Module naming
    module_name: { type: String, required: true, trim: true },
    module_name_normalized: { type: String, required: true, index: true },

    // NEW: per-(project,module) running sequence to allow many requirements
    module_seq: { type: Number, required: true },

    requirement_title: { type: String, trim: true },
    description: { type: String, trim: true },

    images: [{ type: String }], // top-level images
    steps: [StepSchema], // steps with optional image_url

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // optional audit log used by your update controller
    update_logs: { type: [UpdateLogSchema], default: [] },
  },
  { timestamps: true }
);

// ---------- Indexes ----------
// Unique within a module: module_seq increments 1,2,3,... per (project,module)
RequirementSchema.index(
  { project_id: 1, module_name_normalized: 1, module_seq: 1 },
  { unique: true, name: "uniq_project_module_seq" }
);

// Helpful for listing/filtering by module
RequirementSchema.index(
  { project_id: 1, module_name_normalized: 1, createdAt: -1 },
  { name: "idx_project_module_createdAt" }
);

// Static helper for normalization
RequirementSchema.statics.normalizeModule = function (s) {
  return String(s || "")
    .trim()
    .toLowerCase();
};

module.exports = mongoose.model("Requirement", RequirementSchema);
