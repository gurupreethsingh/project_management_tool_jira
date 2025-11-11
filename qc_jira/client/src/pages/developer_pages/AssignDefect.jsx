// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaProjectDiagram } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const AssignDefect = () => {
//   const { projectId, defectId } = useParams(); // projectId and defectId from the URL
//   const [developers, setDevelopers] = useState([]); // List of developers
//   const [selectedDeveloper, setSelectedDeveloper] = useState(""); // Selected developer ID
//   const [projectName, setProjectName] = useState(""); // Project name
//   const [defect, setDefect] = useState({}); // Store defect details
//   const navigate = useNavigate(); // Use for navigation

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch project details (including project name)
//         const projectResponse = await axios.get(
//           `${globalBackendRoute}/api/projects/${projectId}`
//         );
//         setProjectName(projectResponse.data.project_name);

//         // Fetch defect details associated with this project and defect ID
//         const defectResponse = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`
//         );
//         setDefect(defectResponse.data);

//         // Fetch developers associated with the project
//         const developerResponse = await axios.get(
//           `${globalBackendRoute}/api/developers/single-project/${projectId}/developers`
//         );
//         setDevelopers(developerResponse.data.developers);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [projectId, defectId]);

//   const handleAssign = async () => {
//     if (!selectedDeveloper) {
//       alert("Please select a developer");
//       return;
//     }

//     try {
//       // Get the logged-in user from localStorage
//       const loggedInUser = JSON.parse(localStorage.getItem("user"));
//       const developer = developers.find((dev) => dev._id === selectedDeveloper);

//       await axios.post(
//         `${globalBackendRoute}/api/single-project/${projectId}/assign-defect`,
//         {
//           projectName, // Project name from state
//           moduleName: defect.module_name, // Module name from defect state
//           defectId: defect._id, // Defect ID from defect state
//           defectBugId: defect.bug_id, // Defect bug ID from defect state
//           expectedResult: defect.expected_result, // Expected result from defect state
//           actualResult: defect.actual_result, // Actual result from defect state
//           assignedTo: selectedDeveloper, // Developer ID from the dropdown
//           assignedBy: loggedInUser.id, // Use the user ID from localStorage
//         }
//       );

//       alert(`Defect successfully assigned to ${developer.name}!`);
//       navigate(`/single-project/${projectId}/all-defects`); // Navigate to "All Defects" page
//     } catch (error) {
//       console.error("Error assigning defect:", error);
//       alert("Failed to assign defect");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {/* Project Details + Buttons */}
//         <div className="col-span-2 flex justify-between">
//           <div className="flex items-center mb-2">
//             <FaProjectDiagram className="text-orange-500 mr-2" size={24} />
//             <span className="text-lg font-semibold leading-6 text-gray-700">
//               Project Name: {projectName || "N/A"}
//             </span>
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={() =>
//                 navigate(`/single-project/${projectId}/all-defects`)
//               }
//               className="btn btn-sm bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-800 transition"
//             >
//               View All Defect
//             </button>
//             <button
//               onClick={() => navigate(`/single-project/${projectId}`)}
//               className="btn btn-sm bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-800 transition"
//             >
//               Project Dashboard
//             </button>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium leading-6 text-gray-900">
//             Module Name
//           </label>
//           <input
//             type="text"
//             value={defect.module_name || "N/A"}
//             readOnly
//             className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium leading-6 text-gray-900">
//             Expected Result
//           </label>
//           <input
//             type="text"
//             value={defect.expected_result || "N/A"}
//             readOnly
//             className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium leading-6 text-gray-900">
//             Actual Result
//           </label>
//           <input
//             type="text"
//             value={defect.actual_result || "N/A"}
//             readOnly
//             className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium leading-6 text-gray-900">
//             Defect ID
//           </label>
//           <input
//             type="text"
//             value={defect.bug_id || "N/A"}
//             readOnly
//             className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//           />
//         </div>

//         {/* Developer Dropdown */}
//         <div>
//           <label className="block text-sm font-medium leading-6 text-gray-900">
//             Assign Developer
//           </label>
//           <select
//             value={selectedDeveloper}
//             onChange={(e) => setSelectedDeveloper(e.target.value)}
//             className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//           >
//             <option value="">Select Developer</option>
//             {developers.map((developer) => (
//               <option key={developer._id} value={developer._id}>
//                 {developer.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Assign Button */}
//         <div className="col-span-2 block">
//           <button
//             onClick={handleAssign}
//             className="btn btn-sm bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4 py-1 mt-4"
//           >
//             Assign Defect to Developer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignDefect;

//

//

//

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaBug,
  FaListAlt,
  FaFileSignature,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const cls = (...a) => a.filter(Boolean).join(" ");

// Match SingleDefect badge styles
const priorityColors = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  high: "bg-rose-100 text-rose-700 border-rose-300",
};

