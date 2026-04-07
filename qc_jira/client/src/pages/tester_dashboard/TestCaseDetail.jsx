// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   FaFileSignature,
//   FaAlignLeft,
//   FaPlus,
//   FaTrash,
//   FaArrowLeft,
//   FaCheckCircle,
//   FaFolderOpen,
//   FaClipboardList,
//   FaHistory,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const emptyStep = (n) => ({
//   step_number: n,
//   action_description: "",
//   input_data: "",
//   expected_result: "",
//   actual_result: "",
//   status: "Pending",
//   remark: "",
// });

// export default function UpdateTestCase() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [reviewUsers, setReviewUsers] = useState([]);
//   const [approverUsers, setApproverUsers] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [locks, setLocks] = useState({
//     canEditStatus: true,
//     isLockedByApproval: false,
//   });

//   const [testCase, setTestCase] = useState({
//     _id: "",
//     project_id: "",
//     project_name: "",
//     scenario_id: "",
//     scenario_number: "",
//     test_case_name: "",
//     requirement_number: "",
//     build_name_or_number: "",
//     module_name: "",
//     pre_condition: "",
//     test_data: "",
//     post_condition: "",
//     severity: "Medium",
//     test_case_type: "Functional",
//     brief_description: "",
//     test_execution_time: "",
//     testing_steps: [emptyStep(1)],
//     test_execution_type: "Manual",
//     footer: {
//       author: "",
//       reviewed_by: "",
//       approved_by: "",
//       approved_date: "",
//     },
//     createdAt: null,
//     updatedAt: null,
//   });

//   const token = useMemo(() => localStorage.getItem("token"), []);
//   const authHeaders = useMemo(
//     () => (token ? { Authorization: `Bearer ${token}` } : {}),
//     [token],
//   );

//   const refetchHistory = async () => {
//     try {
//       const histRes = await axios.get(
//         `${globalBackendRoute}/api/test-case/${id}/history`,
//         { headers: authHeaders },
//       );
//       setHistory(
//         Array.isArray(histRes.data?.history) ? histRes.data.history : [],
//       );
//     } catch {}
//   };

//   const load = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       if (!token) {
//         setError("You are not authorized. Please log in.");
//         setLoading(false);
//         return;
//       }

//       const [tcRes, reviewersRes, approversRes, histRes] = await Promise.all([
//         axios.get(`${globalBackendRoute}/api/get-test-case/${id}`, {
//           headers: authHeaders,
//         }),
//         axios.get(`${globalBackendRoute}/api/users/reviewers`, {
//           headers: authHeaders,
//         }),
//         axios.get(`${globalBackendRoute}/api/users/approvers`, {
//           headers: authHeaders,
//         }),
//         axios.get(`${globalBackendRoute}/api/test-case/${id}/history`, {
//           headers: authHeaders,
//         }),
//       ]);

//       const data = tcRes.data;
//       const steps =
//         Array.isArray(data.testing_steps) && data.testing_steps.length
//           ? data.testing_steps.map((s, i) => {
//               const raw = String(s?.status || "")
//                 .trim()
//                 .toLowerCase();
//               const status =
//                 raw === "fail" ? "Fail" : raw === "pass" ? "Pass" : "Pending";
//               return {
//                 step_number: i + 1,
//                 action_description: s.action_description || "",
//                 input_data: s.input_data || "",
//                 expected_result: s.expected_result || "",
//                 actual_result: s.actual_result || "",
//                 status,
//                 remark: s.remark || "",
//               };
//             })
//           : [emptyStep(1)];

//       setLocks({
//         canEditStatus: Boolean(tcRes.data?.__locks?.canEditStatus ?? true),
//         isLockedByApproval: Boolean(
//           tcRes.data?.__locks?.isLockedByApproval ?? false,
//         ),
//       });

//       setTestCase((prev) => ({
//         ...prev,
//         _id: data._id || id,
//         project_id: data.project_id || "",
//         project_name: data.project_name || "",
//         scenario_id: data.scenario_id || "",
//         scenario_number: data.scenario_number || "",
//         test_case_name: data.test_case_name || "",
//         requirement_number: data.requirement_number || "",
//         build_name_or_number: data.build_name_or_number || "",
//         module_name: data.module_name || "",
//         pre_condition: data.pre_condition || "",
//         test_data: data.test_data || "",
//         post_condition: data.post_condition || "",
//         severity: data.severity || "Medium",
//         test_case_type: data.test_case_type || "Functional",
//         brief_description: data.brief_description || "",
//         test_execution_time: data.test_execution_time || "",
//         testing_steps: steps,
//         test_execution_type: data.test_execution_type || "Manual",
//         footer: {
//           author: data.footer?.author || "",
//           reviewed_by: data.footer?.reviewed_by || "",
//           approved_by: data.footer?.approved_by || "",
//           approved_date: data.footer?.approved_date || "",
//         },
//         createdAt: data.createdAt || null,
//         updatedAt: data.updatedAt || null,
//       }));

//       setReviewUsers(Array.isArray(reviewersRes.data) ? reviewersRes.data : []);
//       setApproverUsers(
//         Array.isArray(approversRes.data) ? approversRes.data : [],
//       );
//       setHistory(
//         Array.isArray(histRes.data?.history) ? histRes.data.history : [],
//       );
//     } catch (err) {
//       console.error("UpdateTestCase load error:", err?.response?.data || err);
//       setError(
//         err?.response?.data?.message ||
//           "Failed to load test case or dropdown users.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, token]);

//   const statusFromSteps = useMemo(() => {
//     const steps = Array.isArray(testCase.testing_steps)
//       ? testCase.testing_steps
//       : [];
//     if (!steps.length) return "Pending";
//     const hasFail = steps.some(
//       (s) => String(s?.status || "").toLowerCase() === "fail",
//     );
//     if (hasFail) return "Fail";
//     const hasPending = steps.some(
//       (s) => String(s?.status || "").toLowerCase() === "pending",
//     );
//     return hasPending ? "Pending" : "Pass";
//   }, [testCase.testing_steps]);

