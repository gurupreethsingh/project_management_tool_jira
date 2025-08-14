// routes/RequirementRoutes.js
const express = require("express");
const router = express.Router();
const requirementController = require("../controllers/RequirementController");

// Multer uploader (reusable)
const getMulterUpload = require("../middleware/upload");
const uploadRequirementImages = getMulterUpload("requirements", 50);

// ---------- CREATE
// RESTful
router.post(
  "/requirements",
  uploadRequirementImages,
  requirementController.createRequirement
);
// Optional legacy alias (keep ONLY one)
router.post(
  "/create-requirement",
  uploadRequirementImages,
  requirementController.createRequirement
);

// ---------- READ ALL (optionally filter with ?project_id=)
router.get("/requirements", requirementController.getAllRequirements);
// Optional alias
router.get("/get-all-requirements", requirementController.getAllRequirements);

// ---------- READ ONE
router.get("/requirements/:id", requirementController.getRequirementById);
// Optional alias
router.get("/single-requirement/:id", requirementController.getRequirementById);

// ---------- UPDATE
router.put(
  "/requirements/:id",
  uploadRequirementImages,
  requirementController.updateRequirement
);
// Optional alias
router.put(
  "/update-requirement/:id",
  uploadRequirementImages,
  requirementController.updateRequirement
);

// ---------- DELETE
router.delete("/requirements/:id", requirementController.deleteRequirement);
// Optional alias
router.delete("/delete-requirements/:id", requirementController.deleteRequirement);

// ---------- COUNT
router.get("/requirements/count", requirementController.countRequirements);

// ---------- BY PROJECT
router.get(
  "/projects/:projectId/requirements",
  requirementController.getRequirementsByProject
);

// ---------- BY PROJECT + MODULE
router.get(
  "/projects/:projectId/modules/:moduleName/requirements",
  requirementController.getRequirementsByModule
);

// ---------- SEARCH
router.get("/requirements/search", requirementController.searchRequirements);

module.exports = router;
