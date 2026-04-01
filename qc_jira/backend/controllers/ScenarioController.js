const mongoose = require("mongoose");
const Scenario = require("../models/ScenarioModel");
const Change = require("../models/ChangeModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const Module = require("../models/ModuleModel");

/* -------------------------- constants -------------------------- */

const MAX_SCENARIO_TEXT_LENGTH = 5000;
const MAX_SCENARIO_KEY_LENGTH = 300;
const MAX_MODULE_NAME_LENGTH = 100;
const MAX_SEARCH_RESULTS = 15;

/* -------------------------- generic helpers -------------------------- */

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const toObjectId = (value) => new mongoose.Types.ObjectId(value);

const safeTrim = (value = "") => String(value ?? "").trim();

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const dedupeStrings = (values = []) => [...new Set(values.map(String))];

const uniqueObjectIds = (values = []) =>
  dedupeStrings(values).map((id) => toObjectId(id));

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* -------------------------- text normalization helpers -------------------------- */

const normalizeUnicodeText = (value = "") => {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-");
};

const splitIntoWords = (value = "") => {
  return normalizeUnicodeText(value)
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean);
};

const getInitialsFromWords = (value = "") => {
  return splitIntoWords(value)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
};

const normalizeScenarioText = (text = "") => {
  return normalizeUnicodeText(text).replace(/\s+/g, " ").trim();
};

