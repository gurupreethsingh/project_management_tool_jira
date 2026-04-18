const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        savedForLater: {
          type: Boolean,
          default: false,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
