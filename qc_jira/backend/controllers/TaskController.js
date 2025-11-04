// controllers/TaskController.js
const mongoose = require("mongoose");
const Task = require("../models/TaskModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const Module = require("../models/ModuleModel");

// ---------- utils ----------
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const toObjectId = (id) => new mongoose.Types.ObjectId(id);
const norm = (s) => String(s || "").trim();

function arrify(x) {
  if (Array.isArray(x)) return x;
  if (x === undefined || x === null) return [];
  return [x];
}

// Build a stable module key
function makeKey(name) {
  return norm(name)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 _-]/g, "")
    .replace(/\s/g, "-");
}

// Resolve modules from body: accepts ids and/or names; creates missing by {project,key}
async function resolveModulesForProject(
  projectId,
  creatorUserId,
  payload = {}
) {
  const ids = new Set();
  const names = new Set();

  const fromIds = [...arrify(payload.modules), ...arrify(payload.moduleIds)];
  const fromNames = [
    ...arrify(payload.moduleNames),
    ...arrify(payload.module_name),
  ];

  fromIds.forEach((x) => {
    if (isValidObjectId(x)) ids.add(String(x));
  });

  fromNames.forEach((n) => {
    const v = norm(n);
    if (v) names.add(v);
  });

  // fetch by ids (scoped to project)
  let foundById = [];
  if (ids.size) {
    foundById = await Module.find({
      _id: { $in: Array.from(ids).map(toObjectId) },
      project: projectId,
    })
      .select("_id name key project")
      .lean();
  }

  // bulk fetch by key for provided names
  const keysWanted = Array.from(names).map((n) => makeKey(n));
  let foundByName = [];
  if (keysWanted.length) {
    foundByName = await Module.find({
      project: projectId,
      key: { $in: keysWanted },
    })
      .select("_id name key project")
      .lean();
  }

  const existingKeySet = new Set(foundByName.map((m) => m.key));
  const finalByName = [...foundByName];

  // create missing (if allowed)
  for (const name of names) {
    const key = makeKey(name);
    if (existingKeySet.has(key)) continue;

    if (!creatorUserId) {
      const err = new Error("Auth required to create a new module");
      err.status = 401;
      throw err;
    }
    const doc = await Module.create({
      name,
      key,
      project: projectId,
      createdBy: creatorUserId || null,
    });
    finalByName.push({
      _id: doc._id,
      name: doc.name,
      key: doc.key,
      project: doc.project,
    });
    existingKeySet.add(key);
  }

  const allDocs = [...foundById, ...finalByName];
  return {
    moduleIds: allDocs.map((d) => d._id),
    moduleNames: allDocs.map((d) => norm(d.name)),
  };
}

// ---------- filtering ----------
function buildTaskFilter(query = {}) {
  const filter = {};

  if (query.project && isValidObjectId(query.project)) {
    filter.project = toObjectId(query.project);
  }

  if (query.status) {
    const statuses = String(query.status)
      .split(",")
      .map((s) => norm(s));
    filter.status = { $in: statuses };
  }

  if (query.priority) {
    const priorities = String(query.priority)
      .split(",")
      .map((s) => norm(s));
    filter.priority = { $in: priorities };
  }

  if (query.assignedTo && isValidObjectId(query.assignedTo)) {
    filter.assignedUsers = toObjectId(query.assignedTo);
  }

  if (query.startFrom || query.startTo) {
    filter.startDate = {};
    if (query.startFrom) filter.startDate.$gte = new Date(query.startFrom);
    if (query.startTo) filter.startDate.$lte = new Date(query.startTo);
  }

  if (query.deadlineFrom || query.deadlineTo) {
    filter.deadline = {};
    if (query.deadlineFrom) filter.deadline.$gte = new Date(query.deadlineFrom);
    if (query.deadlineTo) filter.deadline.$lte = new Date(query.deadlineTo);
  }

  if (query.search) {
    const s = norm(query.search);
    filter.$or = [
      { task_title: { $regex: s, $options: "i" } },
      { description: { $regex: s, $options: "i" } },
      { module_names: { $regex: s, $options: "i" } },
    ];
  }

  if (query.module && isValidObjectId(query.module)) {
    filter.modules = toObjectId(query.module);
  }
  if (query.modules) {
    const arr = String(query.modules)
      .split(",")
      .map((x) => x.trim())
      .filter(isValidObjectId)
      .map(toObjectId);
    if (arr.length) filter.modules = { $in: arr };
  }

  if (query.moduleName) {
    filter.module_names = norm(query.moduleName);
  }
  if (query.moduleNames) {
    const arr = String(query.moduleNames)
      .split(",")
      .map((x) => norm(x))
      .filter(Boolean);
    if (arr.length) filter.module_names = { $in: arr };
  }

  return filter;
}

