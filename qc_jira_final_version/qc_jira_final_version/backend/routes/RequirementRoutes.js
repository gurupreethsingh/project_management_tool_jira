const express = require("express");
const router = express.Router();
const requirementController = require("../controllers/RequirementController");

// ✅ Dynamic multer uploader (reusable for other modules like blog)
const getMulterUpload = require("../middleware/upload");
const uploadRequirementImages = getMulterUpload("requirements", 50); // Max 50 images for create/update

// ✅ CREATE Requirement
// POST /api/requirements
router.post(
  "/create-requirement",
  uploadRequirementImages,
  requirementController.createRequirement
);

// ✅ GET All Requirements
// GET /api/requirements
router.get("/get-all-requirements", requirementController.getAllRequirements);

// ✅ GET Single Requirement by ID
// GET /api/requirements/:id
router.get("/get-requirement-by-id/:id", requirementController.getRequirementById);

// ✅ UPDATE Requirement by ID
// PUT /api/requirements/:id
router.put(
  "/update-requirement/:id",
  uploadRequirementImages,
  requirementController.updateRequirement
);

// ✅ DELETE Requirement by ID
// DELETE /api/requirements/:id
router.delete("/delete-requirements/:id", requirementController.deleteRequirement);

// ✅ COUNT Total Requirements
// GET /api/requirements/count
router.get("/requirements/count", requirementController.countRequirements);

// ✅ GET Requirements by Project ID
// GET /api/projects/:projectId/requirements
router.get(
  "/projects/:projectId/requirements",
  requirementController.getRequirementsByProject
);

// ✅ GET Requirements by Project ID and Module Name
// GET /api/projects/:projectId/modules/:moduleName/requirements
router.get(
  "/projects/:projectId/modules/:moduleName/requirements",
  requirementController.getRequirementsByModule
);

// ✅ SEARCH Requirements by Title or Number
// GET /api/requirements/search?query=...
router.get("/requirements/search", requirementController.searchRequirements);

module.exports = router;
