const mongoose = require("mongoose");
const TestExecution = require("../models/TestExecutionModel");
const Project = require("../models/ProjectModel");
const Module = require("../models/ModuleModel");
const Scenario = require("../models/ScenarioModel");
const TestCase = require("../models/TestCaseModel");

const EXECUTION_STATUS = ["Not Run", "Pass", "Fail", "Blocked", "Skipped"];
const EXECUTION_TYPES = ["Manual", "Automation", "Both"];
const RUN_TYPES = ["Desktop", "Mobile", "Tablet", "API"];
const ENVIRONMENTS = ["QA", "UAT", "Staging", "Production", "Dev"];

function safeTrim(value = "") {
  return String(value || "").trim();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function isValidExecutionStatus(status = "") {
  return EXECUTION_STATUS.includes(safeTrim(status));
}

function normalizeExecutedSteps(steps = []) {
  return normalizeArray(steps).map((step, index) => ({
    step_number: Number(step?.step_number || index + 1),
    action_description: safeTrim(step?.action_description),
    input_data: safeTrim(step?.input_data),
    expected_result: safeTrim(step?.expected_result),
    actual_result: safeTrim(step?.actual_result),
    status: isValidExecutionStatus(step?.status)
      ? safeTrim(step?.status)
      : "Not Run",
    remark: safeTrim(step?.remark),
  }));
}

function normalizeAttachments(files = []) {
  return normalizeArray(files).map((file) => ({
    file_name: safeTrim(file?.file_name),
    file_url: safeTrim(file?.file_url),
    file_type: safeTrim(file?.file_type),
    uploaded_at: file?.uploaded_at || new Date(),
  }));
}

function deriveStatusFromSteps(steps = []) {
  if (!Array.isArray(steps) || steps.length === 0) return "Not Run";

  const statuses = steps.map((step) => safeTrim(step?.status));

  if (statuses.includes("Fail")) return "Fail";
  if (statuses.includes("Blocked")) return "Blocked";
  if (statuses.length && statuses.every((s) => s === "Skipped"))
    return "Skipped";
  if (statuses.length && statuses.every((s) => s === "Pass")) return "Pass";

  return "Not Run";
}

function deriveOverallStatusFromRuns(runs = []) {
  if (!Array.isArray(runs) || runs.length === 0) return "Not Run";

  const statuses = runs.map((run) => safeTrim(run?.execution_status));

  if (statuses.includes("Fail")) return "Fail";
  if (statuses.includes("Blocked")) return "Blocked";
  if (statuses.length && statuses.every((s) => s === "Skipped"))
    return "Skipped";
  if (statuses.length && statuses.every((s) => s === "Pass")) return "Pass";

  return "Not Run";
}

function normalizeExecutionRun(run = {}, index = 0, fallbackSteps = []) {
  const normalizedSteps =
    normalizeExecutedSteps(run?.executed_steps).length > 0
      ? normalizeExecutedSteps(run.executed_steps)
      : normalizeExecutedSteps(fallbackSteps);

  const runType = RUN_TYPES.includes(safeTrim(run?.run_type))
    ? safeTrim(run.run_type)
    : "Desktop";

  const environment = ENVIRONMENTS.includes(safeTrim(run?.environment))
    ? safeTrim(run.environment)
    : "QA";

  const explicitStatus = safeTrim(run?.execution_status);
  const executionStatus = isValidExecutionStatus(explicitStatus)
    ? explicitStatus
    : deriveStatusFromSteps(normalizedSteps);

  return {
    run_number: Number(run?.run_number || index + 1),
    run_type: runType,
    run_label: safeTrim(run?.run_label) || `Run ${index + 1}`,
    environment,
    browser: safeTrim(run?.browser),
    browser_version: safeTrim(run?.browser_version),
    operating_system: safeTrim(run?.operating_system),
    operating_system_version: safeTrim(run?.operating_system_version),
    device_name: safeTrim(run?.device_name),
    device_brand: safeTrim(run?.device_brand),
    screen_resolution: safeTrim(run?.screen_resolution),
    client_tool: safeTrim(run?.client_tool),
    app_version: safeTrim(run?.app_version),
    is_mobile: Boolean(run?.is_mobile || runType === "Mobile"),
    is_real_device: Boolean(run?.is_real_device),
    execution_status: executionStatus,
    expected_result_snapshot: safeTrim(run?.expected_result_snapshot),
    actual_result: safeTrim(run?.actual_result),
    remarks: safeTrim(run?.remarks),
    linked_bug_ids: normalizeArray(run?.linked_bug_ids)
      .map((id) => safeTrim(id))
      .filter(Boolean),
    attachments: normalizeAttachments(run?.attachments),
    executed_steps: normalizedSteps,
    started_at: run?.started_at || new Date(),
    completed_at: ["Pass", "Fail", "Blocked", "Skipped"].includes(
      executionStatus,
    )
      ? run?.completed_at || new Date()
      : run?.completed_at || null,
    executed_at: run?.executed_at || new Date(),
  };
}

function buildLegacyCompatibleFieldsFromRuns(runs = []) {
  const firstRun = runs[0] || {};

  return {
    environment: firstRun.environment || "QA",
    browser: firstRun.browser || "",
    browser_version: firstRun.browser_version || "",
    operating_system: firstRun.operating_system || "",
    device_type: firstRun.run_type || "Desktop",
    device_name: firstRun.device_name || "",
    actual_result: firstRun.actual_result || "",
    expected_result_snapshot: firstRun.expected_result_snapshot || "",
    executed_steps: normalizeExecutedSteps(firstRun.executed_steps || []),
  };
}

async function resolveEntities({
  project_id,
  module_id,
  scenario_id,
  test_case_id,
}) {
  const [project, moduleDoc, scenario, testCase] = await Promise.all([
    Project.findById(project_id),
    Module.findById(module_id),
    Scenario.findById(scenario_id),
    TestCase.findById(test_case_id),
  ]);

  return { project, moduleDoc, scenario, testCase };
}

/* =========================================================
   CREATE TEST EXECUTION
========================================================= */
exports.createTestExecution = async (req, res) => {
  try {
    const {
      project_id,
      module_id,
      scenario_id,
      test_case_id,
      build_name_or_number,
      execution_type,
      execution_status,
      environment,
      browser,
      browser_version,
      operating_system,
      device_type,
      device_name,
      assigned_to,
      assigned_to_name,
      executed_by,
      executed_by_name,
      reviewed_by,
      reviewed_by_name,
      expected_result_snapshot,
      actual_result,
      execution_notes,
      remarks,
      executed_steps,
      execution_runs,
      linked_defect_ids,
      linked_bug_ids,
      attachments,
      started_at,
      completed_at,
      executed_at,
    } = req.body;

    if (!project_id || !module_id || !scenario_id || !test_case_id) {
      return res.status(400).json({
        status: false,
        message:
          "project_id, module_id, scenario_id, and test_case_id are required.",
      });
    }

    if (!executed_by || !executed_by_name) {
      return res.status(400).json({
        status: false,
        message: "executed_by and executed_by_name are required.",
      });
    }

    const { project, moduleDoc, scenario, testCase } = await resolveEntities({
      project_id,
      module_id,
      scenario_id,
      test_case_id,
    });

    if (!project) {
      return res
        .status(404)
        .json({ status: false, message: "Project not found." });
    }

    if (!moduleDoc) {
      return res
        .status(404)
        .json({ status: false, message: "Module not found." });
    }

    if (!scenario) {
      return res
        .status(404)
        .json({ status: false, message: "Scenario not found." });
    }

    if (!testCase) {
      return res
        .status(404)
        .json({ status: false, message: "Test case not found." });
    }

    const fallbackSteps = normalizeExecutedSteps(testCase.testing_steps || []);

    let normalizedRuns = normalizeArray(execution_runs).map((run, index) =>
      normalizeExecutionRun(run, index, fallbackSteps),
    );

    if (normalizedRuns.length === 0) {
      const legacySteps =
        normalizeExecutedSteps(executed_steps).length > 0
          ? normalizeExecutedSteps(executed_steps)
          : fallbackSteps;

      const legacyStatus = isValidExecutionStatus(execution_status)
        ? safeTrim(execution_status)
        : deriveStatusFromSteps(legacySteps);

      normalizedRuns = [
        normalizeExecutionRun(
          {
            run_number: 1,
            run_type: safeTrim(device_type) || "Desktop",
            run_label: "Run 1",
            environment: safeTrim(environment) || "QA",
            browser,
            browser_version,
            operating_system,
            device_name,
            execution_status: legacyStatus,
            expected_result_snapshot,
            actual_result,
            remarks,
            linked_bug_ids,
            attachments,
            executed_steps: legacySteps,
            started_at,
            completed_at,
            executed_at,
          },
          0,
          fallbackSteps,
        ),
      ];
    }

    const overallStatus = deriveOverallStatusFromRuns(normalizedRuns);
    const legacyFields = buildLegacyCompatibleFieldsFromRuns(normalizedRuns);

    const executionDoc = new TestExecution({
      project_id: project._id,
      project_name: safeTrim(project.project_name),

      module_id: moduleDoc._id,
      module_name: safeTrim(moduleDoc.name),

      scenario_id: scenario._id,
      scenario_number: safeTrim(scenario.scenario_number),

      test_case_id: testCase._id,
      test_case_number: safeTrim(testCase.test_case_number),
      test_case_name: safeTrim(testCase.test_case_name),

      requirement_number: safeTrim(testCase.requirement_number),
      build_name_or_number:
        safeTrim(build_name_or_number) ||
        safeTrim(testCase.build_name_or_number),

      execution_type: EXECUTION_TYPES.includes(safeTrim(execution_type))
        ? safeTrim(execution_type)
        : safeTrim(testCase.test_execution_type) || "Manual",

      execution_status: overallStatus,

      environment: legacyFields.environment,
      browser: legacyFields.browser,
      browser_version: legacyFields.browser_version,
      operating_system: legacyFields.operating_system,
      device_type: legacyFields.device_type,
      device_name: legacyFields.device_name,

      assigned_to: assigned_to || null,
      assigned_to_name: safeTrim(assigned_to_name),

      executed_by,
      executed_by_name: safeTrim(executed_by_name),

      reviewed_by: reviewed_by || null,
      reviewed_by_name: safeTrim(reviewed_by_name),

      expected_result_snapshot:
        safeTrim(expected_result_snapshot) ||
        legacyFields.expected_result_snapshot ||
        fallbackSteps
          .map((step) => safeTrim(step.expected_result))
          .filter(Boolean)
          .join(" | "),

      actual_result: safeTrim(actual_result) || legacyFields.actual_result,
      execution_notes: safeTrim(execution_notes),
      remarks: safeTrim(remarks),

      executed_steps: legacyFields.executed_steps,
      execution_runs: normalizedRuns,

      linked_defect_ids: normalizeArray(linked_defect_ids),
      linked_bug_ids: normalizeArray(linked_bug_ids)
        .map((id) => safeTrim(id))
        .filter(Boolean),

      attachments: normalizeAttachments(attachments),

      started_at: started_at || new Date(),
      completed_at: ["Pass", "Fail", "Blocked", "Skipped"].includes(
        overallStatus,
      )
        ? completed_at || new Date()
        : completed_at || null,
      executed_at: executed_at || new Date(),

      created_by: req.user?.id || executed_by,
      updated_by: req.user?.id || null,
    });

    await executionDoc.save();

    return res.status(201).json({
      status: true,
      message: "Test execution created successfully.",
      item: executionDoc,
    });
  } catch (err) {
    console.error("[testExecution.create] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error creating test execution.",
    });
  }
};

