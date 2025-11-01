// models/OrderModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

/** Tiny helper for readable order codes: ORD-8F3K2Q */
const genOrderCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `ORD-${s}`;
};

/**
 * We keep your original fields (product_name, selling_price, quantity, product_image),
 * but add a proper course reference + a small snapshot section so history stays correct
 * even if the course later changes.
 */
const orderItemSchema = new Schema(
  {
    // Primary link to the purchased course
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    // Your existing fields (mapped from course at order time)
    product_name: { type: String, required: true, trim: true }, // course.title
    selling_price: { type: Number, required: true, min: 0, default: 0 }, // course.price or 0
    quantity: { type: Number, required: true, min: 1, default: 1 },
    product_image: { type: String, trim: true }, // optional (course thumbnail)

    // Optional snapshot for future-proofing
    snapshot: {
      slug: { type: String, trim: true, lowercase: true },
      level: { type: String, trim: true },
      category: { type: Schema.Types.ObjectId, ref: "Category" },
      subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
      tags: { type: [String], default: [] },
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    // Logged-in user id or null for guests
    user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },

    // Required addresses (you post them from CheckoutPage)
    billingAddress: { type: Object, required: true },
    shippingAddress: { type: Object, required: true },

    // Items from the cart
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Order must contain at least one course.",
      },
    },

    // Summary
    itemCount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, default: "INR" },

    // Status (no payment gateway)
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
      index: true,
    },

    // Handy metadata
    orderCode: { type: String, unique: true, index: true }, // e.g. ORD-8F3K2Q
    confirmedAt: { type: Date },

    // Guest checkout details (kept as-is per your model)
    guestName: { type: String, trim: true },
    guestEmail: { type: String, trim: true },
    guestPhone: { type: String, trim: true },

    // Optional soft flag
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/** Normalize before save: dedupe items by course, compute itemCount/total, set orderCode */
orderSchema.pre("validate", function (next) {
  // 1) De-duplicate by course id
  if (Array.isArray(this.items) && this.items.length > 1) {
    const seen = new Set();
    this.items = this.items.filter((it) => {
      const k = String(it.course);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  // 2) itemCount (sum quantities) + totalAmount (if not supplied)
  const items = Array.isArray(this.items) ? this.items : [];
  this.itemCount = items.reduce((s, it) => s + (Number(it.quantity) || 1), 0);

  if (!(this.totalAmount > 0)) {
    this.totalAmount = items.reduce(
      (sum, it) =>
        sum +
        (Number(it.selling_price || 0) * (Number(it.quantity || 1))),
      0
    );
  }

  // 3) orderCode default
  if (!this.orderCode) this.orderCode = genOrderCode();

  // 4) If we ever mark Paid externally, stamp confirmedAt
  if (this.paymentStatus === "Paid" && !this.confirmedAt) {
    this.confirmedAt = new Date();
  }

  next();
});

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
