// models/ModuleModel.js
const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    // Display name of the module
    name: { type: String, required: true },

    // Normalized key for dedupe (within a project)
    key: { type: String, required: true },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Enforce uniqueness *within a project* for the normalized key
moduleSchema.index({ project: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("Module", moduleSchema);
