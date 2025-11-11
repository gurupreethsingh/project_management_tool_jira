// models/TaskModel.js
const mongoose = require("mongoose");

const TaskStatus = [
  "new",
  "assigned",
  "re-assigned",
  "in-progress",
  "finished",
  "closed",
  "pending",
];

const TaskPriority = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    // NEW: canonical task title
    task_title: { type: String, required: true, trim: true },

    // description
    description: { type: String },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    // modules as ObjectIds -> ModuleModel
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],

    // denormalized for fast filtering/search & UI display
    module_names: [{ type: String, trim: true }],

    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: TaskStatus,
      default: "new",
      index: true,
    },

    priority: {
      type: String,
      enum: TaskPriority,
      default: "medium",
      index: true,
    },

    startDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // Task history for tracking status changes
    history: [
      {
        statusChanges: [
          {
            status: { type: String, enum: TaskStatus, required: true },
            changedAt: { type: Date, default: Date.now },
            changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          },
        ],
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---- Virtual for backward compatibility with "title" ----
taskSchema
  .virtual("title")
  .get(function () {
    return this.task_title;
  })
  .set(function (v) {
    this.task_title = v;
  });

// Helpful indexes
taskSchema.index({ project: 1, module_names: 1 });
taskSchema.index({ task_title: "text", description: "text" });

// Keep module_names trimmed for consistent querying
function normName(s) {
  return String(s || "").trim();
}

taskSchema.pre("save", function (next) {
  if (Array.isArray(this.module_names)) {
    this.module_names = this.module_names.map(normName).filter(Boolean);
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
module.exports.TaskStatus = TaskStatus;
module.exports.TaskPriority = TaskPriority;
