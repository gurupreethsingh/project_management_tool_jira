const mongoose = require("mongoose");
const { Schema } = mongoose;

const TestStepSchema = new Schema({
  step_number: Number,
  action_description: String,
  input_data: String,
  expected_result: String,
  actual_result: String,
  status: {
    type: String,
    enum: ["Pass", "Fail", "Pending"],
    default: "Pending",
  },
  remark: String,
});

const FooterSchema = new Schema({
  author: { type: String, required: true },
  reviewed_by: { type: String },
  approved_by: { type: String },
  approved_date: { type: Date },
});

const TestCaseSchema = new Schema(
  {
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    project_name: { type: String, required: true },

    scenario_id: {
      type: Schema.Types.ObjectId,
      ref: "Scenario",
      required: true,
    },
    scenario_number: { type: String, required: true },

    test_case_name: { type: String, required: true },
    test_case_number: { type: String }, // auto-generated in pre-save

    requirement_number: { type: String, required: true },
    build_name_or_number: { type: String, required: true },

    // joined comma-separated module names as you requested
    module_name: { type: String, required: true },

    pre_condition: { type: String, required: true },
    test_data: { type: String, required: true },
    post_condition: { type: String, required: true },

    severity: { type: String, required: true },

    test_case_type: {
      type: String,
      required: true,
      enum: [
        "Functional",
        "Non-Functional",
        "Regression",
        "Smoke",
        "Sanity",
        "Integration",
        "GUI",
        "Adhoc",
        "Internationalization",
        "Localization",
        "Unit Testing",
        "Performance",
        "Load",
        "Stress",
        "Usability",
        "Accessibility",
        "Security",
        "End-to-End",
        "Acceptance",
        "Alpha",
        "Beta",
        "Boundary Value",
        "Scalability",
        "Cross-Browser",
        "A/B Testing",
        "Others",
      ],
    },

    brief_description: { type: String, required: true },
    test_execution_time: { type: String },

    // NEW: execution type (defaults to Manual)
    test_execution_type: {
      type: String,
      enum: ["Manual", "Automation", "Both"],
      default: "Manual",
    },

    testing_steps: [TestStepSchema],
    footer: FooterSchema,
  },
  { timestamps: true }
);

// Auto-generate test_case_number from scenario_number
TestCaseSchema.pre("save", function (next) {
  if (!this.test_case_number && this.scenario_number) {
    const parts = String(this.scenario_number).split("-");
    const suffix = parts.length > 1 ? parts[1] : this.scenario_number;
    this.test_case_number = `TC-${suffix}`;
  }
  next();
});

module.exports = mongoose.model("TestCase", TestCaseSchema);
