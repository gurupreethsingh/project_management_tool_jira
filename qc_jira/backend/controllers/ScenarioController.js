// // controllers/ScenarioController.js
// const mongoose = require("mongoose");
// const Scenario = require("../models/ScenarioModel");
// const Change = require("../models/ChangeModel");
// const Project = require("../models/ProjectModel");
// const User = require("../models/UserModel");
// const Module = require("../models/ModuleModel");

// // ---- helpers ----
// const generateScenarioNumber = (projectName) => {
//   const initials = projectName
//     .split(" ")
//     .map((w) => w[0]?.toUpperCase() ?? "")
//     .join("");
//   const randomNum = Math.floor(1000 + Math.random() * 9000);
//   return `${initials}-${randomNum}`;
// };

// // Normalize strings into a stable key (used for modules and scenario texts)
// const normalizeKey = (text = "") =>
//   text
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, " ") // non-alphanumerics to space
//     .replace(/\s+/g, " ") // collapse spaces
//     .replace(/\s+/g, "") // remove all spaces
//     .substring(0, 200);

// const normalizeModuleKey = normalizeKey;

// // Find or create module by display name for a specific project
// const findOrCreateModule = async (projectId, name, createdBy) => {
//   const key = normalizeModuleKey(name);
//   try {
//     const existing = await Module.findOne({ project: projectId, key });
//     if (existing) return existing;

//     const created = await Module.create({
//       name: name.trim(), // NOTE: using "name" to match ModuleModel
//       key,
//       project: projectId,
//       createdBy,
//     });
//     return created;
//   } catch (err) {
//     // Handle race condition (unique index)
//     if (err?.code === 11000) {
//       const again = await Module.findOne({ project: projectId, key });
//       if (again) return again;
//     }
//     throw err;
//   }
// };

// // Ensure an "Unassigned" module exists (used for detach ops and legacy docs)
// const getOrCreateUnassignedModule = async (projectId, createdBy) => {
//   return await findOrCreateModule(projectId, "Unassigned", createdBy);
// };

// /* =========================================================
//    CREATE (POST)  — keeps your logic and adds duplicate guard
//    ========================================================= */
// // POST /single-projects/:id/add-scenario
// exports.addScenario = async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const { scenario_text, moduleId, module_name } = req.body;

//     if (!scenario_text) {
//       return res.status(400).json({ error: "Scenario text is required" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ error: "Invalid project ID" });
//     }

//     const project = await Project.findById(projectId);
//     if (!project) return res.status(404).json({ error: "Project not found" });

//     const createdBy = req.user?.id || req.body.createdBy;
//     if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
//       return res
//         .status(401)
//         .json({ error: "Authentication required: createdBy missing/invalid" });
//     }
//     const creator = await User.findById(createdBy).select("_id");
//     if (!creator)
//       return res.status(404).json({ error: "Creator user not found" });

//     // You must provide either moduleId OR module_name
//     if (!moduleId && !module_name) {
//       return res.status(400).json({
//         error: "Module is required. Provide either moduleId or module_name.",
//       });
//     }

//     // Duplicate prevention
//     const scenario_key = normalizeKey(scenario_text);
//     const dupe = await Scenario.findOne({ project: projectId, scenario_key });
//     if (dupe) {
//       return res
//         .status(409)
//         .json({ error: "A scenario with similar text already exists." });
//     }

//     let moduleDoc = null;
//     if (moduleId) {
//       if (!mongoose.Types.ObjectId.isValid(moduleId)) {
//         return res.status(400).json({ error: "Invalid moduleId" });
//       }
//       moduleDoc = await Module.findOne({ _id: moduleId, project: projectId });
//       if (!moduleDoc) {
//         return res
//           .status(404)
//           .json({ error: "Module not found for this project" });
//       }
//     } else if (module_name) {
//       moduleDoc = await findOrCreateModule(projectId, module_name, createdBy);
//     }