const severityColors = {
  minor: "bg-sky-100 text-sky-700 border-sky-300",
  major: "bg-orange-100 text-orange-700 border-orange-300",
  critical: "bg-red-100 text-red-700 border-red-300",
  blocker: "bg-slate-300 text-slate-800 border-slate-400",
};

const statusColors = {
  "Open/New": "bg-rose-100 text-rose-700 border-rose-300",
  Open: "bg-rose-100 text-rose-700 border-rose-300",
  New: "bg-rose-100 text-rose-700 border-rose-300",
  Assigned: "bg-amber-100 text-amber-700 border-amber-300",
  "In-progress": "bg-blue-100 text-blue-700 border-blue-300",
  "In-Progress": "bg-blue-100 text-blue-700 border-blue-300",
  Fixed: "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Re-opened": "bg-purple-100 text-purple-700 border-purple-300",
  Closed: "bg-slate-200 text-slate-800 border-slate-300",
  "Unable-To-fix": "bg-slate-100 text-slate-700 border-slate-200",
  "Not-An-Error": "bg-slate-100 text-slate-700 border-slate-200",
  "Request-For-Enhancement": "bg-indigo-100 text-indigo-700 border-indigo-300",
};

const getStatusBadge = (status) =>
  statusColors[status] || "bg-slate-100 text-slate-700 border-slate-200";

