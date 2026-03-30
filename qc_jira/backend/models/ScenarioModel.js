const mongoose = require("mongoose");
const { Schema } = mongoose;

const ScenarioSchema = new Schema(
  {
    scenario_text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    scenario_key: {
      type: String,
      required: true,
      trim: true,
      index: true,
      maxlength: 300,
    },

    scenario_number: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    // legacy primary module
    module: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      default: null,
      index: true,
    },

    // multi-module support
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
        index: true,
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    testCases: [
      {
        type: Schema.Types.ObjectId,
        ref: "TestCase",
        default: [],
      },
    ],

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
  },
);

/* -------------------------- normalization guards -------------------------- */

ScenarioSchema.pre("validate", function (next) {
  if (typeof this.scenario_text === "string") {
    this.scenario_text = this.scenario_text.trim().replace(/\s+/g, " ");
  }

  if (typeof this.scenario_key === "string") {
    this.scenario_key = this.scenario_key.trim();
  }

  if (this.scenario_number != null) {
    this.scenario_number = String(this.scenario_number).trim();
  }

  if (!Array.isArray(this.modules)) {
    this.modules = [];
  }

  next();
});

/* -------------------------- back-compat sync -------------------------- */

ScenarioSchema.pre("save", function (next) {
  const moduleValue = this.module;
  const moduleArray = Array.isArray(this.modules) ? this.modules : [];

  if (moduleValue && !moduleArray.length) {
    this.modules = [moduleValue];
  } else if (!moduleValue && moduleArray.length) {
    this.module = moduleArray[0];
  } else if (moduleValue && moduleArray.length) {
    const existing = moduleArray.map(String);
    if (!existing.includes(String(moduleValue))) {
      this.modules = [moduleValue, ...moduleArray];
    }
  }

  // remove duplicate ids from modules while preserving order
  if (Array.isArray(this.modules) && this.modules.length > 1) {
    const seen = new Set();
    this.modules = this.modules.filter((id) => {
      const key = String(id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  next();
});

/* --------------------------------- indexes --------------------------------- */

// unique scenario number per project
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
  },
);

// unique normalized scenario key per project
ScenarioSchema.index(
  { project: 1, scenario_key: 1 },
  {
    unique: true,
    name: "project_1_scenario_key_1",
  },
);

// helper indexes
ScenarioSchema.index(
  { project: 1, modules: 1 },
  { name: "project_1_modules_1" },
);
ScenarioSchema.index({ modules: 1 }, { name: "modules_1" });
ScenarioSchema.index({ project: 1, module: 1 }, { name: "project_1_module_1" });
ScenarioSchema.index({ createdAt: -1 }, { name: "createdAt_desc" });
ScenarioSchema.index(
  { scenario_number: 1 },
  {
    name: "scenario_number_1_nonunique",
    collation: { locale: "en", strength: 2 },
  },
);

module.exports = mongoose.model("Scenario", ScenarioSchema);
