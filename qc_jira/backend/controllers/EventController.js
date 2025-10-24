// controllers/EventController.js
const mongoose = require("mongoose");
const Event = require("../models/EventModel");

// ---------------------- helpers ----------------------
const toObjectId = (v) => {
  try {
    return new mongoose.Types.ObjectId(String(v));
  } catch {
    return null;
  }
};

const bool = (v, def = false) => {
  if (v === undefined || v === null || v === "") return def;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  return ["1", "true", "yes", "y", "on"].includes(s);
};

const parseSort = (s, def = "-startTime") => {
  // supports: "startTime", "-createdAt", "status,-startTime"
  if (!s) return def;
  const parts = String(s)
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return def;
  const sort = {};
  parts.forEach((p) => {
    if (p.startsWith("-")) sort[p.slice(1)] = -1;
    else sort[p] = 1;
  });
  return sort;
};

const pick = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});

// Build filter from querystring
function buildQueryFilter(q = {}) {
  const f = { isDeleted: false }; // default hide deleted

  // visibility toggles (optional)
  if (q.isDeleted !== undefined) f.isDeleted = bool(q.isDeleted);
  if (q.isPublished !== undefined) f.isPublished = bool(q.isPublished);

  // status
  if (q.status) {
    const arr = String(q.status)
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (arr.length) f.status = { $in: arr };
  }

  // time windows
  const time = {};
  if (q.startGte) time.$gte = new Date(q.startGte);
  if (q.startLte) time.$lte = new Date(q.startLte);
  if (Object.keys(time).length) f.startTime = time;

  const end = {};
  if (q.endGte) end.$gte = new Date(q.endGte);
  if (q.endLte) end.$lte = new Date(q.endLte);
  if (Object.keys(end).length) f.endTime = end;

  // tags (any-match)
  if (q.tags) {
    const tags = String(q.tags)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (tags.length) f.tags = { $in: tags };
  }

  // audience-based filtering (explicit)
  if (q.audienceMode) f["audience.mode"] = String(q.audienceMode).toLowerCase();
  if (q.audienceRole)
    f["audience.roles"] = String(q.audienceRole).toLowerCase();

  if (q.audienceUserId) {
    const u = toObjectId(q.audienceUserId);
    if (u) f["audience.users"] = u;
  }

  // organizers
  if (q.organizerUserId) {
    const ou = toObjectId(q.organizerUserId);
    if (ou) f["organizers.user"] = ou;
  }

  // entity link
  if (q.entityModel) f.entityModel = String(q.entityModel);
  if (q.entityId) {
    const e = toObjectId(q.entityId);
    if (e) f.relatedEntity = e;
  }

  // text search (title/description via text index)
  if (q.q) {
    f.$text = { $search: String(q.q) };
  }

  return f;
}

// Expand projection for text score sorting if searching
function buildProjection(q = {}) {
  const proj = {};
  if (q.q) proj.score = { $meta: "textScore" };
  return proj;
}

function buildSort(q = {}) {
  if (q.q && !q.sort) {
    // Prefer textScore when searching
    return { score: { $meta: "textScore" }, startTime: 1 };
  }
  return parseSort(q.sort);
}

// Common populate options
const POP = [
  { path: "organizers.user", select: "name email role" },
  { path: "createdBy", select: "name email role" },
  { path: "updatedBy", select: "name email role" },
];

// ---------------------- CRUD ----------------------
exports.createEvent = async (req, res) => {
  try {
    const body = req.body || {};
    const payload = pick(body, [
      "title",
      "subtitle",
      "description",
      "startTime",
      "endTime",
      "status",
      "audience",
      "recurrenceRule",
      "recurrenceEndsAt",
      "location",
      "registration",
      "reminders",
      "tags",
      "coverImageUrl",
      "attachments",
      "isPublished",
      "relatedEntity",
      "entityModel",
    ]);

    // organizers can be sent as [{user, name, email, phone, role}]
    if (Array.isArray(body.organizers)) payload.organizers = body.organizers;

    // ownership
    payload.createdBy =
      (req.user && req.user.id) || body.createdBy || undefined;
    payload.updatedBy = payload.createdBy;

    const doc = await Event.create(payload);
    const out = await Event.findById(doc._id).populate(POP);
    return res.status(201).json({ message: "Event created", data: out });
  } catch (err) {
    console.error("createEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to create event", details: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id).populate(POP);
    if (!event) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json(event);
  } catch (err) {
    console.error("getEventById error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch event", details: err.message });
  }
};

