// src/pages/test_execution_pages/AddTestExecution.jsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import globalBackendRoute from "../../config/Config";
import {
  FaArrowLeft,
  FaClipboardList,
  FaCodeBranch,
  FaDesktop,
  FaFilter,
  FaInfoCircle,
  FaLayerGroup,
  FaPlus,
  FaProjectDiagram,
  FaSave,
  FaSearch,
  FaTasks,
  FaTimes,
  FaTrashAlt,
  FaUser,
} from "react-icons/fa";

const EXECUTION_STATUS = ["Not Run", "Pass", "Fail", "Blocked", "Skipped"];
const EXECUTION_TYPES = ["Manual", "Automation", "Both"];
const ENVIRONMENTS = ["QA", "UAT", "Staging", "Production", "Dev"];
const DEVICES = ["Desktop", "Mobile", "Tablet", "API"];

const INITIAL_TOAST = Object.freeze({
  open: false,
  type: "success",
  text: "",
});

const EMPTY_ATTACHMENT = Object.freeze({
  file_name: "",
  file_url: "",
  file_type: "",
});

const EMPTY_STEP = Object.freeze({
  step_number: 1,
  action_description: "",
  input_data: "",
  expected_result: "",
  actual_result: "",
  status: "Not Run",
  remark: "",
});

// ✅ stronger visible field styling
const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const READONLY_INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none cursor-not-allowed";

function safeTrim(value = "") {
  return String(value || "").trim();
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("ecoders_token") ||
    ""
  );
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return null;

    return {
      id: user?._id || user?.id || "",
      name: user?.name || user?.fullName || user?.username || user?.email || "",
      role: user?.role || "",
    };
  } catch {
    return null;
  }
}

function extractList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.modules)) return data.modules;
  if (Array.isArray(data?.scenarios)) return data.scenarios;
  if (Array.isArray(data?.testCases)) return data.testCases;
  if (Array.isArray(data?.testcases)) return data.testcases;
  if (Array.isArray(data?.tests)) return data.tests;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

function normalizeProject(item) {
  return {
    _id: item?._id || item?.id || "",
    name:
      item?.project_name ||
      item?.projectName ||
      item?.name ||
      item?.title ||
      "Unnamed Project",
  };
}

function normalizeModule(item, projectId = "") {
  return {
    _id: item?._id || item?.id || "",
    name:
      item?.name || item?.module_name || item?.moduleName || "Unnamed Module",
    project:
      item?.project?._id ||
      item?.project ||
      item?.project_id ||
      item?.projectId ||
      projectId ||
      "",
    testCasesCount:
      Number(item?.testCasesCount) ||
      Number(item?.testcasesCount) ||
      Number(item?.count) ||
      0,
  };
}

function normalizeScenario(item) {
  return {
    _id: item?._id || item?.id || "",
    scenario_number:
      item?.scenario_number || item?.scenarioNumber || item?.scenario_no || "",
    scenario_text:
      item?.scenario_text ||
      item?.scenario_name ||
      item?.title ||
      item?.name ||
      "",
    project:
      item?.project?._id ||
      item?.project ||
      item?.project_id ||
      item?.projectId ||
      "",
    module:
      item?.module?._id ||
      item?.module ||
      item?.module_id ||
      item?.moduleId ||
      "",
    modules: Array.isArray(item?.modules)
      ? item.modules.map((m) => (typeof m === "object" ? m?._id || "" : m))
      : [],
  };
}

function normalizeTestCase(item, projectId = "", scenarioId = "") {
  return {
    _id: item?._id || item?.id || "",
    test_case_name:
      item?.test_case_name ||
      item?.testCaseName ||
      item?.title ||
      item?.name ||
      "Unnamed Test Case",
    test_case_number:
      item?.test_case_number ||
      item?.testCaseNumber ||
      item?.test_case_id ||
      "",
    requirement_number:
      item?.requirement_number || item?.requirementNumber || "",
    build_name_or_number:
      item?.build_name_or_number || item?.buildNameOrNumber || "",
    test_execution_type:
      item?.test_execution_type || item?.execution_type || "Manual",
    project_id:
      item?.project_id?._id ||
      item?.project_id ||
      item?.project?._id ||
      item?.project ||
      projectId ||
      "",
    scenario_id:
      item?.scenario_id?._id ||
      item?.scenario_id ||
      item?.scenario?._id ||
      item?.scenario ||
      scenarioId ||
      "",
    module_name:
      item?.module_name || item?.moduleName || item?.module?.name || "",
    testing_steps: Array.isArray(item?.testing_steps)
      ? item.testing_steps
      : Array.isArray(item?.steps)
        ? item.steps
        : [],
  };
}

function normalizeStepStatusForExecution(value = "") {
  const raw = safeTrim(value).toLowerCase();
  if (raw === "pass") return "Pass";
  if (raw === "fail") return "Fail";
  if (raw === "blocked") return "Blocked";
  if (raw === "skipped") return "Skipped";
  return "Not Run";
}

