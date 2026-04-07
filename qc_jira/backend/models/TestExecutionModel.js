// models/TestExecutionModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const EXECUTION_STATUS = ["Not Run", "Pass", "Fail", "Blocked", "Skipped"];

const EXECUTION_TYPES = ["Manual", "Automation", "Both"];

const AttachmentSchema = new Schema(
  {
    file_name: { type: String, trim: true },
    file_url: { type: String, trim: true },
    file_type: { type: String, trim: true },
    uploaded_at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ExecutedStepSchema = new Schema(
  {
    step_number: { type: Number, required: true },
    action_description: { type: String, trim: true, default: "" },
    input_data: { type: String, trim: true, default: "" },
    expected_result: { type: String, trim: true, default: "" },
    actual_result: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: EXECUTION_STATUS,
      default: "Not Run",
    },
    remark: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const TestExecutionSchema = new Schema(
  {
    // -----------------------------
    // Project linkage
    // -----------------------------
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    project_name: {
      type: String,
      required: true,
      trim: true,
    },

    // -----------------------------
    // Module linkage
    // -----------------------------
    module_id: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },
    module_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // -----------------------------
    // Scenario linkage
    // -----------------------------
    scenario_id: {
      type: Schema.Types.ObjectId,
      ref: "Scenario",
      required: true,
      index: true,
    },
    scenario_number: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // -----------------------------
    // Test case linkage
    // -----------------------------
    test_case_id: {
      type: Schema.Types.ObjectId,
      ref: "TestCase",
      required: true,
      index: true,
    },
    test_case_number: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    test_case_name: {
      type: String,
      required: true,
      trim: true,
    },

    // -----------------------------
    // Requirement / build
    // -----------------------------
    requirement_number: {
      type: String,
      trim: true,
      default: "",
    },
    build_name_or_number: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    // -----------------------------
    // Execution metadata
    // -----------------------------
    execution_number: {
      type: String,
      trim: true,
      index: true,
    },
    execution_type: {
      type: String,
      enum: EXECUTION_TYPES,
      default: "Manual",
    },
    execution_status: {
      type: String,
      enum: EXECUTION_STATUS,
      default: "Not Run",
      index: true,
    },

    environment: {
      type: String,
      trim: true,
      default: "QA",
      index: true,
    },
    browser: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    browser_version: {
      type: String,
      trim: true,
      default: "",
    },
    operating_system: {
      type: String,
      trim: true,
      default: "",
    },
    device_type: {
      type: String,
      trim: true,
      default: "Desktop",
    },
    device_name: {
      type: String,
      trim: true,
      default: "",
    },

    // -----------------------------
    // Execution ownership
    // -----------------------------
    assigned_to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    assigned_to_name: {
      type: String,
      trim: true,
      default: "",
    },

    executed_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    executed_by_name: {
      type: String,
      required: true,
      trim: true,
    },

    reviewed_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewed_by_name: {
      type: String,
      trim: true,
      default: "",
    },

    // -----------------------------
    // Results
    // -----------------------------
    expected_result_snapshot: {
      type: String,
      trim: true,
      default: "",
    },
    actual_result: {
      type: String,
      trim: true,
      default: "",
    },
    execution_notes: {
      type: String,
      trim: true,
      default: "",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    // -----------------------------
    // Step-level execution
    // -----------------------------
    executed_steps: {
      type: [ExecutedStepSchema],
      default: [],
    },

    // -----------------------------
    // Defect linking
    // -----------------------------
    linked_defect_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Defect",
      },
    ],
    linked_bug_ids: [
      {
        type: String,
        trim: true,
      },
    ],

    // -----------------------------
    // Attachments / evidence
    // -----------------------------
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },

    // -----------------------------
    // Dates / audit
    // -----------------------------
    started_at: {
      type: Date,
      default: Date.now,
    },
    completed_at: {
      type: Date,
      default: null,
    },
    executed_at: {
      type: Date,
      default: Date.now,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Helpful indexes
TestExecutionSchema.index({
  project_id: 1,
  module_id: 1,
  scenario_id: 1,
  test_case_id: 1,
});

TestExecutionSchema.index({
  project_id: 1,
  execution_status: 1,
  browser: 1,
  environment: 1,
});

TestExecutionSchema.index({
  test_case_id: 1,
  build_name_or_number: 1,
  browser: 1,
  executed_at: -1,
});

// Auto-generate execution number
TestExecutionSchema.pre("save", async function (next) {
  try {
    if (!this.execution_number) {
      const count = await mongoose.models.TestExecution.countDocuments({
        project_id: this.project_id,
      });

      const seq = String(count + 1).padStart(4, "0");
      this.execution_number = `EXEC-${seq}`;
    }

    // If status is final-ish, set completed_at when empty
    if (
      ["Pass", "Fail", "Blocked", "Skipped"].includes(this.execution_status) &&
      !this.completed_at
    ) {
      this.completed_at = new Date();
    }

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("TestExecution", TestExecutionSchema);
module.exports.EXECUTION_STATUS = EXECUTION_STATUS;
module.exports.EXECUTION_TYPES = EXECUTION_TYPES;
