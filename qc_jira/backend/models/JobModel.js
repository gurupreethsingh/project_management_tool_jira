const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC INFO
    // ===============================
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },

    applyType: {
      type: String,
      enum: ["job", "internship"],
      required: true,
      default: "job",
      index: true,
    },

    // ===============================
    // JOB DETAILS
    // ===============================
    department: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    experienceLevel: {
      type: String,
      trim: true,
      default: "", // Fresher / 1-3 years / 5+ years
    },

    employmentMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite", ""],
      default: "",
    },

    preferredLocation: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    openingsCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    // ===============================
    // SALARY / STIPEND
    // ===============================
    salaryMin: {
      type: Number,
      default: null,
    },

    salaryMax: {
      type: Number,
      default: null,
    },

    salaryCurrency: {
      type: String,
      default: "INR",
    },

    isSalaryVisible: {
      type: Boolean,
      default: false,
    },

    // ===============================
    // CONTENT
    // ===============================
    shortDescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // ===============================
    // APPLICATION SETTINGS
    // ===============================
    applicationDeadline: {
      type: Date,
      default: null,
    },

    externalApplyLink: {
      type: String,
      trim: true,
      default: "",
    },

    // ===============================
    // STATUS CONTROL
    // ===============================
    isPublished: {
      type: Boolean,
      default: false, // Draft by default
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ===============================
    // ADMIN TRACKING
    // ===============================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ===============================
    // META
    // ===============================
    viewsCount: {
      type: Number,
      default: 0,
    },

    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ===============================
// INDEXES (FOR PERFORMANCE)
// ===============================
JobSchema.index({ title: "text", description: "text", skills: "text" });

// ===============================
// PRE SAVE: GENERATE SLUG
// ===============================
JobSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Job", JobSchema);
