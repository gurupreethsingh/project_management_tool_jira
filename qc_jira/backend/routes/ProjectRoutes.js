const express = require("express");
const router = express.Router();
const projectController = require("../controllers/ProjectController");

let authenticateToken = (_req, _res, next) => next();
let protect = (_req, _res, next) => next();
let requireAdmin = (_req, _res, next) => next();
try {
  const auth = require("../middleware/authMiddleware");
  if (typeof auth.authenticateToken === "function")
    authenticateToken = auth.authenticateToken;
  if (typeof auth.protect === "function") protect = auth.protect;
  if (typeof auth.requireAdmin === "function") requireAdmin = auth.requireAdmin;
} catch (_) {}

// NOTE: mounted at /api in app.js

// ===== Project names for datalist (NEW)
router.get("/projects/names", projectController.getAllProjectNames);

// existing
router.get("/projects/:id", projectController.getProjectById);

// create/list/delete
router.post("/create-project", protect, projectController.createProject);
router.get("/all-projects", projectController.getAllProjects);
router.get("/count-projects", projectController.countProjects);
router.delete("/delete-project/:id", projectController.deleteProject);

// summary
router.get(
  "/single-project/:projectId",
  protect,
  projectController.getProjectSummary
);

// members
router.get(
  "/projects/:projectId/test-engineers",
  projectController.getProjectTestEngineers
);
router.get(
  "/projects/:projectId/developers",
  projectController.getProjectDevelopers
);

// ===== Update members for an existing project (NEW)
router.put(
  "/projects/:projectId/members",
  protect,
  projectController.updateProjectMembers
);

// traceability
router.get(
  "/projects/:projectId/traceability-matrix",
  projectController.getTraceabilityMatrix
);

// user ↔ projects
router.get(
  "/user-project-count/:userId",
  projectController.getUserProjectCount
);
router.get(
  "/user-assigned-projects/:userId",
  projectController.getUserAssignedProjects
);

// counts
router.get(
  "/projects/:projectId/test-cases-count",
  projectController.getProjectTestCasesCount
);
router.get(
  "/single-project/:projectId/defects-count",
  projectController.getProjectDefectsCount
);

// counts split by execution type
router.get(
  "/projects/:projectId/test-cases-count-by-execution-type",
  projectController.getProjectTestCasesCountByExecutionType
);
router.get(
  "/test-cases-count-by-execution-type",
  projectController.getGlobalTestCasesCountByExecutionType
);

// scenarios + add test case
router.get(
  "/projects/:projectId/scenarios",
  protect,
  projectController.getProjectScenarios
);
router.post("/add-test-case", protect, projectController.addTestCase);

// per-project list
router.get(
  "/single-project/:projectId/all-test-cases",
  protect,
  projectController.getAllTestCasesForProject
);

// bulk (enabled — handler is implemented)
router.post(
  "/projects/:projectId/test-cases/bulk-update-execution-type",
  protect,
  projectController.bulkUpdateTestExecutionType
);

// test case CRUD
router.delete(
  "/delete-test-case/:testCaseId",
  protect,
  projectController.deleteTestCase
);
router.get(
  "/get-test-case/:testCaseId",
  protect,
  projectController.getTestCaseById
);
router.put(
  "/update-test-case/:testCaseId",
  protect,
  projectController.updateTestCase
);

// global list
router.get("/all-test-cases", protect, projectController.getAllTestCases);

// NEW: test case history
router.get(
  "/test-case/:testCaseId/history",
  protect,
  projectController.getTestCaseHistory
);

module.exports = router;
