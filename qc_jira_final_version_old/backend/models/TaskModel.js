const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true, // Reference to the project
  },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of users assigned to the task
  status: {
    type: String,
    enum: [
      "new",
      "assigned",
      "re-assigned",
      "in-progress",
      "finished",
      "closed",
      "pending",
    ],
    default: "new",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  startDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Task history for tracking status changes
  history: [
    {
      statusChanges: [
        {
          status: {
            type: String,
            enum: [
              "new",
              "assigned",
              "re-assigned",
              "in-progress",
              "finished",
              "closed",
              "pending",
            ],
            required: true,
          },
          changedAt: { type: Date, default: Date.now }, // Date of status change
          changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who made the change
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);
