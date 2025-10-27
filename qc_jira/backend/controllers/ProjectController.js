// const mongoose = require("mongoose");
// const Project = require("../models/ProjectModel");
// const User = require("../models/UserModel");
// const Scenario = require("../models/ScenarioModel");
// const TestCase = require("../models/TestCaseModel");
// const Bug = require("../models/BugModel");

// // Utility: normalize incoming type -> "Manual" | "Automation" | "Both"
// function normalizeExecType(v) {
//   const s = String(v || "").trim().toLowerCase();
//   if (s === "automation") return "Automation";
//   if (s === "both" || s === "both manual and automation" || s === "manual+automation") return "Both";
//   return "Manual"; // default
// }

// // Utility: build filter for exec type (optional)
// function buildExecTypeFilter(execTypeParam) {
//   if (!execTypeParam) return {};
//   const val = normalizeExecType(execTypeParam);
//   return { test_execution_type: val };
// }

// // Utility: build sort for exec type (optional)
// function buildSort(sortBy, order = "desc") {
//   const dir = String(order).toLowerCase() === "asc" ? 1 : -1;
//   if (sortBy === "test_execution_type") return { test_execution_type: dir, _id: -1 };
//   if (sortBy === "createdAt") return { createdAt: dir, _id: -1 };
//   if (sortBy === "severity") return { severity: dir, _id: -1 };
//   // default
//   return { _id: -1 };
// }

// // GET /api/projects/:id  (kept for direct-by-id fetch)
// async function getProjectById(req, res) {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid project id" });
//     }
//     const proj = await Project.findById(id).lean();
//     if (!proj) return res.status(404).json({ error: "Project not found" });
//     return res.status(200).json({
//       ...proj,
//       projectName: proj.project_name ?? proj.projectName ?? "",
//     });
//   } catch (err) {
//     console.error("getProjectById error:", err);
//     return res
//       .status(500)
//       .json({ error: "Failed to fetch project", details: err.message });
//   }
// }

// // POST /api/create-project
// async function createProject(req, res) {
//   try {
//     const {
//       projectName,
//       description,
//       startDate,
//       endDate,
//       deadline,
//       developers = [],
//       testEngineers = [],
//       createdBy: createdByFromBody, // fallback if auth is no-op
//     } = req.body;

//     if (!projectName || !startDate || !deadline) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // prefer req.user.id (when protect is active), fallback to body
//     const creatorId = req.user?.id || req.user?._id || createdByFromBody;

//     if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
//       return res.status(401).json({
//         message:
//           "Unable to determine creator. Ensure you are logged in or include a valid 'createdBy' in the request body.",
//       });
//     }

//     // normalize member arrays to ObjectId strings
//     const devIds = (developers || []).filter(Boolean);
//     const teIds = (testEngineers || []).filter(Boolean);

//     const p = new Project({
//       project_name: projectName,
//       description,
//       startDate,
//       endDate: endDate || null,
//       deadline,
//       createdBy: creatorId,
//       developers: devIds,
//       testEngineers: teIds,
//     });

//     await p.save();
//     return res
//       .status(201)
//       .json({ message: "Project created successfully", project: p });
//   } catch (error) {
//     console.error("Server error during project creation:", error);
//     // surface validation errors more clearly
//     if (error?.name === "ValidationError") {
//       return res
//         .status(400)
//         .json({ message: error.message, details: error.errors });
//     }
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // GET /api/all-projects?search=
// async function getAllProjects(req, res) {
//   try {
//     const { search = "" } = req.query;
//     const query = { project_name: { $regex: search, $options: "i" } };

//     const projects = await Project.find(query)
//       .populate("createdBy", "name")
//       .populate("developers", "name")
//       .populate("testEngineers", "name");

//     return res.json({ projects, totalCount: projects.length });
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// }

// // GET /api/count-projects
// async function countProjects(_req, res) {
//   try {
//     const totalProjects = await Project.countDocuments();
//     return res.json({ totalProjects });
//   } catch (error) {
//     console.error("Error fetching project count:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// }

// // DELETE /api/delete-project/:id
// async function deleteProject(req, res) {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id))
//       return res.status(400).json({ message: "Invalid project id" });

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: "Project not found" });

//     await Project.findByIdAndDelete(id);
//     return res
//       .status(200)
//       .json({ message: "Project has been successfully deleted" });
//   } catch (error) {
//     console.error("Error deleting project:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // GET /api/single-project/:projectId
// async function getProjectSummary(req, res) {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ error: "Invalid project ID" });
//     }

//     const project = await Project.findById(projectId)
//       .populate("createdBy", "name")
//       .populate("developers", "name")
//       .populate("testEngineers", "name")
//       .populate({
//         path: "scenarios",
//         populate: { path: "testCases", select: "title description" },
//       });

//     if (!project) return res.status(404).json({ message: "Project not found" });

//     const totalScenarios = await Scenario.countDocuments({
//       project: projectId,
//     });

//     return res.json({
//       projectName: project.project_name,
//       description: project.description,
//       startDate: project.startDate,
//       endDate: project.endDate,
//       deadline: project.deadline,
//       domain: project.domain,
//       developers: project.developers,
//       testEngineers: project.testEngineers,
//       createdBy: project.createdBy,
//       scenarios: project.scenarios,
//       totalScenarios,
//     });
//   } catch (error) {
//     console.error("Error fetching project:", error.message);
//     return res.status(500).json({ error: "Server error: " + error.message });
//   }
// }

