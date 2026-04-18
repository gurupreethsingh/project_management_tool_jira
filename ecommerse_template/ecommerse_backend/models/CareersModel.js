const mongoose = require("mongoose");

// ======================================================
// SHARED HELPERS
// ======================================================
const EXPERIENCE_LEVELS = [
  "fresher",
  "0-1 years",
  "1-2 years",
  "2-4 years",
  "4-6 years",
  "6+ years",
];

const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "internship",
  "freelance",
];

const WORK_MODES = ["onsite", "remote", "hybrid"];

const OPPORTUNITY_STATUSES = ["draft", "published", "closed", "archived"];

const APPLICATION_STATUSES = [
  "applied",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "accepted",
  "rejected",
  "delayed",
  "withdrawn",
];

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ======================================================
// CAREER OPPORTUNITY SCHEMA
// ======================================================
const careerOpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    opportunityType: {
      type: String,
      enum: ["job", "internship"],
      required: [true, "Opportunity type is required"],
      index: true,
    },

    department: {
      type: String,
      trim: true,
      index: true,
    },

    location: {
      type: String,
      trim: true,
      default: "Remote",
      index: true,
    },

    workMode: {
      type: String,
      enum: WORK_MODES,
      default: "onsite",
      index: true,
    },

    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      required: [true, "Employment type is required"],
      index: true,
    },

    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVELS,
      default: "fresher",
      index: true,
    },

    experienceMinYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    experienceMaxYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
    },

    stipendMin: {
      type: Number,
      default: 0,
      min: 0,
    },

    stipendMax: {
      type: Number,
      default: 0,
      min: 0,
    },

    salaryMin: {
      type: Number,
      default: 0,
      min: 0,
    },

    salaryMax: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    qualifications: {
      type: [String],
      default: [],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
      trim: true,
    },

    applicationDeadline: {
      type: Date,
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: OPPORTUNITY_STATUSES,
      default: "published",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

careerOpportunitySchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(`${this.title}-${this.opportunityType}`);
  }
  next();
});

careerOpportunitySchema.index({
  title: "text",
  department: "text",
  location: "text",
  shortDescription: "text",
  fullDescription: "text",
});

// ======================================================
// CAREER APPLICATION SCHEMA
// ======================================================
const careerApplicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerOpportunity",
      required: [true, "Opportunity reference is required"],
      index: true,
    },

    applicantUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    opportunityTypeSnapshot: {
      type: String,
      enum: ["job", "internship"],
      required: true,
      index: true,
    },

    opportunityTitleSnapshot: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    fullName: {
      type: String,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "India",
      index: true,
    },

    totalExperienceYears: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    currentCompany: {
      type: String,
      trim: true,
      default: "",
    },

    currentRole: {
      type: String,
      trim: true,
      default: "",
    },

    highestQualification: {
      type: String,
      trim: true,
      default: "",
    },

    collegeName: {
      type: String,
      trim: true,
      default: "",
    },

    graduationYear: {
      type: Number,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },

    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },

    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },

    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },

    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },

    whyShouldWeHireYou: {
      type: String,
      trim: true,
      default: "",
    },

    expectedSalaryOrStipend: {
      type: Number,
      default: 0,
      min: 0,
    },

    noticePeriodDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    availableFrom: {
      type: Date,
      default: null,
    },

    applicationSource: {
      type: String,
      trim: true,
      default: "careers-page",
      index: true,
    },

    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "applied",
      index: true,
    },

    statusReason: {
      type: String,
      trim: true,
      default: "",
    },

    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },

    emailLogs: [
      {
        subject: { type: String, trim: true, default: "" },
        message: { type: String, trim: true, default: "" },
        sentAt: { type: Date, default: Date.now },
        sentBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

careerApplicationSchema.pre("validate", function (next) {
  const combined = `${this.firstName || ""} ${this.lastName || ""}`.trim();
  this.fullName = combined;
  next();
});

careerApplicationSchema.index(
  { opportunity: 1, email: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

careerApplicationSchema.index({
  fullName: "text",
  email: "text",
  city: "text",
  currentCompany: "text",
  currentRole: "text",
  highestQualification: "text",
  opportunityTitleSnapshot: "text",
});

const CareerOpportunity =
  mongoose.models.CareerOpportunity ||
  mongoose.model("CareerOpportunity", careerOpportunitySchema);

const CareerApplication =
  mongoose.models.CareerApplication ||
  mongoose.model("CareerApplication", careerApplicationSchema);

module.exports = {
  CareerOpportunity,
  CareerApplication,
};
