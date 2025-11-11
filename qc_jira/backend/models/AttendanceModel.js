// backend/models/Attendance.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const StatusHistorySchema = new Schema(
  {
    status: { type: String, lowercase: true },
    at: { type: Date, default: Date.now },
    by: { type: Schema.Types.ObjectId, ref: "User" },
    remarks: String,
  },
  { _id: false }
);

const AttendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },

    date: { type: Date, required: true, index: true },
    dayKey: { type: String, required: true, index: true }, // YYYY-MM-DD

    hoursWorked: { type: Number, default: 0, min: 0, max: 24 },
    taskDescription: { type: String, default: "" },

    status: {
      type: String,
      lowercase: true,
      enum: ["pending", "marked", "unmarked", "accepted", "rejected"],
      default: "pending",
      index: true,
    },

    submittedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },

    remarks: { type: String, default: "" },

    isBillable: { type: Boolean, default: false, index: true },
    location: { type: String, default: "Remote" },
    shift: { type: String, default: "General" },

    modifiedByAdmin: { type: Boolean, default: false },

    statusHistory: { type: [StatusHistorySchema], default: [] },
  },
  { timestamps: true }
);

// Unique per employee per day
AttendanceSchema.index({ employee: 1, dayKey: 1 }, { unique: true });

// Normalize / default dayKey
AttendanceSchema.pre("validate", function (next) {
  if (this.date && !this.dayKey) {
    const d = new Date(this.date);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    this.dayKey = `${y}-${m}-${day}`;
  }
  next();
});

// Track status changes with actor and timestamps
AttendanceSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.reviewedAt = new Date();
    this.statusHistory.push({
      status: this.status,
      at: this.reviewedAt,
      by: this.reviewedBy || undefined,
      remarks: this.remarks || "",
    });
  }
  // If newly "marked" and no submittedAt set yet
  if (
    this.isModified("status") &&
    this.status === "marked" &&
    !this.submittedAt
  ) {
    this.submittedAt = new Date();
  }
  next();
});

module.exports =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
