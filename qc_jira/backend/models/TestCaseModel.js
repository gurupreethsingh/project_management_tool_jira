const mongoose = require("mongoose");
const { Schema } = mongoose;

/* -------------------------------------------------------------------------- */
/*                                Helper Methods                              */
/* -------------------------------------------------------------------------- */

function buildBaseTestCaseNumberFromScenario(scenarioNumber = "") {
  const cleanScenarioNumber = String(scenarioNumber || "").trim();

  if (!cleanScenarioNumber) return "";

  // Main expected format:
  // ET-HC-9948  ->  TC-HC-9948
  if (/^ET-/i.test(cleanScenarioNumber)) {
    return cleanScenarioNumber.replace(/^ET-/i, "TC-");
  }

  // Generic fallback:
  // ABC-LOGIN-101 -> TC-LOGIN-101
  const parts = cleanScenarioNumber.split("-").filter(Boolean);

  if (parts.length >= 2) {
    return `TC-${parts.slice(1).join("-")}`;
  }

  return `TC-${cleanScenarioNumber}`;
}

/* -------------------------------------------------------------------------- */
/*                                   Schemas                                  */
/* -------------------------------------------------------------------------- */

const TestStepSchema = new Schema(
  {
    step_number: { type: Number, default: 1 },
    action_description: { type: String, trim: true, default: "" },
    input_data: { type: String, trim: true, default: "" },
    expected_result: { type: String, trim: true, default: "" },
    actual_result: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Pass", "Fail", "Pending"],
      default: "Pending",
    },
    remark: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const FooterSchema = new Schema(
  {
    author: { type: String, required: true, trim: true },
    reviewed_by: { type: String, trim: true, default: "" },
    approved_by: { type: String, trim: true, default: "" },
    approved_date: { type: Date, default: null },
  },
  { _id: false },
);

const TestCaseSchema = new Schema(
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

    test_case_name: {
      type: String,
      required: true,
      trim: true,
    },

    // Auto-generated as:
    // Scenario: ET-HC-9948
    // Test cases: TC-HC-9948-1, TC-HC-9948-2, TC-HC-9948-3
    test_case_number: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    requirement_number: {
      type: String,
      required: true,
      trim: true,
    },

    build_name_or_number: {
      type: String,
      required: true,
      trim: true,
    },

    // joined comma-separated module names
    module_name: {
      type: String,
      required: true,
      trim: true,
    },

    pre_condition: {
      type: String,
      required: true,
      trim: true,
    },

    test_data: {
      type: String,
      required: true,
      trim: true,
    },

    post_condition: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      required: true,
      trim: true,
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
        "Others",
      ],
    },

    brief_description: {
      type: String,
      required: true,
      trim: true,
    },

    test_execution_time: {
      type: String,
      trim: true,
      default: "",
    },

    test_execution_type: {
      type: String,
      enum: ["Manual", "Automation", "Both"],
      default: "Manual",
    },

    testing_steps: {
      type: [TestStepSchema],
      default: [],
    },

    footer: {
      type: FooterSchema,
      required: true,
    },
  },
  { timestamps: true },
);

/* -------------------------------------------------------------------------- */
/*                                    Indexes                                 */
/* -------------------------------------------------------------------------- */

// Allows multiple test cases for one scenario,
// but prevents exact duplicate test case names inside the same scenario.
TestCaseSchema.index(
  { scenario_id: 1, test_case_name: 1 },
  { unique: true, name: "uniq_test_case_name_per_scenario" },
);

// Helpful for grouped listing/sorting by scenario
TestCaseSchema.index(
  { scenario_id: 1, test_case_number: 1 },
  { name: "idx_scenario_test_case_number" },
);

/* -------------------------------------------------------------------------- */
/*                              Auto Number Generation                        */
/* -------------------------------------------------------------------------- */

// Generates numbering like:
// ET-HC-9948 -> TC-HC-9948-1
// ET-HC-9948 -> TC-HC-9948-2
// ET-HC-9948 -> TC-HC-9948-3
TestCaseSchema.pre("validate", async function (next) {
  try {
    // Only auto-generate on new docs when number is missing
    if (!this.isNew || this.test_case_number) {
      return next();
    }

    if (!this.scenario_number || !this.scenario_id) {
      return next();
    }

    const baseNumber = buildBaseTestCaseNumberFromScenario(
      this.scenario_number,
    );

    if (!baseNumber) {
      return next();
    }

    // Count existing test cases for this scenario
    const existingCount = await this.constructor.countDocuments({
      scenario_id: this.scenario_id,
    });

    this.test_case_number = `${baseNumber}-${existingCount + 1}`;

    return next();
  } catch (error) {
    return next(error);
  }
});

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

module.exports =
  mongoose.models.TestCase || mongoose.model("TestCase", TestCaseSchema);
