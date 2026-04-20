// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";

// const UNASSIGNED_LABEL = "Unassigned";

// export default function SingleScenario() {
//   const { projectId, scenarioId } = useParams();
//   const [scenario, setScenario] = useState(null);
//   const [changes, setChanges] = useState([]);
//   const [updatedText, setUpdatedText] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // modules state (for management)
//   const [allModules, setAllModules] = useState([]); // [{_id, name}, ...]
//   const [selectedForReplace, setSelectedForReplace] = useState([]); // multi-select state
//   const [addModuleId, setAddModuleId] = useState(""); // quick add select

//   const token = useMemo(() => localStorage.getItem("token"), []);
//   const userId = useMemo(() => localStorage.getItem("userId"), []);

//   const authHeaders = useMemo(
//     () => (token ? { Authorization: `Bearer ${token}` } : {}),
//     [token],
//   );

//   const fetchScenario = async () => {
//     try {
//       const { data } = await axios.get(
//         `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
//         { headers: authHeaders },
//       );
//       setScenario(data.scenario);
//       setChanges(data.changes || []);
//       setUpdatedText(data.scenario?.scenario_text || "");

//       // initialize the replace multiselect from scenario.modules
//       const currentIds = (data.scenario?.modules || [])
//         .filter(Boolean)
//         .map((m) => (typeof m === "object" ? m._id : m));
//       setSelectedForReplace(currentIds);
//     } catch (err) {
//       console.error("Error fetching scenario details:", err);
//       alert("Failed to load scenario.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllModules = async () => {
//     try {
//       const { data } = await axios.get(
//         `${globalBackendRoute}/api/single-projects/${projectId}/modules`,
//         { headers: authHeaders },
//       );
//       setAllModules(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error loading modules:", err);
//       setAllModules([]);
//     }
//   };

//   useEffect(() => {
//     fetchScenario();
//     fetchAllModules();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId, scenarioId]);

//   const handleUpdateScenarioText = async () => {
//     if (!userId) {
//       alert("User ID not found. Please log in.");
//       return;
//     }
//     if (!updatedText.trim()) {
//       alert("Scenario text cannot be empty.");
//       return;
//     }
//     setSaving(true);
//     try {
//       await axios.put(
//         `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
//         { scenario_text: updatedText, userId },
//         { headers: authHeaders },
//       );
//       // optimistic
//       setScenario((prev) =>
//         prev ? { ...prev, scenario_text: updatedText } : prev,
//       );
//       await fetchScenario();
//       alert("Scenario updated successfully.");
//     } catch (err) {
//       console.error("Error updating scenario:", err);
//       alert("Error updating scenario");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* --------------------- Module helpers & actions --------------------- */

//   const getAssignedModules = (s) =>
//     Array.isArray(s?.modules) ? s.modules.filter(Boolean) : [];

//   const assignedModules = getAssignedModules(scenario);
//   const assignedIds = new Set(assignedModules.map((m) => String(m._id)));

//   const unassignedLabel = assignedModules.length === 0 ? UNASSIGNED_LABEL : "";

//   // Quick add: add another module (non-replacing)
//   const handleAddModule = async () => {
//     if (!addModuleId) return;
//     try {
//       await axios.post(
//         `${globalBackendRoute}/api/single-projects/${projectId}/scenarios/transfer`,
//         { scenarioIds: [scenarioId], toModuleId: addModuleId },
//         { headers: authHeaders },
//       );
//       await fetchScenario();
//       alert("Module added to scenario.");
//       setAddModuleId("");
//     } catch (err) {
//       console.error("Error adding module:", err);
//       alert("Failed to add module.");
//     }
//   };

//   // Remove a single module: we replace the full set minus this id
//   const handleRemoveModule = async (removeId) => {
//     const nextIds = (scenario?.modules || [])
//       .map((m) => (typeof m === "object" ? m._id : m))
//       .filter((id) => String(id) !== String(removeId));

//     try {
//       await axios.put(
//         `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
//         { moduleIds: nextIds, userId }, // full replacement, controller keeps legacy `module` in sync
//         { headers: authHeaders },
//       );
//       await fetchScenario();
//       alert("Module removed from scenario.");
//     } catch (err) {
//       console.error("Error removing module:", err);
//       alert("Failed to remove module.");
//     }
//   };