const normalizeKey = (text = "") => {
  return normalizeUnicodeText(text)
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_/\\-]+/g, " ")
    .replace(/["'`.,!?()[\]{}:;<>@#$%^&*+=|~]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "")
    .substring(0, MAX_SCENARIO_KEY_LENGTH);
};

const buildSearchableScenarioText = (text = "") => {
  return normalizeUnicodeText(text)
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_/\\-]+/g, " ")
    .replace(/["'`.,!?()[\]{}:;<>@#$%^&*+=|~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/* -------------------------- scenario number helpers -------------------------- */

const generateScenarioNumber = (projectName, moduleName) => {
  const projectInitials = getInitialsFromWords(projectName);
  const moduleInitials = getInitialsFromWords(moduleName);
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  if (moduleInitials) {
    return `${projectInitials}-${moduleInitials}-${randomNum}`;
  }

  return `${projectInitials}-${randomNum}`;
};

const safeGenerateScenarioNumber = async (
  projectId,
  projectName,
  moduleName,
) => {
  let candidate = generateScenarioNumber(projectName, moduleName);

  let exists = await Scenario.exists({
    project: projectId,
    scenario_number: candidate,
  });
  if (!exists) return candidate;

  candidate = generateScenarioNumber(projectName, moduleName);
  exists = await Scenario.exists({
    project: projectId,
    scenario_number: candidate,
  });
  if (!exists) return candidate;

  const projectInitials = getInitialsFromWords(projectName);
  const moduleInitials = getInitialsFromWords(moduleName);
  const suffix = Date.now().toString().slice(-8);

  if (moduleInitials) {
    return `${projectInitials}-${moduleInitials}-${suffix}`;
  }

  return `${projectInitials}-${suffix}`;
};

/* -------------------------- validation helpers -------------------------- */

const validateScenarioText = (raw) => {
  const cleaned = normalizeScenarioText(raw);

  if (!cleaned) {
    return { ok: false, message: "Scenario text is required." };
  }

  if (!/[A-Za-z]/.test(cleaned)) {
    return {
      ok: false,
      message: "Scenario text must contain at least one letter (A–Z).",
    };
  }

  if (cleaned.length > MAX_SCENARIO_TEXT_LENGTH) {
    return {
      ok: false,
      message: `Scenario text cannot exceed ${MAX_SCENARIO_TEXT_LENGTH} characters.`,
    };
  }

  return { ok: true, cleaned };
};

function toPascalCase(raw = "") {
  const cleaned = normalizeUnicodeText(raw)
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

function normalizeModuleName(raw) {
  const input = normalizeUnicodeText(raw);
  const trimmed = input.trim();

  if (!trimmed) {
    return { error: "Module name cannot be empty or whitespace-only." };
  }

  if (!/[A-Za-z]/.test(trimmed)) {
    return { error: "Module name must contain at least one letter (A–Z)." };
  }

  if (/\d/.test(trimmed)) {
    return { error: "Module name cannot contain numbers." };
  }

  if (/[^A-Za-z\s_-]/.test(trimmed)) {
    return { error: "Module name cannot contain special characters." };
  }

  const displayName = toPascalCase(trimmed);

  if (!displayName) {
    return { error: "Module name cannot be empty." };
  }

  if (displayName.length > MAX_MODULE_NAME_LENGTH) {
    return {
      error: `Module name cannot be more than ${MAX_MODULE_NAME_LENGTH} characters.`,
    };
  }

  const key = displayName.toLowerCase().slice(0, 200);
  return { displayName, key };
}

/* -------------------------- error helpers -------------------------- */

function mapMongooseError(err) {
  if (err?.code === 11000) {
    const keyPattern = err?.keyPattern || {};
    const keys = Object.keys(keyPattern);

    if (keys.includes("project") && keys.includes("scenario_key")) {
      return {
        status: 409,
        message: "A scenario with similar text already exists in this project.",
      };
    }

    if (keys.includes("project") && keys.includes("scenario_number")) {
      return {
        status: 409,
        message: "Generated scenario number already exists. Please retry.",
      };
    }

    if (keys.includes("project") && keys.includes("key")) {
      return {
        status: 409,
        message: "Module already exists in this project.",
      };
    }

    return {
      status: 409,
      message: "Duplicate record already exists.",
    };
  }

  if (err?.name === "ValidationError") {
    const first =
      err?.errors && Object.values(err.errors)[0]
        ? Object.values(err.errors)[0].message
        : "Validation failed.";

    return { status: 400, message: first };
  }

  if (err?.name === "CastError") {
    return { status: 400, message: "Invalid input." };
  }

  return null;
}

const sendHandledError = (res, error, fallbackMessage = "Server error") => {
  if (error?.status) {
    return res.status(error.status).json({
      error: error.message,
      message: error.message,
    });
  }

  const mapped = mapMongooseError(error);
  if (mapped) {
    return res.status(mapped.status).json({
      error: mapped.message,
      message: mapped.message,
    });
  }

  console.error(fallbackMessage + ":", error);
  return res.status(500).json({
    error: fallbackMessage,
    message: fallbackMessage,
  });
};

/* ------------------------- auth/resource helpers ------------------------- */

const ensureValidProject = async (projectId) => {
  if (!isValidObjectId(projectId)) {
    const e = new Error("Invalid project ID");
    e.status = 400;
    throw e;
  }

  const project = await Project.findById(projectId);
  if (!project) {
    const e = new Error("Project not found");
    e.status = 404;
    throw e;
  }

  return project;
};

const ensureValidUser = async (
  userId,
  authRequiredMessage = "Authentication required",
) => {
  if (!userId || !isValidObjectId(userId)) {
    const e = new Error(authRequiredMessage);
    e.status = 401;
    throw e;
  }

  const exists = await User.exists({ _id: userId });
  if (!exists) {
    const e = new Error("User not found");
    e.status = 404;
    throw e;
  }

  return userId;
};

const ensureModuleBelongsToProject = async (
  moduleId,
  projectId,
  customMessage,
) => {
  if (!isValidObjectId(moduleId)) {
    const e = new Error("Invalid module ID");
    e.status = 400;
    throw e;
  }

  const moduleDoc = await Module.findOne({ _id: moduleId, project: projectId });
  if (!moduleDoc) {
    const e = new Error(customMessage || "Module not found for this project");
    e.status = 404;
    throw e;
  }

  return moduleDoc;
};

/* ------------------------- Module helper ------------------------- */

const findOrCreateModule = async (projectId, name, createdBy) => {
  const { displayName, key, error } = normalizeModuleName(name);

  if (error) {
    const e = new Error(error);
    e.status = 400;
    throw e;
  }

  const existing = await Module.findOne({ project: projectId, key });
  if (existing) return existing;

  try {
    const created = await Module.create({
      name: displayName,
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

/* ---------------------------- scenario helpers --------------------------- */

const withHydratedModules = (scenario) => {
  if (!scenario) return scenario;

  const out = { ...scenario };

  if ((!Array.isArray(out.modules) || out.modules.length === 0) && out.module) {
    out.modules = [out.module];
  }

  return out;
};

const hydrateMany = (arr) =>
  Array.isArray(arr) ? arr.map(withHydratedModules) : [];

const resolveScenarioModules = async ({
  projectId,
  createdBy,
  moduleId,
  module_name,
  moduleIds = [],
  module_names = [],
}) => {
  const resolvedIds = [];
  const resolvedDocs = [];

  if (moduleId) {
    const md = await ensureModuleBelongsToProject(
      moduleId,
      projectId,
      "Module not found for this project",
    );
    resolvedIds.push(md._id);
    resolvedDocs.push(md);
  }

  if (module_name) {
    const md = await findOrCreateModule(projectId, module_name, createdBy);
    resolvedIds.push(md._id);
    resolvedDocs.push(md);
  }

  for (const mid of ensureArray(moduleIds)) {
    const md = await ensureModuleBelongsToProject(
      mid,
      projectId,
      `Module not found for this project: ${mid}`,
    );
    resolvedIds.push(md._id);
    resolvedDocs.push(md);
  }

  for (const name of ensureArray(module_names)) {
    if (!safeTrim(name)) continue;
    const md = await findOrCreateModule(projectId, name, createdBy);
    resolvedIds.push(md._id);
    resolvedDocs.push(md);
  }

  const uniqueResolved = uniqueObjectIds(resolvedIds);

  return {
    uniqueResolved,
    resolvedDocs,
  };
};

/* ============================== CREATE =============================== */

const addScenario = async (req, res) => {
  try {
    const projectId = req.params.id;
    const {
      scenario_text,
      moduleId,
      module_name,
      moduleIds = [],
      module_names = [],
    } = req.body;

    const validation = validateScenarioText(scenario_text);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.message });
    }

    const cleanedScenarioText = validation.cleaned;
    const scenario_key = normalizeKey(cleanedScenarioText);

    const project = await ensureValidProject(projectId);
    const createdBy = await ensureValidUser(
      req.user?.id || req.body.createdBy,
      "Authentication required",
    );

    const existingScenario = await Scenario.exists({
      project: projectId,
      scenario_key,
    });

    if (existingScenario) {
      return res.status(409).json({
        error: "A scenario with similar text already exists in this project.",
      });
    }

    const { uniqueResolved, resolvedDocs } = await resolveScenarioModules({
      projectId,
      createdBy,
      moduleId,
      module_name,
      moduleIds,
      module_names,
    });

    if (uniqueResolved.length === 0) {
      return res.status(400).json({
        error:
          "Provide at least one module (moduleId/module_name/moduleIds/module_names).",
      });
    }

    const primaryModuleId = uniqueResolved[0];
    const primaryModule =
      resolvedDocs.find((m) => String(m._id) === String(primaryModuleId)) ||
      null;

    const scenario_number = await safeGenerateScenarioNumber(
      projectId,
      project.project_name,
      primaryModule?.name || "",
    );

    const scenario = new Scenario({
      scenario_text: cleanedScenarioText,
      scenario_key,
      scenario_number,
      project: projectId,
      module: primaryModuleId,
      modules: uniqueResolved,
      createdBy,
    });

    await scenario.save();

    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { scenarios: scenario._id },
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
    return sendHandledError(res, error, "Error adding scenario");
  }
};

/* ============================== UPDATE =============================== */

const updateScenario = async (req, res) => {
  try {
    const {
      scenario_text,
      userId,
      moduleId,
      module_name,
      moduleIds = [],
      module_names = [],
    } = req.body;

    const { scenarioId } = req.params;

    if (!isValidObjectId(scenarioId)) {
      return res.status(400).json({ message: "Invalid scenario ID" });
    }

    const scenario = await Scenario.findById(scenarioId).populate("project");
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    const actorId = await ensureValidUser(
      req.user?.id || userId,
      "Invalid user ID",
    );

    if (typeof scenario_text === "string") {
      const validation = validateScenarioText(scenario_text);
      if (!validation.ok) {
        return res.status(400).json({ message: validation.message });
      }

      const cleanedScenarioText = validation.cleaned;
      const newKey = normalizeKey(cleanedScenarioText);

      if (
        cleanedScenarioText !== scenario.scenario_text ||
        newKey !== scenario.scenario_key
      ) {
        const dupe = await Scenario.findOne({
          project: scenario.project._id,
          scenario_key: newKey,
          _id: { $ne: scenario._id },
        });

        if (dupe) {
          return res.status(409).json({
            message:
              "Another scenario with similar text already exists in this project.",
          });
        }

        await Change.create({
          scenario: scenario._id,
          previous_text: scenario.scenario_text,
          user: actorId,
          time: Date.now(),
        });

        scenario.scenario_text = cleanedScenarioText;
        scenario.scenario_key = newKey;
      }
    }

    const wantsModuleUpdate =
      moduleId ||
      module_name ||
      (Array.isArray(moduleIds) && moduleIds.length > 0) ||
      (Array.isArray(module_names) && module_names.length > 0);

    if (wantsModuleUpdate) {
      const { uniqueResolved, resolvedDocs } = await resolveScenarioModules({
        projectId: scenario.project._id,
        createdBy: actorId,
        moduleId,
        module_name,
        moduleIds,
        module_names,
      });

      scenario.modules = uniqueResolved;
      scenario.module = uniqueResolved[0] || undefined;

      if (uniqueResolved.length > 0) {
        const primaryModuleId = uniqueResolved[0];
        const primaryModule =
          resolvedDocs.find((m) => String(m._id) === String(primaryModuleId)) ||
          null;

        scenario.scenario_number = await safeGenerateScenarioNumber(
          scenario.project._id,
          scenario.project.project_name,
          primaryModule?.name || "",
        );
      }
    }

    scenario.updatedBy = {
      user: actorId,
      updateTime: Date.now(),
    };

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
    return sendHandledError(res, error, "Error updating scenario");
  }
};

/* ========================= LIST / HISTORY ============================ */

const listScenariosByProject = async (req, res) => {
  try {
    const { id } = req.params;

    await ensureValidProject(id);

    const scenarios = await Scenario.find({ project: id })
      .populate("createdBy", "name")
      .populate("project", "project_name")
      .populate("testCases", "title description")
      .populate("module", "name")
      .populate("modules", "name")
      .lean();

    return res.json(hydrateMany(scenarios));
  } catch (error) {
    return sendHandledError(res, error, "Error fetching scenarios");
  }
};

const getScenarioHistory = async (req, res) => {
  try {
    const { scenarioId } = req.params;

    if (!isValidObjectId(scenarioId)) {
      return res.status(400).json({ message: "Invalid scenario ID" });
    }

    const scenario = await Scenario.findById(scenarioId)
      .populate("createdBy", "name")
      .populate("project", "project_name")
      .populate("module", "name")
      .populate("modules", "name")
      .lean();

    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    const changes = await Change.find({ scenario: scenarioId })
      .populate("user", "name email")
      .sort({ time: -1 });

    return res.json({
      scenario: withHydratedModules(scenario),
      changes,
    });
  } catch (error) {
    return sendHandledError(res, error, "Error fetching scenario details");
  }
};

const getScenarioNumber = async (req, res) => {
  try {
    const { scenarioId } = req.params;

    if (!isValidObjectId(scenarioId)) {
      return res.status(400).json({ message: "Invalid scenario ID" });
    }

    const scenario = await Scenario.findById(scenarioId, {
      scenario_number: 1,
    }).lean();

    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    return res.json({ scenarioNumber: scenario.scenario_number });
  } catch (error) {
    return sendHandledError(res, error, "Error fetching scenario number");
  }
};

const getScenariosSimple = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { moduleId } = req.query;

    await ensureValidProject(projectId);

    const filter = { project: projectId };

    if (moduleId) {
      if (!isValidObjectId(moduleId)) {
        return res.status(400).json({ message: "Invalid moduleId" });
      }

      filter.$or = [
        { module: moduleId },
        { modules: { $in: [toObjectId(moduleId)] } },
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
      module: s.module
        ? { _id: s.module._id, name: s.module.name }
        : s.modules?.[0] || null,
      modules: (s.modules || []).map((m) => ({
        _id: m._id,
        name: m.name,
      })),
    }));

    return res.json(hydrated);
  } catch (error) {
    return sendHandledError(res, error, "Error fetching scenarios");
  }
};

/* ============================ MODULE APIS ============================ */

const listModulesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    await ensureValidProject(projectId);

    const mods = await Module.find({
      project: projectId,
      name: { $ne: "Unassigned" },
    })
      .sort({ name: 1 })
      .lean();

    return res.json(mods);
  } catch (error) {
    return sendHandledError(res, error, "Error listing modules");
  }
};

