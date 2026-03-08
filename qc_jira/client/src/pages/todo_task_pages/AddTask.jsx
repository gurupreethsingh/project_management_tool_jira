// // import React, { useEffect, useMemo, useRef, useState } from "react";
// // import axios from "axios";
// // import globalBackendRoute from "../../config/Config";
// // import { Link } from "react-router-dom";
// // import { FaArrowRight, FaInfoCircle, FaTimes } from "react-icons/fa";

// // /* -------------------- Date helpers (LOCAL date-only) -------------------- */
// // function pad2(n) {
// //   return String(n).padStart(2, "0");
// // }
// // function todayYMDLocal() {
// //   const d = new Date();
// //   return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
// // }
// // function addDaysYMD(ymd, days) {
// //   if (!ymd) return "";
// //   const [y, m, d] = String(ymd).split("-").map(Number);
// //   const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
// //   dt.setDate(dt.getDate() + Number(days || 0));
// //   return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
// // }
// // // ✅ Convert "YYYY-MM-DD" to ISO at local midnight (prevents timezone shifts)
// // function dateOnlyToISO(ymd) {
// //   if (!ymd) return null;
// //   const [y, m, d] = String(ymd).split("-").map(Number);
// //   if (!y || !m || !d) return null;
// //   const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
// //   return localMidnight.toISOString();
// // }

// // /* -------------------- Text validation helpers -------------------- */
// // // - cannot be empty
// // // - cannot be only spaces
// // // - cannot start/end with spaces (we enforce by trimming before submit)
// // // - only special symbols not allowed
// // // - in-between spaces allowed
// // function normalizeText(s) {
// //   return String(s ?? "")
// //     .replace(/\s+/g, " ")
// //     .trim();
// // }
// // function isOnlySpecialSymbols(s) {
// //   const t = normalizeText(s);
// //   if (!t) return true;
// //   // contains at least one letter or number?
// //   return !/[A-Za-z0-9]/.test(t);
// // }
// // function validateField(label, raw, { required = true } = {}) {
// //   const t = normalizeText(raw);

// //   if (required && !t) return `${label} is required.`;
// //   if (t && isOnlySpecialSymbols(t))
// //     return `${label} cannot be only special symbols.`;
// //   return ""; // ok
// // }

// // export default function AddTask() {
// //   const [title, setTitle] = useState("");
// //   const [details, setDetails] = useState("");
// //   const [reportTo, setReportTo] = useState("");

// //   // ✅ date-only strings (YYYY-MM-DD)
// //   const [startAt, setStartAt] = useState("");
// //   const [dueAt, setDueAt] = useState("");

// //   const [loading, setLoading] = useState(false);

// //   // ✅ field-level errors
// //   const [errors, setErrors] = useState({
// //     title: "",
// //     details: "",
// //     reportTo: "",
// //     startAt: "",
// //     dueAt: "",
// //   });

// //   // ✅ Ultra-light toast (no libs, no slowdown)
// //   const [toast, setToast] = useState({
// //     open: false,
// //     type: "success",
// //     text: "",
// //   });
// //   const toastTimerRef = useRef(null);

// //   const showToast = (type, text, ms = 2400) => {
// //     if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
// //     setToast({ open: true, type, text });
// //     toastTimerRef.current = setTimeout(() => {
// //       setToast((t) => ({ ...t, open: false }));
// //     }, ms);
// //   };

// //   useEffect(() => {
// //     return () => {
// //       if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
// //     };
// //   }, []);

// //   const reset = () => {
// //     setTitle("");
// //     setDetails("");
// //     setReportTo("");
// //     setStartAt("");
// //     setDueAt("");
// //     setErrors({ title: "", details: "", reportTo: "", startAt: "", dueAt: "" });
// //   };

// //   // ✅ mandatory fields (as per your ask): Title, Details, Report To, Start Date, Due Date
// //   // Note: Start/Due are mandatory BUT we auto-fill if user doesn't provide.
// //   const REQUIRED = useMemo(
// //     () => ({
// //       title: true,
// //       details: true,
// //       reportTo: true,
// //       startAt: true,
// //       dueAt: true,
// //     }),
// //     [],
// //   );

// //   const runValidation = () => {
// //     const e = {
// //       title: validateField("Task title", title, { required: true }),
// //       details: validateField("Task details", details, { required: true }),
// //       reportTo: validateField("Manager / Report To", reportTo || "Self", {
// //         required: true,
// //       }),
// //       startAt: "", // validated by date rules below
// //       dueAt: "", // validated by date rules below
// //     };

// //     // Date rules:
// //     // 5) start date if not given -> today (no error)
// //     // 6) due date if not given -> start + 1 (no error)
// //     const sYMD = startAt || todayYMDLocal();
// //     const dYMD = dueAt || addDaysYMD(sYMD, 1);

// //     // If user has given dueAt and it's before startAt -> error
// //     if (sYMD && dYMD) {
// //       // Compare YYYY-MM-DD lexicographically works
// //       if (dYMD < sYMD) e.dueAt = "Due date cannot be before start date.";
// //     }

// //     setErrors(e);
// //     const hasAnyError = Object.values(e).some(Boolean);
// //     return { ok: !hasAnyError, sYMD, dYMD };
// //   };

// //   const submit = async (e) => {
// //     e.preventDefault();

// //     const { ok, sYMD, dYMD } = runValidation();
// //     if (!ok) {
// //       showToast("error", "Please fix the highlighted fields.");
// //       return;
// //     }

// //     // 3) No start/end spaces => normalize before sending
// //     // 7) reportTo default "Self"
// //     const finalTitle = normalizeText(title);
// //     const finalDetails = normalizeText(details);
// //     const finalReportTo = normalizeText(reportTo) || "Self";

// //     try {
// //       setLoading(true);

// //       const token =
// //         localStorage.getItem("token") ||
// //         localStorage.getItem("authToken") ||
// //         localStorage.getItem("ecoders_token");

// //       await axios.post(
// //         `${globalBackendRoute}/api/todos/create-tak`,
// //         {
// //           title: finalTitle,
// //           details: finalDetails,
// //           reportTo: finalReportTo,

// //           // ✅ date defaults applied here
// //           startAt: dateOnlyToISO(sYMD),
// //           dueAt: dateOnlyToISO(dYMD),

// //           status: "NEW",
// //         },
// //         {
// //           headers: token ? { Authorization: `Bearer ${token}` } : {},
// //         },
// //       );

