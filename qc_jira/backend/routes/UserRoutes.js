// // routes/UserRoutes.js
// const express = require("express");
// const {
//   register,
//   login,
//   getUserById,
//   getAllUsers,
//   updateUser,
//   deleteUser,
//   authenticateToken,
//   requireAdmin,
//   protect,
//   uploadAvatar,
//   listDevelopers,
//   listTestEngineers,
//   countDevelopersFromProjects,
//   countByRole,
//   countUsersSummary,
//   listApproverEligibleUsers,
//   listAllForReview,
//   listApprovers,
//   updateUserRole,
// } = require("../controllers/UserController");

// const router = express.Router();

// // ===== AUTH + PROFILE =====
// router.post("/register", register);
// router.post("/login", login);
// router.get("/user/:id", getUserById);
// router.get("/get-user/:id", getUserById);

// // ===== ALL USERS / SEARCH / PAGINATION =====
// router.get("/all-users", getAllUsers);
// router.get("/users", getAllUsers);
// router.get("/users/all", getAllUsers);

// // ===== USER LISTS =====
// router.get("/users/developers", listDevelopers);
// router.get("/users/test-engineers", listTestEngineers);

// // ===== APPROVER / REVIEWER LISTS =====
// router.get("/users/approvers", listApprovers);
// router.get("/users/approver-eligible", listApproverEligibleUsers);
// router.get("/users/reviewers", listAllForReview);

// // ===== UPDATE / DELETE =====
// router.put("/update-user/:id", uploadAvatar.single("avatar"), updateUser);

// // restrict destructive ops to admins
// router.delete("/delete-user/:id", authenticateToken, requireAdmin, deleteUser);

// // ===== COUNTS =====
// router.get("/count-developers", countDevelopersFromProjects);
// router.get("/count-test-engineers", countByRole("test_engineer"));
// router.get("/count-admins", countByRole("admin"));
// router.get("/count-accountants", countByRole("accountant"));
// router.get("/count-alumni-relations", countByRole("alumni_relations"));
// router.get("/count-business-analysts", countByRole("business_analyst"));
// router.get("/count-content-creators", countByRole("content_creator"));
// router.get("/count-customer-support", countByRole("customer_support"));
// router.get("/count-data-scientists", countByRole("data_scientist"));
// router.get("/count-deans", countByRole("dean"));
// router.get("/count-department-heads", countByRole("department_head"));
// router.get("/count-event-coordinators", countByRole("event_coordinator"));
// router.get("/count-exam-controllers", countByRole("exam_controller"));
// router.get("/count-hr-managers", countByRole("hr_manager"));
// router.get("/count-users", countUsersSummary);

// // ===== ROLE UPDATE =====
// router.patch(
//   "/user/:id/role",
//   // authenticateToken, requireAdmin,
//   updateUserRole,
// );

// module.exports = router;

//

// routes/UserRoutes.js
const express = require("express");
const {
  register,
  login,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  authenticateToken,
  requireAdmin,
  uploadAvatar,
  listDevelopers,
  listTestEngineers,
  countDevelopersFromProjects,
  countByRole,
  countUsersSummary,
  listApproverEligibleUsers,
  listAllForReview,
  listApprovers,
  updateUserRole,
} = require("../controllers/UserController");

const router = express.Router();

// ===== AUTH + PROFILE =====
router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserById);
router.get("/get-user/:id", getUserById);

// ===== ALL USERS / SEARCH / PAGINATION =====
router.get("/all-users", getAllUsers);
router.get("/users", getAllUsers);
router.get("/users/all", getAllUsers);

// ===== USER LISTS =====
router.get("/users/developers", listDevelopers);
router.get("/users/test-engineers", listTestEngineers);

// ===== APPROVER / REVIEWER LISTS =====
router.get("/users/approvers", listApprovers);
router.get("/users/approver-eligible", listApproverEligibleUsers);
router.get("/users/reviewers", listAllForReview);

// ===== UPDATE / DELETE =====
router.put("/update-user/:id", uploadAvatar.single("avatar"), updateUser);

// Restrict destructive ops to admins
router.delete("/delete-user/:id", authenticateToken, requireAdmin, deleteUser);

// ===== COUNTS =====
router.get("/count-developers", countDevelopersFromProjects);
router.get("/count-test-engineers", countByRole("test_engineer"));
router.get("/count-admins", countByRole("admin"));
router.get("/count-accountants", countByRole("accountant"));
router.get("/count-alumni-relations", countByRole("alumni_relations"));
router.get("/count-business-analysts", countByRole("business_analyst"));
router.get("/count-content-creators", countByRole("content_creator"));
router.get("/count-customer-support", countByRole("customer_support"));
router.get("/count-data-scientists", countByRole("data_scientist"));
router.get("/count-deans", countByRole("dean"));
router.get("/count-department-heads", countByRole("department_head"));
router.get("/count-event-coordinators", countByRole("event_coordinator"));
router.get("/count-exam-controllers", countByRole("exam_controller"));
router.get("/count-hr-managers", countByRole("hr_manager"));
router.get("/count-users", countUsersSummary);

// ===== ROLE UPDATE =====
// Uncomment auth protection later if required
router.patch("/user/:id/role", updateUserRole);

module.exports = router;
