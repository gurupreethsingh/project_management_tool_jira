const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requirementSchema = new Schema(
  {
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    project_name: {
      type: String,
      required: true,
    },
    requirement_number: {
      type: String,
      required: true,
    },
    build_name_or_number: {
      type: String,
      required: true,
    },
    module_name: {
      type: String,
      required: true,
    },
    requirement_title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String, // Store image file URLs or paths
      },
    ],
    steps: [
      {
        step_number: Number,
        instruction: {
          type: String,
          trim: true,
        },
        for: {
          type: String,
          enum: ["Developer", "Tester", "Both"],
          default: "Both",
        },
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Requirement = mongoose.model("Requirement", requirementSchema);
module.exports = Requirement;
