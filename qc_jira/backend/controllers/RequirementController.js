// controllers/RequirementController.js
const mongoose = require("mongoose");
const Requirement = require("../models/RequirementModel");
const Project = require("../models/ProjectModel");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const normalize = (s) =>
  String(s || "")
    .trim()
    .toLowerCase();

// -------- helpers
async function nextModuleSeq(project_id, module_name_normalized) {
  const last = await Requirement.findOne({ project_id, module_name_normalized })
    .sort({ module_seq: -1 })
    .select({ module_seq: 1 })
    .lean();
  return (last?.module_seq || 0) + 1;
}

function gatherUploadedImagePaths(req) {
  // Support various multer setups:
  // - upload.fields([{name:"images"}]) -> req.files.images = [..]
  // - upload.array("images")           -> req.files = [..]
  // - upload.single("image")           -> req.file
  const acc = [];

  if (req.files && Array.isArray(req.files)) {
    for (const f of req.files) if (f?.path) acc.push(f.path);
  } else if (req.files && req.files.images && Array.isArray(req.files.images)) {
    for (const f of req.files.images) if (f?.path) acc.push(f.path);
  } else if (req.file && req.file.path) {
    acc.push(req.file.path);
  }

  return acc;
}

async function safeUnlink(absPath) {
  try {
    await unlinkAsync(absPath);
  } catch (err) {
    if (err?.code !== "ENOENT") {
      console.warn("safeUnlink warning:", absPath, err?.message);
    }
  }
}

// -------- CREATE
exports.createRequirement = async (req, res) => {
  try {
    const {
      project_id,
      project_name,
      requirement_number,
      build_name_or_number,
      module_name,
      requirement_title,
      description,
      steps, // can be JSON string or array
      created_by,
    } = req.body;

    if (!project_id || !mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({ error: "Valid project_id is required" });
    }
    if (!module_name || !normalize(module_name)) {
      return res.status(400).json({ error: "module_name is required" });
    }

    // derive project name if not provided
    let finalProjectName = project_name;
    if (!finalProjectName) {
      const proj = await Project.findById(project_id)
        .select("project_name")
        .lean();
      if (!proj) return res.status(404).json({ error: "Project not found" });
      finalProjectName = proj.project_name;
    }

    // auto requirement_number if missing
    let finalRequirementNumber = requirement_number;
    if (!finalRequirementNumber) {
      const countForProject = await Requirement.countDocuments({ project_id });
      const short =
        (finalProjectName || "PRJ")
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 4) || "PRJ";
      finalRequirementNumber = `REQ-${short}-${countForProject + 1}`;
    }

    const finalBuildNameOrNumber = build_name_or_number || "v1.0";
    const finalRequirementTitle =
      requirement_title || `Requirement for ${module_name}`;
    const module_name_normalized = normalize(module_name);

    // images (multer)
    const uploadedImages = gatherUploadedImagePaths(req);

    // steps normalize (supports JSON or fallback to instructions[])
    let finalSteps = [];
    if (steps) {
      let parsed = steps;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch (_) {
          parsed = [];
        }
      }
      if (Array.isArray(parsed)) {
        finalSteps = parsed
          .map((s, idx) => ({
            step_number: Number(s.step_number) || idx + 1,
            instruction: String(s.instruction || "").trim(),
            for: s.for || "Both",
            image_url: s.image_url, // keep if caller set it
          }))
          .filter((s) => s.instruction.length > 0);
      }
    }
    const rawInstructions =
      req.body["instructions[]"] ?? req.body.instructions ?? null;
    if (!finalSteps.length && rawInstructions) {
      const arr = Array.isArray(rawInstructions)
        ? rawInstructions
        : [rawInstructions];
      finalSteps = arr
        .map((txt, i) => ({
          step_number: i + 1,
          instruction: String(txt || "").trim(),
          for: "Both",
          image_url: undefined,
        }))
        .filter((s) => s.instruction.length > 0);
    }

    // attach uploaded images to steps by order
    if (uploadedImages.length && finalSteps.length) {
      let imgIdx = 0;
      for (
        let i = 0;
        i < finalSteps.length && imgIdx < uploadedImages.length;
        i++
      ) {
        if (!finalSteps[i].image_url) {
          finalSteps[i].image_url = uploadedImages[imgIdx++];
        }
      }
    }

    const finalCreatedBy = created_by || (req.user && req.user.id) || undefined;

    // Compute next per-module sequence and insert with a race-safe retry
    const computeSeq = () => nextModuleSeq(project_id, module_name_normalized);

    let module_seq = await computeSeq();
    let doc;
    try {
      doc = await Requirement.create({
        project_id,
        project_name: finalProjectName,
        requirement_number: finalRequirementNumber,
        build_name_or_number: finalBuildNameOrNumber,
        module_name,
        module_name_normalized,
        module_seq,
        requirement_title: finalRequirementTitle,
        description,
        images: uploadedImages,
        steps: finalSteps,
        created_by: finalCreatedBy,
      });
    } catch (err) {
      // Rare race: duplicate (project,module,module_seq) — recompute once
      if (err?.code === 11000 && err?.keyPattern?.module_seq) {
        module_seq = await computeSeq();
        doc = await Requirement.create({
          project_id,
          project_name: finalProjectName,
          requirement_number: finalRequirementNumber,
          build_name_or_number: finalBuildNameOrNumber,
          module_name,
          module_name_normalized,
          module_seq,
          requirement_title: finalRequirementTitle,
          description,
          images: uploadedImages,
          steps: finalSteps,
          created_by: finalCreatedBy,
        });
      } else {
        throw err;
      }
    }

    return res.status(201).json({ message: "Requirement created", data: doc });
  } catch (error) {
    console.error("createRequirement error:", error);
    if (error?.code === 11000) {
      return res.status(409).json({
        error: "Duplicate requirement number for this module. Please retry.",
        details: error?.errmsg || String(error),
      });
    }
    return res
      .status(500)
      .json({ error: "Failed to create requirement", details: error.message });
  }
};

