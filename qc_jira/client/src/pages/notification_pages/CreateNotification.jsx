// // src/pages/notification_pages/CreateNotification.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import globalBackendRoute from "../../config/Config";

// const CreateNotification = () => {
//   const [mode, setMode] = useState("all");
//   const [receiverRole, setReceiverRole] = useState("");
//   const [receiver, setReceiver] = useState("");
//   const [message, setMessage] = useState("");
//   const [priority, setPriority] = useState("low");
//   const [type, setType] = useState("task_update");

//   const [users, setUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [statusMsg, setStatusMsg] = useState("");
//   const [fetchError, setFetchError] = useState("");

//   const token = localStorage.getItem("token");
//   const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

//   const asUserArray = (payload) => (Array.isArray(payload) ? payload : []);

//   const endpointForRole = (role) =>
//     `${globalBackendRoute}/api/users/by-role/${role}`;

//   useEffect(() => {
//     let cancelled = false;
//     setUsers([]);
//     setReceiver("");
//     setFetchError("");

//     const fetchUsersForRole = async () => {
//       if (!(mode === "user" && receiverRole)) return;

//       try {
//         setLoadingUsers(true);
//         const res = await axios.get(endpointForRole(receiverRole), {
//           headers: authHeader,
//         });
//         const arr = asUserArray(res?.data);
//         if (!cancelled) setUsers(arr);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         if (!cancelled) {
//           setUsers([]);
//           setFetchError("Failed to load users for the selected role.");
//         }
//       } finally {
//         if (!cancelled) setLoadingUsers(false);
//       }
//     };

//     fetchUsersForRole();
//     return () => {
//       cancelled = true;
//     };
//   }, [mode, receiverRole, token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = { message, priority, type };

//     try {
//       if (mode === "all") {
//         await axios.post(
//           `${globalBackendRoute}/api/send-notification-to-all-users`,
//           payload,
//           { headers: authHeader }
//         );
//         setStatusMsg("Broadcast created (audience: all).");
//       } else if (mode === "role") {
//         await axios.post(
//           `${globalBackendRoute}/api/send-notification-to-all`,
//           { ...payload, receiverRole },
//           { headers: authHeader }
//         );
//         setStatusMsg(`Broadcast created for role: ${receiverRole}.`);
//       } else if (mode === "user") {
//         await axios.post(
//           `${globalBackendRoute}/api/send-notification-to-one`,
//           { ...payload, receiver, receiverRole },
//           { headers: authHeader }
//         );
//         setStatusMsg("Notification created for selected user.");
//       }

//       setMessage("");
//       setReceiver("");
//       setReceiverRole("");
//       setMode("all");
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.message || "Error creating notification.";
//       setStatusMsg(msg);
//     }
//   };

//   return (
//     <div className="py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
//           <h3 className="text-2xl font-bold text-indigo-600">
//             Create Notification
//           </h3>
//           <div className="flex space-x-4">
//             <Link to="/all-notifications" className="text-blue-500 underline">
//               View All Notifications
//             </Link>
//             <Link
//               to="/super-admin-dashboard"
//               className="text-blue-500 underline"
//             >
//               Dashboard
//             </Link>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border"
//         >
//           <div className="mb-4">
//             <label className="font-semibold text-gray-700 block mb-2">
//               Send To:
//             </label>
//             <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   checked={mode === "all"}
//                   onChange={() => setMode("all")}
//                   className="form-radio"
//                 />
//                 <span className="ml-2">All Users</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   checked={mode === "role"}
//                   onChange={() => setMode("role")}
//                   className="form-radio"
//                 />
//                 <span className="ml-2">All Users of a Role</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   checked={mode === "user"}
//                   onChange={() => setMode("user")}
//                   className="form-radio"
//                 />
//                 <span className="ml-2">Specific User</span>
//               </label>
//             </div>
//           </div>

//           {(mode === "role" || mode === "user") && (
//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Receiver Role *
//               </label>
//               <select
//                 value={receiverRole}
//                 onChange={(e) => setReceiverRole(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border rounded-md"
//               >
//                 <option value="">-- Select Role --</option>
//                 <option value="admin">Admin</option>
//                 <option value="superadmin">Superadmin</option>
//                 <option value="qa_lead">QA Lead</option>
//                 <option value="test_engineer">Test Engineer</option>
//                 <option value="developer">Developer</option>
//                 {/* add the rest of your roles as needed */}
//               </select>
//             </div>
//           )}

