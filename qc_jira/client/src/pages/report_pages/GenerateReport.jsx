// src/pages/admin/GenerateReport.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const GenerateReport = () => {
  const { projectId: routeProjectId } = useParams();
  const navigate = useNavigate();

  // ---- mode: general vs linked ----
  // If coming from a specific project route, default to "linked", else "general"
  const [mode, setMode] = useState(routeProjectId ? "linked" : "general");

  // ---- dropdown data ----
  const [projects, setProjects] = useState([]);
  const [tasksForUser, setTasksForUser] = useState([]);

  // ---- selected items for linked mode ----
  const [selectedProjectId, setSelectedProjectId] = useState(
    routeProjectId || ""
  );
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const [form, setForm] = useState({
    // when mode === "general", this is just free text reference, not ObjectId
    externalTaskId: "",
    title: "",
    description: "",
    submissionCriteria: "",
    criteriaMet: false,
    taskStatusAtReport: "in_progress",
    completionPercentage: 0,
    plannedStartDate: "",
    plannedEndDate: "",
    actualStartDate: "",
    actualEndDate: "",
    timeSpentMinutes: "",
    overtimeMinutes: "",
    remarks: "",
    blockers: "",
    nonSubmissionReason: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // helpers
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "completionPercentage") {
      const num = Number(value);
      const safe = isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
      setForm((prev) => ({ ...prev, [name]: safe }));
      return;
    }

    if (name === "timeSpentMinutes" || name === "overtimeMinutes") {
      setForm((prev) => ({ ...prev, [name]: value.replace(/[^\d]/g, "") }));
      return;
    }

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Filter tasks for dropdown (linked mode)
  const filteredTasks = React.useMemo(() => {
    if (!selectedProjectId) return tasksForUser;
    return tasksForUser.filter((t) => {
      // Try multiple shapes safely
      const proj =
        t.project ||
        t.projectId ||
        t.project_id ||
        (t.project && t.project._id);
      if (!proj) return false;
      const projId =
        typeof proj === "string" ? proj : String(proj._id || proj.id || proj);
      return projId === selectedProjectId;
    });
  }, [tasksForUser, selectedProjectId]);

  // ==========================================
  // load user, projects & tasks on mount
  // ==========================================
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return;
    let user;
    try {
      user = JSON.parse(userRaw);
    } catch {
      return;
    }

    const currentUserId = user?.id || user?._id;
    if (!currentUserId) return;

    const token =
      localStorage.getItem("token") || localStorage.getItem("userToken");

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // 1) User-assigned projects
    axios
      .get(
        `${globalBackendRoute}/api/user-assigned-projects/${currentUserId}`,
        { headers }
      )
      .then((res) => {
        setProjects(res.data?.assignedProjects || []);
      })
      .catch((err) => {
        console.error("Failed to load user projects:", err);
      });

    // 2) Tasks assigned to this user
    axios
      .get(`${globalBackendRoute}/api/users/${currentUserId}/tasks`, {
        headers,
      })
      .then((res) => {
        const data = res.data;
        const items = data?.items || data?.tasks || data || [];
        setTasksForUser(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        console.error("Failed to load tasks for user:", err);
      });
  }, []);

  // ==========================================
  // submit
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    // For linked mode, ensure project & task are chosen
    if (mode === "linked") {
      if (!selectedProjectId) {
        setError("Please select a project for this report.");
        return;
      }
      if (!selectedTaskId) {
        setError("Please select a task for this report.");
        return;
      }
    }

    try {
      setSaving(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = user?.id || user?._id;
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      const payload = {
        title: form.title.trim(),
        description: form.description || undefined,
        submissionCriteria: form.submissionCriteria || undefined,
        criteriaMet: !!form.criteriaMet,
        taskStatusAtReport: form.taskStatusAtReport || "in_progress",
        completionPercentage: Number(form.completionPercentage) || 0,
        plannedStartDate: form.plannedStartDate || undefined,
        plannedEndDate: form.plannedEndDate || undefined,
        actualStartDate: form.actualStartDate || undefined,
        actualEndDate: form.actualEndDate || undefined,
        timeSpentMinutes: form.timeSpentMinutes
          ? Number(form.timeSpentMinutes)
          : undefined,
        overtimeMinutes: form.overtimeMinutes
          ? Number(form.overtimeMinutes)
          : undefined,
        remarks: form.remarks || undefined,
        blockers: form.blockers || undefined,
        nonSubmissionReason: form.nonSubmissionReason || undefined,
        currentUserId,
      };

      // 🔹 LINKED MODE → send real project/task IDs to backend
      if (mode === "linked") {
        payload.project = selectedProjectId;
        payload.task = selectedTaskId;
      }

      // 🔹 GENERAL MODE → no project/task. Just store optional free-text ref.
      if (mode === "general" && form.externalTaskId.trim()) {
        // this assumes you add a field like `externalTaskId` in ReportModel.
        // Backend will ignore it if not present in schema, so it's safe.
        payload.externalTaskId = form.externalTaskId.trim();
      }

      await axios.post(`${globalBackendRoute}/api/all-reports`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      alert("Report has been submitted. Please wait for status update.");
      navigate("/all-reports");
    } catch (err) {
      console.error("Error creating report:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create report.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // render
  // ==========================================
  return (
    <div className="py-10">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-700">
              Generate Report
            </h1>
            {routeProjectId && (
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Context Project ID:{" "}
                <span className="font-mono text-slate-800">
                  {routeProjectId}
                </span>
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              You can create a{" "}
              <span className="font-semibold text-slate-700">
                general report
              </span>{" "}
              or link it to one of your assigned projects & tasks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {routeProjectId && (
              <Link
                to={`/single-project/${routeProjectId}`}
                className="px-3 py-1.5 text-xs sm:text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
              >
                Back to Project
              </Link>
            )}
            <Link
              to={`/all-tasks`}
              className="px-3 py-1.5 text-xs sm:text-sm border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-50"
            >
              View All Tasks
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
          {error && (
            <p className="mb-3 text-xs sm:text-sm text-rose-600">{error}</p>
          )}

          {/* Mode toggle */}
          <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Report Type
              </span>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    value="general"
                    checked={mode === "general"}
                    onChange={() => setMode("general")}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  />
                  <span>General report (no project / task link)</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    value="linked"
                    checked={mode === "linked"}
                    onChange={() => setMode("linked")}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    disabled={
                      projects.length === 0 || tasksForUser.length === 0
                    }
                  />
                  <span>
                    Link to my project & task{" "}
                    {projects.length === 0 || tasksForUser.length === 0
                      ? "(no assigned data)"
                      : ""}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Linked mode: project & task dropdowns */}
          {mode === "linked" && (
            <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs sm:text-sm">
                  Project<span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setSelectedTaskId("");
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select project --</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.project_name || p.projectName || "Unnamed Project"}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  Only projects where you are assigned will appear here.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs sm:text-sm">
                  Task<span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select task --</option>
                  {filteredTasks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.task_title || t.title || "Untitled Task"}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  Tasks are filtered by selected project (or show all if no
                  project chosen).
                </p>
              </div>
            </div>
          )}

          {/* General mode: free-text Task ID (does NOT link to Task model) */}
          {mode === "general" && (
            <div className="mb-4">
              <label className="block font-semibold text-slate-700 mb-1 text-xs sm:text-sm">
                Reference Task ID (optional)
              </label>
              <input
                type="text"
                name="externalTaskId"
                value={form.externalTaskId}
                onChange={handleChange}
                placeholder="If you have some internal/non-system task ID, enter it here. This will not be linked to Task master."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                This will be saved only inside the report as a reference; it
                will not be validated as a real Task ObjectId.
              </p>
            </div>
          )}

          {/* Main form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 text-xs sm:text-sm"
          >
            {/* Title */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Report Title<span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="E.g. Sprint 5 status update"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="High level summary of work done, key updates, scope, etc."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submission criteria */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Submission Criteria
              </label>
              <textarea
                name="submissionCriteria"
                value={form.submissionCriteria}
                onChange={handleChange}
                rows={3}
                placeholder="Acceptance criteria, DoD, or expectations for this report."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Criteria met + status + completion */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 mt-1 sm:mt-6">
                <input
                  type="checkbox"
                  id="criteriaMet"
                  name="criteriaMet"
                  checked={form.criteriaMet}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="criteriaMet"
                  className="text-xs sm:text-sm text-slate-700"
                >
                  Criteria met
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Task Status at Report
                </label>
                <select
                  name="taskStatusAtReport"
                  value={form.taskStatusAtReport}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="needs_more_time">Needs More Time</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Completion %
                </label>
                <input
                  type="number"
                  name="completionPercentage"
                  min={0}
                  max={100}
                  value={form.completionPercentage}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Planned Start / End
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="plannedStartDate"
                    value={form.plannedStartDate}
                    onChange={handleChange}
                    className="w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="date"
                    name="plannedEndDate"
                    value={form.plannedEndDate}
                    onChange={handleChange}
                    className="w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Actual Start / End
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="actualStartDate"
                    value={form.actualStartDate}
                    onChange={handleChange}
                    className="w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="date"
                    name="actualEndDate"
                    value={form.actualEndDate}
                    onChange={handleChange}
                    className="w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Time spent / overtime */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Time Spent (minutes)
                </label>
                <input
                  type="text"
                  name="timeSpentMinutes"
                  value={form.timeSpentMinutes}
                  onChange={handleChange}
                  placeholder="e.g. 480"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Overtime (minutes)
                </label>
                <input
                  type="text"
                  name="overtimeMinutes"
                  value={form.overtimeMinutes}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Remarks / Blockers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Blockers
                </label>
                <textarea
                  name="blockers"
                  value={form.blockers}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Non-submission reason */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Reason for Non-Submission
              </label>
              <textarea
                name="nonSubmissionReason"
                value={form.nonSubmissionReason}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-3 py-1.5 text-xs sm:text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1.5 text-xs sm:text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