// -------- READ: All
exports.getAllRequirements = async (req, res) => {
  try {
    const { project_id } = req.query;
    const filter =
      project_id && mongoose.Types.ObjectId.isValid(project_id)
        ? { project_id }
        : {};
    const requirements = await Requirement.find(filter).sort({
      project_id: 1,
      module_name_normalized: 1,
      module_seq: 1,
      createdAt: -1,
    });
    res.status(200).json(requirements);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch requirements", details: error.message });
  }
};

// -------- READ: By ID
exports.getRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement)
      return res.status(404).json({ error: "Requirement not found" });
    res.status(200).json(requirement);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch requirement", details: error.message });
  }
};

// -------- UPDATE
exports.updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Requirement.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    const body = req.body || {};
    const updateFields = {};
    const changedFields = new Set();

    // basic fields
    if (
      body.requirement_title != null &&
      body.requirement_title !== existing.requirement_title
    ) {
      updateFields.requirement_title = body.requirement_title;
      changedFields.add("requirement_title");
    }
    if (body.description != null && body.description !== existing.description) {
      updateFields.description = body.description;
      changedFields.add("description");
    }
    if (
      body.build_name_or_number != null &&
      body.build_name_or_number !== existing.build_name_or_number
    ) {
      updateFields.build_name_or_number = body.build_name_or_number;
      changedFields.add("build_name_or_number");
    }
    if (body.module_name != null && body.module_name !== existing.module_name) {
      const mod = String(body.module_name).trim();
      updateFields.module_name = mod;
      updateFields.module_name_normalized = mod.toLowerCase();
      changedFields.add("module_name");
      // Note: we do NOT change module_seq on rename (sequence stays with doc)
    }

    // steps
    let stepsReplaced = false;
    if (body.steps_replace === "true" || body.steps_replace === true) {
      let finalSteps = [];
      if (body.steps) {
        let parsed = body.steps;
        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed);
          } catch (_) {
            parsed = [];
          }
        }
        if (Array.isArray(parsed)) {
          finalSteps = parsed
            .map((s, idx) => ({
              step_number: Number(s.step_number) || idx + 1,
              instruction: String(s.instruction || "").trim(),
              for: s.for || "Both",
              image_url: s.image_url,
            }))
            .filter((s) => s.instruction.length > 0);
        }
      }
      updateFields.steps = finalSteps;
      stepsReplaced = true;
      changedFields.add("steps");
    }

    // images
    const clearImages =
      body.clear_images === "true" || body.clear_images === true;
    const newImages = gatherUploadedImagePaths(req);

    if (clearImages) {
      const old = existing.images || [];
      await Promise.all(
        old.map(async (p) => {
          try {
            const abs = path.isAbsolute(p)
              ? p
              : path.join(process.cwd(), String(p).replace(/\\/g, "/"));
            await unlinkAsync(abs);
          } catch (_) {}
        })
      );
      updateFields.images = [];
      changedFields.add("images");
    }

    if (newImages.length) {
      // If images already set in updateFields, merge. Else $push to existing doc.
      if (!updateFields.images) {
        updateFields.$push = { images: { $each: newImages } };
      } else {
        updateFields.images = (updateFields.images || []).concat(newImages);
      }
      changedFields.add("images");
    }

    if (stepsReplaced && newImages.length) {
      updateFields.steps = (updateFields.steps || []).map((s, i) => ({
        ...s,
        image_url: newImages[i] || s.image_url,
      }));
    }

    const updated_by =
      body.updated_by || (req.user && req.user.id) || undefined;
    let updated_by_name = "";
    try {
      if (req.user && req.user.name) updated_by_name = req.user.name;
    } catch (_) {}

    const updated = await Requirement.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (updated) {
      const logEntry = {
        updated_by,
        updated_by_name,
        changed_fields: Array.from(changedFields),
        at: new Date(),
      };
      await Requirement.findByIdAndUpdate(
        id,
        { $push: { update_logs: logEntry } },
        { new: true }
      );
    }

    return res
      .status(200)
      .json({ message: "Requirement updated", data: updated });
  } catch (error) {
    console.error("updateRequirement error:", error);
    return res
      .status(500)
      .json({ error: "Failed to update requirement", details: error.message });
  }
};

