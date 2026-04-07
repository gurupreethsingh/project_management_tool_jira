// controllers/TestExecutionController.js
const TestExecution = require("../models/TestExecutionModel");
const Project = require("../models/ProjectModel");
const Module = require("../models/ModuleModel");
const Scenario = require("../models/ScenarioModel");
const TestCase = require("../models/TestCaseModel");

function safeTrim(value = "") {
  return String(value || "").trim();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeExecutedSteps(steps = []) {
  return normalizeArray(steps).map((step, index) => ({
    step_number: Number(step.step_number || index + 1),
    action_description: safeTrim(step.action_description),
    input_data: safeTrim(step.input_data),
    expected_result: safeTrim(step.expected_result),
    actual_result: safeTrim(step.actual_result),
    status: ["Not Run", "Pass", "Fail", "Blocked", "Skipped"].includes(
      safeTrim(step.status),
    )
      ? safeTrim(step.status)
      : "Not Run",
    remark: safeTrim(step.remark),
  }));
}

function normalizeAttachments(files = []) {
  return normalizeArray(files).map((file) => ({
    file_name: safeTrim(file.file_name),
    file_url: safeTrim(file.file_url),
    file_type: safeTrim(file.file_type),
    uploaded_at: file.uploaded_at || new Date(),
  }));
}

function isValidExecutionStatus(status = "") {
  return ["Not Run", "Pass", "Fail", "Blocked", "Skipped"].includes(
    safeTrim(status),
  );
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

    const [project, moduleDoc, scenario, testCase] = await Promise.all([
      Project.findById(project_id),
      Module.findById(module_id),
      Scenario.findById(scenario_id),
      TestCase.findById(test_case_id),
    ]);

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found.",
      });
    }

    if (!moduleDoc) {
      return res.status(404).json({
        status: false,
        message: "Module not found.",
      });
    }

    if (!scenario) {
      return res.status(404).json({
        status: false,
        message: "Scenario not found.",
      });
    }

    if (!testCase) {
      return res.status(404).json({
        status: false,
        message: "Test case not found.",
      });
    }

    const normalizedExecutionStatus = isValidExecutionStatus(execution_status)
      ? safeTrim(execution_status)
      : "Not Run";

    const normalizedExecutedSteps =
      normalizeExecutedSteps(executed_steps).length > 0
        ? normalizeExecutedSteps(executed_steps)
        : normalizeExecutedSteps(testCase.testing_steps);

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

      execution_type:
        safeTrim(execution_type) ||
        safeTrim(testCase.test_execution_type) ||
        "Manual",

      execution_status: normalizedExecutionStatus,

      environment: safeTrim(environment) || "QA",
      browser: safeTrim(browser),
      browser_version: safeTrim(browser_version),
      operating_system: safeTrim(operating_system),
      device_type: safeTrim(device_type) || "Desktop",
      device_name: safeTrim(device_name),

      assigned_to: assigned_to || null,
      assigned_to_name: safeTrim(assigned_to_name),

      executed_by,
      executed_by_name: safeTrim(executed_by_name),

      reviewed_by: reviewed_by || null,
      reviewed_by_name: safeTrim(reviewed_by_name),

      expected_result_snapshot:
        safeTrim(expected_result_snapshot) ||
        normalizeArray(testCase.testing_steps)
          .map((step) => safeTrim(step.expected_result))
          .filter(Boolean)
          .join(" | "),

      actual_result: safeTrim(actual_result),
      execution_notes: safeTrim(execution_notes),
      remarks: safeTrim(remarks),

      executed_steps: normalizedExecutedSteps,

      linked_defect_ids: normalizeArray(linked_defect_ids),
      linked_bug_ids: normalizeArray(linked_bug_ids).map((id) => safeTrim(id)),

      attachments: normalizeAttachments(attachments),

      started_at: started_at || new Date(),
      completed_at: completed_at || null,
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
    } = req.query;

    const filter = { isDeleted: false };

    if (project_id) filter.project_id = project_id;
    if (module_id) filter.module_id = module_id;
    if (scenario_id) filter.scenario_id = scenario_id;
    if (test_case_id) filter.test_case_id = test_case_id;
    if (execution_status) filter.execution_status = execution_status;
    if (browser) filter.browser = browser;
    if (environment) filter.environment = environment;
    if (build_name_or_number) {
      filter.build_name_or_number = build_name_or_number;
    }
    if (executed_by) filter.executed_by = executed_by;
    if (assigned_to) filter.assigned_to = assigned_to;

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
    const item = await TestExecution.findById(req.params.id);

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
      "execution_status",
      "environment",
      "browser",
      "browser_version",
      "operating_system",
      "device_type",
      "device_name",
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
        if (field === "execution_status") {
          if (isValidExecutionStatus(req.body[field])) {
            item[field] = safeTrim(req.body[field]);
          }
        } else {
          item[field] = req.body[field];
        }
      }
    });

    if (req.body.executed_steps !== undefined) {
      item.executed_steps = normalizeExecutedSteps(req.body.executed_steps);
    }

    if (req.body.linked_defect_ids !== undefined) {
      item.linked_defect_ids = normalizeArray(req.body.linked_defect_ids);
    }

    if (req.body.linked_bug_ids !== undefined) {
      item.linked_bug_ids = normalizeArray(req.body.linked_bug_ids).map((id) =>
        safeTrim(id),
      );
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
    const { defect_id, bug_id } = req.body;

    const item = await TestExecution.findById(req.params.id);

    if (!item || item.isDeleted) {
      return res.status(404).json({
        status: false,
        message: "Test execution not found.",
      });
    }

    if (
      defect_id &&
      !item.linked_defect_ids.some((id) => String(id) === String(defect_id))
    ) {
      item.linked_defect_ids.push(defect_id);
    }

    if (bug_id && !item.linked_bug_ids.includes(bug_id)) {
      item.linked_bug_ids.push(bug_id);
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
      updated_by: req.user?.id || null,
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

/* =========================================================
   BULK SOFT DELETE
========================================================= */
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;

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
          isDeleted: true,
          updated_by: req.user?.id || null,
        },
      },
    );

    return res.json({
      status: true,
      message: "Bulk delete completed successfully.",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("[testExecution.bulkDelete] error:", err);
    return res.status(500).json({
      status: false,
      message: "Error deleting executions in bulk.",
    });
  }
};
