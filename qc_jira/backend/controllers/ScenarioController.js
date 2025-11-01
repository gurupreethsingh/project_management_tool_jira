// controllers/ScenarioController.js
const mongoose = require("mongoose");
const Scenario = require("../models/ScenarioModel");
const Change = require("../models/ChangeModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const Module = require("../models/ModuleModel");

/* -------------------------- utils & helpers -------------------------- */
const generateScenarioNumber = (projectName) => {
  const initials = projectName
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${initials}-${randomNum}`;
};

const safeGenerateScenarioNumber = async (projectId, projectName) => {
  let candidate = generateScenarioNumber(projectName);
  let exists = await Scenario.exists({
    project: projectId,
    scenario_number: candidate,
  });
  if (!exists) return candidate;
  candidate = generateScenarioNumber(projectName);
  exists = await Scenario.exists({
    project: projectId,
    scenario_number: candidate,
  });
  if (!exists) return candidate;
  return `${projectName
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")}-${Date.now().toString().slice(-8)}`;
};

const normalizeKey = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+/g, "")
    .substring(0, 200);

const normalizeModuleKey = normalizeKey;

const findOrCreateModule = async (projectId, name, createdBy) => {
  const key = normalizeModuleKey(name);
  const nameTrim = String(name || "").trim();
  try {
    const existing = await Module.findOne({ project: projectId, key });
    if (existing) return existing;
    const created = await Module.create({
      name: nameTrim,
      key,
      project: projectId,
      createdBy,
    });
    return created;
  } catch (err) {
    if (err?.code === 11000) {
      const again = await Module.findOne({ project: projectId, key });
      if (again) return again;
    }
    throw err;
  }
};

const getOrCreateUnassignedModule = async (projectId, createdBy) =>
  findOrCreateModule(projectId, "Unassigned", createdBy);

/* ---------------------------- core helpers --------------------------- */
// Back-compat: given a Scenario doc (lean or not), ensure it has modules[] at read time.
const withHydratedModules = (s) => {
  if (!s) return s;
  const out = { ...s };
  // If modules is missing/empty but legacy single `module` exists, hydrate
  if ((!Array.isArray(out.modules) || out.modules.length === 0) && out.module) {
    out.modules = [out.module];
  }
  return out;
};
// Map array safely for lean results
const hydrateMany = (arr) =>
  Array.isArray(arr) ? arr.map(withHydratedModules) : [];

/* ============================== CREATE =============================== */
// POST /single-projects/:id/add-scenario
// Accepts: moduleId / module_name (legacy single) OR moduleIds[] / module_names[] (multi)
const addScenario = async (req, res) => {
  try {
    const projectId = req.params.id;
    const {
      scenario_text,
      moduleId, // legacy single id
      module_name, // legacy single name
      moduleIds = [], // multi ids
      module_names = [], // multi names
    } = req.body;

    if (!scenario_text)
      return res.status(400).json({ error: "Scenario text is required" });
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ error: "Invalid project ID" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const createdBy = req.user?.id || req.body.createdBy;
    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy))
      return res.status(401).json({ error: "Authentication required" });

    if (!(await User.exists({ _id: createdBy })))
      return res.status(404).json({ error: "Creator user not found" });

    const scenario_key = normalizeKey(scenario_text);
    if (await Scenario.exists({ project: projectId, scenario_key }))
      return res
        .status(409)
        .json({ error: "A scenario with similar text already exists." });

    // Resolve module IDs
    const resolvedIds = [];

    if (moduleId) {
      if (!mongoose.Types.ObjectId.isValid(moduleId))
        return res.status(400).json({ error: "Invalid moduleId" });
      const md = await Module.findOne({ _id: moduleId, project: projectId });
      if (!md)
        return res
          .status(404)
          .json({ error: "Module not found for this project" });
      resolvedIds.push(md._id);
    }

    if (module_name) {
      const md = await findOrCreateModule(projectId, module_name, createdBy);
      resolvedIds.push(md._id);
    }

    for (const mid of moduleIds || []) {
      if (!mongoose.Types.ObjectId.isValid(mid))
        return res
          .status(400)
          .json({ error: "Invalid module id in moduleIds" });
      const md = await Module.findOne({ _id: mid, project: projectId });
      if (!md)
        return res
          .status(404)
          .json({ error: `Module not found for this project: ${mid}` });
      resolvedIds.push(md._id);
    }

    for (const name of module_names || []) {
      if (!String(name || "").trim()) continue;
      const md = await findOrCreateModule(projectId, name, createdBy);
      resolvedIds.push(md._id);
    }

    const uniqueResolved = [...new Set(resolvedIds.map(String))].map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    if (uniqueResolved.length === 0)
      return res.status(400).json({
        error:
          "Provide at least one module (moduleId/module_name/moduleIds/module_names).",
      });

    const scenario_number = await safeGenerateScenarioNumber(
      projectId,
      project.project_name
    );

    // 🔑 Back-compat: keep legacy `module` in sync with first module
    const primaryModuleId = uniqueResolved[0];

    const scenario = new Scenario({
      scenario_text,
      scenario_key,
      scenario_number,
      project: projectId,
      module: primaryModuleId, // legacy single
      modules: uniqueResolved, // new multi
      createdBy,
    });

    await scenario.save();
    await Project.findByIdAndUpdate(projectId, {
      $push: { scenarios: scenario._id },
    });

    const populated = await Scenario.findById(scenario._id)
      .populate("module", "name")
      .populate("modules", "name")
      .lean();

    return res.status(201).json({
      message: "Scenario added successfully",
      scenario: withHydratedModules(populated),
    });
  } catch (error) {
    console.error("Error adding scenario:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/* ============================== UPDATE =============================== */
// PUT /single-project/scenario/:scenarioId
// If moduleId/moduleIds/module_name/module_names provided => replace full set.
// Also keep legacy `module = modules[0]`.
const updateScenario = async (req, res) => {
  const {
    scenario_text,
    userId,
    moduleId,
    module_name,
    moduleIds = [],
    module_names = [],
  } = req.body;
  const { scenarioId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(scenarioId))
      return res.status(400).json({ message: "Invalid scenario ID" });

    const scenario = await Scenario.findById(scenarioId).populate("project");
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found" });

    const actorId = req.user?.id || userId;
    if (!actorId || !mongoose.Types.ObjectId.isValid(actorId))
      return res.status(400).json({ message: "Invalid user ID" });
    if (!(await User.exists({ _id: actorId })))
      return res.status(404).json({ message: "User not found" });

    // Text change + duplicate guard
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
      if (dupe)
        return res.status(409).json({
          message: "Another scenario with similar text already exists.",
        });

      await new Change({
        scenario: scenario._id,
        previous_text: scenario.scenario_text,
        user: actorId,
        time: Date.now(),
      }).save();

      scenario.scenario_text = scenario_text;
      scenario.scenario_key = newKey;
    }

    // Modules replacement if any provided
    const wantsModuleUpdate =
      moduleId ||
      module_name ||
      (Array.isArray(moduleIds) && moduleIds.length) ||
      (Array.isArray(module_names) && module_names.length);

    if (wantsModuleUpdate) {
      const ids = [];

      if (moduleId) {
        if (!mongoose.Types.ObjectId.isValid(moduleId))
          return res.status(400).json({ message: "Invalid moduleId" });
        const md = await Module.findOne({
          _id: moduleId,
          project: scenario.project._id,
        });
        if (!md)
          return res
            .status(404)
            .json({ message: "Module not found for this project" });
        ids.push(md._id);
      }

      for (const mid of moduleIds || []) {
        if (!mongoose.Types.ObjectId.isValid(mid))
          return res
            .status(400)
            .json({ message: "Invalid module id in moduleIds" });
        const md = await Module.findOne({
          _id: mid,
          project: scenario.project._id,
        });
        if (!md)
          return res
            .status(404)
            .json({ message: `Module not found for this project: ${mid}` });
        ids.push(md._id);
      }

      if (module_name) {
        const md = await findOrCreateModule(
          scenario.project._id,
          module_name,
          actorId
        );
        ids.push(md._id);
      }

      for (const name of module_names || []) {
        const md = await findOrCreateModule(
          scenario.project._id,
          name,
          actorId
        );
        ids.push(md._id);
      }

      const uniqueResolved = [...new Set(ids.map(String))].map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      scenario.modules = uniqueResolved;
      scenario.module = uniqueResolved[0] || undefined; // 🔑 keep primary in sync
    }

    scenario.updatedBy = { user: actorId, updateTime: Date.now() };
    await scenario.save();

    const populated = await Scenario.findById(scenario._id)
      .populate("module", "name")
      .populate("modules", "name")
      .lean();

    return res.json({
      message: "Scenario updated successfully",
      scenario: withHydratedModules(populated),
    });
  } catch (error) {
    console.error("Error updating scenario:", error);
    return res
      .status(500)
      .json({ message: "Error updating scenario", error: error.message });
  }
};

