// controllers/ReportController.js
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const { Document, Packer, Paragraph, HeadingLevel, TextRun } = require("docx");
const { Report } = require("../models/ReportModel");
const { Project } = require("../models/ProjectModel"); // make sure path is correct
const { Task } = require("../models/TaskModel"); // make sure path is correct
// const { Notification } = require("../models/NotificationModel"); // if you have one

// -----------------------------------------------------------------------------
// Helper: get current user id from auth middleware (fallback to body for now)
// -----------------------------------------------------------------------------
function getUserId(req) {
  if (req.user && req.user._id) return req.user._id;
  if (req.user && req.user.id) return req.user.id;
  return req.body.currentUserId || req.body.createdBy || null;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// -----------------------------------------------------------------------------
// Helper: build filter object for queries (list / count / stats)
// -----------------------------------------------------------------------------
function buildReportFilter(queryParams = {}) {
  const {
    project,
    task,
    reporter,
    recipient,
    overallStatus,
    taskStatus,
    fromDate,
    toDate,
    includeDeleted,
    onlyDeleted,
    q,
    isViewed,
    onlyGeneral, // NEW OPTIONAL: filter only general reports (no project/task)
  } = queryParams;

  const filter = {};

  // Deleted flags
  if (onlyDeleted === "true" || onlyDeleted === true) {
    filter.isDeleted = true;
  } else if (includeDeleted === "true" || includeDeleted === true) {
    // include all
  } else {
    filter.isDeleted = false;
  }

  // View status filter (handle string 'true'/'false' from query)
  if (typeof isViewed === "string") {
    if (isViewed.toLowerCase() === "true") {
      filter.isViewed = true;
    } else if (isViewed.toLowerCase() === "false") {
      filter.isViewed = false;
    }
  } else if (isViewed === true || isViewed === false) {
    filter.isViewed = isViewed;
  }

  // General vs linked reports
  if (onlyGeneral === "true") {
    // reports with NO project AND NO task
    filter.project = { $exists: true, $eq: null };
    filter.task = { $exists: true, $eq: null };
  } else {
    if (project) filter.project = project;
    if (task) filter.task = task;
  }

  if (reporter) filter.reporter = reporter;
  if (recipient) filter.recipients = recipient;
  if (overallStatus) filter.overallStatus = overallStatus;
  if (taskStatus) filter.taskStatusAtReport = taskStatus;

  // Date range on createdAt
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) {
      filter.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  // Simple text search
  if (q && typeof q === "string" && q.trim() !== "") {
    const regex = new RegExp(q.trim(), "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { remarks: regex },
      { blockers: regex },
      { nonSubmissionReason: regex },
    ];
  }

  return filter;
}

// -----------------------------------------------------------------------------
// =============== CREATE REPORT (C in CRUD) ===============
// -----------------------------------------------------------------------------
async function createReport(req, res) {
  try {
    const currentUserId = getUserId(req);

    const {
      project,
      task,
      title,
      description,
      submissionCriteria,
      criteriaMet,
      taskStatusAtReport,
      completionPercentage,
      plannedStartDate,
      plannedEndDate,
      actualStartDate,
      actualEndDate,
      timeSpentMinutes,
      overtimeMinutes,
      extension,
      remarks,
      blockers,
      nonSubmissionReason,
      recipients,
    } = req.body;

    // ✅ Only title is strictly required
    if (!title || String(title).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "title is required.",
      });
    }

    if (!currentUserId || !isValidObjectId(currentUserId)) {
      return res.status(400).json({
        success: false,
        message:
          "current user not found. Ensure auth middleware sets req.user or send a valid currentUserId.",
      });
    }

    let projectId = null;
    let taskId = null;

    // ✅ If project is sent, validate it
    if (project) {
      if (!isValidObjectId(project)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project id.",
        });
      }
      const projExists = await Project.exists({ _id: project });
      if (!projExists) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }
      projectId = project;
    }

    // ✅ If task is sent, validate it
    if (task) {
      if (!isValidObjectId(task)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task id.",
        });
      }
      const taskDoc = await Task.findById(task)
        .select("_id project task_title title")
        .lean();
      if (!taskDoc) {
        return res.status(404).json({
          success: false,
          message: "Task not found.",
        });
      }

      // If both project and task are present, enforce that they match
      if (
        projectId &&
        taskDoc.project &&
        String(taskDoc.project) !== String(projectId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Task does not belong to the selected project. Please choose a matching task or project.",
        });
      }

      // If project was not given but task has project → infer project automatically
      if (!projectId && taskDoc.project) {
        projectId = taskDoc.project;
      }

      taskId = taskDoc._id;
    }

    const report = new Report({
      project: projectId, // may be null => general report
      task: taskId, // may be null => general report
      reporter: currentUserId,
      recipients: recipients || [],
      title: String(title).trim(),
      description,
      submissionCriteria,
      criteriaMet,
      taskStatusAtReport,
      completionPercentage,
      plannedStartDate,
      plannedEndDate,
      actualStartDate,
      actualEndDate,
      timeSpentMinutes,
      overtimeMinutes,
      extension,
      remarks,
      blockers,
      nonSubmissionReason,
      createdBy: currentUserId,
      updatedBy: currentUserId,
    });

    await report.save();

    return res.status(201).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("createReport error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create report.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== GET SINGLE REPORT (R in CRUD) ===============
// -----------------------------------------------------------------------------
async function getReportById(req, res) {
  try {
    const { id } = req.params;

    // 👇 add this guard
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report id.",
      });
    }

    const report = await Report.findOne({ _id: id })
      .populate("project", "name key")
      .populate("task", "title status")
      .populate("reporter", "name email")
      .populate("recipients", "name email");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("getReportById error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get report.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== LIST / FILTER / SORT REPORTS (R in CRUD) ===============
// -----------------------------------------------------------------------------
async function listReports(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortDir = "desc",
    } = req.query;

    const filter = buildReportFilter(req.query);

    // Validate sort field
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "completionPercentage",
      "overallStatus",
      "taskStatusAtReport",
      "plannedEndDate",
      "actualEndDate",
      "timeSpentMinutes",
      "isViewed",
      "viewedAt",
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortDir === "asc" ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Report.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate("project", "name key")
        .populate("task", "title status")
        .populate("reporter", "name email"),
      Report.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        sortBy: sortField,
        sortDir: sortDir === "asc" ? "asc" : "desc",
      },
    });
  } catch (err) {
    console.error("listReports error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to list reports.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== UPDATE REPORT (U in CRUD) ===============
// -----------------------------------------------------------------------------
async function updateReport(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = getUserId(req);

    const allowedFields = [
      "title",
      "description",
      "submissionCriteria",
      "criteriaMet",
      "taskStatusAtReport",
      "completionPercentage",
      "plannedStartDate",
      "plannedEndDate",
      "actualStartDate",
      "actualEndDate",
      "timeSpentMinutes",
      "overtimeMinutes",
      "extension",
      "remarks",
      "blockers",
      "nonSubmissionReason",
      "recipients",
      "overallStatus",
      "attachments",
      "isViewed",
      "viewedAt",
    ];

    const update = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    if (currentUserId) {
      update.updatedBy = currentUserId;
    }

    const report = await Report.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: update },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found or deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("updateReport error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update report.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== CHANGE STATUS ONLY ===============
// -----------------------------------------------------------------------------
async function changeStatus(req, res) {
  try {
    const { id } = req.params;
    const { overallStatus } = req.body;
    const currentUserId = getUserId(req);

    if (
      !["draft", "submitted", "under_review", "approved", "rejected"].includes(
        overallStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid overallStatus value.",
      });
    }

    const report = await Report.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          overallStatus,
          updatedBy: currentUserId || undefined,
        },
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found or deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("changeStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to change report status.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== MARK AS VIEWED (new) ===============
// Call this when user opens the report detail page
// -----------------------------------------------------------------------------
async function markAsViewed(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = getUserId(req);

    const report = await Report.findOne({ _id: id, isDeleted: false });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found or deleted.",
      });
    }

    if (!report.isViewed) {
      report.isViewed = true;
      report.viewedAt = new Date();
    }

    if (currentUserId) {
      report.updatedBy = currentUserId;
    }

    await report.save();

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("markAsViewed error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to mark report as viewed.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== SOFT DELETE (D in CRUD - soft) ===============
// -----------------------------------------------------------------------------
async function softDeleteReport(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = getUserId(req);

    const report = await Report.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          updatedBy: currentUserId || undefined,
        },
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found or already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted (soft).",
      data: report,
    });
  } catch (err) {
    console.error("softDeleteReport error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete report.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== HARD DELETE (permanent) ===============
// -----------------------------------------------------------------------------
async function hardDeleteReport(req, res) {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    await Report.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Report permanently deleted.",
    });
  } catch (err) {
    console.error("hardDeleteReport error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to hard delete report.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== RESTORE (soft deleted -> active) ===============
// -----------------------------------------------------------------------------
async function restoreReport(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = getUserId(req);

    const report = await Report.findOneAndUpdate(
      { _id: id, isDeleted: true },
      {
        $set: {
          isDeleted: false,
          updatedBy: currentUserId || undefined,
        },
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found or already active.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report restored.",
      data: report,
    });
  } catch (err) {
    console.error("restoreReport error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to restore report.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== COUNT REPORTS (with same filters) ===============
// Used by: GET /api/reports/count
// -----------------------------------------------------------------------------
async function countReports(req, res) {
  try {
    const filter = buildReportFilter(req.query);
    const total = await Report.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: {
        total,
      },
    });
  } catch (err) {
    console.error("countReports error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to count reports.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== COUNT REPORTS GROUPED (status / project / reporter / task) ===============
// groupBy allowed: overallStatus | taskStatusAtReport | project | reporter | task
// -----------------------------------------------------------------------------
async function countReportsGrouped(req, res) {
  try {
    const { groupBy = "overallStatus" } = req.query;

    const allowedGroupFields = [
      "overallStatus",
      "taskStatusAtReport",
      "project",
      "reporter",
      "task",
    ];
    if (!allowedGroupFields.includes(groupBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid groupBy value. Use one of: ${allowedGroupFields.join(
          ", "
        )}`,
      });
    }

    const filter = buildReportFilter(req.query);
    if (filter[groupBy]) {
      delete filter[groupBy];
    }

    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: `$${groupBy}`,
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ];

    const results = await Report.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      data: {
        groupBy,
        results,
      },
    });
  } catch (err) {
    console.error("countReportsGrouped error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get grouped counts.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== REPORT STATS OVERVIEW (multi-facet dashboard) ===============
// -----------------------------------------------------------------------------
async function getReportStatsOverview(req, res) {
  try {
    const filter = buildReportFilter(req.query);

    const pipeline = [
      { $match: filter },
      {
        $facet: {
          total: [{ $count: "value" }],
          byOverallStatus: [
            {
              $group: {
                _id: "$overallStatus",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          byTaskStatus: [
            {
              $group: {
                _id: "$taskStatusAtReport",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          byProject: [
            {
              $group: {
                _id: "$project",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          byReporter: [
            {
              $group: {
                _id: "$reporter",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ];

    const [result] = await Report.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      data: {
        total:
          result &&
          Array.isArray(result.total) &&
          result.total[0] &&
          result.total[0].value
            ? result.total[0].value
            : 0,
        byOverallStatus: result.byOverallStatus,
        byTaskStatus: result.byTaskStatus,
        byProject: result.byProject,
        byReporter: result.byReporter,
      },
    });
  } catch (err) {
    console.error("getReportStatsOverview error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get report stats overview.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== BULK CHANGE STATUS ===============
// body: { ids: [...], overallStatus: "submitted" }
// -----------------------------------------------------------------------------
async function bulkChangeStatus(req, res) {
  try {
    const { ids, overallStatus } = req.body;
    const currentUserId = getUserId(req);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required.",
      });
    }

    if (
      !["draft", "submitted", "under_review", "approved", "rejected"].includes(
        overallStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid overallStatus value.",
      });
    }

    const result = await Report.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        $set: {
          overallStatus,
          updatedBy: currentUserId || undefined,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Bulk status update completed.",
      data: {
        matched: result.matchedCount ?? result.n,
        modified: result.modifiedCount ?? result.nModified,
      },
    });
  } catch (err) {
    console.error("bulkChangeStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk change status.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== BULK SOFT DELETE ===============
// body: { ids: [...] }
// -----------------------------------------------------------------------------
async function bulkSoftDeleteReports(req, res) {
  try {
    const { ids } = req.body;
    const currentUserId = getUserId(req);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required.",
      });
    }

    const result = await Report.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          updatedBy: currentUserId || undefined,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Bulk soft delete completed.",
      data: {
        matched: result.matchedCount ?? result.n,
        modified: result.modifiedCount ?? result.nModified,
      },
    });
  } catch (err) {
    console.error("bulkSoftDeleteReports error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk soft delete reports.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== BULK HARD DELETE ===============
// body: { ids: [...] }
// -----------------------------------------------------------------------------
async function bulkHardDeleteReports(req, res) {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required.",
      });
    }

    const result = await Report.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      success: true,
      message: "Bulk hard delete completed.",
      data: {
        deleted: result.deletedCount,
      },
    });
  } catch (err) {
    console.error("bulkHardDeleteReports error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk hard delete reports.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== BULK RESTORE (from soft delete) ===============
// body: { ids: [...] }
// -----------------------------------------------------------------------------
async function bulkRestoreReports(req, res) {
  try {
    const { ids } = req.body;
    const currentUserId = getUserId(req);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required.",
      });
    }

    const result = await Report.updateMany(
      { _id: { $in: ids }, isDeleted: true },
      {
        $set: {
          isDeleted: false,
          updatedBy: currentUserId || undefined,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Bulk restore completed.",
      data: {
        matched: result.matchedCount ?? result.n,
        modified: result.modifiedCount ?? result.nModified,
      },
    });
  } catch (err) {
    console.error("bulkRestoreReports error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk restore reports.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== BULK UPDATE RECIPIENTS ===============
// body: { ids: [...], recipients: [...] }  (full replace of recipients)
// -----------------------------------------------------------------------------
async function bulkUpdateRecipients(req, res) {
  try {
    const { ids, recipients } = req.body;
    const currentUserId = getUserId(req);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required.",
      });
    }

    if (!Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        message: "recipients array is required.",
      });
    }

    const result = await Report.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        $set: {
          recipients,
          updatedBy: currentUserId || undefined,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Bulk recipients update completed.",
      data: {
        matched: result.matchedCount ?? result.n,
        modified: result.modifiedCount ?? result.nModified,
      },
    });
  } catch (err) {
    console.error("bulkUpdateRecipients error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk update recipients.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// =============== EXPORT (EXCEL / WORD) – STUB ===============
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// =============== EXPORT (EXCEL / WORD) – REAL IMPLEMENTATION ===============
// -----------------------------------------------------------------------------
async function exportReport(req, res) {
  try {
    const { id, format } = req.params; // format = 'excel' or 'word'

    if (!["excel", "word"].includes(format)) {
      return res.status(400).json({
        success: false,
        message: "Invalid export format. Use 'excel' or 'word'.",
      });
    }

    const report = await Report.findOne({ _id: id, isDeleted: false })
      .populate("project", "name key")
      .populate("task", "title status")
      .populate("reporter", "name email")
      .populate("recipients", "name email");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    // update export metadata (optional)
    report.lastExportedAt = new Date();
    report.lastExportFormat = format;
    await report.save();

    const fileBaseName = `report_${report._id}`;

    if (format === "excel") {
      // ===== EXCEL EXPORT =====
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Report");

      sheet.columns = [
        { header: "Field", key: "field", width: 30 },
        { header: "Value", key: "value", width: 80 },
      ];

      const pushRow = (field, value) => {
        sheet.addRow({
          field,
          value: value != null ? String(value) : "",
        });
      };

      pushRow("Report ID", report._id.toString());
      pushRow("Title", report.title || "");
      pushRow("Project", report.project?.name || "");
      pushRow("Task", report.task?.title || "");
      pushRow(
        "Reporter",
        report.reporter?.name || report.reporter?.email || ""
      );
      pushRow("Overall Status", report.overallStatus || "");
      pushRow("Task Status @ Report", report.taskStatusAtReport || "");
      pushRow("Completion %", report.completionPercentage ?? 0);
      pushRow(
        "Planned Start",
        report.plannedStartDate
          ? new Date(report.plannedStartDate).toLocaleString()
          : ""
      );
      pushRow(
        "Planned End",
        report.plannedEndDate
          ? new Date(report.plannedEndDate).toLocaleString()
          : ""
      );
      pushRow(
        "Actual Start",
        report.actualStartDate
          ? new Date(report.actualStartDate).toLocaleString()
          : ""
      );
      pushRow(
        "Actual End",
        report.actualEndDate
          ? new Date(report.actualEndDate).toLocaleString()
          : ""
      );
      pushRow("Time Spent (mins)", report.timeSpentMinutes ?? "");
      pushRow("Remarks", report.remarks || "");
      pushRow("Blockers", report.blockers || "");
      pushRow("Reason for Non-Submission", report.nonSubmissionReason || "");
      pushRow(
        "Recipients",
        Array.isArray(report.recipients)
          ? report.recipients
              .map((u) => u.name || u.email || "")
              .filter(Boolean)
              .join(", ")
          : ""
      );
      pushRow(
        "Created At",
        report.createdAt ? new Date(report.createdAt).toLocaleString() : ""
      );
      pushRow(
        "Updated At",
        report.updatedAt ? new Date(report.updatedAt).toLocaleString() : ""
      );

      // Header styling
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileBaseName}.xlsx"`
      );

      await workbook.xlsx.write(res);
      return res.end();
    } else {
      // ===== WORD EXPORT =====
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: "Report",
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: report.title || "",
                heading: HeadingLevel.HEADING_1,
              }),

              new Paragraph({
                text: "",
              }),

              new Paragraph({
                children: [
                  new TextRun({ text: "Report ID: ", bold: true }),
                  new TextRun(report._id.toString()),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Project: ", bold: true }),
                  new TextRun(report.project?.name || "N/A"),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Task: ", bold: true }),
                  new TextRun(report.task?.title || "N/A"),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Reporter: ", bold: true }),
                  new TextRun(
                    report.reporter?.name || report.reporter?.email || "N/A"
                  ),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Overall Status: ", bold: true }),
                  new TextRun(report.overallStatus || "N/A"),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Task Status @ Report: ",
                    bold: true,
                  }),
                  new TextRun(report.taskStatusAtReport || "N/A"),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Completion %: ",
                    bold: true,
                  }),
                  new TextRun(String(report.completionPercentage ?? 0)),
                ],
              }),

              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Description",
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph(report.description || "No description provided."),

              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Submission Criteria",
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph(report.submissionCriteria || "Not specified."),

              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Remarks",
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph(report.remarks || "No remarks."),

              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Blockers",
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph(report.blockers || "No blockers mentioned."),

              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Reason for Non-Submission",
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph(report.nonSubmissionReason || "Not applicable."),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileBaseName}.docx"`
      );
      return res.send(buffer);
    }
  } catch (err) {
    console.error("exportReport error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to export report.",
      error: err.message,
    });
  }
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
module.exports = {
  // CRUD
  createReport,
  getReportById,
  listReports,
  updateReport,
  softDeleteReport,
  hardDeleteReport,
  restoreReport,

  // Status change
  changeStatus,
  markAsViewed,

  // Counts / stats
  countReports,
  countReportsGrouped,
  getReportStatsOverview,

  // Bulk
  bulkChangeStatus,
  bulkSoftDeleteReports,
  bulkHardDeleteReports,
  bulkRestoreReports,
  bulkUpdateRecipients,

  // Export
  exportReport,
};