// // GET /api/projects/:projectId/test-engineers
// async function getProjectTestEngineers(req, res) {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }
//     const project = await Project.findById(projectId).populate("testEngineers");
//     if (!project) return res.status(404).json({ message: "Project not found" });
//     return res.json({ testEngineers: project.testEngineers });
//   } catch (error) {
//     console.error("Error fetching test engineers:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // GET /api/projects/:projectId/developers
// async function getProjectDevelopers(req, res) {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }
//     const project = await Project.findById(projectId).populate("developers");
//     if (!project) return res.status(404).json({ message: "Project not found" });
//     return res.json({ developers: project.developers });
//   } catch (error) {
//     console.error("Error fetching developers:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // GET /api/projects/:projectId/traceability-matrix
// async function getTraceabilityMatrix(req, res) {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }

//     const scenarios = await Scenario.find({ project: projectId }).populate("module", "name");
//     const testCases = await TestCase.find({ project_id: projectId });
//     const bugs = await Bug.find({ project_id: projectId });

//     const getTestCaseStatus = (testSteps) => {
//       if (!testSteps || testSteps.length === 0) return "N/A";
//       const failed = testSteps.filter((s) => s.status === "Fail");
//       return failed.length > 0 ? "Fail" : "Pass";
//     };

//     const matrix = scenarios.map((sc) => {
//       const tc = testCases.find(
//         (t) =>
//           t.scenario_id &&
//           sc._id &&
//           t.scenario_id.toString() === sc._id.toString()
//       );

//       const defect = tc
//         ? bugs.find(
//             (b) =>
//               b.test_case_number &&
//               tc.test_case_number &&
//               b.test_case_number.toString() === tc.test_case_number.toString()
//           )
//         : null;

//       return {
//         scenarioNumber: sc.scenario_number,
//         scenarioText: sc.scenario_text,
//         moduleName: sc.module?.name || "Unassigned", // <<< expose module for UI chips
//         testCaseNumber: tc ? tc.test_case_number : "Missing",
//         testCaseStatus: tc ? getTestCaseStatus(tc.testing_steps) : "N/A",
//         defectNumber: defect ? defect.bug_id : "N/A",
//         defectReportStatus:
//           tc && getTestCaseStatus(tc.testing_steps) === "Fail"
//             ? defect
//               ? "Present"
//               : "Missing"
//             : "N/A",
//         isMissingTestCases: !tc,
//         // optional: surface the execution type for display/filters if you want
//         testExecutionType: tc ? tc.test_execution_type || "Manual" : "Manual",
//       };
//     });

//     return res.json(matrix);
//   } catch (error) {
//     console.error("Error fetching traceability matrix:", error.message);
//     return res.status(500).send("Error fetching traceability matrix");
//   }
// }

// // GET /api/user-project-count/:userId?role=...
// async function getUserProjectCount(req, res) {
//   const { userId } = req.params;
//   const { role } = req.query;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user id" });
//     }

//     let assignedProjectsCount = 0;
//     if (role === "test_engineer") {
//       assignedProjectsCount = await Project.countDocuments({
//         testEngineers: userId,
//       });
//     } else if (role === "developer") {
//       assignedProjectsCount = await Project.countDocuments({
//         developers: userId,
//       });
//     } else if (role === "qa_lead" || role === "admin") {
//       assignedProjectsCount = await Project.countDocuments({
//         createdBy: userId,
//       });
//     }
//     return res.json({ assignedProjectsCount });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error fetching project counts", error });
//   }
// }

// // GET /api/user-assigned-projects/:userId
// async function getUserAssignedProjects(req, res) {
//   const { userId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user id" });
//     }

//     const assignedProjects = await Project.find({
//       $or: [
//         { testEngineers: userId },
//         { developers: userId },
//         { createdBy: userId },
//       ],
//     });
//     return res.json({ assignedProjects });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error fetching assigned projects", error });
//   }
// }

// // ===== NEW: counts used by SingleProject.jsx =====

// // GET /api/projects/:projectId/test-cases-count
// // GET /api/projects/:projectId/test-cases-count
// async function getProjectTestCasesCount(req, res) {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }
//     const totalTestCases = await TestCase.countDocuments({ project_id: projectId });
//     return res.json({ totalTestCases });
//   } catch (error) {
//     console.error("Error counting test cases:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }


// // GET /api/projects/:projectId/test-cases-count-by-execution-type
// async function getProjectTestCasesCountByExecutionType(req, res) {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }
//     const agg = await TestCase.aggregate([
//       { $match: { project_id: new mongoose.Types.ObjectId(projectId) } },
//       { $group: { _id: "$test_execution_type", count: { $sum: 1 } } },
//     ]);

//     const toMap = Object.fromEntries(
//       agg.map((r) => [r._id || "Manual", r.count])
//     );
//     return res.json({
//       Manual: toMap["Manual"] || 0,
//       Automation: toMap["Automation"] || 0,
//       Both: toMap["Both"] || 0,
//       total: (toMap["Manual"] || 0) + (toMap["Automation"] || 0) + (toMap["Both"] || 0),
//     });
//   } catch (e) {
//     console.error("getProjectTestCasesCountByExecutionType error:", e);
//     return res.status(500).json({ message: "Server error" });
//   }
// }