// //       showToast("success", "✅ Task created successfully.");
// //       reset();
// //     } catch (err) {
// //       showToast(
// //         "error",
// //         err?.response?.data?.message || "❌ Failed to create task.",
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ tiny UX: clear per-field error on change
// //   const setField = (setter, key) => (val) => {
// //     setter(val);
// //     if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
// //   };

// //   const inputBase =
// //     "mt-2 w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-slate-200";
// //   const inputOk = "border-slate-200";
// //   const inputErr = "border-rose-300 ring-1 ring-rose-200";

// //   return (
// //     <div className="bg-white text-slate-900">
// //       {/* ✅ Toast */}
// //       {toast.open ? (
// //         <div className="fixed top-4 right-4 z-[999] w-[92vw] max-w-sm">
// //           <div
// //             className={[
// //               "rounded-2xl border shadow-xl backdrop-blur bg-white/95 px-4 py-3",
// //               "flex items-start gap-3",
// //               toast.type === "success"
// //                 ? "border-emerald-200"
// //                 : "border-rose-200",
// //             ].join(" ")}
// //             role="status"
// //             aria-live="polite"
// //           >
// //             <div
// //               className={[
// //                 "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
// //                 toast.type === "success"
// //                   ? "border-emerald-200 bg-emerald-50 text-emerald-700"
// //                   : "border-rose-200 bg-rose-50 text-rose-700",
// //               ].join(" ")}
// //               aria-hidden="true"
// //             >
// //               <FaInfoCircle className="text-sm" />
// //             </div>

// //             <div className="min-w-0 flex-1">
// //               <div className="text-sm font-semibold text-slate-900">
// //                 {toast.type === "success" ? "Success" : "Error"}
// //               </div>
// //               <div className="mt-0.5 text-sm text-slate-700 break-words">
// //                 {toast.text}
// //               </div>
// //             </div>

// //             <button
// //               type="button"
// //               onClick={() => setToast((t) => ({ ...t, open: false }))}
// //               className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
// //               title="Close"
// //             >
// //               <FaTimes className="text-slate-600 text-sm" />
// //             </button>
// //           </div>
// //         </div>
// //       ) : null}

// //       <section className="relative overflow-hidden">
// //         <div className="absolute inset-0 " />
// //         <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-tr from-indigo-300/40 via-purple-300/40 to-pink-300/40 blur-[120px] rounded-full animate-pulse" />

// //         <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
// //           <h1 className="text-3xl font-semibold text-slate-900">
// //             Add Task
// //             {/* ✅ Indigo (not blue) */}
// //             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500">
// //               Personal To-Do Module
// //             </span>
// //           </h1>

// //           <div className="mt-8 max-w-full">
// //             <form
// //               onSubmit={submit}
// //               className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 sm:p-8"
// //             >
// //               {/* Title */}
// //               <label className="block text-xs font-semibold text-slate-700">
// //                 <div className="flex items-center justify-between gap-3">
// //                   <span>
// //                     Task Title{" "}
// //                     {REQUIRED.title ? (
// //                       <span className="text-rose-600 font-bold">*</span>
// //                     ) : null}
// //                   </span>

// //                   <Link
// //                     to="/view-all-todo-list"
// //                     className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
// //                   >
// //                     View All ToDo List
// //                   </Link>
// //                 </div>
// //               </label>

// //               <input
// //                 autoFocus
// //                 value={title}
// //                 onChange={(e) => setField(setTitle, "title")(e.target.value)}
// //                 onBlur={() =>
// //                   setErrors((p) => ({
// //                     ...p,
// //                     title: validateField("Task title", title, {
// //                       required: true,
// //                     }),
// //                   }))
// //                 }
// //                 className={[inputBase, errors.title ? inputErr : inputOk].join(
// //                   " ",
// //                 )}
// //                 placeholder="Eg: Complete project documentation"
// //               />
// //               {errors.title ? (
// //                 <div className="mt-1 text-[11px] text-rose-700">
// //                   {errors.title}
// //                 </div>
// //               ) : null}

// //               {/* Details */}
// //               <div className="mt-4 flex items-center justify-between">
// //                 <label className="block text-xs font-semibold text-slate-700">
// //                   Task Details{" "}
// //                   {REQUIRED.details ? (
// //                     <span className="text-rose-600 font-bold">*</span>
// //                   ) : null}
// //                 </label>
// //                 <div className="text-[11px] text-slate-500">
// //                   {details.length}/500
// //                 </div>
// //               </div>

// //               <textarea
// //                 value={details}
// //                 onChange={(e) =>
// //                   setField(setDetails, "details")(e.target.value.slice(0, 500))
// //                 }
// //                 onBlur={() =>
// //                   setErrors((p) => ({
// //                     ...p,
// //                     details: validateField("Task details", details, {
// //                       required: true,
// //                     }),
// //                   }))
// //                 }
// //                 rows={4}
// //                 className={[
// //                   inputBase,
// //                   errors.details ? inputErr : inputOk,
// //                 ].join(" ")}
// //                 placeholder="Extra notes..."
// //               />
// //               {errors.details ? (
// //                 <div className="mt-1 text-[11px] text-rose-700">
// //                   {errors.details}
// //                 </div>
// //               ) : null}

// //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
// //                 {/* Report To */}
// //                 <div>
// //                   <label className="text-xs font-semibold text-slate-700">
// //                     Manager / Report To{" "}
// //                     {REQUIRED.reportTo ? (
// //                       <span className="text-rose-600 font-bold">*</span>
// //                     ) : null}
// //                   </label>
// //                   <input
// //                     value={reportTo}
// //                     onChange={(e) =>
// //                       setField(setReportTo, "reportTo")(e.target.value)
// //                     }
// //                     onBlur={() => {
// //                       const candidate = reportTo || "Self";
// //                       setErrors((p) => ({
// //                         ...p,
// //                         reportTo: validateField(
// //                           "Manager / Report To",
// //                           candidate,
// //                           {
// //                             required: true,
// //                           },
// //                         ),
// //                       }));
// //                       // UX: if user leaves it blank, show Self in UI (optional but helpful)
// //                       if (!normalizeText(reportTo)) setReportTo("Self");
// //                     }}
// //                     className={[
// //                       inputBase,
// //                       errors.reportTo ? inputErr : inputOk,
// //                     ].join(" ")}
// //                     placeholder="Eg: Self / Manager name"
// //                   />
// //                   {errors.reportTo ? (
// //                     <div className="mt-1 text-[11px] text-rose-700">
// //                       {errors.reportTo}
// //                     </div>
// //                   ) : (
// //                     <div className="mt-1 text-[11px] text-slate-500">
// //                       If empty, it will be saved as <b>Self</b>.
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Start Date */}
// //                 <div>
// //                   <label className="text-xs font-semibold text-slate-700">
// //                     Start Date{" "}
// //                     {REQUIRED.startAt ? (
// //                       <span className="text-rose-600 font-bold">*</span>
// //                     ) : null}
// //                   </label>
// //                   <input
// //                     type="date"
// //                     value={startAt}
// //                     onChange={(e) =>
// //                       setField(setStartAt, "startAt")(e.target.value)
// //                     }
// //                     onBlur={() => {
// //                       // If not provided, auto-set to today (rule #5)
// //                       if (!startAt) {
// //                         setStartAt(todayYMDLocal());
// //                         setErrors((p) => ({ ...p, startAt: "" }));
// //                       }
// //                     }}
// //                     className={[
// //                       inputBase,
// //                       errors.startAt ? inputErr : inputOk,
// //                     ].join(" ")}
// //                   />
// //                   <div className="mt-1 text-[11px] text-slate-500">
// //                     If empty, it will be saved as <b>today</b>.
// //                   </div>
// //                 </div>

