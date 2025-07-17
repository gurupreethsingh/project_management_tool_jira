const mongoose = require("mongoose");

const scenarioSchema = new mongoose.Schema(
  {
    scenario_text: {
      type: String,
      required: true,
    },
    scenario_number: {
      type: String,
      unique: true,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testCases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestCase",
      },
    ],
    updatedBy: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      updateTime: {
        type: Date,
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field to check if test cases are missing
scenarioSchema.virtual("isMissingTestCases").get(function () {
  return this.testCases.length === 0;
});

module.exports = mongoose.model("Scenario", scenarioSchema);
