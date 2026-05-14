// src/pages/admin/SingleReport.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaEdit,
  FaProjectDiagram,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const STATUS_BADGE_STYLES = {
  draft: "border-slate-200 bg-slate-50 text-slate-700",
  submitted: "border-sky-200 bg-sky-50 text-sky-700",
  under_review: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusLabel = (statusRaw) => {
  const s = String(statusRaw || "").toLowerCase();
  if (s === "draft") return "Draft";
  if (s === "submitted") return "Submitted";
  if (s === "under_review") return "Under Review";
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  return "Unknown";
};

const getProjectId = (report) => {
  const project = report?.project;
  if (project && typeof project === "object") {
    return String(project._id || project.id || project.projectId || "");
  }
  return String(
    project ||
      report?.projectId ||
      report?.project_id ||
      report?.projectID ||
      "",
  );
};

const getProjectName = (report) =>
  report?.project?.projectName ||
  report?.project?.project_name ||
  report?.project?.name ||
  report?.project?.title ||
  "N/A";

const getTaskName = (report) =>
  report?.task?.title || report?.task?.task_title || "N/A";

const getReporterName = (report) =>
  report?.reporter?.name ||
  report?.reporter?.email ||
  report?.createdBy?.name ||
  report?.createdBy?.email ||
  "N/A";

const SingleReport = () => {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    submissionCriteria: "",
    completionPercentage: 0,
    overallStatus: "draft",
    remarks: "",
    blockers: "",
    nonSubmissionReason: "",
  });

  const token = useMemo(
    () =>
      localStorage.getItem("token") || localStorage.getItem("userToken") || "",
    [],
  );

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token],
  );

  const projectId = useMemo(() => getProjectId(report), [report]);
  const projectName = useMemo(() => getProjectName(report), [report]);

  const allReportsLink = projectId
    ? `/single-project/${projectId}/all-reports`
    : "/all-project-reports";

  const projectDashboardLink = projectId
    ? `/single-project/${projectId}`
    : "/all-projects";

  const overallStatusClass = useMemo(() => {
    const key = report?.overallStatus || "draft";
    return STATUS_BADGE_STYLES[key] || STATUS_BADGE_STYLES.draft;
  }, [report]);

  useEffect(() => {
    if (id) fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${globalBackendRoute}/api/reports/${id}`,
        {
          headers: authHeaders,
        },
      );

      const data = response?.data?.data || null;
      setReport(data);

      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          submissionCriteria: data.submissionCriteria || "",
          completionPercentage: data.completionPercentage || 0,
          overallStatus: data.overallStatus || "draft",
          remarks: data.remarks || "",
          blockers: data.blockers || "",
          nonSubmissionReason: data.nonSubmissionReason || "",
        });
      }

      try {
        await axios.patch(
          `${globalBackendRoute}/api/reports/${id}/view`,
          {},
          { headers: authHeaders },
        );
      } catch (err) {
        console.warn("Failed to mark report as viewed:", err?.message);
      }
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err?.response?.data?.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "completionPercentage") {
      const num = Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: Number.isNaN(num) ? 0 : Math.min(100, Math.max(0, num)),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!report) return;

    try {
      setSaving(true);
      setError("");

      const response = await axios.put(
        `${globalBackendRoute}/api/reports/${report._id}`,
        formData,
        { headers: authHeaders },
      );

      setReport(response?.data?.data || report);
      setEditMode(false);
    } catch (err) {
      console.error("Error saving report:", err);
      setError(err?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (format) => {
    if (!report) return;

    try {
      setExporting(true);
      setError("");

      const res = await axios.get(
        `${globalBackendRoute}/api/reports/${report._id}/export/${format}`,
        {
          responseType: "blob",
          headers: authHeaders,
        },
      );

      const blob = new Blob([res.data], {
        type:
          format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `report_${report._id}.${format === "excel" ? "xlsx" : "docx"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading report:", err);
      setError(
        err?.response?.data?.message || "Failed to download report file.",
      );
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-4 sm:py-6 min-h-screen">
        <div className="mx-auto container px-3 lg:px-6">
          <p className="text-sm text-slate-600">Loading report…</p>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="bg-white py-4 sm:py-6 min-h-screen">
        <div className="mx-auto container px-3 lg:px-6">
          <p className="text-sm text-red-600 mb-2">{error}</p>
          <Link
            to="/all-project-reports"
            className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-1" />
            Back to All Project Reports
          </Link>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white py-4 sm:py-6 min-h-screen">
        <div className="mx-auto container px-3 lg:px-6">
          <p className="text-sm text-slate-700">Report not found.</p>
        </div>
      </div>
    );
  }

  const statusText = statusLabel(report.overallStatus);
  const completion = report.completionPercentage ?? 0;

  return (
    <div className="bg-white py-4 sm:py-6 min-h-screen">
      <div className="mx-auto container px-3 lg:px-6 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link
                to={allReportsLink}
                className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 mb-2"
              >
                <FaArrowLeft className="mr-1" />
                Back to Project All Reports
              </Link>

              <h2 className="font-semibold tracking-tight text-indigo-600 text-xl leading-tight">
                Report Details
              </h2>

              <p className="text-sm text-slate-700 mt-1 break-words">
                {report.title || "(No title)"}
              </p>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2">
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">
                      Project Name:
                    </span>{" "}
                    {projectName}
                  </p>
                </div>

                <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2">
                  <p className="text-xs text-slate-700 break-all">
                    <span className="font-semibold text-slate-900">
                      Project ID:
                    </span>{" "}
                    {projectId || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                  Task: {getTaskName(report)}
                </span>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                  Reporter: {getReporterName(report)}
                </span>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                  Created:{" "}
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="w-full xl:w-auto">
              <div className="flex flex-wrap xl:justify-end gap-2">
                <Link
                  to={projectDashboardLink}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-md hover:bg-black text-xs inline-flex items-center"
                >
                  <FaProjectDiagram className="mr-1 text-[10px]" />
                  Project Dashboard
                </Link>

                <Link
                  to={allReportsLink}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 text-xs inline-flex items-center"
                >
                  <FaArrowLeft className="mr-1 text-[10px]" />
                  All Reports
                </Link>

                <Link
                  to="/all-project-reports"
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-xs inline-flex items-center"
                >
                  All Project Reports
                </Link>

                <button
                  type="button"
                  onClick={() => handleDownload("excel")}
                  disabled={exporting}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-xs inline-flex items-center disabled:opacity-60"
                >
                  <FaDownload className="mr-1 text-[10px]" />
                  Excel
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload("word")}
                  disabled={exporting}
                  className="px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-xs inline-flex items-center disabled:opacity-60"
                >
                  <FaDownload className="mr-1 text-[10px]" />
                  Word
                </button>

                <button
                  type="button"
                  onClick={() => setEditMode((prev) => !prev)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-xs inline-flex items-center"
                >
                  <FaEdit className="mr-1 text-[10px]" />
                  {editMode ? "Cancel Edit" : "Edit Report"}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap xl:justify-end gap-1.5">
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                    overallStatusClass,
                  ].join(" ")}
                >
                  {statusText}
                </span>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                  Completion: {completion}%
                </span>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                  {report.isViewed ? "Viewed" : "Not viewed yet"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-600 flex flex-wrap gap-1">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium">
            Planned:{" "}
            {report.plannedStartDate
              ? new Date(report.plannedStartDate).toLocaleDateString()
              : "N/A"}{" "}
            →{" "}
            {report.plannedEndDate
              ? new Date(report.plannedEndDate).toLocaleDateString()
              : "N/A"}
          </span>

          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium">
            Actual:{" "}
            {report.actualStartDate
              ? new Date(report.actualStartDate).toLocaleDateString()
              : "N/A"}{" "}
            →{" "}
            {report.actualEndDate
              ? new Date(report.actualEndDate).toLocaleDateString()
              : "N/A"}
          </span>

          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium">
            Time Spent:{" "}
            {report.timeSpentMinutes
              ? `${report.timeSpentMinutes} mins`
              : "N/A"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow border border-slate-100 p-4 text-xs sm:text-sm">
            <h3 className="font-semibold text-slate-800 mb-2 text-[11px] uppercase tracking-[0.16em]">
              Project
            </h3>

            <p className="text-slate-700">
              <span className="font-medium text-slate-800">Name:</span>{" "}
              {projectName}
            </p>

            <p className="text-slate-700 mt-1 break-all">
              <span className="font-medium text-slate-800">ID:</span>{" "}
              {projectId || "N/A"}
            </p>

            <Link
              to={projectDashboardLink}
              className="inline-flex mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Open Project Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow border border-slate-100 p-4 text-xs sm:text-sm">
            <h3 className="font-semibold text-slate-800 mb-2 text-[11px] uppercase tracking-[0.16em]">
              Workflow
            </h3>

            <p className="text-slate-700">
              <span className="font-medium text-slate-800">
                Task Status @ Report:
              </span>{" "}
              {report.taskStatusAtReport || "N/A"}
            </p>

            <p className="text-slate-700 mt-1">
              <span className="font-medium text-slate-800">Completion:</span>{" "}
              {completion}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow border border-slate-100 p-4 text-xs sm:text-sm">
            <h3 className="font-semibold text-slate-800 mb-2 text-[11px] uppercase tracking-[0.16em]">
              Recipients
            </h3>

            {Array.isArray(report.recipients) &&
            report.recipients.length > 0 ? (
              <ul className="space-y-1.5 text-slate-700">
                {report.recipients.map((u, index) => (
                  <li key={u._id || u.id || index}>
                    {u.name || u.email || "Unknown User"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-xs">
                No recipients specified for this report.
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow border border-slate-100 p-4 sm:p-6">
          {editMode ? (
            <form
              onSubmit={handleSave}
              className="space-y-5 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1 text-xs">
                    Title
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1 text-xs">
                    Completion %
                  </label>
                  <input
                    type="number"
                    name="completionPercentage"
                    value={formData.completionPercentage}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1 text-xs">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1 text-xs">
                  Submission Criteria
                </label>
                <textarea
                  name="submissionCriteria"
                  value={formData.submissionCriteria}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1 text-xs">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1 text-xs">
                    Blockers
                  </label>
                  <textarea
                    name="blockers"
                    value={formData.blockers}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 text-xs rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 text-xs sm:text-sm">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1 text-xs uppercase tracking-[0.16em]">
                  Description
                </h3>
                <p className="text-slate-700 whitespace-pre-line bg-slate-50 rounded-md px-3 py-2">
                  {report.description || "No description provided."}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-1 text-xs uppercase tracking-[0.16em]">
                  Submission Criteria
                </h3>
                <p className="text-slate-700 whitespace-pre-line bg-slate-50 rounded-md px-3 py-2">
                  {report.submissionCriteria || "Not specified."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1 text-xs uppercase tracking-[0.16em]">
                    Remarks
                  </h3>
                  <p className="text-slate-700 whitespace-pre-line bg-slate-50 rounded-md px-3 py-2">
                    {report.remarks || "No remarks."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-1 text-xs uppercase tracking-[0.16em]">
                    Blockers
                  </h3>
                  <p className="text-slate-700 whitespace-pre-line bg-slate-50 rounded-md px-3 py-2">
                    {report.blockers || "No blockers mentioned."}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-1 text-xs uppercase tracking-[0.16em]">
                  Reason for Non-Submission
                </h3>
                <p className="text-slate-700 whitespace-pre-line bg-slate-50 rounded-md px-3 py-2">
                  {report.nonSubmissionReason || "Not applicable."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleReport;
