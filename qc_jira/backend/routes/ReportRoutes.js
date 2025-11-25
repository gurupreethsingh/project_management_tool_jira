// routes/ReportRoutes.js
const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");

// If you have auth middleware, plug it here
// const auth = require("../middleware/auth");

// -----------------------------------------------------------------------------
// VERY IMPORTANT: Route order matters!
// Put literal/specific routes BEFORE generic /reports/:id
// -----------------------------------------------------------------------------

// ------------------------------------------------------
// CREATE
// ------------------------------------------------------
router.post(
  "/all-reports",
  // auth,
  ReportController.createReport
);

// ------------------------------------------------------
// COUNTS / STATS (no :id here)
// ------------------------------------------------------
router.get(
  "/reports/count",
  // auth,
  ReportController.countReports
);

router.get(
  "/reports/count-grouped",
  // auth,
  ReportController.countReportsGrouped
);

router.get(
  "/reports/stats/overview",
  // auth,
  ReportController.getReportStatsOverview
);

// ------------------------------------------------------
// BULK OPERATIONS (no :id here)
// ------------------------------------------------------
router.patch(
  "/reports/bulk/status",
  // auth,
  ReportController.bulkChangeStatus
);

router.patch(
  "/reports/bulk/soft-delete",
  // auth,
  ReportController.bulkSoftDeleteReports
);

router.delete(
  "/reports/bulk/hard-delete",
  // auth,
  ReportController.bulkHardDeleteReports
);

router.patch(
  "/reports/bulk/restore",
  // auth,
  ReportController.bulkRestoreReports
);

router.patch(
  "/reports/bulk/recipients",
  // auth,
  ReportController.bulkUpdateRecipients
);

// ------------------------------------------------------
// EXPORT + VIEW (more specific :id routes)
// ------------------------------------------------------
router.get(
  "/reports/:id/export/:format",
  // auth,
  ReportController.exportReport
);

router.patch(
  "/reports/:id/view",
  // auth,
  ReportController.markAsViewed
);

// ------------------------------------------------------
// LIST (no id)
// ------------------------------------------------------
router.get(
  "/reports",
  // auth,
  ReportController.listReports
);

// ------------------------------------------------------
// SINGLE REPORT CRUD BY ID (MUST BE LAST)
// ------------------------------------------------------
router.get(
  "/reports/:id",
  // auth,
  ReportController.getReportById
);

router.put(
  "/reports/:id",
  // auth,
  ReportController.updateReport
);

router.patch(
  "/reports/:id/status",
  // auth,
  ReportController.changeStatus
);

router.delete(
  "/reports/:id",
  // auth,
  ReportController.softDeleteReport
);

router.delete(
  "/reports/:id/hard",
  // auth,
  ReportController.hardDeleteReport
);

router.patch(
  "/reports/:id/restore",
  // auth,
  ReportController.restoreReport
);

module.exports = router;