//   // Make Unassigned: clear all modules
//   const handleMakeUnassigned = async () => {
//     try {
//       await axios.post(
//         `${globalBackendRoute}/api/single-projects/${projectId}/scenarios/detach`,
//         { scenarioIds: [scenarioId] },
//         { headers: authHeaders },
//       );
//       await fetchScenario();
//       alert("Scenario is now Unassigned.");
//     } catch (err) {
//       console.error("Error detaching scenario:", err);
//       alert("Failed to make Unassigned.");
//     }
//   };

//   // Full replace using the multiselect
//   const handleReplaceModules = async () => {
//     try {
//       await axios.put(
//         `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
//         { moduleIds: selectedForReplace, userId },
//         { headers: authHeaders },
//       );
//       await fetchScenario();
//       alert("Modules updated.");
//     } catch (err) {
//       console.error("Error replacing modules:", err);
//       alert("Failed to replace modules.");
//     }
//   };

//   const toggleReplaceSelection = (id) => {
//     setSelectedForReplace((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

//   const createdAtText = useMemo(
//     () =>
//       scenario?.createdAt ? new Date(scenario.createdAt).toLocaleString() : "",
//     [scenario?.createdAt],
//   );

//   if (loading)
//     return <div className="p-6 text-sm text-slate-600">Loading…</div>;
//   if (!scenario)
//     return <div className="p-6 text-sm text-rose-700">Scenario not found.</div>;

//   return (
//     <div className="bg-white py-10 sm:py-12">
//       <div className="mx-auto container px-4 sm:px-6 lg:px-8">
//         {/* Top bar */}
//         <div className="flex justify-between items-center gap-3 flex-wrap mb-4">
//           <div>
//             <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
//               Project: {scenario?.project?.project_name || "—"}
//             </h2>

//             {/* Scenario + Modules */}
//             <div className="text-xs text-slate-600 mt-1">
//               <span>
//                 Scenario:{" "}
//                 <span className="font-semibold text-slate-800">
//                   {scenario.scenario_number}
//                 </span>
//               </span>
//               <span className="mx-2">·</span>
//               <span className="font-semibold text-slate-700">
//                 Modules:
//               </span>{" "}
//               {assignedModules.length ? (
//                 <span className="inline-flex flex-wrap gap-1 align-middle">
//                   {assignedModules.map((m) => (
//                     <span
//                       key={m._id}
//                       className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
//                       title={m.name}
//                     >
//                       {m.name}
//                       <button
//                         className="ml-1 text-[11px] text-indigo-700 hover:text-indigo-900"
//                         onClick={() => handleRemoveModule(m._id)}
//                         title="Remove from this scenario"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                 </span>
//               ) : (
//                 <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
//                   {unassignedLabel}
//                 </span>
//               )}
//             </div>

//             <p className="text-[11px] text-slate-500 mt-1">
//               Created by{" "}
//               <span className="font-medium text-indigo-700">
//                 {scenario?.createdBy?.name || "Unknown"}
//               </span>{" "}
//               on {createdAtText}
//             </p>
//           </div>

//           <div className="flex items-center gap-2 flex-wrap">
//             <Link
//               to={`/single-project/${projectId}/view-all-scenarios`}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-pill hover:bg-indigo-800 text-sm"
//             >
//               View All Scenarios
//             </Link>
//             <Link
//               to={`/single-project/${projectId}/scenario/${scenarioId}/add-test-case`}
//               state={{
//                 scenarioNumber: scenario.scenario_number,
//                 scenarioText: scenario.scenario_text,
//               }}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-pill hover:bg-indigo-800 text-sm"
//             >
//               Add Test Case
//             </Link>
//             <Link
//               to={`/single-project/${projectId}/all-test-cases`}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-pill hover:bg-indigo-800 text-sm"
//             >
//               View All Test Cases
//             </Link>
//             <Link
//               to={`/single-project/${projectId}`}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-pill hover:bg-indigo-800 text-sm"
//             >
//               Project Dashboard
//             </Link>
//           </div>
//         </div>

