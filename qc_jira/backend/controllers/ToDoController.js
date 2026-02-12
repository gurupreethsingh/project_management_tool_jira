// controllers/ToDoController.js
const mongoose = require("mongoose");
const ToDo = require("../models/ToDoModel");

// ------------------------- helpers -------------------------
function getUserId(req) {
  // Recommended: your auth middleware sets req.user._id
  // Fallback: allow passing userId explicitly (useful for admin tools)
  return req.user?._id || req.user?.id || req.params.userId || req.query.userId;
}

function isOverdue(doc, now = new Date()) {
  if (!doc?.dueAt) return false;
  if (doc.status === "FINISHED") return false;
  return new Date(doc.dueAt).getTime() < now.getTime();
}

function normalizeStatus(status) {
  if (!status) return null;
  const s = String(status).trim().toUpperCase();
  return ToDo.STATUS.includes(s) ? s : null;
}

function buildFilters(req) {
  const userId = getUserId(req);
  if (!userId) throw new Error("Unauthorized: user not found");

  const {
    status,
    q,
    reportTo,
    from,
    to,
    overdue, // "true" / "false"
    archived, // "true"/"false"
  } = req.query;

  const filter = { user: userId };

  // archived
  if (archived === "true") filter.isArchived = true;
  if (archived === "false") filter.isArchived = false;

  // status
  const st = normalizeStatus(status);
  if (st) filter.status = st;

  // reportTo
  if (reportTo && String(reportTo).trim()) {
    filter.reportTo = { $regex: String(reportTo).trim(), $options: "i" };
  }

  // date range: dueAt range
  if (from || to) {
    filter.dueAt = {};
    if (from) filter.dueAt.$gte = new Date(from);
    if (to) filter.dueAt.$lte = new Date(to);
  }

  // text search
  if (q && String(q).trim()) {
    filter.$text = { $search: String(q).trim() };
  }

  // overdue is handled later (because Pending can be "computed")
  const wantOverdue = overdue === "true";

  return { userId, filter, wantOverdue };
}

async function getNextSortOrder(userId, status) {
  const last = await ToDo.findOne({ user: userId, status, isArchived: false })
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();
  return (last?.sortOrder ?? 0) + 1000; // gaps allow easy inserts
}

