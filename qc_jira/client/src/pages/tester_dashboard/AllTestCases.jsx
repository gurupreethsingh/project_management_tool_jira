// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaSearch,
//   FaEye,
//   FaTrashAlt,
//   FaArrowLeft,
//   FaArrowRight,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const AllTestCases = () => {
//   const { projectId } = useParams();
//   const [testCases, setTestCases] = useState([]);
//   const [view, setView] = useState("list");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [totalTestCases, setTotalTestCases] = useState(0);
//   const [passedTestCasesCount, setPassedTestCasesCount] = useState(0);
//   const [failedTestCasesCount, setFailedTestCasesCount] = useState(0);
//   const [filteredTestCases, setFilteredTestCases] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);

//   // Derived helpers
//   const getTestStatus = (testCase) => {
//     const steps = Array.isArray(testCase?.testing_steps)
//       ? testCase.testing_steps
//       : [];
//     const hasFailed = steps.some(
//       (s) => String(s?.status).toLowerCase() === "fail"
//     );
//     return hasFailed ? "Fail" : "Pass";
//   };

//   const recomputeCounts = (rows) => {
//     const passed = rows.filter((tc) => getTestStatus(tc) === "Pass").length;
//     const failed = rows.length - passed;
//     setTotalTestCases(rows.length);
//     setPassedTestCasesCount(passed);
//     setFailedTestCasesCount(failed);
//   };

//   // Fetch all test cases for the project
//   useEffect(() => {
//     const fetchTestCases = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}/all-test-cases`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const rows = Array.isArray(res.data) ? res.data : [];
//         setTestCases(rows);
//         setFilteredTestCases(rows);
//         recomputeCounts(rows);
//         setTotalPages(Math.max(1, Math.ceil(rows.length / itemsPerPage)));
//         setCurrentPage(1);
//       } catch (error) {
//         console.error("Error fetching test cases:", error);
//       }
//     };
//     fetchTestCases();
//   }, [projectId, itemsPerPage]);

//   // Filter by search
//   useEffect(() => {
//     const q = String(searchQuery || "").toLowerCase();
//     const rows = testCases.filter((tc) => {
//       const name = String(tc?.test_case_name || "").toLowerCase();
//       const req = String(tc?.requirement_number || "").toLowerCase();
//       const mod = String(tc?.module_name || "").toLowerCase();
//       return [name, req, mod].some((f) => f.includes(q));
//     });
//     setFilteredTestCases(rows);
//     recomputeCounts(rows);
//     const pages = Math.max(1, Math.ceil(rows.length / itemsPerPage));
//     setTotalPages(pages);
//     if (currentPage > pages) setCurrentPage(1);
//   }, [searchQuery, testCases, itemsPerPage]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentTestCases = filteredTestCases.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     setCurrentPage(newPage);
//   };

//   const handleDelete = async (id) => {
//     const userConfirmed = window.confirm(
//       "Are you sure you want to delete this test case? This action is irreversible."
//     );
//     if (!userConfirmed) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${globalBackendRoute}/api/delete-test-case/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove locally and recompute
//       const updated = testCases.filter((tc) => tc._id !== id);
//       setTestCases(updated);
//       const filtered = updated.filter((tc) => {
//         const q = String(searchQuery || "").toLowerCase();
//         const name = String(tc?.test_case_name || "").toLowerCase();
//         const req = String(tc?.requirement_number || "").toLowerCase();
//         const mod = String(tc?.module_name || "").toLowerCase();
//         return [name, req, mod].some((f) => f.includes(q));
//       });
//       setFilteredTestCases(filtered);
//       recomputeCounts(filtered);
//       const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
//       setTotalPages(pages);
//       if (currentPage > pages) setCurrentPage(pages);

