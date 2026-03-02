// // // // // import React, { useState } from "react";
// // // // // import axios from "axios";
// // // // // import globalBackendRoute from "../../config/Config";
// // // // // import {
// // // // //   FaArrowRight,
// // // // //   FaCalendarAlt,
// // // // //   FaRegUser,
// // // // //   FaInfoCircle,
// // // // // } from "react-icons/fa";

// // // // // export default function AddTask() {
// // // // //   const [title, setTitle] = useState("");
// // // // //   const [details, setDetails] = useState("");
// // // // //   const [reportTo, setReportTo] = useState("");
// // // // //   const [startAt, setStartAt] = useState("");
// // // // //   const [dueAt, setDueAt] = useState("");
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [msg, setMsg] = useState({ type: "", text: "" });

// // // // //   const reset = () => {
// // // // //     setTitle("");
// // // // //     setDetails("");
// // // // //     setReportTo("");
// // // // //     setStartAt("");
// // // // //     setDueAt("");
// // // // //     setMsg({ type: "", text: "" });
// // // // //   };

// // // // //   const submit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     setMsg({ type: "", text: "" });

// // // // //     if (!title.trim()) {
// // // // //       setMsg({ type: "error", text: "Task title is required." });
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setLoading(true);

// // // // //       // ✅ Get token from localStorage (same as your existing modules)
// // // // //       const token = localStorage.getItem("token");

// // // // //       await axios.post(
// // // // //         `${globalBackendRoute}/api/todos/create-tak`,
// // // // //         {
// // // // //           title: title.trim(),
// // // // //           details: details?.trim() || "",
// // // // //           reportTo: reportTo?.trim() || "",
// // // // //           startAt: startAt ? new Date(startAt).toISOString() : null,
// // // // //           dueAt: dueAt ? new Date(dueAt).toISOString() : null,
// // // // //           status: "NEW",
// // // // //         },
// // // // //         {
// // // // //           headers: {
// // // // //             Authorization: `Bearer ${token}`, // ✅ THIS FIXES 401
// // // // //           },
// // // // //         },
// // // // //       );

// // // // //       setMsg({ type: "success", text: "Task created successfully." });

// // // // //       reset();
// // // // //     } catch (err) {
// // // // //       setMsg({
// // // // //         type: "error",
// // // // //         text: err?.response?.data?.message || "Failed to create task.",
// // // // //       });
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="bg-white text-slate-900">
// // // // //       <section className="relative overflow-hidden">
// // // // //         <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
// // // // //         <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

// // // // //         <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
// // // // //           <h1 className="text-3xl font-semibold text-slate-900">
// // // // //             Add Task
// // // // //             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
// // // // //               Personal To-Do Module
// // // // //             </span>
// // // // //           </h1>

// // // // //           <div className="mt-8 max-w-full">
// // // // //             <form
// // // // //               onSubmit={submit}
// // // // //               className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 sm:p-8"
// // // // //             >
// // // // //               {msg.text && (
// // // // //                 <div
// // // // //                   className={`mb-4 rounded-xl border p-4 flex gap-3 ${
// // // // //                     msg.type === "success"
// // // // //                       ? "border-emerald-200 bg-emerald-50 text-emerald-800"
// // // // //                       : "border-rose-200 bg-rose-50 text-rose-800"
// // // // //                   }`}
// // // // //                 >
// // // // //                   <FaInfoCircle className="mt-1" />
// // // // //                   <span>{msg.text}</span>
// // // // //                 </div>
// // // // //               )}

// // // // //               <label className="text-xs font-semibold text-slate-700">
// // // // //                 <div className="flex items-center ">
// // // // //                   <span>Task Title *</span>
// // // // //                   <div>
// // // // //                     <a>View All ToDo List</a>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </label>
// // // // //               <input
// // // // //                 value={title}
// // // // //                 onChange={(e) => setTitle(e.target.value)}
// // // // //                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // // //                 placeholder="Eg: Complete project documentation"
// // // // //               />