function normalizeStepsFromTestCase(testCase) {
  return Array.isArray(testCase?.testing_steps)
    ? testCase.testing_steps.map((step, idx) => ({
        step_number: Number(step?.step_number || step?.stepNumber || idx + 1),
        action_description: safeTrim(
          step?.action_description || step?.action || step?.step_action,
        ),
        input_data: safeTrim(step?.input_data || step?.input || ""),
        expected_result: safeTrim(
          step?.expected_result || step?.expected || "",
        ),
        actual_result: safeTrim(step?.actual_result || ""),
        status: normalizeStepStatusForExecution(step?.status),
        remark: safeTrim(step?.remark || step?.remarks || ""),
      }))
    : [];
}

function normalizeStepsFromPrefill(prefillSteps) {
  return Array.isArray(prefillSteps)
    ? prefillSteps.map((step, idx) => ({
        step_number: Number(step?.step_number || idx + 1),
        action_description: safeTrim(step?.action_description || ""),
        input_data: safeTrim(step?.input_data || ""),
        expected_result: safeTrim(step?.expected_result || ""),
        actual_result: safeTrim(step?.actual_result || ""),
        status: normalizeStepStatusForExecution(step?.status),
        remark: safeTrim(step?.remark || ""),
      }))
    : [];
}

function deriveExecutionStatusFromSteps(steps = []) {
  if (!steps.length) return "Not Run";

  const statuses = steps.map((step) => safeTrim(step?.status));

  if (statuses.includes("Fail")) return "Fail";
  if (statuses.includes("Blocked")) return "Blocked";

  const allSkipped = statuses.every((s) => s === "Skipped");
  if (allSkipped) return "Skipped";

  const allPassed = statuses.every((s) => s === "Pass");
  if (allPassed) return "Pass";

  return "Not Run";
}

async function requestFirstSuccess(urls = [], config = {}) {
  let lastError = null;

  for (const url of urls) {
    try {
      const response = await axios.get(url, config);
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

const Toast = memo(function Toast({ toast, onClose }) {
  if (!toast.open) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed top-4 right-4 z-[999] w-[92vw] max-w-sm">
      <div
        className={[
          "rounded-2xl border shadow-xl backdrop-blur bg-white/95 px-4 py-3",
          "flex items-start gap-3",
          isSuccess ? "border-emerald-200" : "border-rose-200",
        ].join(" ")}
        role="status"
        aria-live="polite"
      >
        <div
          className={[
            "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
            isSuccess
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          ].join(" ")}
        >
          <FaInfoCircle className="text-sm" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900">
            {isSuccess ? "Success" : "Error"}
          </div>
          <div className="mt-0.5 text-sm text-slate-700 break-words">
            {toast.text}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
        >
          <FaTimes className="text-slate-600 text-sm" />
        </button>
      </div>
    </div>
  );
});

const StatCard = memo(function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-start gap-2.5">
        <span className="form-icon-badge shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </div>
          <div className="mt-0.5 text-base sm:text-lg font-semibold text-slate-900 break-words">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
});

const SectionTitle = memo(function SectionTitle({ icon, title, hint }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <span className="form-icon-badge shrink-0">{icon}</span>
      <div>
        <div className="text-sm sm:text-base font-semibold text-slate-900">
          {title}
        </div>
        {hint ? (
          <div className="text-xs text-slate-500 mt-0.5">{hint}</div>
        ) : null}
      </div>
    </div>
  );
});