// //                 {/* Due Date */}
// //                 <div>
// //                   <label className="text-xs font-semibold text-slate-700">
// //                     Due Date{" "}
// //                     {REQUIRED.dueAt ? (
// //                       <span className="text-rose-600 font-bold">*</span>
// //                     ) : null}
// //                   </label>
// //                   <input
// //                     type="date"
// //                     value={dueAt}
// //                     onChange={(e) =>
// //                       setField(setDueAt, "dueAt")(e.target.value)
// //                     }
// //                     min={startAt || undefined}
// //                     onBlur={() => {
// //                       // If not provided, set to start+1 day (rule #6)
// //                       const s = startAt || todayYMDLocal();
// //                       if (!dueAt) {
// //                         setDueAt(addDaysYMD(s, 1));
// //                         setErrors((p) => ({ ...p, dueAt: "" }));
// //                         return;
// //                       }
// //                       // If provided and before start -> error
// //                       if (dueAt < s) {
// //                         setErrors((p) => ({
// //                           ...p,
// //                           dueAt: "Due date cannot be before start date.",
// //                         }));
// //                       }
// //                     }}
// //                     className={[
// //                       inputBase,
// //                       errors.dueAt ? inputErr : inputOk,
// //                     ].join(" ")}
// //                   />
// //                   {errors.dueAt ? (
// //                     <div className="mt-1 text-[11px] text-rose-700">
// //                       {errors.dueAt}
// //                     </div>
// //                   ) : (
// //                     <div className="mt-1 text-[11px] text-slate-500">
// //                       If empty, it will be saved as <b>start date + 1 day</b>.
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="mt-6 flex flex-wrap gap-3">
// //                 <button
// //                   disabled={loading}
// //                   className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 transition"
// //                 >
// //                   {loading ? "Creating..." : "Create Task"}
// //                   <FaArrowRight className="inline ml-2 text-xs" />
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     reset();
// //                     showToast("success", "Form cleared.");
// //                   }}
// //                   className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
// //                 >
// //                   Reset
// //                 </button>
// //               </div>

// //               <div className="mt-4 text-[11px] text-slate-500">
// //                 Notes:
// //                 <ul className="list-disc ml-4 mt-1 space-y-1">
// //                   <li>
// //                     All fields are mandatory (
// //                     <span className="text-rose-600 font-bold">*</span>).
// //                   </li>
// //                   <li>No starting/ending spaces will be saved (auto-trim).</li>
// //                   <li>
// //                     Only special symbols are rejected (must contain at least one
// //                     letter or number).
// //                   </li>
// //                   <li>
// //                     If Start Date is empty → today. If Due Date is empty → Start
// //                     + 1 day.
// //                   </li>
// //                   <li>If Manager / Report To is empty → Self.</li>
// //                 </ul>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// // optimized code.

// //

// "use client";

// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
//   memo,
// } from "react";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   FaArrowRight,
//   FaInfoCircle,
//   FaTimes,
//   FaClipboardList,
//   FaRegUser,
//   FaCalendarAlt,
//   FaFileAlt,
//   FaCheckCircle,
// } from "react-icons/fa";
// import addTaskBanner from "../../assets/images/profile_banner.jpg";

// const HERO_TAGS = ["TASK", "TODO", "CREATE", "PRODUCTIVITY"];

// const HERO_STYLE = Object.freeze({
//   backgroundImage: `url(${addTaskBanner})`,
// });

// const INITIAL_ERRORS = Object.freeze({
//   title: "",
//   details: "",
//   reportTo: "",
//   startAt: "",
//   dueAt: "",
// });

// const REQUIRED = Object.freeze({
//   title: true,
//   details: true,
//   reportTo: true,
//   startAt: true,
//   dueAt: true,
// });

// /* -------------------- Date helpers (LOCAL date-only) -------------------- */
// function pad2(n) {
//   return String(n).padStart(2, "0");
// }

// function todayYMDLocal() {
//   const d = new Date();
//   return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
// }

// function addDaysYMD(ymd, days) {
//   if (!ymd) return "";
//   const [y, m, d] = String(ymd).split("-").map(Number);
//   const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
//   dt.setDate(dt.getDate() + Number(days || 0));
//   return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
// }

// function dateOnlyToISO(ymd) {
//   if (!ymd) return null;
//   const [y, m, d] = String(ymd).split("-").map(Number);
//   if (!y || !m || !d) return null;
//   const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
//   return localMidnight.toISOString();
// }

// /* -------------------- Text validation helpers -------------------- */
// function normalizeText(value) {
//   return String(value ?? "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function isOnlySpecialSymbols(value) {
//   const text = normalizeText(value);
//   if (!text) return true;
//   return !/[A-Za-z0-9]/.test(text);
// }

// function validateField(label, raw, { required = true } = {}) {
//   const text = normalizeText(raw);

//   if (required && !text) return `${label} is required.`;
//   if (text && isOnlySpecialSymbols(text)) {
//     return `${label} cannot be only special symbols.`;
//   }

//   return "";
// }

// function getAuthToken() {
//   return (
//     localStorage.getItem("token") ||
//     localStorage.getItem("authToken") ||
//     localStorage.getItem("ecoders_token") ||
//     ""
//   );
// }

// const Toast = memo(function Toast({ toast, onClose }) {
//   if (!toast.open) return null;