//         {/* Scenario Text Editor */}
//         <div className="bg-white rounded-lg shadow border border-slate-200 p-4">
//           <label
//             htmlFor="scenario_text"
//             className="block text-sm font-semibold text-slate-700"
//           >
//             Scenario Text
//           </label>
//           <textarea
//             id="scenario_text"
//             className="w-full mt-2 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//             rows={5}
//             value={updatedText}
//             onChange={(e) => setUpdatedText(e.target.value)}
//           />
//           <div className="flex justify-end mt-3">
//             <button
//               onClick={handleUpdateScenarioText}
//               disabled={saving}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-pill hover:bg-indigo-800 text-sm disabled:opacity-60"
//             >
//               {saving ? "Saving…" : "Update Scenario"}
//             </button>
//           </div>
//         </div>

//         {/* Module Management */}
//         <div className="mt-8 bg-white rounded-lg shadow border border-slate-200 p-4">
//           <h3 className="text-sm font-semibold text-slate-700 mb-3">
//             Manage Modules
//           </h3>

//           {/* Quick add to another module */}
//           <div className="flex flex-wrap items-center gap-2">
//             <select
//               className="border border-slate-300 rounded-pill px-2 py-1 text-sm"
//               value={addModuleId}
//               onChange={(e) => setAddModuleId(e.target.value)}
//             >
//               <option value="">Select module to add…</option>
//               {allModules
//                 .filter((m) => !assignedIds.has(String(m._id)))
//                 .map((m) => (
//                   <option key={m._id} value={m._id}>
//                     {m.name}
//                   </option>
//                 ))}
//             </select>
//             <button
//               onClick={handleAddModule}
//               disabled={!addModuleId}
//               className="px-3 py-1.5 bg-emerald-600 text-white rounded-pill hover:bg-emerald-700 text-sm disabled:opacity-60"
//             >
//               Add
//             </button>

//             <button
//               onClick={handleMakeUnassigned}
//               className="ml-auto px-3 py-1.5 bg-slate-600 text-white rounded-pill hover:bg-slate-700 text-sm"
//               title="Clear all modules for this scenario"
//             >
//               Make Unassigned
//             </button>
//           </div>

//           {/* Replace entire set via multi-select */}
//           <div className="mt-5">
//             <p className="text-[12px] text-slate-600 mb-2">
//               Or select modules below and click <b>Save Modules</b> to replace
//               the entire set.
//             </p>
//             <div className="max-h-56 overflow-auto border rounded-md p-2">
//               <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
//                 {allModules.map((m) => {
//                   const id = String(m._id);
//                   const checked = selectedForReplace.includes(id);
//                   return (
//                     <li key={id} className="flex items-center">
//                       <input
//                         id={`rep-${id}`}
//                         type="checkbox"
//                         className="mr-2"
//                         checked={checked}
//                         onChange={() => toggleReplaceSelection(id)}
//                       />
//                       <label
//                         htmlFor={`rep-${id}`}
//                         className="text-[12px] text-slate-800"
//                       >
//                         {m.name}
//                       </label>
//                     </li>
//                   );
//                 })}
//                 {allModules.length === 0 && (
//                   <li className="text-[12px] text-slate-500">
//                     No modules found for this project.
//                   </li>
//                 )}
//               </ul>
//             </div>
//             <div className="flex justify-end mt-3">
//               <button
//                 onClick={handleReplaceModules}
//                 className="px-3 py-1.5 bg-indigo-600 text-white rounded-pill hover:bg-indigo-800 text-sm"
//               >
//                 Save Modules
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* History */}
//         <div className="mt-8 bg-white rounded-lg shadow border border-slate-200 p-4">
//           <h3 className="text-sm font-semibold text-slate-700 mb-3">
//             Changes History
//           </h3>
//           {changes.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full border-collapse">
//                 <thead>
//                   <tr className="text-[12px] text-slate-600 border-b border-slate-200">
//                     <th className="text-left py-2 pr-4">Changed By</th>
//                     <th className="text-left py-2 pr-4">Previous Text</th>
//                     <th className="text-left py-2">Change Time</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-[12px]">
//                   {changes.map((c, i) => (
//                     <tr key={i} className="border-b border-slate-100 align-top">
//                       <td className="py-2 pr-4 text-indigo-700 font-medium">
//                         {c?.user?.name || "Unknown"}
//                       </td>
//                       <td className="py-2 pr-4 text-slate-700">
//                         {c?.previous_text}
//                       </td>
//                       <td className="py-2 text-slate-600">
//                         {c?.time ? new Date(c.time).toLocaleString() : ""}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-[13px] text-slate-600">
//               No changes have been made to this scenario yet.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaHistory,
  FaFolderOpen,
  FaTags,
  FaEdit,
  FaProjectDiagram,
} from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import globalBackendRoute from "../../config/Config";

