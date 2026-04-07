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
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import globalBackendRoute from "../../config/Config";
import {
  FaArrowRight,
  FaBug,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaDesktop,
  FaEdit,
  FaFilter,
  FaInfoCircle,
  FaLayerGroup,
  FaPlus,
  FaProjectDiagram,
  FaSearch,
  FaSyncAlt,
  FaTasks,
  FaTrashAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const EXECUTION_STATUS = ["Not Run", "Pass", "Fail", "Blocked", "Skipped"];

const INITIAL_TOAST = Object.freeze({
  open: false,
  type: "success",
  text: "",
});

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

function extractList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.modules)) return data.modules;
  if (Array.isArray(data?.executions)) return data.executions;
  if (Array.isArray(data?.testExecutions)) return data.testExecutions;
  return [];
}

function normalizeProject(item) {
  return {
    _id: item?._id || item?.id || "",
    name: item?.project_name || item?.name || item?.title || "Unnamed Project",
  };
}

function normalizeExecution(item, index) {
  return {
    _id: item?._id || item?.id || `exec-${index}`,
    execution_number: item?.execution_number || "",
    project_id:
      item?.project_id?._id || item?.project_id || item?.project || "",
    project_name:
      item?.project_name ||
      item?.project?.project_name ||
      item?.project?.name ||
      "",
    module_id: item?.module_id?._id || item?.module_id || "",
    module_name: item?.module_name || item?.module?.name || "",
    scenario_id: item?.scenario_id?._id || item?.scenario_id || "",
    scenario_number:
      item?.scenario_number || item?.scenario?.scenario_number || "",
    test_case_id: item?.test_case_id?._id || item?.test_case_id || "",
    test_case_number:
      item?.test_case_number || item?.test_case?.test_case_number || "",
    test_case_name:
      item?.test_case_name || item?.test_case?.test_case_name || "",
    build_name_or_number: item?.build_name_or_number || "",
    execution_type: item?.execution_type || "Manual",
    execution_status: item?.execution_status || "Not Run",
    environment: item?.environment || "",
    browser: item?.browser || "",
    browser_version: item?.browser_version || "",
    operating_system: item?.operating_system || "",
    device_type: item?.device_type || "",
    device_name: item?.device_name || "",
    executed_by_name: item?.executed_by_name || "",
    assigned_to_name: item?.assigned_to_name || "",
    reviewed_by_name: item?.reviewed_by_name || "",
    actual_result: item?.actual_result || "",
    expected_result_snapshot: item?.expected_result_snapshot || "",
    execution_notes: item?.execution_notes || "",
    remarks: item?.remarks || "",
    linked_bug_ids: Array.isArray(item?.linked_bug_ids)
      ? item.linked_bug_ids
      : [],
    linked_defect_ids: Array.isArray(item?.linked_defect_ids)
      ? item.linked_defect_ids
      : [],
    executed_steps: Array.isArray(item?.executed_steps)
      ? item.executed_steps
      : [],
    attachments: Array.isArray(item?.attachments) ? item.attachments : [],
    executed_at: item?.executed_at || item?.createdAt || null,
  };
}

function getStatusClasses(status) {
  const normalized = safeTrim(status);

  if (normalized === "Pass") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (normalized === "Fail") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (normalized === "Blocked") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (normalized === "Skipped") {
    return "bg-slate-50 text-slate-700 border-slate-200";
  }

  return "bg-sky-50 text-sky-700 border-sky-200";
}

function fmtDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
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

const MiniPill = memo(function MiniPill({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-xs text-slate-700 break-words">{value}</div>
    </div>
  );
});

const DetailBlock = memo(function DetailBlock({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-xs text-slate-700 whitespace-pre-wrap break-words">
        {value}
      </div>
    </div>
  );
});

