// routes/DefectRoutes.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  listDefectsByProject,
  listAssignedDefectsForLead,
  addBug,
  listAllDefectsForProject,
  countDefectsForProject,
  getDefectByProjectAndId,
  deleteBug,
  updateDefectStatus,
  getDefectHistory,
  assignDefect,
  viewAssignedDefectsForDeveloper,
} = require("../controllers/DefectController");

const router = express.Router();

// ===== Multer storage for bug images =====
const bugstorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "uploads/bugs";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const bugupload = multer({ storage: bugstorage });

// ===== ROUTES (mounted under /api in index.js) =====
router.get("/projects/:projectId/defects", listDefectsByProject);
router.get(
  "/developer-lead/:userId/assigned-defects",
  listAssignedDefectsForLead
);

router.post("/addbug", bugupload.single("bug_picture"), addBug);

router.get("/single-project/:projectId/all-defects", listAllDefectsForProject);
router.get("/single-project/:projectId/defects-count", countDefectsForProject);
router.get(
  "/single-project/:projectId/defect/:defectId",
  getDefectByProjectAndId
);

router.delete("/deletebug/:id", deleteBug);

router.put("/single-project/:projectId/defect/:defectId", updateDefectStatus);
router.get(
  "/single-project/:projectId/defect/:defectId/history",
  getDefectHistory
);

router.post("/single-project/:projectId/assign-defect", assignDefect);
router.get(
  "/single-project/:projectId/developer/:developerId/view-assigned-defects",
  viewAssignedDefectsForDeveloper
);

module.exports = router;