//   const isSuccess = toast.type === "success";

//   return (
//     <div className="fixed top-4 right-4 z-[999] w-[92vw] max-w-sm">
//       <div
//         className={[
//           "rounded-2xl border shadow-xl backdrop-blur bg-white/95 px-4 py-3",
//           "flex items-start gap-3",
//           isSuccess ? "border-emerald-200" : "border-rose-200",
//         ].join(" ")}
//         role="status"
//         aria-live="polite"
//       >
//         <div
//           className={[
//             "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
//             isSuccess
//               ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//               : "border-rose-200 bg-rose-50 text-rose-700",
//           ].join(" ")}
//           aria-hidden="true"
//         >
//           <FaInfoCircle className="text-sm" />
//         </div>

//         <div className="min-w-0 flex-1">
//           <div className="text-sm font-semibold text-slate-900">
//             {isSuccess ? "Success" : "Error"}
//           </div>
//           <div className="mt-0.5 text-sm text-slate-700 break-words">
//             {toast.text}
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={onClose}
//           className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
//           title="Close"
//           aria-label="Close toast"
//         >
//           <FaTimes className="text-slate-600 text-sm" />
//         </button>
//       </div>
//     </div>
//   );
// });

// const InputField = memo(function InputField({
//   label,
//   required,
//   value,
//   onChange,
//   onBlur,
//   placeholder,
//   error,
//   helperText,
//   icon,
//   rightSlot,
//   autoFocus = false,
// }) {
//   const inputBase =
//     "mt-2.5 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 transition";
//   const inputOk = "border-slate-200";
//   const inputErr = "border-rose-300 ring-1 ring-rose-200";

//   return (
//     <div>
//       <label className="form-label">
//         <span className="form-icon-badge">{icon}</span>
//         <span>
//           {label}{" "}
//           {required ? <span className="text-rose-600 font-bold">*</span> : null}
//         </span>
//       </label>

//       {rightSlot ? <div className="mt-2">{rightSlot}</div> : null}

//       <input
//         autoFocus={autoFocus}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         className={[inputBase, error ? inputErr : inputOk].join(" ")}
//         placeholder={placeholder}
//       />

//       {error ? (
//         <div className="mt-1 text-[11px] text-rose-700">{error}</div>
//       ) : helperText ? (
//         <div className="mt-1 text-[11px] text-slate-500">{helperText}</div>
//       ) : null}
//     </div>
//   );
// });

// const DateField = memo(function DateField({
//   label,
//   required,
//   value,
//   onChange,
//   onBlur,
//   error,
//   helperText,
//   min,
// }) {
//   const inputBase =
//     "mt-2.5 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 transition";
//   const inputOk = "border-slate-200";
//   const inputErr = "border-rose-300 ring-1 ring-rose-200";

//   return (
//     <div>
//       <label className="form-label">
//         <span className="form-icon-badge">
//           <FaCalendarAlt className="text-[11px]" />
//         </span>
//         <span>
//           {label}{" "}
//           {required ? <span className="text-rose-600 font-bold">*</span> : null}
//         </span>
//       </label>

//       <input
//         type="date"
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         min={min}
//         className={[inputBase, error ? inputErr : inputOk].join(" ")}
//       />

//       {error ? (
//         <div className="mt-1 text-[11px] text-rose-700">{error}</div>
//       ) : helperText ? (
//         <div className="mt-1 text-[11px] text-slate-500">{helperText}</div>
//       ) : null}
//     </div>
//   );
// });

// const TextAreaField = memo(function TextAreaField({
//   label,
//   required,
//   value,
//   onChange,
//   onBlur,
//   error,
//   helperText,
//   maxLength,
// }) {
//   const inputBase =
//     "mt-2.5 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 transition";
//   const inputOk = "border-slate-200";
//   const inputErr = "border-rose-300 ring-1 ring-rose-200";

//   return (
//     <div>
//       <div className="flex items-center justify-between gap-3">
//         <label className="form-label">
//           <span className="form-icon-badge">
//             <FaFileAlt className="text-[11px]" />
//           </span>
//           <span>
//             {label}{" "}
//             {required ? (
//               <span className="text-rose-600 font-bold">*</span>
//             ) : null}
//           </span>
//         </label>

//         <div className="text-[11px] text-slate-500">
//           {value.length}/{maxLength}
//         </div>
//       </div>

//       <textarea
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         rows={4}
//         className={[inputBase, error ? inputErr : inputOk].join(" ")}
//         placeholder="Extra notes..."
//       />

//       {error ? (
//         <div className="mt-1 text-[11px] text-rose-700">{error}</div>
//       ) : helperText ? (
//         <div className="mt-1 text-[11px] text-slate-500">{helperText}</div>
//       ) : null}
//     </div>
//   );
// });

// function AddTask() {
//   const [title, setTitle] = useState("");
//   const [details, setDetails] = useState("");
//   const [reportTo, setReportTo] = useState("");
//   const [startAt, setStartAt] = useState("");
//   const [dueAt, setDueAt] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [errors, setErrors] = useState(INITIAL_ERRORS);

//   const [toast, setToast] = useState({
//     open: false,
//     type: "success",
//     text: "",
//   });

//   const toastTimerRef = useRef(null);

//   const showToast = useCallback((type, text, ms = 2400) => {
//     if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

//     setToast({
//       open: true,
//       type,
//       text,
//     });

//     toastTimerRef.current = setTimeout(() => {
//       setToast((prev) => ({ ...prev, open: false }));
//     }, ms);
//   }, []);

//   const closeToast = useCallback(() => {
//     if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
//     setToast((prev) => ({ ...prev, open: false }));
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
//     };
//   }, []);

//   const reset = useCallback(() => {
//     setTitle("");
//     setDetails("");
//     setReportTo("");
//     setStartAt("");
//     setDueAt("");
//     setErrors(INITIAL_ERRORS);
//   }, []);

//   const setFieldErrorClear = useCallback((key, setter, value) => {
//     setter(value);
//     setErrors((prev) => {
//       if (!prev[key]) return prev;
//       return { ...prev, [key]: "" };
//     });
//   }, []);

//   const validateAll = useCallback(() => {
//     const nextErrors = {
//       title: validateField("Task title", title, { required: true }),
//       details: validateField("Task details", details, { required: true }),
//       reportTo: validateField("Manager / Report To", reportTo || "Self", {
//         required: true,
//       }),
//       startAt: "",
//       dueAt: "",
//     };

