// models/ReportModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExtensionSchema = new Schema(
  {
    isRequested: { type: Boolean, default: false },
    requestedDueDate: { type: Date },
    reason: { type: String, trim: true },
    approved: { type: Boolean, default: null }, // null = pending
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { _id: false }
);

const AttachmentSchema = new Schema(
  {
    label: { type: String, trim: true },
    type: {
      type: String,
      enum: ["file", "link"],
      default: "file",
    },
    url: { type: String, trim: true },
    fileId: { type: Schema.Types.ObjectId, ref: "File" }, // optional if you have a File model
  },
  { _id: false }
);

const ReportSchema = new Schema(
  {
    // Links
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    // Who created & who should receive
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipients: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Basic info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    submissionCriteria: {
      type: String,
      trim: true,
    },
    criteriaMet: {
      type: Boolean,
      default: false,
    },

    // Status snapshot of task at the time of report
    taskStatusAtReport: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "blocked",
        "completed",
        "on_hold",
        "needs_more_time",
      ],
      default: "in_progress",
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Status of the report workflow itself
    overallStatus: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft",
    },

    // Time & schedule
    plannedStartDate: { type: Date },
    plannedEndDate: { type: Date },
    actualStartDate: { type: Date },
    actualEndDate: { type: Date },
    timeSpentMinutes: { type: Number, min: 0 },
    overtimeMinutes: { type: Number, min: 0 },

    // Extension / more days request
    extension: { type: ExtensionSchema, default: () => ({}) },

    // Remarks / reasons
    remarks: { type: String, trim: true },
    blockers: { type: String, trim: true },
    nonSubmissionReason: { type: String, trim: true },

    // View status (simple global flag)
    isViewed: {
      type: Boolean,
      default: false,
      index: true,
    },
    viewedAt: { type: Date },

    // Attachments & exports
    attachments: [AttachmentSchema],
    lastExportedAt: { type: Date },
    lastExportFormat: {
      type: String,
      enum: ["excel", "word", null],
      default: null,
    },

    // Meta
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Optional index for faster queries
ReportSchema.index({ project: 1, task: 1, reporter: 1, overallStatus: 1 });

const Report = mongoose.model("Report", ReportSchema);
module.exports = { Report };
