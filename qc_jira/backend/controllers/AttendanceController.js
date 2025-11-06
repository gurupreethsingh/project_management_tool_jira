// controllers/AttendanceController.js
const mongoose = require("mongoose");
const Attendance = require("../models/AttendanceModel");

// -----------------------------
// Helpers
// -----------------------------
const asObjectId = (v) => {
  try {
    return v ? new mongoose.Types.ObjectId(String(v)) : null;
  } catch {
    return null;
  }
};

const toDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const dayKeyFromDate = (d) => {
  const x = toDate(d);
  return x ? x.toISOString().slice(0, 10) : null; // UTC YYYY-MM-DD
};

const getActorId = (req) =>
  asObjectId(
    req?.user?._id ||
      req?.user?.id ||
      req?.headers?.["x-actor-id"] ||
      req?.body?.actorId
  );

const like = (s) =>
  s
    ? {
        $regex: String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      }
    : undefined;

const buildQuery = (q = {}) => {
  const and = [];

  if (q.employee) {
    const id = asObjectId(q.employee);
    if (id) and.push({ employee: id });
  }

  if (q.project === "null") {
    and.push({ project: null });
  } else if (q.project) {
    const pid = asObjectId(q.project);
    if (pid) and.push({ project: pid });
  }

  if (q.status) {
    const arr = Array.isArray(q.status)
      ? q.status
      : String(q.status)
          .split(",")
          .map((s) => s.trim().toLowerCase());
    and.push({ status: { $in: arr } });
  }

  const dFrom = q.from ? toDate(q.from) : null;
  const dTo = q.to ? toDate(q.to) : null;
  if (dFrom || dTo) {
    const cond = {};
    if (dFrom) cond.$gte = dFrom;
    if (dTo) cond.$lte = dTo;
    and.push({ date: cond });
  }

  if (q.minHours != null || q.maxHours != null) {
    const cond = {};
    if (q.minHours != null) cond.$gte = Number(q.minHours);
    if (q.maxHours != null) cond.$lte = Number(q.maxHours);
    and.push({ hoursWorked: cond });
  }

  if (q.location) {
    const arr = Array.isArray(q.location)
      ? q.location
      : String(q.location)
          .split(",")
          .map((s) => s.trim());
    and.push({ location: { $in: arr } });
  }

  if (q.shift) {
    const arr = Array.isArray(q.shift)
      ? q.shift
      : String(q.shift)
          .split(",")
          .map((s) => s.trim());
    and.push({ shift: { $in: arr } });
  }

  if (q.isBillable != null) {
    const v = String(q.isBillable).toLowerCase();
    and.push({ isBillable: v === "true" || v === "1" });
  }

  if (q.search) {
    const S = String(q.search).trim();
    const or = [
      { taskDescription: like(S) },
      { remarks: like(S) },
      { dayKey: like(S) },
    ];
    const dkey = dayKeyFromDate(S);
    if (dkey) or.push({ dayKey: dkey });
    const d = toDate(S);
    if (d) or.push({ date: d });
    and.push({ $or: or });
  }

  return and.length ? { $and: and } : {};
};

const SAFE_SELECT =
  "employee project date dayKey hoursWorked taskDescription status submittedAt reviewedAt reviewedBy remarks isBillable location shift modifiedByAdmin createdAt updatedAt statusHistory";

// -----------------------------
// CRUD
// -----------------------------
exports.create = async (req, res) => {
  try {
    const actor = getActorId(req);
    const payload = { ...req.body };
    if (!payload.employee) payload.employee = actor;
    if (!payload.date) payload.date = new Date();
    payload.dayKey = dayKeyFromDate(payload.date);
    const doc = await Attendance.create(payload);
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Create failed" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Attendance.findById(id)
      .select(SAFE_SELECT)
      .populate("employee", "name email role")
      .populate("project", "project_name");
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Fetch failed" });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const actor = getActorId(req);
    const updates = { ...req.body };
    if (updates.status && !updates.reviewedBy) updates.reviewedBy = actor;
    if (updates.date) updates.dayKey = dayKeyFromDate(updates.date);

    const doc = await Attendance.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    Object.assign(doc, updates);
    await doc.save();
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Update failed" });
  }
};

exports.removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Attendance.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ message: "Not found" });
    return res.json({ ok: true, deletedId: id });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Delete failed" });
  }
};