//   const approvedDateValue =
//     testCase.footer.approved_date &&
//     String(testCase.footer.approved_date).includes("T")
//       ? String(testCase.footer.approved_date).split("T")[0]
//       : testCase.footer.approved_date || "";

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("footer.")) {
//       const key = name.split(".")[1];
//       setTestCase((prev) => ({
//         ...prev,
//         footer: { ...prev.footer, [key]: value },
//       }));
//       return;
//     }

//     if (name.startsWith("testing_steps.")) {
//       const [, idxStr, field] = name.split(".");
//       const index = Number(idxStr);
//       setTestCase((prev) => {
//         const nextSteps = [...prev.testing_steps];
//         nextSteps[index] = { ...nextSteps[index], [field]: value };
//         return { ...prev, testing_steps: nextSteps };
//       });
//       return;
//     }

//     setTestCase((prev) => ({ ...prev, [name]: value }));
//   };

//   const addTestingStep = () => {
//     setTestCase((prev) => {
//       const next = [
//         ...prev.testing_steps,
//         emptyStep(prev.testing_steps.length + 1),
//       ];
//       return { ...prev, testing_steps: next };
//     });
//   };

//   const removeTestingStep = (index) => {
//     setTestCase((prev) => {
//       const next = prev.testing_steps.filter((_, i) => i !== index);
//       const renumbered = next.length
//         ? next.map((s, i) => ({ ...s, step_number: i + 1 }))
//         : [emptyStep(1)];
//       return { ...prev, testing_steps: renumbered };
//     });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       if (!token) {
//         setError("You are not authorized. Please log in.");
//         setSaving(false);
//         return;
//       }

//       const payload = {
//         ...testCase,
//         testing_steps: testCase.testing_steps.map((s, i) => {
//           const raw = String(s.status || "")
//             .trim()
//             .toLowerCase();
//           const status =
//             raw === "fail" ? "Fail" : raw === "pass" ? "Pass" : "Pending";
//           return {
//             step_number: i + 1,
//             action_description: s.action_description || "",
//             input_data: s.input_data || "",
//             expected_result: s.expected_result || "",
//             actual_result: s.actual_result || "",
//             status,
//             remark: s.remark || "",
//           };
//         }),
//         footer: {
//           ...testCase.footer,
//           approved_date: approvedDateValue || "",
//         },
//         test_execution_type: testCase.test_execution_type || "Manual",
//       };

//       await axios.put(
//         `${globalBackendRoute}/api/update-test-case/${id}`,
//         payload,
//         { headers: authHeaders },
//       );

//       alert("Test case details updated successfully.");
//       await refetchHistory();
//       const res = await axios.get(
//         `${globalBackendRoute}/api/get-test-case/${id}`,
//         { headers: authHeaders },
//       );
//       setLocks({
//         canEditStatus: Boolean(res.data?.__locks?.canEditStatus ?? true),
//         isLockedByApproval: Boolean(
//           res.data?.__locks?.isLockedByApproval ?? false,
//         ),
//       });
//     } catch (err) {
//       const status = err?.response?.status;
//       const msg =
//         err?.response?.data?.message ||
//         (status === 403
//           ? "Step statuses are locked after approval. Only authorized users can modify them."
//           : "Failed to update test case.");

//       setError(msg);

//       if (status === 403) {
//         try {
//           const res = await axios.get(
//             `${globalBackendRoute}/api/get-test-case/${id}`,
//             { headers: authHeaders },
//           );
//           const data = res.data || {};
//           const steps =
//             Array.isArray(data.testing_steps) && data.testing_steps.length
//               ? data.testing_steps.map((s, i) => ({
//                   step_number: i + 1,
//                   action_description: s.action_description || "",
//                   input_data: s.input_data || "",
//                   expected_result: s.expected_result || "",
//                   actual_result: s.actual_result || "",
//                   status:
//                     String(s?.status || "").toLowerCase() === "fail"
//                       ? "Fail"
//                       : String(s?.status || "").toLowerCase() === "pass"
//                         ? "Pass"
//                         : "Pending",
//                   remark: s.remark || "",
//                 }))
//               : [emptyStep(1)];

//           setLocks({
//             canEditStatus: Boolean(res.data?.__locks?.canEditStatus ?? true),
//             isLockedByApproval: Boolean(
//               res.data?.__locks?.isLockedByApproval ?? false,
//             ),
//           });

//           setTestCase((prev) => ({
//             ...prev,
//             testing_steps: steps,
//             footer: {
//               author: data.footer?.author || "",
//               reviewed_by: data.footer?.reviewed_by || "",
//               approved_by: data.footer?.approved_by || "",
//               approved_date: data.footer?.approved_date || "",
//             },
//           }));
//         } catch {}
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white py-10 sm:py-12">
//         <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//           <p className="text-sm text-slate-600">Loading test case…</p>
//         </div>
//       </div>
//     );
//   }

//   const approvedBySelected = Boolean(
//     String(testCase.footer.approved_by || "").trim(),
//   );

//   const labelClass =
//     "mb-1 block text-sm font-semibold text-slate-700 tracking-wide";
//   const inputClass =
//     "block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
//   const inputReadOnlyClass =
//     "block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none";
//   const textareaClass =
//     "block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y";
//   const requiredStar = <span className="ml-1 text-red-500">*</span>;

//   const statusBadgeClass =
//     statusFromSteps === "Fail"
//       ? "border-rose-200 bg-rose-50 text-rose-700"
//       : statusFromSteps === "Pending"
//         ? "border-slate-200 bg-slate-50 text-slate-700"
//         : "border-emerald-200 bg-emerald-50 text-emerald-700";

//   return (
//     <div className="bg-white py-10 sm:py-12">
//       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="min-w-0">
//             <h2 className="flex items-center text-lg font-semibold tracking-tight text-indigo-600">
//               <FaFileSignature className="mr-2" />
//               Update Test Case
//             </h2>
//             <p className="mt-1 text-xs text-slate-600">
//               Edit the selected test case details and testing steps.
//             </p>

//             <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
//               <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
//                 #{testCase.test_case_number || "—"}
//               </span>
//               <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
//                 {testCase.module_name || "Unassigned"}
//               </span>
//               <span
//                 className={`inline-flex items-center rounded-full border px-2 py-0.5 font-semibold ${statusBadgeClass}`}
//               >
//                 {statusFromSteps}
//               </span>
//               <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
//                 Exec: {testCase.test_execution_type || "Manual"}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => navigate(-1)}
//               className="inline-flex items-center rounded-md bg-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-300"
//               title="Back"
//             >
//               <FaArrowLeft className="mr-1" />
//               Back
//             </button>

//             <Link
//               to={`/test-case-detail/${testCase._id}`}
//               className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-black"
//             >
//               View Test Case
//             </Link>

//             {testCase.project_id && (
//               <a
//                 href={`/single-project/${testCase.project_id}`}
//                 className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-800"
//               >
//                 Project Dashboard
//               </a>
//             )}
//           </div>
//         </div>

//         {locks.isLockedByApproval && (
//           <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//             <b>Status locked:</b> This test case is approved. Only authorized
//             users can change step statuses.
//           </div>
//         )}

//         {error && (
//           <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleUpdate} className="space-y-6">
//           <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="mb-4 flex items-center gap-2">
//               <FaFolderOpen className="text-indigo-600" />
//               <h3 className="text-base font-semibold text-slate-800">
//                 Project & Scenario
//               </h3>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//               <div>
//                 <label className={labelClass}>Project ID</label>
//                 <input
//                   type="text"
//                   className={inputReadOnlyClass}
//                   name="project_id"
//                   value={testCase.project_id || ""}
//                   readOnly
//                   placeholder="Project ID"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>Project Name</label>
//                 <input
//                   type="text"
//                   className={inputReadOnlyClass}
//                   name="project_name"
//                   value={testCase.project_name || ""}
//                   readOnly
//                   placeholder="Project name"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>Scenario ID</label>
//                 <input
//                   type="text"
//                   className={inputReadOnlyClass}
//                   name="scenario_id"
//                   value={testCase.scenario_id || ""}
//                   readOnly
//                   placeholder="Scenario ID"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>Scenario Number</label>
//                 <input
//                   type="text"
//                   className={inputReadOnlyClass}
//                   name="scenario_number"
//                   value={testCase.scenario_number || ""}
//                   readOnly
//                   placeholder="Scenario number"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="mb-4 flex items-center gap-2">
//               <FaClipboardList className="text-indigo-600" />
//               <h3 className="text-base font-semibold text-slate-800">
//                 Test Case Details
//               </h3>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//               <div>
//                 <label className={labelClass}>
//                   Test Case Name {requiredStar}
//                 </label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="test_case_name"
//                   value={testCase.test_case_name || ""}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter test case name"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>
//                   Requirement Number {requiredStar}
//                 </label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="requirement_number"
//                   value={testCase.requirement_number || ""}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter requirement number"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>
//                   Build Name / Number {requiredStar}
//                 </label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="build_name_or_number"
//                   value={testCase.build_name_or_number || ""}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter build name or number"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>Module Name {requiredStar}</label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="module_name"
//                   value={testCase.module_name || ""}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter module name"
//                 />
//               </div>
//             </div>

//             <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
//               <div>
//                 <label className={labelClass}>
//                   Pre Condition {requiredStar}
//                 </label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="pre_condition"
//                   value={testCase.pre_condition || ""}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter pre-condition"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>Test Data {requiredStar}</label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="test_data"
//                   value={testCase.test_data || ""}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter test data"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>
//                   Post Condition {requiredStar}
//                 </label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="post_condition"
//                   value={testCase.post_condition || ""}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter post-condition"
//                 />
//               </div>
//             </div>

//             <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
//               <div>
//                 <label className={labelClass}>Severity {requiredStar}</label>
//                 <select
//                   className={inputClass}
//                   name="severity"
//                   value={testCase.severity || "Medium"}
//                   onChange={handleChange}
//                   required
//                 >
//                   {["Low", "Medium", "Major", "Critical", "Blocker"].map(
//                     (option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClass}>
//                   Test Case Type {requiredStar}
//                 </label>
//                 <select
//                   className={inputClass}
//                   name="test_case_type"
//                   value={testCase.test_case_type || "Functional"}
//                   onChange={handleChange}
//                   required
//                 >
//                   {[
//                     "Functional",
//                     "Non-Functional",
//                     "Regression",
//                     "Smoke",
//                     "Sanity",
//                     "Integration",
//                     "GUI",
//                     "Adhoc",
//                     "Internationalization",
//                     "Localization",
//                   ].map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClass}>
//                   Test Execution Type {requiredStar}
//                 </label>
//                 <select
//                   className={inputClass}
//                   name="test_execution_type"
//                   value={testCase.test_execution_type || "Manual"}
//                   onChange={handleChange}
//                   required
//                 >
//                   {["Manual", "Automation", "Both"].map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClass}>Test Execution Time</label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="test_execution_time"
//                   value={testCase.test_execution_time || ""}
//                   onChange={handleChange}
//                   placeholder="e.g. 15 minutes"
//                 />
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className={labelClass}>
//                 Brief Description {requiredStar}
//               </label>
//               <textarea
//                 className={textareaClass}
//                 name="brief_description"
//                 value={testCase.brief_description || ""}
//                 onChange={handleChange}
//                 rows={3}
//                 placeholder="Write a brief description of the test case"
//                 required
//               />
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//               <div className="flex items-center gap-2">
//                 <FaAlignLeft className="text-purple-500" />
//                 <h3 className="text-base font-semibold text-slate-800">
//                   Testing Steps
//                 </h3>
//               </div>

//               <button
//                 type="button"
//                 className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-800 disabled:opacity-60"
//                 onClick={addTestingStep}
//                 disabled={!locks.canEditStatus}
//                 title={
//                   !locks.canEditStatus
//                     ? "Statuses locked after approval"
//                     : "Add step"
//                 }
//               >
//                 <FaPlus className="mr-1" />
//                 Add Step
//               </button>
//             </div>

//             <div className="hidden md:block">
//               <p className="mb-2 text-xs text-slate-500">
//                 Scroll horizontally to view all testing step columns.
//               </p>

//               <div className="overflow-x-auto rounded-xl border border-slate-200">
//                 <table className="w-full min-w-max table-auto divide-y divide-slate-200">
//                   <thead className="bg-slate-50">
//                     <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
//                       <th className="px-3 py-3 text-center whitespace-nowrap">
//                         Step #
//                       </th>
//                       <th className="px-3 py-3 whitespace-nowrap">
//                         Action Description
//                       </th>
//                       <th className="px-3 py-3 whitespace-nowrap">
//                         Input Data
//                       </th>
//                       <th className="px-3 py-3 whitespace-nowrap">
//                         Expected Result
//                       </th>
//                       <th className="px-3 py-3 whitespace-nowrap">
//                         Actual Result
//                       </th>
//                       <th className="px-3 py-3 whitespace-nowrap">Status</th>
//                       <th className="px-3 py-3 whitespace-nowrap">Remark</th>
//                       <th className="px-3 py-3 text-center whitespace-nowrap">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-200 bg-white">
//                     {testCase.testing_steps.map((step, index) => (
//                       <tr key={`step-${index}`} className="align-top">
//                         <td className="px-3 py-3 align-top">
//                           <div className="flex justify-center">
//                             <span className="inline-flex h-10 min-w-[42px] items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-3 text-sm font-semibold text-indigo-700">
//                               {step.step_number}
//                             </span>
//                           </div>
//                         </td>

//                         <td className="px-3 py-3 min-w-[220px]">
//                           <textarea
//                             placeholder="Describe the action to perform"
//                             className={textareaClass}
//                             name={`testing_steps.${index}.action_description`}
//                             value={step.action_description}
//                             onChange={handleChange}
//                             rows={2}
//                             required
//                           />
//                         </td>

//                         <td className="px-3 py-3 min-w-[180px]">
//                           <textarea
//                             placeholder="Enter input data"
//                             className={textareaClass}
//                             name={`testing_steps.${index}.input_data`}
//                             value={step.input_data}
//                             onChange={handleChange}
//                             rows={2}
//                           />
//                         </td>

//                         <td className="px-3 py-3 min-w-[220px]">
//                           <textarea
//                             placeholder="Enter expected result"
//                             className={textareaClass}
//                             name={`testing_steps.${index}.expected_result`}
//                             value={step.expected_result}
//                             onChange={handleChange}
//                             rows={2}
//                           />
//                         </td>

//                         <td className="px-3 py-3 min-w-[220px]">
//                           <textarea
//                             placeholder="Enter actual result"
//                             className={textareaClass}
//                             name={`testing_steps.${index}.actual_result`}
//                             value={step.actual_result}
//                             onChange={handleChange}
//                             rows={2}
//                           />
//                         </td>

//                         <td className="px-3 py-3 min-w-[150px]">
//                           <select
//                             className={`${inputClass} disabled:opacity-60`}
//                             name={`testing_steps.${index}.status`}
//                             value={step.status}
//                             onChange={handleChange}
//                             disabled={!locks.canEditStatus}
//                             title={
//                               !locks.canEditStatus
//                                 ? "Statuses locked after approval"
//                                 : ""
//                             }
//                           >
//                             <option value="Pass">Pass</option>
//                             <option value="Fail">Fail</option>
//                             <option value="Pending">Pending</option>
//                           </select>
//                         </td>

//                         <td className="px-3 py-3 min-w-[220px]">
//                           <textarea
//                             placeholder="Add remark"
//                             className={textareaClass}
//                             name={`testing_steps.${index}.remark`}
//                             value={step.remark}
//                             onChange={handleChange}
//                             rows={2}
//                           />
//                         </td>

//                         <td className="px-3 py-3 align-top">
//                           <div className="flex items-start justify-center">
//                             <button
//                               type="button"
//                               className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-rose-600 text-sm text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
//                               onClick={() => removeTestingStep(index)}
//                               title={
//                                 testCase.testing_steps.length <= 1
//                                   ? "At least one testing step is required"
//                                   : "Delete Step"
//                               }
//                               disabled={
//                                 !locks.canEditStatus ||
//                                 testCase.testing_steps.length <= 1
//                               }
//                             >
//                               <FaTrash />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="space-y-4 md:hidden">
//               <p className="text-xs text-slate-500">
//                 Testing steps are shown as cards on mobile for better
//                 readability.
//               </p>

//               {testCase.testing_steps.map((step, index) => (
//                 <div
//                   key={`mobile-step-${index}`}
//                   className="rounded-xl border border-slate-200 bg-slate-50 p-4"
//                 >
//                   <div className="mb-3 flex items-center justify-between">
//                     <span className="inline-flex h-9 min-w-[40px] items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-3 text-sm font-semibold text-indigo-700">
//                       {step.step_number}
//                     </span>

//                     <button
//                       type="button"
//                       className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md bg-rose-600 text-sm text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
//                       onClick={() => removeTestingStep(index)}
//                       title={
//                         testCase.testing_steps.length <= 1
//                           ? "At least one testing step is required"
//                           : "Delete Step"
//                       }
//                       disabled={
//                         !locks.canEditStatus ||
//                         testCase.testing_steps.length <= 1
//                       }
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>

//                   <div className="space-y-3">
//                     <div>
//                       <label className={labelClass}>Action Description</label>
//                       <textarea
//                         placeholder="Describe the action to perform"
//                         className={textareaClass}
//                         name={`testing_steps.${index}.action_description`}
//                         value={step.action_description}
//                         onChange={handleChange}
//                         rows={2}
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Input Data</label>
//                       <textarea
//                         placeholder="Enter input data"
//                         className={textareaClass}
//                         name={`testing_steps.${index}.input_data`}
//                         value={step.input_data}
//                         onChange={handleChange}
//                         rows={2}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Expected Result</label>
//                       <textarea
//                         placeholder="Enter expected result"
//                         className={textareaClass}
//                         name={`testing_steps.${index}.expected_result`}
//                         value={step.expected_result}
//                         onChange={handleChange}
//                         rows={2}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Actual Result</label>
//                       <textarea
//                         placeholder="Enter actual result"
//                         className={textareaClass}
//                         name={`testing_steps.${index}.actual_result`}
//                         value={step.actual_result}
//                         onChange={handleChange}
//                         rows={2}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Status</label>
//                       <select
//                         className={`${inputClass} disabled:opacity-60`}
//                         name={`testing_steps.${index}.status`}
//                         value={step.status}
//                         onChange={handleChange}
//                         disabled={!locks.canEditStatus}
//                         title={
//                           !locks.canEditStatus
//                             ? "Statuses locked after approval"
//                             : ""
//                         }
//                       >
//                         <option value="Pass">Pass</option>
//                         <option value="Fail">Fail</option>
//                         <option value="Pending">Pending</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className={labelClass}>Remark</label>
//                       <textarea
//                         placeholder="Add remark"
//                         className={textareaClass}
//                         name={`testing_steps.${index}.remark`}
//                         value={step.remark}
//                         onChange={handleChange}
//                         rows={2}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="mb-4 flex items-center gap-2">
//               <FaCheckCircle className="text-indigo-600" />
//               <h3 className="text-base font-semibold text-slate-800">
//                 Review & Approval
//               </h3>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//               <div>
//                 <label className={labelClass}>Author</label>
//                 <input
//                   type="text"
//                   className={inputClass}
//                   name="footer.author"
//                   value={testCase.footer.author || ""}
//                   onChange={handleChange}
//                   placeholder="Author name"
//                 />
//               </div>

//               <div>
//                 <label className={labelClass}>Reviewed By</label>
//                 <select
//                   className={inputClass}
//                   name="footer.reviewed_by"
//                   value={testCase.footer.reviewed_by || ""}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select reviewer</option>
//                   {reviewUsers.map((u) => (
//                     <option key={u._id} value={u.name}>
//                       {u.name} {u.role ? `(${u.role})` : ""}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClass}>Approved By</label>
//                 <select
//                   className={inputClass}
//                   name="footer.approved_by"
//                   value={testCase.footer.approved_by || ""}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select approver</option>
//                   {approverUsers.map((u) => (
//                     <option key={u._id} value={u.name}>
//                       {u.name} {u.role ? `(${u.role})` : ""}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClass}>Approved Date</label>
//                 <input
//                   type="date"
//                   className={
//                     !approvedBySelected ? inputReadOnlyClass : inputClass
//                   }
//                   name="footer.approved_date"
//                   value={approvedDateValue}
//                   onChange={handleChange}
//                   disabled={!approvedBySelected}
//                   title={
//                     !approvedBySelected ? "Select 'Approved By' first" : ""
//                   }
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end pt-2">
//             <button
//               type="submit"
//               disabled={saving}
//               className="inline-flex min-w-[190px] items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-70"
//             >
//               {saving ? "Updating…" : "Update Test Case"}
//             </button>
//           </div>
//         </form>

//         <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="mb-4 flex items-center gap-2">
//             <FaHistory className="text-indigo-600" />
//             <h3 className="text-base font-semibold text-slate-800">
//               Test Case History
//             </h3>
//           </div>

//           {history.length === 0 ? (
//             <p className="text-sm text-slate-600">No changes recorded yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {history.map((h, i) => (
//                 <div
//                   key={i}
//                   className="rounded-xl border border-slate-200 bg-slate-50 p-4"
//                 >
//                   <div className="mb-2 text-xs text-slate-600">
//                     <span className="font-medium text-indigo-700">{h.by}</span>
//                     {h.role ? (
//                       <span className="ml-1 text-slate-500">({h.role})</span>
//                     ) : null}
//                     <span className="mx-2">·</span>
//                     <span>{h.at ? new Date(h.at).toLocaleString() : ""}</span>
//                   </div>

//                   <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
//                     {(h.items || []).map((it, idx) => (
//                       <li
//                         key={idx}
//                         dangerouslySetInnerHTML={{
//                           __html: it.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
//                         }}
//                       />
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaFileSignature,
  FaAlignLeft,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaCheckCircle,
  FaFolderOpen,
  FaClipboardList,
  FaHistory,
  FaPlayCircle,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const emptyStep = (n) => ({
  step_number: n,
  action_description: "",
  input_data: "",
  expected_result: "",
  actual_result: "",
  status: "Pending",
  remark: "",
});

export default function UpdateTestCase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [reviewUsers, setReviewUsers] = useState([]);
  const [approverUsers, setApproverUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [locks, setLocks] = useState({
    canEditStatus: true,
    isLockedByApproval: false,
  });

  const [testCase, setTestCase] = useState({
    _id: "",
    project_id: "",
    project_name: "",
    scenario_id: "",
    scenario_number: "",
    test_case_number: "",
    test_case_name: "",
    requirement_number: "",
    build_name_or_number: "",
    module_name: "",
    pre_condition: "",
    test_data: "",
    post_condition: "",
    severity: "Medium",
    test_case_type: "Functional",
    brief_description: "",
    test_execution_time: "",
    testing_steps: [emptyStep(1)],
    test_execution_type: "Manual",
    footer: {
      author: "",
      reviewed_by: "",
      approved_by: "",
      approved_date: "",
    },
    createdAt: null,
    updatedAt: null,
  });

  const token = useMemo(() => localStorage.getItem("token"), []);
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token],
  );

  const refetchHistory = async () => {
    try {
      const histRes = await axios.get(
        `${globalBackendRoute}/api/test-case/${id}/history`,
        { headers: authHeaders },
      );
      setHistory(
        Array.isArray(histRes.data?.history) ? histRes.data.history : [],
      );
    } catch {}
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) {
        setError("You are not authorized. Please log in.");
        setLoading(false);
        return;
      }

      const [tcRes, reviewersRes, approversRes, histRes] = await Promise.all([
        axios.get(`${globalBackendRoute}/api/get-test-case/${id}`, {
          headers: authHeaders,
        }),
        axios.get(`${globalBackendRoute}/api/users/reviewers`, {
          headers: authHeaders,
        }),
        axios.get(`${globalBackendRoute}/api/users/approvers`, {
          headers: authHeaders,
        }),
        axios.get(`${globalBackendRoute}/api/test-case/${id}/history`, {
          headers: authHeaders,
        }),
      ]);

      const data = tcRes.data;
      const steps =
        Array.isArray(data.testing_steps) && data.testing_steps.length
          ? data.testing_steps.map((s, i) => {
              const raw = String(s?.status || "")
                .trim()
                .toLowerCase();
              const status =
                raw === "fail" ? "Fail" : raw === "pass" ? "Pass" : "Pending";
              return {
                step_number: i + 1,
                action_description: s.action_description || "",
                input_data: s.input_data || "",
                expected_result: s.expected_result || "",
                actual_result: s.actual_result || "",
                status,
                remark: s.remark || "",
              };
            })
          : [emptyStep(1)];

      setLocks({
        canEditStatus: Boolean(tcRes.data?.__locks?.canEditStatus ?? true),
        isLockedByApproval: Boolean(
          tcRes.data?.__locks?.isLockedByApproval ?? false,
        ),
      });

      setTestCase((prev) => ({
        ...prev,
        _id: data._id || id,
        project_id: data.project_id || "",
        project_name: data.project_name || "",
        scenario_id: data.scenario_id || "",
        scenario_number: data.scenario_number || "",
        test_case_number:
          data.test_case_number || data.testCaseNumber || data.tc_number || "",
        test_case_name: data.test_case_name || "",
        requirement_number: data.requirement_number || "",
        build_name_or_number: data.build_name_or_number || "",
        module_name: data.module_name || "",
        pre_condition: data.pre_condition || "",
        test_data: data.test_data || "",
        post_condition: data.post_condition || "",
        severity: data.severity || "Medium",
        test_case_type: data.test_case_type || "Functional",
        brief_description: data.brief_description || "",
        test_execution_time: data.test_execution_time || "",
        testing_steps: steps,
        test_execution_type: data.test_execution_type || "Manual",
        footer: {
          author: data.footer?.author || "",
          reviewed_by: data.footer?.reviewed_by || "",
          approved_by: data.footer?.approved_by || "",
          approved_date: data.footer?.approved_date || "",
        },
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      }));

      setReviewUsers(Array.isArray(reviewersRes.data) ? reviewersRes.data : []);
      setApproverUsers(
        Array.isArray(approversRes.data) ? approversRes.data : [],
      );
      setHistory(
        Array.isArray(histRes.data?.history) ? histRes.data.history : [],
      );
    } catch (err) {
      console.error("UpdateTestCase load error:", err?.response?.data || err);
      setError(
        err?.response?.data?.message ||
          "Failed to load test case or dropdown users.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const statusFromSteps = useMemo(() => {
    const steps = Array.isArray(testCase.testing_steps)
      ? testCase.testing_steps
      : [];
    if (!steps.length) return "Pending";
    const hasFail = steps.some(
      (s) => String(s?.status || "").toLowerCase() === "fail",
    );
    if (hasFail) return "Fail";
    const hasPending = steps.some(
      (s) => String(s?.status || "").toLowerCase() === "pending",
    );
    return hasPending ? "Pending" : "Pass";
  }, [testCase.testing_steps]);

  const approvedDateValue =
    testCase.footer.approved_date &&
    String(testCase.footer.approved_date).includes("T")
      ? String(testCase.footer.approved_date).split("T")[0]
      : testCase.footer.approved_date || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("footer.")) {
      const key = name.split(".")[1];
      setTestCase((prev) => ({
        ...prev,
        footer: { ...prev.footer, [key]: value },
      }));
      return;
    }

    if (name.startsWith("testing_steps.")) {
      const [, idxStr, field] = name.split(".");
      const index = Number(idxStr);
      setTestCase((prev) => {
        const nextSteps = [...prev.testing_steps];
        nextSteps[index] = { ...nextSteps[index], [field]: value };
        return { ...prev, testing_steps: nextSteps };
      });
      return;
    }

    setTestCase((prev) => ({ ...prev, [name]: value }));
  };

  const addTestingStep = () => {
    setTestCase((prev) => {
      const next = [
        ...prev.testing_steps,
        emptyStep(prev.testing_steps.length + 1),
      ];
      return { ...prev, testing_steps: next };
    });
  };

  const removeTestingStep = (index) => {
    setTestCase((prev) => {
      const next = prev.testing_steps.filter((_, i) => i !== index);
      const renumbered = next.length
        ? next.map((s, i) => ({ ...s, step_number: i + 1 }))
        : [emptyStep(1)];
      return { ...prev, testing_steps: renumbered };
    });
  };

  const handleGoToAddExecution = () => {
    if (!testCase.project_id) {
      alert("Project ID is missing for this test case.");
      return;
    }

    const executionPrefill = {
      source: "test-case-detail",
      project_id: testCase.project_id || "",
      project_name: testCase.project_name || "",
      scenario_id: testCase.scenario_id || "",
      scenario_number: testCase.scenario_number || "",
      test_case_id: testCase._id || "",
      test_case_number: testCase.test_case_number || "",
      test_case_name: testCase.test_case_name || "",
      module_name: testCase.module_name || "",
      requirement_number: testCase.requirement_number || "",
      build_name_or_number: testCase.build_name_or_number || "",
      test_execution_type: testCase.test_execution_type || "Manual",
      severity: testCase.severity || "Medium",
      test_case_type: testCase.test_case_type || "Functional",
      brief_description: testCase.brief_description || "",
      pre_condition: testCase.pre_condition || "",
      test_data: testCase.test_data || "",
      post_condition: testCase.post_condition || "",
      test_execution_time: testCase.test_execution_time || "",
      expected_result_snapshot: (testCase.testing_steps || [])
        .map((step) => String(step?.expected_result || "").trim())
        .filter(Boolean)
        .join(" | "),
      executed_steps: (testCase.testing_steps || []).map((step, index) => ({
        step_number: Number(step?.step_number || index + 1),
        action_description: step?.action_description || "",
        input_data: step?.input_data || "",
        expected_result: step?.expected_result || "",
        actual_result: step?.actual_result || "",
        status: "Not Run",
        remark: step?.remark || "",
      })),
    };

    navigate(`/single-project/${testCase.project_id}/add-test-execution`, {
      state: { executionPrefill },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!token) {
        setError("You are not authorized. Please log in.");
        setSaving(false);
        return;
      }

      const payload = {
        ...testCase,
        testing_steps: testCase.testing_steps.map((s, i) => {
          const raw = String(s.status || "")
            .trim()
            .toLowerCase();
          const status =
            raw === "fail" ? "Fail" : raw === "pass" ? "Pass" : "Pending";
          return {
            step_number: i + 1,
            action_description: s.action_description || "",
            input_data: s.input_data || "",
            expected_result: s.expected_result || "",
            actual_result: s.actual_result || "",
            status,
            remark: s.remark || "",
          };
        }),
        footer: {
          ...testCase.footer,
          approved_date: approvedDateValue || "",
        },
        test_execution_type: testCase.test_execution_type || "Manual",
      };

      await axios.put(
        `${globalBackendRoute}/api/update-test-case/${id}`,
        payload,
        { headers: authHeaders },
      );

      alert("Test case details updated successfully.");
      await refetchHistory();
      const res = await axios.get(
        `${globalBackendRoute}/api/get-test-case/${id}`,
        { headers: authHeaders },
      );
      setLocks({
        canEditStatus: Boolean(res.data?.__locks?.canEditStatus ?? true),
        isLockedByApproval: Boolean(
          res.data?.__locks?.isLockedByApproval ?? false,
        ),
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 403
          ? "Step statuses are locked after approval. Only authorized users can modify them."
          : "Failed to update test case.");

      setError(msg);

      if (status === 403) {
        try {
          const res = await axios.get(
            `${globalBackendRoute}/api/get-test-case/${id}`,
            { headers: authHeaders },
          );
          const data = res.data || {};
          const steps =
            Array.isArray(data.testing_steps) && data.testing_steps.length
              ? data.testing_steps.map((s, i) => ({
                  step_number: i + 1,
                  action_description: s.action_description || "",
                  input_data: s.input_data || "",
                  expected_result: s.expected_result || "",
                  actual_result: s.actual_result || "",
                  status:
                    String(s?.status || "").toLowerCase() === "fail"
                      ? "Fail"
                      : String(s?.status || "").toLowerCase() === "pass"
                        ? "Pass"
                        : "Pending",
                  remark: s.remark || "",
                }))
              : [emptyStep(1)];

          setLocks({
            canEditStatus: Boolean(res.data?.__locks?.canEditStatus ?? true),
            isLockedByApproval: Boolean(
              res.data?.__locks?.isLockedByApproval ?? false,
            ),
          });

          setTestCase((prev) => ({
            ...prev,
            testing_steps: steps,
            footer: {
              author: data.footer?.author || "",
              reviewed_by: data.footer?.reviewed_by || "",
              approved_by: data.footer?.approved_by || "",
              approved_date: data.footer?.approved_date || "",
            },
          }));
        } catch {}
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-10 sm:py-12">
        <div className="mx-auto container px-2 sm:px-3 lg:px-4">
          <p className="text-sm text-slate-600">Loading test case…</p>
        </div>
      </div>
    );
  }

  const approvedBySelected = Boolean(
    String(testCase.footer.approved_by || "").trim(),
  );

  const labelClass =
    "mb-1 block text-sm font-semibold text-slate-700 tracking-wide";
  const inputClass =
    "block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  const inputReadOnlyClass =
    "block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none";
  const textareaClass =
    "block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y";
  const requiredStar = <span className="ml-1 text-red-500">*</span>;

  const statusBadgeClass =
    statusFromSteps === "Fail"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : statusFromSteps === "Pending"
        ? "border-slate-200 bg-slate-50 text-slate-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="flex items-center text-lg font-semibold tracking-tight text-indigo-600">
              <FaFileSignature className="mr-2" />
              Update Test Case
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Edit the selected test case details and testing steps.
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                #{testCase.test_case_number || "—"}
              </span>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                {testCase.module_name || "Unassigned"}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 font-semibold ${statusBadgeClass}`}
              >
                {statusFromSteps}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                Exec: {testCase.test_execution_type || "Manual"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center rounded-md bg-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-300"
              title="Back"
            >
              <FaArrowLeft className="mr-1" />
              Back
            </button>

            <button
              type="button"
              onClick={handleGoToAddExecution}
              className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700"
              title="Add Test Execution Details"
            >
              <FaPlayCircle className="mr-1" />
              Add Test Execution Details
            </button>

            <Link
              to={`/test-case-detail/${testCase._id}`}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-black"
            >
              View Test Case
            </Link>

            {testCase.project_id && (
              <a
                href={`/single-project/${testCase.project_id}`}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-800"
              >
                Project Dashboard
              </a>
            )}
          </div>
        </div>

        {locks.isLockedByApproval && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <b>Status locked:</b> This test case is approved. Only authorized
            users can change step statuses.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FaFolderOpen className="text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-800">
                Project & Scenario
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className={labelClass}>Project ID</label>
                <input
                  type="text"
                  className={inputReadOnlyClass}
                  name="project_id"
                  value={testCase.project_id || ""}
                  readOnly
                  placeholder="Project ID"
                />
              </div>

              <div>
                <label className={labelClass}>Project Name</label>
                <input
                  type="text"
                  className={inputReadOnlyClass}
                  name="project_name"
                  value={testCase.project_name || ""}
                  readOnly
                  placeholder="Project name"
                />
              </div>

              <div>
                <label className={labelClass}>Scenario ID</label>
                <input
                  type="text"
                  className={inputReadOnlyClass}
                  name="scenario_id"
                  value={testCase.scenario_id || ""}
                  readOnly
                  placeholder="Scenario ID"
                />
              </div>

              <div>
                <label className={labelClass}>Scenario Number</label>
                <input
                  type="text"
                  className={inputReadOnlyClass}
                  name="scenario_number"
                  value={testCase.scenario_number || ""}
                  readOnly
                  placeholder="Scenario number"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FaClipboardList className="text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-800">
                Test Case Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className={labelClass}>
                  Test Case Name {requiredStar}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  name="test_case_name"
                  value={testCase.test_case_name || ""}
                  onChange={handleChange}
                  required
                  placeholder="Enter test case name"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Requirement Number {requiredStar}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  name="requirement_number"
                  value={testCase.requirement_number || ""}
                  onChange={handleChange}
                  required
                  placeholder="Enter requirement number"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Build Name / Number {requiredStar}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  name="build_name_or_number"
                  value={testCase.build_name_or_number || ""}
                  onChange={handleChange}
                  required
                  placeholder="Enter build name or number"
                />
              </div>

              <div>
                <label className={labelClass}>Module Name {requiredStar}</label>
                <input
                  type="text"
                  className={inputClass}
                  name="module_name"
                  value={testCase.module_name || ""}
                  onChange={handleChange}
                  required
                  placeholder="Enter module name"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>
                  Pre Condition {requiredStar}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  name="pre_condition"
                  value={testCase.pre_condition || ""}
                  onChange={handleChange}
                  required
                  placeholder="Enter pre-condition"
                />
              </div>

              <div>
                <label className={labelClass}>Test Data {requiredStar}</label>
                <input
                  type="text"
                  className={inputClass}
                  name="test_data"
                  value={testCase.test_data || ""}
                  onChange={handleChange}
                  required
                  placeholder="Enter test data"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Post Condition {requiredStar}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  name="post_condition"
                  value={testCase.post_condition || ""}
                  onChange={handleChange}
                  required
                  placeholder="Enter post-condition"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className={labelClass}>Severity {requiredStar}</label>
                <select
                  className={inputClass}
                  name="severity"
                  value={testCase.severity || "Medium"}
                  onChange={handleChange}
                  required
                >
                  {["Low", "Medium", "Major", "Critical", "Blocker"].map(
                    (option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Test Case Type {requiredStar}
                </label>
                <select
                  className={inputClass}
                  name="test_case_type"
                  value={testCase.test_case_type || "Functional"}
                  onChange={handleChange}
                  required
                >
                  {[
                    "Functional",
                    "Non-Functional",
                    "Regression",
                    "Smoke",
                    "Sanity",
                    "Integration",
                    "GUI",
                    "Adhoc",
                    "Internationalization",
                    "Localization",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Test Execution Type {requiredStar}
                </label>
                <select
                  className={inputClass}
                  name="test_execution_type"
                  value={testCase.test_execution_type || "Manual"}
                  onChange={handleChange}
                  required
                >
                  {["Manual", "Automation", "Both"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Test Execution Time</label>
                <input
                  type="text"
                  className={inputClass}
                  name="test_execution_time"
                  value={testCase.test_execution_time || ""}
                  onChange={handleChange}
                  placeholder="e.g. 15 minutes"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>
                Brief Description {requiredStar}
              </label>
              <textarea
                className={textareaClass}
                name="brief_description"
                value={testCase.brief_description || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Write a brief description of the test case"
                required
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FaAlignLeft className="text-purple-500" />
                <h3 className="text-base font-semibold text-slate-800">
                  Testing Steps
                </h3>
              </div>

              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-800 disabled:opacity-60"
                onClick={addTestingStep}
                disabled={!locks.canEditStatus}
                title={
                  !locks.canEditStatus
                    ? "Statuses locked after approval"
                    : "Add step"
                }
              >
                <FaPlus className="mr-1" />
                Add Step
              </button>
            </div>

            <div className="hidden md:block">
              <p className="mb-2 text-xs text-slate-500">
                Scroll horizontally to view all testing step columns.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-max table-auto divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <th className="px-3 py-3 text-center whitespace-nowrap">
                        Step #
                      </th>
                      <th className="px-3 py-3 whitespace-nowrap">
                        Action Description
                      </th>
                      <th className="px-3 py-3 whitespace-nowrap">
                        Input Data
                      </th>
                      <th className="px-3 py-3 whitespace-nowrap">
                        Expected Result
                      </th>
                      <th className="px-3 py-3 whitespace-nowrap">
                        Actual Result
                      </th>
                      <th className="px-3 py-3 whitespace-nowrap">Status</th>
                      <th className="px-3 py-3 whitespace-nowrap">Remark</th>
                      <th className="px-3 py-3 text-center whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {testCase.testing_steps.map((step, index) => (
                      <tr key={`step-${index}`} className="align-top">
                        <td className="px-3 py-3 align-top">
                          <div className="flex justify-center">
                            <span className="inline-flex h-10 min-w-[42px] items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-3 text-sm font-semibold text-indigo-700">
                              {step.step_number}
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-3 min-w-[220px]">
                          <textarea
                            placeholder="Describe the action to perform"
                            className={textareaClass}
                            name={`testing_steps.${index}.action_description`}
                            value={step.action_description}
                            onChange={handleChange}
                            rows={2}
                            required
                          />
                        </td>

                        <td className="px-3 py-3 min-w-[180px]">
                          <textarea
                            placeholder="Enter input data"
                            className={textareaClass}
                            name={`testing_steps.${index}.input_data`}
                            value={step.input_data}
                            onChange={handleChange}
                            rows={2}
                          />
                        </td>

                        <td className="px-3 py-3 min-w-[220px]">
                          <textarea
                            placeholder="Enter expected result"
                            className={textareaClass}
                            name={`testing_steps.${index}.expected_result`}
                            value={step.expected_result}
                            onChange={handleChange}
                            rows={2}
                          />
                        </td>

                        <td className="px-3 py-3 min-w-[220px]">
                          <textarea
                            placeholder="Enter actual result"
                            className={textareaClass}
                            name={`testing_steps.${index}.actual_result`}
                            value={step.actual_result}
                            onChange={handleChange}
                            rows={2}
                          />
                        </td>

                        <td className="px-3 py-3 min-w-[150px]">
                          <select
                            className={`${inputClass} disabled:opacity-60`}
                            name={`testing_steps.${index}.status`}
                            value={step.status}
                            onChange={handleChange}
                            disabled={!locks.canEditStatus}
                            title={
                              !locks.canEditStatus
                                ? "Statuses locked after approval"
                                : ""
                            }
                          >
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>

                        <td className="px-3 py-3 min-w-[220px]">
                          <textarea
                            placeholder="Add remark"
                            className={textareaClass}
                            name={`testing_steps.${index}.remark`}
                            value={step.remark}
                            onChange={handleChange}
                            rows={2}
                          />
                        </td>

                        <td className="px-3 py-3 align-top">
                          <div className="flex items-start justify-center">
                            <button
                              type="button"
                              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-rose-600 text-sm text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                              onClick={() => removeTestingStep(index)}
                              title={
                                testCase.testing_steps.length <= 1
                                  ? "At least one testing step is required"
                                  : "Delete Step"
                              }
                              disabled={
                                !locks.canEditStatus ||
                                testCase.testing_steps.length <= 1
                              }
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 md:hidden">
              <p className="text-xs text-slate-500">
                Testing steps are shown as cards on mobile for better
                readability.
              </p>

              {testCase.testing_steps.map((step, index) => (
                <div
                  key={`mobile-step-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex h-9 min-w-[40px] items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-3 text-sm font-semibold text-indigo-700">
                      {step.step_number}
                    </span>

                    <button
                      type="button"
                      className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md bg-rose-600 text-sm text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => removeTestingStep(index)}
                      title={
                        testCase.testing_steps.length <= 1
                          ? "At least one testing step is required"
                          : "Delete Step"
                      }
                      disabled={
                        !locks.canEditStatus ||
                        testCase.testing_steps.length <= 1
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Action Description</label>
                      <textarea
                        placeholder="Describe the action to perform"
                        className={textareaClass}
                        name={`testing_steps.${index}.action_description`}
                        value={step.action_description}
                        onChange={handleChange}
                        rows={2}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Input Data</label>
                      <textarea
                        placeholder="Enter input data"
                        className={textareaClass}
                        name={`testing_steps.${index}.input_data`}
                        value={step.input_data}
                        onChange={handleChange}
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Expected Result</label>
                      <textarea
                        placeholder="Enter expected result"
                        className={textareaClass}
                        name={`testing_steps.${index}.expected_result`}
                        value={step.expected_result}
                        onChange={handleChange}
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Actual Result</label>
                      <textarea
                        placeholder="Enter actual result"
                        className={textareaClass}
                        name={`testing_steps.${index}.actual_result`}
                        value={step.actual_result}
                        onChange={handleChange}
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Status</label>
                      <select
                        className={`${inputClass} disabled:opacity-60`}
                        name={`testing_steps.${index}.status`}
                        value={step.status}
                        onChange={handleChange}
                        disabled={!locks.canEditStatus}
                        title={
                          !locks.canEditStatus
                            ? "Statuses locked after approval"
                            : ""
                        }
                      >
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Remark</label>
                      <textarea
                        placeholder="Add remark"
                        className={textareaClass}
                        name={`testing_steps.${index}.remark`}
                        value={step.remark}
                        onChange={handleChange}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-800">
                Review & Approval
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className={labelClass}>Author</label>
                <input
                  type="text"
                  className={inputClass}
                  name="footer.author"
                  value={testCase.footer.author || ""}
                  onChange={handleChange}
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className={labelClass}>Reviewed By</label>
                <select
                  className={inputClass}
                  name="footer.reviewed_by"
                  value={testCase.footer.reviewed_by || ""}
                  onChange={handleChange}
                >
                  <option value="">Select reviewer</option>
                  {reviewUsers.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name} {u.role ? `(${u.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Approved By</label>
                <select
                  className={inputClass}
                  name="footer.approved_by"
                  value={testCase.footer.approved_by || ""}
                  onChange={handleChange}
                >
                  <option value="">Select approver</option>
                  {approverUsers.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name} {u.role ? `(${u.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Approved Date</label>
                <input
                  type="date"
                  className={
                    !approvedBySelected ? inputReadOnlyClass : inputClass
                  }
                  name="footer.approved_date"
                  value={approvedDateValue}
                  onChange={handleChange}
                  disabled={!approvedBySelected}
                  title={
                    !approvedBySelected ? "Select 'Approved By' first" : ""
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-[190px] items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-70"
            >
              {saving ? "Updating…" : "Update Test Case"}
            </button>
          </div>
        </form>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FaHistory className="text-indigo-600" />
            <h3 className="text-base font-semibold text-slate-800">
              Test Case History
            </h3>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-slate-600">No changes recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-2 text-xs text-slate-600">
                    <span className="font-medium text-indigo-700">{h.by}</span>
                    {h.role ? (
                      <span className="ml-1 text-slate-500">({h.role})</span>
                    ) : null}
                    <span className="mx-2">·</span>
                    <span>{h.at ? new Date(h.at).toLocaleString() : ""}</span>
                  </div>

                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
                    {(h.items || []).map((it, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: it.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                        }}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
