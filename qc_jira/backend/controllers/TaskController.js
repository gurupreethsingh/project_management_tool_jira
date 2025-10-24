// controllers/TaskController.js
const mongoose = require("mongoose");
const Task = require("../models/TaskModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");

/** Utilities */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

/** Build filter from query params */
function buildTaskFilter(query = {}) {
  const filter = {};

  if (query.project && isValidObjectId(query.project)) {
    filter.project = toObjectId(query.project);
  }
  if (query.status) {
    // comma-separated list allowed
    const statuses = String(query.status)
      .split(",")
      .map((s) => s.trim());
    filter.status = { $in: statuses };
  }
  if (query.priority) {
    const priorities = String(query.priority)
      .split(",")
      .map((s) => s.trim());
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
    const s = String(query.search).trim();
    filter.$or = [
      { title: { $regex: s, $options: "i" } },
      { description: { $regex: s, $options: "i" } },
    ];
  }

  return filter;
}

/** GET /api/tasks */
exports.getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "-updatedAt", // ex: "deadline" or "-deadline status"
      select, // optional field projection: "title status deadline"
    } = req.query;

    const filter = buildTaskFilter(req.query);
    const skip = (Number(page) - 1) * Number(limit);

    let query = Task.find(filter)
      .populate("project", "name")
      .populate("assignedUsers", "name email role")
      .populate("history.statusChanges.changedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    if (select) query = query.select(select.replaceAll(",", " "));

    const [items, total] = await Promise.all([
      query.lean(),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      items,
    });
  } catch (error) {
    console.error("getAllTasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/tasks/:id */
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const task = await Task.findById(id)
      .populate("project", "name")
      .populate("assignedUsers", "name email role")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    console.error("getTaskById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** POST /api/tasks */
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedUsers = [],
      status, // optional, defaults to "new"
      priority, // optional
      startDate,
      deadline,
    } = req.body;

    if (!title || !project || !startDate || !deadline) {
      return res.status(400).json({
        message: "title, project, startDate, deadline are required",
      });
    }
    if (!isValidObjectId(project))
      return res.status(400).json({ message: "Invalid project id" });

    // Ensure project exists
    const proj = await Project.findById(project).select("_id");
    if (!proj) return res.status(404).json({ message: "Project not found" });

    // Validate dates
    const sDate = new Date(startDate);
    const dDate = new Date(deadline);
    if (isNaN(sDate) || isNaN(dDate) || sDate > dDate) {
      return res
        .status(400)
        .json({ message: "Invalid dates: startDate must be <= deadline" });
    }

    // Validate users if provided
    const assigneesClean = (assignedUsers || []).filter(isValidObjectId);
    if (assigneesClean.length) {
      const count = await User.countDocuments({
        _id: { $in: assigneesClean },
      });
      if (count !== assigneesClean.length) {
        return res.status(400).json({ message: "One or more users invalid" });
      }
    }

    // Initial history
    const initialStatus = status || "new";
    const creatorId = req.user?._id || req.user?.id || null;

    const task = new Task({
      title,
      description,
      project,
      assignedUsers: assigneesClean,
      status: initialStatus,
      priority: priority || "medium",
      startDate: sDate,
      deadline: dDate,
      createdAt: new Date(),
      updatedAt: new Date(),
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

    await task.save();
    const doc = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedUsers", "name email role")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    res.status(201).json({ message: "Task created", task: doc });
  } catch (error) {
    console.error("createTask error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** PUT /api/tasks/:id (general update) */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const updates = {};
    const allowed = [
      "title",
      "description",
      "project",
      "assignedUsers",
      "priority",
      "startDate",
      "deadline",
      "status",
    ];

    for (const k of allowed) {
      if (k in req.body) updates[k] = req.body[k];
    }

    // Validate project if present
    if (updates.project) {
      if (!isValidObjectId(updates.project))
        return res.status(400).json({ message: "Invalid project id" });
      const exists = await Project.exists({ _id: updates.project });
      if (!exists)
        return res.status(404).json({ message: "Project not found" });
    }

    // Validate users if present
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

    // Validate dates if present
    const current = await Task.findById(id);
    if (!current) return res.status(404).json({ message: "Task not found" });

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

    // Handle status change -> push to history
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

    updates.updatedAt = new Date();

    const updateOps = pushHistory
      ? { $set: updates, $push: pushHistory }
      : { $set: updates };

    await Task.updateOne({ _id: id }, updateOps);

    const updated = await Task.findById(id)
      .populate("project", "name")
      .populate("assignedUsers", "name email role")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    res.status(200).json({ message: "Task updated", task: updated });
  } catch (error) {
    console.error("updateTask error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /api/tasks/:id/status */
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
    // Ensure history array exists with an object at index 0
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
      .populate("project", "name")
      .populate("assignedUsers", "name email role")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    res
      .status(200)
      .json({ message: `Status changed ${prev} → ${status}`, task: doc });
  } catch (error) {
    console.error("updateTaskStatus error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /api/tasks/:id/assign (replace entire list) */
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
      .populate("project", "name")
      .populate("assignedUsers", "name email role")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Assignees replaced", task: updated });
  } catch (error) {
    console.error("replaceAssignees error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /api/tasks/:id/assignees/add */
exports.addAssignees = async (req, res) => {
  try {
    const { id } = req.params;
    const { users = [] } = req.body; // array
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
      .populate("project", "name")
      .populate("assignedUsers", "name email role")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Assignees added", task: updated });
  } catch (error) {
    console.error("addAssignees error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /api/tasks/:id/assignees/remove */
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
      .populate("project", "name")
      .populate("assignedUsers", "name email role")
      .populate("history.statusChanges.changedBy", "name email")
      .lean();

    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Assignees removed", task: updated });
  } catch (error) {
    console.error("removeAssignees error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** DELETE /api/tasks/:id */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid task id" });

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("deleteTask error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/projects/:projectId/tasks */
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidObjectId(projectId))
      return res.status(400).json({ message: "Invalid project id" });

    const tasks = await Task.find({ project: projectId })
      .populate("assignedUsers", "name email role")
      .lean();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("getTasksByProject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/users/:userId/tasks */
exports.getTasksForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId))
      return res.status(400).json({ message: "Invalid user id" });

    const tasks = await Task.find({ assignedUsers: userId })
      .populate("project", "name")
      .lean();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("getTasksForUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/tasks/:id/history */
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
  } catch (error) {
    console.error("getTaskHistory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/tasks-counts (by status + overdue) */
exports.getTaskCounts = async (_req, res) => {
  try {
    const now = new Date();
    const byStatus = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const overdue = await Task.countDocuments({
      deadline: { $lt: now },
      status: { $nin: ["finished", "closed"] },
    });
    res.status(200).json({ byStatus, overdue });
  } catch (error) {
    console.error("getTaskCounts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/tasks-due-soon?days=7 */
exports.getDueSoon = async (req, res) => {
  try {
    const days = Number(req.query.days || 7);
    const now = new Date();
    const soon = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      deadline: { $gte: now, $lte: soon },
      status: { $nin: ["finished", "closed"] },
    })
      .populate("project", "name")
      .populate("assignedUsers", "name email")
      .sort("deadline")
      .lean();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("getDueSoon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