// // ✅ NEW: global counts by execution type
// // GET /api/test-cases-count-by-execution-type
// async function getGlobalTestCasesCountByExecutionType(_req, res) {
//   try {
//     const agg = await TestCase.aggregate([
//       { $group: { _id: "$test_execution_type", count: { $sum: 1 } } },
//     ]);
//     const toMap = Object.fromEntries(
//       agg.map((r) => [r._id || "Manual", r.count])
//     );
//     return res.json({
//       Manual: toMap["Manual"] || 0,
//       Automation: toMap["Automation"] || 0,
//       Both: toMap["Both"] || 0,
//       total: (toMap["Manual"] || 0) + (toMap["Automation"] || 0) + (toMap["Both"] || 0),
//     });
//   } catch (e) {
//     console.error("getGlobalTestCasesCountByExecutionType error:", e);
//     return res.status(500).json({ message: "Server error" });
//   }
// }


// // GET /api/single-project/:projectId/defects-count
// async function getProjectDefectsCount(req, res) {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }
//     const totalDefects = await Bug.countDocuments({ project_id: projectId });
//     return res.json({ totalDefects });
//   } catch (error) {
//     console.error("Error counting defects:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// async function getProjectScenarios(req, res) {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }
//     const scenarios = await Scenario.find({ project: projectId })
//       .select("_id scenario_number scenario_text")
//       .sort({ scenario_number: 1 });
//     return res.json(scenarios);
//   } catch (error) {
//     console.error("Error fetching scenarios:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // ===== NEW: create a test case =====
// // ===== create a test case (UPDATED to include test_execution_type) =====
// // POST /api/add-test-case
// async function addTestCase(req, res) {
//   try {
//     const {
//       project_id,
//       project_name,
//       scenario_id,
//       scenario_number,
//       test_case_name,
//       requirement_number,
//       build_name_or_number,
//       module_name,
//       pre_condition,
//       test_data,
//       post_condition,
//       severity,
//       test_case_type,
//       brief_description,
//       test_execution_time,
//       testing_steps = [],
//       footer = {},
//       // NEW:
//       test_execution_type, // Manual | Automation | Both (default Manual)
//     } = req.body;

//     if (!project_id || !scenario_id || !test_case_name || !requirement_number || !module_name) {
//       return res.status(400).json({ message: "Missing required test case fields." });
//     }
//     if (!mongoose.Types.ObjectId.isValid(project_id)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(scenario_id)) {
//       return res.status(400).json({ message: "Invalid scenario id" });
//     }

//     const normalizedSteps = (testing_steps || []).map((s, i) => ({
//       step_number: i + 1,
//       action_description: s.action_description || "",
//       input_data: s.input_data || "",
//       expected_result: s.expected_result || "",
//       actual_result: s.actual_result || "",
//       status: s.status === "Fail" ? "Fail" : "Pass",
//       remark: s.remark || "",
//     }));

//     const tc = new TestCase({
//       project_id,
//       project_name: project_name || undefined,
//       scenario_id,
//       scenario_number: scenario_number || undefined,
//       test_case_name,
//       requirement_number,
//       build_name_or_number,
//       module_name,
//       pre_condition,
//       test_data,
//       post_condition,
//       severity,
//       test_case_type,
//       brief_description,
//       test_execution_time,
//       testing_steps: normalizedSteps,
//       footer: {
//         author: footer.author || req.user?.name || "",
//         reviewed_by: footer.reviewed_by || "",
//         approved_by: footer.approved_by || "",
//         approved_date: footer.approved_date || null,
//       },
//       // NEW: default is Manual if not provided / invalid
//       test_execution_type: normalizeExecType(test_execution_type),
//     });

//     await tc.save();

//     try {
//       await Scenario.findByIdAndUpdate(scenario_id, { $addToSet: { testCases: tc._id } });
//     } catch (e) {
//       console.warn("Backlink to Scenario failed:", e?.message);
//     }

//     return res.status(201).json({ message: "Test case created successfully", testCase: tc });
//   } catch (error) {
//     console.error("Error creating test case:", error);
//     if (error?.name === "ValidationError") {
//       return res.status(400).json({ message: error.message, details: error.errors });
//     }
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // GET /api/single-project/:projectId/all-test-cases  (UPDATED: filter/sort)
// async function getAllTestCasesForProject(req, res) {
//   try {
//     const { projectId } = req.params;
//     const { execType, sortBy, order } = req.query; // NEW

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }

//     const filter = { project_id: projectId, ...buildExecTypeFilter(execType) };
//     const sortSpec = buildSort(sortBy, order);

//     const rows = await TestCase.find(filter)
//       .select(
//         "_id test_case_name test_case_number module_name testing_steps requirement_number test_execution_type severity createdAt"
//       )
//       .sort(sortSpec);

//     return res.json(rows);
//   } catch (error) {
//     console.error("Error fetching all test cases:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // DELETE /api/delete-test-case/:testCaseId
// async function deleteTestCase(req, res) { /* ... existing code unchanged ... */ }

// async function getTestCaseById(req, res) {
//   try {
//     const { testCaseId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(testCaseId)) {
//       return res.status(400).json({ message: "Invalid test case id" });
//     }

//     const testCase = await TestCase.findById(testCaseId).lean();
//     if (!testCase) {
//       return res.status(404).json({ message: "Test case not found" });
//     }