//     const scenario_number = generateScenarioNumber(project.project_name);

//     const scenario = new Scenario({
//       scenario_text,
//       scenario_key,
//       scenario_number,
//       project: projectId,
//       module: moduleDoc._id,
//       createdBy,
//     });

//     await scenario.save();

//     await Project.findByIdAndUpdate(projectId, {
//       $push: { scenarios: scenario._id },
//     });

//     const populated = await Scenario.findById(scenario._id).populate(
//       "module",
//       "name"
//     );

//     return res
//       .status(201)
//       .json({ message: "Scenario added successfully", scenario: populated });
//   } catch (error) {
//     console.error("Error adding scenario:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// /* =========================================================
//    UPDATE (PUT) — duplicate guard + optional module move
//    + auto-assign Unassigned if legacy scenario has no module
//    ========================================================= */
// // PUT /single-project/scenario/:scenarioId
// exports.updateScenario = async (req, res) => {
//   const { scenario_text, userId, moduleId, module_name } = req.body;
//   const { scenarioId } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
//       return res.status(400).json({ message: "Invalid scenario ID" });
//     }

//     const scenario = await Scenario.findById(scenarioId).populate("project");
//     if (!scenario) {
//       return res.status(404).json({ message: "Scenario not found" });
//     }

//     const actorId = req.user?.id || userId;
//     if (!actorId || !mongoose.Types.ObjectId.isValid(actorId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     const user = await User.findById(actorId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Track changes for scenario_text + prevent duplicates
//     if (
//       typeof scenario_text === "string" &&
//       scenario_text !== scenario.scenario_text
//     ) {
//       const newKey = normalizeKey(scenario_text);
//       const dupe = await Scenario.findOne({
//         project: scenario.project._id,
//         scenario_key: newKey,
//         _id: { $ne: scenario._id },
//       });
//       if (dupe) {
//         return res
//           .status(409)
//           .json({
//             message: "Another scenario with similar text already exists.",
//           });
//       }

//       const change = new Change({
//         scenario: scenario._id,
//         previous_text: scenario.scenario_text,
//         user: user._id,
//         time: Date.now(),
//       });
//       await change.save();

//       scenario.scenario_text = scenario_text;
//       scenario.scenario_key = newKey; // keep index in sync
//     }

//     // Optional: allow updating the module as well
//     if (moduleId || module_name) {
//       let moduleDoc;
//       if (moduleId) {
//         if (!mongoose.Types.ObjectId.isValid(moduleId)) {
//           return res.status(400).json({ message: "Invalid moduleId" });
//         }
//         moduleDoc = await Module.findOne({
//           _id: moduleId,
//           project: scenario.project._id,
//         });
//         if (!moduleDoc)
//           return res
//             .status(404)
//             .json({ message: "Module not found for this project" });
//       } else {
//         moduleDoc = await findOrCreateModule(
//           scenario.project._id,
//           module_name,
//           actorId
//         );
//       }
//       scenario.module = moduleDoc._id;
//     }

//     // Auto-assign Unassigned for legacy scenarios missing module
//     if (!scenario.module) {
//       const fallback = await getOrCreateUnassignedModule(
//         scenario.project._id,
//         actorId
//       );
//       scenario.module = fallback._id;
//     }

//     // Update updater metadata
//     scenario.updatedBy = { user: user._id, updateTime: Date.now() };

//     await scenario.save();
//     const populated = await Scenario.findById(scenario._id).populate(
//       "module",
//       "name"
//     );

//     return res.json({
//       message: "Scenario updated successfully",
//       scenario: populated,
//     });
//   } catch (error) {
//     console.error("Error updating scenario:", error);
//     return res
//       .status(500)
//       .json({ message: "Error updating scenario", error: error.message });
//   }
// };

// /* =========================================================
//    EXISTING LIST/HISTORY/DELETE/GET NUMBER/SIMPLE LIST — kept
//    ========================================================= */