const createOrGetModule = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    await ensureValidProject(projectId);

    const createdBy = await ensureValidUser(
      req.user?.id || req.body.createdBy,
      "Authentication required",
    );

    const mod = await findOrCreateModule(projectId, name, createdBy);
    return res.status(201).json(mod);
  } catch (error) {
    return sendHandledError(res, error, "Error creating module");
  }
};

const deleteModule = async (req, res) => {
  try {
    const { projectId, moduleId } = req.params;
    const { transferToModuleId = null, userId } = req.body || {};

    await ensureValidProject(projectId);

    const actorId = await ensureValidUser(
      req.user?.id || userId,
      "Authentication required",
    );

    const moduleDoc = await ensureModuleBelongsToProject(
      moduleId,
      projectId,
      "Module not found",
    );

    if (moduleDoc.name === "Unassigned") {
      return res
        .status(400)
        .json({ error: "Unassigned module cannot be deleted." });
    }

    let targetModule = null;

    if (transferToModuleId) {
      if (String(transferToModuleId) === String(moduleId)) {
        return res.status(400).json({
          error: "Transfer module cannot be the same as module being deleted.",
        });
      }

      targetModule = await ensureModuleBelongsToProject(
        transferToModuleId,
        projectId,
        "Transfer module not found",
      );
    }

    const affectedScenarios = await Scenario.find({
      project: projectId,
      $or: [{ module: moduleDoc._id }, { modules: { $in: [moduleDoc._id] } }],
    });

    for (const scenario of affectedScenarios) {
      const currentIds = [];

      if (scenario.module) currentIds.push(String(scenario.module));
      if (Array.isArray(scenario.modules)) {
        for (const mid of scenario.modules) currentIds.push(String(mid));
      }

      let nextIds = [...new Set(currentIds)].filter(
        (id) => id !== String(moduleDoc._id),
      );

      if (targetModule) {
        nextIds.push(String(targetModule._id));
      }

      nextIds = [...new Set(nextIds)];

      const finalIds = nextIds.map((id) => toObjectId(id));

      scenario.modules = finalIds;
      scenario.module = finalIds[0] || undefined;
      scenario.updatedBy = {
        user: actorId,
        updateTime: new Date(),
      };

      await scenario.save();
    }

    await Module.deleteOne({ _id: moduleDoc._id });

    return res.json({
      message: "Module deleted successfully.",
      deletedModule: {
        _id: moduleDoc._id,
        name: moduleDoc.name,
      },
      affectedScenarioCount: affectedScenarios.length,
      reassignedTo: targetModule
        ? { _id: targetModule._id, name: targetModule.name }
        : null,
    });
  } catch (error) {
    return sendHandledError(res, error, "Error deleting module");
  }
};

