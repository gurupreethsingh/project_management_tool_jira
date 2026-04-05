// // routes/CareersRoutes.js
// const express = require("express");
// const router = express.Router();

// const careersCtrl = require("../controllers/CareersController");
// const userCtrl = require("../controllers/UserController");

// // Public: apply (no auth), with file upload
// router.post(
//   "/careers/apply",
//   careersCtrl.uploadCareersFiles,
//   careersCtrl.apply
// );

// // Admin-only routes
// router.get(
//   "/careers",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.list
// );

// router.get(
//   "/careers/counts",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.countsSummary
// );

// router.get(
//   "/careers/:id",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.getById
// );

// router.patch(
//   "/careers/:id",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.update
// );

// router.patch(
//   "/careers/:id/status",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.updateStatus
// );

// router.delete(
//   "/careers/:id",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.softDelete
// );

// router.post(
//   "/careers/bulk-status",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.bulkUpdateStatus
// );

// router.post(
//   "/careers/bulk-delete",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.bulkSoftDelete
// );

// // Download a specific file attached to an application
// router.get(
//   "/careers/:id/files/:fileId",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.downloadFile
// );

// router.post(
//   "/careers/:id/email",
//   userCtrl.authenticateToken,
//   userCtrl.requireAdmin,
//   careersCtrl.sendEmail
// );

// module.exports = router;

// routes/CareersRoutes.js
const express = require("express");
const router = express.Router();

const careersCtrl = require("../controllers/CareersController");
const userCtrl = require("../controllers/UserController");

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Apply for internship/job with optional file upload
router.post(
  "/careers/apply",
  careersCtrl.uploadCareersFiles,
  careersCtrl.apply,
);

// ============================================================
// ADMIN ROUTES
// ============================================================

// List all career applications with filters/pagination
router.get(
  "/careers",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.list,
);

// Summary counts
router.get(
  "/careers/counts",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.countsSummary,
);

// Get single application by ID
router.get(
  "/careers/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.getById,
);

// Update general application fields
// Also supports internshipTracking fields for internship applications
router.patch(
  "/careers/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.update,
);

// Update main application status (pending/shortlisted/accepted/rejected/on_hold)
router.patch(
  "/careers/:id/status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.updateStatus,
);

// Soft delete single application
router.delete(
  "/careers/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.softDelete,
);

// Bulk status update
router.post(
  "/careers/bulk-status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.bulkUpdateStatus,
);

// Bulk soft delete
router.post(
  "/careers/bulk-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.bulkSoftDelete,
);

// Download a specific file attached to an application
router.get(
  "/careers/:id/files/:fileId",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.downloadFile,
);

// Send custom email to applicant
router.post(
  "/careers/:id/email",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.sendEmail,
);

module.exports = router;
