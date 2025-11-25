// routes/CareersRoutes.js
const express = require("express");
const router = express.Router();

const careersCtrl = require("../controllers/CareersController");
const userCtrl = require("../controllers/UserController");

// Public: apply (no auth), with file upload
router.post(
  "/careers/apply",
  careersCtrl.uploadCareersFiles,
  careersCtrl.apply
);

// Admin-only routes
router.get(
  "/careers",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.list
);

router.get(
  "/careers/counts",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.countsSummary
);

router.get(
  "/careers/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.getById
);

router.patch(
  "/careers/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.update
);

router.patch(
  "/careers/:id/status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.updateStatus
);

router.delete(
  "/careers/:id",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.softDelete
);

router.post(
  "/careers/bulk-status",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.bulkUpdateStatus
);

router.post(
  "/careers/bulk-delete",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.bulkSoftDelete
);

// Download a specific file attached to an application
router.get(
  "/careers/:id/files/:fileId",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.downloadFile
);

router.post(
  "/careers/:id/email",
  userCtrl.authenticateToken,
  userCtrl.requireAdmin,
  careersCtrl.sendEmail
);

module.exports = router;
