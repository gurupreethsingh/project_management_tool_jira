const mongoose = require("mongoose");

const UserProductHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// one unique history row per user + product
UserProductHistorySchema.index({ user: 1, product: 1 }, { unique: true });

module.exports =
  mongoose.models.UserProductHistory ||
  mongoose.model("UserProductHistory", UserProductHistorySchema);