//     return res.json({
//       testing_steps: Array.isArray(testCase.testing_steps) ? testCase.testing_steps : [],
//       footer: {
//         author: testCase.footer?.author || "",
//         reviewed_by: testCase.footer?.reviewed_by || "",
//         approved_by: testCase.footer?.approved_by || "",
//         approved_date: testCase.footer?.approved_date || null,
//       },
//       ...testCase,
//     });
//   } catch (err) {
//     console.error("getTestCaseById error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // PUT /api/update-test-case/:testCaseId  (UPDATED to include exec type)
// async function updateTestCase(req, res) {
//   try {
//     const { testCaseId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(testCaseId)) {
//       return res.status(400).json({ message: "Invalid test case id" });
//     }

//     const {
//       test_case_name,
//       requirement_number,
//       build_name_or_number,
//       module_name,
//       pre_condition,
//       test_data,
//       post_condition,
//       severity,
//       test_case_type,
//       brief_description,
//       test_execution_time,
//       testing_steps = [],
//       footer = {},
//       // NEW:
//       test_execution_type,
//     } = req.body;

//     const normalizedSteps = (testing_steps || []).map((s, i) => ({
//       step_number: i + 1,
//       action_description: s?.action_description || "",
//       input_data: s?.input_data || "",
//       expected_result: s?.expected_result || "",
//       actual_result: s?.actual_result || "",
//       status: String(s?.status).toLowerCase() === "fail" ? "Fail" : "Pass",
//       remark: s?.remark || "",
//     }));

//     const updateDoc = {
//       test_case_name,
//       requirement_number,
//       build_name_or_number,
//       module_name,
//       pre_condition,
//       test_data,
//       post_condition,
//       severity,
//       test_case_type,
//       brief_description,
//       test_execution_time,
//       testing_steps: normalizedSteps,
//       footer: {
//         author: footer?.author || "",
//         reviewed_by: footer?.reviewed_by || "",
//         approved_by: footer?.approved_by || "",
//         approved_date: footer?.approved_date ? new Date(footer.approved_date) : null,
//       },
//       updatedAt: new Date(),
//     };

//     // only set if provided; otherwise keep existing
//     if (typeof test_execution_type !== "undefined") {
//       updateDoc.test_execution_type = normalizeExecType(test_execution_type);
//     }

//     const updated = await TestCase.findByIdAndUpdate(
//       testCaseId,
//       { $set: updateDoc },
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Test case not found" });
//     }

//     return res.json({ message: "Test case updated successfully", testCase: updated });
//   } catch (err) {
//     console.error("updateTestCase error:", err);
//     if (err?.name === "ValidationError") {
//       return res.status(400).json({ message: err.message, details: err.errors });
//     }
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// // GET /api/all-test-cases  (dashboard list, UPDATED: filter/sort)
// async function getAllTestCases(req, res) {
//   try {
//     const { execType, sortBy, order } = req.query; // NEW
//     const filter = { ...buildExecTypeFilter(execType) };
//     const sortSpec = buildSort(sortBy, order);

//     const rows = await TestCase.find(filter)
//       .select(
//         "_id test_case_name test_case_number project_id project_name module_name test_case_type test_execution_type severity testing_steps createdAt"
//       )
//       .sort(sortSpec);

//     return res.json(rows);
//   } catch (error) {
//     console.error("Error fetching all test cases (dashboard):", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// /* =========================
//    BULK OPERATIONS (NEW)
//    ========================= */

// // POST /api/projects/:projectId/test-cases/bulk-update-execution-type
// // body: { testCaseIds: string[], toType: "Manual" | "Automation" | "Both" }
// async function bulkUpdateTestExecutionType(req, res) {
//   const { projectId } = req.params;
//   const { testCaseIds = [], toType } = req.body;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project id" });
//     }
//     if (!Array.isArray(testCaseIds) || testCaseIds.length === 0) {
//       return res.status(400).json({ message: "testCaseIds is required" });
//     }

//     const normalized = normalizeExecType(toType);

//     const validIds = testCaseIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
//     const { modifiedCount, matchedCount } = await TestCase.updateMany(
//       { _id: { $in: validIds }, project_id: projectId },
//       { $set: { test_execution_type: normalized, updatedAt: new Date() } }
//     );

//     return res.json({
//       message: "Execution type updated",
//       matchedCount,
//       modifiedCount,
//       toType: normalized,
//     });
//   } catch (e) {
//     console.error("bulkUpdateTestExecutionType error:", e);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// module.exports = {
//   // existing exports
//   getProjectById,
//   createProject,
//   getAllProjects,
//   countProjects,
//   deleteProject,
//   getProjectSummary,
//   getProjectTestEngineers,
//   getProjectDevelopers,
//   getTraceabilityMatrix,
//   getUserProjectCount,
//   getUserAssignedProjects,
//   getProjectTestCasesCount,
//   getProjectDefectsCount,
//   getProjectScenarios,
//   addTestCase,
//   getAllTestCasesForProject,
//   deleteTestCase,
//   getTestCaseById,
//   updateTestCase,
//   getAllTestCases,
//   getProjectTestCasesCountByExecutionType,
//   getGlobalTestCasesCountByExecutionType,
//   bulkUpdateTestExecutionType,
// };



// till here old and original code. 
const mongoose = require("mongoose");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const Scenario = require("../models/ScenarioModel");
const TestCase = require("../models/TestCaseModel");
const Bug = require("../models/BugModel");