//       alert("Test case deleted successfully.");
//     } catch (error) {
//       console.error("Error deleting test case:", error);
//       alert(
//         error?.response?.data?.message ||
//           "Error deleting test case. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="bg-white py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <div className="flex justify-between items-center flex-wrap">
//           <div>
//             <h2 className="text-left font-semibold tracking-tight text-indigo-600 sm:text-1xl">
//               All Test Cases for Project: {projectId}
//             </h2>
//             <p className="text-sm text-gray-600 mt-2">
//               Total Test Cases: {totalTestCases} | Passed:{" "}
//               {passedTestCasesCount} | Failed: {failedTestCasesCount}
//             </p>
//             {searchQuery && (
//               <p className="text-sm text-gray-600">
//                 Showing {filteredTestCases.length} result(s) for "{searchQuery}"
//               </p>
//             )}
//           </div>
//           <div className="flex items-center space-x-4 flex-wrap">
//             <FaThList
//               className={`text-xl cursor-pointer ${
//                 view === "list" ? "text-blue-400" : "text-gray-500"
//               }`}
//               onClick={() => setView("list")}
//             />
//             <FaThLarge
//               className={`text-xl cursor-pointer ${
//                 view === "card" ? "text-blue-400" : "text-gray-500"
//               }`}
//               onClick={() => setView("card")}
//             />
//             <FaTh
//               className={`text-xl cursor-pointer ${
//                 view === "grid" ? "text-blue-400" : "text-gray-500"
//               }`}
//               onClick={() => setView("grid")}
//             />
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
//                 placeholder="Search test cases..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div>
//               <a
//                 href="/test-case-dashboard"
//                 className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
//               >
//                 Test Case Dashboard
//               </a>
//             </div>
//             <div>
//               <a
//                 href={`/single-project/${projectId}`}
//                 className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
//               >
//                 Project Dashboard
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* List View */}
//         {view === "list" && (
//           <div className="mt-10 space-y-6">
//             {currentTestCases.map((testCase) => (
//               <div
//                 key={testCase._id}
//                 className="flex items-center justify-between bg-white rounded-lg shadow relative p-4"
//               >
//                 <div className="flex flex-1 space-x-4">
//                   <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
//                     <span className="text-sm font-semibold text-gray-600">
//                       Test Case Name
//                     </span>
//                     <span className="text-sm text-gray-900">
//                       {testCase?.test_case_name || "-"}
//                     </span>
//                   </div>

//                   <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
//                     <span className="text-sm font-semibold text-gray-600">
//                       Test Case Number
//                     </span>
//                     <span className="text-sm text-gray-900">
//                       {testCase?.test_case_number || "-"}
//                     </span>
//                   </div>

//                   <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
//                     <span className="text-sm font-semibold text-gray-600">
//                       Module
//                     </span>
//                     <span className="text-sm text-gray-900">
//                       {testCase?.module_name || "-"}
//                     </span>
//                   </div>

//                   <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
//                     <span className="text-sm font-semibold text-gray-600">
//                       Test Status
//                     </span>
//                     <span
//                       className={`text-sm font-bold ${
//                         getTestStatus(testCase) === "Pass"
//                           ? "text-green-500"
//                           : "text-red-500"
//                       }`}
//                     >
//                       {getTestStatus(testCase)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex space-x-4 items-center w-1/12">
//                   <Link
//                     to={`/test-case-detail/${testCase._id}`}
//                     className="text-blue-400 hover:text-blue-500 text-sm"
//                   >
//                     <FaEye className="text-lg" />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(testCase._id)}
//                     className="text-red-400 hover:text-red-500 text-sm"
//                   >
//                     <FaTrashAlt className="text-lg" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Grid View */}
//         {view === "grid" && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-10">
//             {currentTestCases.map((testCase) => (
//               <div
//                 key={testCase._id}
//                 className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
//               >
//                 <div>
//                   <div className="text-sm font-semibold text-gray-600">
//                     <span className="font-semibold">TC-Name:</span>{" "}
//                     {testCase?.test_case_name || "-"}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <span className="font-semibold">TC-Number:</span>{" "}
//                     {testCase?.test_case_number || "-"}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <span className="font-semibold">Module:</span>{" "}
//                     {testCase?.module_name || "-"}
//                   </div>
//                 </div>
//                 <div className="mt-2 flex justify-between">
//                   <Link
//                     to={`/test-case-detail/${testCase._id}`}
//                     className="text-blue-400 hover:text-blue-500 text-sm"
//                   >
//                     <FaEye className="text-sm" />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(testCase._id)}
//                     className="text-red-400 hover:text-red-500 text-sm"
//                   >
//                     <FaTrashAlt className="text-sm" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Card View */}
//         {view === "card" && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
//             {currentTestCases.map((testCase) => (
//               <div
//                 key={testCase._id}
//                 className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
//               >
//                 <div>
//                   <div className="text-sm font-semibold text-gray-600">
//                     Test Case Name: {testCase?.test_case_name || "-"}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <span className="font-semibold">TC-Number:</span>{" "}
//                     {testCase?.test_case_number || "-"}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <span className="font-semibold">Module: </span>{" "}
//                     {testCase?.module_name || "-"}
//                   </div>
//                 </div>
//                 <div className="mt-2 flex justify-between">
//                   <Link
//                     to={`/test-case-detail/${testCase._id}`}
//                     className="text-blue-400 hover:text-blue-500 text-sm"
//                   >
//                     <FaEye className="text-sm" />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(testCase._id)}
//                     className="text-red-400 hover:text-red-500 text-sm"
//                   >
//                     <FaTrashAlt className="text-sm" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         <div className="flex justify-center items-center space-x-2 mt-10">
//           <button
//             className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
//             disabled={currentPage === 1}
//             onClick={() => handlePageChange(currentPage - 1)}
//           >
//             <FaArrowLeft className="text-xl" />
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
//             disabled={currentPage === totalPages}
//             onClick={() => handlePageChange(currentPage + 1)}
//           >
//             <FaArrowRight className="text-xl" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllTestCases;