/* =========================================================
   LIST TEST EXECUTIONS
========================================================= */
exports.listTestExecutions = async (req, res) => {
  try {
    const {
      project_id,
      module_id,
      scenario_id,
      test_case_id,
      execution_status,
      browser,
      environment,
      build_name_or_number,
      executed_by,
      assigned_to,
      page = 1,
      limit = 20,
      run_type,
    } = req.query;

    const filter = { isDeleted: false };

    if (project_id) filter.project_id = project_id;
    if (module_id) filter.module_id = module_id;
    if (scenario_id) filter.scenario_id = scenario_id;
    if (test_case_id) filter.test_case_id = test_case_id;
    if (execution_status) filter.execution_status = execution_status;
    if (browser) {
      filter.$or = [{ browser }, { "execution_runs.browser": browser }];
    }
    if (environment) {
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [{ environment }, { "execution_runs.environment": environment }],
        },
      ];
    }
    if (build_name_or_number)
      filter.build_name_or_number = build_name_or_number;
    if (executed_by) filter.executed_by = executed_by;
    if (assigned_to) filter.assigned_to = assigned_to;
    if (run_type) filter["execution_runs.run_type"] = run_type;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);

    const [items, total] = await Promise.all([
      TestExecution.find(filter)
        .sort({ executed_at: -1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      TestExecution.countDocuments(filter),
    ]);

    return res.json({
      status: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      items,
    });
  } catch (err) {
    console.error("[testExecution.list] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching test executions.",
    });
  }
};

