const express = require("express");
const router = express.Router();

const internshipCtrl = require("../controllers/InternshipController");
const userCtrl = require("../controllers/UserController");

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Get all published internships with filters/search/pagination
router.get("/internships/public", internshipCtrl.getAllInternshipsPublic);

// Get single published internship by ID
router.get(
  "/internships/public/id/:id",
  internshipCtrl.getInternshipByIdPublic,
);

// Get single published internship by slug
router.get(
  "/internships/public/slug/:slug",
  internshipCtrl.getInternshipBySlugPublic,
);

// Increment public internship views
router.patch(
  "/internships/public/:id/increment-views",
  internshipCtrl.incrementInternshipViews,
);

// ============================================================
// ADMIN CRUD ROUTES
// ============================================================

// Create new internship
router.post(
  "/internships",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.createInternship,
);

// Get all internships for admin with filters/search/pagination
router.get(
  "/internships",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.getAllInternshipsAdmin,
);

// Get single internship by ID for admin
router.get(
  "/internships/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.getInternshipByIdAdmin,
);

// Update internship
router.put(
  "/internships/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.updateInternship,
);

// Partial update internship
router.patch(
  "/internships/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.updateInternship,
);

// Soft delete internship
router.delete(
  "/internships/:id/soft-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.softDeleteInternship,
);

// Restore internship
router.patch(
  "/internships/:id/restore",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.restoreInternship,
);

// Hard delete internship
router.delete(
  "/internships/:id/hard-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.hardDeleteInternship,
);

// ============================================================
// PUBLISH / STATUS ROUTES
// ============================================================

// Publish internship
router.patch(
  "/internships/:id/publish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.publishInternship,
);

// Unpublish internship
router.patch(
  "/internships/:id/unpublish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.unpublishInternship,
);

// Toggle publish status
router.patch(
  "/internships/:id/toggle-publish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.togglePublishInternship,
);

// Generic status update
router.patch(
  "/internships/:id/status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.updateInternshipStatus,
);

// ============================================================
// APPLICATION / TRACKING ROUTES
// ============================================================

// Increment internship application count
router.patch(
  "/internships/:id/increment-applications",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.incrementInternshipApplications,
);

// Decrement internship application count
router.patch(
  "/internships/:id/decrement-applications",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.decrementInternshipApplications,
);

// Update submission status
router.patch(
  "/internships/:id/submission-status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.updateSubmissionStatus,
);

// Generate acceptance letter status
router.patch(
  "/internships/:id/generate-acceptance-letter",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.generateAcceptanceLetter,
);

// Generate internship certificate status
router.patch(
  "/internships/:id/generate-certificate",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.generateInternshipCertificate,
);

// ============================================================
// COUNTS / ANALYTICS / FILTER ROUTES
// ============================================================

// Overall counts summary
router.get(
  "/internships-counts-summary",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.getInternshipCountsSummary,
);

// Count by department
router.get(
  "/internships-counts/department",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.countInternshipsByDepartment,
);

// Count by location
router.get(
  "/internships-counts/location",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.countInternshipsByLocation,
);

// Count by duration
router.get(
  "/internships-counts/duration",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.countInternshipsByDuration,
);

// Count by payment type
router.get(
  "/internships-counts/payment-type",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.countInternshipsByPaymentType,
);

// Filter options
router.get(
  "/internships-filter-options",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.getInternshipFilterOptions,
);

// ============================================================
// SPECIAL ADMIN LISTING ROUTES
// ============================================================

// Get only deleted internships
router.get(
  "/internships-deleted",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.getDeletedInternships,
);

// Get only published internships
router.get(
  "/internships-published",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.getPublishedInternshipsAdmin,
);

// Get only draft internships
router.get(
  "/internships-drafts",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.getDraftInternshipsAdmin,
);

// ============================================================
// BULK OPERATIONS
// ============================================================

// Bulk soft delete
router.patch(
  "/internships/bulk/soft-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.bulkSoftDeleteInternships,
);

// Bulk hard delete
router.delete(
  "/internships/bulk/hard-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.bulkHardDeleteInternships,
);

// Bulk restore
router.patch(
  "/internships/bulk/restore",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.bulkRestoreInternships,
);

// Bulk publish
router.patch(
  "/internships/bulk/publish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.bulkPublishInternships,
);

// Bulk unpublish
router.patch(
  "/internships/bulk/unpublish",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.bulkUnpublishInternships,
);

// Bulk status update
router.patch(
  "/internships/bulk/status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  internshipCtrl.bulkUpdateInternshipStatus,
);

module.exports = router;
