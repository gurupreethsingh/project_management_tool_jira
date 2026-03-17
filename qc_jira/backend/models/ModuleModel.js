const mongoose = require("mongoose");

/* ------------------------ Normalization helpers ------------------------ */

/**
 * Normalize and validate module names.
 *
 * Rules:
 * - Cannot be empty or whitespace-only
 * - Must contain at least one letter
 * - Cannot contain numbers anywhere
 * - Cannot contain special characters anywhere
 * - Only letters and spaces allowed in raw input
 * - Leading/trailing spaces are trimmed
 * - Multiple internal spaces are collapsed to a single space
 * - Stored value becomes PascalCase without spaces
 *   Example: "home page" -> "HomePage"
 *
 * Returns:
 *   { displayName, key }
 * or
 *   { error }
 */
function normalizeModuleName(raw) {
  const input = String(raw ?? "");
  const trimmed = input.trim();

  if (!trimmed) {
    return { error: "Module name cannot be empty or whitespace-only." };
  }

  // Must contain at least one alphabetic character
  if (!/[A-Za-z]/.test(trimmed)) {
    return { error: "Module name must contain at least one letter (A–Z)." };
  }

  // No numbers allowed anywhere
  if (/\d/.test(trimmed)) {
    return { error: "Module name cannot contain numbers." };
  }

  // Allow only letters and spaces
  if (/[^A-Za-z\s]/.test(trimmed)) {
    return { error: "Module name cannot contain special characters." };
  }

  // Collapse repeated spaces
  const collapsed = trimmed.replace(/\s+/g, " ");

  const words = collapsed.split(" ").filter(Boolean);

  const displayName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  if (!displayName) {
    return { error: "Module name cannot be empty." };
  }

  if (displayName.length > 100) {
    return { error: "Module name cannot be more than 100 characters." };
  }

  // Lowercase normalized key for dedupe within a project
  const key = displayName.toLowerCase().slice(0, 200);

  return { displayName, key };
}

/* ----------------------------- Schema ----------------------------- */

const moduleSchema = new mongoose.Schema(
  {
    // Stored normalized value, e.g. "HomePage"
    name: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },

    // Lowercase dedupe key within a project, e.g. "homepage"
    key: {
      type: String,
      required: true,
      maxlength: 200,
      index: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      immutable: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Unique per project after normalization
moduleSchema.index({ project: 1, key: 1 }, { unique: true });

/* ---------------------- Validation + normalization ---------------------- */

// Normalize on validate so create/save/update stay consistent
moduleSchema.pre("validate", function (next) {
  try {
    if (!this.isModified("name")) return next();

    const { displayName, key, error } = normalizeModuleName(this.name);

    if (error) {
      this.invalidate("name", error);
      return next();
    }

    this.name = displayName;
    this.key = key;

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("Module", moduleSchema);
