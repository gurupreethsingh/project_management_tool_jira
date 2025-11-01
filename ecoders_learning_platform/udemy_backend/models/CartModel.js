const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ← 1) one cart per user (recommended)
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

/* 2) Prevent duplicate courses in a user's cart (DB-level)
   This multikey unique index ensures (user, items.course) pairs are unique.
   The partial filter avoids null/missing values causing index issues.
*/
cartSchema.index(
  { user: 1, "items.course": 1 },
  {
    unique: true,
    partialFilterExpression: { "items.course": { $exists: true, $ne: null } },
  }
);

/* 3) Safety net: de-duplicate at app level before saving
   If some code accidentally pushes the same course twice, this normalizes it.
   (Still keep the unique index to be 100% safe in concurrent requests.)
*/
cartSchema.pre("save", function (next) {
  if (Array.isArray(this.items) && this.items.length > 1) {
    const seen = new Set();
    this.items = this.items.filter((it) => {
      const key = String(it.course);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  next();
});

// (Optional) Helper methods you can use in controllers/services
cartSchema.methods.addCourse = function (courseId) {
  const exists = this.items.some((it) => String(it.course) === String(courseId));
  if (!exists) this.items.push({ course: courseId });
  return this;
};

cartSchema.methods.removeCourse = function (courseId) {
  this.items = this.items.filter((it) => String(it.course) !== String(courseId));
  return this;
};

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
