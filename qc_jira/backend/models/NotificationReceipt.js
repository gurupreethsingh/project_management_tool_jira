// models/NotificationReceipt.js
const mongoose = require("mongoose");

const NotificationReceiptSchema = new mongoose.Schema(
  {
    message: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationMessage", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // user-specific state
    status: { type: String, enum: ["unread", "read", "seen", "replied"], default: "unread", index: true },
    isRead: { type: Boolean, default: false, index: true },
    readAt: Date,
    seenAt: Date,

    reply: {
      content: String,
      repliedAt: Date,
    },

    // If a user deletes a message from their view
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Each user has at most one receipt per message
NotificationReceiptSchema.index({ message: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("NotificationReceipt", NotificationReceiptSchema);
