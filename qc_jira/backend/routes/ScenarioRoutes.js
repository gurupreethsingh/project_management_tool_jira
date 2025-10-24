
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const ctrl = require("../controllers/ScenarioController");

// --- Optional one-time debug (uncomment if you still get undefined) ---
// console.log("[ScenarioController exports]", Object.keys(ctrl));

// Lightweight auth
const authenticateToken = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "ecoders_jwt_secret");
      req.user = decoded; // { id, email, name, role }
      return next();
    } catch {
      return res.status(403).json({ message: "Invalid token." });
    }
  }
  return res.status(401).json({ message: "No token provided" });
};

// ===== SCENARIO ROUTES =====
router.post("/single-projects/:id/add-scenario", authenticateToken, ctrl.addScenario);
router.put("/single-project/scenario/:scenarioId", authenticateToken, ctrl.updateScenario);
router.get("/single-project/:id/view-all-scenarios", ctrl.listScenariosByProject);
router.get("/single-project/:projectId/scenario-history/:scenarioId", ctrl.getScenarioHistory);
router.delete("/single-project/scenario/:scenarioId", authenticateToken, ctrl.deleteScenario);
router.get("/single-project/scenario/:scenarioId/scenario-number", authenticateToken, ctrl.getScenarioNumber);
router.get("/projects/:projectId/scenarios", ctrl.getScenariosSimple);

// ===== MODULE ROUTES =====
router.get("/single-projects/:projectId/modules", authenticateToken, ctrl.listModulesByProject);
router.post("/single-projects/:projectId/modules", authenticateToken, ctrl.createOrGetModule);

// ===== SEARCH/AUTOSUGGEST + BULK OPS =====
router.get("/single-projects/:projectId/scenarios/search", authenticateToken, ctrl.searchScenarios);
router.post("/single-projects/:projectId/scenarios/transfer", authenticateToken, ctrl.transferScenarios);
router.post("/single-projects/:projectId/scenarios/detach", authenticateToken, ctrl.detachScenariosToUnassigned);
router.get("/single-projects/:projectId/modules-with-counts", authenticateToken, ctrl.listModulesWithCounts);

module.exports = router;
