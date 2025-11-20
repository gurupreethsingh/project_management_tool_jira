// api/models/AiTutorInteractionModel.js

const mongoose = require("mongoose");
const crypto = require("crypto");
const { Schema, Types } = mongoose;

// Keep status & content types aligned with UiGen / DashboardGen / ExamGen
const STATUS = Object.freeze(["ok", "low_confidence", "retrieval", "error"]);
const CHANNEL = Object.freeze(["web", "mobile", "api", "widget"]);
const CONTENT_TYPE = Object.freeze(["text", "html", "markdown"]);

const RequestSchema = new Schema(
  {
    task: { type: String, required: true, trim: true },
    language: { type: String, trim: true, default: "en" },
    tags: [{ type: String, trim: true }],
  },
  { _id: false }
);

const ResponseSchema = new Schema(
  {
    // For AI tutor we store plain text explanation / answer
    answer: { type: String, default: "" },

    contentType: {
      type: String,
      enum: CONTENT_TYPE,
      default: "text", // tutor answer is plain text by default
    },
    status: {
      type: String,
      enum: STATUS,
      default: "ok",
      index: true,
    },
    source: { type: String, trim: true }, // model | retrieval | fallback | api
    confidence: { type: Number, min: 0, max: 1 },
    copyRatio: { type: Number, min: 0, max: 1 },
    model: { type: String, trim: true },
    modelVersion: { type: String, trim: true },
    errorCode: { type: String, trim: true },
    errorMessage: { type: String, trim: true },
    latencyMs: { type: Number, min: 0 },
  },
  { _id: false }
);

const MetaSchema = new Schema(
  {
    sessionId: { type: String, index: true },
    channel: {
      type: String,
      enum: CHANNEL,
      default: "widget",
      index: true,
    },
    pageUrl: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    ipHash: { type: String, index: true },
  },
  { _id: false }
);

const AiTutorInteractionSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    isAuthenticated: { type: Boolean, default: false },

    request: { type: RequestSchema, required: true },

    response: {
      type: ResponseSchema,
      default: () => ({}),
    },

    askedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    respondedAt: { type: Date },

    // duplicate of response.latencyMs for convenience
    responseTimeMs: { type: Number, min: 0 },

    meta: {
      type: MetaSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    collection: "ai_tutor_interactions",
  }
);

// Auto-calc respondedAt / latency if missing
AiTutorInteractionSchema.pre("save", function (next) {
  try {
    if (this.response && this.response.answer && !this.respondedAt) {
      this.respondedAt = new Date();
    }

    const start = this.askedAt ? new Date(this.askedAt).getTime() : null;
    const end = this.respondedAt ? new Date(this.respondedAt).getTime() : null;

    if (start && end && end >= start) {
      const latency = end - start;
      if (!this.response.latencyMs) {
        this.response.latencyMs = latency;
      }
      if (typeof this.responseTimeMs !== "number") {
        this.responseTimeMs = latency;
      }
    }

    next();
  } catch (e) {
    next(e);
  }
});

// Hash IP exactly like UiGen/DashboardGen/ExamGen, but with its own salt key
AiTutorInteractionSchema.statics.hashIp = function (ip) {
  if (!ip) return undefined;
  const salt = process.env.AITUTOR_IP_SALT || "rotate-this-aitutor-salt";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex");
};

const AiTutorInteraction = mongoose.model(
  "AiTutorInteraction",
  AiTutorInteractionSchema
);

module.exports = {
  AiTutorInteraction,
  STATUS,
  CHANNEL,
  CONTENT_TYPE,
};
