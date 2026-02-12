// routes/ToDoRoutes.js
const express = require("express");
const router = express.Router();

const ToDoController = require("../controllers/ToDoController");
const { protect } = require("../middleware/authMiddleware"); // ✅ add this

// ✅ Protect all ToDo routes (per-user tasks)
router.use(protect);

router.post("/create-tak", ToDoController.createTask);
router.get("/list-tasks", ToDoController.listTasks);
router.get("/counts", ToDoController.getCounts);

router.post("/bulk-delete", ToDoController.bulkDelete);
router.post("/bulk-status", ToDoController.bulkUpdateStatus);
router.post("/bulk-reschedule", ToDoController.bulkReschedule);

router.post("/bulk-reorder", ToDoController.bulkReorder);

router.get("/get-task-by-id/:id", ToDoController.getTaskById);
router.put("/update-task-by-id/:id", ToDoController.updateTask);
router.delete("/delete-task-by-id/:id", ToDoController.deleteTask);

router.post("/finish-task/:id/finish", ToDoController.markFinished);
router.post("/reopen-task/:id/reopen", ToDoController.reopenTask);

module.exports = router;