/* ========================= LIST / HISTORY ============================ */

// GET /single-project/:id/view-all-scenarios
const listScenariosByProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid project ID" });

    if (!(await Project.exists({ _id: id })))
      return res.status(404).json({ message: "Project not found" });

    const scenarios = await Scenario.find({ project: id })
      .populate("createdBy", "name")
      .populate("project", "project_name")
      .populate("testCases", "title description")
      .populate("module", "name") // legacy
      .populate("modules", "name") // new
      .lean();

    return res.json(hydrateMany(scenarios));
  } catch (error) {
    console.error("Error fetching scenarios:", error.message);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// GET /single-project/:projectId/scenario-history/:scenarioId
const getScenarioHistory = async (req, res) => {
  const { scenarioId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(scenarioId))
      return res.status(400).json({ message: "Invalid scenario ID" });

    const scenario = await Scenario.findById(scenarioId)
      .populate("createdBy project")
      .populate("module", "name")
      .populate("modules", "name")
      .lean();
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found" });

    const changes = await Change.find({ scenario: scenarioId })
      .populate("user")
      .sort({ time: -1 });

    return res.json({ scenario: withHydratedModules(scenario), changes });
  } catch (error) {
    console.error("Error fetching scenario details:", error);
    return res
      .status(500)
      .json({ message: "Error fetching scenario details", error });
  }
};