/* =========================================================
   GET SINGLE TEST EXECUTION
========================================================= */
exports.getTestExecutionById = async (req, res) => {
  try {
    const item = await TestExecution.findById(req.params.id).lean();

    if (!item || item.isDeleted) {
      return res.status(404).json({
        status: false,
        message: "Test execution not found.",
      });
    }

    return res.json({
      status: true,
      item,
    });
  } catch (err) {
    console.error("[testExecution.getById] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching test execution.",
    });
  }
};

/* =========================================================
   UPDATE TEST EXECUTION
========================================================= */
exports.updateTestExecution = async (req, res) => {
  try {
    const item = await TestExecution.findById(req.params.id);

    if (!item || item.isDeleted) {
      return res.status(404).json({
        status: false,
        message: "Test execution not found.",
      });
    }

    const allowedFields = [
      "build_name_or_number",
      "execution_type",
      "environment",
      "assigned_to",
      "assigned_to_name",
      "executed_by",
      "executed_by_name",
      "reviewed_by",
      "reviewed_by_name",
      "expected_result_snapshot",
      "actual_result",
      "execution_notes",
      "remarks",
      "started_at",
      "completed_at",
      "executed_at",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    if (req.body.execution_runs !== undefined) {
      const fallbackSteps =
        normalizeExecutedSteps(item.executed_steps).length > 0
          ? normalizeExecutedSteps(item.executed_steps)
          : [];

      const normalizedRuns = normalizeArray(req.body.execution_runs).map(
        (run, index) => normalizeExecutionRun(run, index, fallbackSteps),
      );

      item.execution_runs = normalizedRuns;

      const overallStatus = deriveOverallStatusFromRuns(normalizedRuns);
      const legacyFields = buildLegacyCompatibleFieldsFromRuns(normalizedRuns);

      item.execution_status = overallStatus;
      item.environment = legacyFields.environment;
      item.browser = legacyFields.browser;
      item.browser_version = legacyFields.browser_version;
      item.operating_system = legacyFields.operating_system;
      item.device_type = legacyFields.device_type;
      item.device_name = legacyFields.device_name;
      item.actual_result =
        safeTrim(req.body.actual_result) || legacyFields.actual_result;
      item.expected_result_snapshot =
        safeTrim(req.body.expected_result_snapshot) ||
        legacyFields.expected_result_snapshot;
      item.executed_steps = legacyFields.executed_steps;
    } else {
      if (
        req.body.execution_status !== undefined &&
        isValidExecutionStatus(req.body.execution_status)
      ) {
        item.execution_status = safeTrim(req.body.execution_status);
      }

      if (req.body.executed_steps !== undefined) {
        item.executed_steps = normalizeExecutedSteps(req.body.executed_steps);
      }

      if (req.body.browser !== undefined) {
        item.browser = safeTrim(req.body.browser);
      }

      if (req.body.browser_version !== undefined) {
        item.browser_version = safeTrim(req.body.browser_version);
      }

      if (req.body.operating_system !== undefined) {
        item.operating_system = safeTrim(req.body.operating_system);
      }

      if (req.body.device_type !== undefined) {
        item.device_type = safeTrim(req.body.device_type);
      }

      if (req.body.device_name !== undefined) {
        item.device_name = safeTrim(req.body.device_name);
      }
    }

    if (req.body.linked_defect_ids !== undefined) {
      item.linked_defect_ids = normalizeArray(req.body.linked_defect_ids);
    }

    if (req.body.linked_bug_ids !== undefined) {
      item.linked_bug_ids = normalizeArray(req.body.linked_bug_ids)
        .map((id) => safeTrim(id))
        .filter(Boolean);
    }

    if (req.body.attachments !== undefined) {
      item.attachments = normalizeAttachments(req.body.attachments);
    }

    item.updated_by = req.user?.id || item.updated_by;

    await item.save();

    return res.json({
      status: true,
      message: "Test execution updated successfully.",
      item,
    });
  } catch (err) {
    console.error("[testExecution.update] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error updating test execution.",
    });
  }
};

