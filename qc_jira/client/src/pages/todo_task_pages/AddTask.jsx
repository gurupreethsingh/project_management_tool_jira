// // // import React, { useState } from "react";
// // // import axios from "axios";
// // // import globalBackendRoute from "../../config/Config";
// // // import {
// // //   FaArrowRight,
// // //   FaCalendarAlt,
// // //   FaRegUser,
// // //   FaInfoCircle,
// // // } from "react-icons/fa";

// // // export default function AddTask() {
// // //   const [title, setTitle] = useState("");
// // //   const [details, setDetails] = useState("");
// // //   const [reportTo, setReportTo] = useState("");
// // //   const [startAt, setStartAt] = useState("");
// // //   const [dueAt, setDueAt] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const [msg, setMsg] = useState({ type: "", text: "" });

// // //   const reset = () => {
// // //     setTitle("");
// // //     setDetails("");
// // //     setReportTo("");
// // //     setStartAt("");
// // //     setDueAt("");
// // //     setMsg({ type: "", text: "" });
// // //   };

// // //   const submit = async (e) => {
// // //     e.preventDefault();
// // //     setMsg({ type: "", text: "" });

// // //     if (!title.trim()) {
// // //       setMsg({ type: "error", text: "Task title is required." });
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);

// // //       // ✅ Get token from localStorage (same as your existing modules)
// // //       const token = localStorage.getItem("token");