// Rich list with filtering / sorting / pagination
exports.listEvents = async (req, res) => {
  try {
    const q = req.query || {};
    const page = Math.max(parseInt(q.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(q.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = buildQueryFilter(q);
    const proj = buildProjection(q);
    const sort = buildSort(q);

    const [rows, total] = await Promise.all([
      Event.find(filter, proj).populate(POP).sort(sort).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    return res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: rows,
    });
  } catch (err) {
    console.error("listEvents error:", err);
    return res
      .status(500)
      .json({ error: "Failed to list events", details: err.message });
  }
};

// Events visible to a specific user (leverages model static)
exports.listVisibleToMe = async (req, res) => {
  try {
    const q = req.query || {};
    const page = Math.max(parseInt(q.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(q.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const ctx = {
      userId: (req.user && req.user.id) || q.userId,
      role: (req.user && req.user.role) || q.role,
    };

    const visibilityFilter = Event.buildAudienceFilter(ctx);

    // Allow additional query filters layered on top
    const extra = buildQueryFilter(q);
    const filter = { ...visibilityFilter, ...extra };

    const sort = buildSort(q);
    const [rows, total] = await Promise.all([
      Event.find(filter).populate(POP).sort(sort).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    return res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: rows,
    });
  } catch (err) {
    console.error("listVisibleToMe error:", err);
    return res
      .status(500)
      .json({ error: "Failed to list visible events", details: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};

    const fields = pick(body, [
      "title",
      "subtitle",
      "description",
      "startTime",
      "endTime",
      "status",
      "audience",
      "recurrenceRule",
      "recurrenceEndsAt",
      "location",
      "registration",
      "reminders",
      "tags",
      "coverImageUrl",
      "attachments",
      "isPublished",
      "relatedEntity",
      "entityModel",
      "organizers",
    ]);
    fields.updatedBy = (req.user && req.user.id) || body.updatedBy || undefined;

    const updated = await Event.findByIdAndUpdate(id, fields, {
      new: true,
      runValidators: true,
    }).populate(POP);

    if (!updated) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Event updated", data: updated });
  } catch (err) {
    console.error("updateEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to update event", details: err.message });
  }
};

// Soft delete
exports.softDeleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Event.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedBy: (req.user && req.user.id) || undefined },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Event not found" });
    return res
      .status(200)
      .json({ message: "Event deleted (soft)", data: updated });
  } catch (err) {
    console.error("softDeleteEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to delete event", details: err.message });
  }
};

// Restore from soft delete
exports.restoreEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Event.findByIdAndUpdate(
      id,
      { isDeleted: false, updatedBy: (req.user && req.user.id) || undefined },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Event restored", data: updated });
  } catch (err) {
    console.error("restoreEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to restore event", details: err.message });
  }
};

// Hard delete
exports.hardDeleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await Event.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Event deleted (hard)" });
  } catch (err) {
    console.error("hardDeleteEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to delete event", details: err.message });
  }
};

// ---------------------- status actions ----------------------
exports.publishEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        isPublished: true,
        status: "scheduled",
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    ).populate(POP);
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Event published", data: upd });
  } catch (err) {
    console.error("publishEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to publish event", details: err.message });
  }
};

exports.unpublishEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const upd = await Event.findByIdAndUpdate(
      id,
      { isPublished: false, updatedBy: (req.user && req.user.id) || undefined },
      { new: true }
    ).populate(POP);
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Event unpublished", data: upd });
  } catch (err) {
    console.error("unpublishEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to unpublish event", details: err.message });
  }
};

