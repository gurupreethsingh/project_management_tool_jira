// models/CareersModel.js
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    fieldName: String, // e.g. "files"
    originalName: String,
    mimeType: String,
    size: Number,
    path: String, // relative path inside uploads folder
    url: String, // optional public URL if you expose uploads statically
  },
  { _id: true }
);

const CareerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },

    // "internship" | "job"
    applyType: {
      type: String,
      enum: ["internship", "job"],
      required: true,
    },

    desiredRole: { type: String, trim: true },
    experienceLevel: { type: String, trim: true },
    preferredLocation: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },

    aboutYou: { type: String, required: true },

    // Optional link to a specific job posting (if you later create a jobs collection)
    jobId: { type: String, default: null },

    status: {
      type: String,
      enum: ["pending", "shortlisted", "accepted", "rejected", "on_hold"],
      default: "pending",
      index: true,
    },

    // Files uploaded by applicant
    files: [FileSchema],

    // Admin / review metadata
    internalNotes: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },

    // Notification flags
    emailConfirmationSent: { type: Boolean, default: false },
    statusEmailSent: { type: Boolean, default: false },

    // Basic tracking
    source: { type: String, default: "career_page" }, // campus, referral, etc
    ipAddress: String,
    userAgent: String,

    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

CareerApplicationSchema.index({ email: 1, applyType: 1, createdAt: -1 });

module.exports = mongoose.model(
  "CareerApplication",
  CareerApplicationSchema,
  "career_applications"
);