/* ========================== BULK OPERATIONS ========================== */

const transferScenarios = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { scenarioIds = [], toModuleId, toModuleName } = req.body;

    await ensureValidProject(projectId);

    if (!Array.isArray(scenarioIds) || scenarioIds.length === 0) {
      return res.status(400).json({ message: "scenarioIds is required" });
    }

    let targetModule;

    if (toModuleId) {
      targetModule = await ensureModuleBelongsToProject(
        toModuleId,
        projectId,
        "Destination module not found",
      );
    } else if (toModuleName) {
      const actorId = await ensureValidUser(
        req.user?.id || req.body.createdBy,
        "Authentication required",
      );

      targetModule = await findOrCreateModule(projectId, toModuleName, actorId);
    } else {
      return res
        .status(400)
        .json({ message: "Provide toModuleId or toModuleName" });
    }

    const validIds = scenarioIds.filter((id) => isValidObjectId(id));

    const { modifiedCount } = await Scenario.updateMany(
      { _id: { $in: validIds }, project: projectId },
      {
        $addToSet: { modules: targetModule._id },
        $set: {
          updatedBy: {
            user: req.user?.id || null,
            updateTime: new Date(),
          },
        },
      },
    );

    return res.json({
      message: "Scenarios transferred (added to module)",
      modifiedCount,
      to: { _id: targetModule._id, name: targetModule.name },
    });
  } catch (error) {
    return sendHandledError(res, error, "Error transferring scenarios");
  }
};

