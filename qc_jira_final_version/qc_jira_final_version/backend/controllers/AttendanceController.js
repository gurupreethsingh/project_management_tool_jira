const Attendance = require("../models/AttendenceModel");
const User = require("../models/UserModel");

// ➕ Create attendance (Employee)
exports.createAttendance = async (req, res) => {
  try {
    const { date, hoursWorked, taskDescription, project, location, shift, isBillable } = req.body;

    const existing = await Attendance.findOne({ employee: req.user._id, date });
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
    res.status(500).json({ error: error.message });
  }
};


exports.getAllAttendance = async (req, res) => {
  console.log("🧑 Logged in user:", req.user);

  try {
    const allAttendance = await Attendance.find()
      .populate("employee", "name avatar email role")
      .populate("project", "project_name");

    res.status(200).json(allAttendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
};


// 🔎 Get all attendance (Admin/Superadmin)
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .sort({ date: -1 })
      .populate("employee", "name email role")
      .populate("project");

    res.status(200).json(attendance);
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

// ✏️ Update attendance (employee before approval or admin)
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

    const fields = ["hoursWorked", "taskDescription", "project", "location", "shift", "isBillable"];
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
