const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * A lightweight audit trail for TestCase changes.
 * One document per change event, storing a list of human-readable bullet points.
 */
const TestCaseChangeSchema = new Schema(
  {
    test_case_id: {
      type: Schema.Types.ObjectId,
      ref: "TestCase",
      required: true,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: false }, // may be null if system
    user_name: { type: String, default: "" }, // denormalized convenience
    items: [{ type: String }], // bullet list of changes
    at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestCaseChange", TestCaseChangeSchema);
