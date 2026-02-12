// models/ToDoModel.js
const mongoose = require("mongoose");

const STATUS = ["NEW", "IN_PROGRESS", "FINISHED", "PENDING"];

const ToDoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },

    title: { type: String, required: true, trim: true, maxlength: 200 },
    details: { type: String, default: "", trim: true, maxlength: 3000 },

    reportTo: { type: String, default: "", trim: true, maxlength: 200 }, // optional: name/email

    startAt: { type: Date, default: null },
    dueAt: { type: Date, default: null },

    status: { type: String, enum: STATUS, default: "NEW", index: true },

    // ordering inside each column (kanban)
    sortOrder: { type: Number, default: 0, index: true },

    completedAt: { type: Date, default: null },
    reopenedAt: { type: Date, default: null },
    lastStatusChangedAt: { type: Date, default: Date.now },

    isArchived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

// Helpful compound indexes
ToDoSchema.index({ user: 1, status: 1, sortOrder: 1 });
ToDoSchema.index({ user: 1, dueAt: 1 });
ToDoSchema.index({ user: 1, title: "text", details: "text", reportTo: "text" });

ToDoSchema.statics.STATUS = STATUS;

module.exports = mongoose.model("ToDo", ToDoSchema);