/* =========================================================
   LINK DEFECT TO SINGLE EXECUTION
========================================================= */
exports.linkDefectToExecution = async (req, res) => {
  try {
    const { defect_id, bug_id, run_number } = req.body;

    const item = await TestExecution.findById(req.params.id);

    if (!item || item.isDeleted) {
      return res.status(404).json({
        status: false,
        message: "Test execution not found.",
      });
    }

    if (
      run_number &&
      Array.isArray(item.execution_runs) &&
      item.execution_runs.length
    ) {
      const runIndex = item.execution_runs.findIndex(
        (run) => Number(run.run_number) === Number(run_number),
      );

      if (runIndex >= 0 && bug_id) {
        const existing = normalizeArray(
          item.execution_runs[runIndex].linked_bug_ids,
        );
        if (!existing.includes(safeTrim(bug_id))) {
          item.execution_runs[runIndex].linked_bug_ids = [
            ...existing,
            safeTrim(bug_id),
          ];
        }
      }
    }

    if (
      defect_id &&
      !item.linked_defect_ids.some((id) => String(id) === String(defect_id))
    ) {
      item.linked_defect_ids.push(defect_id);
    }

    if (bug_id && !item.linked_bug_ids.includes(safeTrim(bug_id))) {
      item.linked_bug_ids.push(safeTrim(bug_id));
    }

    item.updated_by = req.user?.id || item.updated_by;

    await item.save();

    return res.json({
      status: true,
      message: "Defect linked successfully.",
      item,
    });
  } catch (err) {
    console.error("[testExecution.linkDefect] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error linking defect.",
    });
  }
};

