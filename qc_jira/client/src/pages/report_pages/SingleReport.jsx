// src/pages/admin/SingleReport.jsx

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
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

  const overallStatusClass = useMemo(() => {
    const key = report?.overallStatus || "draft";
    return STATUS_BADGE_STYLES[key] || STATUS_BADGE_STYLES.draft;
  }, [report]);

  const projectId = report?.project?._id;

  useEffect(() => {
    if (id) fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${globalBackendRoute}/api/reports/${id}`
      );
      const data = response?.data?.data;
      setReport(data || null);

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

      // Mark as viewed
      try {
        await axios.patch(`${globalBackendRoute}/api/reports/${id}/view`);
        setReport((prev) =>
          prev ? { ...prev, isViewed: true, viewedAt: new Date() } : prev
        );
      } catch (err) {
        console.warn("Failed to mark as viewed:", err?.message);
      }
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Failed to load report.");
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
        [name]: isNaN(num) ? 0 : Math.min(100, Math.max(0, num)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!report) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: formData.title,
        description: formData.description,
        submissionCriteria: formData.submissionCriteria,
        completionPercentage: formData.completionPercentage,
        overallStatus: formData.overallStatus,
        remarks: formData.remarks,
        blockers: formData.blockers,
        nonSubmissionReason: formData.nonSubmissionReason,
      };

      const response = await axios.put(
        `${globalBackendRoute}/api/reports/${report._id}`,
        payload
      );

      const updated = response?.data?.data;
      setReport(updated || report);
      setEditMode(false);
    } catch (err) {
      console.error("Error saving report:", err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (format) => {
    if (!report) return;

    try {
      setExporting(true);
      setError("");

      const url = `${globalBackendRoute}/api/reports/${report._id}/export/${format}`;

      const res = await axios.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type:
          format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const link = document.createElement("a");
      const fileExt = format === "excel" ? "xlsx" : "docx";
      link.href = window.URL.createObjectURL(blob);
      link.download = `report_${report._id}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading report:", err);
      setError("Failed to download report file.");
    } finally {
      setExporting(false);
    }
  };

  // ---------- STATES: loading / error / not found (match AllReports layout shell) ----------

  if (loading) {
    return (
      <div className="bg-white py-10 sm:py-12 min-h-screen">
        <div className="mx-auto container px-2 sm:px-3 lg:px-4">
          <p className="text-sm text-slate-600">Loading report…</p>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="bg-white py-10 sm:py-12 min-h-screen">
        <div className="mx-auto container px-2 sm:px-3 lg:px-4">
          <p className="text-sm text-red-600 mb-2">{error}</p>
          <Link
            to="/all-reports"
            className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-1" />
            Back to all reports
          </Link>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white py-10 sm:py-12 min-h-screen">
        <div className="mx-auto container px-2 sm:px-3 lg:px-4">
          <p className="text-sm text-slate-700">Report not found.</p>
          <Link
            to="/all-reports"
            className="inline-flex items-center mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-1" />
            Back to all reports
          </Link>
        </div>
      </div>
    );
  }

  // ---------- MAIN UI (same outer shape as AllReports) ----------

  const statusText = statusLabel(report.overallStatus);
  const completion = report.completionPercentage ?? 0;

  return (
    <div className="bg-white py-10 sm:py-12 min-h-screen">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4 space-y-6">
        {/* Header / Controls – layout mirrors AllReports header row */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              Report Details
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {report.title || "(No title)"}
            </p>

            <p className="text-[11px] text-slate-600 mt-1 space-x-1">
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                Project:{" "}
                {report.project?.name || report.project?.project_name || "N/A"}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                Task: {report.task?.title || report.task?.task_title || "N/A"}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                Reporter:{" "}
                {report.reporter?.name ||
                  report.reporter?.email ||
                  report.createdBy?.name ||
                  "N/A"}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                Created:{" "}
                {report.createdAt
                  ? new Date(report.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status chip (same chip style as AllReports) */}
            <span
              className={[
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                overallStatusClass,
              ].join(" ")}
            >
              {statusText}
            </span>

            {/* Completion chip */}
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
              Completion: {completion}%
            </span>

            {/* Viewed chip */}
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
              {report.isViewed ? "Viewed" : "Not viewed yet"}
            </span>

            {/* Back button (same size / feel as others) */}
            <Link
              to="/all-reports"
              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 text-xs inline-flex items-center"
            >
              <FaArrowLeft className="mr-1 text-[10px]" />
              All Reports
            </Link>

            {/* Excel / Word / Edit / Project Dashboard – styled similar to AllReports sort button */}
            <button
              type="button"
              onClick={() => handleDownload("excel")}
              disabled={exporting}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-xs inline-flex items-center disabled:opacity-60"
            >
              <FaDownload className="mr-1 text-[10px]" />
              {exporting ? "Excel…" : "Excel"}
            </button>

            <button
              type="button"
              onClick={() => handleDownload("word")}
              disabled={exporting}
              className="px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-xs inline-flex items-center disabled:opacity-60"
            >
              <FaDownload className="mr-1 text-[10px]" />
              {exporting ? "Word…" : "Word"}
            </button>

            <button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-xs inline-flex items-center"
            >
              <FaEdit className="mr-1 text-[10px]" />
              {editMode ? "Cancel Edit" : "Edit Report"}
            </button>

            {projectId && (
              <Link
                to={`/single-project/${projectId}`}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-md hover:bg-black text-xs inline-flex items-center"
              >
                <FaProjectDiagram className="mr-1 text-[10px]" />
                Project Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Secondary “chips row” similar feel to status/meta chips on AllReports */}
        <div className="text-[11px] text-slate-600 space-x-1">
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

        {/* Meta cards row – same 3-column grid style as your list filters/summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Workflow */}
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
              <span className="inline-flex items-center gap-1">
                {completion}%{" "}
                <span className="relative inline-flex h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.min(100, completion)}%` }}
                  />
                </span>
              </span>
            </p>
          </div>

          {/* Dates & Time */}
          <div className="bg-white rounded-lg shadow border border-slate-100 p-4 text-xs sm:text-sm">
            <h3 className="font-semibold text-slate-800 mb-2 text-[11px] uppercase tracking-[0.16em]">
              Dates & Time
            </h3>
            <p className="text-slate-700">
              <span className="font-medium text-slate-800">Planned:</span>{" "}
              {report.plannedStartDate
                ? new Date(report.plannedStartDate).toLocaleDateString()
                : "N/A"}{" "}
              →{" "}
              {report.plannedEndDate
                ? new Date(report.plannedEndDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-slate-700 mt-1">
              <span className="font-medium text-slate-800">Actual:</span>{" "}
              {report.actualStartDate
                ? new Date(report.actualStartDate).toLocaleDateString()
                : "N/A"}{" "}
              →{" "}
              {report.actualEndDate
                ? new Date(report.actualEndDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-slate-700 mt-1">
              <span className="font-medium text-slate-800">Time Spent:</span>{" "}
              {report.timeSpentMinutes
                ? `${report.timeSpentMinutes} mins`
                : "N/A"}
            </p>
          </div>

          {/* Recipients */}
          <div className="bg-white rounded-lg shadow border border-slate-100 p-4 text-xs sm:text-sm">
            <h3 className="font-semibold text-slate-800 mb-2 text-[11px] uppercase tracking-[0.16em]">
              Recipients
            </h3>
            {Array.isArray(report.recipients) &&
            report.recipients.length > 0 ? (
              <ul className="space-y-1.5 text-slate-700">
                {report.recipients.map((u) => (
                  <li
                    key={u._id}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                      {u.name?.[0]?.toUpperCase() ||
                        u.email?.[0]?.toUpperCase() ||
                        "U"}
                    </span>
                    <span>{u.name || u.email}</span>
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

        {/* Inline error (when editing / downloading) */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Main content card – description / criteria / remarks / blockers */}
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
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1 text-xs">
                    Overall Status
                  </label>
                  <select
                    name="overallStatus"
                    value={formData.overallStatus}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1 text-xs">
                    Reason for Non-Submission
                  </label>
                  <textarea
                    name="nonSubmissionReason"
                    value={formData.nonSubmissionReason}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
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
