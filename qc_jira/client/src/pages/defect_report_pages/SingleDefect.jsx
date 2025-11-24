import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  FaBug,
  FaListAlt,
  FaFileSignature,
  FaProjectDiagram,
  FaCamera,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const cls = (...a) => a.filter(Boolean).join(" ");

// ---- Canonical status values (MUST match backend / schema) ----
const STATUS = {
  OPEN_NEW: "Open/New",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In-progress", // canonical string used in DB
  FIXED: "Fixed",
  RE_OPENED: "Re-opened",
  CLOSED: "Closed",
  UNABLE_TO_FIX: "Unable-To-fix",
  NOT_AN_ERROR: "Not-An-Error",
  RFE: "Request-For-Enhancement",
};

// Priority badge colors
const priorityColors = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  high: "bg-rose-100 text-rose-700 border-rose-300",
};

// Severity badge colors
const severityColors = {
  minor: "bg-sky-100 text-sky-700 border-sky-300",
  major: "bg-orange-100 text-orange-700 border-orange-300",
  critical: "bg-red-100 text-red-700 border-red-300",
  blocker: "bg-slate-300 text-slate-800 border-slate-400",
};

// Status badge colors – use canonical keys
const statusColors = {
  [STATUS.OPEN_NEW]: "bg-rose-100 text-rose-700 border-rose-300",
  [STATUS.ASSIGNED]: "bg-amber-100 text-amber-700 border-amber-300",
  [STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-700 border-blue-300",
  [STATUS.FIXED]: "bg-emerald-100 text-emerald-700 border-emerald-300",
  [STATUS.RE_OPENED]: "bg-purple-100 text-purple-700 border-purple-300",
  [STATUS.CLOSED]: "bg-slate-200 text-slate-800 border-slate-300",
  [STATUS.UNABLE_TO_FIX]: "bg-slate-100 text-slate-700 border-slate-200",
  [STATUS.NOT_AN_ERROR]: "bg-slate-100 text-slate-700 border-slate-200",
  [STATUS.RFE]: "bg-indigo-100 text-indigo-700 border-indigo-300",
};

const getStatusBadge = (status) =>
  statusColors[status] || "bg-slate-100 text-slate-700 border-slate-200";

const SingleDefect = () => {
  const { projectId, defectId } = useParams();

  const [bug, setBug] = useState(null);
  const [status, setStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [assignedDeveloper, setAssignedDeveloper] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authConfig = useMemo(
    () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    [token]
  );

  const canAssign = useMemo(
    () => ["superadmin", "admin", "test_lead"].includes(userRole),
    [userRole]
  );

  useEffect(() => {
    const fetchDefectAndAux = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
          authConfig
        );
        const data = res.data;
        setBug(data);
        setStatus(data.status || "");

        if (Array.isArray(data.history)) setHistoryData(data.history);

        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser?.role) setUserRole(loggedInUser.role);

        if (data.assignedDeveloper || data.assigned_to) {
          setAssignedDeveloper(data.assignedDeveloper || data.assigned_to);
        }

        const devRes = await axios.get(
          `${globalBackendRoute}/api/projects/${projectId}/developers`,
          authConfig
        );
        setDevelopers(devRes?.data?.developers || []);
      } catch (err) {
        console.error("Error fetching defect:", err?.response?.data || err);
      }
    };

    if (projectId && defectId) fetchDefectAndAux();
  }, [projectId, defectId, authConfig]);

  if (!bug)
    return (
      <div className="bg-white py-6 sm:py-8 text-[13px]">
        <div className="mx-auto container px-2 sm:px-3 lg:px-4">
          Loading defect details…
        </div>
      </div>
    );

  const getImageUrl = (bugImage) => {
    if (bugImage) {
      const normalizedPath = String(bugImage)
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/300x300?text=Bug";
  };

  // Once defect is not Open/New (or assigned), don't allow going back to Open/New.
  const canSelectOpenNew =
    (bug.status === STATUS.OPEN_NEW ||
      bug.status === "Open" ||
      bug.status === "New") &&
    !bug.assignedDeveloper &&
    !bug.assigned_to;

  const handleStatusUpdate = async () => {
    // Guard: no going back to Open/New after it has progressed / been assigned.
    if (status === STATUS.OPEN_NEW && !canSelectOpenNew) {
      alert("You cannot change the status back to 'Open/New' for this defect.");
      return;
    }

    if (
      status === STATUS.CLOSED &&
      !["admin", "project_manager", "superadmin", "qa_lead"].includes(userRole)
    ) {
      alert(
        "Only admins, project managers, superadmins, or qa_lead can close defects."
      );
      return;
    }

    try {
      await axios.put(
        `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
        {
          status,
          updated_by: JSON.parse(localStorage.getItem("user"))?.name,
          assignedDeveloper,
        },
        authConfig
      );
      alert("Status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error?.response?.data || error);
      alert("Failed to update status");
    }
  };

  const priorityKey = (bug.priority || "").toLowerCase();
  const severityKey = (bug.severity || "").toLowerCase();
  const statusClass = getStatusBadge(bug.status);

  return (
    <div className="bg-white py-6 sm:py-8 text-[13px]">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <div className="min-w-[220px]">
            <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px] flex items-center gap-2">
              <FaBug className="text-indigo-500" />
              Defect Details
            </h2>
            <div className="text-[11px] text-gray-600 mt-0.5">
              {bug.bug_id ? `Defect ID: ${bug.bug_id}` : `Defect: ${defectId}`}
            </div>

            <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
              {bug.priority && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-medium",
                    priorityColors[priorityKey] ||
                      "bg-slate-100 text-slate-700 border-slate-200"
                  )}
                >
                  Priority: {bug.priority}
                </span>
              )}
              {bug.severity && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-medium",
                    severityColors[severityKey] ||
                      "bg-slate-100 text-slate-700 border-slate-200"
                  )}
                >
                  Severity: {bug.severity}
                </span>
              )}
              {bug.status && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-semibold",
                    statusClass
                  )}
                >
                  Status: {bug.status}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/single-project/${projectId}/all-defects`}
              className="px-3 py-1.5 bg-slate-50 border rounded-md text-[11px] hover:bg-slate-100"
            >
              All Defects
            </Link>

            {canAssign && (
              <Link
                to={`/single-project/${projectId}/assign-defect/${defectId}`}
                className="px-3 py-1.5 bg-slate-50 border rounded-md text-[11px] hover:bg-slate-100"
              >
                Assign Defect to Developer
              </Link>
            )}

            <Link
              to={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-[11px]"
            >
              Project Dashboard
            </Link>
          </div>
        </div>

        {/* Main layout: left image, right all fields/sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px,minmax(0,1.9fr)] gap-4">
          {/* Left: Image only */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FaCamera className="text-gray-600" /> Bug Screenshot
            </label>
            <div
              className="inline-block rounded-lg border border-slate-200 p-1 bg-slate-50 cursor-pointer hover:shadow-sm transition"
              onClick={() => setShowImageModal(true)}
              title="Click to view full size"
            >
              <img
                src={getImageUrl(bug.bug_picture)}
                alt="Bug"
                className="w-40 h-40 object-cover rounded-md"
              />
            </div>
          </div>

          {/* Right: all details + description + steps + status update */}
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaProjectDiagram className="text-orange-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Project Name
                  </span>
                </div>
                <input
                  type="text"
                  value={bug.project_name || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaListAlt className="text-blue-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Module Name
                  </span>
                </div>
                <input
                  type="text"
                  value={bug.module_name || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaListAlt className="text-blue-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Test Case Number
                  </span>
                </div>
                <input
                  type="text"
                  value={bug.test_case_number || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaFileSignature className="text-green-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Test Case Name
                  </span>
                </div>
                <input
                  type="text"
                  value={bug.test_case_name || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Expected Result
                </span>
                <input
                  type="text"
                  value={bug.expected_result || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Actual Result
                </span>
                <input
                  type="text"
                  value={bug.actual_result || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>
            </div>

            {/* Description & Steps (two columns inside right side) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Description of Defect
                </span>
                <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] whitespace-pre-wrap max-h-48 overflow-auto">
                  {bug.description_of_defect || "N/A"}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Steps to Replicate
                </span>
                <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] max-h-48 overflow-auto">
                  {Array.isArray(bug.steps_to_replicate) &&
                  bug.steps_to_replicate.length ? (
                    <ul className="list-decimal ml-4 space-y-1">
                      {bug.steps_to_replicate.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
            </div>

            {/* Status Update (on right side) */}
            <div className="max-w-xs">
              <span className="block text-xs font-semibold text-slate-800 mb-1">
                Update Status
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full rounded-md border border-slate-200 bg-white py-1.5 px-2 text-[12px]"
              >
                {userRole && (
                  <>
                    {[
                      "superadmin",
                      "admin",
                      "project_manager",
                      "qa_lead",
                    ].includes(userRole) && (
                      <>
                        {canSelectOpenNew && (
                          <option value={STATUS.OPEN_NEW}>Open/New</option>
                        )}
                        <option value={STATUS.ASSIGNED}>Assigned</option>
                        {/* value is canonical In-progress, label can be pretty */}
                        <option value={STATUS.IN_PROGRESS}>In-Progress</option>
                        <option value={STATUS.FIXED}>Fixed</option>
                        <option value={STATUS.RE_OPENED}>Re-opened</option>
                        <option value={STATUS.CLOSED}>Closed</option>
                        <option value={STATUS.UNABLE_TO_FIX}>
                          Unable-To-fix
                        </option>
                        <option value={STATUS.NOT_AN_ERROR}>
                          Not-An-Error
                        </option>
                        <option value={STATUS.RFE}>
                          Request-For-Enhancement
                        </option>
                      </>
                    )}

                    {userRole === "developer" && (
                      <>
                        <option value={STATUS.IN_PROGRESS}>In-Progress</option>
                        <option value={STATUS.FIXED}>Fixed</option>
                        <option value={STATUS.UNABLE_TO_FIX}>
                          Unable-To-fix
                        </option>
                        <option value={STATUS.NOT_AN_ERROR}>
                          Not-An-Error
                        </option>
                        <option value={STATUS.RFE}>
                          Request-For-Enhancement
                        </option>
                      </>
                    )}

                    {userRole === "test_engineer" && (
                      <>
                        {canSelectOpenNew && (
                          <option value={STATUS.OPEN_NEW}>Open/New</option>
                        )}
                        <option value={STATUS.RE_OPENED}>Re-opened</option>
                        <option value={STATUS.FIXED}>Fixed</option>
                      </>
                    )}
                  </>
                )}
              </select>

              <button
                onClick={handleStatusUpdate}
                className="mt-3 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] hover:bg-indigo-800"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Status Update History (full width, list-style like All Defects) */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Defect Status Update History
          </h3>

          {!historyData || historyData.length === 0 ? (
            <div className="text-[12px] text-slate-500">
              No status history available.
            </div>
          ) : (
            <div className="mt-2">
              {/* Header */}
              <div className="grid grid-cols-[40px,1.2fr,1.4fr,1.1fr,1.1fr,1.4fr] items-center text-[11px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
                <div>#</div>
                <div>Status</div>
                <div>Changed By</div>
                <div>Defect ID</div>
                <div>Test Case</div>
                <div>Changed At</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100">
                {historyData.map((entry, index) => {
                  const rowStatusClass = getStatusBadge(entry.status);
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-[40px,1.2fr,1.4fr,1.1fr,1.1fr,1.4fr] items-center text-[11px] px-3 py-2"
                    >
                      <div className="text-slate-700">{index + 1}</div>

                      <div>
                        <span
                          className={cls(
                            "inline-flex items-center px-2 py-0.5 rounded-full border font-semibold",
                            rowStatusClass
                          )}
                        >
                          {entry.status}
                        </span>
                      </div>

                      <div className="text-slate-700 truncate">
                        {entry.updated_by || "—"}
                      </div>

                      <div className="text-slate-700 truncate">
                        {entry.bug_id || bug.bug_id || "—"}
                      </div>

                      <div className="text-slate-700 truncate">
                        {entry.test_case_number || bug.test_case_number || "—"}
                      </div>

                      <div className="text-slate-600">
                        {entry.updated_at
                          ? new Date(entry.updated_at).toLocaleString()
                          : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-size image modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={getImageUrl(bug.bug_picture)}
            alt="Bug full view"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default SingleDefect;