// // // // //               <label className="block mt-4 text-xs font-semibold text-slate-700">
// // // // //                 Task Details
// // // // //               </label>
// // // // //               <textarea
// // // // //                 value={details}
// // // // //                 onChange={(e) => setDetails(e.target.value)}
// // // // //                 rows={4}
// // // // //                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // // //                 placeholder="Extra notes..."
// // // // //               />

// // // // //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
// // // // //                 <div>
// // // // //                   <label className="text-xs font-semibold text-slate-700">
// // // // //                     Report To
// // // // //                   </label>
// // // // //                   <input
// // // // //                     value={reportTo}
// // // // //                     onChange={(e) => setReportTo(e.target.value)}
// // // // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // // //                     placeholder="Manager name"
// // // // //                   />
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="text-xs font-semibold text-slate-700">
// // // // //                     Start Date
// // // // //                   </label>
// // // // //                   <input
// // // // //                     type="datetime-local"
// // // // //                     value={startAt}
// // // // //                     onChange={(e) => setStartAt(e.target.value)}
// // // // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // // //                   />
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="text-xs font-semibold text-slate-700">
// // // // //                     Due Date
// // // // //                   </label>
// // // // //                   <input
// // // // //                     type="datetime-local"
// // // // //                     value={dueAt}
// // // // //                     onChange={(e) => setDueAt(e.target.value)}
// // // // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // // //                   />
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="mt-6 flex gap-3">
// // // // //                 <button
// // // // //                   disabled={loading}
// // // // //                   className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium"
// // // // //                 >
// // // // //                   {loading ? "Creating..." : "Create Task"}
// // // // //                   <FaArrowRight className="inline ml-2 text-xs" />
// // // // //                 </button>

// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={reset}
// // // // //                   className="px-6 py-3 rounded-xl border border-slate-300"
// // // // //                 >
// // // // //                   Reset
// // // // //                 </button>
// // // // //               </div>
// // // // //             </form>
// // // // //           </div>
// // // // //         </div>
// // // // //       </section>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // import React, { useState } from "react";
// // // // import axios from "axios";
// // // // import globalBackendRoute from "../../config/Config";
// // // // import { Link } from "react-router-dom";
// // // // import {
// // // //   FaArrowRight,
// // // //   FaCalendarAlt,
// // // //   FaRegUser,
// // // //   FaInfoCircle,
// // // // } from "react-icons/fa";

// // // // export default function AddTask() {
// // // //   const [title, setTitle] = useState("");
// // // //   const [details, setDetails] = useState("");
// // // //   const [reportTo, setReportTo] = useState("");
// // // //   const [startAt, setStartAt] = useState("");
// // // //   const [dueAt, setDueAt] = useState("");
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [msg, setMsg] = useState({ type: "", text: "" });

// // // //   const reset = () => {
// // // //     setTitle("");
// // // //     setDetails("");
// // // //     setReportTo("");
// // // //     setStartAt("");
// // // //     setDueAt("");
// // // //     setMsg({ type: "", text: "" });
// // // //   };

// // // //   const submit = async (e) => {
// // // //     e.preventDefault();
// // // //     setMsg({ type: "", text: "" });

// // // //     if (!title.trim()) {
// // // //       setMsg({ type: "error", text: "Task title is required." });
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setLoading(true);

// // // //       // ✅ Get token from localStorage (same as your existing modules)
// // // //       const token = localStorage.getItem("token");

// // // //       await axios.post(
// // // //         `${globalBackendRoute}/api/todos/create-tak`,
// // // //         {
// // // //           title: title.trim(),
// // // //           details: details?.trim() || "",
// // // //           reportTo: reportTo?.trim() || "",
// // // //           startAt: startAt ? new Date(startAt).toISOString() : null,
// // // //           dueAt: dueAt ? new Date(dueAt).toISOString() : null,
// // // //           status: "NEW",
// // // //         },
// // // //         {
// // // //           headers: {
// // // //             Authorization: `Bearer ${token}`, // ✅ THIS FIXES 401
// // // //           },
// // // //         },
// // // //       );