const UNASSIGNED_LABEL = "Unassigned";

const TEST_LEVEL_OPTIONS = ["Component", "Integration", "System", "Acceptance"];

const TEST_TYPE_OPTIONS = [
  "Functional",
  "GUI",
  "API",
  "Regression",
  "Usability",
  "Security",
  "Performance",
];

export default function SingleScenario() {
  const { projectId, scenarioId } = useParams();

  const [scenario, setScenario] = useState(null);
  const [changes, setChanges] = useState([]);
  const [updatedText, setUpdatedText] = useState("");
  const [selectedTestLevel, setSelectedTestLevel] = useState("System");
  const [selectedTestTypes, setSelectedTestTypes] = useState(["Functional"]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingClassification, setSavingClassification] = useState(false);

  const [allModules, setAllModules] = useState([]);
  const [selectedForReplace, setSelectedForReplace] = useState([]);
  const [addModuleId, setAddModuleId] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);
  const userId = useMemo(() => localStorage.getItem("userId"), []);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token],
  );

  const fetchScenario = async () => {
    try {
      const { data } = await axios.get(
        `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
        { headers: authHeaders },
      );

      const scenarioData = data?.scenario || null;

      setScenario(scenarioData);
      setChanges(data?.changes || []);
      setUpdatedText(scenarioData?.scenario_text || "");
      setSelectedTestLevel(scenarioData?.testLevel || "System");
      setSelectedTestTypes(
        Array.isArray(scenarioData?.testTypes) && scenarioData.testTypes.length
          ? scenarioData.testTypes
          : ["Functional"],
      );

      const currentIds = (scenarioData?.modules || [])
        .filter(Boolean)
        .map((m) => (typeof m === "object" ? String(m._id) : String(m)));

      setSelectedForReplace(currentIds);
    } catch (err) {
      console.error("Error fetching scenario details:", err);
      alert("Failed to load scenario.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllModules = async () => {
    try {
      const { data } = await axios.get(
        `${globalBackendRoute}/api/single-projects/${projectId}/modules`,
        { headers: authHeaders },
      );
      setAllModules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading modules:", err);
      setAllModules([]);
    }
  };

  useEffect(() => {
    fetchScenario();
    fetchAllModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, scenarioId]);

  const handleUpdateScenarioText = async () => {
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    if (!updatedText.trim()) {
      alert("Scenario text cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      await axios.put(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        {
          scenario_text: updatedText,
          userId,
        },
        { headers: authHeaders },
      );

      setScenario((prev) =>
        prev ? { ...prev, scenario_text: updatedText } : prev,
      );

      await fetchScenario();
      alert("Scenario updated successfully.");
    } catch (err) {
      console.error("Error updating scenario:", err);
      alert("Error updating scenario");
    } finally {
      setSaving(false);
    }
  };

  const toggleTestType = (type) => {
    setSelectedTestTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  };

  const handleSaveClassification = async () => {
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    if (!selectedTestLevel) {
      alert("Please select a test level.");
      return;
    }

    if (!selectedTestTypes.length) {
      alert("Please select at least one test type.");
      return;
    }

    setSavingClassification(true);

    try {
      await axios.put(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        {
          testLevel: selectedTestLevel,
          testTypes: selectedTestTypes,
          userId,
        },
        { headers: authHeaders },
      );

      setScenario((prev) =>
        prev
          ? {
              ...prev,
              testLevel: selectedTestLevel,
              testTypes: selectedTestTypes,
            }
          : prev,
      );

      await fetchScenario();
      alert("Scenario classification updated successfully.");
    } catch (err) {
      console.error("Error updating scenario classification:", err);
      alert("Failed to update scenario classification.");
    } finally {
      setSavingClassification(false);
    }
  };

  const getAssignedModules = (s) =>
    Array.isArray(s?.modules) ? s.modules.filter(Boolean) : [];

  const assignedModules = getAssignedModules(scenario);
  const assignedIds = new Set(assignedModules.map((m) => String(m._id)));
  const unassignedLabel = assignedModules.length === 0 ? UNASSIGNED_LABEL : "";

  const handleAddModule = async () => {
    if (!addModuleId) return;

    try {
      await axios.post(
        `${globalBackendRoute}/api/single-projects/${projectId}/scenarios/transfer`,
        { scenarioIds: [scenarioId], toModuleId: addModuleId },
        { headers: authHeaders },
      );
      await fetchScenario();
      alert("Module added to scenario.");
      setAddModuleId("");
    } catch (err) {
      console.error("Error adding module:", err);
      alert("Failed to add module.");
    }
  };

  const handleRemoveModule = async (removeId) => {
    const nextIds = (scenario?.modules || [])
      .map((m) => (typeof m === "object" ? m._id : m))
      .filter((id) => String(id) !== String(removeId));

    try {
      await axios.put(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        { moduleIds: nextIds, userId },
        { headers: authHeaders },
      );
      await fetchScenario();
      alert("Module removed from scenario.");
    } catch (err) {
      console.error("Error removing module:", err);
      alert("Failed to remove module.");
    }
  };

  const handleMakeUnassigned = async () => {
    try {
      await axios.post(
        `${globalBackendRoute}/api/single-projects/${projectId}/scenarios/detach`,
        { scenarioIds: [scenarioId] },
        { headers: authHeaders },
      );
      await fetchScenario();
      alert("Scenario is now Unassigned.");
    } catch (err) {
      console.error("Error detaching scenario:", err);
      alert("Failed to make Unassigned.");
    }
  };

  const handleReplaceModules = async () => {
    try {
      await axios.put(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        { moduleIds: selectedForReplace, userId },
        { headers: authHeaders },
      );
      await fetchScenario();
      alert("Modules updated.");
    } catch (err) {
      console.error("Error replacing modules:", err);
      alert("Failed to replace modules.");
    }
  };

  const toggleReplaceSelection = (id) => {
    setSelectedForReplace((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const createdAtText = useMemo(
    () =>
      scenario?.createdAt ? new Date(scenario.createdAt).toLocaleString() : "",
    [scenario?.createdAt],
  );

  const scenarioTestLevel = scenario?.testLevel || "System";
  const scenarioTestTypes =
    Array.isArray(scenario?.testTypes) && scenario.testTypes.length
      ? scenario.testTypes
      : ["Functional"];

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm text-sm text-slate-600">
          Loading…
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 shadow-sm text-sm text-rose-700">
          Scenario not found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/60 py-6 sm:py-8">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                <MdOutlineAssignment />
                Scenario Details
              </div>

              <h1 className="mt-2 text-lg sm:text-xl font-bold text-slate-900 break-words">
                {scenario.scenario_number}
              </h1>

              <p className="mt-2 text-sm text-slate-700 leading-6 break-words">
                {scenario.scenario_text}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700">
                  Project: {scenario?.project?.project_name || "—"}
                </span>
                <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
                  Level: {scenarioTestLevel}
                </span>
                {scenarioTestTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-700"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                Created by{" "}
                <span className="font-medium text-slate-700">
                  {scenario?.createdBy?.name || "Unknown"}
                </span>{" "}
                on {createdAtText}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/single-project/${projectId}/view-all-scenarios`}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 text-sm"
              >
                All Scenarios
              </Link>
              <Link
                to={`/single-project/${projectId}/scenario/${scenarioId}/add-test-case`}
                state={{
                  scenarioNumber: scenario.scenario_number,
                  scenarioText: scenario.scenario_text,
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 text-sm"
              >
                Add Test Case
              </Link>
              <Link
                to={`/single-project/${projectId}/all-test-cases`}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 text-sm"
              >
                All Test Cases
              </Link>
            </div>
          </div>
        </div>

        {/* Main compact grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left side */}
          <div className="xl:col-span-2 space-y-5">
            {/* Edit Scenario */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaEdit className="text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Edit Scenario Text
                </h2>
              </div>

              <textarea
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={5}
                value={updatedText}
                onChange={(e) => setUpdatedText(e.target.value)}
              />

              <div className="flex justify-end mt-3">
                <button
                  onClick={handleUpdateScenarioText}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 text-sm font-medium disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Update Scenario"}
                </button>
              </div>
            </div>

            {/* Modules */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaFolderOpen className="text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Manage Modules
                </h2>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Assigned Modules
                </p>

                {assignedModules.length ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedModules.map((m) => (
                      <span
                        key={m._id}
                        className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                      >
                        {m.name}
                        <button
                          className="ml-2 text-sm hover:text-indigo-900"
                          onClick={() => handleRemoveModule(m._id)}
                          title="Remove module"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {unassignedLabel}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-800 mb-2">
                    Add Module
                  </p>
                  <select
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={addModuleId}
                    onChange={(e) => setAddModuleId(e.target.value)}
                  >
                    <option value="">Select module…</option>
                    {allModules
                      .filter((m) => !assignedIds.has(String(m._id)))
                      .map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                  </select>

                  <div className="flex justify-between mt-3 gap-2">
                    <button
                      onClick={handleAddModule}
                      disabled={!addModuleId}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 text-sm disabled:opacity-60"
                    >
                      Add
                    </button>

                    <button
                      onClick={handleMakeUnassigned}
                      className="px-3 py-1.5 bg-slate-700 text-white rounded-full hover:bg-slate-800 text-sm"
                    >
                      Unassigned
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-800 mb-2">
                    Replace Modules
                  </p>

                  <div className="max-h-40 overflow-auto rounded-xl border border-slate-200 p-2">
                    <ul className="space-y-2">
                      {allModules.map((m) => {
                        const id = String(m._id);
                        const checked = selectedForReplace.includes(id);

                        return (
                          <li key={id} className="flex items-center">
                            <input
                              id={`rep-${id}`}
                              type="checkbox"
                              className="mr-2 accent-indigo-600"
                              checked={checked}
                              onChange={() => toggleReplaceSelection(id)}
                            />
                            <label
                              htmlFor={`rep-${id}`}
                              className="text-sm text-slate-700"
                            >
                              {m.name}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleReplaceModules}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 text-sm"
                    >
                      Save Modules
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaHistory className="text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Changes History
                </h2>
              </div>

              {changes.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-slate-50">
                      <tr className="text-[12px] text-slate-600 border-b border-slate-200">
                        <th className="text-left py-3 px-4">Changed By</th>
                        <th className="text-left py-3 px-4">Previous Text</th>
                        <th className="text-left py-3 px-4">Time</th>
                      </tr>
                    </thead>
                    <tbody className="text-[12px]">
                      {changes.map((c, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 align-top"
                        >
                          <td className="py-3 px-4 text-indigo-700 font-medium whitespace-nowrap">
                            {c?.user?.name || "Unknown"}
                          </td>
                          <td className="py-3 px-4 text-slate-700 break-words whitespace-pre-wrap">
                            {c?.previous_text}
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {c?.time ? new Date(c.time).toLocaleString() : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  No changes have been made to this scenario yet.
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaProjectDiagram className="text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Scenario Info
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Scenario Number
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {scenario.scenario_number}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Project
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {scenario?.project?.project_name || "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Created By
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {scenario?.createdBy?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaTags className="text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Classification
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800">
                    Test Level
                  </label>
                  <select
                    value={selectedTestLevel}
                    onChange={(e) => setSelectedTestLevel(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {TEST_LEVEL_OPTIONS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800">
                    Test Types
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {TEST_TYPE_OPTIONS.map((type) => (
                      <label
                        key={type}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
                      >
                        <input
                          type="checkbox"
                          className="accent-indigo-600"
                          checked={selectedTestTypes.includes(type)}
                          onChange={() => toggleTestType(type)}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveClassification}
                    disabled={savingClassification}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 text-sm font-medium disabled:opacity-60"
                  >
                    {savingClassification ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
