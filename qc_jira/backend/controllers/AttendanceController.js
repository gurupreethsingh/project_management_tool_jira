const Attendance = require("../models/AttendanceModel");
const User = require("../models/UserModel");
const ExcelJS = require("exceljs");

// ➕ Create attendance (Employee)
exports.createAttendance = async (req, res) => {
  try {
    const { date, hoursWorked, taskDescription, project, location, shift, isBillable } = req.body;

    if (!date || !hoursWorked || !project) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const existing = await Attendance.findOne({
      employee: req.user._id,
      date: new Date(date),
    });

    if (existing) {
      return res.status(400).json({ error: "Attendance for this date already submitted." });
    }

    const attendance = await Attendance.create({
      employee: req.user._id,
      date,
      hoursWorked,
      taskDescription,
      project,
      location,
      shift,
      isBillable,
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error in createAttendance:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get All Attendance (Admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .sort({ date: -1 })
      .populate("employee", "name avatar email role")
      .populate("project", "project_name");

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
};

// 🔍 Get My Attendance (for logged-in employee)
exports.getMyAttendance = async (req, res) => {
  try {
    const attendances = await Attendance.find({ employee: req.params.id })
      .sort({ date: -1 })
      .populate("project", "project_name");

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Approve attendance
exports.approveAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ error: "Attendance not found" });

    attendance.status = "Approved";
    attendance.approvedBy = req.user._id;
    attendance.approvedOrRejectedAt = Date.now();
    await attendance.save();

    res.status(200).json({ message: "Attendance approved", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Reject attendance
exports.rejectAttendance = async (req, res) => {
  try {
    const { remarks } = req.body;
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ error: "Attendance not found" });

    attendance.status = "Rejected";
    attendance.approvedBy = req.user._id;
    attendance.approvedOrRejectedAt = Date.now();
    attendance.remarks = remarks;
    await attendance.save();

    res.status(200).json({ message: "Attendance rejected", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ error: "Attendance not found" });

    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
    const isOwner = req.user._id.toString() === attendance.employee.toString();

    if (attendance.status === "Approved" && !isAdmin) {
      return res.status(403).json({ error: "Cannot update approved attendance" });
    }

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const fields = [
      "hoursWorked",
      "taskDescription",
      "project",
      "location",
      "shift",
      "isBillable",
      "remarks", // ✅ Allow updating remarks
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        attendance[field] = req.body[field];
      }
    });

    if (isAdmin) attendance.modifiedByAdmin = true;

    await attendance.save();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑 Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ error: "Attendance not found" });

    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Count attendance records
exports.countAttendance = async (req, res) => {
  try {
    const total = await Attendance.countDocuments();
    const pending = await Attendance.countDocuments({ status: "Pending" });
    const approved = await Attendance.countDocuments({ status: "Approved" });
    const rejected = await Attendance.countDocuments({ status: "Rejected" });

    res.status(200).json({ total, pending, approved, rejected });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Count attendance for employee
exports.countByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const count = await Attendance.countDocuments({ employee: employeeId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Count attendance for project
exports.countByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const count = await Attendance.countDocuments({ project: projectId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📅 Get marked attendance dates for calendar (new API)
exports.getMarkedDates = async (req, res) => {
  try {
    const userId = req.params.userId;

    const records = await Attendance.find({ employee: userId }).populate("project", "project_name");

    const result = records.map((rec) => ({
      date: rec.date.toISOString().split("T")[0],
      taskDescription: rec.taskDescription,
      projectName: rec.project?.project_name || "Unknown",
      hoursWorked: rec.hoursWorked,
      location: rec.location,
      shift: rec.shift,
      isBillable: rec.isBillable,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getMarkedDates:", error);
    res.status(500).json({ error: "Failed to fetch attendance dates" });
  }
};

// 🔍 Get Single Attendance by ID
exports.getSingleAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("employee", "name email role")
      .populate("project", "project_name");

    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching single attendance:", error);
    res.status(500).json({ error: "Server error" });
  }
};




exports.downloadAttendanceExcel = async (req, res) => {
  try {
    const attendanceData = await Attendance.find()
      .populate("employee", "name email")
      .populate("project", "project_name")
      .sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    // Add Headers
    worksheet.columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Employee Name", key: "employeeName", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Project", key: "projectName", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "Hours Worked", key: "hoursWorked", width: 15 },
      { header: "Status", key: "status", width: 12 },
      { header: "Task Description", key: "taskDescription", width: 25 },
      { header: "Location", key: "location", width: 15 },
      { header: "Shift", key: "shift", width: 10 },
      { header: "Billable", key: "isBillable", width: 10 },
    ];

    // Add Rows
    attendanceData.forEach((record, index) => {
      worksheet.addRow({
        sno: index + 1,
        employeeName: record.employee?.name || "N/A",
        email: record.employee?.email || "N/A",
        projectName: record.project?.project_name || "N/A",
        date: new Date(record.date).toLocaleDateString(),
        hoursWorked: record.hoursWorked,
        status: record.status,
        taskDescription: record.taskDescription || "",
        location: record.location || "",
        shift: record.shift || "",
        isBillable: record.isBillable ? "Yes" : "No",
      });
    });

    // Format response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.xlsx");

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ error: "Failed to generate Excel" });
  }
};
