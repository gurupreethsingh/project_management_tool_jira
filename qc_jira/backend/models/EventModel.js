// models/EventModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ---------- Sub-docs ---------- */

// Organizers (people responsible for the event)
const OrganizerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true }, // link to User if exists
    name: { type: String, trim: true },   // fallback display name
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    role: { type: String, trim: true },   // e.g., host, speaker, coordinator
  },
  { _id: false }
);

// Location (physical/virtual/hybrid)
const LocationSchema = new Schema(
  {
    kind: { type: String, enum: ["physical", "virtual", "hybrid"], default: "physical" },
    // physical
    venue: { type: String, trim: true },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pincode: { type: String, trim: true },
    // virtual
    meetingUrl: { type: String, trim: true },
    meetingPassword: { type: String, trim: true },
  },
  { _id: false }
);

// Registration window & capacity
const RegistrationSchema = new Schema(
  {
    isRequired: { type: Boolean, default: false, index: true },
    opensAt: Date,
    closesAt: Date,
    capacity: { type: Number, min: 0 },
    waitlistEnabled: { type: Boolean, default: false },
  },
  { _id: false }
);

// Reminder rules (cron/worker can read these)
const ReminderSchema = new Schema(
  {
    minutesBeforeStart: { type: Number, min: 0, index: true }, // e.g. 1440 => 24h
    channel: { type: String, enum: ["inapp", "email", "sms", "webhook"], default: "inapp" },
    templateKey: { type: String, trim: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

// Attachments (brochure/agenda/etc.)
const AttachmentSchema = new Schema(
  {
    label: { type: String, trim: true },
    url: { type: String, trim: true }, // or disk path
    mime: { type: String, trim: true },
    sizeBytes: { type: Number, min: 0 },
  },
  { _id: false }
);

// Audit for reschedules/restarts
const ScheduleAuditSchema = new Schema(
  {
    action: { type: String, enum: ["reschedule", "restart"], required: true },
    previousStart: Date,
    previousEnd: Date,
    newStart: Date,
    newEnd: Date,
    reason: { type: String, trim: true },
    byUser: { type: Schema.Types.ObjectId, ref: "User", index: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

/* ---------- Audience (mirrors your notification pattern) ---------- */
/**
 * audience.mode: how recipients are determined
 *   - "all"   => everyone
 *   - "roles" => any user whose role is in audience.roles
 *   - "users" => only specific user ids in audience.users
 * You can combine roles + users in the same doc if you want flexible targeting.
 */
const AudienceSchema = new Schema(
  {
    mode: {
      type: String,
      enum: ["all", "roles", "users"],
      required: true,
      default: "all",
    },
    roles: [{ type: String, lowercase: true, trim: true }],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false }
);


/* ---------- Main Event schema ---------- */
const EventSchema = new Schema(
  {
    // Core
    title: { type: String, required: true, trim: true, index: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },

    organizers: [OrganizerSchema],

    // Time
    startTime: { type: Date, required: true, index: true },
    endTime:   { type: Date, required: true, index: true },

    // Status lifecycle
    status: {
      type: String,
      enum: ["draft", "scheduled", "live", "completed", "cancelled", "postponed"],
      default: "draft",
      index: true,
    },

    // Audience targeting (all / roles / users)
    audience: {
      type: AudienceSchema,
      default: () => ({ mode: "all", roles: [], users: [] }),
    },

    // Optional recurrence (RFC 5545 RRULE)
    recurrenceRule: { type: String, trim: true },    // e.g. "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
    recurrenceEndsAt: Date,

    // Where
    location: LocationSchema,

    // Registration
    registration: RegistrationSchema,

    // Reminders
    reminders: [ReminderSchema],

    // Tags / categories
    tags: [{ type: String, trim: true, index: true }],

    // Media
    coverImageUrl: { type: String, trim: true },
    attachments: [AttachmentSchema],

    // Scheduling audit
    scheduleHistory: [ScheduleAuditSchema],

    // Soft flags
    isDeleted: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },

    // Ownership
    createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },

    // Optional linking
    relatedEntity: { type: Schema.Types.ObjectId, refPath: "entityModel" },
    entityModel: { type: String, enum: ["Project", "Task", "Bug", "Scenario", "Course", "User"] },
  },
  { timestamps: true }
);

/* ---------- Indexes ---------- */
EventSchema.index({ title: "text", description: "text", tags: 1 });
EventSchema.index({ startTime: 1, endTime: 1, status: 1 });
EventSchema.index({ "audience.mode": 1 });
EventSchema.index({ "audience.roles": 1 });
EventSchema.index({ "audience.users": 1 });
EventSchema.index({ isDeleted: 1, isPublished: 1 });
EventSchema.index({ createdAt: -1 });

/* ---------- Virtuals ---------- */
EventSchema.virtual("isOngoing").get(function () {
  const now = new Date();
  return this.status === "live" || (this.startTime <= now && now <= this.endTime);
});

/* ---------- Helpers / Hooks ---------- */

// Normalize roles to lowercase
function normalizeRoles(doc) {
  if (doc?.audience?.roles?.length) {
    doc.audience.roles = doc.audience.roles.map(r => String(r || "").trim().toLowerCase());
  }
}
EventSchema.pre("save", function (next) { normalizeRoles(this); next(); });
EventSchema.pre("findOneAndUpdate", function (next) {
  const upd = this.getUpdate() || {};
  if (upd.audience?.roles) {
    upd.audience.roles = upd.audience.roles.map(r => String(r || "").trim().toLowerCase());
    this.setUpdate(upd);
  }
  next();
});

/**
 * Build a Mongo filter for events visible to a given user.
 * @param {{ userId: string|ObjectId, role?: string }} ctx
 * @returns {object} MongoDB $or filter
 */
EventSchema.statics.buildAudienceFilter = function (ctx = {}) {
  const uId = ctx.userId ? new mongoose.Types.ObjectId(ctx.userId) : null;
  const role = (ctx.role || "").toLowerCase();

  const or = [{ "audience.mode": "all" }];

  if (role) {
    or.push({
      $and: [
        { "audience.mode": { $in: ["roles", "users"] } },
        { "audience.roles": role },
      ],
    });
  }

  if (uId) {
    or.push({
      $and: [
        { "audience.mode": { $in: ["users", "roles"] } },
        { "audience.users": uId },
      ],
    });
  }

  return { $or: or, isDeleted: false, isPublished: true };
};

/* ---------- Methods for schedule changes ---------- */

EventSchema.methods.reschedule = function ({ newStart, newEnd, reason, byUser }) {
  const entry = {
    action: "reschedule",
    previousStart: this.startTime,
    previousEnd: this.endTime,
    newStart,
    newEnd,
    reason,
    byUser,
    at: new Date(),
  };
  this.startTime = newStart;
  this.endTime = newEnd;
  this.status = "scheduled";
  this.scheduleHistory.push(entry);
  return this.save();
};

EventSchema.methods.restart = function ({ newStart, newEnd, reason, byUser }) {
  const entry = {
    action: "restart",
    previousStart: this.startTime,
    previousEnd: this.endTime,
    newStart,
    newEnd,
    reason,
    byUser,
    at: new Date(),
  };
  this.startTime = newStart;
  this.endTime = newEnd;
  this.status = "live";
  this.scheduleHistory.push(entry);
  return this.save();
};

EventSchema.methods.cancel = function ({ reason, byUser }) {
  this.status = "cancelled";
  this.scheduleHistory.push({
    action: "reschedule",
    previousStart: this.startTime,
    previousEnd: this.endTime,
    newStart: this.startTime,
    newEnd: this.endTime,
    reason: `Cancelled: ${reason || ""}`.trim(),
    byUser,
    at: new Date(),
  });
  return this.save();
};

EventSchema.methods.postpone = function ({ newStart, newEnd, reason, byUser }) {
  return this.reschedule({
    newStart,
    newEnd,
    reason: `Postponed: ${reason || ""}`.trim(),
    byUser,
  });
};

module.exports = mongoose.model("Event", EventSchema);
