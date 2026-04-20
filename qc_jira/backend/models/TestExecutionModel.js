const mongoose = require("mongoose");
const { Schema } = mongoose;

const EXECUTION_STATUS = ["Not Run", "Pass", "Fail", "Blocked", "Skipped"];
const EXECUTION_TYPES = ["Manual", "Automation", "Both"];
const RUN_TYPES = ["Desktop", "Mobile", "Tablet", "API"];
const ENVIRONMENTS = ["QA", "UAT", "Staging", "Production", "Dev"];

const AttachmentSchema = new Schema(
  {
    file_name: { type: String, trim: true, default: "" },
    file_url: { type: String, trim: true, default: "" },
    file_type: { type: String, trim: true, default: "" },
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

const ExecutionRunSchema = new Schema(
  {
    run_number: {
      type: Number,
      required: true,
      min: 1,
    },

    run_type: {
      type: String,
      enum: RUN_TYPES,
      default: "Desktop",
      index: true,
    },

    run_label: {
      type: String,
      trim: true,
      default: "",
    },

    environment: {
      type: String,
      enum: ENVIRONMENTS,
      default: "QA",
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
      index: true,
    },

    operating_system_version: {
      type: String,
      trim: true,
      default: "",
    },

    device_name: {
      type: String,
      trim: true,
      default: "",
    },

    device_brand: {
      type: String,
      trim: true,
      default: "",
    },

    screen_resolution: {
      type: String,
      trim: true,
      default: "",
    },

    client_tool: {
      type: String,
      trim: true,
      default: "",
    },

    app_version: {
      type: String,
      trim: true,
      default: "",
    },

    is_mobile: {
      type: Boolean,
      default: false,
    },

    is_real_device: {
      type: Boolean,
      default: false,
    },

    execution_status: {
      type: String,
      enum: EXECUTION_STATUS,
      default: "Not Run",
      index: true,
    },

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

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    linked_bug_ids: [
      {
        type: String,
        trim: true,
      },
    ],

    attachments: {
      type: [AttachmentSchema],
      default: [],
    },

    executed_steps: {
      type: [ExecutedStepSchema],
      default: [],
    },

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
    },
  },
  { _id: false },
);

const TestExecutionSchema = new Schema(
  {
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
      enum: ENVIRONMENTS,
      default: "QA",
      index: true,
    },

    // legacy compatibility fields
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

    // legacy step-level execution
    executed_steps: {
      type: [ExecutedStepSchema],
      default: [],
    },

    // new execution matrix
    execution_runs: {
      type: [ExecutionRunSchema],
      default: [],
    },

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

    attachments: {
      type: [AttachmentSchema],
      default: [],
    },

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

function deriveOverallStatusFromRuns(runs = []) {
  if (!Array.isArray(runs) || runs.length === 0) return "Not Run";

  const statuses = runs.map((run) =>
    String(run?.execution_status || "").trim(),
  );

  if (statuses.includes("Fail")) return "Fail";
  if (statuses.includes("Blocked")) return "Blocked";
  if (statuses.length && statuses.every((s) => s === "Skipped"))
    return "Skipped";
  if (statuses.length && statuses.every((s) => s === "Pass")) return "Pass";

  return "Not Run";
}

TestExecutionSchema.pre("validate", function (next) {
  if (!Array.isArray(this.execution_runs)) {
    this.execution_runs = [];
  }

  if (this.execution_runs.length > 0) {
    this.execution_runs = this.execution_runs.map((run, index) => ({
      ...run,
      run_number: Number(run?.run_number || index + 1),
    }));

    this.execution_status = deriveOverallStatusFromRuns(this.execution_runs);

    const firstRun = this.execution_runs[0] || {};
    this.environment = firstRun.environment || this.environment || "QA";
    this.browser = firstRun.browser || this.browser || "";
    this.browser_version =
      firstRun.browser_version || this.browser_version || "";
    this.operating_system =
      firstRun.operating_system || this.operating_system || "";
    this.device_type = firstRun.run_type || this.device_type || "Desktop";
    this.device_name = firstRun.device_name || this.device_name || "";
    this.actual_result = firstRun.actual_result || this.actual_result || "";
  }

  next();
});

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

TestExecutionSchema.index({
  project_id: 1,
  "execution_runs.run_type": 1,
  "execution_runs.execution_status": 1,
});

TestExecutionSchema.pre("save", async function (next) {
  try {
    if (!this.execution_number) {
      const count = await mongoose.models.TestExecution.countDocuments({
        project_id: this.project_id,
      });

      const seq = String(count + 1).padStart(4, "0");
      this.execution_number = `EXEC-${seq}`;
    }

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
module.exports.RUN_TYPES = RUN_TYPES;
module.exports.ENVIRONMENTS = ENVIRONMENTS;
