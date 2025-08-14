const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  deadline: { type: Date }, // Deadline field added
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the QA lead or project creator
  developers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of developers in the project
  testEngineers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of test engineers in the project
  scenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scenario" }], // List of scenarios associated with the project
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
      "General Web Project", // Default domain
      "Other",
    ],
    default: "General Web Project",
  }, // Expanded Domain field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