exports.rescheduleEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const { newStart, newEnd, reason } = req.body || {};
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    const out = await ev.reschedule({
      newStart: new Date(newStart),
      newEnd: new Date(newEnd),
      reason,
      byUser: (req.user && req.user.id) || undefined,
    });
    return res.status(200).json({ message: "Event rescheduled", data: out });
  } catch (err) {
    console.error("rescheduleEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to reschedule event", details: err.message });
  }
};

exports.restartEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const { newStart, newEnd, reason } = req.body || {};
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    const out = await ev.restart({
      newStart: new Date(newStart),
      newEnd: new Date(newEnd),
      reason,
      byUser: (req.user && req.user.id) || undefined,
    });
    return res.status(200).json({ message: "Event restarted", data: out });
  } catch (err) {
    console.error("restartEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to restart event", details: err.message });
  }
};

exports.cancelEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body || {};
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    const out = await ev.cancel({
      reason,
      byUser: (req.user && req.user.id) || undefined,
    });
    return res.status(200).json({ message: "Event cancelled", data: out });
  } catch (err) {
    console.error("cancelEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to cancel event", details: err.message });
  }
};

exports.postponeEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const { newStart, newEnd, reason } = req.body || {};
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    const out = await ev.postpone({
      newStart: new Date(newStart),
      newEnd: new Date(newEnd),
      reason,
      byUser: (req.user && req.user.id) || undefined,
    });
    return res.status(200).json({ message: "Event postponed", data: out });
  } catch (err) {
    console.error("postponeEvent error:", err);
    return res
      .status(500)
      .json({ error: "Failed to postpone event", details: err.message });
  }
};

// ---------------------- audience & details helpers ----------------------
exports.setAudienceMode = async (req, res) => {
  try {
    const id = req.params.id;
    const { mode } = req.body || {};
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        "audience.mode": mode,
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true, runValidators: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res
      .status(200)
      .json({ message: "Audience mode updated", data: upd });
  } catch (err) {
    console.error("setAudienceMode error:", err);
    return res
      .status(500)
      .json({ error: "Failed to set audience mode", details: err.message });
  }
};

exports.addAudienceRoles = async (req, res) => {
  try {
    const id = req.params.id;
    const roles = (req.body.roles || []).map((r) =>
      String(r || "")
        .trim()
        .toLowerCase()
    );
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        $addToSet: { "audience.roles": { $each: roles } },
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Roles added", data: upd });
  } catch (err) {
    console.error("addAudienceRoles error:", err);
    return res
      .status(500)
      .json({ error: "Failed to add roles", details: err.message });
  }
};

exports.removeAudienceRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = String(req.body.role || "")
      .trim()
      .toLowerCase();
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        $pull: { "audience.roles": role },
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Role removed", data: upd });
  } catch (err) {
    console.error("removeAudienceRole error:", err);
    return res
      .status(500)
      .json({ error: "Failed to remove role", details: err.message });
  }
};

exports.addAudienceUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const users = (req.body.users || []).map(toObjectId).filter(Boolean);
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        $addToSet: { "audience.users": { $each: users } },
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Users added", data: upd });
  } catch (err) {
    console.error("addAudienceUsers error:", err);
    return res
      .status(500)
      .json({ error: "Failed to add users", details: err.message });
  }
};

exports.removeAudienceUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = toObjectId(req.body.userId);
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        $pull: { "audience.users": userId },
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "User removed", data: upd });
  } catch (err) {
    console.error("removeAudienceUser error:", err);
    return res
      .status(500)
      .json({ error: "Failed to remove user", details: err.message });
  }
};

exports.addReminder = async (req, res) => {
  try {
    const id = req.params.id;
    const reminder = pick(req.body || {}, [
      "minutesBeforeStart",
      "channel",
      "templateKey",
      "enabled",
    ]);
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        $push: { reminders: reminder },
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Reminder added", data: upd });
  } catch (err) {
    console.error("addReminder error:", err);
    return res
      .status(500)
      .json({ error: "Failed to add reminder", details: err.message });
  }
};