// // GET /single-project/:id/view-all-scenarios
// exports.listScenariosByProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid project ID" });
//     }

//     const project = await Project.findById(id);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     const scenarios = await Scenario.find({ project: id })
//       .populate("createdBy", "name")
//       .populate("project", "project_name")
//       .populate("testCases", "title description")
//       .populate("module", "name");

//     if (!scenarios || scenarios.length === 0) {
//       return res.json([]);
//     }

//     return res.json(scenarios);
//   } catch (error) {
//     console.error("Error fetching scenarios:", error.message);
//     return res.status(500).json({ message: "Server error: " + error.message });
//   }
// };

// // GET /single-project/:projectId/scenario-history/:scenarioId
// exports.getScenarioHistory = async (req, res) => {
//   const { scenarioId } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
//       return res.status(400).json({ message: "Invalid scenario ID" });
//     }

//     const scenario = await Scenario.findById(scenarioId)
//       .populate("createdBy project")
//       .populate("module", "name");
//     if (!scenario) {
//       return res.status(404).json({ message: "Scenario not found" });
//     }

//     const changes = await Change.find({ scenario: scenarioId })
//       .populate("user")
//       .sort({ time: -1 });

//     return res.json({ scenario, changes });
//   } catch (error) {
//     console.error("Error fetching scenario details:", error);
//     return res
//       .status(500)
//       .json({ message: "Error fetching scenario details", error });
//   }
// };

// // DELETE /single-project/scenario/:scenarioId
// exports.deleteScenario = async (req, res) => {
//   try {
//     const { scenarioId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
//       return res.status(400).json({ message: "Invalid scenario ID" });
//     }

//     const scenario = await Scenario.findByIdAndDelete(scenarioId);
//     if (!scenario) {
//       return res.status(404).json({ message: "Scenario not found" });
//     }

//     await Change.deleteMany({ scenario: scenarioId });

//     return res.status(200).json({
//       message: "Scenario and its history deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting scenario:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// // GET /single-project/scenario/:scenarioId/scenario-number
// exports.getScenarioNumber = async (req, res) => {
//   const { scenarioId } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
//       return res.status(400).json({ message: "Invalid scenario ID" });
//     }

//     const scenario = await Scenario.findById(scenarioId);
//     if (!scenario) {
//       return res.status(404).json({ message: "Scenario not found" });
//     }

//     return res.json({ scenarioNumber: scenario.scenario_number });
//   } catch (error) {
//     console.error("Error fetching scenario number:", error);
//     return res
//       .status(500)
//       .json({ message: "Error fetching scenario number", error });
//   }
// };

// // GET /projects/:projectId/scenarios  (simple)
// exports.getScenariosSimple = async (req, res) => {
//   const { projectId } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project ID" });
//     }