// GET /single-project/scenario/:scenarioId/scenario-number
const getScenarioNumber = async (req, res) => {
  const { scenarioId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(scenarioId))
      return res.status(400).json({ message: "Invalid scenario ID" });

    const scenario = await Scenario.findById(scenarioId);
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found" });

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
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project ID" });

    if (!(await Project.exists({ _id: projectId })))
      return res.status(404).json({ message: "Project not found" });

    const filter = { project: projectId };
    if (moduleId) {
      if (!mongoose.Types.ObjectId.isValid(moduleId))
        return res.status(400).json({ message: "Invalid moduleId" });
      // match either legacy single or new multi
      filter.$or = [
        { module: moduleId },
        { modules: { $in: [new mongoose.Types.ObjectId(moduleId)] } },
      ];
    }

    const scenarios = await Scenario.find(filter, {
      scenario_text: 1,
      scenario_number: 1,
      module: 1,
      modules: 1,
    })
      .sort({ scenario_number: 1 })
      .populate("module", "name")
      .populate("modules", "name")
      .lean();

    const hydrated = hydrateMany(scenarios).map((s) => ({
      _id: s._id,
      scenario_number: s.scenario_number,
      scenario_text: s.scenario_text,
      // Keep legacy single for old UIs + full array for new UIs
      module: s.module
        ? { _id: s.module._id, name: s.module.name }
        : s.modules?.[0] || null,
      modules: (s.modules || []).map((m) => ({ _id: m._id, name: m.name })),
    }));

    return res.json(hydrated);
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    return res.status(500).json({ message: "Error fetching scenarios" });
  }
};

/* ============================ MODULE APIS ============================ */