exports.removeReminder = async (req, res) => {
  try {
    const id = req.params.id;
    const idx = parseInt(req.body.index, 10);
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    if (!Array.isArray(ev.reminders) || idx < 0 || idx >= ev.reminders.length) {
      return res.status(400).json({ error: "Invalid reminder index" });
    }
    ev.reminders.splice(idx, 1);
    ev.updatedBy = (req.user && req.user.id) || undefined;
    const out = await ev.save();
    return res.status(200).json({ message: "Reminder removed", data: out });
  } catch (err) {
    console.error("removeReminder error:", err);
    return res
      .status(500)
      .json({ error: "Failed to remove reminder", details: err.message });
  }
};

exports.addAttachment = async (req, res) => {
  try {
    const id = req.params.id;
    const attachment = pick(req.body || {}, [
      "label",
      "url",
      "mime",
      "sizeBytes",
    ]);
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        $push: { attachments: attachment },
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Attachment added", data: upd });
  } catch (err) {
    console.error("addAttachment error:", err);
    return res
      .status(500)
      .json({ error: "Failed to add attachment", details: err.message });
  }
};

exports.removeAttachment = async (req, res) => {
  try {
    const id = req.params.id;
    const idx = parseInt(req.body.index, 10);
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    if (
      !Array.isArray(ev.attachments) ||
      idx < 0 ||
      idx >= ev.attachments.length
    ) {
      return res.status(400).json({ error: "Invalid attachment index" });
    }
    ev.attachments.splice(idx, 1);
    ev.updatedBy = (req.user && req.user.id) || undefined;
    const out = await ev.save();
    return res.status(200).json({ message: "Attachment removed", data: out });
  } catch (err) {
    console.error("removeAttachment error:", err);
    return res
      .status(500)
      .json({ error: "Failed to remove attachment", details: err.message });
  }
};

exports.addTag = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = String(req.body.tag || "").trim();
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        $addToSet: { tags: tag },
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Tag added", data: upd });
  } catch (err) {
    console.error("addTag error:", err);
    return res
      .status(500)
      .json({ error: "Failed to add tag", details: err.message });
  }
};

exports.removeTag = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = String(req.body.tag || "").trim();
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        $pull: { tags: tag },
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    );
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Tag removed", data: upd });
  } catch (err) {
    console.error("removeTag error:", err);
    return res
      .status(500)
      .json({ error: "Failed to remove tag", details: err.message });
  }
};

// ---------------------- transfers ----------------------
exports.transferOwnership = async (req, res) => {
  try {
    const id = req.params.id;
    const newOwner = toObjectId(req.body.userId);
    if (!newOwner) return res.status(400).json({ error: "Invalid userId" });

    const upd = await Event.findByIdAndUpdate(
      id,
      {
        createdBy: newOwner,
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    ).populate(POP);

    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res
      .status(200)
      .json({ message: "Ownership transferred", data: upd });
  } catch (err) {
    console.error("transferOwnership error:", err);
    return res
      .status(500)
      .json({ error: "Failed to transfer ownership", details: err.message });
  }
};

exports.transferToEntity = async (req, res) => {
  try {
    const id = req.params.id;
    const entityModel = String(req.body.entityModel || "");
    const entityId = toObjectId(req.body.entityId);
    if (!entityModel || !entityId) {
      return res.status(400).json({ error: "Invalid entityModel/entityId" });
    }
    const upd = await Event.findByIdAndUpdate(
      id,
      {
        entityModel,
        relatedEntity: entityId,
        updatedBy: (req.user && req.user.id) || undefined,
      },
      { new: true }
    ).populate(POP);

    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res
      .status(200)
      .json({ message: "Event linked to entity", data: upd });
  } catch (err) {
    console.error("transferToEntity error:", err);
    return res
      .status(500)
      .json({
        error: "Failed to transfer event to entity",
        details: err.message,
      });
  }
};

exports.replaceOrganizers = async (req, res) => {
  try {
    const id = req.params.id;
    const organizers = Array.isArray(req.body.organizers)
      ? req.body.organizers
      : [];
    const upd = await Event.findByIdAndUpdate(
      id,
      { organizers, updatedBy: (req.user && req.user.id) || undefined },
      { new: true }
    ).populate(POP);
    if (!upd) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Organizers replaced", data: upd });
  } catch (err) {
    console.error("replaceOrganizers error:", err);
    return res
      .status(500)
      .json({ error: "Failed to replace organizers", details: err.message });
  }
};

// ---------------------- bulk operations ----------------------
exports.bulkPublish = async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(toObjectId).filter(Boolean);
    const r = await Event.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          isPublished: true,
          status: "scheduled",
          updatedBy: (req.user && req.user.id) || undefined,
        },
      }
    );
    return res
      .status(200)
      .json({
        message: "Bulk publish done",
        matched: r.matchedCount,
        modified: r.modifiedCount,
      });
  } catch (err) {
    console.error("bulkPublish error:", err);
    return res
      .status(500)
      .json({ error: "Bulk publish failed", details: err.message });
  }
};