exports.list = async (req, res) => {
  try {
    const q = buildQuery(req.query);
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(
      1,
      Math.min(200, parseInt(req.query.limit || "20", 10))
    );
    const skip = (page - 1) * limit;

    const sortField = req.query.sortBy || "date";
    const sortOrder =
      String(req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder, _id: -1 };

    const [rows, total] = await Promise.all([
      Attendance.find(q)
        .select(SAFE_SELECT)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("employee", "name email role")
        .populate("project", "project_name"),
      Attendance.countDocuments(q),
    ]);

    return res.json({ page, limit, total, rows });
  } catch (e) {
    return res.status(400).json({ message: e.message || "List failed" });
  }
};

// -----------------------------
// Marking / Review
// -----------------------------
exports.markOrUpsertForDay = async (req, res) => {
  try {
    const actor = getActorId(req);
    const {
      employee = actor,
      project = null,
      date = new Date(),
      hoursWorked = 0,
      taskDescription = "",
      remarks = "",
    } = req.body;

    const eId = asObjectId(employee);
    if (!eId) return res.status(400).json({ message: "Invalid employee" });

    const d = toDate(date) || new Date();
    const dKey = dayKeyFromDate(d);

    let doc = await Attendance.findOne({ employee: eId, dayKey: dKey });
    if (!doc) {
      doc = new Attendance({
        employee: eId,
        project: asObjectId(project),
        date: d,
        dayKey: dKey,
        hoursWorked,
        taskDescription,
        status: "marked",
        submittedAt: new Date(),
        remarks,
        reviewedBy: actor,
      });
    } else {
      doc.project = asObjectId(project) || doc.project || null;
      doc.date = d;
      doc.dayKey = dKey;
      doc.hoursWorked = hoursWorked ?? doc.hoursWorked;
      doc.taskDescription = taskDescription ?? doc.taskDescription;
      doc.status = "marked";
      doc.submittedAt = doc.submittedAt || new Date();
      doc.remarks = remarks ?? doc.remarks;
      doc.reviewedBy = actor;
    }

    await doc.save();
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Mark/upsert failed" });
  }
};

exports.unmarkForDay = async (req, res) => {
  try {
    const actor = getActorId(req);
    const { employee = actor, date = new Date(), remarks = "" } = req.body;

    const eId = asObjectId(employee);
    if (!eId) return res.status(400).json({ message: "Invalid employee" });

    const d = toDate(date) || new Date();
    const dKey = dayKeyFromDate(d);

    let doc = await Attendance.findOne({ employee: eId, dayKey: dKey });
    if (!doc) {
      doc = new Attendance({
        employee: eId,
        date: d,
        dayKey: dKey,
        hoursWorked: 0,
        taskDescription: "",
        status: "unmarked",
        remarks,
        reviewedBy: actor,
      });
    } else {
      doc.status = "unmarked";
      doc.hoursWorked = 0;
      doc.remarks = remarks ?? doc.remarks;
      doc.reviewedBy = actor;
    }

    await doc.save();
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Unmark failed" });
  }
};

exports.accept = async (req, res) => {
  try {
    const actor = getActorId(req);
    const { id } = req.params;
    const { remarks = "" } = req.body;

    const doc = await Attendance.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    doc.status = "accepted";
    doc.remarks = remarks;
    doc.reviewedBy = actor;
    await doc.save();

    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Accept failed" });
  }
};

exports.reject = async (req, res) => {
  try {
    const actor = getActorId(req);
    const { id } = req.params;
    const { remarks = "" } = req.body;

    const doc = await Attendance.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    doc.status = "rejected";
    doc.remarks = remarks;
    doc.reviewedBy = actor;
    await doc.save();

    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Reject failed" });
  }
};

exports.review = async (req, res) => {
  try {
    const actor = getActorId(req);
    const { id } = req.params;
    const { status, remarks = "" } = req.body;

    if (!["accepted", "rejected"].includes(String(status).toLowerCase())) {
      return res
        .status(400)
        .json({ message: "status must be accepted|rejected" });
    }

    const doc = await Attendance.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    doc.status = status;
    doc.remarks = remarks;
    doc.reviewedBy = actor;
    await doc.save();

    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Review failed" });
  }
};

