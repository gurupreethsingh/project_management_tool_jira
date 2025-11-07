// backend/routes/AttendanceRoutes.js
const express = require("express");
const A = require("../controllers/AttendanceController");

const router = express.Router();

// Optional auth middleware
let protect = (_req, _res, next) => next();
try {
  const auth = require("../middleware/authMiddleware");
  if (typeof auth.protect === "function") protect = auth.protect;
} catch {}

/* ---------------- Sub-router under /attendance ---------------- */
const attendance = express.Router();

/* CRUD & lists */
attendance.post("/create", A.create);
attendance.get("/view-all-attendance", A.list);

// === XLSX EXPORTS ===
// 1) minimal health-check workbook (no DB) — must always download & open
attendance.get("/export.test.xlsx", /*protect,*/ A.exportTestXlsx);

// 2) full DB export (with filters)
attendance.get("/export.xlsx", protect, A.exportData);

attendance.get(
  "/export",
  protect,
  A.exportDataJSON ||
    ((_req, res) =>
      res.status(404).json({ message: "Use /attendance/export.xlsx" }))
);

attendance.get("/counts", A.counts);
attendance.get("/hours-summary", A.hoursSummary);
attendance.get("/calendar", A.calendarView);
attendance.get("/get-or-create", A.getOrCreateForDay);
attendance.get("/:id", A.getById);
attendance.put("/:id", A.updateById);
attendance.delete("/:id", A.removeById);

/* workflow */
attendance.post("/mark", A.markOrUpsertForDay);
attendance.post("/unmark", A.unmarkForDay);
attendance.post("/:id/accept", A.accept);
attendance.post("/:id/reject", A.reject);
attendance.post("/:id/review", A.review);

/* bulk */
attendance.patch("/bulk/status", A.bulkStatus);
attendance.patch("/bulk/assign-project", A.bulkAssignProject);
attendance.patch("/bulk/hours", A.bulkHours);
attendance.patch("/bulk/mark-days", A.bulkMarkDays);
attendance.delete("/bulk", A.bulkDelete);

router.use("/attendance", attendance);

/* -------- convenience aliases at /api root (since you mount with app.use("/api", ...)) ------ */
router.get("/view-all-attendance", A.list);
router.delete("/delete-attendance/:id", A.removeById);

// under sub-router:
attendance.get(
  "/count-attendance/employee/:userId",
  protect,
  A.countAttendanceByEmployee
);

// base-path alias (convenience):
router.get(
  "/count-attendance/employee/:userId",
  protect,
  A.countAttendanceByEmployee
);

module.exports = router;
