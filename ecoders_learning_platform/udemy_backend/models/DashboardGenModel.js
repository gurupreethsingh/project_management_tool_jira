// models/DashboardGenModel.js
const mongoose = require("mongoose");

const DashboardGenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sessionId: { type: String, default: "" },

    prompt: { type: String, required: true, trim: true },

    // ✅ Only params that the new Flask API supports
    params: {
      max_new_tokens: { type: Number, default: 900 },
    },

    completion: { type: String, default: "" },

    ok: { type: Boolean, default: true },
    error: { type: String, default: "" },

    modelInfo: { type: Object, default: {} },
    latencyMs: { type: Number, default: 0 },

    channel: { type: String, default: "widget" },
  },
  { timestamps: true }
);

DashboardGenSchema.index({ createdAt: -1 });
DashboardGenSchema.index({ user: 1, createdAt: -1 });
DashboardGenSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model("DashboardGen", DashboardGenSchema);
