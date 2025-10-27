// const mongoose = require("mongoose");

// const projectSchema = new mongoose.Schema({
//   project_name: { type: String, required: true },
//   description: { type: String },
//   startDate: { type: Date },
//   endDate: { type: Date },
//   deadline: { type: Date }, // Deadline field added
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   }, // Reference to the QA lead or project creator
//   developers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of developers in the project
//   testEngineers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of test engineers in the project
//   scenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scenario" }], // List of scenarios associated with the project
//   domain: {
//     type: String,
//     enum: [
//       "E-commerce",
//       "Digital Marketing",
//       "Healthcare",
//       "Education",
//       "Finance",
//       "Logistics",
//       "Real Estate",
//       "Travel & Tourism",
//       "Retail",
//       "Telecommunications",
//       "Entertainment & Media",
//       "Gaming",
//       "Manufacturing",
//       "Agriculture",
//       "Insurance",
//       "Energy & Utilities",
//       "Pharmaceutical",
//       "Construction",
//       "Legal",
//       "Automotive",
//       "Fashion",
//       "Hospitality",
//       "Food & Beverage",
//       "Government",
//       "Non-Profit",
//       "Aerospace",
//       "Human Resources",
//       "Consulting",
//       "Cybersecurity",
//       "Artificial Intelligence",
//       "Machine Learning",
//       "Data Science",
//       "Blockchain",
//       "Internet of Things (IoT)",
//       "Cloud Computing",
//       "Mobile App Development",
//       "Web Development",
//       "General Web Project", // Default domain
//       "Other",
//     ],
//     default: "General Web Project",
//   }, // Expanded Domain field
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Project", projectSchema);


// till here original and old code. 

//

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    project_name: { type: String, required: true, trim: true },
    // normalized name for case-insensitive unique constraint
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

    // NEW: per-role assignment lists (can contain any user regardless of their global role)
    superAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projectManagers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hrs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // HRs
    testLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    qaLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    developerLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bas: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // business analysts

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

// Keep name_lc in sync on create/update
function normalizeName(doc) {
  const raw = doc.project_name || "";
  doc.name_lc = String(raw).trim().toLowerCase();
}

projectSchema.pre("save", function (next) {
  normalizeName(this);
  next();
});

projectSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  if (update.$set && typeof update.$set.project_name !== "undefined") {
    update.$set.name_lc = String(update.$set.project_name).trim().toLowerCase();
  } else if (typeof update.project_name !== "undefined") {
    update.name_lc = String(update.project_name).trim().toLowerCase();
  }
  next();
});

// Helper for case-insensitive lookup
projectSchema.statics.findByNameInsensitive = function (name) {
  return this.findOne({ name_lc: String(name || "").trim().toLowerCase() });
};

module.exports = mongoose.model("Project", projectSchema);