//           {mode === "user" && (
//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Select User *
//               </label>
//               <select
//                 value={receiver}
//                 onChange={(e) => setReceiver(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border rounded-md"
//                 disabled={!receiverRole || loadingUsers}
//               >
//                 <option value="">
//                   {loadingUsers
//                     ? "Loading users..."
//                     : !receiverRole
//                     ? "Choose a role first"
//                     : users.length === 0
//                     ? "No users found for this role"
//                     : "-- Select User --"}
//                 </option>
//                 {users.map((u) => (
//                   <option key={u._id} value={u._id}>
//                     {u.name} ({u.email})
//                   </option>
//                 ))}
//               </select>
//               {!loadingUsers && receiverRole && users.length === 0 && (
//                 <p className="text-sm text-gray-500 mt-1">
//                   No users found. Try a different role.
//                 </p>
//               )}
//               {fetchError && (
//                 <p className="text-sm text-red-600 mt-1">{fetchError}</p>
//               )}
//             </div>
//           )}

//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">
//               Message *
//             </label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               required
//               rows="4"
//               className="w-full px-4 py-2 border rounded-md"
//               placeholder="Enter your message..."
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">
//               Priority
//             </label>
//             <select
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//               <option value="urgent">Urgent</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">
//               Type
//             </label>
//             <select
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md"
//             >
//               <option value="task_update">Task Update</option>
//               <option value="bug_report">Bug Report</option>
//               <option value="comment">Comment</option>
//               <option value="reply">Reply</option>
//               <option value="alert">Alert</option>
//             </select>
//           </div>

//           <div className="mt-6">
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md"
//             >
//               Send Notification
//             </button>
//           </div>

//           {statusMsg && <div className="mt-4 font-semibold">{statusMsg}</div>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateNotification;

//

//

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

  /** =====================
   *  Auth
   *  ===================== */
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  /** =====================
   *  Form state
   *  ===================== */
  const [mode, setMode] = useState("all"); // "all" | "role" | "user"
  const [receiverRole, setReceiverRole] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("low");
  const [type, setType] = useState("task_update");

  /** =====================
   *  Users (for mode 'user')
   *  ===================== */
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [fetchError, setFetchError] = useState("");

  /** =====================
   *  UX State
   *  ===================== */
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  /** =====================
   *  Options
   *  ===================== */
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

  /** =====================
   *  Helpers
   *  ===================== */
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

  /** =====================
   *  Fetch users when: mode === 'user' and receiverRole selected
   *  ===================== */
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

  /** =====================
   *  Submit
   *  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authHeader) {
      setStatusMsg("You are not authenticated. Please sign in again.");
      return;
    }

    const basePayload = { message, priority, type };

    try {
      setSubmitting(true);
      setStatusMsg("");

      if (mode === "all") {
        await axios.post(
          `${globalBackendRoute}/api/send-notification-to-all-users`,
          basePayload,
          { headers: authHeader }
        );
        setStatusMsg("Broadcast created (audience: all).");
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
        setStatusMsg(`Broadcast created for role: ${receiverRole}.`);
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
        setStatusMsg("Notification created for selected user.");
      }

      // Clear fields after success
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

  /** =====================
   *  Page
   *  ===================== */
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header (similar structure) */}
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

        {/* Controls Bar (styled like filters bar) */}
        <div className="bg-white border rounded-lg p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Mode */}
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

            {/* Receiver Role (role/user) */}
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

            {/* Specific User (user) */}
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

            {/* Actions: Reset / Refresh (refresh just re-fetches users if needed) */}
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
                  // only useful if mode === 'user' and role chosen
                  if (mode === "user" && receiverRole) {
                    // trigger re-fetch by toggling role quickly
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

        {/* Composer Card (message + submit) */}
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
              className="w-full px-4 py-3 border rounded-md text-sm"
              placeholder="Write the notification message..."
            />
            <div className="mt-1 text-[11px] text-gray-500">
              {message.length} characters
            </div>
          </div>

          {/* Footer with primary action */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-xs text-gray-600">
              {mode === "all" && "Audience: All users"}
              {mode === "role" &&
                receiverRole &&
                `Audience: Role (${receiverRole})`}
              {mode === "role" &&
                !receiverRole &&
                "Audience: Role (select one)"}
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

        {/* Back / View actions */}
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
