// models/NotificationMessage.js
const mongoose = require("mongoose");

const NotificationMessageSchema = new mongoose.Schema(
  {
    audience: {
      type: String,
      enum: ["all", "role", "user"],
      required: true,
      index: true,
    },

    // sender (author of the notification)
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // for audience: "role"
    receiverRole: { type: String, index: true },

    // for audience: "user"
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    message: { type: String, required: true },

    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "low" },
    type: { type: String, enum: ["task_update", "bug_report", "comment", "reply", "alert"], default: "task_update" },

    // soft delete of the message itself
    isDeleted: { type: Boolean, default: false, index: true },

    // optional linking
    relatedEntity: { type: mongoose.Schema.Types.ObjectId, refPath: "entityModel" },
    entityModel: { type: String, enum: ["Project", "Task", "Bug", "Scenario", "Comment"] },
  },
  { timestamps: true }
);

NotificationMessageSchema.index({ createdAt: -1 });
module.exports = mongoose.model("NotificationMessage", NotificationMessageSchema);