// GET /single-projects/:projectId/modules
const listModulesByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project ID" });
    const mods = await Module.find({ project: projectId }).sort({ name: 1 });
    return res.json(mods);
  } catch (err) {
    console.error("Error listing modules:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /single-projects/:projectId/modules
const createOrGetModule = async (req, res) => {
  const { projectId } = req.params;
  const { name } = req.body;
  try {
    if (!name || !name.trim())
      return res.status(400).json({ message: "Module name is required" });
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project ID" });

    const createdBy = req.user?.id || req.body.createdBy;
    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy))
      return res.status(401).json({ message: "Authentication required" });

    const mod = await findOrCreateModule(projectId, name, createdBy);
    return res.status(201).json(mod);
  } catch (err) {
    console.error("Error creating module:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ========================== BULK OPERATIONS ========================== */

// POST /single-projects/:projectId/scenarios/transfer
// body: { scenarioIds: [..], toModuleId?, toModuleName? }
// Adds destination to modules[] and DOES NOT clear legacy `module`.
// Primary module remains unchanged here.
const transferScenarios = async (req, res) => {
  const { projectId } = req.params;
  const { scenarioIds = [], toModuleId, toModuleName } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project ID" });
    if (!Array.isArray(scenarioIds) || scenarioIds.length === 0)
      return res.status(400).json({ message: "scenarioIds is required" });

    let targetModule;
    if (toModuleId) {
      if (!mongoose.Types.ObjectId.isValid(toModuleId))
        return res.status(400).json({ message: "Invalid toModuleId" });
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
        $addToSet: { modules: targetModule._id }, // add (do not replace)
        $set: {
          updatedBy: { user: req.user?.id || null, updateTime: new Date() },
        },
      }
    );

    return res.json({
      message: "Scenarios transferred (added to module)",
      modifiedCount,
      to: { _id: targetModule._id, name: targetModule.name },
    });
  } catch (error) {
    console.error("Error transferring scenarios:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /single-projects/:projectId/scenarios/detach
// body: { scenarioIds: [..] } -> clear modules[] and legacy module (fully unassigned)
const detachScenariosToUnassigned = async (req, res) => {
  const { projectId } = req.params;
  const { scenarioIds = [] } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project ID" });
    if (!Array.isArray(scenarioIds) || scenarioIds.length === 0)
      return res.status(400).json({ message: "scenarioIds is required" });

    const { modifiedCount } = await Scenario.updateMany(
      {
        _id: {
          $in: scenarioIds.filter((id) => mongoose.Types.ObjectId.isValid(id)),
        },
        project: projectId,
      },
      {
        $set: {
          modules: [],
          module: undefined, // 🔑 also clear legacy primary when explicitly detaching
          updatedBy: { user: req.user?.id || null, updateTime: new Date() },
        },
      }
    );

    return res.json({
      message: "Scenarios detached (unassigned)",
      modifiedCount,
    });
  } catch (error) {
    console.error("Error detaching scenarios:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /single-projects/:projectId/modules-with-counts
const listModulesWithCounts = async (req, res) => {
  const { projectId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project ID" });

    const mods = await Module.find({ project: projectId }, { name: 1 })
      .sort({ name: 1 })
      .lean();

    // Count scenarios by either legacy single OR multi
    const countsAgg = await Scenario.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      {
        $facet: {
          legacy: [
            { $match: { module: { $ne: null } } },
            { $group: { _id: "$module", count: { $sum: 1 } } },
          ],
          multi: [
            {
              $unwind: { path: "$modules", preserveNullAndEmptyArrays: false },
            },
            { $group: { _id: "$modules", count: { $sum: 1 } } },
          ],
        },
      },
      {
        $project: {
          combined: { $setUnion: ["$legacy", "$multi"] },
        },
      },
      { $unwind: "$combined" },
      { $replaceRoot: { newRoot: "$combined" } },
      {
        $group: {
          _id: "$_id",
          count: { $sum: "$count" },
        },
      },
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

const searchScenarios = async (req, res) => {
  const { projectId } = req.params;
  const q = String(req.query.q || "").trim();

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project ID" });

    if (!q) return res.json([]);

    // simple text search on scenario_text (case-insensitive)
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const rows = await Scenario.find(
      { project: projectId, scenario_text: rx },
      { scenario_text: 1, modules: 1 } // keep it light
    )
      .limit(15)
      .populate("modules", "name")
      .lean();

    res.json(rows.map(withHydratedModules));
  } catch (err) {
    console.error("searchScenarios error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /single-project/scenario/:scenarioId
const deleteScenario = async (req, res) => {
  const { scenarioId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(scenarioId))
      return res.status(400).json({ message: "Invalid scenario ID" });

    const doc = await Scenario.findById(scenarioId);
    if (!doc) return res.status(404).json({ message: "Scenario not found" });

    // remove from project's array (best-effort)
    await Project.updateOne(
      { _id: doc.project },
      { $pull: { scenarios: doc._id } }
    );

    await Change.deleteMany({ scenario: doc._id });
    await Scenario.deleteOne({ _id: doc._id });

    return res.json({ message: "Scenario deleted", _id: scenarioId });
  } catch (err) {
    console.error("deleteScenario error:", err);
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
  searchScenarios, // unchanged above (uses populate module/modules)
  transferScenarios,
  detachScenariosToUnassigned,
  listModulesWithCounts,
};