// // // //       setMsg({ type: "success", text: "Task created successfully." });
// // // //       reset();
// // // //     } catch (err) {
// // // //       setMsg({
// // // //         type: "error",
// // // //         text: err?.response?.data?.message || "Failed to create task.",
// // // //       });
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="bg-white text-slate-900">
// // // //       <section className="relative overflow-hidden">
// // // //         <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
// // // //         <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

// // // //         <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
// // // //           <h1 className="text-3xl font-semibold text-slate-900">
// // // //             Add Task
// // // //             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
// // // //               Personal To-Do Module
// // // //             </span>
// // // //           </h1>

// // // //           <div className="mt-8 max-w-full">
// // // //             <form
// // // //               onSubmit={submit}
// // // //               className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 sm:p-8"
// // // //             >
// // // //               {msg.text && (
// // // //                 <div
// // // //                   className={`mb-4 rounded-xl border p-4 flex gap-3 ${
// // // //                     msg.type === "success"
// // // //                       ? "border-emerald-200 bg-emerald-50 text-emerald-800"
// // // //                       : "border-rose-200 bg-rose-50 text-rose-800"
// // // //                   }`}
// // // //                 >
// // // //                   <FaInfoCircle className="mt-1" />
// // // //                   <span>{msg.text}</span>
// // // //                 </div>
// // // //               )}

// // // //               {/* ✅ FIXED: same line + justify-between + route link */}
// // // //               <label className="block text-xs font-semibold text-slate-700">
// // // //                 <div className="flex items-center justify-between gap-3">
// // // //                   <span>Task Title *</span>

// // // //                   <Link
// // // //                     to="/view-all-todo-list"
// // // //                     className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
// // // //                   >
// // // //                     View All ToDo List
// // // //                   </Link>
// // // //                 </div>
// // // //               </label>

// // // //               <input
// // // //                 value={title}
// // // //                 onChange={(e) => setTitle(e.target.value)}
// // // //                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // //                 placeholder="Eg: Complete project documentation"
// // // //               />

// // // //               <label className="block mt-4 text-xs font-semibold text-slate-700">
// // // //                 Task Details
// // // //               </label>
// // // //               <textarea
// // // //                 value={details}
// // // //                 onChange={(e) => setDetails(e.target.value)}
// // // //                 rows={4}
// // // //                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // //                 placeholder="Extra notes..."
// // // //               />

// // // //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
// // // //                 <div>
// // // //                   <label className="text-xs font-semibold text-slate-700">
// // // //                     Report To
// // // //                   </label>
// // // //                   <input
// // // //                     value={reportTo}
// // // //                     onChange={(e) => setReportTo(e.target.value)}
// // // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // //                     placeholder="Manager name"
// // // //                   />
// // // //                 </div>

// // // //                 <div>
// // // //                   <label className="text-xs font-semibold text-slate-700">
// // // //                     Start Date
// // // //                   </label>
// // // //                   <input
// // // //                     type="datetime-local"
// // // //                     value={startAt}
// // // //                     onChange={(e) => setStartAt(e.target.value)}
// // // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // //                   />
// // // //                 </div>

// // // //                 <div>
// // // //                   <label className="text-xs font-semibold text-slate-700">
// // // //                     Due Date
// // // //                   </label>
// // // //                   <input
// // // //                     type="datetime-local"
// // // //                     value={dueAt}
// // // //                     onChange={(e) => setDueAt(e.target.value)}
// // // //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               <div className="mt-6 flex gap-3">
// // // //                 <button
// // // //                   disabled={loading}
// // // //                   className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium"
// // // //                 >
// // // //                   {loading ? "Creating..." : "Create Task"}
// // // //                   <FaArrowRight className="inline ml-2 text-xs" />
// // // //                 </button>

// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={reset}
// // // //                   className="px-6 py-3 rounded-xl border border-slate-300"
// // // //                 >
// // // //                   Reset
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       </section>
// // // //     </div>
// // // //   );
// // // // }

// // // import React, { useState } from "react";
// // // import axios from "axios";
// // // import globalBackendRoute from "../../config/Config";
// // // import { Link } from "react-router-dom";
// // // import { FaArrowRight, FaInfoCircle } from "react-icons/fa";

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
// // //             Authorization: `Bearer ${token}`,
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