// -----------------------------
// Counts & summaries
// -----------------------------
exports.counts = async (req, res) => {
  try {
    const q = buildQuery(req.query);

    const groupBy = String(req.query.groupBy || "status");
    let groupField = null;
    switch (groupBy) {
      case "status":
        groupField = "$status";
        break;
      case "project":
        groupField = "$project";
        break;
      case "employee":
        groupField = "$employee";
        break;
      case "dayKey":
        groupField = "$dayKey";
        break;
      case "shift":
        groupField = "$shift";
        break;
      case "location":
        groupField = "$location";
        break;
      case "billable":
      case "isBillable":
        groupField = "$isBillable";
        break;
      default:
        return res.status(400).json({ message: "Invalid groupBy" });
    }

    const pipeline = [
      { $match: q },
      { $group: { _id: groupField, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ];

    const rows = await Attendance.aggregate(pipeline);
    return res.json({ groupBy, counts: rows });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Counts failed" });
  }
};

exports.hoursSummary = async (req, res) => {
  try {
    const q = buildQuery(req.query);
    const groupBy = String(req.query.groupBy || "employee");

    let groupField = "$employee";
    if (groupBy === "project") groupField = "$project";
    else if (groupBy === "dayKey") groupField = "$dayKey";
    else if (groupBy === "status") groupField = "$status";

    const rows = await Attendance.aggregate([
      { $match: q },
      {
        $group: {
          _id: groupField,
          totalHours: { $sum: "$hoursWorked" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalHours: -1 } },
    ]);

    return res.json({ groupBy, rows });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e.message || "Hours summary failed" });
  }
};

// -----------------------------
// Bulk operations
// -----------------------------
exports.bulkStatus = async (req, res) => {
  try {
    const actor = getActorId(req);
    const { ids = [], status, remarks = "" } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "Provide ids[]" });
    }
    if (
      !["pending", "marked", "unmarked", "accepted", "rejected"].includes(
        String(status).toLowerCase()
      )
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const docs = await Attendance.find({
      _id: { $in: ids.map(asObjectId).filter(Boolean) },
    });
    for (const doc of docs) {
      doc.status = status;
      doc.remarks = remarks;
      doc.reviewedBy = actor;
      if (status === "marked" && !doc.submittedAt) doc.submittedAt = new Date();
      await doc.save();
    }

    return res.json({ ok: true, updated: docs.length });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Bulk status failed" });
  }
};

exports.bulkAssignProject = async (req, res) => {
  try {
    const { ids = [], project = null } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "Provide ids[]" });
    }
    const projectId = project === null ? null : asObjectId(project);

    const result = await Attendance.updateMany(
      { _id: { $in: ids.map(asObjectId).filter(Boolean) } },
      { $set: { project: projectId } }
    );

    return res.json({
      ok: true,
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e.message || "Bulk project assign failed" });
  }
};

exports.bulkHours = async (req, res) => {
  try {
    const { ids = [], operation = "set", hours = 0 } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "Provide ids[]" });
    }
    const h = Number(hours);
    if (!Number.isFinite(h))
      return res.status(400).json({ message: "Invalid hours" });

    const filter = { _id: { $in: ids.map(asObjectId).filter(Boolean) } };
    const update =
      operation === "inc"
        ? { $inc: { hoursWorked: h } }
        : { $set: { hoursWorked: h } };
    const result = await Attendance.updateMany(filter, update);

    return res.json({
      ok: true,
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Bulk hours failed" });
  }
};

exports.bulkDelete = async (req, res) => {
  try {
    const { ids = [] } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "Provide ids[]" });
    }
    const result = await Attendance.deleteMany({
      _id: { $in: ids.map(asObjectId).filter(Boolean) },
    });
    return res.json({ ok: true, deleted: result.deletedCount ?? 0 });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Bulk delete failed" });
  }
};

