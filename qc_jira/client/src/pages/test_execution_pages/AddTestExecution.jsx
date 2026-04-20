// src/pages/test_execution_pages/AddTestExecution.jsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import globalBackendRoute from "../../config/Config";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClipboardList,
  FaDesktop,
  FaFilter,
  FaInfoCircle,
  FaLayerGroup,
  FaMobileAlt,
  FaPlus,
  FaProjectDiagram,
  FaSave,
  FaSearch,
  FaServer,
  FaTabletAlt,
  FaTasks,
  FaTimes,
  FaTrashAlt,
  FaUser,
} from "react-icons/fa";

const EXECUTION_STATUS = ["Not Run", "Pass", "Fail", "Blocked", "Skipped"];
const EXECUTION_TYPES = ["Manual", "Automation", "Both"];
const ENVIRONMENTS = ["QA", "UAT", "Staging", "Production", "Dev"];
const RUN_TYPES = ["Desktop", "Mobile", "Tablet", "API"];

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

const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const READONLY_INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none cursor-not-allowed";

const TEXTAREA_CLASS =
  "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 min-h-[96px] resize-y";

function safeTrim(value = "") {
  return String(value || "").trim();
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
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

function deriveExecutionStatusFromRuns(runs = []) {
  if (!Array.isArray(runs) || runs.length === 0) return "Not Run";

  const statuses = runs.map((run) => safeTrim(run?.execution_status));

  if (statuses.includes("Fail")) return "Fail";
  if (statuses.includes("Blocked")) return "Blocked";
  if (statuses.every((s) => s === "Skipped")) return "Skipped";
  if (statuses.every((s) => s === "Pass")) return "Pass";

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

function makeEmptyRun(index = 0, runType = "Desktop", environment = "QA") {
  return {
    run_number: index + 1,
    run_label: `Run ${index + 1}`,
    run_type: runType,
    environment,
    browser: "",
    browser_version: "",
    operating_system: "",
    operating_system_version: "",
    device_name: "",
    device_brand: "",
    screen_resolution: "",
    client_tool: "",
    app_version: "",
    is_mobile: runType === "Mobile",
    is_real_device: false,
    execution_status: "Not Run",
    expected_result_snapshot: "",
    actual_result: "",
    remarks: "",
    linked_bug_ids: [],
    attachments: [],
    executed_steps: [],
  };
}

function getRunIcon(runType) {
  if (runType === "Mobile") return <FaMobileAlt className="text-emerald-600" />;
  if (runType === "Tablet") return <FaTabletAlt className="text-violet-600" />;
  if (runType === "API") return <FaServer className="text-amber-600" />;
  return <FaDesktop className="text-sky-600" />;
}

function getStatusBadgeClass(status) {
  if (status === "Pass")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Fail") return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "Blocked")
    return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "Skipped")
    return "border-slate-200 bg-slate-100 text-slate-700";
  return "border-indigo-200 bg-indigo-50 text-indigo-700";
}

function Toast({ toast, onClose }) {
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
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2.5">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
          {icon}
        </span>
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
}

function SectionTitle({ icon, title, hint, action = null }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 shrink-0">
          {icon}
        </span>
        <div>
          <div className="text-sm sm:text-base font-semibold text-slate-900">
            {title}
          </div>
          {hint ? (
            <div className="text-xs text-slate-500 mt-0.5">{hint}</div>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}

export default function AddTestExecution() {
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
    environment: "QA",
    assigned_to: "",
    assigned_to_name: "",
    reviewed_by: "",
    reviewed_by_name: "",
    execution_notes: "",
    remarks: "",
    execution_runs: [],
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
      ? modules.filter(
          (m) => !m.project || String(m.project) === String(selectedProjectId),
        )
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
      rows = rows.filter(
        (s) => !s.project || String(s.project) === String(selectedProjectId),
      );
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
      rows = rows.filter(
        (tc) =>
          !tc.project_id || String(tc.project_id) === String(selectedProjectId),
      );
    }

    if (selectedScenarioId) {
      rows = rows.filter(
        (tc) =>
          !tc.scenario_id ||
          String(tc.scenario_id) === String(selectedScenarioId),
      );
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

  const overallStatus = useMemo(
    () => deriveExecutionStatusFromRuns(form.execution_runs),
    [form.execution_runs],
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
      runs: form.execution_runs.length || 0,
      overallStatus,
    }),
    [
      selectedProject,
      selectedModule,
      selectedScenario,
      selectedTestCase,
      executionPrefill,
      form.execution_runs.length,
      overallStatus,
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
    setForm((prev) => ({ ...prev, execution_runs: [] }));
  }, [selectedProjectId, isPrefilledFromTestCase]);

  useEffect(() => {
    if (isPrefilledFromTestCase) return;
    setSelectedScenarioId("");
    setSelectedTestCaseId("");
    setForm((prev) => ({ ...prev, execution_runs: [] }));
  }, [selectedModuleId, isPrefilledFromTestCase]);

  useEffect(() => {
    if (isPrefilledFromTestCase) return;
    setSelectedTestCaseId("");
    setForm((prev) => ({ ...prev, execution_runs: [] }));
  }, [selectedScenarioId, isPrefilledFromTestCase]);

  useEffect(() => {
    if (!executionPrefill) return;

    const incomingProjectId = executionPrefill.project_id || projectId || "";
    if (incomingProjectId) setSelectedProjectId(String(incomingProjectId));

    setForm((prev) => ({
      ...prev,
      build_name_or_number:
        executionPrefill.build_name_or_number ||
        prev.build_name_or_number ||
        "",
      execution_type:
        executionPrefill.test_execution_type || prev.execution_type || "Manual",
      execution_notes:
        executionPrefill.brief_description || prev.execution_notes || "",
      assigned_to: prev.assigned_to || currentUser?.id || "",
      assigned_to_name: prev.assigned_to_name || currentUser?.name || "",
    }));
  }, [executionPrefill, projectId, currentUser]);

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
      if (matchedScenario) setSelectedScenarioId(String(matchedScenario._id));
    }

    if (wantedModuleName && modules.length > 0) {
      const matchedModule = modules.find(
        (m) =>
          String(m.name || "")
            .trim()
            .toLowerCase() === wantedModuleName,
      );
      if (matchedModule) setSelectedModuleId(String(matchedModule._id));
    }

    if (wantedTestCaseId && testCases.length > 0) {
      const matchedTestCase = testCases.find(
        (tc) => String(tc._id) === wantedTestCaseId,
      );
      if (matchedTestCase) setSelectedTestCaseId(String(matchedTestCase._id));
    }
  }, [executionPrefill, modules, scenarios, testCases]);

  useEffect(() => {
    if (!selectedTestCase) return;

    setForm((prev) => {
      if (
        Array.isArray(prev.execution_runs) &&
        prev.execution_runs.length > 0
      ) {
        return {
          ...prev,
          build_name_or_number:
            prev.build_name_or_number ||
            selectedTestCase.build_name_or_number ||
            "",
          execution_type:
            selectedTestCase.test_execution_type ||
            prev.execution_type ||
            "Manual",
        };
      }

      return {
        ...prev,
        build_name_or_number:
          prev.build_name_or_number ||
          selectedTestCase.build_name_or_number ||
          "",
        execution_type:
          selectedTestCase.test_execution_type ||
          prev.execution_type ||
          "Manual",
        execution_runs: [makeEmptyRun(0, "Desktop", prev.environment || "QA")],
      };
    });
  }, [selectedTestCase]);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addRun = useCallback((runType = "Desktop") => {
    setForm((prev) => ({
      ...prev,
      execution_runs: [
        ...prev.execution_runs,
        makeEmptyRun(
          prev.execution_runs.length,
          runType,
          prev.environment || "QA",
        ),
      ],
    }));
  }, []);

  const removeRun = useCallback((runIndex) => {
    setForm((prev) => ({
      ...prev,
      execution_runs: prev.execution_runs
        .filter((_, index) => index !== runIndex)
        .map((run, index) => ({
          ...run,
          run_number: index + 1,
          run_label: `Run ${index + 1}`,
        })),
    }));
  }, []);

  const updateRunField = useCallback((runIndex, field, value) => {
    setForm((prev) => {
      const nextRuns = [...prev.execution_runs];
      const current = nextRuns[runIndex];
      if (!current) return prev;

      nextRuns[runIndex] = { ...current, [field]: value };

      if (field === "run_type") {
        nextRuns[runIndex].is_mobile = value === "Mobile";
      }

      return { ...prev, execution_runs: nextRuns };
    });
  }, []);

  const addRunBugId = useCallback((runIndex) => {
    setForm((prev) => {
      const nextRuns = [...prev.execution_runs];
      const current = nextRuns[runIndex];
      if (!current) return prev;

      nextRuns[runIndex] = {
        ...current,
        linked_bug_ids: [...normalizeArray(current.linked_bug_ids), ""],
      };

      return { ...prev, execution_runs: nextRuns };
    });
  }, []);

  const updateRunBugId = useCallback((runIndex, bugIndex, value) => {
    setForm((prev) => {
      const nextRuns = [...prev.execution_runs];
      const current = nextRuns[runIndex];
      if (!current) return prev;

      const nextBugIds = [...normalizeArray(current.linked_bug_ids)];
      nextBugIds[bugIndex] = value;

      nextRuns[runIndex] = {
        ...current,
        linked_bug_ids: nextBugIds,
      };

      return { ...prev, execution_runs: nextRuns };
    });
  }, []);

  const removeRunBugId = useCallback((runIndex, bugIndex) => {
    setForm((prev) => {
      const nextRuns = [...prev.execution_runs];
      const current = nextRuns[runIndex];
      if (!current) return prev;

      nextRuns[runIndex] = {
        ...current,
        linked_bug_ids: normalizeArray(current.linked_bug_ids).filter(
          (_, i) => i !== bugIndex,
        ),
      };

      return { ...prev, execution_runs: nextRuns };
    });
  }, []);

  const addRunAttachment = useCallback((runIndex) => {
    setForm((prev) => {
      const nextRuns = [...prev.execution_runs];
      const current = nextRuns[runIndex];
      if (!current) return prev;

      nextRuns[runIndex] = {
        ...current,
        attachments: [
          ...normalizeArray(current.attachments),
          { ...EMPTY_ATTACHMENT },
        ],
      };

      return { ...prev, execution_runs: nextRuns };
    });
  }, []);

  const updateRunAttachment = useCallback(
    (runIndex, attachmentIndex, field, value) => {
      setForm((prev) => {
        const nextRuns = [...prev.execution_runs];
        const current = nextRuns[runIndex];
        if (!current) return prev;

        const nextAttachments = [...normalizeArray(current.attachments)];
        nextAttachments[attachmentIndex] = {
          ...nextAttachments[attachmentIndex],
          [field]: value,
        };

        nextRuns[runIndex] = {
          ...current,
          attachments: nextAttachments,
        };

        return { ...prev, execution_runs: nextRuns };
      });
    },
    [],
  );

  const removeRunAttachment = useCallback((runIndex, attachmentIndex) => {
    setForm((prev) => {
      const nextRuns = [...prev.execution_runs];
      const current = nextRuns[runIndex];
      if (!current) return prev;

      nextRuns[runIndex] = {
        ...current,
        attachments: normalizeArray(current.attachments).filter(
          (_, i) => i !== attachmentIndex,
        ),
      };

      return { ...prev, execution_runs: nextRuns };
    });
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

    if (
      !Array.isArray(form.execution_runs) ||
      form.execution_runs.length === 0
    ) {
      showToast("error", "Please add at least one execution run.");
      return false;
    }

    return true;
  }, [
    currentUser?.id,
    currentUser?.name,
    form.execution_runs,
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

        const normalizedRuns = form.execution_runs.map((run, runIndex) => ({
          run_number: Number(run.run_number || runIndex + 1),
          run_label: normalizeText(run.run_label) || `Run ${runIndex + 1}`,
          run_type: normalizeText(run.run_type) || "Desktop",
          environment: normalizeText(run.environment) || "QA",
          browser: normalizeText(run.browser),
          browser_version: normalizeText(run.browser_version),
          operating_system: normalizeText(run.operating_system),
          operating_system_version: normalizeText(run.operating_system_version),
          device_name: normalizeText(run.device_name),
          device_brand: normalizeText(run.device_brand),
          screen_resolution: normalizeText(run.screen_resolution),
          client_tool: normalizeText(run.client_tool),
          app_version: normalizeText(run.app_version),
          is_mobile: Boolean(run.is_mobile),
          is_real_device: Boolean(run.is_real_device),
          execution_status: EXECUTION_STATUS.includes(run.execution_status)
            ? run.execution_status
            : "Not Run",
          expected_result_snapshot: normalizeText(run.expected_result_snapshot),
          actual_result: normalizeText(run.actual_result),
          remarks: normalizeText(run.remarks),
          linked_bug_ids: normalizeArray(run.linked_bug_ids)
            .map((id) => normalizeText(id))
            .filter(Boolean),
          attachments: normalizeArray(run.attachments)
            .map((att) => ({
              file_name: normalizeText(att.file_name),
              file_url: normalizeText(att.file_url),
              file_type: normalizeText(att.file_type),
            }))
            .filter((att) => att.file_name || att.file_url || att.file_type),
          executed_steps: [],
        }));

        const payload = {
          project_id: selectedProjectId,
          module_id: selectedModuleId,
          scenario_id: selectedScenarioId,
          test_case_id: selectedTestCaseId,
          build_name_or_number: normalizeText(form.build_name_or_number),
          execution_type: form.execution_type,
          execution_status: deriveExecutionStatusFromRuns(normalizedRuns),
          environment: normalizeText(form.environment) || "QA",
          browser: normalizeText(normalizedRuns[0]?.browser || ""),
          browser_version: normalizeText(
            normalizedRuns[0]?.browser_version || "",
          ),
          operating_system: normalizeText(
            normalizedRuns[0]?.operating_system || "",
          ),
          device_type: normalizeText(normalizedRuns[0]?.run_type || "Desktop"),
          device_name: normalizeText(normalizedRuns[0]?.device_name || ""),
          assigned_to: normalizeText(form.assigned_to) || null,
          assigned_to_name: normalizeText(form.assigned_to_name),
          executed_by: currentUser.id,
          executed_by_name: currentUser.name,
          reviewed_by: normalizeText(form.reviewed_by) || null,
          reviewed_by_name: normalizeText(form.reviewed_by_name),
          expected_result_snapshot: normalizeText(
            normalizedRuns[0]?.expected_result_snapshot || "",
          ),
          actual_result: normalizeText(normalizedRuns[0]?.actual_result || ""),
          execution_notes: normalizeText(form.execution_notes),
          remarks: normalizeText(form.remarks),
          executed_steps: [],
          execution_runs: normalizedRuns,
          linked_bug_ids: [
            ...new Set(
              normalizedRuns.flatMap((run) =>
                normalizeArray(run.linked_bug_ids),
              ),
            ),
          ],
          attachments: [],
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
    ? "Prefilled from Test Case"
    : "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} onClose={closeToast} />

      <main>
        <div className="mx-auto max-w-[1550px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 sm:text-sm"
                    >
                      <FaArrowLeft className="mr-2" />
                      Back
                    </button>

                    <span className="inline-flex items-center rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 sm:text-sm">
                      <FaClipboardList className="mr-2" />
                      Simple Test Execution Report
                    </span>

                    {isPrefilledFromTestCase ? (
                      <span className="inline-flex items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:text-sm">
                        <FaCheckCircle className="mr-2" />
                        {prefilledBadgeText}
                      </span>
                    ) : null}
                  </div>

                  <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Clean execution entry for real users
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[15px]">
                    Pick the test case once. Then just add simple runs for
                    browser, OS, mobile, tablet, or API. No step entry here.
                    Steps stay only inside the test case.
                  </p>
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

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
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
                  icon={<FaFilter className="text-amber-600" />}
                  label="Scenario"
                  value={stats.scenario}
                />
                <StatCard
                  icon={<FaTasks className="text-emerald-600" />}
                  label="Test Case"
                  value={stats.testCase}
                />
                <StatCard
                  icon={<FaDesktop className="text-violet-600" />}
                  label="Runs"
                  value={String(stats.runs)}
                />
                <StatCard
                  icon={<FaUser className="text-rose-600" />}
                  label="Overall Status"
                  value={stats.overallStatus}
                />
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <SectionTitle
                    icon={<FaProjectDiagram className="text-indigo-600" />}
                    title="Select the test case"
                    hint="Choose the correct module, scenario, and test case. The step details stay inside the test case."
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Project
                      </label>
                      <input
                        value={
                          selectedProject?.name ||
                          executionPrefill?.project_name ||
                          ""
                        }
                        readOnly
                        className={READONLY_INPUT_CLASS}
                        placeholder="Project from route"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Search Modules
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
                      <label className="text-sm font-medium text-slate-700">
                        Search Scenarios
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
                      <label className="text-sm font-medium text-slate-700">
                        Search Test Cases
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
                      <label className="text-sm font-medium text-slate-700">
                        Module
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
                      <label className="text-sm font-medium text-slate-700">
                        Scenario
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
                      <label className="text-sm font-medium text-slate-700">
                        Test Case
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

                <div className="grid gap-6 xl:grid-cols-[1.05fr_1.95fr]">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <SectionTitle
                      icon={<FaInfoCircle className="text-sky-600" />}
                      title="Execution summary"
                      hint="General details shared across the execution report"
                    />

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Build Name / Number
                        </label>
                        <input
                          value={form.build_name_or_number}
                          onChange={(e) =>
                            updateField("build_name_or_number", e.target.value)
                          }
                          className={INPUT_CLASS}
                          placeholder="e.g. v2.4.11"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Execution Type
                        </label>
                        <select
                          value={form.execution_type}
                          onChange={(e) =>
                            updateField("execution_type", e.target.value)
                          }
                          className={INPUT_CLASS}
                        >
                          {EXECUTION_TYPES.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Default Environment
                        </label>
                        <select
                          value={form.environment}
                          onChange={(e) =>
                            updateField("environment", e.target.value)
                          }
                          className={INPUT_CLASS}
                        >
                          {ENVIRONMENTS.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Executed By
                        </label>
                        <input
                          value={currentUser?.name || ""}
                          readOnly
                          className={READONLY_INPUT_CLASS}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Assigned To ID
                        </label>
                        <input
                          value={form.assigned_to}
                          onChange={(e) =>
                            updateField("assigned_to", e.target.value)
                          }
                          className={INPUT_CLASS}
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Assigned To Name
                        </label>
                        <input
                          value={form.assigned_to_name}
                          onChange={(e) =>
                            updateField("assigned_to_name", e.target.value)
                          }
                          className={INPUT_CLASS}
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Reviewed By Name
                        </label>
                        <input
                          value={form.reviewed_by_name}
                          onChange={(e) =>
                            updateField("reviewed_by_name", e.target.value)
                          }
                          className={INPUT_CLASS}
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Execution Notes
                        </label>
                        <textarea
                          value={form.execution_notes}
                          onChange={(e) =>
                            updateField("execution_notes", e.target.value)
                          }
                          className={TEXTAREA_CLASS}
                          placeholder="Any general notes about this execution"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Overall Remarks
                        </label>
                        <textarea
                          value={form.remarks}
                          onChange={(e) =>
                            updateField("remarks", e.target.value)
                          }
                          className={TEXTAREA_CLASS}
                          placeholder="Any final comments for the whole report"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <SectionTitle
                      icon={<FaDesktop className="text-indigo-600" />}
                      title="Execution runs"
                      hint="One run = one browser / OS / device result. Keep it fast and simple."
                      action={
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => addRun("Desktop")}
                            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                          >
                            <FaDesktop className="mr-2" />
                            Desktop
                          </button>
                          <button
                            type="button"
                            onClick={() => addRun("Mobile")}
                            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                          >
                            <FaMobileAlt className="mr-2" />
                            Mobile
                          </button>
                          <button
                            type="button"
                            onClick={() => addRun("Tablet")}
                            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                          >
                            <FaTabletAlt className="mr-2" />
                            Tablet
                          </button>
                          <button
                            type="button"
                            onClick={() => addRun("API")}
                            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                          >
                            <FaServer className="mr-2" />
                            API
                          </button>
                        </div>
                      }
                    />

                    <div className="space-y-4">
                      {form.execution_runs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                          Select a test case to start. Then add one or more
                          simple execution runs.
                        </div>
                      ) : (
                        form.execution_runs.map((run, runIndex) => (
                          <div
                            key={`run-${runIndex}`}
                            className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4"
                          >
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                                  {getRunIcon(run.run_type)}
                                </span>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base font-semibold text-slate-900">
                                      {run.run_label || `Run ${run.run_number}`}
                                    </h3>
                                    <span
                                      className={[
                                        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                                        getStatusBadgeClass(
                                          run.execution_status,
                                        ),
                                      ].join(" ")}
                                    >
                                      {run.execution_status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    Just fill environment, browser/device,
                                    result, and remarks.
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeRun(runIndex)}
                                disabled={form.execution_runs.length === 1}
                                className="inline-flex items-center rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                              >
                                <FaTrashAlt className="mr-2" />
                                Remove
                              </button>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                              <div>
                                <label className="text-sm font-medium text-slate-700">
                                  Run Label
                                </label>
                                <input
                                  value={run.run_label}
                                  onChange={(e) =>
                                    updateRunField(
                                      runIndex,
                                      "run_label",
                                      e.target.value,
                                    )
                                  }
                                  className={INPUT_CLASS}
                                  placeholder={`Run ${runIndex + 1}`}
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium text-slate-700">
                                  Run Type
                                </label>
                                <select
                                  value={run.run_type}
                                  onChange={(e) =>
                                    updateRunField(
                                      runIndex,
                                      "run_type",
                                      e.target.value,
                                    )
                                  }
                                  className={INPUT_CLASS}
                                >
                                  {RUN_TYPES.map((item) => (
                                    <option key={item} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-slate-700">
                                  Environment
                                </label>
                                <select
                                  value={run.environment}
                                  onChange={(e) =>
                                    updateRunField(
                                      runIndex,
                                      "environment",
                                      e.target.value,
                                    )
                                  }
                                  className={INPUT_CLASS}
                                >
                                  {ENVIRONMENTS.map((item) => (
                                    <option key={item} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-slate-700">
                                  Status
                                </label>
                                <select
                                  value={run.execution_status}
                                  onChange={(e) =>
                                    updateRunField(
                                      runIndex,
                                      "execution_status",
                                      e.target.value,
                                    )
                                  }
                                  className={INPUT_CLASS}
                                >
                                  {EXECUTION_STATUS.map((item) => (
                                    <option key={item} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {(run.run_type === "Desktop" ||
                                run.run_type === "Mobile" ||
                                run.run_type === "Tablet") && (
                                <>
                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      Browser
                                    </label>
                                    <input
                                      value={run.browser}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "browser",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="Chrome / Safari / Edge"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      Browser Version
                                    </label>
                                    <input
                                      value={run.browser_version}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "browser_version",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="e.g. 124"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      Operating System
                                    </label>
                                    <input
                                      value={run.operating_system}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "operating_system",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder={
                                        run.run_type === "Desktop"
                                          ? "Windows / macOS / Linux"
                                          : "Android / iOS"
                                      }
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      OS Version
                                    </label>
                                    <input
                                      value={run.operating_system_version}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "operating_system_version",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="e.g. 11 / 17"
                                    />
                                  </div>
                                </>
                              )}

                              {run.run_type === "Desktop" && (
                                <div>
                                  <label className="text-sm font-medium text-slate-700">
                                    Resolution
                                  </label>
                                  <input
                                    value={run.screen_resolution}
                                    onChange={(e) =>
                                      updateRunField(
                                        runIndex,
                                        "screen_resolution",
                                        e.target.value,
                                      )
                                    }
                                    className={INPUT_CLASS}
                                    placeholder="1920x1080"
                                  />
                                </div>
                              )}

                              {(run.run_type === "Mobile" ||
                                run.run_type === "Tablet") && (
                                <>
                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      Device Name / Model
                                    </label>
                                    <input
                                      value={run.device_name}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "device_name",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="iPhone 15 / Galaxy S24 / iPad"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      Device Brand
                                    </label>
                                    <input
                                      value={run.device_brand}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "device_brand",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="Apple / Samsung"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      App Version
                                    </label>
                                    <input
                                      value={run.app_version}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "app_version",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="Optional"
                                    />
                                  </div>

                                  <div className="flex items-center gap-6 mt-9">
                                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                      <input
                                        type="checkbox"
                                        className="accent-indigo-600"
                                        checked={Boolean(run.is_real_device)}
                                        onChange={(e) =>
                                          updateRunField(
                                            runIndex,
                                            "is_real_device",
                                            e.target.checked,
                                          )
                                        }
                                      />
                                      Real Device
                                    </label>
                                  </div>
                                </>
                              )}

                              {run.run_type === "API" && (
                                <>
                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      Client / Tool
                                    </label>
                                    <input
                                      value={run.client_tool}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "client_tool",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="Postman / Swagger / REST Assured"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      OS / Host
                                    </label>
                                    <input
                                      value={run.operating_system}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "operating_system",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="Windows / Linux"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      OS Version
                                    </label>
                                    <input
                                      value={run.operating_system_version}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "operating_system_version",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="Optional"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-slate-700">
                                      Runner / Browser
                                    </label>
                                    <input
                                      value={run.browser}
                                      onChange={(e) =>
                                        updateRunField(
                                          runIndex,
                                          "browser",
                                          e.target.value,
                                        )
                                      }
                                      className={INPUT_CLASS}
                                      placeholder="Optional"
                                    />
                                  </div>
                                </>
                              )}

                              <div className="xl:col-span-2">
                                <label className="text-sm font-medium text-slate-700">
                                  Expected Snapshot
                                </label>
                                <textarea
                                  value={run.expected_result_snapshot}
                                  onChange={(e) =>
                                    updateRunField(
                                      runIndex,
                                      "expected_result_snapshot",
                                      e.target.value,
                                    )
                                  }
                                  className={TEXTAREA_CLASS}
                                  placeholder="Short expected result on this platform"
                                />
                              </div>

                              <div className="xl:col-span-2">
                                <label className="text-sm font-medium text-slate-700">
                                  Actual Result
                                </label>
                                <textarea
                                  value={run.actual_result}
                                  onChange={(e) =>
                                    updateRunField(
                                      runIndex,
                                      "actual_result",
                                      e.target.value,
                                    )
                                  }
                                  className={TEXTAREA_CLASS}
                                  placeholder="What actually happened"
                                />
                              </div>

                              <div className="xl:col-span-4">
                                <label className="text-sm font-medium text-slate-700">
                                  Run Remarks
                                </label>
                                <textarea
                                  value={run.remarks}
                                  onChange={(e) =>
                                    updateRunField(
                                      runIndex,
                                      "remarks",
                                      e.target.value,
                                    )
                                  }
                                  className={TEXTAREA_CLASS}
                                  placeholder="Notes, failure reason, blocker, observations"
                                />
                              </div>
                            </div>

                            <div className="mt-5 grid gap-4 xl:grid-cols-2">
                              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <SectionTitle
                                  icon={
                                    <FaInfoCircle className="text-rose-600" />
                                  }
                                  title="Linked Bug IDs"
                                  hint="Optional"
                                  action={
                                    <button
                                      type="button"
                                      onClick={() => addRunBugId(runIndex)}
                                      className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                                    >
                                      <FaPlus className="mr-2" />
                                      Add Bug ID
                                    </button>
                                  }
                                />

                                <div className="space-y-3">
                                  {normalizeArray(run.linked_bug_ids).length ===
                                  0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                                      No bug ids added for this run.
                                    </div>
                                  ) : (
                                    normalizeArray(run.linked_bug_ids).map(
                                      (bugId, bugIndex) => (
                                        <div
                                          key={`run-${runIndex}-bug-${bugIndex}`}
                                          className="flex items-center gap-2"
                                        >
                                          <input
                                            value={bugId}
                                            onChange={(e) =>
                                              updateRunBugId(
                                                runIndex,
                                                bugIndex,
                                                e.target.value,
                                              )
                                            }
                                            className={INPUT_CLASS}
                                            placeholder="BUG-104 / DEF-22"
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeRunBugId(runIndex, bugIndex)
                                            }
                                            className="inline-flex items-center rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                                          >
                                            <FaTrashAlt />
                                          </button>
                                        </div>
                                      ),
                                    )
                                  )}
                                </div>
                              </div>

                              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <SectionTitle
                                  icon={
                                    <FaInfoCircle className="text-sky-600" />
                                  }
                                  title="Attachments"
                                  hint="Optional"
                                  action={
                                    <button
                                      type="button"
                                      onClick={() => addRunAttachment(runIndex)}
                                      className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                                    >
                                      <FaPlus className="mr-2" />
                                      Add Attachment
                                    </button>
                                  }
                                />

                                <div className="space-y-3">
                                  {normalizeArray(run.attachments).length ===
                                  0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                                      No attachments added for this run.
                                    </div>
                                  ) : (
                                    normalizeArray(run.attachments).map(
                                      (attachment, attachmentIndex) => (
                                        <div
                                          key={`run-${runIndex}-attachment-${attachmentIndex}`}
                                          className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                                        >
                                          <div className="grid grid-cols-1 gap-3">
                                            <input
                                              value={attachment.file_name}
                                              onChange={(e) =>
                                                updateRunAttachment(
                                                  runIndex,
                                                  attachmentIndex,
                                                  "file_name",
                                                  e.target.value,
                                                )
                                              }
                                              className={INPUT_CLASS}
                                              placeholder="File name"
                                            />
                                            <input
                                              value={attachment.file_url}
                                              onChange={(e) =>
                                                updateRunAttachment(
                                                  runIndex,
                                                  attachmentIndex,
                                                  "file_url",
                                                  e.target.value,
                                                )
                                              }
                                              className={INPUT_CLASS}
                                              placeholder="File URL"
                                            />
                                            <div className="flex items-center gap-2">
                                              <input
                                                value={attachment.file_type}
                                                onChange={(e) =>
                                                  updateRunAttachment(
                                                    runIndex,
                                                    attachmentIndex,
                                                    "file_type",
                                                    e.target.value,
                                                  )
                                                }
                                                className={INPUT_CLASS}
                                                placeholder="image/png / video/mp4 / text/plain"
                                              />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  removeRunAttachment(
                                                    runIndex,
                                                    attachmentIndex,
                                                  )
                                                }
                                                className="inline-flex items-center rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                                              >
                                                <FaTrashAlt />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur p-4 shadow-lg">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Ready to save execution?
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        This page stores only execution runs. Test steps remain
                        inside the test case.
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/single-project/${projectId}/all-test-executions`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </Link>

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                      >
                        <FaSave className="mr-2" />
                        {saving ? "Saving..." : "Create Test Execution"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
