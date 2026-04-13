const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema(
  {
    // ============================================================
    // BASIC INFO
    // ============================================================
    title: {
      type: String,
      required: [true, "Internship title is required"],
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },

    moduleType: {
      type: String,
      enum: ["internship"],
      default: "internship",
      index: true,
    },

    internshipCode: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

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

    // ============================================================
    // ORGANIZATION / ACADEMIC DETAILS
    // ============================================================
    department: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    domain: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    specialization: {
      type: String,
      trim: true,
      default: "",
    },

    academicYear: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    batch: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    targetCollege: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    targetBranch: {
      type: String,
      trim: true,
      default: "",
    },

    targetSemester: {
      type: String,
      trim: true,
      default: "",
    },

    eligibility: {
      type: String,
      trim: true,
      default: "",
    },

    // ============================================================
    // MODE / DURATION / LOCATION
    // ============================================================
    mode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite", ""],
      default: "",
      index: true,
    },

    preferredLocation: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    duration: {
      type: String,
      enum: ["1 Month", "3 Months", "6 Months", ""],
      default: "",
      index: true,
    },

    durationInDays: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      default: null,
      index: true,
    },

    endDate: {
      type: Date,
      default: null,
      index: true,
    },

    applicationDeadline: {
      type: Date,
      default: null,
      index: true,
    },

    // ============================================================
    // TRAINING / PROJECT DETAILS
    // ============================================================
    trainingTitle: {
      type: String,
      trim: true,
      default: "",
    },

    trainingDescription: {
      type: String,
      trim: true,
      default: "",
    },

    projectTitle: {
      type: String,
      trim: true,
      default: "",
    },

    projectDescription: {
      type: String,
      trim: true,
      default: "",
    },

    projectTechStack: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],

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

    // ============================================================
    // PAYMENT / FEES / STIPEND
    // ============================================================
    paymentType: {
      type: String,
      enum: ["Paid", "Unpaid", "Stipend", ""],
      default: "",
      index: true,
    },

    stipendAmount: {
      type: Number,
      default: null,
    },

    feesAmount: {
      type: Number,
      default: null,
    },

    currency: {
      type: String,
      trim: true,
      default: "INR",
    },

    feesPaymentRequired: {
      type: Boolean,
      default: false,
    },

    feesPaymentStatus: {
      type: String,
      enum: ["Pending", "Partially Paid", "Paid", "Waived", ""],
      default: "",
      index: true,
    },

    // ============================================================
    // CAPACITY / APPLICANT ANALYTICS
    // ============================================================
    totalStudentsCapacity: {
      type: Number,
      default: 0,
      min: 0,
    },

    seatsAvailable: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalApplied: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalShortlisted: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSelected: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalRejected: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalJoined: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDropped: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCertificatesGenerated: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAcceptanceLettersGenerated: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============================================================
    // DOCUMENT / SUBMISSION / DELIVERY STATUS
    // ============================================================
    acceptanceLetterRequired: {
      type: Boolean,
      default: true,
    },

    acceptanceLetterGenerated: {
      type: Boolean,
      default: false,
      index: true,
    },

    acceptanceLetterFormat: {
      type: String,
      enum: ["PDF", "DOCX", "BOTH", ""],
      default: "",
    },

    internshipCertificateRequired: {
      type: Boolean,
      default: true,
    },

    internshipCertificateGenerated: {
      type: Boolean,
      default: false,
      index: true,
    },

    internshipCertificateFormat: {
      type: String,
      enum: ["PDF", "DOCX", "BOTH", ""],
      default: "",
    },

    synopsisRequired: {
      type: Boolean,
      default: true,
    },

    synopsisSubmissionStatus: {
      type: String,
      enum: ["Pending", "Submitted", "Approved", "Rejected", ""],
      default: "",
      index: true,
    },

    codeSetupRequired: {
      type: Boolean,
      default: true,
    },

    codeInstallationStatus: {
      type: String,
      enum: ["Pending", "Installed", "Running", "Failed", "Verified", ""],
      default: "",
      index: true,
    },

    reportSubmissionRequired: {
      type: Boolean,
      default: true,
    },

    fullProjectReportStatus: {
      type: String,
      enum: ["Pending", "Submitted", "Approved", "Rejected", ""],
      default: "",
      index: true,
    },

    vivaQuestionsRequired: {
      type: Boolean,
      default: true,
    },

    vivaQuestionsSubmissionStatus: {
      type: String,
      enum: ["Pending", "Submitted", "Approved", "Rejected", ""],
      default: "",
      index: true,
    },

    finalPresentationStatus: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Missed", ""],
      default: "",
      index: true,
    },

    evaluationStatus: {
      type: String,
      enum: ["Pending", "In Review", "Evaluated", "Completed", ""],
      default: "",
      index: true,
    },

    // ============================================================
    // MENTOR / COORDINATION
    // ============================================================
    mentorName: {
      type: String,
      trim: true,
      default: "",
    },

    mentorEmail: {
      type: String,
      trim: true,
      default: "",
    },

    coordinatorName: {
      type: String,
      trim: true,
      default: "",
    },

    coordinatorEmail: {
      type: String,
      trim: true,
      default: "",
    },

    // ============================================================
    // OVERALL STATUS CONTROL
    // ============================================================
    internshipStatus: {
      type: String,
      enum: [
        "Draft",
        "Open",
        "Applications Closed",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Draft",
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    externalApplyLink: {
      type: String,
      trim: true,
      default: "",
    },

    // ============================================================
    // ADMIN TRACKING
    // ============================================================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ============================================================
    // META
    // ============================================================
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

InternshipSchema.index({
  title: "text",
  description: "text",
  skills: "text",
  projectTitle: "text",
  trainingTitle: "text",
});

InternshipSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  if (
    this.totalStudentsCapacity > 0 &&
    (this.seatsAvailable === 0 ||
      this.seatsAvailable > this.totalStudentsCapacity)
  ) {
    this.seatsAvailable = Math.max(
      this.totalStudentsCapacity - (this.totalJoined || 0),
      0,
    );
  }

  next();
});

module.exports = mongoose.model("Internship", InternshipSchema);
