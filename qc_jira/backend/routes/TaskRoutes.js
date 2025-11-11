// routes/TaskRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const {
  // extra
  getModulesForProject,

  // reads
  getAllTasks,
  getTaskById,
  getTasksByProject,
  getTasksForUser,
  getTaskHistory,
  getTaskCounts,
  getDueSoon,

  // create / update / delete
  createTask,
  updateTask,
  updateTaskStatus,
  replaceAssignees,
  addAssignees,
  removeAssignees,
  deleteTask,

  // module operations (single task)
  replaceModules,
  addModules,
  removeModules,

  // bulk
  bulkUpdateStatus,
  bulkReplaceAssignees,
  bulkAddModules,
  bulkRemoveModules,
  bulkDelete,
} = require("../controllers/TaskController");

const router = express.Router();

/** ===== Auth middlewares (aligned with your index.js) ===== */
const protect = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || "";
    if (!hdr.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized, no token" });
    const token = hdr.split(" ")[1];
    const decoded = jwt.verify(token, "ecoders_jwt_secret");
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const requireAdmin = (req, _res, next) => {
  if (req.user && ["admin", "superadmin"].includes(req.user.role))
    return next();
  return _res.status(403).json({ error: "Permission denied" });
};

/** ===== ROUTE ORDER MATTERS! Put BULK routes BEFORE any :id routes ===== */

// Bulk operations (specific paths first to avoid matching :id)
router.patch("/tasks/bulk/status", protect, bulkUpdateStatus);
router.patch("/tasks/bulk/assign", protect, bulkReplaceAssignees);
router.patch("/tasks/bulk/modules/add", protect, bulkAddModules);
router.patch("/tasks/bulk/modules/remove", protect, bulkRemoveModules);
router.delete("/tasks/bulk", protect, requireAdmin, bulkDelete);

/** ===== The rest ===== */

// Project modules (for dropdowns / counts UI)
router.get("/projects/:projectId/modules", protect, getModulesForProject);

// List / filter / paginate tasks
router.get("/tasks", protect, getAllTasks);

// Quick counts (groupable by status|priority|module|assignee, plus overdue)
router.get("/tasks-counts", protect, getTaskCounts);

// Due soon (default 7 days, override ?days=14)
router.get("/tasks-due-soon", protect, getDueSoon);

// Create
router.post("/tasks", protect, createTask);

// Read single (restrict :id to a 24-hex ObjectId)
router.get("/tasks/:id([0-9a-fA-F]{24})", protect, getTaskById);

// Update (general fields)
router.put("/tasks/:id([0-9a-fA-F]{24})", protect, updateTask);

// Update status with history push
router.patch("/tasks/:id([0-9a-fA-F]{24})/status", protect, updateTaskStatus);

// Replace assignees
router.patch("/tasks/:id([0-9a-fA-F]{24})/assign", protect, replaceAssignees);

// Add / remove assignees
router.patch(
  "/tasks/:id([0-9a-fA-F]{24})/assignees/add",
  protect,
  addAssignees
);
router.patch(
  "/tasks/:id([0-9a-fA-F]{24})/assignees/remove",
  protect,
  removeAssignees
);

// Module editing on single task
router.patch(
  "/tasks/:id([0-9a-fA-F]{24})/modules/replace",
  protect,
  replaceModules
);
router.patch("/tasks/:id([0-9a-fA-F]{24})/modules/add", protect, addModules);
router.patch(
  "/tasks/:id([0-9a-fA-F]{24})/modules/remove",
  protect,
  removeModules
);

// Delete single
router.delete("/tasks/:id([0-9a-fA-F]{24})", protect, requireAdmin, deleteTask);

// By project / user
router.get(
  "/projects/:projectId([0-9a-fA-F]{24})/tasks",
  protect,
  getTasksByProject
);
router.get("/users/:userId([0-9a-fA-F]{24})/tasks", protect, getTasksForUser);

// History
router.get("/tasks/:id([0-9a-fA-F]{24})/history", protect, getTaskHistory);

module.exports = router;