// // //       await axios.post(
// // //         `${globalBackendRoute}/api/todos/create-tak`,
// // //         {
// // //           title: title.trim(),
// // //           details: details?.trim() || "",
// // //           reportTo: reportTo?.trim() || "",
// // //           startAt: startAt ? new Date(startAt).toISOString() : null,
// // //           dueAt: dueAt ? new Date(dueAt).toISOString() : null,
// // //           status: "NEW",
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`, // ✅ THIS FIXES 401
// // //           },
// // //         },
// // //       );

// // //       setMsg({ type: "success", text: "Task created successfully." });

// // //       reset();
// // //     } catch (err) {
// // //       setMsg({
// // //         type: "error",
// // //         text: err?.response?.data?.message || "Failed to create task.",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="bg-white text-slate-900">
// // //       <section className="relative overflow-hidden">
// // //         <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
// // //         <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

// // //         <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
// // //           <h1 className="text-3xl font-semibold text-slate-900">
// // //             Add Task
// // //             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
// // //               Personal To-Do Module
// // //             </span>
// // //           </h1>

// // //           <div className="mt-8 max-w-full">
// // //             <form
// // //               onSubmit={submit}
// // //               className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 sm:p-8"
// // //             >
// // //               {msg.text && (
// // //                 <div
// // //                   className={`mb-4 rounded-xl border p-4 flex gap-3 ${
// // //                     msg.type === "success"
// // //                       ? "border-emerald-200 bg-emerald-50 text-emerald-800"
// // //                       : "border-rose-200 bg-rose-50 text-rose-800"
// // //                   }`}
// // //                 >
// // //                   <FaInfoCircle className="mt-1" />
// // //                   <span>{msg.text}</span>
// // //                 </div>
// // //               )}

// // //               <label className="text-xs font-semibold text-slate-700">
// // //                 <div className="flex items-center ">
// // //                   <span>Task Title *</span>
// // //                   <div>
// // //                     <a>View All ToDo List</a>
// // //                   </div>
// // //                 </div>
// // //               </label>
// // //               <input
// // //                 value={title}
// // //                 onChange={(e) => setTitle(e.target.value)}
// // //                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // //                 placeholder="Eg: Complete project documentation"
// // //               />

// // //               <label className="block mt-4 text-xs font-semibold text-slate-700">
// // //                 Task Details
// // //               </label>
// // //               <textarea
// // //                 value={details}
// // //                 onChange={(e) => setDetails(e.target.value)}
// // //                 rows={4}
// // //                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // //                 placeholder="Extra notes..."
// // //               />

// // //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
// // //                 <div>
// // //                   <label className="text-xs font-semibold text-slate-700">
// // //                     Report To
// // //                   </label>
// // //                   <input
// // //                     value={reportTo}
// // //                     onChange={(e) => setReportTo(e.target.value)}
// // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // //                     placeholder="Manager name"
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label className="text-xs font-semibold text-slate-700">
// // //                     Start Date
// // //                   </label>
// // //                   <input
// // //                     type="datetime-local"
// // //                     value={startAt}
// // //                     onChange={(e) => setStartAt(e.target.value)}
// // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label className="text-xs font-semibold text-slate-700">
// // //                     Due Date
// // //                   </label>
// // //                   <input
// // //                     type="datetime-local"
// // //                     value={dueAt}
// // //                     onChange={(e) => setDueAt(e.target.value)}
// // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="mt-6 flex gap-3">
// // //                 <button
// // //                   disabled={loading}
// // //                   className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium"
// // //                 >
// // //                   {loading ? "Creating..." : "Create Task"}
// // //                   <FaArrowRight className="inline ml-2 text-xs" />
// // //                 </button>

// // //                 <button
// // //                   type="button"
// // //                   onClick={reset}
// // //                   className="px-6 py-3 rounded-xl border border-slate-300"
// // //                 >
// // //                   Reset
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       </section>
// // //     </div>
// // //   );
// // // }

// // import React, { useState } from "react";
// // import axios from "axios";
// // import globalBackendRoute from "../../config/Config";
// // import { Link } from "react-router-dom";
// // import {
// //   FaArrowRight,
// //   FaCalendarAlt,
// //   FaRegUser,
// //   FaInfoCircle,
// // } from "react-icons/fa";

// // export default function AddTask() {
// //   const [title, setTitle] = useState("");
// //   const [details, setDetails] = useState("");
// //   const [reportTo, setReportTo] = useState("");
// //   const [startAt, setStartAt] = useState("");
// //   const [dueAt, setDueAt] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [msg, setMsg] = useState({ type: "", text: "" });

// //   const reset = () => {
// //     setTitle("");
// //     setDetails("");
// //     setReportTo("");
// //     setStartAt("");
// //     setDueAt("");
// //     setMsg({ type: "", text: "" });
// //   };

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setMsg({ type: "", text: "" });

// //     if (!title.trim()) {
// //       setMsg({ type: "error", text: "Task title is required." });
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       // ✅ Get token from localStorage (same as your existing modules)
// //       const token = localStorage.getItem("token");

// //       await axios.post(
// //         `${globalBackendRoute}/api/todos/create-tak`,
// //         {
// //           title: title.trim(),
// //           details: details?.trim() || "",
// //           reportTo: reportTo?.trim() || "",
// //           startAt: startAt ? new Date(startAt).toISOString() : null,
// //           dueAt: dueAt ? new Date(dueAt).toISOString() : null,
// //           status: "NEW",
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`, // ✅ THIS FIXES 401
// //           },
// //         },
// //       );

// //       setMsg({ type: "success", text: "Task created successfully." });
// //       reset();
// //     } catch (err) {
// //       setMsg({
// //         type: "error",
// //         text: err?.response?.data?.message || "Failed to create task.",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="bg-white text-slate-900">
// //       <section className="relative overflow-hidden">
// //         <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
// //         <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

// //         <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
// //           <h1 className="text-3xl font-semibold text-slate-900">
// //             Add Task
// //             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
// //               Personal To-Do Module
// //             </span>
// //           </h1>

// //           <div className="mt-8 max-w-full">
// //             <form
// //               onSubmit={submit}
// //               className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 sm:p-8"
// //             >
// //               {msg.text && (
// //                 <div
// //                   className={`mb-4 rounded-xl border p-4 flex gap-3 ${
// //                     msg.type === "success"
// //                       ? "border-emerald-200 bg-emerald-50 text-emerald-800"
// //                       : "border-rose-200 bg-rose-50 text-rose-800"
// //                   }`}
// //                 >
// //                   <FaInfoCircle className="mt-1" />
// //                   <span>{msg.text}</span>
// //                 </div>
// //               )}

// //               {/* ✅ FIXED: same line + justify-between + route link */}
// //               <label className="block text-xs font-semibold text-slate-700">
// //                 <div className="flex items-center justify-between gap-3">
// //                   <span>Task Title *</span>

// //                   <Link
// //                     to="/view-all-todo-list"
// //                     className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
// //                   >
// //                     View All ToDo List
// //                   </Link>
// //                 </div>
// //               </label>

// //               <input
// //                 value={title}
// //                 onChange={(e) => setTitle(e.target.value)}
// //                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// //                 placeholder="Eg: Complete project documentation"
// //               />

// //               <label className="block mt-4 text-xs font-semibold text-slate-700">
// //                 Task Details
// //               </label>
// //               <textarea
// //                 value={details}
// //                 onChange={(e) => setDetails(e.target.value)}
// //                 rows={4}
// //                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// //                 placeholder="Extra notes..."
// //               />

// //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
// //                 <div>
// //                   <label className="text-xs font-semibold text-slate-700">
// //                     Report To
// //                   </label>
// //                   <input
// //                     value={reportTo}
// //                     onChange={(e) => setReportTo(e.target.value)}
// //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// //                     placeholder="Manager name"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="text-xs font-semibold text-slate-700">
// //                     Start Date
// //                   </label>
// //                   <input
// //                     type="datetime-local"
// //                     value={startAt}
// //                     onChange={(e) => setStartAt(e.target.value)}
// //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="text-xs font-semibold text-slate-700">
// //                     Due Date
// //                   </label>
// //                   <input
// //                     type="datetime-local"
// //                     value={dueAt}
// //                     onChange={(e) => setDueAt(e.target.value)}
// //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="mt-6 flex gap-3">
// //                 <button
// //                   disabled={loading}
// //                   className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium"
// //                 >
// //                   {loading ? "Creating..." : "Create Task"}
// //                   <FaArrowRight className="inline ml-2 text-xs" />
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={reset}
// //                   className="px-6 py-3 rounded-xl border border-slate-300"
// //                 >
// //                   Reset
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";
// import { Link } from "react-router-dom";
// import { FaArrowRight, FaInfoCircle } from "react-icons/fa";

// export default function AddTask() {
//   const [title, setTitle] = useState("");
//   const [details, setDetails] = useState("");
//   const [reportTo, setReportTo] = useState("");
//   const [startAt, setStartAt] = useState("");
//   const [dueAt, setDueAt] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState({ type: "", text: "" });

//   const reset = () => {
//     setTitle("");
//     setDetails("");
//     setReportTo("");
//     setStartAt("");
//     setDueAt("");
//     setMsg({ type: "", text: "" });
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setMsg({ type: "", text: "" });

//     if (!title.trim()) {
//       setMsg({ type: "error", text: "Task title is required." });
//       return;
//     }

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       await axios.post(
//         `${globalBackendRoute}/api/todos/create-tak`,
//         {
//           title: title.trim(),
//           details: details?.trim() || "",
//           reportTo: reportTo?.trim() || "",
//           startAt: startAt ? new Date(startAt).toISOString() : null,
//           dueAt: dueAt ? new Date(dueAt).toISOString() : null,
//           status: "NEW",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       setMsg({ type: "success", text: "Task created successfully." });
//       reset();
//     } catch (err) {
//       setMsg({
//         type: "error",
//         text: err?.response?.data?.message || "Failed to create task.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white text-slate-900">
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
//         <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

//         <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
//           <h1 className="text-3xl font-semibold text-slate-900">
//             Add Task
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
//               Personal To-Do Module
//             </span>
//           </h1>

//           <div className="mt-8 max-w-full">
//             <form
//               onSubmit={submit}
//               className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 sm:p-8"
//             >
//               {msg.text && (
//                 <div
//                   className={`mb-4 rounded-xl border p-4 flex gap-3 ${
//                     msg.type === "success"
//                       ? "border-emerald-200 bg-emerald-50 text-emerald-800"
//                       : "border-rose-200 bg-rose-50 text-rose-800"
//                   }`}
//                 >
//                   <FaInfoCircle className="mt-1" />
//                   <span>{msg.text}</span>
//                 </div>
//               )}

//               {/* ✅ FIXED: same line + justify-between + clickable route */}
//               <label className="block text-xs font-semibold text-slate-700">
//                 <div className="flex items-center justify-between gap-3">
//                   <span>Task Title *</span>

//                   <Link
//                     to="/view-all-todo-list"
//                     className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
//                   >
//                     View All ToDo List
//                   </Link>
//                 </div>
//               </label>

//               <input
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
//                 placeholder="Eg: Complete project documentation"
//               />

//               <label className="block mt-4 text-xs font-semibold text-slate-700">
//                 Task Details
//               </label>
//               <textarea
//                 value={details}
//                 onChange={(e) => setDetails(e.target.value)}
//                 rows={4}
//                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
//                 placeholder="Extra notes..."
//               />

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700">
//                     Report To
//                   </label>
//                   <input
//                     value={reportTo}
//                     onChange={(e) => setReportTo(e.target.value)}
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
//                     placeholder="Manager name"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs font-semibold text-slate-700">
//                     Start Date
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={startAt}
//                     onChange={(e) => setStartAt(e.target.value)}
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs font-semibold text-slate-700">
//                     Due Date
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={dueAt}
//                     onChange={(e) => setDueAt(e.target.value)}
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 flex gap-3">
//                 <button
//                   disabled={loading}
//                   className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium"
//                 >
//                   {loading ? "Creating..." : "Create Task"}
//                   <FaArrowRight className="inline ml-2 text-xs" />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={reset}
//                   className="px-6 py-3 rounded-xl border border-slate-300"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// ✅ AddTask.jsx (FULL FILE)
// Changes:
// 1) Start/Due inputs are DATE only (no time)
// 2) Convert YYYY-MM-DD -> ISO at LOCAL midnight (stable)
// 3) Everything else unchanged

import React, { useState } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { Link } from "react-router-dom";
import { FaArrowRight, FaInfoCircle } from "react-icons/fa";

// ✅ Convert "YYYY-MM-DD" to ISO at local midnight (prevents timezone shifts)
function dateOnlyToISO(ymd) {
  if (!ymd) return null;
  const [y, m, d] = String(ymd).split("-").map(Number);
  if (!y || !m || !d) return null;
  const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
  return localMidnight.toISOString();
}

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [reportTo, setReportTo] = useState("");

  // ✅ date-only strings (YYYY-MM-DD)
  const [startAt, setStartAt] = useState("");
  const [dueAt, setDueAt] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const reset = () => {
    setTitle("");
    setDetails("");
    setReportTo("");
    setStartAt("");
    setDueAt("");
    setMsg({ type: "", text: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!title.trim()) {
      setMsg({ type: "error", text: "Task title is required." });
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("ecoders_token");

      await axios.post(
        `${globalBackendRoute}/api/todos/create-tak`,
        {
          title: title.trim(),
          details: details?.trim() || "",
          reportTo: reportTo?.trim() || "",

          // ✅ ISO at local midnight
          startAt: startAt ? dateOnlyToISO(startAt) : null,
          dueAt: dueAt ? dateOnlyToISO(dueAt) : null,

          status: "NEW",
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      setMsg({ type: "success", text: "Task created successfully." });
      reset();
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || "Failed to create task.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <h1 className="text-3xl font-semibold text-slate-900">
            Add Task
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Personal To-Do Module
            </span>
          </h1>

          <div className="mt-8 max-w-full">
            <form
              onSubmit={submit}
              className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 sm:p-8"
            >
              {msg.text && (
                <div
                  className={`mb-4 rounded-xl border p-4 flex gap-3 ${
                    msg.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  <FaInfoCircle className="mt-1" />
                  <span>{msg.text}</span>
                </div>
              )}

              <label className="block text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <span>Task Title *</span>

                  <Link
                    to="/view-all-todo-list"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    View All ToDo List
                  </Link>
                </div>
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                placeholder="Eg: Complete project documentation"
              />

              <label className="block mt-4 text-xs font-semibold text-slate-700">
                Task Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                placeholder="Extra notes..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Report To
                  </label>
                  <input
                    value={reportTo}
                    onChange={(e) => setReportTo(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                    placeholder="Manager name"
                  />
                </div>

                {/* ✅ DATE ONLY */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                  />
                </div>

                {/* ✅ DATE ONLY */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium"
                >
                  {loading ? "Creating..." : "Create Task"}
                  <FaArrowRight className="inline ml-2 text-xs" />
                </button>

                <button
                  type="button"
                  onClick={reset}
                  className="px-6 py-3 rounded-xl border border-slate-300"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