const detachScenariosToUnassigned = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { scenarioIds = [] } = req.body;

    await ensureValidProject(projectId);

    if (!Array.isArray(scenarioIds) || scenarioIds.length === 0) {
      return res.status(400).json({ message: "scenarioIds is required" });
    }

    const { modifiedCount } = await Scenario.updateMany(
      {
        _id: {
          $in: scenarioIds.filter((id) => isValidObjectId(id)),
        },
        project: projectId,
      },
      {
        $set: {
          modules: [],
          module: undefined,
          updatedBy: {
            user: req.user?.id || null,
            updateTime: new Date(),
          },
        },
      },
    );

    return res.json({
      message: "Scenarios detached (unassigned)",
      modifiedCount,
    });
  } catch (error) {
    return sendHandledError(res, error, "Error detaching scenarios");
  }
};

const listModulesWithCounts = async (req, res) => {
  try {
    const { projectId } = req.params;

    await ensureValidProject(projectId);

    const mods = await Module.find(
      { project: projectId, name: { $ne: "Unassigned" } },
      { name: 1 },
    )
      .sort({ name: 1 })
      .lean();

    const countsAgg = await Scenario.aggregate([
      { $match: { project: toObjectId(projectId) } },
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
      { $project: { combined: { $concatArrays: ["$legacy", "$multi"] } } },
      { $unwind: "$combined" },
      { $replaceRoot: { newRoot: "$combined" } },
      { $group: { _id: "$_id", count: { $sum: "$count" } } },
    ]);

    const countMap = new Map(
      countsAgg.map((c) => [String(c._id || ""), c.count]),
    );

    const payload = mods.map((m) => ({
      _id: m._id,
      name: m.name,
      count: countMap.get(String(m._id)) || 0,
    }));

    return res.json(payload);
  } catch (error) {
    return sendHandledError(res, error, "Error listing modules with counts");
  }
};

