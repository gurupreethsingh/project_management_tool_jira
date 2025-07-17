const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Test case schema
const TestCaseTemplateSchema = new Schema({
  project_id: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  project_name: {
    type: String,
    required: true,
  },
  scenario_id: {
    type: Schema.Types.ObjectId,
    ref: "Scenario",
    required: true,
  },
  scenario_number: {
    type: String,
    required: true,
  },
  test_case_name: {
    type: String,
    required: true,
  },
  test_case_number: {
    type: String, // This will be auto-generated
  },
  requirement_number: {
    type: String,
    required: true,
  },
  build_name_or_number: {
    type: String,
    required: true,
  },
  module_name: {
    type: String,
    required: true,
  },
  pre_condition: {
    type: String,
    required: true,
  },
  test_data: {
    type: String,
    required: true,
  },
  post_condition: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    required: true,
  },
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
    ],
  },
  brief_description: {
    type: String,
    required: true,
  },
  test_execution_time: {
    type: String,
  },
  testing_steps: [
    {
      step_number: Number,
      action_description: String,
      input_data: String,
      expected_result: String,
      actual_result: String,
      status: {
        type: String,
        enum: ["Pass", "Fail"],
        required: true,
      },
      remark: String,
    },
  ],
  footer: {
    author: { type: String, required: true },
    reviewed_by: { type: String },
    approved_by: { type: String },
    approved_date: { type: Date },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to generate test_case_number from scenario_number
TestCaseTemplateSchema.pre("save", function (next) {
  if (!this.test_case_number && this.scenario_number) {
    // Automatically generate the test_case_number based on the scenario_number
    this.test_case_number = `TC-${this.scenario_number.split("-")[1]}`;
  }
  next();
});

const TestCase = mongoose.model("TestCase", TestCaseTemplateSchema);
module.exports = TestCase;
