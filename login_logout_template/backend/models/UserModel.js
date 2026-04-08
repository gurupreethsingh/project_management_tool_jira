const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: [
        "accountant", // University Accountant
        "admin", // System Administrator
        "alumni_relations", // Alumni Relations Officer
        "business_analyst", // New role: Business Analyst
        "content_creator", // New role: Content Creator
        "course_coordinator", // Course Coordinator
        "customer_support", // New role: Customer Support Representative
        "data_scientist", // New role: Data Scientist
        "dean", // Dean of Faculty
        "department_head", // Head of Department
        "developer_lead",
        "developer", // Software Developer
        "event_coordinator", // Event Coordinator
        "exam_controller", // Exam Controller
        "hr_manager", // HR Manager
        "hr",
        "intern", // Intern
        "legal_advisor", // New role: Legal Advisor
        "librarian", // University Librarian
        "maintenance_staff", // Maintenance Staff
        "marketing_manager", // New role: Marketing Manager
        "operations_manager", // New role: Operations Manager
        "product_owner", // Product Owner
        "project_manager", // Project Manager
        "qa_lead", // Quality Assurance Lead
        "recruiter", // Recruiter
        "registrar", // University Registrar
        "researcher", // Researcher
        "sales_executive", // New role: Sales Executive
        "student", // University Student
        "superadmin", // Super Administrator
        "support_engineer", // Support Engineer
        "teacher", // University Teacher
        "tech_lead", // Technical Lead
        "test_engineer", // Software Tester
        "user", // Default role
        "ux_ui_designer", // UX/UI Designer
      ],
      default: "user", // Default role
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      default: "",
      trim: true,
    },
    addressLine1: {
      type: String,
      default: "",
      trim: true,
    },
    addressLine2: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    country: {
      type: String,
      default: "",
      trim: true,
    },
    postalCode: {
      type: String,
      default: "",
      trim: true,
    },
    nationality: {
      type: String,
      default: "",
      trim: true,
    },
    preferredCurrency: {
      type: String,
      default: "INR",
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      default: undefined,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      default: undefined,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(String(enteredPassword || ""), this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || "dev_jwt_secret_change_me",
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    },
  );
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
