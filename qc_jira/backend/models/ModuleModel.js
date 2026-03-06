// models/ModuleModel.js
const mongoose = require("mongoose");

/* ------------------------ Normalization helpers ------------------------ */

/**
 * Convert user input into:
 * - Only letters and spaces allowed in raw input
 * - Trim + collapse multiple spaces
 * - Convert to CamelCase Title without spaces: "home page" -> "HomePage"
 * Returns: { displayName, key }
 */
function normalizeModuleName(raw) {
  const input = String(raw ?? "");

  // 1) trim
  const trimmed = input.trim();
  if (!trimmed) {
    return { error: "Module name cannot be empty or whitespace-only." };
  }

  // 2) must contain at least one letter
  if (!/[A-Za-z]/.test(trimmed)) {
    return { error: "Module name must contain at least one letter (A–Z)." };
  }

  // 3) reject numbers anywhere
  if (/\d/.test(trimmed)) {
    return { error: "Module name cannot contain numbers." };
  }

  // 4) reject any special characters anywhere (allow only letters and spaces)
  //    This blocks: _, -, ., /, @, #, etc.
  if (/[^A-Za-z\s]/.test(trimmed)) {
    return { error: "Module name cannot contain special characters." };
  }

  // 5) normalize internal spaces (multiple -> single)
  const collapsed = trimmed.replace(/\s+/g, " ");

  // 6) split words and convert to CamelCase (TitleCase each word, join without spaces)
  const words = collapsed.split(" ").filter(Boolean);

  const displayName = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");

  // 7) enforce max length (final stored name)
  if (displayName.length > 100) {
    return { error: "Module name cannot be more than 100 characters." };
  }

  // Key for dedupe: lowercase (already no spaces), also cap length for safety
  const key = displayName.toLowerCase().slice(0, 200);

  return { displayName, key };
}

/* ----------------------------- Schema ----------------------------- */

const moduleSchema = new mongoose.Schema(
  {
    // Stored as normalized CamelCase like "HomePage"
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },

    // Normalized key for dedupe (within a project)
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

// Enforce uniqueness *within a project* for the normalized key
moduleSchema.index({ project: 1, key: 1 }, { unique: true });

/* ---------------------- Validation + normalization ---------------------- */

// Normalize on validate (covers create + update)
moduleSchema.pre("validate", function (next) {
  try {
    // Only normalize when name is set/modified
    if (!this.isModified("name")) return next();

    const { displayName, key, error } = normalizeModuleName(this.name);

    if (error) {
      // Make it a Mongoose validation error
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