// ---------------------- helpers ----------------------
function normalizeExecType(v) {
  const s = String(v || "").trim().toLowerCase();
  if (s === "automation") return "Automation";
  if (s === "both" || s === "both manual and automation" || s === "manual+automation") return "Both";
  return "Manual";
}
function buildExecTypeFilter(execTypeParam) {
  if (!execTypeParam) return {};
  const val = normalizeExecType(execTypeParam);
  return { test_execution_type: val };
}
function buildSort(sortBy, order = "desc") {
  const dir = String(order).toLowerCase() === "asc" ? 1 : -1;
  if (sortBy === "test_execution_type") return { test_execution_type: dir, _id: -1 };
  if (sortBy === "createdAt") return { createdAt: dir, _id: -1 };
  if (sortBy === "severity") return { severity: dir, _id: -1 };
  return { _id: -1 };
}
const ROLE_FIELDS = [
  "superAdmins",
  "projectManagers",
  "admins",
  "hrs",
  "testLeads",
  "qaLeads",
  "developerLeads",
  "bas",
  // keep existing
  "developers",
  "testEngineers",
];

// ---------------------- Projects: basic ----------------------
async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }
    const proj = await Project.findById(id)
      .populate("createdBy", "name")
      .populate("developers", "name")
      .populate("testEngineers", "name")
      .populate("superAdmins", "name")
      .populate("projectManagers", "name")
      .populate("admins", "name")
      .populate("hrs", "name")
      .populate("testLeads", "name")
      .populate("qaLeads", "name")
      .populate("developerLeads", "name")
      .populate("bas", "name")
      .lean();

    if (!proj) return res.status(404).json({ error: "Project not found" });
    return res.status(200).json({
      ...proj,
      projectName: proj.project_name ?? proj.projectName ?? "",
    });
  } catch (err) {
    console.error("getProjectById error:", err);
    return res.status(500).json({ error: "Failed to fetch project", details: err.message });
  }
}

