const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/AttendanceController");
const { protect, isAdminOrSuperadmin } = require("../middleware/authMiddleware");

// 💼 Employee Routes
router.post("/create-attendence", protect, attendanceController.createAttendance);
router.get("/get-my-attendence/:id", protect, attendanceController.getMyAttendance);
router.put("/update-attendence/:id", protect, attendanceController.updateAttendance);
router.delete("/delete-attendence/:id", protect, attendanceController.deleteAttendance);

// 🛡 Admin/Superadmin Routes
router.get("/get-all-attendence", protect, isAdminOrSuperadmin, attendanceController.getAllAttendance);
router.put("/approve-attendence/:id", protect, isAdminOrSuperadmin, attendanceController.approveAttendance);
router.put("/reject-attendence/:id", protect, isAdminOrSuperadmin, attendanceController.rejectAttendance);

// 📊 Stats & Count
router.get("/count-attendence", protect, isAdminOrSuperadmin, attendanceController.countAttendance);
router.get("/count-attendence/employee/:employeeId", protect, isAdminOrSuperadmin, attendanceController.countByEmployee);
router.get("/count-attendence/project/:projectId", protect, isAdminOrSuperadmin, attendanceController.countByProject);

module.exports = router;


// axios.post("http://localhost/5000/api/create-attendence")
// axios.get("http://localhost/5000/api/get-all-attendence")
// axios.get("http://localhost/5000/api/get-my-attendence/:id") in frontend. 