// // //               {/* ✅ FIXED: same line + justify-between + clickable route */}
// // //               <label className="block text-xs font-semibold text-slate-700">
// // //                 <div className="flex items-center justify-between gap-3">
// // //                   <span>Task Title *</span>

// // //                   <Link
// // //                     to="/view-all-todo-list"
// // //                     className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
// // //                   >
// // //                     View All ToDo List
// // //                   </Link>
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

// // // ✅ AddTask.jsx (FULL FILE)
// // // Changes:
// // // 1) Start/Due inputs are DATE only (no time)
// // // 2) Convert YYYY-MM-DD -> ISO at LOCAL midnight (stable)
// // // 3) Everything else unchanged

// // import React, { useState } from "react";
// // import axios from "axios";
// // import globalBackendRoute from "../../config/Config";
// // import { Link } from "react-router-dom";
// // import { FaArrowRight, FaInfoCircle } from "react-icons/fa";

// // // ✅ Convert "YYYY-MM-DD" to ISO at local midnight (prevents timezone shifts)
// // function dateOnlyToISO(ymd) {
// //   if (!ymd) return null;
// //   const [y, m, d] = String(ymd).split("-").map(Number);
// //   if (!y || !m || !d) return null;
// //   const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
// //   return localMidnight.toISOString();
// // }

// // export default function AddTask() {
// //   const [title, setTitle] = useState("");
// //   const [details, setDetails] = useState("");
// //   const [reportTo, setReportTo] = useState("");

// //   // ✅ date-only strings (YYYY-MM-DD)
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

// //       const token =
// //         localStorage.getItem("token") ||
// //         localStorage.getItem("authToken") ||
// //         localStorage.getItem("ecoders_token");

// //       await axios.post(
// //         `${globalBackendRoute}/api/todos/create-tak`,
// //         {
// //           title: title.trim(),
// //           details: details?.trim() || "",
// //           reportTo: reportTo?.trim() || "",

// //           // ✅ ISO at local midnight
// //           startAt: startAt ? dateOnlyToISO(startAt) : null,
// //           dueAt: dueAt ? dateOnlyToISO(dueAt) : null,

// //           status: "NEW",
// //         },
// //         {
// //           headers: token ? { Authorization: `Bearer ${token}` } : {},
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
// //         <div className="absolute inset-0 " />
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

// //                 {/* ✅ DATE ONLY */}
// //                 <div>
// //                   <label className="text-xs font-semibold text-slate-700">
// //                     Start Date
// //                   </label>
// //                   <input
// //                     type="date"
// //                     value={startAt}
// //                     onChange={(e) => setStartAt(e.target.value)}
// //                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
// //                   />
// //                 </div>

// //                 {/* ✅ DATE ONLY */}
// //                 <div>
// //                   <label className="text-xs font-semibold text-slate-700">
// //                     Due Date
// //                   </label>
// //                   <input
// //                     type="date"
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

// // with toast messages.

// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";
// import { Link } from "react-router-dom";
// import { FaArrowRight, FaInfoCircle, FaTimes } from "react-icons/fa";

// // ✅ Convert "YYYY-MM-DD" to ISO at local midnight (prevents timezone shifts)
// function dateOnlyToISO(ymd) {
//   if (!ymd) return null;
//   const [y, m, d] = String(ymd).split("-").map(Number);
//   if (!y || !m || !d) return null;
//   const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
//   return localMidnight.toISOString();
// }

// export default function AddTask() {
//   const [title, setTitle] = useState("");
//   const [details, setDetails] = useState("");
//   const [reportTo, setReportTo] = useState("");

//   // ✅ date-only strings (YYYY-MM-DD)
//   const [startAt, setStartAt] = useState("");
//   const [dueAt, setDueAt] = useState("");

//   const [loading, setLoading] = useState(false);

//   // ✅ Ultra-light toast (no libs, no slowdown)
//   const [toast, setToast] = useState({
//     open: false,
//     type: "success",
//     text: "",
//   });
//   const toastTimerRef = useRef(null);