/* =========================================================
   SOFT DELETE SINGLE EXECUTION
========================================================= */
exports.softDeleteTestExecution = async (req, res) => {
  try {
    const item = await TestExecution.findById(req.params.id);

    if (!item || item.isDeleted) {
      return res.status(404).json({
        status: false,
        message: "Test execution not found.",
      });
    }

    item.isDeleted = true;
    item.updated_by = req.user?.id || item.updated_by;

    await item.save();

    return res.json({
      status: true,
      message: "Test execution deleted successfully.",
    });
  } catch (err) {
    console.error("[testExecution.softDelete] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error deleting test execution.",
    });
  }
};

/* =========================================================
   BULK STATUS UPDATE
========================================================= */
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, execution_status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: false,
        message: "ids array is required.",
      });
    }

    if (!isValidExecutionStatus(execution_status)) {
      return res.status(400).json({
        status: false,
        message: "Valid execution_status is required.",
      });
    }

    const result = await TestExecution.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        $set: {
          execution_status: safeTrim(execution_status),
          updated_by: req.user?.id || null,
        },
      },
    );

    return res.json({
      status: true,
      message: "Bulk status updated successfully.",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("[testExecution.bulkUpdateStatus] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error updating statuses in bulk.",
    });
  }
};

/* =========================================================
   BULK ASSIGN
========================================================= */
exports.bulkAssign = async (req, res) => {
  try {
    const { ids, assigned_to, assigned_to_name } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: false,
        message: "ids array is required.",
      });
    }

    const result = await TestExecution.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        $set: {
          assigned_to: assigned_to || null,
          assigned_to_name: safeTrim(assigned_to_name),
          updated_by: req.user?.id || null,
        },
      },
    );

    return res.json({
      status: true,
      message: "Bulk assignment completed successfully.",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("[testExecution.bulkAssign] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error assigning executions in bulk.",
    });
  }
};

/* =========================================================
   BULK LINK DEFECT
========================================================= */
exports.bulkLinkDefect = async (req, res) => {
  try {
    const { ids, defect_id, bug_id } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: false,
        message: "ids array is required.",
      });
    }

    if (!defect_id && !bug_id) {
      return res.status(400).json({
        status: false,
        message: "defect_id or bug_id is required.",
      });
    }

    const updateObj = {
      $set: {
        updated_by: req.user?.id || null,
      },
    };

    if (defect_id) {
      updateObj.$addToSet = updateObj.$addToSet || {};
      updateObj.$addToSet.linked_defect_ids = defect_id;
    }

    if (bug_id) {
      updateObj.$addToSet = updateObj.$addToSet || {};
      updateObj.$addToSet.linked_bug_ids = safeTrim(bug_id);
    }

    const result = await TestExecution.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      updateObj,
    );

    return res.json({
      status: true,
      message: "Bulk defect linking completed successfully.",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("[testExecution.bulkLinkDefect] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error linking defects in bulk.",
    });
  }
};
