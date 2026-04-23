// frontend/src/pages/testcases/AddTestCase.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaClipboardList,
  FaPlus,
  FaTrash,
  FaUser,
  FaTools,
  FaCalendar,
  FaClipboardCheck,
  FaCheckCircle,
  FaFolderOpen,
  FaFileAlt,
  FaInfoCircle,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const AddTestCase = () => {
  const { projectId, scenarioId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Multi-test-case support:
  // Edit only when a specific testCaseId is passed from navigation state.
  const requestedEditTestCaseId = location.state?.testCaseId || "";

  const [scenarioNumber, setScenarioNumber] = useState(
    location.state?.scenarioNumber || "",
  );
  const [scenarioText, setScenarioText] = useState(
    location.state?.scenarioText || "",
  );
  const [projectName, setProjectName] = useState("");
  const [scenarioNumbers, setScenarioNumbers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");

  const [isEditing, setIsEditing] = useState(Boolean(requestedEditTestCaseId));
  const [existingTestCaseId, setExistingTestCaseId] = useState(
    requestedEditTestCaseId,
  );

  const [allUsers, setAllUsers] = useState([]);
  const [approverUsers, setApproverUsers] = useState([]);

  const [scenarioModules, setScenarioModules] = useState([]);
  const [existingScenarioTestCasesCount, setExistingScenarioTestCasesCount] =
    useState(0);

  const initialStep = {
    step_number: 1,
    action_description: "",
    input_data: "",
    expected_result: "",
    actual_result: "",
    status: "Pending",
    remark: "",
  };

  const createDefaultForm = (author = "", moduleName = "") => ({
    test_case_name: "",
    requirement_number: "",
    build_name_or_number: "",
    module_name: moduleName,
    pre_condition: "",
    test_data: "",
    post_condition: "",
    severity: "Medium",
    test_case_type: "Functional",
    brief_description: "",
    test_execution_time: "",
    test_execution_type: "Manual",
    testing_steps: [{ ...initialStep }],
    footer: {
      author,
      reviewed_by: "",
      approved_by: "",
      approved_date: new Date().toISOString().split("T")[0],
    },
  });

  const [testCase, setTestCase] = useState(createDefaultForm());

  const UNASSIGNED_LABEL = "Unassigned";

  const allowedRoles = useMemo(
    () => [
      "superadmin",
      "admin",
      "project_manager",
      "test_lead",
      "qa_lead",
      "developer_lead",
    ],
    [],
  );

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const currentRole = String(currentUser?.role || "").toLowerCase();
  const isPrivilegedUser = allowedRoles.includes(currentRole);

  const hasApproval =
    !!testCase.footer.approved_by &&
    testCase.footer.approved_by.trim().length > 0;

  const canEditStatus = isPrivilegedUser && hasApproval;
  const canEditActualResult = canEditStatus;

  const onBlockedStatusClick = () => {
    alert(
      "Status and Actual Result can be updated only after the test case is approved by a privileged role (superadmin, admin, project_manager, test_lead, qa_lead, developer_lead).",
    );
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authorized, please log in.");
          navigate("/login");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const authorName = user?.name || "";
        setLoggedInUser(authorName);

        const projRes = await axios.get(
          `${globalBackendRoute}/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setProjectName(
          projRes.data.projectName || projRes.data.project?.projectName || "",
        );

        const scenRes = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const scen = scenRes?.data?.scenario;

        const mods =
          Array.isArray(scen?.modules) && scen.modules.length
            ? scen.modules.map((m) =>
                typeof m === "object"
                  ? { _id: m._id, name: m.name }
                  : { _id: String(m), name: "" },
              )
            : scen?.module?._id || scen?.module?.name
              ? [{ _id: scen.module._id, name: scen.module.name }]
              : [];

        setScenarioModules(mods);

        const moduleNamesJoined =
          mods.length > 0
            ? mods.map((m) => m.name || m._id).join(", ")
            : UNASSIGNED_LABEL;

        const resolvedScenarioNumber =
          location.state?.scenarioNumber || scen?.scenario_number || "";
        const resolvedScenarioText =
          location.state?.scenarioText || scen?.scenario_text || "";

        setScenarioNumber(resolvedScenarioNumber);
        setScenarioText(resolvedScenarioText);

        const scenarioTestCases = Array.isArray(scen?.testCases)
          ? scen.testCases
          : [];
        setExistingScenarioTestCasesCount(scenarioTestCases.length);

        if (!location.state?.scenarioNumber) {
          fetchScenarioNumbers(token);
        }

        const [allUsersRes, approversRes] = await Promise.all([
          axios.get(`${globalBackendRoute}/api/users`),
          axios.get(`${globalBackendRoute}/api/users/approvers`),
        ]);

        setAllUsers(Array.isArray(allUsersRes.data) ? allUsersRes.data : []);
        setApproverUsers(
          Array.isArray(approversRes.data) ? approversRes.data : [],
        );

        // CREATE MODE:
        // Even if scenario already has test cases, keep page in create mode
        // unless a specific testCaseId is explicitly passed.
        if (!requestedEditTestCaseId) {
          setTestCase(createDefaultForm(authorName, moduleNamesJoined));
          setIsEditing(false);
          setExistingTestCaseId("");
          return;
        }

        // EDIT MODE:
        // Load only the selected test case, not scen.testCases[0]
        const tcRes = await axios.get(
          `${globalBackendRoute}/api/get-test-case/${requestedEditTestCaseId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const tc = tcRes?.data;

        setTestCase({
          test_case_name: tc?.test_case_name || "",
          requirement_number: tc?.requirement_number || "",
          build_name_or_number: tc?.build_name_or_number || "",
          module_name: tc?.module_name || moduleNamesJoined,
          pre_condition: tc?.pre_condition || "",
          test_data: tc?.test_data || "",
          post_condition: tc?.post_condition || "",
          severity: tc?.severity || "Medium",
          test_case_type: tc?.test_case_type || "Functional",
          brief_description: tc?.brief_description || "",
          test_execution_time: tc?.test_execution_time || "",
          test_execution_type: tc?.test_execution_type || "Manual",
          testing_steps:
            Array.isArray(tc?.testing_steps) && tc.testing_steps.length
              ? tc.testing_steps.map((s, i) => ({
                  step_number: s.step_number ?? i + 1,
                  action_description: s.action_description || "",
                  input_data: s.input_data || "",
                  expected_result: s.expected_result || "",
                  actual_result: s.actual_result || "",
                  status: s.status || "Pending",
                  remark: s.remark || "",
                }))
              : [{ ...initialStep }],
          footer: {
            author: tc?.footer?.author || authorName,
            reviewed_by: tc?.footer?.reviewed_by || "",
            approved_by: tc?.footer?.approved_by || "",
            approved_date: tc?.footer?.approved_date
              ? new Date(tc.footer.approved_date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
          },
        });

        setIsEditing(true);
        setExistingTestCaseId(requestedEditTestCaseId);
      } catch (error) {
        if (error?.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else {
          console.error("Bootstrap error:", error);
        }
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, scenarioId, requestedEditTestCaseId]);

  const fetchScenarioNumbers = async (tokenParam) => {
    try {
      const token = tokenParam || localStorage.getItem("token");
      const response = await axios.get(
        `${globalBackendRoute}/api/projects/${projectId}/scenarios`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setScenarioNumbers(response.data || []);
    } catch (error) {
      console.error("Error fetching scenario numbers:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("footer.")) {
      setTestCase((prev) => ({
        ...prev,
        footer: { ...prev.footer, [name.split(".")[1]]: value },
      }));
      return;
    }

    setTestCase((prev) => ({ ...prev, [name]: value }));
  };

  const [isCustomTestType, setIsCustomTestType] = useState(false);
  const [customTestCaseType, setCustomTestCaseType] = useState("");

  const handleTestCaseTypeChange = (event) => {
    const value = event.target.value;
    setTestCase((prev) => ({ ...prev, test_case_type: value }));
    setIsCustomTestType(value === "Others");
    if (value !== "Others") setCustomTestCaseType("");
  };

  const handleStepChange = (event, stepNumber, field) => {
    const { value } = event.target;
    setTestCase((prev) => ({
      ...prev,
      testing_steps: prev.testing_steps.map((step) =>
        step.step_number === stepNumber ? { ...step, [field]: value } : step,
      ),
    }));
  };

  const addStepRow = () => {
    setTestCase((prev) => {
      const newStepNumber = prev.testing_steps.length + 1;
      const newStep = { ...initialStep, step_number: newStepNumber };
      return { ...prev, testing_steps: [...prev.testing_steps, newStep] };
    });
  };

  const deleteStepRow = (stepNumberToDelete) => {
    setTestCase((prev) => {
      const updated = prev.testing_steps
        .filter((s) => s.step_number !== stepNumberToDelete)
        .map((s, i) => ({ ...s, step_number: i + 1 }));
      return { ...prev, testing_steps: updated };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!testCase.footer.author) {
        alert("Author information is missing. Please log in.");
        return;
      }

      const finalTestCaseType = isCustomTestType
        ? customTestCaseType
        : testCase.test_case_type;

      if (isEditing && existingTestCaseId) {
        await axios.put(
          `${globalBackendRoute}/api/update-test-case/${existingTestCaseId}`,
          {
            ...testCase,
            test_case_type: finalTestCaseType,
            test_execution_type: testCase.test_execution_type || "Manual",
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert("Test case updated successfully.");
      } else {
        // Do not auto-switch to edit mode on 409 anymore.
        // Because multi-test-case support allows many test cases per scenario.
        // Only true duplicate name should fail and show backend message.
        await axios.post(
          `${globalBackendRoute}/api/add-test-case`,
          {
            ...testCase,
            test_case_type: finalTestCaseType,
            test_execution_type: testCase.test_execution_type || "Manual",
            project_id: projectId,
            project_name: projectName,
            scenario_id: scenarioId,
            scenario_number: scenarioNumber,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        alert("Test case added successfully.");
      }

      navigate(`/single-project/${projectId}/all-test-cases`);
    } catch (error) {
      console.error("Add/Update test case error:", error);
      alert(
        error?.response?.data?.message ||
          "Error saving test case. Please try again.",
      );
    }
  };

  const labelClass =
    "mb-1 block text-sm font-semibold text-slate-700 tracking-wide";
  const inputClass =
    "block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  const inputReadOnlyClass =
    "block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none";
  const textareaClass =
    "block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  const requiredStar = <span className="ml-1 text-red-500">*</span>;

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-indigo-600">
              {isEditing ? "Update Test Case" : "Add New Test Case"}
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              {isEditing
                ? "Edit the selected test case."
                : "Create multiple test cases under the same scenario, like Jira."}
            </p>
          </div>

          <Link
            to={`/single-project/${projectId}/all-test-cases`}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-800"
          >
            Back to All Test Cases
          </Link>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaClipboardList className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selected Scenario
              </p>
              <p className="mt-1 text-sm font-semibold text-red-800 break-words">
                {scenarioText || "Scenario text not available"}
              </p>

              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                  Project ID: {projectId}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                  Scenario ID: {scenarioId}
                </span>
                {scenarioNumber && (
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                    Scenario Number: {scenarioNumber}
                  </span>
                )}
                {!isEditing && existingScenarioTestCasesCount > 0 && (
                  <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                    Existing Test Cases: {existingScenarioTestCasesCount}
                  </span>
                )}
              </div>

              {!isEditing && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                  <FaInfoCircle className="mt-0.5 shrink-0" />
                  <div>
                    This page stays in <b>Create mode</b> even if this scenario
                    already has test cases. That lets you add multiple test
                    cases like:
                    <span className="block mt-1">
                      wrong email, wrong password, blank credentials, invalid
                      email format, and so on.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FaFolderOpen className="text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-800">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div>
                <label className={labelClass}>Project ID</label>
                <input
                  type="text"
                  value={projectId}
                  readOnly
                  placeholder="Project ID"
                  className={inputReadOnlyClass}
                />
              </div>

              <div>
                <label className={labelClass}>Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  readOnly
                  placeholder="Project name"
                  className={inputReadOnlyClass}
                />
              </div>

              <div>
                <label className={labelClass}>Scenario ID</label>
                <input
                  type="text"
                  value={scenarioId}
                  readOnly
                  placeholder="Scenario ID"
                  className={inputReadOnlyClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Scenario Number
                  {!scenarioNumber && requiredStar}
                </label>
                {scenarioNumber ? (
                  <input
                    type="text"
                    value={scenarioNumber}
                    readOnly
                    placeholder="Scenario number"
                    className={inputReadOnlyClass}
                  />
                ) : (
                  <select
                    value={scenarioNumber}
                    onChange={(e) => setScenarioNumber(e.target.value)}
                    className={inputClass}
                    disabled={isEditing}
                    title={
                      isEditing
                        ? "Scenario is locked for an existing test case"
                        : ""
                    }
                  >
                    <option value="">Select a scenario number</option>
                    {scenarioNumbers.map((scenario) => (
                      <option
                        key={scenario._id}
                        value={scenario.scenario_number}
                      >
                        {scenario.scenario_number}: {scenario.scenario_text}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FaFileAlt className="text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-800">
                Test Case Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div>
                <label className={labelClass}>
                  Test Case Name {requiredStar}
                </label>
                <input
                  type="text"
                  name="test_case_name"
                  value={testCase.test_case_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter test case name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Requirement Number {requiredStar}
                </label>
                <input
                  type="text"
                  name="requirement_number"
                  value={testCase.requirement_number}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter requirement number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Build Name / Number {requiredStar}
                </label>
                <input
                  type="text"
                  name="build_name_or_number"
                  value={testCase.build_name_or_number}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter build name or build number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Module Name(s)</label>
                <input
                  type="text"
                  name="module_name"
                  value={testCase.module_name}
                  readOnly
                  placeholder="Auto-filled from scenario modules"
                  title="Auto-filled from the Scenario's modules"
                  className={inputReadOnlyClass}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <label className={labelClass}>
                  Pre Condition {requiredStar}
                </label>
                <input
                  type="text"
                  name="pre_condition"
                  value={testCase.pre_condition}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter pre-condition"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Test Data {requiredStar}</label>
                <input
                  type="text"
                  name="test_data"
                  value={testCase.test_data}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter test data"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Post Condition {requiredStar}
                </label>
                <input
                  type="text"
                  name="post_condition"
                  value={testCase.post_condition}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter post-condition"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div>
                <label className={labelClass}>Severity {requiredStar}</label>
                <select
                  name="severity"
                  value={testCase.severity}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Test Case Type {requiredStar}
                </label>
                <select
                  name="test_case_type"
                  value={testCase.test_case_type}
                  onChange={handleTestCaseTypeChange}
                  required
                  className={inputClass}
                >
                  <option value="Functional">Functional</option>
                  <option value="Non-Functional">Non-Functional</option>
                  <option value="Regression">Regression</option>
                  <option value="Smoke">Smoke</option>
                  <option value="Sanity">Sanity</option>
                  <option value="Integration">Integration</option>
                  <option value="GUI">GUI</option>
                  <option value="Adhoc">Adhoc</option>
                  <option value="Internationalization">
                    Internationalization
                  </option>
                  <option value="Localization">Localization</option>
                  <option value="Unit Testing">Unit Testing</option>
                  <option value="Performance">Performance</option>
                  <option value="Load">Load</option>
                  <option value="Stress">Stress</option>
                  <option value="Usability">Usability</option>
                  <option value="Accessibility">Accessibility</option>
                  <option value="Security">Security</option>
                  <option value="End-to-End">End-to-End</option>
                  <option value="Acceptance">Acceptance</option>
                  <option value="Alpha">Alpha</option>
                  <option value="Beta">Beta</option>
                  <option value="Boundary Value">Boundary Value</option>
                  <option value="Scalability">Scalability</option>
                  <option value="Cross-Browser">Cross-Browser</option>
                  <option value="A/B Testing">A/B Testing</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Test Execution Time</label>
                <input
                  type="text"
                  name="test_execution_time"
                  value={testCase.test_execution_time}
                  onChange={handleInputChange}
                  placeholder="e.g. 10 minutes"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Test Execution Type</label>
                <select
                  name="test_execution_type"
                  value={testCase.test_execution_type}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="Manual">Manual</option>
                  <option value="Automation">Automation</option>
                  <option value="Both">Both Manual and Automation</option>
                </select>
              </div>
            </div>

            {isCustomTestType && (
              <div className="mt-4">
                <label className={labelClass}>
                  Specify Custom Test Case Type {requiredStar}
                </label>
                <input
                  type="text"
                  value={customTestCaseType}
                  onChange={(e) => setCustomTestCaseType(e.target.value)}
                  required
                  placeholder="e.g. Chaos Testing"
                  className={inputClass}
                />
              </div>
            )}

            <div className="mt-4">
              <label className={labelClass}>
                Brief Description {requiredStar}
              </label>
              <textarea
                name="brief_description"
                value={testCase.brief_description}
                onChange={handleInputChange}
                required
                placeholder="Summarize the purpose and expected outcome of this test case"
                className={textareaClass}
                rows="3"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FaClipboardCheck className="text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-800">
                  Testing Steps
                </h3>
              </div>

              <button
                type="button"
                onClick={addStepRow}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-800"
                title="Add new step"
              >
                <FaPlus className="mr-2" /> Add Step
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <th className="px-3 py-3">Step #</th>
                    <th className="px-3 py-3">Action Description</th>
                    <th className="px-3 py-3">Input Data</th>
                    <th className="px-3 py-3">Expected Result</th>
                    <th className="px-3 py-3">Actual Result</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Remark</th>
                    <th className="px-3 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {testCase.testing_steps.map((step, index) => (
                    <tr key={index} className="align-top">
                      <td className="px-3 py-3 text-sm font-semibold text-slate-700">
                        {step.step_number}
                      </td>

                      <td className="px-3 py-3 min-w-[220px]">
                        <input
                          type="text"
                          value={step.action_description}
                          onChange={(e) =>
                            handleStepChange(
                              e,
                              step.step_number,
                              "action_description",
                            )
                          }
                          placeholder="Describe the action to perform"
                          className={inputClass}
                        />
                      </td>

                      <td className="px-3 py-3 min-w-[180px]">
                        <input
                          type="text"
                          value={step.input_data}
                          onChange={(e) =>
                            handleStepChange(e, step.step_number, "input_data")
                          }
                          placeholder='e.g. username="john.doe"'
                          className={inputClass}
                        />
                      </td>

                      <td className="px-3 py-3 min-w-[220px]">
                        <input
                          type="text"
                          value={step.expected_result}
                          onChange={(e) =>
                            handleStepChange(
                              e,
                              step.step_number,
                              "expected_result",
                            )
                          }
                          placeholder="Expected result for this step"
                          className={inputClass}
                        />
                      </td>

                      <td className="px-3 py-3 min-w-[220px]">
                        <div className="relative">
                          {!canEditActualResult && (
                            <button
                              type="button"
                              onClick={onBlockedStatusClick}
                              className="absolute inset-0 z-10 opacity-0 cursor-not-allowed"
                              aria-label="Actual Result locked until approval"
                              title="Actual Result locked until approval"
                            />
                          )}
                          <input
                            type="text"
                            value={step.actual_result}
                            onChange={(e) =>
                              handleStepChange(
                                e,
                                step.step_number,
                                "actual_result",
                              )
                            }
                            placeholder="Enter actual result after execution"
                            className={`${inputClass} ${
                              !canEditActualResult
                                ? "bg-slate-100 text-slate-500"
                                : ""
                            }`}
                            readOnly={!canEditActualResult}
                          />
                        </div>
                      </td>

                      <td className="px-3 py-3 min-w-[150px]">
                        <div className="relative">
                          {!canEditStatus && (
                            <button
                              type="button"
                              onClick={onBlockedStatusClick}
                              className="absolute inset-0 z-10 opacity-0 cursor-not-allowed"
                              aria-label="Status locked until approval"
                              title="Status locked until approval"
                            />
                          )}
                          <select
                            value={step.status}
                            onChange={(e) =>
                              handleStepChange(e, step.step_number, "status")
                            }
                            className={`${inputClass} ${
                              !canEditStatus
                                ? "bg-slate-100 text-slate-500"
                                : ""
                            }`}
                            disabled={!canEditStatus}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                          </select>
                        </div>
                      </td>

                      <td className="px-3 py-3 min-w-[180px]">
                        <input
                          type="text"
                          value={step.remark}
                          onChange={(e) =>
                            handleStepChange(e, step.step_number, "remark")
                          }
                          placeholder="Add notes or observation"
                          className={inputClass}
                        />
                      </td>

                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => deleteStepRow(step.step_number)}
                          className="inline-flex items-center justify-center rounded-md bg-rose-600 px-3 py-2 text-white hover:bg-rose-700"
                          title="Delete step"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!canEditStatus && (
              <p className="mt-3 text-xs text-slate-600">
                <b>Note:</b> Status and Actual Result fields are locked at this
                stage. Get the test case approved by a privileged role to enable
                Pass/Fail and execution result updates.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-800">
                Review & Approval
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div>
                <label className={labelClass}>
                  <FaUser className="mr-1 inline-block text-red-500" />
                  Author
                </label>
                <input
                  type="text"
                  name="footer.author"
                  value={testCase.footer.author}
                  readOnly
                  placeholder="Author"
                  className={inputReadOnlyClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <FaTools className="mr-1 inline-block text-blue-500" />
                  Reviewed By
                </label>
                <select
                  name="footer.reviewed_by"
                  value={testCase.footer.reviewed_by}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Select reviewer</option>
                  {allUsers.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name} {u.role ? `(${u.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <FaClipboardList className="mr-1 inline-block text-green-500" />
                  Approved By
                </label>
                <select
                  name="footer.approved_by"
                  value={testCase.footer.approved_by}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTestCase((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        approved_by: val,
                        approved_date:
                          prev.footer.approved_date ||
                          new Date().toISOString().split("T")[0],
                      },
                    }));
                  }}
                  className={inputClass}
                >
                  <option value="">Select approver</option>
                  {approverUsers.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name} {u.role ? `(${u.role})` : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Only users with roles: superadmin, admin, test_lead,
                  developer_lead, business_analyst, qa_lead.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  <FaCalendar className="mr-1 inline-block text-purple-500" />
                  Approved Date
                </label>
                <input
                  type="date"
                  name="footer.approved_date"
                  value={testCase.footer.approved_date}
                  onChange={handleInputChange}
                  disabled={!testCase.footer.approved_by}
                  className={
                    !testCase.footer.approved_by
                      ? inputReadOnlyClass
                      : inputClass
                  }
                  title={
                    !testCase.footer.approved_by
                      ? "Select 'Approved By' first"
                      : ""
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex min-w-[180px] items-center justify-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {isEditing ? "Update Test Case" : "Add Test Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestCase;
