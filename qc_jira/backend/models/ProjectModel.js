const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    project_name: { type: String, required: true, trim: true },

    // Case-insensitive key (lowercased); kept hidden by default
    name_lc: { type: String, required: true, unique: true, index: true, select: false },

    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    deadline: { type: Date },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Existing unchanged
    developers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    testEngineers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // NEW: per-role assignment lists
    superAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projectManagers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hrs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    testLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    qaLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    developerLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bas: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    scenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scenario" }],

    domain: {
      type: String,
      enum: [
        "E-commerce",
        "Digital Marketing",
        "Healthcare",
        "Education",
        "Finance",
        "Logistics",
        "Real Estate",
        "Travel & Tourism",
        "Retail",
        "Telecommunications",
        "Entertainment & Media",
        "Gaming",
        "Manufacturing",
        "Agriculture",
        "Insurance",
        "Energy & Utilities",
        "Pharmaceutical",
        "Construction",
        "Legal",
        "Automotive",
        "Fashion",
        "Hospitality",
        "Food & Beverage",
        "Government",
        "Non-Profit",
        "Aerospace",
        "Human Resources",
        "Consulting",
        "Cybersecurity",
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Blockchain",
        "Internet of Things (IoT)",
        "Cloud Computing",
        "Mobile App Development",
        "Web Development",
        "General Web Project",
        "Other",
      ],
      default: "General Web Project",
    },
  },
  { timestamps: true }
);

// ---- Helpers ----
function toLc(v) {
  return String(v || "").trim().toLowerCase();
}

// Keep name_lc in sync BEFORE validation (so required passes)
projectSchema.pre("validate", function (next) {
  if (this.project_name) {
    this.name_lc = toLc(this.project_name);
  }
  next();
});

// Keep name_lc in sync for findOneAndUpdate / findByIdAndUpdate
projectSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  // Support both direct and $set style updates
  if (update.$set && Object.prototype.hasOwnProperty.call(update.$set, "project_name")) {
    update.$set.name_lc = toLc(update.$set.project_name);
  } else if (Object.prototype.hasOwnProperty.call(update, "project_name")) {
    update.name_lc = toLc(update.project_name);
  }
  next();
});

// Helper for case-insensitive lookups
projectSchema.statics.findByNameInsensitive = function (name) {
  return this.findOne({ name_lc: toLc(name) });
};

// (Optional, explicit) ensure unique index exists even if schema gets recompiled somewhere
projectSchema.index({ name_lc: 1 }, { unique: true });

module.exports = mongoose.model("Project", projectSchema);
