// src/pages/attendance/SingleAttendance.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import globalBackendRoute from "../../config/Config";

// Feather icons (clean & minimal)
import {
  FiArrowLeft,
  FiEdit3,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiRefreshCcw,
  FiSave,
  FiCopy,
  FiUser,
  FiCalendar,
  FiClock,
  FiTag,
  FiFolder,
  FiExternalLink,
} from "react-icons/fi";

const prettyStatus = (s) => {
  const x = String(s || "").toLowerCase();
  if (x === "accepted") return "Accepted";
  if (x === "rejected") return "Rejected";
  if (x === "marked") return "Marked";
  if (x === "unmarked") return "Unmarked";
  if (x === "pending") return "Pending";
  return s || "—";
};

const statusPill = (s) => {
  const x = String(s || "").toLowerCase();
  if (x === "accepted")
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (x === "rejected") return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  if (x === "marked")
    return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200";
  if (x === "pending")
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  if (x === "unmarked")
    return "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
  return "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
};

const STATUS_VALUES = ["pending", "marked", "accepted", "rejected", "unmarked"];

export default function SingleAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // inline edit state
  const [busy, setBusy] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [remarks, setRemarks] = useState("");

  const api = `${globalBackendRoute}/api`;
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  // ⬇️ Get logged-in user role from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const role = String(user?.role || "").toLowerCase();
  // Hide Edit for these roles:
  const HIDE_EDIT_FOR = new Set(["superadmin", "admin", "project_manager"]);
  const showEditButton = !HIDE_EDIT_FOR.has(role);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(`${api}/attendance/${id}`, { headers });
      setAttendance(res.data);
      // seed inline editors
      setEditStatus(String(res.data?.status || "").toLowerCase());
      setEditHours(
        Number.isFinite(Number(res.data?.hoursWorked))
          ? String(Number(res.data.hoursWorked))
          : ""
      );
      setEditProjectId(res.data?.project?._id || "");
      setRemarks(res.data?.remarks || "");
    } catch (e) {
      const msg =
        e?.response?.status === 404
          ? "Attendance not found (404)."
          : e?.response?.data?.message ||
            e.message ||
            "Failed to fetch attendance.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canApprove = useMemo(
    () => String(attendance?.status || "").toLowerCase() !== "accepted",
    [attendance]
  );

  // Actions
  const handleApprove = async () => {
    try {
      setBusy(true);
      await axios.post(
        `${api}/attendance/${id}/accept`,
        { remarks },
        { headers }
      );
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to approve attendance.");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Reject this attendance?")) return;
    try {
      setBusy(true);
      await axios.post(
        `${api}/attendance/${id}/reject`,
        { remarks },
        { headers }
      );
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to reject attendance.");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveInline = async () => {
    try {
      setBusy(true);
      const payload = {};
      if (editStatus) payload.status = editStatus;
      if (editHours !== "" && !Number.isNaN(Number(editHours))) {
        payload.hoursWorked = Number(editHours);
      }
      if (editProjectId || editProjectId === "") {
        payload.project = editProjectId || null; // allow clearing
      }
      if (remarks !== undefined) payload.remarks = remarks;

      await axios.put(`${api}/attendance/${id}`, payload, { headers });
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save changes.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this attendance permanently?")) return;
    try {
      setBusy(true);
      await axios.delete(`${api}/attendance/${id}`, { headers });
      if (state?.from) navigate(state.from);
      else navigate("/view-all-attendance");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete.");
    } finally {
      setBusy(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(String(attendance?._id || id));
    } catch {
      alert("Copy failed.");
    }
  };

  const employeeId = attendance?.employee?._id;
  const employeeName = attendance?.employee?.name;
  const projectId = attendance?.project?._id;
  const projectName = attendance?.project?.project_name;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="text-sm text-slate-600 flex items-center gap-2">
          <FiRefreshCcw className="animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex items-start justify-between">
          <button
            onClick={() => (state?.from ? navigate(state.from) : navigate(-1))}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
          >
            <FiArrowLeft /> Back
          </button>
        </div>
        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          {err}
        </div>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="text-slate-600">No attendance found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
      {/* Top bar / breadcrumbs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
          <button
            onClick={() => (state?.from ? navigate(state.from) : navigate(-1))}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
            title="Back"
          >
            <FiArrowLeft /> Back
          </button>

          <span className="select-none">/</span>

          <Link
            to="/view-all-attendance"
            className="hover:underline"
            title="All Attendance"
          >
            All Attendance
          </Link>

          {employeeId && (
            <>
              <span className="select-none">/</span>
              <Link
                to={`/view-all-attendance?employee=${employeeId}`}
                className="hover:underline"
                title={`Filter by ${employeeName}`}
              >
                {employeeName || "Employee"}
              </Link>
            </>
          )}

          <span className="select-none">/</span>
          <span className="text-slate-900">
            Attendance #{String(attendance._id).slice(-6)}
          </span>

          <button
            onClick={copyId}
            className="inline-flex items-center gap-1 ml-2 text-slate-500 hover:text-slate-800"
            title="Copy ID"
          >
            <FiCopy />
          </button>
        </div>

        {/* Right side quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {showEditButton && (
            <button
              onClick={() => navigate(`/edit-attendance/${id}`)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              title="Edit full form"
            >
              <FiEdit3 /> Edit
            </button>
          )}

          {canApprove && (
            <button
              onClick={handleApprove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
              title="Approve attendance"
            >
              <FiCheckCircle /> Approve
            </button>
          )}

          <button
            onClick={handleReject}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] rounded-md border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50"
            title="Reject attendance"
          >
            <FiXCircle /> Reject
          </button>

          <button
            onClick={handleDelete}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            title="Delete"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      {/* Details + Inline edit */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: read-only key facts */}
        <section className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">Details</h3>
          <div className="mt-3 divide-y divide-slate-100 text-sm">
            <div className="py-2 flex items-center gap-2">
              <FiUser className="shrink-0 text-slate-500" />
              <div className="w-36 text-slate-500">Employee</div>
              <div className="text-slate-900">
                {attendance.employee?.name || "N/A"}
                {attendance.employee?.email ? (
                  <span className="ml-2 text-slate-500">
                    ({attendance.employee.email})
                  </span>
                ) : null}
              </div>
            </div>

            <div className="py-2 flex items-center gap-2">
              <FiCalendar className="shrink-0 text-slate-500" />
              <div className="w-36 text-slate-500">Date</div>
              <div className="text-slate-900">
                {attendance.date
                  ? moment(attendance.date).format("DD/MM/YYYY")
                  : "—"}
              </div>
            </div>

            <div className="py-2 flex items-center gap-2">
              <FiClock className="shrink-0 text-slate-500" />
              <div className="w-36 text-slate-500">Hours Worked</div>
              <div className="text-slate-900">
                {Number(attendance.hoursWorked ?? 0)}
              </div>
            </div>

            <div className="py-2 flex items-center gap-2">
              <FiTag className="shrink-0 text-slate-500" />
              <div className="w-36 text-slate-500">Status</div>
              <div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] ${statusPill(
                    attendance.status
                  )}`}
                >
                  {prettyStatus(attendance.status)}
                </span>
              </div>
            </div>

            <div className="py-2 flex items-center gap-2">
              <FiFolder className="shrink-0 text-slate-500" />
              <div className="w-36 text-slate-500">Project</div>
              <div className="text-slate-900 flex items-center gap-2">
                {projectName || "—"}
                {projectId && (
                  <Link
                    to={`/view-all-attendance?project=${projectId}`}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
                    title="View all for this project"
                  >
                    <FiExternalLink />
                  </Link>
                )}
              </div>
            </div>

            {attendance.taskDescription ? (
              <div className="py-2">
                <div className="text-slate-500 mb-1">Task</div>
                <div className="text-slate-900 whitespace-pre-wrap">
                  {attendance.taskDescription}
                </div>
              </div>
            ) : null}

            {attendance.remarks ? (
              <div className="py-2">
                <div className="text-slate-500 mb-1">Remarks</div>
                <div className="text-slate-900 whitespace-pre-wrap">
                  {attendance.remarks}
                </div>
              </div>
            ) : null}

            <div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="text-slate-500">
                Submitted
                <div className="text-slate-900">
                  {attendance.submittedAt
                    ? moment(attendance.submittedAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </div>
              </div>
              <div className="text-slate-500">
                Reviewed
                <div className="text-slate-900">
                  {attendance.reviewedAt
                    ? moment(attendance.reviewedAt).format("DD/MM/YYYY HH:mm")
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: inline controls */}
        <section className="lg:col-span-5 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Quick Update
          </h3>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Status
              </label>
              <select
                className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                {STATUS_VALUES.map((s) => (
                  <option key={s} value={s}>
                    {prettyStatus(s)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Hours Worked
              </label>
              <input
                type="number"
                step="0.25"
                className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                value={editHours}
                onChange={(e) => setEditHours(e.target.value)}
                placeholder="e.g. 8"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">
                Project ID (blank to clear)
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                value={editProjectId}
                onChange={(e) => setEditProjectId(e.target.value)}
                placeholder="MongoDB ObjectId or leave blank"
              />
              {projectId && (
                <div className="mt-1 text-xs text-slate-500">
                  Current: {projectName}{" "}
                  <span className="opacity-60">({projectId})</span>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">
                Remarks
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Notes visible in history/review"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSaveInline}
              disabled={busy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-black disabled:opacity-50"
              title="Save changes"
            >
              <FiSave /> Save Changes
            </button>

            <button
              onClick={load}
              disabled={busy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
              title="Reload"
            >
              <FiRefreshCcw /> Reload
            </button>
          </div>

          {/* Helpful shortcuts based on the clicked user/project */}
          <div className="mt-6 text-xs text-slate-500 space-x-3">
            {employeeId && (
              <Link
                className="underline hover:text-slate-800"
                to={`/view-all-attendance?employee=${employeeId}`}
                title="See this user's attendance"
              >
                View all for {employeeName}
              </Link>
            )}
            {projectId && (
              <Link
                className="underline hover:text-slate-800"
                to={`/view-all-attendance?project=${projectId}`}
                title="See all for this project"
              >
                View all for {projectName}
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