exports.bulkMarkDays = async (req, res) => {
  try {
    const actor = getActorId(req);
    const {
      employee,
      days = [],
      defaultHours = 0,
      project = null,
      remarks = "",
    } = req.body;
    const eId = asObjectId(employee || actor);
    if (!eId) return res.status(400).json({ message: "Invalid employee" });

    let updated = 0;
    for (const day of days) {
      const d = toDate(day);
      if (!d) continue;
      const dKey = dayKeyFromDate(d);
      let doc = await Attendance.findOne({ employee: eId, dayKey: dKey });
      if (!doc) {
        doc = new Attendance({
          employee: eId,
          project: asObjectId(project),
          date: d,
          dayKey: dKey,
          hoursWorked: defaultHours,
          status: "marked",
          submittedAt: new Date(),
          remarks,
          reviewedBy: actor,
        });
      } else {
        doc.status = "marked";
        doc.hoursWorked = defaultHours;
        doc.project = asObjectId(project) || doc.project || null;
        doc.submittedAt = doc.submittedAt || new Date();
        doc.remarks = remarks ?? doc.remarks;
        doc.reviewedBy = actor;
      }
      await doc.save();
      updated++;
    }
    return res.json({ ok: true, updated });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e.message || "Bulk mark days failed" });
  }
};

// -----------------------------
// Calendar & utilities
// -----------------------------
exports.calendarView = async (req, res) => {
  try {
    const employee = asObjectId(req.query.employee || getActorId(req));
    if (!employee) return res.status(400).json({ message: "Invalid employee" });

    const monthAny = toDate(req.query.month || new Date());
    if (!monthAny) return res.status(400).json({ message: "Invalid month" });

    const start = new Date(
      Date.UTC(monthAny.getUTCFullYear(), monthAny.getUTCMonth(), 1)
    );
    const end = new Date(
      Date.UTC(
        monthAny.getUTCFullYear(),
        monthAny.getUTCMonth() + 1,
        0,
        23,
        59,
        59,
        999
      )
    );

    const rows = await Attendance.find({
      employee,
      date: { $gte: start, $lte: end },
    })
      .select("date dayKey status hoursWorked project")
      .sort({ date: 1 });

    const map = {};
    for (const r of rows) map[r.dayKey] = r;

    return res.json({
      monthKey: start.toISOString().slice(0, 7),
      start,
      end,
      days: rows.length,
      byDayKey: map,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e.message || "Calendar view failed" });
  }
};

exports.getOrCreateForDay = async (req, res) => {
  try {
    const actor = getActorId(req);
    const employee = asObjectId(req.query.employee || actor);
    const d = toDate(req.query.date || new Date());
    if (!employee || !d)
      return res.status(400).json({ message: "Invalid employee or date" });

    const dKey = dayKeyFromDate(d);
    let doc = await Attendance.findOne({ employee, dayKey: dKey });
    if (!doc) {
      doc = await Attendance.create({
        employee,
        date: d,
        dayKey: dKey,
        status: "pending",
      });
    }
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message || "Get/create failed" });
  }
};

// -----------------------------
// Export (CSV-ish JSON array)
// -----------------------------
exports.export = async (req, res) => {
  try {
    const q = buildQuery(req.query);
    const rows = await Attendance.find(q)
      .select(SAFE_SELECT)
      .sort({ date: 1 })
      .populate("employee", "name email")
      .populate("project", "project_name");

    const out = rows.map((r) => ({
      id: String(r._id),
      employee: r.employee ? r.employee.name : "",
      employeeEmail: r.employee ? r.employee.email : "",
      project: r.project ? r.project.project_name : "",
      date: r.date ? r.date.toISOString() : "",
      dayKey: r.dayKey || "",
      status: r.status,
      hoursWorked: r.hoursWorked,
      taskDescription: r.taskDescription || "",
      remarks: r.remarks || "",
      isBillable: r.isBillable,
      location: r.location,
      shift: r.shift,
      submittedAt: r.submittedAt ? r.submittedAt.toISOString() : "",
      reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : "",
      reviewedBy: r.reviewedBy ? String(r.reviewedBy) : "",
      createdAt: r.createdAt ? r.createdAt.toISOString() : "",
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : "",
    }));

    return res.json({ count: out.length, rows: out });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Export failed" });
  }
};

// Alias with the same data shape; referenced by routes
exports.exportData = exports.export;

// -----------------------------
// NEW: attendance count for an employee
// -----------------------------
exports.countAttendanceByEmployee = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const { status } = req.query;
    const q = { employee: new mongoose.Types.ObjectId(userId) };

    if (status) {
      const statuses = String(status)
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (statuses.length) q.status = { $in: statuses };
    }

    const count = await Attendance.countDocuments(q);
    return res.json({ count });
  } catch (e) {
    console.error("countAttendanceByEmployee error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
