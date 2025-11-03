const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistItemSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true }, // <- changed
    savedForLater: { type: Boolean, default: false },
  },
  { _id: false }
);

const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: { type: [wishlistItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
