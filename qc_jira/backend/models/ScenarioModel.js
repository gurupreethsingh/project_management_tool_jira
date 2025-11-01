// models/ScenarioModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ScenarioSchema = new Schema(
  {
    scenario_text: { type: String, required: true, trim: true },
    scenario_key: { type: String, required: true, trim: true, index: true },
    scenario_number: { type: String, required: true, trim: true, index: true },

    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },

    // ✅ Legacy single-module field (REAL ref so .populate("module") works)
    module: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      default: null,
      index: true,
    },

    // ✅ New multi-modules field
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
        index: true,
      },
    ],

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    testCases: [{ type: Schema.Types.ObjectId, ref: "TestCase", default: [] }],

    updatedBy: {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      updateTime: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collation: { locale: "en", strength: 2 },
  }
);

/* -------------------------- Normalization guards -------------------------- */
ScenarioSchema.pre("validate", function (next) {
  if (typeof this.scenario_key === "string")
    this.scenario_key = this.scenario_key.trim();
  if (typeof this.scenario_text === "string")
    this.scenario_text = this.scenario_text.trim();
  if (this.scenario_number != null)
    this.scenario_number = String(this.scenario_number).trim();

  // Always keep modules as an array
  if (!Array.isArray(this.modules)) this.modules = [];

  next();
});

/* --------------------------- Back-compat auto-sync -------------------------- *
 * Keep legacy `module` and new `modules[0]` reasonably aligned.
 * - If only `module` is set, ensure it is present in `modules` (and first if empty).
 * - If only `modules` has items, set `module = modules[0]`.
 * NOTE: Controllers already do this; this is just a safety net.
 * --------------------------------------------------------------------------- */
ScenarioSchema.pre("save", function (next) {
  const m = this.module;
  const arr = this.modules || [];

  if (m && !arr.length) {
    this.modules = [m];
  } else if (!m && arr.length) {
    this.module = arr[0];
  } else if (m && arr.length) {
    // ensure `module` is included in `modules`
    const asStr = arr.map(String);
    if (!asStr.includes(String(m))) {
      this.modules = [m, ...arr];
    }
  }
  next();
});

/* --------------------------------- Indexes -------------------------------- */
// Unique per project + scenario_number (string)
ScenarioSchema.index(
  { project: 1, scenario_number: 1 },
  {
    unique: true,
    name: "project_1_scenario_number_1",
    partialFilterExpression: {
      $and: [
        { scenario_number: { $exists: true } },
        { scenario_number: { $type: "string" } },
      ],
    },
  }
);

// Unique per project + normalized scenario_key
ScenarioSchema.index(
  { project: 1, scenario_key: 1 },
  { unique: true, name: "project_1_scenario_key_1" }
);

// Helpful lookups
ScenarioSchema.index(
  { project: 1, modules: 1 },
  { name: "project_1_modules_1" }
);
ScenarioSchema.index({ modules: 1 }, { name: "modules_1" });
ScenarioSchema.index(
  { scenario_number: 1 },
  {
    name: "scenario_number_1_nonunique",
    collation: { locale: "en", strength: 2 },
  }
);

/* ----------------------------- DO NOT ADD THIS ----------------------------- *
 * Do NOT add a virtual named 'module' here. We need a REAL ref so that
 * .populate("module", "name") in the controller works without errors.
 * --------------------------------------------------------------------------- */

module.exports = mongoose.model("Scenario", ScenarioSchema);