exports.bulkUnpublish = async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(toObjectId).filter(Boolean);
    const r = await Event.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          isPublished: false,
          updatedBy: (req.user && req.user.id) || undefined,
        },
      }
    );
    return res
      .status(200)
      .json({
        message: "Bulk unpublish done",
        matched: r.matchedCount,
        modified: r.modifiedCount,
      });
  } catch (err) {
    console.error("bulkUnpublish error:", err);
    return res
      .status(500)
      .json({ error: "Bulk unpublish failed", details: err.message });
  }
};

exports.bulkSoftDelete = async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(toObjectId).filter(Boolean);
    const r = await Event.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          isDeleted: true,
          updatedBy: (req.user && req.user.id) || undefined,
        },
      }
    );
    return res
      .status(200)
      .json({
        message: "Bulk soft delete done",
        matched: r.matchedCount,
        modified: r.modifiedCount,
      });
  } catch (err) {
    console.error("bulkSoftDelete error:", err);
    return res
      .status(500)
      .json({ error: "Bulk soft delete failed", details: err.message });
  }
};

exports.bulkRestore = async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(toObjectId).filter(Boolean);
    const r = await Event.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          isDeleted: false,
          updatedBy: (req.user && req.user.id) || undefined,
        },
      }
    );
    return res
      .status(200)
      .json({
        message: "Bulk restore done",
        matched: r.matchedCount,
        modified: r.modifiedCount,
      });
  } catch (err) {
    console.error("bulkRestore error:", err);
    return res
      .status(500)
      .json({ error: "Bulk restore failed", details: err.message });
  }
};

exports.bulkHardDelete = async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(toObjectId).filter(Boolean);
    const r = await Event.deleteMany({ _id: { $in: ids } });
    return res
      .status(200)
      .json({ message: "Bulk hard delete done", deleted: r.deletedCount });
  } catch (err) {
    console.error("bulkHardDelete error:", err);
    return res
      .status(500)
      .json({ error: "Bulk hard delete failed", details: err.message });
  }
};

exports.bulkStatus = async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(toObjectId).filter(Boolean);
    const status = String(req.body.status || "").toLowerCase();
    const r = await Event.updateMany(
      { _id: { $in: ids } },
      { $set: { status, updatedBy: (req.user && req.user.id) || undefined } }
    );
    return res
      .status(200)
      .json({
        message: "Bulk status update done",
        matched: r.matchedCount,
        modified: r.modifiedCount,
      });
  } catch (err) {
    console.error("bulkStatus error:", err);
    return res
      .status(500)
      .json({ error: "Bulk status failed", details: err.message });
  }
};