//     const sYMD = startAt || todayYMDLocal();
//     const dYMD = dueAt || addDaysYMD(sYMD, 1);

//     if (sYMD && dYMD && dYMD < sYMD) {
//       nextErrors.dueAt = "Due date cannot be before start date.";
//     }

//     setErrors(nextErrors);

//     const hasAnyError = Object.values(nextErrors).some(Boolean);

//     return {
//       ok: !hasAnyError,
//       sYMD,
//       dYMD,
//     };
//   }, [title, details, reportTo, startAt, dueAt]);

//   const handleTitleBlur = useCallback(() => {
//     setErrors((prev) => ({
//       ...prev,
//       title: validateField("Task title", title, { required: true }),
//     }));
//   }, [title]);

//   const handleDetailsBlur = useCallback(() => {
//     setErrors((prev) => ({
//       ...prev,
//       details: validateField("Task details", details, { required: true }),
//     }));
//   }, [details]);

//   const handleReportToBlur = useCallback(() => {
//     const candidate = reportTo || "Self";

//     setErrors((prev) => ({
//       ...prev,
//       reportTo: validateField("Manager / Report To", candidate, {
//         required: true,
//       }),
//     }));

//     if (!normalizeText(reportTo)) {
//       setReportTo("Self");
//     }
//   }, [reportTo]);

//   const handleStartAtBlur = useCallback(() => {
//     if (!startAt) {
//       setStartAt(todayYMDLocal());
//       setErrors((prev) => ({ ...prev, startAt: "" }));
//     }
//   }, [startAt]);

//   const handleDueAtBlur = useCallback(() => {
//     const s = startAt || todayYMDLocal();

//     if (!dueAt) {
//       setDueAt(addDaysYMD(s, 1));
//       setErrors((prev) => ({ ...prev, dueAt: "" }));
//       return;
//     }

//     if (dueAt < s) {
//       setErrors((prev) => ({
//         ...prev,
//         dueAt: "Due date cannot be before start date.",
//       }));
//       return;
//     }

//     setErrors((prev) => ({ ...prev, dueAt: "" }));
//   }, [dueAt, startAt]);

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();

//       const { ok, sYMD, dYMD } = validateAll();

//       if (!ok) {
//         showToast("error", "Please fix the highlighted fields.");
//         return;
//       }

//       const finalTitle = normalizeText(title);
//       const finalDetails = normalizeText(details);
//       const finalReportTo = normalizeText(reportTo) || "Self";

//       try {
//         setLoading(true);

//         const token = getAuthToken();

//         await axios.post(
//           `${globalBackendRoute}/api/todos/create-tak`,
//           {
//             title: finalTitle,
//             details: finalDetails,
//             reportTo: finalReportTo,
//             startAt: dateOnlyToISO(sYMD),
//             dueAt: dateOnlyToISO(dYMD),
//             status: "NEW",
//           },
//           {
//             headers: token ? { Authorization: `Bearer ${token}` } : {},
//           },
//         );

//         showToast("success", "✅ Task created successfully.");
//         reset();
//       } catch (err) {
//         showToast(
//           "error",
//           err?.response?.data?.message || "❌ Failed to create task.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     },
//     [validateAll, showToast, title, details, reportTo, reset],
//   );

//   const handleReset = useCallback(() => {
//     reset();
//     showToast("success", "Form cleared.");
//   }, [reset, showToast]);

//   const rightTopLink = useMemo(
//     () => (
//       <Link
//         to="/view-all-todo-list"
//         className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
//       >
//         View All ToDo List
//       </Link>
//     ),
//     [],
//   );

//   const notesList = useMemo(
//     () => [
//       "All fields are mandatory (*).",
//       "No starting or ending spaces will be saved.",
//       "Only special symbols are rejected. At least one letter or number is required.",
//       "If Start Date is empty, it becomes today.",
//       "If Due Date is empty, it becomes Start Date + 1 day.",
//       'If Manager / Report To is empty, it becomes "Self".',
//     ],
//     [],
//   );

//   const summaryItems = useMemo(
//     () => [
//       {
//         icon: <FaClipboardList className="text-indigo-600" />,
//         label: "Task title",
//         value: normalizeText(title) || "Not entered yet",
//       },
//       {
//         icon: <FaFileAlt className="text-green-500" />,
//         label: "Details",
//         value: normalizeText(details) || "Not entered yet",
//       },
//       {
//         icon: <FaRegUser className="text-amber-500" />,
//         label: "Report to",
//         value: normalizeText(reportTo) || "Self",
//       },
//       {
//         icon: <FaCalendarAlt className="text-rose-500" />,
//         label: "Start date",
//         value: startAt || todayYMDLocal(),
//       },
//       {
//         icon: <FaCalendarAlt className="text-red-500" />,
//         label: "Due date",
//         value: dueAt || addDaysYMD(startAt || todayYMDLocal(), 1),
//       },
//     ],
//     [title, details, reportTo, startAt, dueAt],
//   );

//   return (
//     <div className="service-page-wrap min-h-screen">
//       <Toast toast={toast} onClose={closeToast} />

//       {/* HERO */}
//       <section className="service-hero-section" style={HERO_STYLE}>
//         <div className="service-hero-overlay-1" />
//         <div className="service-hero-overlay-2" />
//         <div className="service-hero-overlay-3" />

//         <div className="service-hero-container">
//           <div className="service-hero-layout">
//             <div>
//               <div className="service-tag-row">
//                 {HERO_TAGS.map((item) => (
//                   <span key={item} className="service-tag-pill">
//                     {item}
//                   </span>
//                 ))}
//               </div>

//               <h1 className="service-hero-title">
//                 Create a new{" "}
//                 <span className="service-hero-title-highlight">task</span>
//               </h1>

//               <p className="service-hero-text">
//                 Add your task title, notes, reporting person, and task dates in
//                 one place with clean validation and smooth task creation.
//               </p>

//               <div className="service-hero-status">
//                 <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
//                 Task creation is ready
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <main className="service-main-wrap">
//         <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
//           <div className="grid grid-cols-1 lg:grid-cols-[320px,minmax(0,1fr)] gap-8 lg:gap-10 items-start">
//             {/* LEFT */}
//             <motion.section
//               initial={{ opacity: 0, y: 18 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45 }}
//               className="glass-card p-5 sm:p-6"
//             >
//               <p className="service-badge-heading">Task preview</p>

//               <div className="mt-5 flex flex-col gap-4">
//                 <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
//                   <FaClipboardList className="w-8 h-8 text-slate-400" />
//                 </div>

