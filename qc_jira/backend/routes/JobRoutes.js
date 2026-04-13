const express = require("express");
const router = express.Router();

const jobCtrl = require("../controllers/JobController");
const userCtrl = require("../controllers/UserController");

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Get all published jobs with filters/search/pagination
router.get("/jobs/public", jobCtrl.getAllJobsPublic);

// Get single published job by ID
router.get("/jobs/public/id/:id", jobCtrl.getJobByIdPublic);

// Get single published job by slug
router.get("/jobs/public/slug/:slug", jobCtrl.getJobBySlugPublic);

// Increment public job views
router.patch("/jobs/public/:id/increment-views", jobCtrl.incrementJobViews);

// ============================================================
// ADMIN CRUD ROUTES
// ============================================================

// Create new job
router.post(
  "/jobs",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.createJob,
);

// Get all jobs for admin with filters/search/pagination
router.get(
  "/jobs",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.getAllJobsAdmin,
);

// Get single job by ID for admin
router.get(
  "/jobs/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.getJobByIdAdmin,
);

// Update job
router.put(
  "/jobs/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.updateJob,
);

// Partial update job
router.patch(
  "/jobs/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.updateJob,
);

// Soft delete job
router.delete(
  "/jobs/:id/soft-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.softDeleteJob,
);

// Restore job
router.patch(
  "/jobs/:id/restore",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.restoreJob,
);

// Hard delete job
router.delete(
  "/jobs/:id/hard-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.hardDeleteJob,
);

// ============================================================
// PUBLISH / STATUS ROUTES
// ============================================================

// Publish job
router.patch(
  "/jobs/:id/publish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.publishJob,
);

// Unpublish job
router.patch(
  "/jobs/:id/unpublish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.unpublishJob,
);

// Toggle publish status
router.patch(
  "/jobs/:id/toggle-publish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.togglePublishJob,
);

// Generic status update
router.patch(
  "/jobs/:id/status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.updateJobStatus,
);

// Increment application count
router.patch(
  "/jobs/:id/increment-applications",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.incrementApplicationsCount,
);

// Decrement application count
router.patch(
  "/jobs/:id/decrement-applications",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.decrementApplicationsCount,
);

// ============================================================
// COUNTS / ANALYTICS / FILTER ROUTES
// ============================================================

// Overall counts summary
router.get(
  "/jobs-counts-summary",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.getJobCountsSummary,
);

// Count by department
router.get(
  "/jobs-counts/department",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.countJobsByDepartment,
);

// Count by location
router.get(
  "/jobs-counts/location",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.countJobsByLocation,
);

// Count by type
router.get(
  "/jobs-counts/type",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.countJobsByType,
);

// Filter options
router.get(
  "/jobs-filter-options",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.getJobFilterOptions,
);

// ============================================================
// SPECIAL ADMIN LISTING ROUTES
// ============================================================

// Get only deleted jobs
router.get(
  "/jobs-deleted",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.getDeletedJobs,
);

// Get only published jobs
router.get(
  "/jobs-published",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.getPublishedJobsAdmin,
);

// Get only draft jobs
router.get(
  "/jobs-drafts",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.getDraftJobsAdmin,
);

// ============================================================
// BULK OPERATIONS
// ============================================================

// Bulk soft delete
router.patch(
  "/jobs/bulk/soft-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.bulkSoftDeleteJobs,
);

// Bulk hard delete
router.delete(
  "/jobs/bulk/hard-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.bulkHardDeleteJobs,
);

// Bulk restore
router.patch(
  "/jobs/bulk/restore",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.bulkRestoreJobs,
);

// Bulk publish
router.patch(
  "/jobs/bulk/publish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.bulkPublishJobs,
);

// Bulk unpublish
router.patch(
  "/jobs/bulk/unpublish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.bulkUnpublishJobs,
);

// Bulk status update
router.patch(
  "/jobs/bulk/status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  jobCtrl.bulkUpdateJobStatus,
);

module.exports = router;
