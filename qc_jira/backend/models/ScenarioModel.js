// models/ScenarioModel.js
const mongoose = require("mongoose");

const scenarioSchema = new mongoose.Schema(
  {
    scenario_text: { type: String, required: true },

    // normalized key (prevents dupes per project)
    scenario_key: { type: String, required: true },

    // keep as String to support formats like "PRJ-1234"
    scenario_number: { type: String, required: true },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestCase" }],

    updatedBy: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      updateTime: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // Case-insensitive comparisons on string indexes (e.g., scenario_key)
    collation: { locale: "en", strength: 2 },
  }
);

// Ensure testCases is always an array
scenarioSchema.path("testCases").default([]);

// --- Normalization guards ---
scenarioSchema.pre("validate", function (next) {
  if (typeof this.scenario_key === "string") this.scenario_key = this.scenario_key.trim();
  if (typeof this.scenario_text === "string") this.scenario_text = this.scenario_text.trim();

  if (this.scenario_number != null) {
    this.scenario_number = String(this.scenario_number).trim();
  }
  if (!this.scenario_number) {
    return next(new Error("scenario_number is required"));
  }
  next();
});

// --- Indexes ---
// 1) Unique per PROJECT + scenario_number
//    Partial filter uses only $exists + $type (no $ne) for wide MongoDB compatibility.
scenarioSchema.index(
  { project: 1, scenario_number: 1 },
  {
    unique: true,
    name: "project_1_scenario_number_1",
    partialFilterExpression: {
      $and: [
        { scenario_number: { $exists: true } },
        { scenario_number: { $type: "string" } }
      ]
    },
  }
);

// 2) scenario_key unique per project (case-insensitive due to schema collation)
scenarioSchema.index(
  { project: 1, scenario_key: 1 },
  { unique: true, name: "project_1_scenario_key_1" }
);

// Helpful lookups
scenarioSchema.index({ project: 1, module: 1 }, { name: "project_1_module_1" });
scenarioSchema.index({ module: 1 }, { name: "module_1" });
scenarioSchema.index(
  { scenario_number: 1 },
  { name: "scenario_number_1_nonunique", collation: { locale: "en", strength: 2 } }
);

// Null-safe virtual
scenarioSchema.virtual("isMissingTestCases").get(function () {
  const arr = Array.isArray(this.testCases) ? this.testCases : [];
  return arr.length === 0;
});

module.exports = mongoose.model("Scenario", scenarioSchema);
