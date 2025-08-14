const mongoose = require("mongoose");

const changeSchema = new mongoose.Schema({
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: "Scenario" },
  previous_text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who made the change
  time: { type: Date, default: Date.now }, // Timestamp of the change
});

const Change = mongoose.model("Change", changeSchema);

module.exports = Change;
