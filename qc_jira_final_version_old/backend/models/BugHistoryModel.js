const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// BugHistory Schema to track bug history changes
const bugHistorySchema = new Schema({
  defect_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bug", // Reference to the Bug model
    required: true,
  },
  bug_id: {
    type: String, // Storing the bug_id
    required: true,
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
    required: true,
  },
  updated_by: {
    type: String, // Name of the person who updated the bug
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now, // Automatically sets the time of the update
  },
  previous_status: {
    type: String, // Store the previous status before the change
  },
  change_description: {
    type: String, // Description of the changes made during the update
    default: "",
  },
  test_case_name: {
    type: String, // Store the test case name
    required: true,
  },
  test_case_number: {
    type: String, // Store the test case number
    required: true,
  },
  scenario_number: {
    type: String, // Store the scenario number
    required: true,
  },
  module_name: {
    type: String, // Store the module name
    required: true,
  },
});

module.exports = mongoose.model("BugHistory", bugHistorySchema);
