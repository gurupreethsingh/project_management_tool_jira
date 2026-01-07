// api/models/DashboardGenInteractionModel.js
const mongoose = require("mongoose");

const DashboardGenInteractionSchema = new mongoose.Schema(
  {
    scope: { type: String, default: "dashboard-gen" }, // optional
    sessionId: { type: String, index: true },
    userId: { type: String, default: null }, // optional if you track auth users
    prompt: { type: String, required: true },
    completion: { type: String, required: true },
    meta: { type: Object, default: {} },
    tokens: { type: Object, default: {} }, // optional: { inTokens, outTokens }
    modelInfo: { type: Object, default: {} }, // optional snapshot
  },
  { timestamps: true }
);

DashboardGenInteractionSchema.index({ createdAt: -1 });

module.exports = {
  DashboardGenInteraction: mongoose.model(
    "DashboardGenInteraction",
    DashboardGenInteractionSchema
  ),
};
