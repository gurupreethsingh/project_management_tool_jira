const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");

const subCategorySchema = new mongoose.Schema(
  {
    subcategory_name: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ normalized field (case-insensitive uniqueness)
    subcategory_name_normalized: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ AUTO-normalize before validation/save
subCategorySchema.pre("validate", function (next) {
  const raw = (this.subcategory_name || "").trim();
  this.subcategory_name = raw;

  // normalize: trim + lowercase + collapse multiple spaces
  this.subcategory_name_normalized = raw
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  next();
});

// ✅ Unique per category (prevents duplicates even via Mongo shell/command prompt)
// IMPORTANT: This will block duplicates where isDeleted is false OR true.
// We'll "revive" soft-deleted ones in controller instead of creating new.
subCategorySchema.index(
  { category: 1, subcategory_name_normalized: 1 },
  { unique: true }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;