//   const showToast = (type, text, ms = 2400) => {
//     if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
//     setToast({ open: true, type, text });
//     toastTimerRef.current = setTimeout(() => {
//       setToast((t) => ({ ...t, open: false }));
//     }, ms);
//   };

//   useEffect(() => {
//     return () => {
//       if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
//     };
//   }, []);

//   const reset = () => {
//     setTitle("");
//     setDetails("");
//     setReportTo("");
//     setStartAt("");
//     setDueAt("");
//   };

//   const submit = async (e) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       showToast("error", "Task title is required.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("authToken") ||
//         localStorage.getItem("ecoders_token");

//       await axios.post(
//         `${globalBackendRoute}/api/todos/create-tak`,
//         {
//           title: title.trim(),
//           details: details?.trim() || "",
//           reportTo: reportTo?.trim() || "",

//           // ✅ ISO at local midnight
//           startAt: startAt ? dateOnlyToISO(startAt) : null,
//           dueAt: dueAt ? dateOnlyToISO(dueAt) : null,

//           status: "NEW",
//         },
//         {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         },
//       );

//       // ✅ Success toast
//       showToast("success", "✅ Task created successfully.");
//       reset();
//     } catch (err) {
//       showToast(
//         "error",
//         err?.response?.data?.message || "❌ Failed to create task.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isTitleValid = Boolean(title.trim());

//   return (
//     <div className="bg-white text-slate-900">
//       {/* ✅ Toast (top-right, fast, no library) */}
//       {toast.open ? (
//         <div className="fixed top-4 right-4 z-[999] w-[92vw] max-w-sm">
//           <div
//             className={[
//               "rounded-2xl border shadow-xl backdrop-blur bg-white/95 px-4 py-3",
//               "flex items-start gap-3",
//               toast.type === "success"
//                 ? "border-emerald-200"
//                 : "border-rose-200",
//             ].join(" ")}
//             role="status"
//             aria-live="polite"
//           >
//             <div
//               className={[
//                 "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
//                 toast.type === "success"
//                   ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//                   : "border-rose-200 bg-rose-50 text-rose-700",
//               ].join(" ")}
//               aria-hidden="true"
//             >
//               <FaInfoCircle className="text-sm" />
//             </div>

//             <div className="min-w-0 flex-1">
//               <div className="text-sm font-semibold text-slate-900">
//                 {toast.type === "success" ? "Success" : "Error"}
//               </div>
//               <div className="mt-0.5 text-sm text-slate-700 break-words">
//                 {toast.text}
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={() => setToast((t) => ({ ...t, open: false }))}
//               className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
//               title="Close"
//             >
//               <FaTimes className="text-slate-600 text-sm" />
//             </button>
//           </div>
//         </div>
//       ) : null}

//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 " />
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
//                 autoFocus
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
//                 placeholder="Eg: Complete project documentation"
//               />

//               <div className="mt-4 flex items-center justify-between">
//                 <label className="block text-xs font-semibold text-slate-700">
//                   Task Details
//                 </label>
//                 <div className="text-[11px] text-slate-500">
//                   {details.length}/500
//                 </div>
//               </div>
//               <textarea
//                 value={details}
//                 onChange={(e) => setDetails(e.target.value.slice(0, 500))}
//                 rows={4}
//                 className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
//                     placeholder="Manager name"
//                   />
//                 </div>

//                 {/* ✅ DATE ONLY */}
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     value={startAt}
//                     onChange={(e) => setStartAt(e.target.value)}
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
//                   />
//                 </div>

//                 {/* ✅ DATE ONLY */}
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700">
//                     Due Date
//                   </label>
//                   <input
//                     type="date"
//                     value={dueAt}
//                     onChange={(e) => setDueAt(e.target.value)}
//                     min={startAt || undefined} // ✅ small UX improvement (no logic impact)
//                     className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 flex flex-wrap gap-3">
//                 <button
//                   disabled={loading || !isTitleValid}
//                   className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 transition"
//                 >
//                   {loading ? "Creating..." : "Create Task"}
//                   <FaArrowRight className="inline ml-2 text-xs" />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     reset();
//                     showToast("success", "Form cleared.");
//                   }}
//                   className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
//                 >
//                   Reset
//                 </button>
//               </div>

