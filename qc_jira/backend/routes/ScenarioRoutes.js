const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const ctrl = require("../controllers/ScenarioController");

const authenticateToken = (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "ecoders_jwt_secret");
    req.user = decoded; // expected: { id, email, name, role }
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

/* ============================== SCENARIO ROUTES ============================== */

router.post(
  "/single-projects/:id/add-scenario",
  authenticateToken,
  ctrl.addScenario,
);

router.put(
  "/single-project/scenario/:scenarioId",
  authenticateToken,
  ctrl.updateScenario,
);

router.get(
  "/single-project/:id/view-all-scenarios",
  ctrl.listScenariosByProject,
);

router.get(
  "/single-project/:projectId/scenario-history/:scenarioId",
  ctrl.getScenarioHistory,
);

router.delete(
  "/single-project/scenario/:scenarioId",
  authenticateToken,
  ctrl.deleteScenario,
);

router.delete(
  "/single-project/:projectId/scenarios/bulk-delete",
  authenticateToken,
  ctrl.bulkDeleteScenarios,
);

router.get(
  "/single-project/scenario/:scenarioId/scenario-number",
  authenticateToken,
  ctrl.getScenarioNumber,
);

router.get("/projects/:projectId/scenarios", ctrl.getScenariosSimple);

/* ============================== MODULE ROUTES ============================== */

router.get(
  "/single-projects/:projectId/modules",
  authenticateToken,
  ctrl.listModulesByProject,
);

router.post(
  "/single-projects/:projectId/modules",
  authenticateToken,
  ctrl.createOrGetModule,
);

router.delete(
  "/single-projects/:projectId/modules/:moduleId",
  authenticateToken,
  ctrl.deleteModule,
);

router.get(
  "/single-projects/:projectId/modules-with-counts",
  authenticateToken,
  ctrl.listModulesWithCounts,
);

/* ============================== SEARCH / BULK OPS ============================== */

router.get(
  "/single-projects/:projectId/scenarios/search",
  authenticateToken,
  ctrl.searchScenarios,
);

router.post(
  "/single-projects/:projectId/scenarios/transfer",
  authenticateToken,
  ctrl.transferScenarios,
);

router.post(
  "/single-projects/:projectId/scenarios/detach",
  authenticateToken,
  ctrl.detachScenariosToUnassigned,
);

module.exports = router;
