// const mongoose = require("mongoose");

// /* ------------------------ Normalization helpers ------------------------ */

// /**
//  * Convert input to PascalCase safely.
//  *
//  * Examples:
//  * - "home page" -> "HomePage"
//  * - "Home Page" -> "HomePage"
//  * - "home-page" -> "HomePage"
//  * - "home_page" -> "HomePage"
//  * - "HomePage" -> "HomePage"
//  * - "mainSectionPage" -> "MainSectionPage"
//  */
// function toPascalCase(raw = "") {
//   const cleaned = String(raw)
//     .trim()
//     .replace(/([a-z])([A-Z])/g, "$1 $2")
//     .replace(/[_-]+/g, " ")
//     .replace(/\s+/g, " ");

//   return cleaned
//     .split(" ")
//     .filter(Boolean)
//     .map((word) => {
//       const lower = word.toLowerCase();
//       return lower.charAt(0).toUpperCase() + lower.slice(1);
//     })
//     .join("");
// }

// /**
//  * Normalize and validate module names.
//  *
//  * Rules:
//  * - Cannot be empty or whitespace-only
//  * - Must contain at least one letter
//  * - Cannot contain numbers anywhere
//  * - Cannot contain special characters anywhere
//  * - Allows only letters, spaces, underscores, hyphens in raw input
//  * - Leading/trailing spaces are trimmed
//  * - Multiple internal spaces are collapsed
//  * - Stored value becomes PascalCase without spaces
//  *
//  * Returns:
//  *   { displayName, key }
//  * or
//  *   { error }
//  */
// function normalizeModuleName(raw) {
//   const input = String(raw ?? "");
//   const trimmed = input.trim();

//   if (!trimmed) {
//     return { error: "Module name cannot be empty or whitespace-only." };
//   }

//   if (!/[A-Za-z]/.test(trimmed)) {
//     return { error: "Module name must contain at least one letter (A–Z)." };
//   }

//   if (/\d/.test(trimmed)) {
//     return { error: "Module name cannot contain numbers." };
//   }

//   // allow letters, spaces, _ and -
//   if (/[^A-Za-z\s_-]/.test(trimmed)) {
//     return { error: "Module name cannot contain special characters." };
//   }

//   const displayName = toPascalCase(trimmed);

//   if (!displayName) {
//     return { error: "Module name cannot be empty." };
//   }

//   if (displayName.length > 100) {
//     return { error: "Module name cannot be more than 100 characters." };
//   }

//   const key = displayName.toLowerCase().slice(0, 200);

//   return { displayName, key };
// }

// /* ----------------------------- Schema ----------------------------- */

// const moduleSchema = new mongoose.Schema(
//   {
//     // Stored normalized value, e.g. "HomePage"
//     name: {
//       type: String,
//       required: true,
//       maxlength: 100,
//       trim: true,
//     },

//     // Lowercase dedupe key within a project, e.g. "homepage"
//     key: {
//       type: String,
//       required: true,
//       maxlength: 200,
//       index: true,
//     },

//     project: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//       immutable: true,
//       index: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       immutable: true,
//       index: true,
//     },
//   },
//   { timestamps: true },
// );

// // Unique per project after normalization
// moduleSchema.index({ project: 1, key: 1 }, { unique: true });

// /* ---------------------- Validation + normalization ---------------------- */

// moduleSchema.pre("validate", function (next) {
//   try {
//     if (!this.isModified("name")) return next();

//     const { displayName, key, error } = normalizeModuleName(this.name);

//     if (error) {
//       this.invalidate("name", error);
//       return next();
//     }

//     this.name = displayName;
//     this.key = key;

//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });

// module.exports = mongoose.model("Module", moduleSchema);

// old code

const mongoose = require("mongoose");

/* ------------------------ constants ------------------------ */

const MAX_MODULE_NAME_LENGTH = 100;
const MAX_MODULE_KEY_LENGTH = 200;

/* ------------------------ normalization helpers ------------------------ */

function normalizeUnicodeText(value = "") {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-");
}

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
  const cleaned = normalizeUnicodeText(raw)
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
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
  const input = normalizeUnicodeText(raw);
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

  // allow only letters, spaces, underscores, hyphens
  if (/[^A-Za-z\s_-]/.test(trimmed)) {
    return { error: "Module name cannot contain special characters." };
  }

  const displayName = toPascalCase(trimmed);

  if (!displayName) {
    return { error: "Module name cannot be empty." };
  }

  if (displayName.length > MAX_MODULE_NAME_LENGTH) {
    return {
      error: `Module name cannot be more than ${MAX_MODULE_NAME_LENGTH} characters.`,
    };
  }

  const key = displayName.toLowerCase().slice(0, MAX_MODULE_KEY_LENGTH);

  return { displayName, key };
}

/* ----------------------------- schema ----------------------------- */

const moduleSchema = new mongoose.Schema(
  {
    // Stored normalized value, e.g. "HomePage"
    name: {
      type: String,
      required: [true, "Module name is required."],
      maxlength: MAX_MODULE_NAME_LENGTH,
      trim: true,
    },

    // Lowercase dedupe key within a project, e.g. "homepage"
    key: {
      type: String,
      required: true,
      maxlength: MAX_MODULE_KEY_LENGTH,
      trim: true,
      index: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required."],
      immutable: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required."],
      immutable: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collation: { locale: "en", strength: 2 },
  },
);

/* ----------------------------- indexes ----------------------------- */

// Unique per project after normalization
moduleSchema.index(
  { project: 1, key: 1 },
  {
    unique: true,
    name: "project_1_key_1",
  },
);

// Helpful lookups
moduleSchema.index({ project: 1, name: 1 }, { name: "project_1_name_1" });
moduleSchema.index({ createdAt: -1 }, { name: "createdAt_desc" });

/* ---------------------- validation + normalization ---------------------- */

moduleSchema.pre("validate", function (next) {
  try {
    if (typeof this.name === "string") {
      this.name = this.name.trim().replace(/\s+/g, " ");
    }

    if (!this.isModified("name")) {
      if (typeof this.key === "string") {
        this.key = this.key.trim();
      }
      return next();
    }

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

moduleSchema.pre("save", function (next) {
  try {
    if (typeof this.name === "string") {
      this.name = this.name.trim();
    }

    if (typeof this.key === "string") {
      this.key = this.key.trim();
    }

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("Module", moduleSchema);
