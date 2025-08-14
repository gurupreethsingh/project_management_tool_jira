const express = require("express");
const router = express.Router();
const AttendanceController = require("../controllers/AttendanceController");
const { protect, isAdminOrSuperadmin } = require("../middleware/authMiddleware");

// 💼 Employee Routes
router.post("/create-attendance", protect, AttendanceController.createAttendance);
router.get("/get-single-attendance/:id", protect, AttendanceController.getSingleAttendance);
router.put("/update-attendance/:id", protect, AttendanceController.updateAttendance);
router.delete("/delete-attendance/:id", protect, AttendanceController.deleteAttendance);

// 🛡 Admin/Superadmin Routes
router.get("/view-all-attendance", protect, isAdminOrSuperadmin, AttendanceController.getAllAttendance);
router.put("/approve-attendance/:id", protect, isAdminOrSuperadmin, AttendanceController.approveAttendance);
router.put("/reject-attendance/:id", protect, isAdminOrSuperadmin, AttendanceController.rejectAttendance);

// 📊 Stats & Count
router.get("/count-attendance", protect, isAdminOrSuperadmin, AttendanceController.countAttendance);
router.get("/count-attendance/employee/:employeeId", protect, AttendanceController.countByEmployee);
router.get("/count-attendance/project/:projectId", protect, AttendanceController.countByProject);

// 🗓️ Calendar Route — Marked dates for a user (used in CreateAttendance.jsx)
router.get("/attendance/dates/:userId", protect, AttendanceController.getMarkedDates);

// 📥 Download Excel
router.get("/download-attendance-excel", protect, isAdminOrSuperadmin, AttendanceController.downloadAttendanceExcel);

module.exports = router;
