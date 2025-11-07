// controllers/AttendanceController.js
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const Attendance = require("../models/AttendanceModel");

/* ----------------------------- Helpers ----------------------------- */
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

/* -------- Headers helper for XLSX streaming -------- */
const prepXlsxHeaders = (res, filename) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  if (res.removeHeader) res.removeHeader("Content-Encoding"); // avoid gzip on some stacks
  if (res.flushHeaders) res.flushHeaders();
};

/* =================================================================== */
/* ============================= EXPORTS ============================== */
/* =================================================================== */

/** GET /api/attendance/export.test.xlsx  */
exports.exportTestXlsx = async (_req, res) => {
  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Hello");
    ws.columns = [
      { header: "Col", key: "col", width: 8 },
      { header: "Type", key: "type", width: 14 },
      { header: "Value", key: "value", width: 28 },
    ];
    ws.addRow({ col: 1, type: "string", value: "ok" });
    ws.addRow({ col: 2, type: "number", value: 123.45 });
    ws.addRow({ col: 3, type: "date", value: new Date() });
    ws.getColumn("value").numFmt = "yyyy-mm-dd hh:mm";

    prepXlsxHeaders(res, `test_${Date.now()}.xlsx`);
    await wb.xlsx.write(res); // stream
    res.end();
  } catch (e) {
    console.error("exportTestXlsx error:", e);
    res.status(500).json({ message: "Test export failed.", err: String(e) });
  }
};

/** GET /api/attendance/export.xlsx — XLSX (DB + filters) */
exports.exportData = async (req, res) => {
  try {
    const { status, billable, employee, project, search, quick } = req.query;
    const criteria = {};

    if (status) {
      criteria.status =
        String(status).toLowerCase() === "approved" ? "accepted" : status;
    }
    if (billable === "true") criteria.isBillable = true;
    if (billable === "false") criteria.isBillable = false;

    if (employee && mongoose.isValidObjectId(employee)) {
      criteria.employee = new mongoose.Types.ObjectId(employee);
    }
    if (project && mongoose.isValidObjectId(project)) {
      criteria.project = new mongoose.Types.ObjectId(project);
    }

    if (quick) {
      const now = new Date();
      let from = null;
      if (quick === "today")
        from = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
          0
        );
      else if (quick === "week")
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else if (quick === "month")
        from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      if (from) criteria.date = { $gte: from };
    }

    if (search) {
      const s = String(search).trim();
      if (s) {
        const re = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        criteria.$or = [
          { dayKey: re },
          { status: re },
          { taskDescription: re },
          { location: re },
          { shift: re },
        ];
      }
    }

    const rows = await Attendance.find(criteria)
      .populate("employee", "name email")
      .populate("project", "project_name")
      .sort({ date: -1 })
      .lean();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Attendance");

    ws.columns = [
      { header: "ID", key: "_id", width: 24 },
      { header: "Employee", key: "employeeName", width: 22 },
      { header: "EmployeeEmail", key: "employeeEmail", width: 28 },
      { header: "Project", key: "projectName", width: 24 },
      {
        header: "Date",
        key: "date",
        width: 20,
        style: { numFmt: "yyyy-mm-dd" },
      },
      { header: "DayKey", key: "dayKey", width: 14 },
      { header: "Status", key: "status", width: 14 },
      { header: "HoursWorked", key: "hoursWorked", width: 14 },
      { header: "TaskDescription", key: "taskDescription", width: 60 },
      { header: "Billable", key: "billable", width: 12 },
      { header: "Location", key: "location", width: 16 },
      { header: "Shift", key: "shift", width: 12 },
      {
        header: "SubmittedAt",
        key: "submittedAt",
        width: 20,
        style: { numFmt: "yyyy-mm-dd hh:mm" },
      },
      {
        header: "ReviewedAt",
        key: "reviewedAt",
        width: 20,
        style: { numFmt: "yyyy-mm-dd hh:mm" },
      },
      { header: "ReviewedBy", key: "reviewedBy", width: 16 },
      {
        header: "CreatedAt",
        key: "createdAt",
        width: 20,
        style: { numFmt: "yyyy-mm-dd hh:mm" },
      },
      {
        header: "UpdatedAt",
        key: "updatedAt",
        width: 20,
        style: { numFmt: "yyyy-mm-dd hh:mm" },
      },
    ];

    for (const r of rows) {
      ws.addRow({
        _id: String(r._id),
        employeeName: r.employee?.name || "",
        employeeEmail: r.employee?.email || "",
        projectName: r.project?.project_name || "",
        date: r.date ? new Date(r.date) : null,
        dayKey: r.dayKey || "",
        status: r.status || "",
        hoursWorked: Number(r.hoursWorked ?? 0),
        taskDescription: r.taskDescription || "",
        billable: r.isBillable ? "Yes" : "No",
        location: r.location || "",
        shift: r.shift || "",
        submittedAt: r.submittedAt ? new Date(r.submittedAt) : null,
        reviewedAt: r.reviewedAt ? new Date(r.reviewedAt) : null,
        reviewedBy: r.reviewedBy || "",
        createdAt: r.createdAt ? new Date(r.createdAt) : null,
        updatedAt: r.updatedAt ? new Date(r.updatedAt) : null,
      });
    }

    prepXlsxHeaders(res, `attendance_${Date.now()}.xlsx`);
    await wb.xlsx.write(res); // stream to response
    res.end();
  } catch (e) {
    console.error("exportData error:", e);
    res
      .status(500)
      .json({ message: "Failed to export Excel.", err: String(e) });
  }
};

/** GET /api/attendance/export — JSON (same filters) */
exports.exportDataJSON = async (req, res) => {
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

/* =================================================================== */
/* ============================ CRUD/etc ============================= */
/* =================================================================== */

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

/* --------------------------- Marking / Review --------------------------- */
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

/* --------------------------- Counts & summaries --------------------------- */
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

/* ------------------------------ Bulk ops ------------------------------ */
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

/* -------------------------- Calendar & utils -------------------------- */
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

/* --------------------- Count by employee (convenience) --------------------- */
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