//     const project = await Project.findById(projectId).populate("scenarios");
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     const scenarios = await Scenario.find({ project: projectId }).populate(
//       "module",
//       "name"
//     );
//     if (!scenarios || scenarios.length === 0) {
//       return res.json([]);
//     }

//     const response = scenarios.map((s) => ({
//       _id: s._id,
//       scenario_number: s.scenario_number,
//       scenario_text: s.scenario_text,
//       module: s.module ? { _id: s.module._id, name: s.module.name } : null,
//     }));

//     return res.json(response);
//   } catch (error) {
//     console.error("Error fetching scenarios:", error);
//     return res.status(500).json({ message: "Error fetching scenarios" });
//   }
// };

// /* ===========================
//    MODULE CONTROLLER METHODS
//    =========================== */

// // GET /single-projects/:projectId/modules
// exports.listModulesByProject = async (req, res) => {
//   const { projectId } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project ID" });
//     }
//     const mods = await Module.find({ project: projectId }).sort({ name: 1 });
//     return res.json(mods);
//   } catch (err) {
//     console.error("Error listing modules:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // POST /single-projects/:projectId/modules  (create/find by name)
// exports.createOrGetModule = async (req, res) => {
//   const { projectId } = req.params;
//   const { name } = req.body;
//   try {
//     if (!name || !name.trim()) {
//       return res.status(400).json({ message: "Module name is required" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project ID" });
//     }

//     const createdBy = req.user?.id || req.body.createdBy;
//     if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     const mod = await findOrCreateModule(projectId, name, createdBy);
//     return res.status(201).json(mod);
//   } catch (err) {
//     console.error("Error creating module:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// /* =====================================
//    SEARCH/AUTOSUGGEST & BULK MOVES
//    ===================================== */

// // GET /single-projects/:projectId/scenarios/search?q=...
// exports.searchScenarios = async (req, res) => {
//   const { projectId } = req.params;
//   const { q = "" } = req.query;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project ID" });
//     }

//     if (!q.trim()) return res.json([]);

//     // simple regex search; tune as needed
//     const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

//     const results = await Scenario.find(
//       { project: projectId, scenario_text: { $regex: regex } },
//       { scenario_text: 1, scenario_number: 1, module: 1 }
//     )
//       .limit(10)
//       .populate({ path: "module", select: "name" })
//       .lean(); // avoid virtuals/getters for stability + perf

//     return res.json(results);
//   } catch (error) {
//     console.error("Error searching scenarios:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // POST /single-projects/:projectId/scenarios/transfer
// // body: { scenarioIds: [..], toModuleId?, toModuleName? }
// exports.transferScenarios = async (req, res) => {
//   const { projectId } = req.params;
//   const { scenarioIds = [], toModuleId, toModuleName } = req.body;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project ID" });
//     }
//     if (!Array.isArray(scenarioIds) || scenarioIds.length === 0) {
//       return res.status(400).json({ message: "scenarioIds is required" });
//     }

//     // resolve destination module
//     let targetModule;
//     if (toModuleId) {
//       if (!mongoose.Types.ObjectId.isValid(toModuleId)) {
//         return res.status(400).json({ message: "Invalid toModuleId" });
//       }
//       targetModule = await Module.findOne({
//         _id: toModuleId,
//         project: projectId,
//       });
//       if (!targetModule)
//         return res
//           .status(404)
//           .json({ message: "Destination module not found" });
//     } else if (toModuleName) {
//       const actorId = req.user?.id || null;
//       targetModule = await findOrCreateModule(
//         projectId,
//         toModuleName,
//         actorId || undefined
//       );
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Provide toModuleId or toModuleName" });
//     }

//     const validIds = scenarioIds.filter((id) =>
//       mongoose.Types.ObjectId.isValid(id)
//     );
//     const { modifiedCount } = await Scenario.updateMany(
//       { _id: { $in: validIds }, project: projectId },
//       {
//         $set: {
//           module: targetModule._id,
//           updatedBy: { user: req.user?.id || null, updateTime: new Date() },
//         },
//       }
//     );

//     return res.json({
//       message: "Scenarios transferred",
//       modifiedCount,
//       to: { _id: targetModule._id, name: targetModule.name },
//     });
//   } catch (error) {
//     console.error("Error transferring scenarios:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // POST /single-projects/:projectId/scenarios/detach
// // body: { scenarioIds: [..] } -> move to "Unassigned"
// exports.detachScenariosToUnassigned = async (req, res) => {
//   const { projectId } = req.params;
//   const { scenarioIds = [] } = req.body;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: "Invalid project ID" });
//     }
//     if (!Array.isArray(scenarioIds) || scenarioIds.length === 0) {
//       return res.status(400).json({ message: "scenarioIds is required" });
//     }

//     const unassigned = await getOrCreateUnassignedModule(
//       projectId,
//       req.user?.id || undefined
//     );

//     const validIds = scenarioIds.filter((id) =>
//       mongoose.Types.ObjectId.isValid(id)
//     );
//     const { modifiedCount } = await Scenario.updateMany(
//       { _id: { $in: validIds }, project: projectId },
//       {
//         $set: {
//           module: unassigned._id,
//           updatedBy: { user: req.user?.id || null, updateTime: new Date() },
//         },
//       }
//     );

//     return res.json({
//       message: "Scenarios detached to Unassigned",
//       modifiedCount,
//       to: { _id: unassigned._id, name: unassigned.name },
//     });
//   } catch (error) {
//     console.error("Error detaching scenarios:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

//

// controllers/ScenarioController.js
const mongoose = require("mongoose");
const Scenario = require("../models/ScenarioModel");
const Change = require("../models/ChangeModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const Module = require("../models/ModuleModel");

// ---- helpers ----
const generateScenarioNumber = (projectName) => {
  const initials = projectName
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${initials}-${randomNum}`;
};

// very rare race-proof wrapper (one retry, then timestamp suffix)
const safeGenerateScenarioNumber = async (projectId, projectName) => {
  let candidate = generateScenarioNumber(projectName);
  let exists = await Scenario.exists({ project: projectId, scenario_number: candidate });
  if (!exists) return candidate;
  candidate = generateScenarioNumber(projectName);
  exists = await Scenario.exists({ project: projectId, scenario_number: candidate });
  if (!exists) return candidate;
  return `${projectName.split(" ").map(w => w[0]?.toUpperCase() ?? "").join("")}-${Date.now().toString().slice(-8)}`;
};

// Normalize strings into a stable key (used for modules and scenario texts)
const normalizeKey = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ") // non-alphanumerics to space
    .replace(/\s+/g, " ") // collapse spaces
    .replace(/\s+/g, "") // remove all spaces
    .substring(0, 200);

const normalizeModuleKey = normalizeKey;

// Find or create module by display name for a specific project
const findOrCreateModule = async (projectId, name, createdBy) => {
  const key = normalizeModuleKey(name);
  const nameTrim = String(name || "").trim();
  try {
    const existing = await Module.findOne({ project: projectId, key });
    if (existing) return existing;

    const created = await Module.create({
      name: nameTrim, // using "name" to match ModuleModel
      key,
      project: projectId,
      createdBy,
    });
    return created;
  } catch (err) {
    // Handle race condition (unique index)
    if (err?.code === 11000) {
      const again = await Module.findOne({ project: projectId, key });
      if (again) return again;
    }
    throw err;
  }
};

// Ensure an "Unassigned" module exists (used for detach ops and legacy docs)
const getOrCreateUnassignedModule = async (projectId, createdBy) => {
  return await findOrCreateModule(projectId, "Unassigned", createdBy);
};

/* =========================================================
   CREATE (POST)  — keeps your logic and adds duplicate guard
   ========================================================= */
// POST /single-projects/:id/add-scenario
const addScenario = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { scenario_text, moduleId, module_name } = req.body;

    if (!scenario_text) {
      return res.status(400).json({ error: "Scenario text is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const createdBy = req.user?.id || req.body.createdBy;
    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
      return res
        .status(401)
        .json({ error: "Authentication required: createdBy missing/invalid" });
    }
    const creator = await User.findById(createdBy).select("_id");
    if (!creator)
      return res.status(404).json({ error: "Creator user not found" });

    // You must provide either moduleId OR module_name
    if (!moduleId && !module_name) {
      return res.status(400).json({
        error: "Module is required. Provide either moduleId or module_name.",
      });
    }

    // Duplicate prevention
    const scenario_key = normalizeKey(scenario_text);
    const dupe = await Scenario.findOne({ project: projectId, scenario_key });
    if (dupe) {
      return res
        .status(409)
        .json({ error: "A scenario with similar text already exists." });
    }

    let moduleDoc = null;
    if (moduleId) {
      if (!mongoose.Types.ObjectId.isValid(moduleId)) {
        return res.status(400).json({ error: "Invalid moduleId" });
      }
      moduleDoc = await Module.findOne({ _id: moduleId, project: projectId });
      if (!moduleDoc) {
        return res
          .status(404)
          .json({ error: "Module not found for this project" });
      }
    } else if (module_name) {
      moduleDoc = await findOrCreateModule(projectId, module_name, createdBy);
    }

    // safer generator (still your format)
    const scenario_number = await safeGenerateScenarioNumber(projectId, project.project_name);

    const scenario = new Scenario({
      scenario_text,
      scenario_key,
      scenario_number,
      project: projectId,
      module: moduleDoc._id,
      createdBy,
    });

    await scenario.save();

    await Project.findByIdAndUpdate(projectId, {
      $push: { scenarios: scenario._id },
    });

    const populated = await Scenario.findById(scenario._id).populate(
      "module",
      "name"
    );

    return res
      .status(201)
      .json({ message: "Scenario added successfully", scenario: populated });
  } catch (error) {
    console.error("Error adding scenario:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/* =========================================================
   UPDATE (PUT) — duplicate guard + optional module move
   + auto-assign Unassigned if legacy scenario has no module
   ========================================================= */
// PUT /single-project/scenario/:scenarioId
const updateScenario = async (req, res) => {
  const { scenario_text, userId, moduleId, module_name } = req.body;
  const { scenarioId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
      return res.status(400).json({ message: "Invalid scenario ID" });
    }

    const scenario = await Scenario.findById(scenarioId).populate("project");
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    const actorId = req.user?.id || userId;
    if (!actorId || !mongoose.Types.ObjectId.isValid(actorId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(actorId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Track changes for scenario_text + prevent duplicates
    if (
      typeof scenario_text === "string" &&
      scenario_text !== scenario.scenario_text
    ) {
      const newKey = normalizeKey(scenario_text);
      const dupe = await Scenario.findOne({
        project: scenario.project._id,
        scenario_key: newKey,
        _id: { $ne: scenario._id },
      });
      if (dupe) {
        return res
          .status(409)
          .json({
            message: "Another scenario with similar text already exists.",
          });
      }

      const change = new Change({
        scenario: scenario._id,
        previous_text: scenario.scenario_text,
        user: user._id,
        time: Date.now(),
      });
      await change.save();

      scenario.scenario_text = scenario_text;
      scenario.scenario_key = newKey; // keep index in sync
    }

    // Optional: allow updating the module as well
    if (moduleId || module_name) {
      let moduleDoc;
      if (moduleId) {
        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
          return res.status(400).json({ message: "Invalid moduleId" });
        }
        moduleDoc = await Module.findOne({
          _id: moduleId,
          project: scenario.project._id,
        });
        if (!moduleDoc)
          return res
            .status(404)
            .json({ message: "Module not found for this project" });
      } else {
        moduleDoc = await findOrCreateModule(
          scenario.project._id,
          module_name,
          actorId
        );
      }
      scenario.module = moduleDoc._id;
    }

    // Auto-assign Unassigned for legacy scenarios missing module
    if (!scenario.module) {
      const fallback = await getOrCreateUnassignedModule(
        scenario.project._id,
        actorId
      );
      scenario.module = fallback._id;
    }

    // Update updater metadata
    scenario.updatedBy = { user: user._id, updateTime: Date.now() };

    await scenario.save();
    const populated = await Scenario.findById(scenario._id).populate(
      "module",
      "name"
    );

    return res.json({
      message: "Scenario updated successfully",
      scenario: populated,
    });
  } catch (error) {
    console.error("Error updating scenario:", error);
    return res
      .status(500)
      .json({ message: "Error updating scenario", error: error.message });
  }
};

/* =========================================================
   EXISTING LIST/HISTORY/DELETE/GET NUMBER/SIMPLE LIST — kept
   ========================================================= */

// GET /single-project/:id/view-all-scenarios
const listScenariosByProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const scenarios = await Scenario.find({ project: id })
      .populate("createdBy", "name")
      .populate("project", "project_name")
      .populate("testCases", "title description")
      .populate("module", "name");

    if (!scenarios || scenarios.length === 0) {
      return res.json([]);
    }

    return res.json(scenarios);
  } catch (error) {
    console.error("Error fetching scenarios:", error.message);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// GET /single-project/:projectId/scenario-history/:scenarioId
const getScenarioHistory = async (req, res) => {
  const { scenarioId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
      return res.status(400).json({ message: "Invalid scenario ID" });
    }

    const scenario = await Scenario.findById(scenarioId)
      .populate("createdBy project")
      .populate("module", "name");
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    const changes = await Change.find({ scenario: scenarioId })
      .populate("user")
      .sort({ time: -1 });

    return res.json({ scenario, changes });
  } catch (error) {
    console.error("Error fetching scenario details:", error);
    return res
      .status(500)
      .json({ message: "Error fetching scenario details", error });
  }
};

// DELETE /single-project/scenario/:scenarioId
const deleteScenario = async (req, res) => {
  try {
    const { scenarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
      return res.status(400).json({ message: "Invalid scenario ID" });
    }

    const scenario = await Scenario.findByIdAndDelete(scenarioId);
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    await Change.deleteMany({ scenario: scenarioId });

    return res.status(200).json({
      message: "Scenario and its history deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting scenario:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET /single-project/scenario/:scenarioId/scenario-number
const getScenarioNumber = async (req, res) => {
  const { scenarioId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(scenarioId)) {
      return res.status(400).json({ message: "Invalid scenario ID" });
    }

    const scenario = await Scenario.findById(scenarioId);
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    return res.json({ scenarioNumber: scenario.scenario_number });
  } catch (error) {
    console.error("Error fetching scenario number:", error);
    return res
      .status(500)
      .json({ message: "Error fetching scenario number", error });
  }
};

// GET /projects/:projectId/scenarios  (simple)
const getScenariosSimple = async (req, res) => {
  const { projectId } = req.params;
  const { moduleId } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId).select("_id");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const filter = { project: projectId };
    if (moduleId) {
      if (!mongoose.Types.ObjectId.isValid(moduleId)) {
        return res.status(400).json({ message: "Invalid moduleId" });
      }
      filter.module = moduleId;
    }

    // keep response lean for speed
    const scenarios = await Scenario.find(
      filter,
      { scenario_text: 1, scenario_number: 1, module: 1 }
    )
      .sort({ scenario_number: 1 })
      .populate("module", "name")
      .lean();

    const response = scenarios.map((s) => ({
      _id: s._id,
      scenario_number: s.scenario_number,
      scenario_text: s.scenario_text,
      module: s.module ? { _id: s.module._id, name: s.module.name } : null,
    }));

    return res.json(response);
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    return res.status(500).json({ message: "Error fetching scenarios" });
  }
};


/* ===========================
   MODULE CONTROLLER METHODS
   =========================== */

// GET /single-projects/:projectId/modules
const listModulesByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    const mods = await Module.find({ project: projectId }).sort({ name: 1 });
    return res.json(mods);
  } catch (err) {
    console.error("Error listing modules:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /single-projects/:projectId/modules  (create/find by name)
const createOrGetModule = async (req, res) => {
  const { projectId } = req.params;
  const { name } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Module name is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const createdBy = req.user?.id || req.body.createdBy;
    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const mod = await findOrCreateModule(projectId, name, createdBy);
    return res.status(201).json(mod);
  } catch (err) {
    console.error("Error creating module:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================
   SEARCH/AUTOSUGGEST & BULK MOVES
   ===================================== */

// GET /single-projects/:projectId/scenarios/search?q=...
const searchScenarios = async (req, res) => {
  const { projectId } = req.params;
  const { q = "" } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!q.trim()) return res.json([]);

    // simple regex search; tune as needed
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const results = await Scenario.find(
      { project: projectId, scenario_text: { $regex: regex } },
      { scenario_text: 1, scenario_number: 1, module: 1 }
    )
      .limit(10)
      .populate({ path: "module", select: "name" })
      .lean(); // avoid virtuals/getters for stability + perf

    return res.json(results);
  } catch (error) {
    console.error("Error searching scenarios:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /single-projects/:projectId/scenarios/transfer
// body: { scenarioIds: [..], toModuleId?, toModuleName? }
const transferScenarios = async (req, res) => {
  const { projectId } = req.params;
  const { scenarioIds = [], toModuleId, toModuleName } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    if (!Array.isArray(scenarioIds) || scenarioIds.length === 0) {
      return res.status(400).json({ message: "scenarioIds is required" });
    }

    // resolve destination module
    let targetModule;
    if (toModuleId) {
      if (!mongoose.Types.ObjectId.isValid(toModuleId)) {
        return res.status(400).json({ message: "Invalid toModuleId" });
      }
      targetModule = await Module.findOne({
        _id: toModuleId,
        project: projectId,
      });
      if (!targetModule)
        return res
          .status(404)
          .json({ message: "Destination module not found" });
    } else if (toModuleName) {
      const actorId = req.user?.id || null;
      targetModule = await findOrCreateModule(
        projectId,
        toModuleName,
        actorId || undefined
      );
    } else {
      return res
        .status(400)
        .json({ message: "Provide toModuleId or toModuleName" });
    }

    const validIds = scenarioIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    const { modifiedCount } = await Scenario.updateMany(
      { _id: { $in: validIds }, project: projectId },
      {
        $set: {
          module: targetModule._id,
          updatedBy: { user: req.user?.id || null, updateTime: new Date() },
        },
      }
    );

    return res.json({
      message: "Scenarios transferred",
      modifiedCount,
      to: { _id: targetModule._id, name: targetModule.name },
    });
  } catch (error) {
    console.error("Error transferring scenarios:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /single-projects/:projectId/scenarios/detach
// body: { scenarioIds: [..] } -> move to "Unassigned"
const detachScenariosToUnassigned = async (req, res) => {
  const { projectId } = req.params;
  const { scenarioIds = [] } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    if (!Array.isArray(scenarioIds) || scenarioIds.length === 0) {
      return res.status(400).json({ message: "scenarioIds is required" });
    }

    const unassigned = await getOrCreateUnassignedModule(
      projectId,
      req.user?.id || undefined
    );

    const validIds = scenarioIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    const { modifiedCount } = await Scenario.updateMany(
      { _id: { $in: validIds }, project: projectId },
      {
        $set: {
          module: unassigned._id,
          updatedBy: { user: req.user?.id || null, updateTime: new Date() },
        },
      }
    );

    return res.json({
      message: "Scenarios detached to Unassigned",
      modifiedCount,
      to: { _id: unassigned._id, name: unassigned.name },
    });
  } catch (error) {
    console.error("Error detaching scenarios:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// NEW: list modules with their scenario counts for a project
const listModulesWithCounts = async (req, res) => {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // 1) fetch all modules (so we include zero-count ones too)
    const mods = await Module.find({ project: projectId }, { name: 1 })
      .sort({ name: 1 })
      .lean();

    // 2) aggregate scenario counts per module
    const countsAgg = await Scenario.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: "$module", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      countsAgg.map((c) => [String(c._id || ""), c.count])
    );

    const payload = mods.map((m) => ({
      _id: m._id,
      name: m.name,
      count: countMap.get(String(m._id)) || 0,
    }));

    return res.json(payload);
  } catch (err) {
    console.error("Error listing modules with counts:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addScenario,
  updateScenario,
  listScenariosByProject,
  getScenarioHistory,
  deleteScenario,
  getScenarioNumber,
  getScenariosSimple,
  listModulesByProject,
  createOrGetModule,
  searchScenarios,
  transferScenarios,
  detachScenariosToUnassigned,
  listModulesWithCounts,
};
