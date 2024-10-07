const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bugSchema = new Schema(
  {
    bug_id: {
      type: String,
      default: function () {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
      },
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    project_name: {
      type: String,
      required: true,
    },
    test_case_name: String,
    test_case_number: {
      type: String,
      required: true,
    },
    scenario_number: {
      type: String,
      required: true,
    },
    requirement_number: {
      type: String,
    },
    build_number: {
      type: String,
    },
    module_name: {
      type: String,
    },
    test_case_type: {
      type: String,
    },
    expected_result: {
      type: String,
    },
    actual_result: {
      type: String,
    },
    description_of_defect: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "Open/New",
        "Assigned",
        "In-Progress",
        "Fixed",
        "Re-opened",
        "Closed",
        "Unable-To-fix",
        "Not-An-Error",
        "Request-For-Enhancement",
      ],
      default: "Open/New",
    },
    steps_to_replicate: {
      type: [String],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    severity: {
      type: String,
      enum: ["Minor", "Major", "Critical", "Blocker"],
    },
    author: String,
    reported_date: {
      type: Date,
      default: Date.now,
    },
    updated_date: {
      type: Date,
      default: Date.now,
    },
    fixed_date: {
      type: Date,
    },
    bug_picture: {
      type: String,
    },
    history: {
      type: Array, // Make sure the 'history' field is defined as an array
      default: [], // Default to an empty array
    },
  },
  { timestamps: true }
);

// Middleware to update 'updated_date' before each save
bugSchema.pre("save", function (next) {
  this.updated_date = Date.now();
  next();
});

module.exports = mongoose.model("Bug", bugSchema);