/* ============================== SEARCH ============================== */

const searchScenarios = async (req, res) => {
  try {
    const { projectId } = req.params;
    const q = safeTrim(req.query.q || "");

    await ensureValidProject(projectId);

    if (!q) {
      return res.json([]);
    }

    const normalizedQuery = buildSearchableScenarioText(q);
    const escaped = escapeRegex(normalizedQuery);
    const tokens = normalizedQuery.split(" ").filter(Boolean);

    const orConditions = [];

    if (escaped) {
      orConditions.push({ scenario_text: new RegExp(escaped, "i") });
    }

    for (const token of tokens) {
      if (token.length >= 2) {
        orConditions.push({
          scenario_text: new RegExp(escapeRegex(token), "i"),
        });
      }
    }

    const rows = await Scenario.find(
      {
        project: projectId,
        $or: orConditions.length ? orConditions : [{ scenario_text: /a^/ }],
      },
      { scenario_text: 1, modules: 1, module: 1 },
    )
      .limit(MAX_SEARCH_RESULTS)
      .populate("module", "name")
      .populate("modules", "name")
      .lean();

    const scored = rows
      .map((row) => {
        const normalizedRow = normalizeKey(row.scenario_text);
        const normalizedInput = normalizeKey(q);

        let score = 0;
        if (normalizedRow === normalizedInput) score += 100;
        if (normalizedRow.includes(normalizedInput)) score += 40;

        const searchableRow = buildSearchableScenarioText(row.scenario_text);
        for (const token of tokens) {
          if (searchableRow.includes(token)) {
            score += 5;
          }
        }

        return { ...row, _score: score };
      })
      .sort((a, b) => b._score - a._score);

    return res.json(scored.map(withHydratedModules));
  } catch (error) {
    return sendHandledError(res, error, "Error searching scenarios");
  }
};