// ------------------------- CRUD -------------------------
exports.createTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      title,
      details = "",
      reportTo = "",
      startAt = null,
      dueAt = null,
      status = "NEW",
    } = req.body || {};

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const st = normalizeStatus(status) || "NEW";
    const sortOrder = await getNextSortOrder(userId, st);

    const task = await ToDo.create({
      user: userId,
      title: String(title).trim(),
      details: String(details || "").trim(),
      reportTo: String(reportTo || "").trim(),
      startAt: startAt ? new Date(startAt) : null,
      dueAt: dueAt ? new Date(dueAt) : null,
      status: st,
      sortOrder,
      lastStatusChangedAt: new Date(),
    });

    return res.status(201).json({ task });
  } catch (err) {
    console.error("[ToDoController.createTask] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const task = await ToDo.findOne({ _id: id, user: userId }).lean();
    if (!task) return res.status(404).json({ message: "Task not found" });

    // computed pending
    const pendingComputed = isOverdue(task);
    const effectiveStatus = pendingComputed ? "PENDING" : task.status;

    return res.json({ task: { ...task, effectiveStatus, pendingComputed } });
  } catch (err) {
    console.error("[ToDoController.getTaskById] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listTasks = async (req, res) => {
  try {
    const { filter, wantOverdue } = buildFilters(req);

    const now = new Date();
    const tasks = await ToDo.find(filter)
      .sort({ status: 1, sortOrder: 1, updatedAt: -1 })
      .lean();

    // Add computed status
    const mapped = tasks.map((t) => {
      const pendingComputed = isOverdue(t, now);
      const effectiveStatus = pendingComputed ? "PENDING" : t.status;
      return { ...t, effectiveStatus, pendingComputed };
    });

    const final = wantOverdue
      ? mapped.filter((t) => t.effectiveStatus === "PENDING")
      : mapped;

    return res.json({ tasks: final });
  } catch (err) {
    console.error("[ToDoController.listTasks] error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const allowed = [
      "title",
      "details",
      "reportTo",
      "startAt",
      "dueAt",
      "status",
      "isArchived",
    ];

    const patch = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, k))
        patch[k] = req.body[k];
    }

    if (patch.title !== undefined)
      patch.title = String(patch.title || "").trim();
    if (patch.details !== undefined)
      patch.details = String(patch.details || "").trim();
    if (patch.reportTo !== undefined)
      patch.reportTo = String(patch.reportTo || "").trim();
    if (patch.startAt !== undefined)
      patch.startAt = patch.startAt ? new Date(patch.startAt) : null;
    if (patch.dueAt !== undefined)
      patch.dueAt = patch.dueAt ? new Date(patch.dueAt) : null;

    if (patch.status !== undefined) {
      const st = normalizeStatus(patch.status);
      if (!st) return res.status(400).json({ message: "Invalid status" });
      patch.status = st;
      patch.lastStatusChangedAt = new Date();

      // auto set completedAt / reopenedAt
      if (st === "FINISHED") patch.completedAt = new Date();
      else patch.completedAt = null;
    }

    const updated = await ToDo.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: patch },
      { new: true },
    ).lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });

    const pendingComputed = isOverdue(updated);
    const effectiveStatus = pendingComputed ? "PENDING" : updated.status;

    return res.json({ task: { ...updated, pendingComputed, effectiveStatus } });
  } catch (err) {
    console.error("[ToDoController.updateTask] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const deleted = await ToDo.findOneAndDelete({
      _id: id,
      user: userId,
    }).lean();
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    return res.json({ message: "Deleted", id });
  } catch (err) {
    console.error("[ToDoController.deleteTask] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------- status operations -------------------------
exports.markFinished = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const updated = await ToDo.findOneAndUpdate(
      { _id: id, user: userId },
      {
        $set: {
          status: "FINISHED",
          completedAt: new Date(),
          lastStatusChangedAt: new Date(),
        },
      },
      { new: true },
    ).lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });

    return res.json({ task: updated });
  } catch (err) {
    console.error("[ToDoController.markFinished] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.reopenTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const toStatus = normalizeStatus(req.body?.status) || "IN_PROGRESS";
    if (toStatus === "FINISHED") {
      return res
        .status(400)
        .json({ message: "Reopen target status cannot be FINISHED" });
    }

    const updated = await ToDo.findOneAndUpdate(
      { _id: id, user: userId },
      {
        $set: {
          status: toStatus,
          reopenedAt: new Date(),
          completedAt: null,
          lastStatusChangedAt: new Date(),
        },
      },
      { new: true },
    ).lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });

    return res.json({ task: updated });
  } catch (err) {
    console.error("[ToDoController.reopenTask] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------- bulk operations -------------------------
exports.bulkDelete = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (!ids.length) return res.status(400).json({ message: "ids required" });

    const result = await ToDo.deleteMany({ user: userId, _id: { $in: ids } });
    return res.json({
      message: "Bulk deleted",
      deletedCount: result.deletedCount || 0,
    });
  } catch (err) {
    console.error("[ToDoController.bulkDelete] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.bulkUpdateStatus = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const status = normalizeStatus(req.body?.status);
    if (!ids.length || !status)
      return res.status(400).json({ message: "ids and valid status required" });

    const patch = {
      status,
      lastStatusChangedAt: new Date(),
    };

    if (status === "FINISHED") patch.completedAt = new Date();
    else patch.completedAt = null;

    const result = await ToDo.updateMany(
      { user: userId, _id: { $in: ids } },
      { $set: patch },
    );

    return res.json({
      message: "Bulk status updated",
      matchedCount: result.matchedCount ?? result.n ?? 0,
      modifiedCount: result.modifiedCount ?? result.nModified ?? 0,
      status,
    });
  } catch (err) {
    console.error("[ToDoController.bulkUpdateStatus] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.bulkReschedule = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const dueAt = req.body?.dueAt ? new Date(req.body.dueAt) : null;
    const startAt = req.body?.startAt ? new Date(req.body.startAt) : undefined; // optional
    if (!ids.length || !dueAt)
      return res.status(400).json({ message: "ids and dueAt required" });

    const set = { dueAt };
    if (startAt !== undefined) set.startAt = startAt;

    const result = await ToDo.updateMany(
      { user: userId, _id: { $in: ids } },
      { $set: set },
    );

    return res.json({
      message: "Bulk rescheduled",
      matchedCount: result.matchedCount ?? result.n ?? 0,
      modifiedCount: result.modifiedCount ?? result.nModified ?? 0,
    });
  } catch (err) {
    console.error("[ToDoController.bulkReschedule] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------- counts & analytics -------------------------
exports.getCounts = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const now = new Date();

    // base counts (stored status)
    const base = await ToDo.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          isArchived: false,
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const counts = {
      NEW: 0,
      IN_PROGRESS: 0,
      FINISHED: 0,
      PENDING: 0,
      TOTAL: 0,
    };
    for (const row of base) {
      counts[row._id] = row.count;
      counts.TOTAL += row.count;
    }

    // computed overdue count (pending)
    const overdueCount = await ToDo.countDocuments({
      user: userId,
      isArchived: false,
      status: { $ne: "FINISHED" },
      dueAt: { $lt: now },
    });

    // We expose computed pending as overdueCount (true pending)
    counts.PENDING = overdueCount;

    return res.json({ counts });
  } catch (err) {
    console.error("[ToDoController.getCounts] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------- drag/drop reorder & move -------------------------
exports.bulkReorder = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updates = Array.isArray(req.body?.updates) ? req.body.updates : [];
    if (!updates.length)
      return res.status(400).json({ message: "updates required" });

    // Each update: { id, status, sortOrder }
    const ops = [];
    for (const u of updates) {
      const id = u?.id;
      const status = normalizeStatus(u?.status);
      const sortOrder = Number.isFinite(u?.sortOrder) ? u.sortOrder : null;

      if (!id || !status || sortOrder === null) continue;

      const set = { status, sortOrder, lastStatusChangedAt: new Date() };
      if (status === "FINISHED") set.completedAt = new Date();
      else set.completedAt = null;

      ops.push({
        updateOne: {
          filter: { _id: id, user: userId },
          update: { $set: set },
        },
      });
    }

    if (!ops.length)
      return res.status(400).json({ message: "No valid updates provided" });

    const result = await ToDo.bulkWrite(ops, { ordered: false });
    return res.json({
      message: "Reordered",
      matchedCount: result.matchedCount ?? 0,
      modifiedCount: result.modifiedCount ?? 0,
    });
  } catch (err) {
    console.error("[ToDoController.bulkReorder] error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
