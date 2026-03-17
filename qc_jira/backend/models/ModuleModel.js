const mongoose = require("mongoose");

/* ------------------------ Normalization helpers ------------------------ */

/**
 * Convert input to PascalCase safely.
 *
 * Examples:
 * - "home page" -> "HomePage"
 * - "Home Page" -> "HomePage"
 * - "home-page" -> "HomePage"
 * - "home_page" -> "HomePage"
 * - "HomePage" -> "HomePage"
 * - "mainSectionPage" -> "MainSectionPage"
 */
function toPascalCase(raw = "") {
  const cleaned = String(raw)
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

/**
 * Normalize and validate module names.
 *
 * Rules:
 * - Cannot be empty or whitespace-only
 * - Must contain at least one letter
 * - Cannot contain numbers anywhere
 * - Cannot contain special characters anywhere
 * - Allows only letters, spaces, underscores, hyphens in raw input
 * - Leading/trailing spaces are trimmed
 * - Multiple internal spaces are collapsed
 * - Stored value becomes PascalCase without spaces
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

  if (!/[A-Za-z]/.test(trimmed)) {
    return { error: "Module name must contain at least one letter (A–Z)." };
  }

  if (/\d/.test(trimmed)) {
    return { error: "Module name cannot contain numbers." };
  }

  // allow letters, spaces, _ and -
  if (/[^A-Za-z\s_-]/.test(trimmed)) {
    return { error: "Module name cannot contain special characters." };
  }

  const displayName = toPascalCase(trimmed);

  if (!displayName) {
    return { error: "Module name cannot be empty." };
  }

  if (displayName.length > 100) {
    return { error: "Module name cannot be more than 100 characters." };
  }

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