// NEW: names for datalist
async function getAllProjectNames(_req, res) {
  try {
    const rows = await Project.find({}, { project_name: 1 }).sort({ project_name: 1 }).lean();
    return res.json({ projects: rows });
  } catch (e) {
    console.error("getAllProjectNames error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

// POST /api/create-project
async function createProject(req, res) {
  try {
    const {
      projectName,
      description,
      startDate,
      endDate,
      deadline,
      developers = [],
      testEngineers = [],
      // NEW: all role arrays (optional on create)
      superAdmins = [],
      projectManagers = [],
      admins = [],
      hrs = [],
      testLeads = [],
      qaLeads = [],
      developerLeads = [],
      bas = [],
      createdBy: createdByFromBody,
      domain,
    } = req.body;

    if (!projectName || !startDate || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const creatorId = req.user?.id || req.user?._id || createdByFromBody;
    if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(401).json({
        message:
          "Unable to determine creator. Ensure you are logged in or include a valid 'createdBy' in the request body.",
      });
    }

    const existing = await Project.findByNameInsensitive(projectName);
    if (existing) {
      return res.status(409).json({
        message:
          "A project with this name already exists (case-insensitive). Please choose a different name or edit the existing project.",
        projectId: existing._id,
      });
    }

    const p = new Project({
      project_name: projectName,
      description,
      startDate,
      endDate: endDate || null,
      deadline,
      createdBy: creatorId,
      domain: domain || undefined,

      developers: developers.filter(Boolean),
      testEngineers: testEngineers.filter(Boolean),

      // NEW role fields
      superAdmins: superAdmins.filter(Boolean),
      projectManagers: projectManagers.filter(Boolean),
      admins: admins.filter(Boolean),
      hrs: hrs.filter(Boolean),
      testLeads: testLeads.filter(Boolean),
      qaLeads: qaLeads.filter(Boolean),
      developerLeads: developerLeads.filter(Boolean),
      bas: bas.filter(Boolean),
    });

    await p.save();
    return res.status(201).json({ message: "Project created successfully", project: p });
  } catch (error) {
    console.error("Server error during project creation:", error);
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Project name already exists (case-insensitive)." });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: error.message, details: error.errors });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/projects/:projectId/members  (replace OR patch)
async function updateProjectMembers(req, res) {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    // Accept replace arrays for every role field
    const body = req.body || {};
    const ops = {};
    const setDoc = {};
    const addDoc = {};
    const pullDoc = {};

    // 1) Replace-mode
    ROLE_FIELDS.forEach((field) => {
      if (Array.isArray(body[field])) setDoc[field] = body[field].filter(Boolean);
    });

    // 2) Optional PATCH-mode: addX/removeX per field (e.g., addSuperAdmins/removeSuperAdmins)
    ROLE_FIELDS.forEach((field) => {
      const addKey = `add${field.charAt(0).toUpperCase()}${field.slice(1)}`;
      const removeKey = `remove${field.charAt(0).toUpperCase()}${field.slice(1)}`;

      if (Array.isArray(body[addKey]) && body[addKey].length) {
        addDoc[field] = { $each: body[addKey].filter(Boolean) };
      }
      if (Array.isArray(body[removeKey]) && body[removeKey].length) {
        pullDoc[field] = { $in: body[removeKey].filter(Boolean) };
      }
    });

    if (Object.keys(setDoc).length) ops.$set = setDoc;
    if (Object.keys(addDoc).length) ops.$addToSet = addDoc;
    if (Object.keys(pullDoc).length) ops.$pull = pullDoc;
    if (!Object.keys(ops).length) {
      return res.status(400).json({ message: "No valid member updates provided." });
    }

    ops.$set = { ...(ops.$set || {}), updatedAt: new Date() };

    const populateAll = (q) =>
      q
        .populate("developers", "name")
        .populate("testEngineers", "name")
        .populate("superAdmins", "name")
        .populate("projectManagers", "name")
        .populate("admins", "name")
        .populate("hrs", "name")
        .populate("testLeads", "name")
        .populate("qaLeads", "name")
        .populate("developerLeads", "name")
        .populate("bas", "name");

    const updated = await populateAll(
      Project.findByIdAndUpdate(projectId, ops, { new: true, runValidators: true })
    );

    if (!updated) return res.status(404).json({ message: "Project not found" });
    return res.json({ message: "Members updated", project: updated });
  } catch (e) {
    console.error("updateProjectMembers error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

// GET /api/all-projects?search=
async function getAllProjects(req, res) {
  try {
    const { search = "" } = req.query;
    const query = search ? { project_name: { $regex: search, $options: "i" } } : {};
    const projects = await Project.find(query)
      .populate("createdBy", "name")
      .populate("developers", "name")
      .populate("testEngineers", "name")
      .populate("projectManagers", "name")
      .populate("qaLeads", "name");
    return res.json({ projects, totalCount: projects.length });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// count/delete/summary/members/testcases (unchanged except populate additions where relevant)
async function countProjects(_req, res) {
  try {
    const totalProjects = await Project.countDocuments();
    return res.json({ totalProjects });
  } catch (error) {
    console.error("Error fetching project count:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid project id" });

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await Project.findByIdAndDelete(id);
    return res.status(200).json({ message: "Project has been successfully deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getProjectSummary(req, res) {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await Project.findById(projectId)
      .populate("createdBy", "name")
      .populate("developers", "name")
      .populate("testEngineers", "name")
      .populate("superAdmins", "name")
      .populate("projectManagers", "name")
      .populate("admins", "name")
      .populate("hrs", "name")
      .populate("testLeads", "name")
      .populate("qaLeads", "name")
      .populate("developerLeads", "name")
      .populate("bas", "name")
      .populate({
        path: "scenarios",
        populate: { path: "testCases", select: "title description" },
      });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const totalScenarios = await Scenario.countDocuments({ project: projectId });

    return res.json({
      projectName: project.project_name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      deadline: project.deadline,
      domain: project.domain,

      developers: project.developers,
      testEngineers: project.testEngineers,

      superAdmins: project.superAdmins,
      projectManagers: project.projectManagers,
      admins: project.admins,
      hrs: project.hrs,
      testLeads: project.testLeads,
      qaLeads: project.qaLeads,
      developerLeads: project.developerLeads,
      bas: project.bas,

      createdBy: project.createdBy,
      scenarios: project.scenarios,
      totalScenarios,
    });
  } catch (error) {
    console.error("Error fetching project:", error.message);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
}

// Members fetchers (kept)
async function getProjectTestEngineers(req, res) {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    const project = await Project.findById(projectId).populate("testEngineers");
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json({ testEngineers: project.testEngineers });
  } catch (error) {
    console.error("Error fetching test engineers:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
async function getProjectDevelopers(req, res) {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    const project = await Project.findById(projectId).populate("developers");
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json({ developers: project.developers });
  } catch (error) {
    console.error("Error fetching developers:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Traceability (unchanged)
async function getTraceabilityMatrix(req, res) {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const scenarios = await Scenario.find({ project: projectId }).populate("module", "name");
    const testCases = await TestCase.find({ project_id: projectId });
    const bugs = await Bug.find({ project_id: projectId });

    const getTestCaseStatus = (testSteps) => {
      if (!testSteps || testSteps.length === 0) return "N/A";
      const failed = testSteps.filter((s) => s.status === "Fail");
      return failed.length > 0 ? "Fail" : "Pass";
    };

    const matrix = scenarios.map((sc) => {
      const tc = testCases.find(
        (t) => t.scenario_id && sc._id && t.scenario_id.toString() === sc._id.toString()
      );

      const defect = tc
        ? bugs.find(
            (b) =>
              b.test_case_number &&
              tc.test_case_number &&
              b.test_case_number.toString() === tc.test_case_number.toString()
          )
        : null;

      return {
        scenarioNumber: sc.scenario_number,
        scenarioText: sc.scenario_text,
        moduleName: sc.module?.name || "Unassigned",
        testCaseNumber: tc ? tc.test_case_number : "Missing",
        testCaseStatus: tc ? getTestCaseStatus(tc.testing_steps) : "N/A",
        defectNumber: defect ? defect.bug_id : "N/A",
        defectReportStatus:
          tc && getTestCaseStatus(tc.testing_steps) === "Fail"
            ? defect
              ? "Present"
              : "Missing"
            : "N/A",
        isMissingTestCases: !tc,
        testExecutionType: tc ? tc.test_execution_type || "Manual" : "Manual",
      };
    });

    return res.json(matrix);
  } catch (error) {
    console.error("Error fetching traceability matrix:", error.message);
    return res.status(500).send("Error fetching traceability matrix");
  }
}

// User ↔ projects (unchanged)
async function getUserProjectCount(req, res) {
  const { userId } = req.params;
  const { role } = req.query;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    let assignedProjectsCount = 0;
    if (role === "test_engineer") {
      assignedProjectsCount = await Project.countDocuments({ testEngineers: userId });
    } else if (role === "developer") {
      assignedProjectsCount = await Project.countDocuments({ developers: userId });
    } else if (role === "qa_lead" || role === "admin") {
      assignedProjectsCount = await Project.countDocuments({ createdBy: userId });
    }
    return res.json({ assignedProjectsCount });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching project counts", error });
  }
}
async function getUserAssignedProjects(req, res) {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const assignedProjects = await Project.find({
      $or: [{ testEngineers: userId }, { developers: userId }, { createdBy: userId }],
    });
    return res.json({ assignedProjects });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching assigned projects", error });
  }
}

// ===== counts & test cases (unchanged) =====
async function getProjectTestCasesCount(req, res) {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    const totalTestCases = await TestCase.countDocuments({ project_id: projectId });
    return res.json({ totalTestCases });
  } catch (error) {
    console.error("Error counting test cases:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
async function getProjectTestCasesCountByExecutionType(req, res) {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    const agg = await TestCase.aggregate([
      { $match: { project_id: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: "$test_execution_type", count: { $sum: 1 } } },
    ]);
    const toMap = Object.fromEntries(agg.map((r) => [r._id || "Manual", r.count]));
    return res.json({
      Manual: toMap["Manual"] || 0,
      Automation: toMap["Automation"] || 0,
      Both: toMap["Both"] || 0,
      total: (toMap["Manual"] || 0) + (toMap["Automation"] || 0) + (toMap["Both"] || 0),
    });
  } catch (e) {
    console.error("getProjectTestCasesCountByExecutionType error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}
async function getGlobalTestCasesCountByExecutionType(_req, res) {
  try {
    const agg = await TestCase.aggregate([{ $group: { _id: "$test_execution_type", count: { $sum: 1 } } }]);
    const toMap = Object.fromEntries(agg.map((r) => [r._id || "Manual", r.count]));
    return res.json({
      Manual: toMap["Manual"] || 0,
      Automation: toMap["Automation"] || 0,
      Both: toMap["Both"] || 0,
      total: (toMap["Manual"] || 0) + (toMap["Automation"] || 0) + (toMap["Both"] || 0),
    });
  } catch (e) {
    console.error("getGlobalTestCasesCountByExecutionType error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}
async function getProjectDefectsCount(req, res) {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    const totalDefects = await Bug.countDocuments({ project_id: projectId });
    return res.json({ totalDefects });
  } catch (error) {
    console.error("Error counting defects:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
async function getProjectScenarios(req, res) {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    const scenarios = await Scenario.find({ project: projectId })
      .select("_id scenario_number scenario_text")
      .sort({ scenario_number: 1 });
    return res.json(scenarios);
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// ===== Test case CRUD (unchanged) =====
async function addTestCase(req, res) {
  try {
    const {
      project_id,
      project_name,
      scenario_id,
      scenario_number,
      test_case_name,
      requirement_number,
      build_name_or_number,
      module_name,
      pre_condition,
      test_data,
      post_condition,
      severity,
      test_case_type,
      brief_description,
      test_execution_time,
      testing_steps = [],
      footer = {},
      test_execution_type,
    } = req.body;

    if (!project_id || !scenario_id || !test_case_name || !requirement_number || !module_name) {
      return res.status(400).json({ message: "Missing required test case fields." });
    }
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    if (!mongoose.Types.ObjectId.isValid(scenario_id)) {
      return res.status(400).json({ message: "Invalid scenario id" });
    }

    const normalizedSteps = (testing_steps || []).map((s, i) => ({
      step_number: i + 1,
      action_description: s.action_description || "",
      input_data: s.input_data || "",
      expected_result: s.expected_result || "",
      actual_result: s.actual_result || "",
      status: s.status === "Fail" ? "Fail" : "Pass",
      remark: s.remark || "",
    }));

    const tc = new TestCase({
      project_id,
      project_name: project_name || undefined,
      scenario_id,
      scenario_number: scenario_number || undefined,
      test_case_name,
      requirement_number,
      build_name_or_number,
      module_name,
      pre_condition,
      test_data,
      post_condition,
      severity,
      test_case_type,
      brief_description,
      test_execution_time,
      testing_steps: normalizedSteps,
      footer: {
        author: footer.author || req.user?.name || "",
        reviewed_by: footer.reviewed_by || "",
        approved_by: footer.approved_by || "",
        approved_date: footer.approved_date || null,
      },
      test_execution_type: normalizeExecType(test_execution_type),
    });

    await tc.save();

    try {
      await Scenario.findByIdAndUpdate(scenario_id, { $addToSet: { testCases: tc._id } });
    } catch (e) {
      console.warn("Backlink to Scenario failed:", e?.message);
    }

    return res.status(201).json({ message: "Test case created successfully", testCase: tc });
  } catch (error) {
    console.error("Error creating test case:", error);
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: error.message, details: error.errors });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

async function getAllTestCasesForProject(req, res) {
  try {
    const { projectId } = req.params;
    const { execType, sortBy, order } = req.query;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const filter = { project_id: projectId, ...buildExecTypeFilter(execType) };
    const sortSpec = buildSort(sortBy, order);

    const rows = await TestCase.find(filter)
      .select(
        "_id test_case_name test_case_number module_name testing_steps requirement_number test_execution_type severity createdAt"
      )
      .sort(sortSpec);

    return res.json(rows);
  } catch (error) {
    console.error("Error fetching all test cases:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteTestCase(req, res) {
  try {
    const { testCaseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(testCaseId)) {
      return res.status(400).json({ message: "Invalid test case id" });
    }

    const tc = await TestCase.findById(testCaseId);
    if (!tc) {
      return res.status(404).json({ message: "Test case not found" });
    }

    if (tc.scenario_id && mongoose.Types.ObjectId.isValid(tc.scenario_id)) {
      await Scenario.findByIdAndUpdate(tc.scenario_id, { $pull: { testCases: tc._id } });
    }

    await TestCase.findByIdAndDelete(testCaseId);
    return res.json({ message: "Test case deleted successfully" });
  } catch (error) {
    console.error("deleteTestCase error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getTestCaseById(req, res) {
  try {
    const { testCaseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(testCaseId)) {
      return res.status(400).json({ message: "Invalid test case id" });
    }

    const testCase = await TestCase.findById(testCaseId).lean();
    if (!testCase) {
      return res.status(404).json({ message: "Test case not found" });
    }

    return res.json({
      testing_steps: Array.isArray(testCase.testing_steps) ? testCase.testing_steps : [],
      footer: {
        author: testCase.footer?.author || "",
        reviewed_by: testCase.footer?.reviewed_by || "",
        approved_by: testCase.footer?.approved_by || "",
        approved_date: testCase.footer?.approved_date || null,
      },
      ...testCase,
    });
  } catch (err) {
    console.error("getTestCaseById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateTestCase(req, res) {
  try {
    const { testCaseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(testCaseId)) {
      return res.status(400).json({ message: "Invalid test case id" });
    }

    const {
      test_case_name,
      requirement_number,
      build_name_or_number,
      module_name,
      pre_condition,
      test_data,
      post_condition,
      severity,
      test_case_type,
      brief_description,
      test_execution_time,
      testing_steps = [],
      footer = {},
      test_execution_type,
    } = req.body;

    const normalizedSteps = (testing_steps || []).map((s, i) => ({
      step_number: i + 1,
      action_description: s?.action_description || "",
      input_data: s?.input_data || "",
      expected_result: s?.expected_result || "",
      actual_result: s?.actual_result || "",
      status: String(s?.status).toLowerCase() === "fail" ? "Fail" : "Pass",
      remark: s?.remark || "",
    }));

    const updateDoc = {
      test_case_name,
      requirement_number,
      build_name_or_number,
      module_name,
      pre_condition,
      test_data,
      post_condition,
      severity,
      test_case_type,
      brief_description,
      test_execution_time,
      testing_steps: normalizedSteps,
      footer: {
        author: footer?.author || "",
        reviewed_by: footer?.reviewed_by || "",
        approved_by: footer?.approved_by || "",
        approved_date: footer?.approved_date ? new Date(footer.approved_date) : null,
      },
      updatedAt: new Date(),
    };

    if (typeof test_execution_type !== "undefined") {
      updateDoc.test_execution_type = normalizeExecType(test_execution_type);
    }

    const updated = await TestCase.findByIdAndUpdate(
      testCaseId,
      { $set: updateDoc },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Test case not found" });
    }

    return res.json({ message: "Test case updated successfully", testCase: updated });
  } catch (err) {
    console.error("updateTestCase error:", err);
    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: err.message, details: err.errors });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

async function getAllTestCases(req, res) {
  try {
    const { execType, sortBy, order } = req.query;
    const filter = { ...buildExecTypeFilter(execType) };
    const sortSpec = buildSort(sortBy, order);

    const rows = await TestCase.find(filter)
      .select(
        "_id test_case_name test_case_number project_id project_name module_name test_case_type test_execution_type severity testing_steps createdAt"
      )
      .sort(sortSpec);

    return res.json(rows);
  } catch (error) {
    console.error("Error fetching all test cases (dashboard):", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// bulk execution type (unchanged)
async function bulkUpdateTestExecutionType(req, res) {
  const { projectId } = req.params;
  const { testCaseIds = [], toType } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    if (!Array.isArray(testCaseIds) || testCaseIds.length === 0) {
      return res.status(400).json({ message: "testCaseIds is required" });
    }

    const normalized = normalizeExecType(toType);
    const validIds = testCaseIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    const { matchedCount, modifiedCount } = await TestCase.updateMany(
      { _id: { $in: validIds }, project_id: projectId },
      { $set: { test_execution_type: normalized, updatedAt: new Date() } }
    );

    return res.json({
      message: "Execution type updated",
      matchedCount,
      modifiedCount,
      toType: normalized,
    });
  } catch (e) {
    console.error("bulkUpdateTestExecutionType error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  // basic
  getProjectById,
  getAllProjectNames,
  createProject,
  getAllProjects,
  countProjects,
  deleteProject,
  getProjectSummary,
  getProjectTestEngineers,
  getProjectDevelopers,
  getTraceabilityMatrix,
  getUserProjectCount,
  getUserAssignedProjects,

  // counts
  getProjectTestCasesCount,
  getProjectDefectsCount,
  getProjectScenarios,
  getAllTestCasesForProject,
  getTestCaseById,
  updateTestCase,
  getAllTestCases,
  getProjectTestCasesCountByExecutionType,
  getGlobalTestCasesCountByExecutionType,

  // members + bulk ops
  updateProjectMembers,
  bulkUpdateTestExecutionType,

  // test case CRUD
  addTestCase,
  deleteTestCase,
};