// -------- DELETE
exports.deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const reqDoc = await Requirement.findById(id).lean();

    if (!reqDoc) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    const allPaths = [];
    if (Array.isArray(reqDoc.images)) {
      for (const p of reqDoc.images) if (p) allPaths.push(p);
    }
    if (Array.isArray(reqDoc.steps)) {
      for (const s of reqDoc.steps) {
        if (s && s.image_url) allPaths.push(s.image_url);
      }
    }

    const absPaths = allPaths
      .map((p) => String(p).replace(/\\/g, "/"))
      .map((p) => (path.isAbsolute(p) ? p : path.join(process.cwd(), p)));

    await Promise.all(absPaths.map((p) => safeUnlink(p)));
    await Requirement.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Requirement and files deleted successfully" });
  } catch (error) {
    console.error("deleteRequirement error:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete requirement", details: error.message });
  }
};

// -------- COUNT
exports.countRequirements = async (_req, res) => {
  try {
    const count = await Requirement.countDocuments();
    res.status(200).json({ totalRequirements: count });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to count requirements", details: error.message });
  }
};

// -------- BY PROJECT
exports.getRequirementsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid projectId" });
    }
    const requirements = await Requirement.find({ project_id: projectId }).sort(
      { module_name_normalized: 1, module_seq: 1, createdAt: -1 }
    );
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch project requirements",
      details: error.message,
    });
  }
};

// -------- BY PROJECT + MODULE
exports.getRequirementsByModule = async (req, res) => {
  try {
    const { projectId, moduleName } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid projectId" });
    }
    const requirements = await Requirement.find({
      project_id: projectId,
      module_name_normalized: normalize(moduleName),
    }).sort({ module_seq: 1, createdAt: -1 });
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch module requirements",
      details: error.message,
    });
  }
};

// -------- SEARCH
exports.searchRequirements = async (req, res) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(String(keyword || ""), "i");
    const results = await Requirement.find({
      $or: [{ requirement_title: regex }, { requirement_number: regex }],
    }).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Search failed", details: error.message });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const proj = await Project.findById(id).lean();
    if (!proj) return res.status(404).json({ error: "Project not found" });

    return res.status(200).json({
      ...proj,
      projectName: proj.project_name ?? proj.projectName ?? "",
    });
  } catch (err) {
    console.error("getProjectById error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch project", details: err.message });
  }
};

// -------- MODULES (distinct, by project)
exports.getRequirementModulesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid projectId" });
    }

    const rows = await Requirement.aggregate([
      { $match: { project_id: new mongoose.Types.ObjectId(projectId) } },
      {
        $group: {
          _id: "$module_name_normalized",
          name: { $first: "$module_name" },
          total: { $sum: 1 },
          latestAt: { $max: "$createdAt" },
        },
      },
      { $sort: { name: 1 } },
    ]);

    const mods = rows.map((r) => ({
      name: r.name,
      normalized: r._id,
      total: r.total,
      latestAt: r.latestAt,
    }));
    return res.status(200).json(mods);
  } catch (error) {
    console.error("getRequirementModulesByProject error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch modules", details: error.message });
  }
};
