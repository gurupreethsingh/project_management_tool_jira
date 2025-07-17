const mongoose = require("mongoose");

const attendenceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Optional: link to project
    },
    date: {
      type: Date,
      required: true,
    },
    hoursWorked: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    taskDescription: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    approvedOrRejectedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin or Superadmin
    },
    remarks: {
      type: String,
      trim: true,
    },
    isBillable: {
      type: Boolean,
      default: false, // Can be set true for billing purposes
    },
    location: {
      type: String,
      enum: ["Office", "Remote", "Client Site"],
      default: "Remote",
    },
    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night", "General"],
      default: "General",
    },
    modifiedByAdmin: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

attendenceSchema.index({ employee: 1, date: 1 }, { unique: true }); // Prevent duplicate entry for same day

module.exports = mongoose.model("Attendance", attendenceSchema);
