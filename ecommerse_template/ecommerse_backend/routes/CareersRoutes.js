const express = require("express");
const router = express.Router();
const careersController = require("../controllers/CareersController");
const {
  verifyToken,
  verifyTokenOptional,
} = require("../middleware/AuthMiddleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// All published job / internship opportunities
router.get(
  "/all-opportunities",
  careersController.getAllPublishedOpportunities,
);

// Single published opportunity
router.get(
  "/single-opportunity/:idOrSlug",
  careersController.getSinglePublishedOpportunity,
);

// Apply for a job/internship
// If verifyTokenOptional exists, user can apply both with or without login.
if (verifyTokenOptional) {
  router.post(
    "/apply/:opportunityId",
    verifyTokenOptional,
    careersController.applyForOpportunity,
  );
} else {
  router.post("/apply/:opportunityId", careersController.applyForOpportunity);
}

// Logged-in user's own applications
router.get(
  "/my-applications",
  verifyToken,
  careersController.getMyApplications,
);

// ======================================================
// SUPERADMIN - OPPORTUNITY CRUD
// ======================================================
router.post(
  "/admin/create-opportunity",
  verifyToken,
  careersController.createOpportunity,
);

router.get(
  "/admin/all-opportunities",
  verifyToken,
  careersController.getAllOpportunitiesAdmin,
);

router.get(
  "/admin/single-opportunity/:id",
  verifyToken,
  careersController.getSingleOpportunityAdmin,
);

router.put(
  "/admin/update-opportunity/:id",
  verifyToken,
  careersController.updateOpportunity,
);

router.delete(
  "/admin/delete-opportunity/:id",
  verifyToken,
  careersController.deleteOpportunity,
);

router.patch(
  "/admin/bulk/update-opportunity-status",
  verifyToken,
  careersController.bulkUpdateOpportunityStatus,
);

router.get(
  "/admin/opportunity-counts",
  verifyToken,
  careersController.getOpportunityCounts,
);

// ======================================================
// SUPERADMIN - APPLICATION MANAGEMENT
// ======================================================
router.get(
  "/admin/all-applications",
  verifyToken,
  careersController.getAllApplicationsAdmin,
);

router.get(
  "/admin/single-application/:id",
  verifyToken,
  careersController.getSingleApplicationAdmin,
);

router.patch(
  "/admin/update-application-status/:id",
  verifyToken,
  careersController.updateApplicationStatus,
);

router.delete(
  "/admin/delete-application/:id",
  verifyToken,
  careersController.deleteApplication,
);

router.patch(
  "/admin/bulk/update-application-status",
  verifyToken,
  careersController.bulkUpdateApplicationStatus,
);

router.delete(
  "/admin/bulk/delete-applications",
  verifyToken,
  careersController.bulkDeleteApplications,
);

router.get(
  "/admin/application-counts",
  verifyToken,
  careersController.getApplicationCounts,
);

router.post(
  "/admin/send-email-to-selected",
  verifyToken,
  careersController.sendEmailToSelectedCandidates,
);

module.exports = router;