//               {/* ✅ Tiny helper text */}
//               <div className="mt-3 text-[11px] text-slate-500">
//                 Tip: Title is required. Dates are optional and saved as
//                 date-only (no timezone shift).
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// better validations for all the input fields

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { Link } from "react-router-dom";
import { FaArrowRight, FaInfoCircle, FaTimes } from "react-icons/fa";

/* -------------------- Date helpers (LOCAL date-only) -------------------- */
function pad2(n) {
  return String(n).padStart(2, "0");
}
function todayYMDLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function addDaysYMD(ymd, days) {
  if (!ymd) return "";
  const [y, m, d] = String(ymd).split("-").map(Number);
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  dt.setDate(dt.getDate() + Number(days || 0));
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}
// ✅ Convert "YYYY-MM-DD" to ISO at local midnight (prevents timezone shifts)
function dateOnlyToISO(ymd) {
  if (!ymd) return null;
  const [y, m, d] = String(ymd).split("-").map(Number);
  if (!y || !m || !d) return null;
  const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
  return localMidnight.toISOString();
}

/* -------------------- Text validation helpers -------------------- */
// - cannot be empty
// - cannot be only spaces
// - cannot start/end with spaces (we enforce by trimming before submit)
// - only special symbols not allowed
// - in-between spaces allowed
function normalizeText(s) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
function isOnlySpecialSymbols(s) {
  const t = normalizeText(s);
  if (!t) return true;
  // contains at least one letter or number?
  return !/[A-Za-z0-9]/.test(t);
}
function validateField(label, raw, { required = true } = {}) {
  const t = normalizeText(raw);

  if (required && !t) return `${label} is required.`;
  if (t && isOnlySpecialSymbols(t))
    return `${label} cannot be only special symbols.`;
  return ""; // ok
}

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [reportTo, setReportTo] = useState("");

  // ✅ date-only strings (YYYY-MM-DD)
  const [startAt, setStartAt] = useState("");
  const [dueAt, setDueAt] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ field-level errors
  const [errors, setErrors] = useState({
    title: "",
    details: "",
    reportTo: "",
    startAt: "",
    dueAt: "",
  });

  // ✅ Ultra-light toast (no libs, no slowdown)
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    text: "",
  });
  const toastTimerRef = useRef(null);

  const showToast = (type, text, ms = 2400) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ open: true, type, text });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, ms);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const reset = () => {
    setTitle("");
    setDetails("");
    setReportTo("");
    setStartAt("");
    setDueAt("");
    setErrors({ title: "", details: "", reportTo: "", startAt: "", dueAt: "" });
  };

  // ✅ mandatory fields (as per your ask): Title, Details, Report To, Start Date, Due Date
  // Note: Start/Due are mandatory BUT we auto-fill if user doesn't provide.
  const REQUIRED = useMemo(
    () => ({
      title: true,
      details: true,
      reportTo: true,
      startAt: true,
      dueAt: true,
    }),
    [],
  );

  const runValidation = () => {
    const e = {
      title: validateField("Task title", title, { required: true }),
      details: validateField("Task details", details, { required: true }),
      reportTo: validateField("Manager / Report To", reportTo || "Self", {
        required: true,
      }),
      startAt: "", // validated by date rules below
      dueAt: "", // validated by date rules below
    };

    // Date rules:
    // 5) start date if not given -> today (no error)
    // 6) due date if not given -> start + 1 (no error)
    const sYMD = startAt || todayYMDLocal();
    const dYMD = dueAt || addDaysYMD(sYMD, 1);

    // If user has given dueAt and it's before startAt -> error
    if (sYMD && dYMD) {
      // Compare YYYY-MM-DD lexicographically works
      if (dYMD < sYMD) e.dueAt = "Due date cannot be before start date.";
    }

    setErrors(e);
    const hasAnyError = Object.values(e).some(Boolean);
    return { ok: !hasAnyError, sYMD, dYMD };
  };

  const submit = async (e) => {
    e.preventDefault();

    const { ok, sYMD, dYMD } = runValidation();
    if (!ok) {
      showToast("error", "Please fix the highlighted fields.");
      return;
    }

    // 3) No start/end spaces => normalize before sending
    // 7) reportTo default "Self"
    const finalTitle = normalizeText(title);
    const finalDetails = normalizeText(details);
    const finalReportTo = normalizeText(reportTo) || "Self";

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("ecoders_token");

      await axios.post(
        `${globalBackendRoute}/api/todos/create-tak`,
        {
          title: finalTitle,
          details: finalDetails,
          reportTo: finalReportTo,

          // ✅ date defaults applied here
          startAt: dateOnlyToISO(sYMD),
          dueAt: dateOnlyToISO(dYMD),

          status: "NEW",
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      showToast("success", "✅ Task created successfully.");
      reset();
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "❌ Failed to create task.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ tiny UX: clear per-field error on change
  const setField = (setter, key) => (val) => {
    setter(val);
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const inputBase =
    "mt-2 w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-slate-200";
  const inputOk = "border-slate-200";
  const inputErr = "border-rose-300 ring-1 ring-rose-200";

  return (
    <div className="bg-white text-slate-900">
      {/* ✅ Toast */}
      {toast.open ? (
        <div className="fixed top-4 right-4 z-[999] w-[92vw] max-w-sm">
          <div
            className={[
              "rounded-2xl border shadow-xl backdrop-blur bg-white/95 px-4 py-3",
              "flex items-start gap-3",
              toast.type === "success"
                ? "border-emerald-200"
                : "border-rose-200",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <div
              className={[
                "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700",
              ].join(" ")}
              aria-hidden="true"
            >
              <FaInfoCircle className="text-sm" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900">
                {toast.type === "success" ? "Success" : "Error"}
              </div>
              <div className="mt-0.5 text-sm text-slate-700 break-words">
                {toast.text}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setToast((t) => ({ ...t, open: false }))}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              title="Close"
            >
              <FaTimes className="text-slate-600 text-sm" />
            </button>
          </div>
        </div>
      ) : null}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 " />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <h1 className="text-3xl font-semibold text-slate-900">
            Add Task
            {/* ✅ Indigo (not blue) */}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500">
              Personal To-Do Module
            </span>
          </h1>

          <div className="mt-8 max-w-full">
            <form
              onSubmit={submit}
              className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 sm:p-8"
            >
              {/* Title */}
              <label className="block text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <span>
                    Task Title{" "}
                    {REQUIRED.title ? (
                      <span className="text-rose-600 font-bold">*</span>
                    ) : null}
                  </span>

                  <Link
                    to="/view-all-todo-list"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    View All ToDo List
                  </Link>
                </div>
              </label>

              <input
                autoFocus
                value={title}
                onChange={(e) => setField(setTitle, "title")(e.target.value)}
                onBlur={() =>
                  setErrors((p) => ({
                    ...p,
                    title: validateField("Task title", title, {
                      required: true,
                    }),
                  }))
                }
                className={[inputBase, errors.title ? inputErr : inputOk].join(
                  " ",
                )}
                placeholder="Eg: Complete project documentation"
              />
              {errors.title ? (
                <div className="mt-1 text-[11px] text-rose-700">
                  {errors.title}
                </div>
              ) : null}

              {/* Details */}
              <div className="mt-4 flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Task Details{" "}
                  {REQUIRED.details ? (
                    <span className="text-rose-600 font-bold">*</span>
                  ) : null}
                </label>
                <div className="text-[11px] text-slate-500">
                  {details.length}/500
                </div>
              </div>

              <textarea
                value={details}
                onChange={(e) =>
                  setField(setDetails, "details")(e.target.value.slice(0, 500))
                }
                onBlur={() =>
                  setErrors((p) => ({
                    ...p,
                    details: validateField("Task details", details, {
                      required: true,
                    }),
                  }))
                }
                rows={4}
                className={[
                  inputBase,
                  errors.details ? inputErr : inputOk,
                ].join(" ")}
                placeholder="Extra notes..."
              />
              {errors.details ? (
                <div className="mt-1 text-[11px] text-rose-700">
                  {errors.details}
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {/* Report To */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Manager / Report To{" "}
                    {REQUIRED.reportTo ? (
                      <span className="text-rose-600 font-bold">*</span>
                    ) : null}
                  </label>
                  <input
                    value={reportTo}
                    onChange={(e) =>
                      setField(setReportTo, "reportTo")(e.target.value)
                    }
                    onBlur={() => {
                      const candidate = reportTo || "Self";
                      setErrors((p) => ({
                        ...p,
                        reportTo: validateField(
                          "Manager / Report To",
                          candidate,
                          {
                            required: true,
                          },
                        ),
                      }));
                      // UX: if user leaves it blank, show Self in UI (optional but helpful)
                      if (!normalizeText(reportTo)) setReportTo("Self");
                    }}
                    className={[
                      inputBase,
                      errors.reportTo ? inputErr : inputOk,
                    ].join(" ")}
                    placeholder="Eg: Self / Manager name"
                  />
                  {errors.reportTo ? (
                    <div className="mt-1 text-[11px] text-rose-700">
                      {errors.reportTo}
                    </div>
                  ) : (
                    <div className="mt-1 text-[11px] text-slate-500">
                      If empty, it will be saved as <b>Self</b>.
                    </div>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Start Date{" "}
                    {REQUIRED.startAt ? (
                      <span className="text-rose-600 font-bold">*</span>
                    ) : null}
                  </label>
                  <input
                    type="date"
                    value={startAt}
                    onChange={(e) =>
                      setField(setStartAt, "startAt")(e.target.value)
                    }
                    onBlur={() => {
                      // If not provided, auto-set to today (rule #5)
                      if (!startAt) {
                        setStartAt(todayYMDLocal());
                        setErrors((p) => ({ ...p, startAt: "" }));
                      }
                    }}
                    className={[
                      inputBase,
                      errors.startAt ? inputErr : inputOk,
                    ].join(" ")}
                  />
                  <div className="mt-1 text-[11px] text-slate-500">
                    If empty, it will be saved as <b>today</b>.
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Due Date{" "}
                    {REQUIRED.dueAt ? (
                      <span className="text-rose-600 font-bold">*</span>
                    ) : null}
                  </label>
                  <input
                    type="date"
                    value={dueAt}
                    onChange={(e) =>
                      setField(setDueAt, "dueAt")(e.target.value)
                    }
                    min={startAt || undefined}
                    onBlur={() => {
                      // If not provided, set to start+1 day (rule #6)
                      const s = startAt || todayYMDLocal();
                      if (!dueAt) {
                        setDueAt(addDaysYMD(s, 1));
                        setErrors((p) => ({ ...p, dueAt: "" }));
                        return;
                      }
                      // If provided and before start -> error
                      if (dueAt < s) {
                        setErrors((p) => ({
                          ...p,
                          dueAt: "Due date cannot be before start date.",
                        }));
                      }
                    }}
                    className={[
                      inputBase,
                      errors.dueAt ? inputErr : inputOk,
                    ].join(" ")}
                  />
                  {errors.dueAt ? (
                    <div className="mt-1 text-[11px] text-rose-700">
                      {errors.dueAt}
                    </div>
                  ) : (
                    <div className="mt-1 text-[11px] text-slate-500">
                      If empty, it will be saved as <b>start date + 1 day</b>.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  {loading ? "Creating..." : "Create Task"}
                  <FaArrowRight className="inline ml-2 text-xs" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    showToast("success", "Form cleared.");
                  }}
                  className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 text-[11px] text-slate-500">
                Notes:
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>
                    All fields are mandatory (
                    <span className="text-rose-600 font-bold">*</span>).
                  </li>
                  <li>No starting/ending spaces will be saved (auto-trim).</li>
                  <li>
                    Only special symbols are rejected (must contain at least one
                    letter or number).
                  </li>
                  <li>
                    If Start Date is empty → today. If Due Date is empty → Start
                    + 1 day.
                  </li>
                  <li>If Manager / Report To is empty → Self.</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