//                 <div>
//                   <h2 className="text-lg sm:text-xl font-semibold text-slate-900 break-words">
//                     {normalizeText(title) || "New task"}
//                   </h2>
//                   <p className="mt-1 text-sm text-slate-600">
//                     Personal To-Do Module
//                   </p>
//                 </div>

//                 <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-700">
//                   <FaCheckCircle className="text-indigo-600" />
//                   <span>Status: NEW</span>
//                 </div>

//                 <div className="mt-2 grid grid-cols-1 gap-3">
//                   {summaryItems.map((item, index) => (
//                     <motion.div
//                       key={`${item.label}-${index}`}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.1 + index * 0.04, duration: 0.26 }}
//                       className="rounded-2xl border border-slate-200 bg-white p-4"
//                     >
//                       <div className="flex items-start gap-3">
//                         <span className="form-icon-badge shrink-0">
//                           {item.icon}
//                         </span>

//                         <div className="min-w-0">
//                           <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
//                             {item.label}
//                           </div>
//                           <div className="mt-1 text-sm text-slate-800 break-words">
//                             {item.value}
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                   <div className="text-sm font-semibold text-slate-900">
//                     Validation rules
//                   </div>
//                   <ul className="mt-2 space-y-1 text-[12px] text-slate-600">
//                     {notesList.map((item) => (
//                       <li key={item} className="leading-5">
//                         • {item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </motion.section>

//             {/* RIGHT */}
//             <motion.section
//               initial={{ opacity: 0, y: 18 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45, delay: 0.08 }}
//             >
//               <div className="glass-card p-5 sm:p-6 lg:p-7">
//                 <div className="flex flex-wrap">
//                   <p className="service-badge-heading">Create task</p>
//                 </div>

//                 <p className="mt-3 form-help-text">
//                   Fill in the task information below and submit it to create a
//                   new to-do item.
//                 </p>

//                 <form onSubmit={handleSubmit} className="mt-6">
//                   <div className="grid grid-cols-1 gap-y-5">
//                     <InputField
//                       label="Task Title"
//                       required={REQUIRED.title}
//                       value={title}
//                       onChange={(e) =>
//                         setFieldErrorClear("title", setTitle, e.target.value)
//                       }
//                       onBlur={handleTitleBlur}
//                       placeholder="Eg: Complete project documentation"
//                       error={errors.title}
//                       icon={<FaClipboardList className="text-[11px]" />}
//                       rightSlot={rightTopLink}
//                       autoFocus
//                     />

//                     <TextAreaField
//                       label="Task Details"
//                       required={REQUIRED.details}
//                       value={details}
//                       onChange={(e) =>
//                         setFieldErrorClear(
//                           "details",
//                           setDetails,
//                           e.target.value.slice(0, 500),
//                         )
//                       }
//                       onBlur={handleDetailsBlur}
//                       error={errors.details}
//                       helperText=""
//                       maxLength={500}
//                     />

//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                       <InputField
//                         label="Manager / Report To"
//                         required={REQUIRED.reportTo}
//                         value={reportTo}
//                         onChange={(e) =>
//                           setFieldErrorClear(
//                             "reportTo",
//                             setReportTo,
//                             e.target.value,
//                           )
//                         }
//                         onBlur={handleReportToBlur}
//                         placeholder="Eg: Self / Manager name"
//                         error={errors.reportTo}
//                         helperText={
//                           errors.reportTo
//                             ? ""
//                             : 'If empty, it will be saved as "Self".'
//                         }
//                         icon={<FaRegUser className="text-[11px]" />}
//                       />

//                       <DateField
//                         label="Start Date"
//                         required={REQUIRED.startAt}
//                         value={startAt}
//                         onChange={(e) =>
//                           setFieldErrorClear(
//                             "startAt",
//                             setStartAt,
//                             e.target.value,
//                           )
//                         }
//                         onBlur={handleStartAtBlur}
//                         error={errors.startAt}
//                         helperText={
//                           errors.startAt
//                             ? ""
//                             : "If empty, it will be saved as today."
//                         }
//                       />

//                       <DateField
//                         label="Due Date"
//                         required={REQUIRED.dueAt}
//                         value={dueAt}
//                         onChange={(e) =>
//                           setFieldErrorClear("dueAt", setDueAt, e.target.value)
//                         }
//                         onBlur={handleDueAtBlur}
//                         error={errors.dueAt}
//                         helperText={
//                           errors.dueAt
//                             ? ""
//                             : "If empty, it will be saved as start date + 1 day."
//                         }
//                         min={startAt || undefined}
//                       />
//                     </div>
//                   </div>

//                   <div className="mt-8 flex flex-wrap justify-end gap-3">
//                     <button
//                       type="button"
//                       onClick={handleReset}
//                       className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
//                     >
//                       Reset
//                     </button>

//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="primary-gradient-button disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Creating..." : "Create Task"}
//                       <FaArrowRight className="ml-2" />
//                     </button>
//                   </div>

//                   <div className="mt-4 text-[11px] text-slate-500">
//                     Dates are saved as local date-only values to avoid timezone
//                     shifts.
//                   </div>
//                 </form>
//               </div>
//             </motion.section>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default memo(AddTask);

//

"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import axios from "axios";
import globalBackendRoute from "../../config/Config";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaInfoCircle,
  FaTimes,
  FaClipboardList,
  FaRegUser,
  FaCalendarAlt,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import addTaskBanner from "../../assets/images/profile_banner.jpg";

const HERO_TAGS = ["TASK", "TODO", "CREATE", "PRODUCTIVITY"];

const HERO_STYLE = Object.freeze({
  backgroundImage: `url(${addTaskBanner})`,
});

const INITIAL_ERRORS = Object.freeze({
  title: "",
  details: "",
  reportTo: "",
  startAt: "",
  dueAt: "",
});

const REQUIRED = Object.freeze({
  title: true,
  details: true,
  reportTo: true,
  startAt: true,
  dueAt: true,
});

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

function dateOnlyToISO(ymd) {
  if (!ymd) return null;
  const [y, m, d] = String(ymd).split("-").map(Number);
  if (!y || !m || !d) return null;
  const localMidnight = new Date(y, m - 1, d, 0, 0, 0, 0);
  return localMidnight.toISOString();
}

/* -------------------- Text validation helpers -------------------- */
function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function isOnlySpecialSymbols(value) {
  const text = normalizeText(value);
  if (!text) return true;
  return !/[A-Za-z0-9]/.test(text);
}