const ExecutionRow = memo(function ExecutionRow({
  item,
  checked,
  expanded,
  onToggleSelect,
  onToggleExpand,
  onDeleteOne,
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="px-3 py-3 sm:px-4">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggleSelect(item._id)}
              className="h-4 w-4"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {item.execution_number || "Execution"}
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${getStatusClasses(
                      item.execution_status,
                    )}`}
                  >
                    {item.execution_status}
                  </span>
                </div>

                <div className="mt-1 text-sm text-slate-700 break-words">
                  {item.test_case_number || "—"} — {item.test_case_name || "—"}
                </div>

                <div className="mt-1 text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                  <span>{item.project_name || "—"}</span>
                  <span>•</span>
                  <span>{item.module_name || "—"}</span>
                  <span>•</span>
                  <span>{item.scenario_number || "—"}</span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500">
                <div>{fmtDateTime(item.executed_at)}</div>
                <div className="mt-1">
                  {item.browser || "—"} {item.browser_version || ""}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2 text-xs">
              <MiniPill label="Env" value={item.environment || "—"} />
              <MiniPill label="Type" value={item.execution_type || "—"} />
              <MiniPill label="OS" value={item.operating_system || "—"} />
              <MiniPill
                label="Device"
                value={
                  [item.device_type, item.device_name]
                    .filter(Boolean)
                    .join(" / ") || "—"
                }
              />
              <MiniPill
                label="Executed By"
                value={item.executed_by_name || "—"}
              />
              <MiniPill label="Assigned" value={item.assigned_to_name || "—"} />
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleExpand(item._id)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                  title={expanded ? "Hide details" : "Show details"}
                >
                  {expanded ? (
                    <FaChevronUp className="text-slate-600 text-xs" />
                  ) : (
                    <FaChevronDown className="text-slate-600 text-xs" />
                  )}
                </button>

                <Link
                  to={`/single-test-execution/${item._id}`}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                  title="View"
                >
                  <FaSearch className="text-slate-600 text-xs" />
                </Link>

                <Link
                  to={`/edit-test-execution/${item._id}`}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                  title="Edit"
                >
                  <FaEdit className="text-slate-600 text-xs" />
                </Link>

                <button
                  type="button"
                  onClick={() => onDeleteOne(item._id)}
                  className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 transition"
                  title="Delete"
                >
                  <FaTrashAlt className="text-rose-600 text-xs" />
                </button>
              </div>
            </div>

            {expanded ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                  <DetailBlock
                    label="Expected Snapshot"
                    value={item.expected_result_snapshot || "—"}
                  />
                  <DetailBlock
                    label="Actual Result"
                    value={item.actual_result || "—"}
                  />
                  <DetailBlock
                    label="Execution Notes"
                    value={item.execution_notes || "—"}
                  />
                  <DetailBlock label="Remarks" value={item.remarks || "—"} />
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Step Results ({item.executed_steps.length})
                  </div>

                  {item.executed_steps.length === 0 ? (
                    <div className="text-xs text-slate-500">
                      No step execution data.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {item.executed_steps.map((step, idx) => (
                        <div
                          key={`${item._id}-step-${idx}`}
                          className="rounded-xl border border-slate-200 bg-white p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs font-semibold text-slate-900">
                              Step {step.step_number}
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${getStatusClasses(
                                step.status,
                              )}`}
                            >
                              {step.status}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs">
                            <DetailBlock
                              label="Action"
                              value={step.action_description || "—"}
                            />
                            <DetailBlock
                              label="Input Data"
                              value={step.input_data || "—"}
                            />
                            <DetailBlock
                              label="Expected"
                              value={step.expected_result || "—"}
                            />
                            <DetailBlock
                              label="Actual"
                              value={step.actual_result || "—"}
                            />
                          </div>

                          <div className="mt-2">
                            <DetailBlock
                              label="Remark"
                              value={step.remark || "—"}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                  <DetailBlock
                    label="Linked Bug IDs"
                    value={
                      item.linked_bug_ids.length
                        ? item.linked_bug_ids.join(", ")
                        : "—"
                    }
                  />
                  <DetailBlock
                    label="Linked Defect IDs"
                    value={
                      item.linked_defect_ids.length
                        ? item.linked_defect_ids.join(", ")
                        : "—"
                    }
                  />
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Attachments ({item.attachments.length})
                  </div>
                  {item.attachments.length === 0 ? (
                    <div className="text-xs text-slate-500">
                      No attachments.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {item.attachments.map((att, idx) => (
                        <div
                          key={`${item._id}-att-${idx}`}
                          className="rounded-xl border border-slate-200 bg-white p-3 text-xs"
                        >
                          <div className="font-semibold text-slate-900">
                            {att?.file_name || "Unnamed attachment"}
                          </div>
                          <div className="mt-1 text-slate-600">
                            {att?.file_type || "—"}
                          </div>
                          <div className="mt-1 break-all text-sky-700">
                            {att?.file_url || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});

function AllTestExecutions() {
  const { projectId } = useParams();
  const authHeaders = useMemo(() => getAuthHeaders(), []);
  const toastTimerRef = useRef(null);

  const API = useMemo(
    () => ({
      list: `${globalBackendRoute}/api/test-executions`,
      deleteOne: (id) => `${globalBackendRoute}/api/test-executions/${id}`,
      bulkStatus: `${globalBackendRoute}/api/test-executions/bulk-status`,
      bulkAssign: `${globalBackendRoute}/api/test-executions/bulk-assign`,
      bulkLinkDefect: `${globalBackendRoute}/api/test-executions/bulk-link-defect`,
      bulkDelete: `${globalBackendRoute}/api/test-executions/bulk-delete`,
      project: `${globalBackendRoute}/api/single-project/${projectId}`,
    }),
    [projectId],
  );

  const [toast, setToast] = useState(INITIAL_TOAST);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);

  const [executions, setExecutions] = useState([]);
  const [project, setProject] = useState(null);

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const [filters, setFilters] = useState({
    execution_status: "",
    browser: "",
    environment: "",
    q: "",
  });

  const [bulkForm, setBulkForm] = useState({
    execution_status: "",
    assigned_to: "",
    assigned_to_name: "",
    defect_id: "",
    bug_id: "",
  });

  const selectedCount = selectedIds.size;

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

  const fetchExecutions = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const [execRes, projectRes] = await Promise.all([
          axios.get(API.list, { headers: authHeaders }),
          axios.get(API.project, { headers: authHeaders }),
        ]);

        const allExecutions = extractList(execRes.data).map(normalizeExecution);
        const projectOnlyExecutions = allExecutions.filter(
          (item) => String(item.project_id) === String(projectId),
        );

        const projectPayload =
          projectRes?.data?.project ||
          projectRes?.data?.data ||
          projectRes?.data ||
          null;

        setExecutions(projectOnlyExecutions);
        setProject(projectPayload ? normalizeProject(projectPayload) : null);
      } catch (err) {
        console.error("Failed to load executions:", err);
        showToast(
          "error",
          err?.response?.data?.message || "Failed to load test executions.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [API.list, API.project, authHeaders, projectId, showToast],
  );

  useEffect(() => {
    fetchExecutions(false);
  }, [fetchExecutions]);

  const filteredItems = useMemo(() => {
    const q = normalizeText(filters.q).toLowerCase();

    return executions.filter((item) => {
      if (
        filters.execution_status &&
        item.execution_status !== filters.execution_status
      ) {
        return false;
      }
      if (
        filters.browser &&
        normalizeText(item.browser).toLowerCase() !==
          normalizeText(filters.browser).toLowerCase()
      ) {
        return false;
      }
      if (
        filters.environment &&
        normalizeText(item.environment).toLowerCase() !==
          normalizeText(filters.environment).toLowerCase()
      ) {
        return false;
      }

      if (!q) return true;

      const haystack = [
        item.execution_number,
        item.project_name,
        item.module_name,
        item.scenario_number,
        item.test_case_number,
        item.test_case_name,
        item.browser,
        item.environment,
        item.executed_by_name,
        item.assigned_to_name,
        item.execution_status,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [executions, filters]);

  const stats = useMemo(() => {
    return {
      total: filteredItems.length,
      pass: filteredItems.filter((i) => i.execution_status === "Pass").length,
      fail: filteredItems.filter((i) => i.execution_status === "Fail").length,
      blocked: filteredItems.filter((i) => i.execution_status === "Blocked")
        .length,
    };
  }, [filteredItems]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const allVisibleIds = filteredItems.map((item) => item._id);
      const next = new Set(prev);
      const allSelected =
        allVisibleIds.length > 0 && allVisibleIds.every((id) => next.has(id));

      if (allSelected) {
        allVisibleIds.forEach((id) => next.delete(id));
      } else {
        allVisibleIds.forEach((id) => next.add(id));
      }

      return next;
    });
  }, [filteredItems]);

  const handleDeleteOne = useCallback(
    async (id) => {
      try {
        await axios.delete(API.deleteOne(id), { headers: authHeaders });

        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });

        await fetchExecutions(false);
        showToast("success", "Execution deleted successfully.");
      } catch (err) {
        console.error("Delete execution failed:", err);
        showToast(
          "error",
          err?.response?.data?.message || "Failed to delete execution.",
        );
      }
    },
    [API, authHeaders, fetchExecutions, showToast],
  );

  const handleBulkStatus = useCallback(async () => {
    if (!selectedCount) {
      showToast("error", "Select at least one execution.");
      return;
    }
    if (!bulkForm.execution_status) {
      showToast("error", "Select bulk execution status.");
      return;
    }

    try {
      setBulkBusy(true);
      await axios.post(
        API.bulkStatus,
        {
          ids: Array.from(selectedIds),
          execution_status: bulkForm.execution_status,
        },
        { headers: authHeaders },
      );
      clearSelection();
      await fetchExecutions(false);
      showToast("success", "Bulk status updated successfully.");
    } catch (err) {
      console.error("Bulk status update failed:", err);
      showToast(
        "error",
        err?.response?.data?.message || "Failed bulk status update.",
      );
    } finally {
      setBulkBusy(false);
    }
  }, [
    API.bulkStatus,
    authHeaders,
    bulkForm.execution_status,
    clearSelection,
    fetchExecutions,
    selectedCount,
    selectedIds,
    showToast,
  ]);

  const handleBulkAssign = useCallback(async () => {
    if (!selectedCount) {
      showToast("error", "Select at least one execution.");
      return;
    }
    if (!bulkForm.assigned_to && !bulkForm.assigned_to_name) {
      showToast("error", "Enter assignee id or assignee name.");
      return;
    }

    try {
      setBulkBusy(true);
      await axios.post(
        API.bulkAssign,
        {
          ids: Array.from(selectedIds),
          assigned_to: normalizeText(bulkForm.assigned_to) || null,
          assigned_to_name: normalizeText(bulkForm.assigned_to_name),
        },
        { headers: authHeaders },
      );
      clearSelection();
      await fetchExecutions(false);
      showToast("success", "Bulk assignment updated successfully.");
    } catch (err) {
      console.error("Bulk assign failed:", err);
      showToast(
        "error",
        err?.response?.data?.message || "Failed bulk assignment.",
      );
    } finally {
      setBulkBusy(false);
    }
  }, [
    API.bulkAssign,
    authHeaders,
    bulkForm.assigned_to,
    bulkForm.assigned_to_name,
    clearSelection,
    fetchExecutions,
    selectedCount,
    selectedIds,
    showToast,
  ]);

  const handleBulkLinkDefect = useCallback(async () => {
    if (!selectedCount) {
      showToast("error", "Select at least one execution.");
      return;
    }
    if (!bulkForm.defect_id && !bulkForm.bug_id) {
      showToast("error", "Enter defect id or bug id.");
      return;
    }

    try {
      setBulkBusy(true);
      await axios.post(
        API.bulkLinkDefect,
        {
          ids: Array.from(selectedIds),
          defect_id: normalizeText(bulkForm.defect_id) || null,
          bug_id: normalizeText(bulkForm.bug_id) || null,
        },
        { headers: authHeaders },
      );
      clearSelection();
      await fetchExecutions(false);
      showToast("success", "Bulk defect linking completed.");
    } catch (err) {
      console.error("Bulk link defect failed:", err);
      showToast(
        "error",
        err?.response?.data?.message || "Failed bulk defect linking.",
      );
    } finally {
      setBulkBusy(false);
    }
  }, [
    API.bulkLinkDefect,
    authHeaders,
    bulkForm.bug_id,
    bulkForm.defect_id,
    clearSelection,
    fetchExecutions,
    selectedCount,
    selectedIds,
    showToast,
  ]);

  const handleBulkDelete = useCallback(async () => {
    if (!selectedCount) {
      showToast("error", "Select at least one execution.");
      return;
    }

    try {
      setBulkBusy(true);
      await axios.post(
        API.bulkDelete,
        {
          ids: Array.from(selectedIds),
        },
        { headers: authHeaders },
      );
      clearSelection();
      await fetchExecutions(false);
      showToast("success", "Selected executions deleted successfully.");
    } catch (err) {
      console.error("Bulk delete failed:", err);
      showToast("error", err?.response?.data?.message || "Failed bulk delete.");
    } finally {
      setBulkBusy(false);
    }
  }, [
    API.bulkDelete,
    authHeaders,
    clearSelection,
    fetchExecutions,
    selectedCount,
    selectedIds,
    showToast,
  ]);

  const allVisibleSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => selectedIds.has(item._id));

  return (
    <div className="service-page-wrap min-h-screen">
      <Toast toast={toast} onClose={closeToast} />

      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="glass-card p-4 sm:p-5 lg:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="service-badge-heading">All test executions</p>
                  <p className="mt-2 text-sm text-slate-600">
                    View and manage test executions for{" "}
                    <span className="font-semibold text-slate-800">
                      {project?.name || "this project"}
                    </span>
                    .
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/single-project/${projectId}/add-test-execution`}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
                  >
                    <FaPlus className="mr-2" />
                    Add Test Execution
                  </Link>

                  <button
                    type="button"
                    onClick={() => fetchExecutions(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:opacity-60"
                  >
                    <FaSyncAlt className="mr-2" />
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <StatCard
                  icon={<FaClipboardList className="text-indigo-600" />}
                  label="Total"
                  value={stats.total}
                />
                <StatCard
                  icon={<FaProjectDiagram className="text-emerald-600" />}
                  label="Pass"
                  value={stats.pass}
                />
                <StatCard
                  icon={<FaBug className="text-rose-600" />}
                  label="Fail"
                  value={stats.fail}
                />
                <StatCard
                  icon={<FaLayerGroup className="text-amber-600" />}
                  label="Blocked"
                  value={stats.blocked}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                  <div>
                    <label className="form-label">
                      <span className="form-icon-badge">
                        <FaSearch className="text-[11px]" />
                      </span>
                      <span>Search</span>
                    </label>
                    <input
                      value={filters.q}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, q: e.target.value }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                      placeholder="Search execution, test case, browser..."
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <span className="form-icon-badge">
                        <FaFilter className="text-[11px]" />
                      </span>
                      <span>Status</span>
                    </label>
                    <select
                      value={filters.execution_status}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          execution_status: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                    >
                      <option value="">All statuses</option>
                      {EXECUTION_STATUS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">
                      <span className="form-icon-badge">
                        <FaDesktop className="text-[11px]" />
                      </span>
                      <span>Browser</span>
                    </label>
                    <input
                      value={filters.browser}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          browser: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                      placeholder="Chrome / Edge / Firefox"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <span className="form-icon-badge">
                        <FaDesktop className="text-[11px]" />
                      </span>
                      <span>Environment</span>
                    </label>
                    <input
                      value={filters.environment}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          environment: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                      placeholder="QA / UAT / Staging"
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={handleSelectAllVisible}
                        className="w-full inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {allVisibleSelected
                          ? "Unselect Visible"
                          : "Select Visible"}
                      </button>
                      <button
                        type="button"
                        onClick={clearSelection}
                        className="w-full inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">
                    Bulk actions ({selectedCount} selected)
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                  <div>
                    <label className="form-label">
                      <span className="form-icon-badge">
                        <FaClipboardList className="text-[11px]" />
                      </span>
                      <span>Bulk Status</span>
                    </label>
                    <select
                      value={bulkForm.execution_status}
                      onChange={(e) =>
                        setBulkForm((prev) => ({
                          ...prev,
                          execution_status: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                    >
                      <option value="">Select status</option>
                      {EXECUTION_STATUS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleBulkStatus}
                      disabled={bulkBusy}
                      className="mt-2 w-full inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Apply Status
                    </button>
                  </div>

                  <div>
                    <label className="form-label">
                      <span className="form-icon-badge">
                        <FaUser className="text-[11px]" />
                      </span>
                      <span>Assign To ID</span>
                    </label>
                    <input
                      value={bulkForm.assigned_to}
                      onChange={(e) =>
                        setBulkForm((prev) => ({
                          ...prev,
                          assigned_to: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                      placeholder="Optional assignee id"
                    />
                    <input
                      value={bulkForm.assigned_to_name}
                      onChange={(e) =>
                        setBulkForm((prev) => ({
                          ...prev,
                          assigned_to_name: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                      placeholder="Optional assignee name"
                    />
                    <button
                      type="button"
                      onClick={handleBulkAssign}
                      disabled={bulkBusy}
                      className="mt-2 w-full inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Assign Selected
                    </button>
                  </div>

                  <div>
                    <label className="form-label">
                      <span className="form-icon-badge">
                        <FaBug className="text-[11px]" />
                      </span>
                      <span>Defect / Bug Link</span>
                    </label>
                    <input
                      value={bulkForm.defect_id}
                      onChange={(e) =>
                        setBulkForm((prev) => ({
                          ...prev,
                          defect_id: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                      placeholder="Defect id"
                    />
                    <input
                      value={bulkForm.bug_id}
                      onChange={(e) =>
                        setBulkForm((prev) => ({
                          ...prev,
                          bug_id: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                      placeholder="Bug id"
                    />
                    <button
                      type="button"
                      onClick={handleBulkLinkDefect}
                      disabled={bulkBusy}
                      className="mt-2 w-full inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Link Selected
                    </button>
                  </div>

                  <div>
                    <label className="form-label">
                      <span className="form-icon-badge">
                        <FaTrashAlt className="text-[11px]" />
                      </span>
                      <span>Bulk Delete</span>
                    </label>
                    <div className="mt-2 rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-4 py-4 text-xs text-rose-700">
                      Deletes selected executions using your bulk delete API.
                    </div>
                    <button
                      type="button"
                      onClick={handleBulkDelete}
                      disabled={bulkBusy}
                      className="mt-2 w-full inline-flex items-center justify-center rounded-xl border border-rose-300 px-3 py-2.5 text-xs sm:text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                    Loading test executions...
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                    No test executions found for this project.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <ExecutionRow
                      key={item._id}
                      item={item}
                      checked={selectedIds.has(item._id)}
                      expanded={expandedIds.has(item._id)}
                      onToggleSelect={toggleSelect}
                      onToggleExpand={toggleExpand}
                      onDeleteOne={handleDeleteOne}
                    />
                  ))
                )}
              </div>

              <div className="mt-5 flex justify-end">
                <Link
                  to={`/single-project/${projectId}/add-test-execution`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
                >
                  Create Another
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

export default memo(AllTestExecutions);