exports.bulkReschedule = async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(toObjectId).filter(Boolean);
    const { newStart, newEnd, reason } = req.body || {};
    const list = await Event.find({ _id: { $in: ids } });
    let ok = 0;
    for (const ev of list) {
      await ev.reschedule({
        newStart: new Date(newStart),
        newEnd: new Date(newEnd),
        reason,
        byUser: (req.user && req.user.id) || undefined,
      });
      ok++;
    }
    return res
      .status(200)
      .json({ message: "Bulk reschedule done", updated: ok });
  } catch (err) {
    console.error("bulkReschedule error:", err);
    return res
      .status(500)
      .json({ error: "Bulk reschedule failed", details: err.message });
  }
};

exports.bulkTransferOwnership = async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(toObjectId).filter(Boolean);
    const newOwner = toObjectId(req.body.userId);
    if (!newOwner) return res.status(400).json({ error: "Invalid userId" });
    const r = await Event.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          createdBy: newOwner,
          updatedBy: (req.user && req.user.id) || undefined,
        },
      }
    );
    return res
      .status(200)
      .json({
        message: "Bulk ownership transfer done",
        matched: r.matchedCount,
        modified: r.modifiedCount,
      });
  } catch (err) {
    console.error("bulkTransferOwnership error:", err);
    return res
      .status(500)
      .json({ error: "Bulk ownership transfer failed", details: err.message });
  }
};

// ---------------------- counts ----------------------
exports.countAll = async (_req, res) => {
  try {
    const total = await Event.countDocuments();
    const active = await Event.countDocuments({ isDeleted: false });
    const published = await Event.countDocuments({
      isPublished: true,
      isDeleted: false,
    });
    return res.status(200).json({ total, active, published });
  } catch (err) {
    console.error("countAll error:", err);
    return res
      .status(500)
      .json({ error: "Count failed", details: err.message });
  }
};

exports.countByStatus = async (_req, res) => {
  try {
    const agg = await Event.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);
    return res.status(200).json(agg);
  } catch (err) {
    console.error("countByStatus error:", err);
    return res
      .status(500)
      .json({ error: "Count by status failed", details: err.message });
  }
};

exports.countUpcoming = async (_req, res) => {
  try {
    const now = new Date();
    const n = await Event.countDocuments({
      startTime: { $gt: now },
      isDeleted: false,
      isPublished: true,
    });
    return res.status(200).json({ upcoming: n });
  } catch (err) {
    console.error("countUpcoming error:", err);
    return res
      .status(500)
      .json({ error: "Count upcoming failed", details: err.message });
  }
};

exports.countLive = async (_req, res) => {
  try {
    const now = new Date();
    const n = await Event.countDocuments({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: { $in: ["scheduled", "live"] },
      isDeleted: false,
      isPublished: true,
    });
    return res.status(200).json({ live: n });
  } catch (err) {
    console.error("countLive error:", err);
    return res
      .status(500)
      .json({ error: "Count live failed", details: err.message });
  }
};

exports.countByAudienceMode = async (_req, res) => {
  try {
    const agg = await Event.aggregate([
      { $group: { _id: "$audience.mode", count: { $sum: 1 } } },
      { $project: { mode: "$_id", count: 1, _id: 0 } },
    ]);
    return res.status(200).json(agg);
  } catch (err) {
    console.error("countByAudienceMode error:", err);
    return res
      .status(500)
      .json({ error: "Count by audience mode failed", details: err.message });
  }
};

// GET /events/:id/visible?userId=&role=
exports.getVisibleEventForUser = async (req, res) => {
  try {
    const id = req.params.id;
    const ctx = {
      userId: (req.user && req.user.id) || req.query.userId,
      role: (req.user && req.user.role) || req.query.role,
    };

    const vis = Event.buildAudienceFilter(ctx);
    const filter = { ...vis, _id: id };

    const event = await Event.findOne(filter).populate(POP);
    if (!event)
      return res.status(404).json({ error: "Event not found or not visible" });
    return res.status(200).json(event);
  } catch (err) {
    console.error("getVisibleEventForUser error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch event", details: err.message });
  }
};