function validateField(label, raw, { required = true } = {}) {
  const text = normalizeText(raw);

  if (required && !text) return `${label} is required.`;
  if (text && isOnlySpecialSymbols(text)) {
    return `${label} cannot be only special symbols.`;
  }

  return "";
}

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("ecoders_token") ||
    ""
  );
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
          aria-hidden="true"
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
          title="Close"
          aria-label="Close toast"
        >
          <FaTimes className="text-slate-600 text-sm" />
        </button>
      </div>
    </div>
  );
});

const InputField = memo(function InputField({
  label,
  required,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  icon,
  autoFocus = false,
}) {
  const inputBase =
    "mt-2.5 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 transition";
  const inputOk = "border-slate-200";
  const inputErr = "border-rose-300 ring-1 ring-rose-200";

  return (
    <div>
      <label className="form-label">
        <span className="form-icon-badge">{icon}</span>
        <span>
          {label}{" "}
          {required ? <span className="text-rose-600 font-bold">*</span> : null}
        </span>
      </label>

      <input
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={[inputBase, error ? inputErr : inputOk].join(" ")}
        placeholder={placeholder}
      />

      {error ? (
        <div className="mt-1 text-[11px] text-rose-700">{error}</div>
      ) : helperText ? (
        <div className="mt-1 text-[11px] text-slate-500">{helperText}</div>
      ) : null}
    </div>
  );
});

const DateField = memo(function DateField({
  label,
  required,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  min,
}) {
  const inputBase =
    "mt-2.5 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 transition";
  const inputOk = "border-slate-200";
  const inputErr = "border-rose-300 ring-1 ring-rose-200";

  return (
    <div>
      <label className="form-label">
        <span className="form-icon-badge">
          <FaCalendarAlt className="text-[11px]" />
        </span>
        <span>
          {label}{" "}
          {required ? <span className="text-rose-600 font-bold">*</span> : null}
        </span>
      </label>

      <input
        type="date"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        className={[inputBase, error ? inputErr : inputOk].join(" ")}
      />

      {error ? (
        <div className="mt-1 text-[11px] text-rose-700">{error}</div>
      ) : helperText ? (
        <div className="mt-1 text-[11px] text-slate-500">{helperText}</div>
      ) : null}
    </div>
  );
});

const TextAreaField = memo(function TextAreaField({
  label,
  required,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  maxLength,
}) {
  const inputBase =
    "mt-2.5 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 transition";
  const inputOk = "border-slate-200";
  const inputErr = "border-rose-300 ring-1 ring-rose-200";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="form-label">
          <span className="form-icon-badge">
            <FaFileAlt className="text-[11px]" />
          </span>
          <span>
            {label}{" "}
            {required ? (
              <span className="text-rose-600 font-bold">*</span>
            ) : null}
          </span>
        </label>

        <div className="text-[11px] text-slate-500">
          {value.length}/{maxLength}
        </div>
      </div>

      <textarea
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={4}
        className={[inputBase, error ? inputErr : inputOk].join(" ")}
        placeholder="Extra notes..."
      />

      {error ? (
        <div className="mt-1 text-[11px] text-rose-700">{error}</div>
      ) : helperText ? (
        <div className="mt-1 text-[11px] text-slate-500">{helperText}</div>
      ) : null}
    </div>
  );
});

