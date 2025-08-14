// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const requirementSchema = new Schema(
//   {
//     project_id: {
//       type: Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//     },
//     project_name: {
//       type: String,
//       required: true,
//     },
//     requirement_number: {
//       type: String,
//       required: true,
//     },
//     build_name_or_number: {
//       type: String,
//       required: true,
//     },
//     module_name: {
//       type: String,
//       required: true,
//     },
//     requirement_title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//     },
//     images: [
//       {
//         type: String, // Store image file URLs or paths
//       },
//     ],
//     steps: [
//       {
//         step_number: Number,
//         instruction: {
//           type: String,
//           trim: true,
//         },
//         for: {
//           type: String,
//           enum: ["Developer", "Tester", "Both"],
//           default: "Both",
//         },
//       },
//     ],
//     created_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// const Requirement = mongoose.model("Requirement", requirementSchema);
// module.exports = Requirement;

// new 

// models/RequirementModel.js
const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  step_number: { type: Number },
  instruction: { type: String, required: true, trim: true },
  for: { type: String, default: "Both", enum: ["Dev", "QA", "Both"] },
  image_url: { type: String },
});

const RequirementSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    project_name: { type: String, trim: true },

    requirement_number: { type: String, trim: true }, // e.g., REQ-PROJ-1
    build_name_or_number: { type: String, trim: true }, // e.g., v1.0

    module_name: { type: String, required: true, trim: true },
    // normalized (trim + lowercase) for duplicate control
    module_name_normalized: { type: String, required: true, index: true },

    requirement_title: { type: String, trim: true },
    description: { type: String, trim: true },

    images: [{ type: String }], // file paths from multer

    steps: [StepSchema],

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// **Uniqueness per project on normalized module name**
RequirementSchema.index(
  { project_id: 1, module_name_normalized: 1 },
  { unique: true, name: "uniq_project_module" }
);

module.exports = mongoose.model("Requirement", RequirementSchema);
