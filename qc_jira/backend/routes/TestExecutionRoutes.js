// routes/TestExecutionRoutes.js
const express = require("express");
const router = express.Router();

const testExecutionCtrl = require("../controllers/TestExecutionController");
const userCtrl = require("../controllers/UserController");

// =========================================================
// SINGLE RECORD OPERATIONS
// =========================================================

// Create execution
router.post(
  "/test-executions",
  userCtrl.authenticateToken,
  testExecutionCtrl.createTestExecution,
);

// List executions
router.get(
  "/test-executions",
  userCtrl.authenticateToken,
  testExecutionCtrl.listTestExecutions,
);

// Get single execution
router.get(
  "/test-executions/:id",
  userCtrl.authenticateToken,
  testExecutionCtrl.getTestExecutionById,
);

// Update execution
router.patch(
  "/test-executions/:id",
  userCtrl.authenticateToken,
  testExecutionCtrl.updateTestExecution,
);

// Link defect to single execution
router.patch(
  "/test-executions/:id/link-defect",
  userCtrl.authenticateToken,
  testExecutionCtrl.linkDefectToExecution,
);

// Soft delete single execution
router.delete(
  "/test-executions/:id",
  userCtrl.authenticateToken,
  testExecutionCtrl.softDeleteTestExecution,
);

// =========================================================
// BULK OPERATIONS
// =========================================================

// Bulk status update
router.post(
  "/test-executions/bulk-status",
  userCtrl.authenticateToken,
  testExecutionCtrl.bulkUpdateStatus,
);

// Bulk assign
router.post(
  "/test-executions/bulk-assign",
  userCtrl.authenticateToken,
  testExecutionCtrl.bulkAssign,
);

// Bulk link defect
router.post(
  "/test-executions/bulk-link-defect",
  userCtrl.authenticateToken,
  testExecutionCtrl.bulkLinkDefect,
);

// Bulk soft delete
router.post(
  "/test-executions/bulk-delete",
  userCtrl.authenticateToken,
  testExecutionCtrl.bulkDelete,
);

module.exports = router;