function AddTask() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [reportTo, setReportTo] = useState("");
  const [startAt, setStartAt] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const [toast, setToast] = useState({
    open: false,
    type: "success",
    text: "",
  });

  const toastTimerRef = useRef(null);

  const showToast = useCallback((type, text, ms = 2400) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    setToast({
      open: true,
      type,
      text,
    });

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

  const reset = useCallback(() => {
    setTitle("");
    setDetails("");
    setReportTo("");
    setStartAt("");
    setDueAt("");
    setErrors(INITIAL_ERRORS);
  }, []);

  const setFieldErrorClear = useCallback((key, setter, value) => {
    setter(value);
    setErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  }, []);

  const validateAll = useCallback(() => {
    const nextErrors = {
      title: validateField("Task title", title, { required: true }),
      details: validateField("Task details", details, { required: true }),
      reportTo: validateField("Manager / Report To", reportTo || "Self", {
        required: true,
      }),
      startAt: "",
      dueAt: "",
    };

    const sYMD = startAt || todayYMDLocal();
    const dYMD = dueAt || addDaysYMD(sYMD, 1);

    if (sYMD && dYMD && dYMD < sYMD) {
      nextErrors.dueAt = "Due date cannot be before start date.";
    }

    setErrors(nextErrors);

    const hasAnyError = Object.values(nextErrors).some(Boolean);

    return {
      ok: !hasAnyError,
      sYMD,
      dYMD,
    };
  }, [title, details, reportTo, startAt, dueAt]);

  const handleTitleBlur = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      title: validateField("Task title", title, { required: true }),
    }));
  }, [title]);

  const handleDetailsBlur = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      details: validateField("Task details", details, { required: true }),
    }));
  }, [details]);

  const handleReportToBlur = useCallback(() => {
    const candidate = reportTo || "Self";

    setErrors((prev) => ({
      ...prev,
      reportTo: validateField("Manager / Report To", candidate, {
        required: true,
      }),
    }));

    if (!normalizeText(reportTo)) {
      setReportTo("Self");
    }
  }, [reportTo]);

  const handleStartAtBlur = useCallback(() => {
    if (!startAt) {
      setStartAt(todayYMDLocal());
      setErrors((prev) => ({ ...prev, startAt: "" }));
    }
  }, [startAt]);

  const handleDueAtBlur = useCallback(() => {
    const s = startAt || todayYMDLocal();

    if (!dueAt) {
      setDueAt(addDaysYMD(s, 1));
      setErrors((prev) => ({ ...prev, dueAt: "" }));
      return;
    }

    if (dueAt < s) {
      setErrors((prev) => ({
        ...prev,
        dueAt: "Due date cannot be before start date.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, dueAt: "" }));
  }, [dueAt, startAt]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const { ok, sYMD, dYMD } = validateAll();

      if (!ok) {
        showToast("error", "Please fix the highlighted fields.");
        return;
      }

      const finalTitle = normalizeText(title);
      const finalDetails = normalizeText(details);
      const finalReportTo = normalizeText(reportTo) || "Self";

      try {
        setLoading(true);

        const token = getAuthToken();

        await axios.post(
          `${globalBackendRoute}/api/todos/create-tak`,
          {
            title: finalTitle,
            details: finalDetails,
            reportTo: finalReportTo,
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
    },
    [validateAll, showToast, title, details, reportTo, reset],
  );

  const handleReset = useCallback(() => {
    reset();
    showToast("success", "Form cleared.");
  }, [reset, showToast]);

  const rightTopLink = useMemo(
    () => (
      <Link to="/view-all-todo-list" className="primary-gradient-button">
        View All ToDo List
      </Link>
    ),
    [],
  );

  const notesList = useMemo(
    () => [
      "All fields are mandatory (*).",
      "No starting or ending spaces will be saved.",
      "Only special symbols are rejected. At least one letter or number is required.",
      "If Start Date is empty, it becomes today.",
      "If Due Date is empty, it becomes Start Date + 1 day.",
      'If Manager / Report To is empty, it becomes "Self".',
    ],
    [],
  );

  const summaryItems = useMemo(
    () => [
      {
        icon: <FaClipboardList className="text-indigo-600" />,
        label: "Task title",
        value: normalizeText(title) || "Not entered yet",
      },
      {
        icon: <FaFileAlt className="text-green-500" />,
        label: "Details",
        value: normalizeText(details) || "Not entered yet",
      },
      {
        icon: <FaRegUser className="text-amber-500" />,
        label: "Report to",
        value: normalizeText(reportTo) || "Self",
      },
      {
        icon: <FaCalendarAlt className="text-rose-500" />,
        label: "Start date",
        value: startAt || todayYMDLocal(),
      },
      {
        icon: <FaCalendarAlt className="text-red-500" />,
        label: "Due date",
        value: dueAt || addDaysYMD(startAt || todayYMDLocal(), 1),
      },
    ],
    [title, details, reportTo, startAt, dueAt],
  );

  return (
    <div className="service-page-wrap min-h-screen">
      <Toast toast={toast} onClose={closeToast} />

      <section className="service-hero-section" style={HERO_STYLE}>
        <div className="service-hero-overlay-1" />
        <div className="service-hero-overlay-2" />
        <div className="service-hero-overlay-3" />

        <div className="service-hero-container">
          <div className="service-hero-layout">
            <div>
              <div className="service-tag-row">
                {HERO_TAGS.map((item) => (
                  <span key={item} className="service-tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <h1 className="service-hero-title">
                Create a new{" "}
                <span className="service-hero-title-highlight">task</span>
              </h1>

              <p className="service-hero-text">
                Add your task title, notes, reporting person, and task dates in
                one place with clean validation and smooth task creation.
              </p>

              <div className="service-hero-status">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                Task creation is ready
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="service-main-wrap">
        <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[320px,minmax(0,1fr)] gap-8 lg:gap-10 items-start">
            {/* LEFT */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="glass-card p-5 sm:p-6"
            >
              <p className="service-badge-heading">Task preview</p>

              <div className="mt-5 flex flex-col gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
                  <FaClipboardList className="w-8 h-8 text-slate-400" />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 break-words">
                    {normalizeText(title) || "New task"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Personal To-Do Module
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-700">
                  <FaCheckCircle className="text-indigo-600" />
                  <span>Status: NEW</span>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-3">
                  {summaryItems.map((item, index) => (
                    <motion.div
                      key={`${item.label}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.04, duration: 0.26 }}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="form-icon-badge shrink-0">
                          {item.icon}
                        </span>

                        <div className="min-w-0">
                          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {item.label}
                          </div>
                          <div className="mt-1 text-sm text-slate-800 break-words">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    Validation rules
                  </div>
                  <ul className="mt-2 space-y-1 text-[12px] text-slate-600">
                    {notesList.map((item) => (
                      <li key={item} className="leading-5">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* RIGHT */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <div className="glass-card p-5 sm:p-6 lg:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="service-badge-heading">Create task</p>
                  {rightTopLink}
                </div>

                <p className="mt-3 form-help-text">
                  Fill in the task information below and submit it to create a
                  new to-do item.
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="grid grid-cols-1 gap-y-5">
                    <InputField
                      label="Task Title"
                      required={REQUIRED.title}
                      value={title}
                      onChange={(e) =>
                        setFieldErrorClear("title", setTitle, e.target.value)
                      }
                      onBlur={handleTitleBlur}
                      placeholder="Eg: Complete project documentation"
                      error={errors.title}
                      icon={<FaClipboardList className="text-[11px]" />}
                      autoFocus
                    />

                    <TextAreaField
                      label="Task Details"
                      required={REQUIRED.details}
                      value={details}
                      onChange={(e) =>
                        setFieldErrorClear(
                          "details",
                          setDetails,
                          e.target.value.slice(0, 500),
                        )
                      }
                      onBlur={handleDetailsBlur}
                      error={errors.details}
                      helperText=""
                      maxLength={500}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <InputField
                        label="Manager / Report To"
                        required={REQUIRED.reportTo}
                        value={reportTo}
                        onChange={(e) =>
                          setFieldErrorClear(
                            "reportTo",
                            setReportTo,
                            e.target.value,
                          )
                        }
                        onBlur={handleReportToBlur}
                        placeholder="Eg: Self / Manager name"
                        error={errors.reportTo}
                        helperText={
                          errors.reportTo
                            ? ""
                            : 'If empty, it will be saved as "Self".'
                        }
                        icon={<FaRegUser className="text-[11px]" />}
                      />

                      <DateField
                        label="Start Date"
                        required={REQUIRED.startAt}
                        value={startAt}
                        onChange={(e) =>
                          setFieldErrorClear(
                            "startAt",
                            setStartAt,
                            e.target.value,
                          )
                        }
                        onBlur={handleStartAtBlur}
                        error={errors.startAt}
                        helperText={
                          errors.startAt
                            ? ""
                            : "If empty, it will be saved as today."
                        }
                      />

                      <DateField
                        label="Due Date"
                        required={REQUIRED.dueAt}
                        value={dueAt}
                        onChange={(e) =>
                          setFieldErrorClear("dueAt", setDueAt, e.target.value)
                        }
                        onBlur={handleDueAtBlur}
                        error={errors.dueAt}
                        helperText={
                          errors.dueAt
                            ? ""
                            : "If empty, it will be saved as start date + 1 day."
                        }
                        min={startAt || undefined}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="primary-gradient-button disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Creating..." : "Create Task"}
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>

                  <div className="mt-4 text-[11px] text-slate-500">
                    Dates are saved as local date-only values to avoid timezone
                    shifts.
                  </div>
                </form>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(AddTask);