function AddTestExecution() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();

  const currentUser = useMemo(() => getCurrentUser(), []);
  const authHeaders = useMemo(() => getAuthHeaders(), []);
  const toastTimerRef = useRef(null);

  const executionPrefill = useMemo(
    () => location.state?.executionPrefill || null,
    [location.state],
  );

  const isPrefilledFromTestCase = useMemo(
    () => Boolean(executionPrefill?.test_case_id || executionPrefill?.source),
    [executionPrefill],
  );

  const API = useMemo(
    () => ({
      createExecution: `${globalBackendRoute}/api/test-executions`,

      projectUrls: [
        `${globalBackendRoute}/api/single-project/${projectId}`,
        `${globalBackendRoute}/api/single-projects/${projectId}`,
        `${globalBackendRoute}/api/projects/${projectId}`,
      ],

      // ✅ reordered to avoid noisy 404 first
      modulesUrls: [
        `${globalBackendRoute}/api/single-project/${projectId}/view-all-modules`,
        `${globalBackendRoute}/api/single-projects/${projectId}/view-all-modules`,
        `${globalBackendRoute}/api/modules/project/${projectId}`,
        `${globalBackendRoute}/api/projects/${projectId}/modules`,
      ],

      scenariosUrls: [
        `${globalBackendRoute}/api/single-project/${projectId}/view-all-scenarios`,
        `${globalBackendRoute}/api/single-projects/${projectId}/view-all-scenarios`,
        `${globalBackendRoute}/api/single-project/${projectId}/all-scenarios`,
        `${globalBackendRoute}/api/single-projects/${projectId}/all-scenarios`,
        `${globalBackendRoute}/api/projects/${projectId}/scenarios`,
      ],

      testCasesUrls: [
        `${globalBackendRoute}/api/single-project/${projectId}/all-test-cases`,
        `${globalBackendRoute}/api/single-projects/${projectId}/all-test-cases`,
        `${globalBackendRoute}/api/single-project/${projectId}/view-all-test-cases`,
        `${globalBackendRoute}/api/single-projects/${projectId}/view-all-test-cases`,
        `${globalBackendRoute}/api/projects/${projectId}/test-cases`,
      ],
    }),
    [projectId],
  );

  const [toast, setToast] = useState(INITIAL_TOAST);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);

  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [testCases, setTestCases] = useState([]);

  const [moduleSearch, setModuleSearch] = useState("");
  const [scenarioSearch, setScenarioSearch] = useState("");
  const [testCaseSearch, setTestCaseSearch] = useState("");

  const [selectedProjectId, setSelectedProjectId] = useState(
    projectId || executionPrefill?.project_id || "",
  );
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [selectedTestCaseId, setSelectedTestCaseId] = useState("");

  const [form, setForm] = useState({
    build_name_or_number: "",
    execution_type: "Manual",
    execution_status: "Not Run",
    environment: "QA",
    browser: "",
    browser_version: "",
    operating_system: "",
    device_type: "Desktop",
    device_name: "",
    assigned_to: "",
    assigned_to_name: "",
    reviewed_by: "",
    reviewed_by_name: "",
    expected_result_snapshot: "",
    actual_result: "",
    execution_notes: "",
    remarks: "",
    linked_defect_ids: [],
    linked_bug_ids: [],
    attachments: [],
    executed_steps: [],
  });

  useEffect(() => {
    setSelectedProjectId(projectId || executionPrefill?.project_id || "");
  }, [projectId, executionPrefill]);

  const selectedProject = useMemo(
    () =>
      projects.find((p) => String(p._id) === String(selectedProjectId)) || null,
    [projects, selectedProjectId],
  );

  const filteredModules = useMemo(() => {
    let rows = selectedProjectId
      ? modules.filter((m) => {
          if (!m.project) return true;
          return String(m.project) === String(selectedProjectId);
        })
      : modules;

    if (safeTrim(moduleSearch)) {
      const query = safeTrim(moduleSearch).toLowerCase();
      rows = rows.filter((m) => safeTrim(m.name).toLowerCase().includes(query));
    }

    return rows;
  }, [modules, selectedProjectId, moduleSearch]);

  const selectedModule = useMemo(
    () =>
      filteredModules.find((m) => String(m._id) === String(selectedModuleId)) ||
      modules.find((m) => String(m._id) === String(selectedModuleId)) ||
      null,
    [filteredModules, modules, selectedModuleId],
  );

  const filteredScenarios = useMemo(() => {
    let rows = scenarios;

    if (selectedProjectId) {
      rows = rows.filter((s) => {
        if (!s.project) return true;
        return String(s.project) === String(selectedProjectId);
      });
    }

    if (selectedModuleId) {
      rows = rows.filter((s) => {
        if (String(s.module) === String(selectedModuleId)) return true;
        return Array.isArray(s.modules)
          ? s.modules.some((id) => String(id) === String(selectedModuleId))
          : false;
      });
    }

    if (safeTrim(scenarioSearch)) {
      const query = safeTrim(scenarioSearch).toLowerCase();
      rows = rows.filter((s) => {
        const number = safeTrim(s.scenario_number).toLowerCase();
        const text = safeTrim(s.scenario_text).toLowerCase();
        return number.includes(query) || text.includes(query);
      });
    }

    return rows;
  }, [scenarios, selectedProjectId, selectedModuleId, scenarioSearch]);

  const selectedScenario = useMemo(
    () =>
      filteredScenarios.find(
        (s) => String(s._id) === String(selectedScenarioId),
      ) ||
      scenarios.find((s) => String(s._id) === String(selectedScenarioId)) ||
      null,
    [filteredScenarios, scenarios, selectedScenarioId],
  );

  const filteredTestCases = useMemo(() => {
    let rows = testCases;

    if (selectedProjectId) {
      rows = rows.filter((tc) => {
        if (!tc.project_id) return true;
        return String(tc.project_id) === String(selectedProjectId);
      });
    }

    if (selectedScenarioId) {
      rows = rows.filter((tc) => {
        if (!tc.scenario_id) return true;
        return String(tc.scenario_id) === String(selectedScenarioId);
      });
    }

    if (safeTrim(testCaseSearch)) {
      const query = safeTrim(testCaseSearch).toLowerCase();
      rows = rows.filter((tc) => {
        const number = safeTrim(tc.test_case_number).toLowerCase();
        const name = safeTrim(tc.test_case_name).toLowerCase();
        return number.includes(query) || name.includes(query);
      });
    }

    return rows;
  }, [testCases, selectedProjectId, selectedScenarioId, testCaseSearch]);

  const selectedTestCase = useMemo(
    () =>
      filteredTestCases.find(
        (tc) => String(tc._id) === String(selectedTestCaseId),
      ) ||
      testCases.find((tc) => String(tc._id) === String(selectedTestCaseId)) ||
      null,
    [filteredTestCases, testCases, selectedTestCaseId],
  );

  const stats = useMemo(
    () => ({
      project: selectedProject?.name || executionPrefill?.project_name || "—",
      module: selectedModule?.name || executionPrefill?.module_name || "—",
      scenario:
        selectedScenario?.scenario_number ||
        executionPrefill?.scenario_number ||
        "—",
      testCase:
        selectedTestCase?.test_case_number ||
        executionPrefill?.test_case_number ||
        "—",
    }),
    [
      selectedProject,
      selectedModule,
      selectedScenario,
      selectedTestCase,
      executionPrefill,
    ],
  );

  const showToast = useCallback((type, text, ms = 2600) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ open: true, type, text });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, ms);
  }, []);

  const closeToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const fetchBootstrap = useCallback(async () => {
    if (!projectId) {
      showToast("error", "Project id missing in route.");
      return;
    }

    try {
      setLoadingData(true);

      const [projectRes, modulesRes, scenariosRes, testCasesRes] =
        await Promise.all([
          requestFirstSuccess(API.projectUrls, { headers: authHeaders }),
          requestFirstSuccess(API.modulesUrls, { headers: authHeaders }),
          requestFirstSuccess(API.scenariosUrls, { headers: authHeaders }),
          requestFirstSuccess(API.testCasesUrls, { headers: authHeaders }),
        ]);

      const projectPayload =
        projectRes?.data?.project ||
        projectRes?.data?.data ||
        projectRes?.data ||
        null;

      const modulesPayload = extractList(modulesRes?.data).map((item) =>
        normalizeModule(item, projectId),
      );

      const scenariosPayload = extractList(scenariosRes?.data).map(
        normalizeScenario,
      );

      const testCasesPayload = extractList(testCasesRes?.data).map((item) =>
        normalizeTestCase(item, projectId),
      );

      setProjects(projectPayload ? [normalizeProject(projectPayload)] : []);
      setModules(modulesPayload);
      setScenarios(scenariosPayload);
      setTestCases(testCasesPayload);
    } catch (err) {
      console.error("Failed to load add execution dependencies:", err);
      showToast(
        "error",
        err?.response?.data?.message ||
          "Failed to load project/module/scenario/test case data.",
      );
    } finally {
      setLoadingData(false);
    }
  }, [API, authHeaders, projectId, showToast]);

  useEffect(() => {
    fetchBootstrap();
  }, [fetchBootstrap]);

  useEffect(() => {
    if (isPrefilledFromTestCase) return;
    setSelectedModuleId("");
    setSelectedScenarioId("");
    setSelectedTestCaseId("");
  }, [selectedProjectId, isPrefilledFromTestCase]);

  useEffect(() => {
    if (isPrefilledFromTestCase) return;
    setSelectedScenarioId("");
    setSelectedTestCaseId("");
  }, [selectedModuleId, isPrefilledFromTestCase]);

  useEffect(() => {
    if (isPrefilledFromTestCase) return;
    setSelectedTestCaseId("");
  }, [selectedScenarioId, isPrefilledFromTestCase]);

  // ✅ prefill from test case detail page navigation state
  useEffect(() => {
    if (!executionPrefill) return;

    const incomingProjectId = executionPrefill.project_id || projectId || "";
    if (incomingProjectId) {
      setSelectedProjectId(String(incomingProjectId));
    }

    setForm((prev) => ({
      ...prev,
      build_name_or_number:
        executionPrefill.build_name_or_number ||
        prev.build_name_or_number ||
        "",
      execution_type:
        executionPrefill.test_execution_type || prev.execution_type || "Manual",
      expected_result_snapshot:
        executionPrefill.expected_result_snapshot ||
        prev.expected_result_snapshot ||
        "",
      execution_notes:
        executionPrefill.brief_description || prev.execution_notes || "",
      // auto assign current user by default
      assigned_to: prev.assigned_to || currentUser?.id || "",
      assigned_to_name: prev.assigned_to_name || currentUser?.name || "",
      executed_steps:
        Array.isArray(executionPrefill.executed_steps) &&
        executionPrefill.executed_steps.length
          ? normalizeStepsFromPrefill(executionPrefill.executed_steps)
          : prev.executed_steps,
    }));
  }, [executionPrefill, projectId, currentUser]);

  // ✅ auto-select linked dropdowns after master data loads
  useEffect(() => {
    if (!executionPrefill) return;

    const wantedTestCaseId = String(executionPrefill.test_case_id || "");
    const wantedScenarioId = String(executionPrefill.scenario_id || "");
    const wantedModuleName = String(executionPrefill.module_name || "")
      .trim()
      .toLowerCase();

    if (wantedScenarioId && scenarios.length > 0) {
      const matchedScenario = scenarios.find(
        (s) => String(s._id) === wantedScenarioId,
      );
      if (matchedScenario) {
        setSelectedScenarioId(String(matchedScenario._id));
      }
    }

    if (wantedModuleName && modules.length > 0) {
      const matchedModule = modules.find(
        (m) =>
          String(m.name || "")
            .trim()
            .toLowerCase() === wantedModuleName,
      );
      if (matchedModule) {
        setSelectedModuleId(String(matchedModule._id));
      }
    }

    if (wantedTestCaseId && testCases.length > 0) {
      const matchedTestCase = testCases.find(
        (tc) => String(tc._id) === wantedTestCaseId,
      );
      if (matchedTestCase) {
        setSelectedTestCaseId(String(matchedTestCase._id));
      }
    }
  }, [executionPrefill, modules, scenarios, testCases]);

  // ✅ when user picks a test case manually, pull steps + build + exec type
  useEffect(() => {
    if (!selectedTestCase) {
      if (!isPrefilledFromTestCase) {
        setForm((prev) => ({
          ...prev,
          expected_result_snapshot: "",
          executed_steps: [],
        }));
      }
      return;
    }

    const steps = normalizeStepsFromTestCase(selectedTestCase);

    setForm((prev) => ({
      ...prev,
      build_name_or_number:
        prev.build_name_or_number ||
        selectedTestCase.build_name_or_number ||
        "",
      execution_type:
        selectedTestCase.test_execution_type || prev.execution_type || "Manual",
      expected_result_snapshot:
        prev.expected_result_snapshot ||
        steps
          .map((s) => safeTrim(s.expected_result))
          .filter(Boolean)
          .join(" | "),
      executed_steps:
        prev.executed_steps && prev.executed_steps.length
          ? prev.executed_steps
          : steps,
    }));
  }, [selectedTestCase, isPrefilledFromTestCase]);

  // ✅ auto derive overall execution status from step results
  useEffect(() => {
    const derivedStatus = deriveExecutionStatusFromSteps(form.executed_steps);
    setForm((prev) => {
      if (prev.execution_status === derivedStatus) return prev;
      return { ...prev, execution_status: derivedStatus };
    });
  }, [form.executed_steps]);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateStepField = useCallback((index, field, value) => {
    setForm((prev) => {
      const nextSteps = [...prev.executed_steps];
      nextSteps[index] = { ...nextSteps[index], [field]: value };
      return { ...prev, executed_steps: nextSteps };
    });
  }, []);

  const addStep = useCallback(() => {
    if (isPrefilledFromTestCase) return;

    setForm((prev) => ({
      ...prev,
      executed_steps: [
        ...prev.executed_steps,
        {
          ...EMPTY_STEP,
          step_number: prev.executed_steps.length + 1,
        },
      ],
    }));
  }, [isPrefilledFromTestCase]);

  const removeStep = useCallback(
    (index) => {
      if (isPrefilledFromTestCase) return;

      setForm((prev) => ({
        ...prev,
        executed_steps: prev.executed_steps
          .filter((_, i) => i !== index)
          .map((step, idx) => ({
            ...step,
            step_number: idx + 1,
          })),
      }));
    },
    [isPrefilledFromTestCase],
  );

  const addAttachment = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, { ...EMPTY_ATTACHMENT }],
    }));
  }, []);

  const updateAttachment = useCallback((index, field, value) => {
    setForm((prev) => {
      const next = [...prev.attachments];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, attachments: next };
    });
  }, []);

  const removeAttachment = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  }, []);

  const addLinkedBugId = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      linked_bug_ids: [...prev.linked_bug_ids, ""],
    }));
  }, []);

  const updateBugId = useCallback((index, value) => {
    setForm((prev) => {
      const next = [...prev.linked_bug_ids];
      next[index] = value;
      return { ...prev, linked_bug_ids: next };
    });
  }, []);

  const removeBugId = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      linked_bug_ids: prev.linked_bug_ids.filter((_, i) => i !== index),
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (
      !selectedProjectId ||
      !selectedModuleId ||
      !selectedScenarioId ||
      !selectedTestCaseId
    ) {
      showToast(
        "error",
        "Please select module, scenario, and test case properly.",
      );
      return false;
    }

    if (!currentUser?.id || !currentUser?.name) {
      showToast("error", "Current logged-in user not found in localStorage.");
      return false;
    }

    return true;
  }, [
    currentUser?.id,
    currentUser?.name,
    selectedModuleId,
    selectedProjectId,
    selectedScenarioId,
    selectedTestCaseId,
    showToast,
  ]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      try {
        setSaving(true);

        const payload = {
          project_id: selectedProjectId,
          module_id: selectedModuleId,
          scenario_id: selectedScenarioId,
          test_case_id: selectedTestCaseId,

          build_name_or_number: normalizeText(form.build_name_or_number),
          execution_type: form.execution_type,
          execution_status: deriveExecutionStatusFromSteps(form.executed_steps),
          environment: normalizeText(form.environment) || "QA",
          browser: normalizeText(form.browser),
          browser_version: normalizeText(form.browser_version),
          operating_system: normalizeText(form.operating_system),
          device_type: normalizeText(form.device_type) || "Desktop",
          device_name: normalizeText(form.device_name),

          assigned_to: normalizeText(form.assigned_to) || null,
          assigned_to_name: normalizeText(form.assigned_to_name),

          executed_by: currentUser.id,
          executed_by_name: currentUser.name,

          reviewed_by: normalizeText(form.reviewed_by) || null,
          reviewed_by_name: normalizeText(form.reviewed_by_name),

          expected_result_snapshot: normalizeText(
            form.expected_result_snapshot,
          ),
          actual_result: normalizeText(form.actual_result),
          execution_notes: normalizeText(form.execution_notes),
          remarks: normalizeText(form.remarks),

          executed_steps: form.executed_steps.map((step, idx) => ({
            step_number: Number(step.step_number || idx + 1),
            action_description: normalizeText(step.action_description),
            input_data: normalizeText(step.input_data),
            expected_result: normalizeText(step.expected_result),
            actual_result: normalizeText(step.actual_result),
            status: EXECUTION_STATUS.includes(step.status)
              ? step.status
              : "Not Run",
            remark: normalizeText(step.remark),
          })),

          linked_bug_ids: form.linked_bug_ids
            .map((id) => normalizeText(id))
            .filter(Boolean),

          attachments: form.attachments
            .map((att) => ({
              file_name: normalizeText(att.file_name),
              file_url: normalizeText(att.file_url),
              file_type: normalizeText(att.file_type),
            }))
            .filter((att) => att.file_name || att.file_url || att.file_type),
        };

        const res = await axios.post(API.createExecution, payload, {
          headers: authHeaders,
        });

        if (
          res.data?.status ||
          res.data?.success ||
          res.status === 200 ||
          res.status === 201
        ) {
          showToast("success", "Test execution created successfully.");
          setTimeout(() => {
            navigate(`/single-project/${projectId}/all-test-executions`);
          }, 700);
        } else {
          showToast(
            "error",
            res.data?.message || "Failed to create execution.",
          );
        }
      } catch (err) {
        console.error("Create execution error:", err);
        showToast(
          "error",
          err?.response?.data?.message || "Error creating test execution.",
        );
      } finally {
        setSaving(false);
      }
    },
    [
      API.createExecution,
      authHeaders,
      currentUser,
      form,
      navigate,
      projectId,
      selectedModuleId,
      selectedProjectId,
      selectedScenarioId,
      selectedTestCaseId,
      showToast,
      validateForm,
    ],
  );

  const prefilledBadgeText = isPrefilledFromTestCase
    ? "Prefilled from Test Case · TestRail/JIRA execution flow"
    : "";

  return (
    <div className="service-page-wrap min-h-screen bg-slate-50">
      <Toast toast={toast} onClose={closeToast} />

      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="glass-card rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 sm:text-sm"
                    >
                      <FaArrowLeft className="mr-2" />
                      Back
                    </button>

                    <p className="service-badge-heading text-base font-semibold text-slate-900 sm:text-lg">
                      Create test execution
                    </p>
                  </div>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Link execution with module, scenario, and test case for this
                    project. Then capture environment, browser, step results,
                    execution notes, linked bugs, and attachments.
                  </p>

                  {isPrefilledFromTestCase && (
                    <div className="mt-3 inline-flex items-center rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 sm:text-sm">
                      {prefilledBadgeText}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/single-project/${projectId}/all-test-executions`}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 sm:text-sm"
                  >
                    View All Executions
                  </Link>

                  <button
                    type="button"
                    onClick={fetchBootstrap}
                    disabled={loadingData}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:opacity-60 sm:text-sm"
                  >
                    <FaSearch className="mr-2" />
                    {loadingData ? "Loading..." : "Reload Master Data"}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <StatCard
                  icon={<FaProjectDiagram className="text-indigo-600" />}
                  label="Project"
                  value={stats.project}
                />
                <StatCard
                  icon={<FaLayerGroup className="text-sky-600" />}
                  label="Module"
                  value={stats.module}
                />
                <StatCard
                  icon={<FaCodeBranch className="text-amber-600" />}
                  label="Scenario"
                  value={stats.scenario}
                />
                <StatCard
                  icon={<FaTasks className="text-emerald-600" />}
                  label="Test Case"
                  value={stats.testCase}
                />
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <SectionTitle
                    icon={<FaProjectDiagram className="text-indigo-600" />}
                    title="Link execution"
                    hint="This page is already tied to one project. Select the module, scenario, and test case."
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="form-label text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <span className="form-icon-badge">
                            <FaProjectDiagram className="text-[11px]" />
                          </span>
                          <span>Project</span>
                        </span>
                      </label>
                      <input
                        value={
                          selectedProject?.name ||
                          executionPrefill?.project_name ||
                          ""
                        }
                        readOnly
                        className={READONLY_INPUT_CLASS}
                        placeholder="Project auto-selected from route"
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <span className="form-icon-badge">
                            <FaFilter className="text-[11px]" />
                          </span>
                          <span>Search Modules</span>
                        </span>
                      </label>
                      <input
                        value={moduleSearch}
                        onChange={(e) => setModuleSearch(e.target.value)}
                        placeholder="Type module name"
                        className={
                          isPrefilledFromTestCase
                            ? READONLY_INPUT_CLASS
                            : INPUT_CLASS
                        }
                        disabled={isPrefilledFromTestCase}
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <span className="form-icon-badge">
                            <FaFilter className="text-[11px]" />
                          </span>
                          <span>Search Scenarios</span>
                        </span>
                      </label>
                      <input
                        value={scenarioSearch}
                        onChange={(e) => setScenarioSearch(e.target.value)}
                        placeholder="Type scenario number/text"
                        className={
                          isPrefilledFromTestCase
                            ? READONLY_INPUT_CLASS
                            : INPUT_CLASS
                        }
                        disabled={isPrefilledFromTestCase}
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <span className="form-icon-badge">
                            <FaFilter className="text-[11px]" />
                          </span>
                          <span>Search Test Cases</span>
                        </span>
                      </label>
                      <input
                        value={testCaseSearch}
                        onChange={(e) => setTestCaseSearch(e.target.value)}
                        placeholder="Type test case number/name"
                        className={
                          isPrefilledFromTestCase
                            ? READONLY_INPUT_CLASS
                            : INPUT_CLASS
                        }
                        disabled={isPrefilledFromTestCase}
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <span className="form-icon-badge">
                            <FaLayerGroup className="text-[11px]" />
                          </span>
                          <span>Module</span>
                        </span>
                      </label>
                      <select
                        value={selectedModuleId}
                        onChange={(e) => setSelectedModuleId(e.target.value)}
                        disabled={isPrefilledFromTestCase}
                        className={
                          isPrefilledFromTestCase
                            ? READONLY_INPUT_CLASS
                            : INPUT_CLASS
                        }
                      >
                        <option value="">Select module</option>
                        {filteredModules.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                            {item.testCasesCount
                              ? ` (${item.testCasesCount})`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <span className="form-icon-badge">
                            <FaCodeBranch className="text-[11px]" />
                          </span>
                          <span>Scenario</span>
                        </span>
                      </label>
                      <select
                        value={selectedScenarioId}
                        onChange={(e) => setSelectedScenarioId(e.target.value)}
                        disabled={isPrefilledFromTestCase}
                        className={
                          isPrefilledFromTestCase
                            ? READONLY_INPUT_CLASS
                            : INPUT_CLASS
                        }
                      >
                        <option value="">Select scenario</option>
                        {filteredScenarios.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.scenario_number} — {item.scenario_text}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="form-label text-sm font-medium text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <span className="form-icon-badge">
                            <FaClipboardList className="text-[11px]" />
                          </span>
                          <span>Test Case</span>
                        </span>
                      </label>
                      <select
                        value={selectedTestCaseId}
                        onChange={(e) => setSelectedTestCaseId(e.target.value)}
                        disabled={isPrefilledFromTestCase}
                        className={
                          isPrefilledFromTestCase
                            ? READONLY_INPUT_CLASS
                            : INPUT_CLASS
                        }
                      >
                        <option value="">Select test case</option>
                        {filteredTestCases.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.test_case_number} — {item.test_case_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <SectionTitle
                    icon={<FaDesktop className="text-sky-600" />}
                    title="Execution environment"
                    hint="Capture browser, environment, operating system, device, and execution type."
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <input
                      placeholder="Build Name / Number"
                      value={form.build_name_or_number}
                      onChange={(e) =>
                        updateField("build_name_or_number", e.target.value)
                      }
                      className={INPUT_CLASS}
                    />

                    <select
                      value={form.execution_type}
                      onChange={(e) =>
                        updateField("execution_type", e.target.value)
                      }
                      className={INPUT_CLASS}
                    >
                      {EXECUTION_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>

                    <select
                      value={form.execution_status}
                      onChange={(e) =>
                        updateField("execution_status", e.target.value)
                      }
                      className={
                        isPrefilledFromTestCase
                          ? READONLY_INPUT_CLASS
                          : INPUT_CLASS
                      }
                      disabled={isPrefilledFromTestCase}
                      title={
                        isPrefilledFromTestCase
                          ? "Overall status is auto-calculated from step statuses"
                          : ""
                      }
                    >
                      {EXECUTION_STATUS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>

                    <select
                      value={form.environment}
                      onChange={(e) =>
                        updateField("environment", e.target.value)
                      }
                      className={INPUT_CLASS}
                    >
                      {ENVIRONMENTS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>

                    <input
                      placeholder="Browser"
                      value={form.browser}
                      onChange={(e) => updateField("browser", e.target.value)}
                      className={INPUT_CLASS}
                    />

                    <input
                      placeholder="Browser Version"
                      value={form.browser_version}
                      onChange={(e) =>
                        updateField("browser_version", e.target.value)
                      }
                      className={INPUT_CLASS}
                    />

                    <input
                      placeholder="Operating System"
                      value={form.operating_system}
                      onChange={(e) =>
                        updateField("operating_system", e.target.value)
                      }
                      className={INPUT_CLASS}
                    />

                    <select
                      value={form.device_type}
                      onChange={(e) =>
                        updateField("device_type", e.target.value)
                      }
                      className={INPUT_CLASS}
                    >
                      {DEVICES.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>

                    <input
                      placeholder="Device Name"
                      value={form.device_name}
                      onChange={(e) =>
                        updateField("device_name", e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <SectionTitle
                    icon={<FaUser className="text-violet-600" />}
                    title="Ownership"
                    hint="Execution owner, assignee, and reviewer details."
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <input
                      value={currentUser?.name || ""}
                      readOnly
                      className={READONLY_INPUT_CLASS}
                      placeholder="Executed by"
                    />

                    <input
                      placeholder="Assigned To ID"
                      value={form.assigned_to}
                      onChange={(e) =>
                        updateField("assigned_to", e.target.value)
                      }
                      className={INPUT_CLASS}
                    />

                    <input
                      placeholder="Assigned To Name"
                      value={form.assigned_to_name}
                      onChange={(e) =>
                        updateField("assigned_to_name", e.target.value)
                      }
                      className={INPUT_CLASS}
                    />

                    <input
                      placeholder="Reviewed By ID"
                      value={form.reviewed_by}
                      onChange={(e) =>
                        updateField("reviewed_by", e.target.value)
                      }
                      className={INPUT_CLASS}
                    />

                    <input
                      placeholder="Reviewed By Name"
                      value={form.reviewed_by_name}
                      onChange={(e) =>
                        updateField("reviewed_by_name", e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <SectionTitle
                    icon={<FaClipboardList className="text-emerald-600" />}
                    title="Execution result"
                    hint="Expected, actual, notes, and overall remarks."
                  />

                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    <textarea
                      placeholder="Expected Result Snapshot"
                      value={form.expected_result_snapshot}
                      onChange={(e) =>
                        updateField("expected_result_snapshot", e.target.value)
                      }
                      className={
                        isPrefilledFromTestCase
                          ? `${READONLY_INPUT_CLASS} min-h-[110px]`
                          : `${INPUT_CLASS} min-h-[110px]`
                      }
                      readOnly={isPrefilledFromTestCase}
                    />

                    <textarea
                      placeholder="Actual Result"
                      value={form.actual_result}
                      onChange={(e) =>
                        updateField("actual_result", e.target.value)
                      }
                      className={`${INPUT_CLASS} min-h-[110px]`}
                    />

                    <textarea
                      placeholder="Execution Notes"
                      value={form.execution_notes}
                      onChange={(e) =>
                        updateField("execution_notes", e.target.value)
                      }
                      className={`${INPUT_CLASS} min-h-[110px]`}
                    />

                    <textarea
                      placeholder="Remarks"
                      value={form.remarks}
                      onChange={(e) => updateField("remarks", e.target.value)}
                      className={`${INPUT_CLASS} min-h-[110px]`}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <SectionTitle
                    icon={<FaTasks className="text-amber-600" />}
                    title="Execution steps"
                    hint="Auto-populated from the selected test case. Steps are locked like TestRail."
                  />

                  <div className="space-y-4">
                    {form.executed_steps.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                        No steps available yet.
                      </div>
                    ) : (
                      form.executed_steps.map((step, idx) => (
                        <div
                          key={`step-${idx}`}
                          className="rounded-2xl border border-slate-200 p-4 bg-slate-50"
                        >
                          <div className="text-sm font-semibold text-slate-800 mb-2">
                            Step {idx + 1}
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                            <input
                              value={step.step_number}
                              readOnly
                              className={READONLY_INPUT_CLASS}
                            />

                            <select
                              value={step.status}
                              onChange={(e) =>
                                updateStepField(idx, "status", e.target.value)
                              }
                              className={INPUT_CLASS}
                            >
                              {EXECUTION_STATUS.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>

                            <textarea
                              value={step.action_description}
                              readOnly
                              className={`${READONLY_INPUT_CLASS} min-h-[80px]`}
                            />

                            <textarea
                              value={step.input_data}
                              readOnly
                              className={`${READONLY_INPUT_CLASS} min-h-[80px]`}
                            />

                            <textarea
                              value={step.expected_result}
                              readOnly
                              className={`${READONLY_INPUT_CLASS} min-h-[80px]`}
                            />

                            <textarea
                              value={step.actual_result}
                              onChange={(e) =>
                                updateStepField(
                                  idx,
                                  "actual_result",
                                  e.target.value,
                                )
                              }
                              className={`${INPUT_CLASS} min-h-[80px]`}
                              placeholder="Enter actual result"
                            />

                            <textarea
                              value={step.remark}
                              onChange={(e) =>
                                updateStepField(idx, "remark", e.target.value)
                              }
                              className={`${INPUT_CLASS} min-h-[80px] xl:col-span-2`}
                              placeholder="Remark"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <SectionTitle
                    icon={<FaCodeBranch className="text-rose-600" />}
                    title="Linked bug IDs"
                    hint="Link defects (JIRA/TestRail style)."
                  />

                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={addLinkedBugId}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      <FaPlus /> Add Bug ID
                    </button>
                  </div>

                  {form.linked_bug_ids.map((bugId, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        value={bugId}
                        onChange={(e) => updateBugId(idx, e.target.value)}
                        className="input flex-1"
                        placeholder="BUG-123 / JIRA ID"
                      />
                      <button
                        onClick={() => removeBugId(idx)}
                        className="px-3 border rounded-xl text-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <SectionTitle
                    icon={<FaDesktop className="text-cyan-600" />}
                    title="Attachments"
                    hint="Evidence (screenshots, logs, videos)"
                  />

                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={addAttachment}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      <FaPlus /> Add Attachment
                    </button>
                  </div>

                  {form.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-3"
                    >
                      <input
                        value={att.file_name}
                        onChange={(e) =>
                          updateAttachment(idx, "file_name", e.target.value)
                        }
                        className="input"
                        placeholder="File Name"
                      />
                      <input
                        value={att.file_url}
                        onChange={(e) =>
                          updateAttachment(idx, "file_url", e.target.value)
                        }
                        className="input"
                        placeholder="URL"
                      />
                      <input
                        value={att.file_type}
                        onChange={(e) =>
                          updateAttachment(idx, "file_type", e.target.value)
                        }
                        className="input"
                        placeholder="Type (image/log/video)"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800"
                  >
                    <FaSave className="inline mr-2" />
                    {saving ? "Saving..." : "Save Execution"}
                  </button>

                  <Link
                    to={`/single-project/${projectId}/all-test-executions`}
                    className="border px-5 py-2 rounded-xl"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

export default memo(AddTestExecution);
