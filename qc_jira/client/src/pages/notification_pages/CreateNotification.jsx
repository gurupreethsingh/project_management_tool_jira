import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaPaperPlane,
  FaSync,
  FaFilter,
  FaUsers,
  FaUserTag,
  FaUser,
  FaFlag,
  FaBell,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const CreateNotification = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  const [mode, setMode] = useState("all"); // "all" | "role" | "user"
  const [receiverRole, setReceiverRole] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("low");
  const [type, setType] = useState("task_update");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const roleOptions = [
    "accountant",
    "admin",
    "alumni_relations",
    "business_analyst",
    "content_creator",
    "course_coordinator",
    "customer_support",
    "data_scientist",
    "dean",
    "department_head",
    "developer",
    "developer_lead",
    "event_coordinator",
    "exam_controller",
    "hr_manager",
    "intern",
    "legal_advisor",
    "librarian",
    "maintenance_staff",
    "marketing_manager",
    "operations_manager",
    "product_owner",
    "project_manager",
    "qa_lead",
    "recruiter",
    "registrar",
    "researcher",
    "sales_executive",
    "student",
    "superadmin",
    "support_engineer",
    "teacher",
    "tech_lead",
    "test_engineer",
    "test_lead",
    "user",
    "ux_ui_designer",
  ];
  const typeOptions = [
    "task_update",
    "bug_report",
    "comment",
    "reply",
    "alert",
  ];
  const priorityOptions = ["low", "medium", "high", "urgent"];

  const endpointForRole = (role) =>
    `${globalBackendRoute}/api/users/by-role/${role}`;

  const resetForm = () => {
    setMode("all");
    setReceiverRole("");
    setReceiver("");
    setMessage("");
    setPriority("low");
    setType("task_update");
    setUsers([]);
    setFetchError("");
    setStatusMsg("");
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setUsers([]);
      setReceiver("");
      setFetchError("");

      if (!(mode === "user" && receiverRole)) return;
      try {
        setLoadingUsers(true);
        const res = await axios.get(endpointForRole(receiverRole), {
          headers: authHeader,
        });
        const arr = Array.isArray(res?.data) ? res.data : [];
        if (!cancelled) setUsers(arr);
      } catch (err) {
        console.error("Fetch users failed:", err);
        if (!cancelled) {
          setUsers([]);
          setFetchError("Failed to load users for the selected role.");
        }
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [mode, receiverRole, authHeader]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");

    if (!authHeader) {
      setStatusMsg("You are not authenticated. Please sign in again.");
      return;
    }

    const trimmed = message.trim();
    if (trimmed.length < 3) {
      setStatusMsg("Please enter a meaningful message (min 3 characters).");
      return;
    }

    const basePayload = { message: trimmed, priority, type };

    try {
      setSubmitting(true);

      if (mode === "all") {
        await axios.post(
          `${globalBackendRoute}/api/send-notification-to-all-users`,
          basePayload,
          { headers: authHeader }
        );
        setStatusMsg("✅ Broadcast created (audience: all).");
      } else if (mode === "role") {
        if (!receiverRole) {
          setStatusMsg("Please select a receiver role.");
          return;
        }
        await axios.post(
          `${globalBackendRoute}/api/send-notification-to-all`,
          { ...basePayload, receiverRole },
          { headers: authHeader }
        );
        setStatusMsg(`✅ Broadcast created for role: ${receiverRole}.`);
      } else if (mode === "user") {
        if (!receiverRole || !receiver) {
          setStatusMsg("Please select role and user.");
          return;
        }
        await axios.post(
          `${globalBackendRoute}/api/send-notification-to-one`,
          { ...basePayload, receiver, receiverRole },
          { headers: authHeader }
        );
        setStatusMsg("✅ Notification created for selected user.");
      }

      setMessage("");
      setReceiver("");
      setReceiverRole("");
      setMode("all");
      setUsers([]);
    } catch (err) {
      console.error("Create notification failed:", err);
      const msg =
        err?.response?.data?.message || "Error creating notification.";
      setStatusMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            Create Notification
          </h3>

          <div className="flex items-center gap-4">
            <Link
              to="/all-notifications"
              className="text-xs text-indigo-600 hover:text-indigo-800 underline"
            >
              View All Notifications
            </Link>
            <Link
              to="/super-admin-dashboard"
              className="text-xs text-indigo-600 hover:text-indigo-800 underline"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border rounded-lg p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Audience Mode */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Audience
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center text-sm">
                  <input
                    type="radio"
                    name="mode"
                    value="all"
                    checked={mode === "all"}
                    onChange={() => setMode("all")}
                    className="mr-2"
                  />
                  <FaUsers className="mr-2 text-gray-500" />
                  All
                </label>
                <label className="inline-flex items-center text-sm">
                  <input
                    type="radio"
                    name="mode"
                    value="role"
                    checked={mode === "role"}
                    onChange={() => setMode("role")}
                    className="mr-2"
                  />
                  <FaUserTag className="mr-2 text-gray-500" />
                  Role
                </label>
                <label className="inline-flex items-center text-sm">
                  <input
                    type="radio"
                    name="mode"
                    value="user"
                    checked={mode === "user"}
                    onChange={() => setMode("user")}
                    className="mr-2"
                  />
                  <FaUser className="mr-2 text-gray-500" />
                  User
                </label>
              </div>
            </div>

            {/* Role */}
            {(mode === "role" || mode === "user") && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Receiver Role
                </label>
                <select
                  value={receiverRole}
                  onChange={(e) => setReceiverRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">-- Select Role --</option>
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* User */}
            {mode === "user" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Select User
                </label>
                <select
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  disabled={!receiverRole || loadingUsers}
                >
                  <option value="">
                    {loadingUsers
                      ? "Loading users..."
                      : !receiverRole
                      ? "Choose a role first"
                      : users.length === 0
                      ? "No users found"
                      : "-- Select User --"}
                  </option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                {fetchError && (
                  <p className="text-xs text-red-600 mt-1">{fetchError}</p>
                )}
              </div>
            )}

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Priority
              </label>
              <div className="relative">
                <FaFlag className="absolute left-3 top-2.5 text-gray-400" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                >
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Type
              </label>
              <div className="relative">
                <FaBell className="absolute left-3 top-2.5 text-gray-400" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset / Refresh */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
                title="Reset form"
              >
                <FaFilter className="mr-2" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  if (mode === "user" && receiverRole) {
                    const r = receiverRole;
                    setReceiverRole("");
                    setTimeout(() => setReceiverRole(r), 0);
                  }
                }}
                className="inline-flex items-center px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
                title="Refresh users list"
              >
                <FaSync
                  className={`mr-2 ${loadingUsers ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Composer */}
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg">
          <div className="p-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              maxLength={2000}
              className="w-full px-4 py-3 border rounded-md text-sm"
              placeholder="Write the notification message..."
            />
            <div className="mt-1 text-[11px] text-gray-500">
              {message.length}/2000 characters
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-xs text-gray-600">
              {mode === "all" && "Audience: All users"}
              {mode === "role" &&
                (receiverRole
                  ? `Audience: Role (${receiverRole})`
                  : "Audience: Role (select one)")}
              {mode === "user" &&
                (receiver
                  ? `Audience: User (${receiver})`
                  : "Audience: User (select role & user)")}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white ${
                submitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <FaPaperPlane className="mr-2" />
              {submitting ? "Sending..." : "Send Notification"}
            </button>
          </div>

          {statusMsg && (
            <div className="px-4 py-3 text-sm">
              <span className="font-semibold">Status:</span>{" "}
              <span>{statusMsg}</span>
            </div>
          )}
        </form>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Go Back
          </button>
          <Link
            to="/all-notifications"
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            View All Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateNotification;