/* ============================== DELETE ============================== */

const deleteScenario = async (req, res) => {
  try {
    const { scenarioId } = req.params;

    if (!isValidObjectId(scenarioId)) {
      return res.status(400).json({ message: "Invalid scenario ID" });
    }

    const doc = await Scenario.findById(scenarioId);
    if (!doc) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    await Project.updateOne(
      { _id: doc.project },
      { $pull: { scenarios: doc._id } },
    );

    await Change.deleteMany({ scenario: doc._id });
    await Scenario.deleteOne({ _id: doc._id });

    return res.json({ message: "Scenario deleted", _id: scenarioId });
  } catch (error) {
    return sendHandledError(res, error, "Error deleting scenario");
  }
};

const bulkDeleteScenarios = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { scenarioIds = [] } = req.body || {};

    await ensureValidProject(projectId);

    if (!Array.isArray(scenarioIds) || scenarioIds.length === 0) {
      return res.status(400).json({
        message: "scenarioIds is required and must be a non-empty array",
      });
    }

    const validScenarioIds = [
      ...new Set(
        scenarioIds.map((id) => String(id)).filter((id) => isValidObjectId(id)),
      ),
    ];

    if (validScenarioIds.length === 0) {
      return res.status(400).json({
        message: "No valid scenario IDs were provided",
      });
    }

    const docs = await Scenario.find(
      {
        _id: { $in: validScenarioIds.map((id) => toObjectId(id)) },
        project: projectId,
      },
      { _id: 1, project: 1 },
    ).lean();

    if (!docs.length) {
      return res.status(404).json({
        message: "No matching scenarios found for this project",
      });
    }

    const foundIds = docs.map((doc) => doc._id);

    await Change.deleteMany({
      scenario: { $in: foundIds },
    });

    await Scenario.deleteMany({
      _id: { $in: foundIds },
      project: projectId,
    });

    await Project.updateOne(
      { _id: projectId },
      { $pull: { scenarios: { $in: foundIds } } },
    );

    return res.json({
      message: "Scenarios deleted successfully",
      deletedCount: foundIds.length,
      deletedScenarioIds: foundIds.map(String),
      requestedCount: scenarioIds.length,
    });
  } catch (error) {
    return sendHandledError(res, error, "Error bulk deleting scenarios");
  }
};

module.exports = {
  addScenario,
  updateScenario,
  listScenariosByProject,
  getScenarioHistory,
  deleteScenario,
  bulkDeleteScenarios,
  getScenarioNumber,
  getScenariosSimple,
  listModulesByProject,
  createOrGetModule,
  deleteModule,
  searchScenarios,
  transferScenarios,
  detachScenariosToUnassigned,
  listModulesWithCounts,
};
