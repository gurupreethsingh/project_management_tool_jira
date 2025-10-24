// routes/TaskRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  replaceAssignees,
  addAssignees,
  removeAssignees,
  deleteTask,
  getTasksByProject,
  getTasksForUser,
  getTaskHistory,
  getTaskCounts,
  getDueSoon,
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

/** ===== Routes ===== */
// List / filter / paginate tasks
router.get("/tasks", protect, getAllTasks);

// Quick counts (by status, overdue)
router.get("/tasks-counts", protect, getTaskCounts);

// Due soon (default 7 days, override ?days=14)
router.get("/tasks-due-soon", protect, getDueSoon);

// Create
router.post("/tasks", protect, createTask);

// Read single
router.get("/tasks/:id", protect, getTaskById);

// Update (general fields)
router.put("/tasks/:id", protect, updateTask);

// Update status with history push
router.patch("/tasks/:id/status", protect, updateTaskStatus);

// Replace assignees
router.patch("/tasks/:id/assign", protect, replaceAssignees);

// Add / remove assignees
router.patch("/tasks/:id/assignees/add", protect, addAssignees);
router.patch("/tasks/:id/assignees/remove", protect, removeAssignees);

// Delete
router.delete("/tasks/:id", protect, requireAdmin, deleteTask);

// By project / user
router.get("/projects/:projectId/tasks", protect, getTasksByProject);
router.get("/users/:userId/tasks", protect, getTasksForUser);

// History
router.get("/tasks/:id/history", protect, getTaskHistory);

module.exports = router;