const AssignDefect = () => {
  const { projectId, defectId } = useParams();
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [projectName, setProjectName] = useState("");
  const [defect, setDefect] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authConfig = useMemo(
    () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    [token]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Project details
        const projectRes = await axios.get(
          `${globalBackendRoute}/api/projects/${projectId}`,
          authConfig
        );
        setProjectName(projectRes?.data?.project_name || "");

        // Defect details
        const defectRes = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
          authConfig
        );
        setDefect(defectRes.data);

        // Developers for project
        const devRes = await axios.get(
          `${globalBackendRoute}/api/developers/single-project/${projectId}/developers`,
          authConfig
        );
        setDevelopers(devRes?.data?.developers || []);
      } catch (error) {
        console.error("Error fetching data:", error?.response || error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId && defectId) fetchData();
  }, [projectId, defectId, authConfig]);

  const handleAssign = async () => {
    if (!selectedDeveloper) {
      alert("Please select a developer");
      return;
    }

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const developer = developers.find((dev) => dev._id === selectedDeveloper);

      // Once status has moved away from Open/New elsewhere,
      // we do NOT attempt to reset it here. We just assign.
      await axios.post(
        `${globalBackendRoute}/api/single-project/${projectId}/assign-defect`,
        {
          projectName,
          moduleName: defect.module_name,
          defectId: defect._id,
          defectBugId: defect.bug_id,
          expectedResult: defect.expected_result,
          actualResult: defect.actual_result,
          assignedTo: selectedDeveloper,
          assignedBy: loggedInUser?.id,
        },
        authConfig
      );

      alert(
        `Defect successfully assigned to ${
          developer?.name || "selected developer"
        }!`
      );
      navigate(`/single-project/${projectId}/all-defects`);
    } catch (error) {
      console.error("Error assigning defect:", error?.response || error);
      alert("Failed to assign defect");
    }
  };

  if (loading || !defect) {
    return (
      <div className="bg-white py-6 sm:py-8 text-[13px]">
        <div className="mx-auto container px-2 sm:px-3 lg:px-4">
          Loading assignment details…
        </div>
      </div>
    );
  }

  const priorityKey = (defect.priority || "").toLowerCase();
  const severityKey = (defect.severity || "").toLowerCase();
  const statusClass = getStatusBadge(defect.status);

  return (
    <div className="bg-white py-6 sm:py-8 text-[13px]">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Top Bar - match SingleDefect */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <div className="min-w-[220px]">
            <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px] flex items-center gap-2">
              <FaBug className="text-indigo-500" />
              Assign Defect to Developer
            </h2>
            <div className="text-[11px] text-gray-600 mt-0.5">
              {projectName
                ? `Project: ${projectName}`
                : `Project ID: ${projectId}`}
            </div>
            <div className="text-[11px] text-gray-600">
              {defect.bug_id
                ? `Defect ID: ${defect.bug_id}`
                : `Defect: ${defectId}`}
            </div>

            <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
              {defect.priority && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-medium",
                    priorityColors[priorityKey] ||
                      "bg-slate-100 text-slate-700 border-slate-200"
                  )}
                >
                  Priority: {defect.priority}
                </span>
              )}
              {defect.severity && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-medium",
                    severityColors[severityKey] ||
                      "bg-slate-100 text-slate-700 border-slate-200"
                  )}
                >
                  Severity: {defect.severity}
                </span>
              )}
              {defect.status && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-semibold",
                    statusClass
                  )}
                >
                  Status: {defect.status}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() =>
                navigate(`/single-project/${projectId}/all-defects`)
              }
              className="px-3 py-1.5 bg-slate-50 border rounded-md text-[11px] hover:bg-slate-100"
            >
              View All Defects
            </button>
            <button
              onClick={() => navigate(`/single-project/${projectId}`)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-[11px] hover:bg-indigo-800"
            >
              Project Dashboard
            </button>
          </div>
        </div>

        {/* Main content - match SingleDefect style */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px,minmax(0,1.9fr)] gap-4">
          {/* Left: key defect info snapshot */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaProjectDiagram className="text-orange-500" />
                <span className="text-xs font-semibold text-slate-800">
                  Project Name
                </span>
              </div>
              <input
                type="text"
                value={projectName || "N/A"}
                readOnly
                className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-800 mb-1">
                Module Name
              </span>
              <input
                type="text"
                value={defect.module_name || "N/A"}
                readOnly
                className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-800 mb-1">
                Defect ID
              </span>
              <input
                type="text"
                value={defect.bug_id || defect._id || "N/A"}
                readOnly
                className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
              />
            </div>
          </div>

          {/* Right: details + assign form */}
          <div className="space-y-4">
            {/* Test case + results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaListAlt className="text-blue-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Test Case Number
                  </span>
                </div>
                <input
                  type="text"
                  value={defect.test_case_number || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaFileSignature className="text-green-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Test Case Name
                  </span>
                </div>
                <input
                  type="text"
                  value={defect.test_case_name || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Current Status
                </span>
                <input
                  type="text"
                  value={defect.status || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>
            </div>

            {/* Expected / Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Expected Result
                </span>
                <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] whitespace-pre-wrap max-h-32 overflow-auto">
                  {defect.expected_result || "N/A"}
                </div>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Actual Result
                </span>
                <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] whitespace-pre-wrap max-h-32 overflow-auto">
                  {defect.actual_result || "N/A"}
                </div>
              </div>
            </div>

            {/* Description preview */}
            <div>
              <span className="block text-xs font-semibold text-slate-800 mb-1">
                Defect Summary / Description (read-only)
              </span>
              <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] whitespace-pre-wrap max-h-40 overflow-auto">
                {defect.description_of_defect ||
                  defect.bug_summary ||
                  defect.bug_title ||
                  "N/A"}
              </div>
            </div>

            {/* Assign Developer */}
            <div className="max-w-sm">
              <span className="block text-xs font-semibold text-slate-800 mb-1">
                Assign Developer
              </span>
              <select
                value={selectedDeveloper}
                onChange={(e) => setSelectedDeveloper(e.target.value)}
                className="block w-full rounded-md border border-slate-200 bg-white py-1.5 px-2 text-[12px]"
              >
                <option value="">Select Developer</option>
                {developers.map((developer) => (
                  <option key={developer._id} value={developer._id}>
                    {developer.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssign}
                className="mt-3 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] hover:bg-indigo-800"
              >
                Assign Defect to Developer
              </button>
            </div>

            {/* Note about Open/New rule (enforced elsewhere in UI / backend) */}
            {defect.status &&
              defect.status !== "Open/New" &&
              defect.status !== "Open" &&
              defect.status !== "New" && (
                <div className="mt-2 text-[10px] text-slate-500">
                  Note: This defect has progressed beyond Open/New. Per rules,
                  it cannot be moved back to Open/New.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDefect;