// old layout. 

import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaEye,
  FaTrashAlt,
  FaArrowLeft,
  FaArrowRight,
  FaSort,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

export default function AllTestCases() {
  const { projectId } = useParams();

  // ---- state ----
  const [testCases, setTestCases] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");

  const [totalTestCases, setTotalTestCases] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  // pass/fail counters (recomputed from filtered list)
  const [passedCount, setPassedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  // Module filter (supports either embedded module {name} or flat module_name)
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // ---- helpers ----
  const norm = (v) => (v ?? "").toString().toLowerCase();

  const getTestStatus = (tc) => {
    const steps = Array.isArray(tc?.testing_steps) ? tc.testing_steps : [];
    const hasFailed = steps.some((s) => String(s?.status).toLowerCase() === "fail");
    return hasFailed ? "Fail" : "Pass";
  };

  // ---- fetch ----
  useEffect(() => {
    const fetchTCs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/all-test-cases`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const rows = Array.isArray(res.data) ? res.data : [];
        setTestCases(rows);
        setTotalTestCases(rows.length);
      } catch (err) {
        console.error("Error fetching test cases:", err);
      }
    };
    fetchTCs();
  }, [projectId]);

  // ---- debounce search ----
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ---- module chips from dataset ----
  // Build a synthetic "module id" so the chips work even if you only have module_name (string).
  // If you do have tc.module._id, we will prefer that.
  const modules = useMemo(() => {
    const counts = new Map(); // key -> { _id, name, count }
    for (const tc of testCases) {
      const modObj = tc?.module;
      const modId =
        (modObj && (modObj._id || modObj.id)) ||
        (tc?.module_name ? `name:${tc.module_name}` : "__unassigned__");
      const modName =
        (modObj && (modObj.name || modObj.module_name)) ||
        tc?.module_name ||
        "Unassigned";

      if (!counts.has(modId)) counts.set(modId, { _id: modId, name: modName, count: 0 });
      counts.get(modId).count += 1;
    }
    return Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [testCases]);

  // ---- filtered (search + module) ----
  const filtered = useMemo(() => {
    const q = norm(debouncedQuery);

    const rows = testCases.filter((tc) => {
      // module match
      if (selectedModuleId) {
        const modObj = tc?.module;
        const modIdCandidate =
          (modObj && (modObj._id || modObj.id)) ||
          (tc?.module_name ? `name:${tc.module_name}` : "__unassigned__");
        if (modIdCandidate !== selectedModuleId) return false;
      }

      // search fields
      const fields = [
        norm(tc?.test_case_name),
        norm(tc?.test_case_number),
        norm(tc?.module?.name || tc?.module_name || "Unassigned"),
        norm(tc?.requirement_number),
        norm(tc?.project?.project_name),
        norm(tc?.createdBy?.name),
      ];
      return q ? fields.some((f) => f.includes(q)) : true;
    });

    // recompute pass/fail on filtered set
    let pass = 0;
    let fail = 0;
    for (const r of rows) {
      if (getTestStatus(r) === "Pass") pass += 1;
      else fail += 1;
    }
    setPassedCount(pass);
    setFailedCount(fail);

    return rows;
  }, [testCases, debouncedQuery, selectedModuleId]);

  // ---- pagination + counts sync ----
  useEffect(() => {
    setFilteredCount(filtered.length);
    const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(p, pages));
  }, [filtered, itemsPerPage]);

  // ---- sort by createdAt ----
  const handleSort = () => {
    const sorted = [...testCases].sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setTestCases(sorted);
    setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
  };

  // ---- pagination slice ----
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  // ---- delete ----
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this test case? This action is irreversible."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${globalBackendRoute}/api/delete-test-case/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      alert("Test case deleted successfully.");
      const updated = testCases.filter((t) => t._id !== id);
      setTestCases(updated);
      setTotalTestCases(updated.length);
    } catch (error) {
      console.error("Error deleting test case:", error);
      alert(
        error?.response?.data?.message ||
          "Error deleting test case. Please try again."
      );
    }
  };

  const onModuleClick = (id) => {
    setSelectedModuleId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const clearModuleSelection = () => {
    setSelectedModuleId(null);
    setCurrentPage(1);
  };

  // ---- UI ----
  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header / Controls (identical layout to AllScenarios) */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Test Cases for Project: {projectId}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Total Test Cases: {totalTestCases}
            </p>
            {(searchQuery || selectedModuleId) && (
              <p className="text-xs text-gray-600">
                Showing {filteredCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedModuleId ? " in selected module" : null}
              </p>
            )}
            {/* pass/fail badges (kept subtle) */}
            <p className="text-[11px] text-slate-600 mt-1">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 mr-1 font-medium text-emerald-700">
                Pass: {passedCount}
              </span>
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 font-medium text-rose-700">
                Fail: {failedCount}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <FaThList
              className={`text-lg cursor-pointer ${
                view === "list" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-lg cursor-pointer ${
                view === "card" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("card")}
              title="Card view"
            />
            <FaTh
              className={`text-lg cursor-pointer ${
                view === "grid" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
              title="Grid view"
            />

            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                placeholder="Search test cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={handleSort}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
            >
              <FaSort className="mr-1" />
              Sort ({sortOrder === "asc" ? "Oldest" : "Newest"})
            </button>

            <a
              href={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              Project Dashboard
            </a>
          </div>
        </div>

        {/* Module chips row (identical pattern) */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700">
              Filter by Module
            </h3>
            <button
              onClick={clearModuleSelection}
              className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
            >
              Clear
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {modules.map((m) => {
              const active = selectedModuleId === m._id;
              return (
                <button
                  key={m._id}
                  onClick={() => onModuleClick(m._id)}
                  className={[
                    "whitespace-nowrap px-3 py-1 rounded-full border text-[12px]",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  ].join(" ")}
                  title={`${m.name} (${m.count})`}
                >
                  {m.name} <span className="opacity-70 ml-1">({m.count})</span>
                </button>
              );
            })}
            {modules.length === 0 && (
              <span className="text-slate-500 text-sm">No modules found</span>
            )}
          </div>
        </div>

        {/* List View (compact, single global header) */}
        {view === "list" && (
          <div className="mt-5">
            {/* global header */}
            <div className="grid grid-cols-[56px,140px,1fr,160px,140px,90px,40px,40px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-2 00">
              <div>#</div>
              <div>TC Number</div>
              <div>Name</div>
              <div>Module</div>
              <div>Requirement</div>
              <div>Status</div>
              <div className="text-center">View</div>
              <div className="text-center">Del</div>
            </div>

            {/* rows */}
            <div className="divide-y divide-slate-200">
              {current.map((tc, idx) => (
                <div
                  key={tc._id}
                  className="grid grid-cols-[56px,140px,1fr,160px,140px,90px,40px,40px] items-center text-[12px] px-3 py-2"
                >
                  <div className="text-slate-700">{indexOfFirst + idx + 1}</div>

                  <div className="text-slate-900 font-medium truncate">
                    {tc?.test_case_number || "-"}
                  </div>

                  <div className="text-slate-700 line-clamp-2">
                    {tc?.test_case_name || "-"}
                  </div>

                  <div className="truncate">
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {tc?.module?.name || tc?.module_name || "Unassigned"}
                    </span>
                  </div>

                  <div className="text-slate-700 truncate">
                    {tc?.requirement_number || "-"}
                  </div>

                  <div
                    className={`font-semibold ${
                      getTestStatus(tc) === "Pass" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {getTestStatus(tc)}
                  </div>

                  {/* View column */}
                  <div className="flex justify-center">
                    <Link
                      to={`/test-case-detail/${tc._id}`}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="View"
                    >
                      <FaEye className="text-sm" />
                    </Link>
                  </div>

                  {/* Delete column */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDelete(tc._id)}
                      className="text-rose-600 hover:text-rose-800"
                      title="Delete"
                    >
                      <FaTrashAlt className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid View */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
            {current.map((tc) => (
              <div
                key={tc._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>TC: {tc?.test_case_number || "-"}</span>
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {tc?.module?.name || tc?.module_name || "Unassigned"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
                    {tc?.test_case_name || "-"}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600">
                    Requirement: {tc?.requirement_number || "-"}
                  </div>
                  <div
                    className={`mt-1 text-[12px] font-semibold ${
                      getTestStatus(tc) === "Pass" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {getTestStatus(tc)}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/test-case-detail/${tc._id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(tc._id)}
                    className="text-rose-500 hover:text-rose-700 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {current.map((tc) => (
              <div
                key={tc._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>TC: {tc?.test_case_number || "-"}</span>
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {tc?.module?.name || tc?.module_name || "Unassigned"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
                    {tc?.test_case_name || "-"}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600">
                    Requirement: {tc?.requirement_number || "-"}
                  </div>
                  <div
                    className={`mt-1 text-[12px] font-semibold ${
                      getTestStatus(tc) === "Pass" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {getTestStatus(tc)}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/test-case-detail/${tc._id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(tc._id)}
                    className="text-rose-500 hover:text-rose-700 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination (identical controls) */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