// ---------- reads ----------
exports.getModulesForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidObjectId(projectId))
      return res.status(400).json({ message: "Invalid project id" });

    const mods = await Module.find({ project: projectId })
      .select("_id name key")
      .sort({ name: 1 })
      .lean();
    res.status(200).json(mods);
  } catch (e) {
    console.error("getModulesForProject error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "-updatedAt", select } = req.query;

    const filter = buildTaskFilter(req.query);
    const skip = (Number(page) - 1) * Number(limit);

    let query = Task.find(filter)
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .populate("history.statusChanges.changedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    if (select) query = query.select(select.replaceAll(",", " "));

    const [items, total] = await Promise.all([
      query.lean(),
      Task.countDocuments(filter),
    ]);

    res
      .status(200)
      .json({ page: Number(page), limit: Number(limit), total, items });
  } catch (e) {
    console.error("getAllTasks error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const task = await Task.findById(id)
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (e) {
    console.error("getTaskById error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- create / update ----------
exports.createTask = async (req, res) => {
  try {
    const {
      task_title,
      title,
      description,
      project,
      assignedUsers = [],
      status,
      priority,
      startDate,
      deadline,

      modules,
      moduleIds,
      moduleNames,
      module_name,
    } = req.body;

    const finalTitle = norm(task_title || title);
    if (!finalTitle || !project || !startDate || !deadline) {
      return res.status(400).json({
        message:
          "task_title (or title), project, startDate, deadline are required",
      });
    }
    if (!isValidObjectId(project))
      return res.status(400).json({ message: "Invalid project id" });

    const proj = await Project.findById(project).select("_id");
    if (!proj) return res.status(404).json({ message: "Project not found" });

    const sDate = new Date(startDate);
    const dDate = new Date(deadline);
    if (isNaN(sDate) || isNaN(dDate) || sDate > dDate) {
      return res
        .status(400)
        .json({ message: "Invalid dates: startDate must be <= deadline" });
    }

    const assigneesClean = (assignedUsers || []).filter(isValidObjectId);
    if (assigneesClean.length) {
      const c = await User.countDocuments({ _id: { $in: assigneesClean } });
      if (c !== assigneesClean.length)
        return res.status(400).json({ message: "One or more users invalid" });
    }

    const creatorId = req.user?._id || req.user?.id || null;
    const { moduleIds: resolvedIds, moduleNames: resolvedNames } =
      await resolveModulesForProject(project, creatorId, {
        modules,
        moduleIds,
        moduleNames,
        module_name,
      });

    const initialStatus = status || "new";

    const task = await Task.create({
      task_title: finalTitle,
      description,
      project,
      assignedUsers: assigneesClean,
      status: initialStatus,
      priority: priority || "medium",
      startDate: sDate,
      deadline: dDate,
      modules: resolvedIds,
      module_names: resolvedNames,
      history: [
        {
          statusChanges: [
            {
              status: initialStatus,
              changedAt: new Date(),
              changedBy: creatorId,
            },
          ],
        },
      ],
    });

    const doc = await Task.findById(task._id)
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    res.status(201).json({ message: "Task created", task: doc });
  } catch (e) {
    console.error("createTask error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const updates = {};
    const allowed = [
      "task_title",
      "title",
      "description",
      "project",
      "assignedUsers",
      "priority",
      "startDate",
      "deadline",
      "status",
      "modules",
      "moduleIds",
      "moduleNames",
      "module_name",
    ];
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

    if (updates.title && !updates.task_title) {
      updates.task_title = norm(updates.title);
      delete updates.title;
    }
    if ("task_title" in updates && !norm(updates.task_title)) {
      return res.status(400).json({ message: "task_title cannot be empty" });
    }

    if (updates.project) {
      if (!isValidObjectId(updates.project))
        return res.status(400).json({ message: "Invalid project id" });
      const exists = await Project.exists({ _id: updates.project });
      if (!exists)
        return res.status(404).json({ message: "Project not found" });
    }

    if (updates.assignedUsers) {
      const arr = Array.isArray(updates.assignedUsers)
        ? updates.assignedUsers
        : [];
      const clean = arr.filter(isValidObjectId);
      const count = await User.countDocuments({ _id: { $in: clean } });
      if (count !== clean.length)
        return res
          .status(400)
          .json({ message: "One or more assigned users invalid" });
      updates.assignedUsers = clean;
    }

    const current = await Task.findById(id);
    if (!current) return res.status(404).json({ message: "Task not found" });

    let projectId = current.project;
    if (updates.project) projectId = updates.project;

    const sDate = updates.startDate
      ? new Date(updates.startDate)
      : current.startDate;
    const dDate = updates.deadline
      ? new Date(updates.deadline)
      : current.deadline;
    if (isNaN(sDate) || isNaN(dDate) || sDate > dDate) {
      return res
        .status(400)
        .json({ message: "Invalid dates: startDate must be <= deadline" });
    }

    let pushHistory = null;
    if (updates.status && updates.status !== current.status) {
      pushHistory = {
        "history.0.statusChanges": {
          status: updates.status,
          changedAt: new Date(),
          changedBy: req.user?._id || req.user?.id || null,
        },
      };
    }

    const hasModuleInput =
      "modules" in updates ||
      "moduleIds" in updates ||
      "moduleNames" in updates ||
      "module_name" in updates;

    if (hasModuleInput) {
      const creatorId = req.user?._id || req.user?.id || null;
      const { moduleIds: resolvedIds, moduleNames: resolvedNames } =
        await resolveModulesForProject(projectId, creatorId, updates);
      updates.modules = resolvedIds;
      updates.module_names = resolvedNames;
      delete updates.moduleIds;
      delete updates.moduleNames;
      delete updates.module_name;
    }

    updates.updatedAt = new Date();
    const updateOps = pushHistory
      ? { $set: updates, $push: pushHistory }
      : { $set: updates };

    await Task.updateOne({ _id: id }, updateOps);

    const updated = await Task.findById(id)
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    res.status(200).json({ message: "Task updated", task: updated });
  } catch (e) {
    console.error("updateTask error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

// ---------- status & assignees ----------
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });
    if (!status) return res.status(400).json({ message: "status is required" });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const prev = task.status;
    task.status = status;
    task.updatedAt = new Date();
    if (!Array.isArray(task.history) || task.history.length === 0) {
      task.history = [{ statusChanges: [] }];
    }
    task.history[0].statusChanges.push({
      status,
      changedAt: new Date(),
      changedBy: req.user?._id || req.user?.id || null,
    });

    await task.save();

    const doc = await Task.findById(id)
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    res
      .status(200)
      .json({ message: `Status changed ${prev} → ${status}`, task: doc });
  } catch (e) {
    console.error("updateTaskStatus error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.replaceAssignees = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedUsers = [] } = req.body;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const clean = (Array.isArray(assignedUsers) ? assignedUsers : []).filter(
      isValidObjectId
    );
    const count = await User.countDocuments({ _id: { $in: clean } });
    if (count !== clean.length)
      return res
        .status(400)
        .json({ message: "One or more assigned users invalid" });

    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: { assignedUsers: clean, updatedAt: new Date() } },
      { new: true }
    )
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Assignees replaced", task: updated });
  } catch (e) {
    console.error("replaceAssignees error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.addAssignees = async (req, res) => {
  try {
    const { id } = req.params;
    const { users = [] } = req.body;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const clean = (Array.isArray(users) ? users : []).filter(isValidObjectId);
    const count = await User.countDocuments({ _id: { $in: clean } });
    if (count !== clean.length)
      return res.status(400).json({ message: "One or more users invalid" });

    const updated = await Task.findByIdAndUpdate(
      id,
      {
        $addToSet: { assignedUsers: { $each: clean } },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    )
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Assignees added", task: updated });
  } catch (e) {
    console.error("addAssignees error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.removeAssignees = async (req, res) => {
  try {
    const { id } = req.params;
    const { users = [] } = req.body;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const clean = (Array.isArray(users) ? users : []).filter(isValidObjectId);

    const updated = await Task.findByIdAndUpdate(
      id,
      {
        $pull: { assignedUsers: { $in: clean } },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    )
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Assignees removed", task: updated });
  } catch (e) {
    console.error("removeAssignees error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

// ---------- delete ----------
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted" });
  } catch (e) {
    console.error("deleteTask error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

// ---------- project/user listings ----------
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidObjectId(projectId))
      return res.status(400).json({ message: "Invalid project id" });

    const tasks = await Task.find({ project: projectId })
      .populate("assignedUsers", "name email role")
      .populate("modules", "name key")
      .lean();

    res.status(200).json(tasks);
  } catch (e) {
    console.error("getTasksByProject error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.getTasksForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId))
      return res.status(400).json({ message: "Invalid user id" });

    const tasks = await Task.find({ assignedUsers: userId })
      .populate("project", "project_name name")
      .populate("modules", "name key")
      .lean();

    res.status(200).json(tasks);
  } catch (e) {
    console.error("getTasksForUser error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.getTaskHistory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const task = await Task.findById(id)
      .populate("history.statusChanges.changedBy", "name email")
      .select("history")
      .lean();

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task.history || []);
  } catch (e) {
    console.error("getTaskHistory error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

// ---------- counts & due soon ----------
exports.getTaskCounts = async (req, res) => {
  try {
    const { groupBy = "status", project } = req.query;

    const match = {};
    if (project && isValidObjectId(project))
      match.project = toObjectId(project);

    let groupField;
    if (groupBy === "priority") groupField = "$priority";
    else if (groupBy === "module") groupField = "$module_names";
    else if (groupBy === "assignee") groupField = "$assignedUsers";
    else groupField = "$status";

    const pipeline = [{ $match: match }];
    if (groupBy === "module") pipeline.push({ $unwind: "$module_names" });
    if (groupBy === "assignee") pipeline.push({ $unwind: "$assignedUsers" });
    pipeline.push({ $group: { _id: groupField, count: { $sum: 1 } } });

    const grouped = await Task.aggregate(pipeline);

    const now = new Date();
    const overdue = await Task.countDocuments({
      ...match,
      deadline: { $lt: now },
      status: { $nin: ["finished", "closed"] },
    });

    res.status(200).json({ groupBy, counts: grouped, overdue });
  } catch (e) {
    console.error("getTaskCounts error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.getDueSoon = async (req, res) => {
  try {
    const days = Number(req.query.days || 7);
    const now = new Date();
    const soon = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      deadline: { $gte: now, $lte: soon },
      status: { $nin: ["finished", "closed"] },
    })
      .populate("project", "project_name name")
      .populate("assignedUsers", "name email")
      .populate("modules", "name key")
      .sort("deadline")
      .lean();

    res.status(200).json(tasks);
  } catch (e) {
    console.error("getDueSoon error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

// ---------- module ops on single task ----------
exports.replaceModules = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { moduleIds, moduleNames, modules, module_name } = req.body;
    const creatorId = req.user?._id || req.user?.id || null;

    const { moduleIds: resolvedIds, moduleNames: resolvedNames } =
      await resolveModulesForProject(task.project, creatorId, {
        moduleIds,
        moduleNames,
        modules,
        module_name,
      });

    const updated = await Task.findByIdAndUpdate(
      id,
      {
        $set: {
          modules: resolvedIds,
          module_names: resolvedNames,
          updatedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate("project", "project_name name")
      .populate("modules", "name key")
      .lean();

    res.status(200).json({ message: "Modules replaced", task: updated });
  } catch (e) {
    console.error("replaceModules error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.addModules = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { moduleIds, moduleNames, modules, module_name } = req.body;
    const creatorId = req.user?._id || req.user?.id || null;

    const { moduleIds: resolvedIds, moduleNames: resolvedNames } =
      await resolveModulesForProject(task.project, creatorId, {
        moduleIds,
        moduleNames,
        modules,
        module_name,
      });

    const updated = await Task.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          modules: { $each: resolvedIds },
          module_names: { $each: resolvedNames },
        },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    )
      .populate("project", "project_name name")
      .populate("modules", "name key")
      .lean();

    res.status(200).json({ message: "Modules added", task: updated });
  } catch (e) {
    console.error("addModules error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.removeModules = async (req, res) => {
  try {
    const { id } = req.params;
    const { moduleIds = [], moduleNames = [] } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const ids = (Array.isArray(moduleIds) ? moduleIds : [])
      .filter(isValidObjectId)
      .map(toObjectId);
    const names = (Array.isArray(moduleNames) ? moduleNames : [])
      .map(norm)
      .filter(Boolean);

    const updated = await Task.findByIdAndUpdate(
      id,
      {
        ...(ids.length ? { $pull: { modules: { $in: ids } } } : {}),
        ...(names.length ? { $pull: { module_names: { $in: names } } } : {}),
        $set: { updatedAt: new Date() },
      },
      { new: true }
    )
      .populate("project", "project_name name")
      .populate("modules", "name key")
      .lean();

    res.status(200).json({ message: "Modules removed", task: updated });
  } catch (e) {
    console.error("removeModules error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

// ---------- bulk ----------
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids = [], status } = req.body;
    const validIds = (Array.isArray(ids) ? ids : [])
      .filter(isValidObjectId)
      .map(toObjectId);
    if (!validIds.length)
      return res.status(400).json({ message: "No valid ids" });
    if (!status) return res.status(400).json({ message: "status is required" });

    const changedBy = req.user?._id || req.user?.id || null;
    const result = await Task.updateMany(
      { _id: { $in: validIds } },
      {
        $set: { status, updatedAt: new Date() },
        $push: {
          "history.0.statusChanges": {
            status,
            changedAt: new Date(),
            changedBy,
          },
        },
      }
    );

    res.status(200).json({
      message: "Bulk status updated",
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (e) {
    console.error("bulkUpdateStatus error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.bulkReplaceAssignees = async (req, res) => {
  try {
    const { ids = [], assignedUsers = [] } = req.body;
    const validIds = (Array.isArray(ids) ? ids : [])
      .filter(isValidObjectId)
      .map(toObjectId);
    const cleanUsers = (Array.isArray(assignedUsers) ? assignedUsers : [])
      .filter(isValidObjectId)
      .map(toObjectId);
    if (!validIds.length)
      return res.status(400).json({ message: "No valid ids" });

    const count = await User.countDocuments({ _id: { $in: cleanUsers } });
    if (count !== cleanUsers.length)
      return res
        .status(400)
        .json({ message: "One or more assigned users invalid" });

    const result = await Task.updateMany(
      { _id: { $in: validIds } },
      { $set: { assignedUsers: cleanUsers, updatedAt: new Date() } }
    );

    res.status(200).json({
      message: "Bulk assignees replaced",
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (e) {
    console.error("bulkReplaceAssignees error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.bulkAddModules = async (req, res) => {
  try {
    const {
      ids = [],
      project,
      moduleIds,
      moduleNames,
      modules,
      module_name,
    } = req.body;

    const validIds = arrify(ids).filter(isValidObjectId).map(toObjectId);
    if (!validIds.length)
      return res.status(400).json({ message: "No valid ids" });

    if (!project || !isValidObjectId(project)) {
      return res
        .status(400)
        .json({ message: "Valid project is required for module resolution" });
    }
    const projExists = await Project.exists({ _id: project });
    if (!projExists)
      return res.status(404).json({ message: "Project not found" });

    // ensure all selected tasks belong to this project
    const tasks = await Task.find({ _id: { $in: validIds } })
      .select("_id project")
      .lean();
    const bad = tasks
      .filter((t) => String(t.project) !== String(project))
      .map((t) => String(t._id));
    if (bad.length) {
      return res.status(400).json({
        message: "Some selected tasks do not belong to the provided project.",
        mismatchedTaskIds: bad,
        expectedProject: String(project),
      });
    }

    const creatorId = req.user?._id || req.user?.id || null;
    if (!creatorId) return res.status(401).json({ message: "Auth required" });

    const { moduleIds: resolvedIds, moduleNames: resolvedNames } =
      await resolveModulesForProject(project, creatorId, {
        moduleIds,
        moduleNames,
        modules,
        module_name,
      });

    if (!resolvedIds.length && !resolvedNames.length) {
      return res
        .status(400)
        .json({ message: "Provide moduleIds/moduleNames/modules to add" });
    }

    const result = await Task.updateMany(
      { _id: { $in: validIds } },
      {
        $addToSet: {
          modules: { $each: resolvedIds },
          module_names: { $each: resolvedNames },
        },
        $set: { updatedAt: new Date() },
      }
    );

    res.status(200).json({
      message: "Bulk modules added",
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
      addedModuleIds: resolvedIds.map(String),
      addedModuleNames: resolvedNames,
    });
  } catch (e) {
    console.error("bulkAddModules error:", e);
    const msg = e?.message || "Server error";
    const code = e?.code || "";
    if (code === 11000)
      return res
        .status(409)
        .json({ message: "Module key already exists", detail: msg });
    if (e?.status) return res.status(e.status).json({ message: msg });
    if (msg.toLowerCase().includes("validation"))
      return res.status(400).json({ message: msg });
    res.status(500).json({ message: msg });
  }
};

exports.bulkRemoveModules = async (req, res) => {
  try {
    const { ids = [], moduleIds = [], moduleNames = [] } = req.body;
    const validIds = (Array.isArray(ids) ? ids : [])
      .filter(isValidObjectId)
      .map(toObjectId);
    if (!validIds.length)
      return res.status(400).json({ message: "No valid ids" });

    const idsToRemove = (Array.isArray(moduleIds) ? moduleIds : [])
      .filter(isValidObjectId)
      .map(toObjectId);
    const namesToRemove = (Array.isArray(moduleNames) ? moduleNames : [])
      .map(norm)
      .filter(Boolean);
    if (!idsToRemove.length && !namesToRemove.length)
      return res
        .status(400)
        .json({ message: "Provide moduleIds and/or moduleNames to remove" });

    const result = await Task.updateMany(
      { _id: { $in: validIds } },
      {
        ...(idsToRemove.length
          ? { $pull: { modules: { $in: idsToRemove } } }
          : {}),
        ...(namesToRemove.length
          ? { $pull: { module_names: { $in: namesToRemove } } }
          : {}),
        $set: { updatedAt: new Date() },
      }
    );

    res.status(200).json({
      message: "Bulk modules removed",
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (e) {
    console.error("bulkRemoveModules error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};

exports.bulkDelete = async (req, res) => {
  try {
    const { ids = [] } = req.body;
    const validIds = (Array.isArray(ids) ? ids : [])
      .filter(isValidObjectId)
      .map(toObjectId);
    if (!validIds.length)
      return res.status(400).json({ message: "No valid ids" });

    const result = await Task.deleteMany({ _id: { $in: validIds } });
    res.status(200).json({
      message: "Bulk delete completed",
      deleted: result.deletedCount ?? result.n,
    });
  } catch (e) {
    console.error("bulkDelete error:", e);
    res.status(500).json({ message: e?.message || "Server error" });
  }
};
