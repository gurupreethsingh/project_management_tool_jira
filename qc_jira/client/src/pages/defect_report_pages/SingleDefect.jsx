// // import React, { useState, useEffect, useMemo } from "react";
// // import axios from "axios";
// // import { useParams, Link } from "react-router-dom";
// // import {
// //   FaBug,
// //   FaListAlt,
// //   FaFileSignature,
// //   FaProjectDiagram,
// //   FaCamera,
// // } from "react-icons/fa";
// // import globalBackendRoute from "../../config/Config";

// // const SingleDefect = () => {
// //   const { projectId, defectId } = useParams();

// //   const [bug, setBug] = useState(null);
// //   const [status, setStatus] = useState("");
// //   const [userRole, setUserRole] = useState("");
// //   const [developers, setDevelopers] = useState([]);
// //   const [assignedDeveloper, setAssignedDeveloper] = useState("");
// //   const [historyData, setHistoryData] = useState([]);

// //   // Build a safe axios config with Authorization header (or empty config)
// //   const token =
// //     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
// //   const authConfig = useMemo(
// //     () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
// //     [token]
// //   );

// //   useEffect(() => {
// //     const fetchDefectAndAux = async () => {
// //       try {
// //         // defect (SINGULAR "defect" in path)
// //         const res = await axios.get(
// //           `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
// //           authConfig
// //         );
// //         const data = res.data;
// //         setBug(data);
// //         setStatus(data.status || "");

// //         if (Array.isArray(data.history)) setHistoryData(data.history);

// //         // role
// //         const loggedInUser = JSON.parse(localStorage.getItem("user"));
// //         if (loggedInUser?.role) setUserRole(loggedInUser.role);

// //         // developers for this project
// //         const devRes = await axios.get(
// //           `${globalBackendRoute}/api/projects/${projectId}/developers`,
// //           authConfig
// //         );
// //         setDevelopers(devRes?.data?.developers || []);
// //       } catch (err) {
// //         console.error("Error fetching defect:", err?.response?.data || err);
// //       }
// //     };

// //     if (projectId && defectId) fetchDefectAndAux();
// //   }, [projectId, defectId, authConfig]);

// //   if (!bug) return <div>Loading...</div>;

// //   const getImageUrl = (bugImage) => {
// //     if (bugImage) {
// //       const normalizedPath = bugImage
// //         .replace(/\\/g, "/")
// //         .split("uploads/")
// //         .pop();
// //       return `${globalBackendRoute}/uploads/${normalizedPath}`;
// //     }
// //     return "https://via.placeholder.com/150";
// //   };

// //   const handleStatusUpdate = async () => {
// //     if (status === "Open/New") {
// //       alert("You cannot change the status back to 'Open/New'.");
// //       return;
// //     }

// //     if (
// //       status === "Closed" &&
// //       !["admin", "project_manager", "superadmin", "qa_lead"].includes(userRole)
// //     ) {
// //       alert(
// //         "Only admins, project managers, superadmins, or qa_lead can close defects."
// //       );
// //       return;
// //     }

// //     try {
// //       await axios.put(
// //         // SINGULAR "defect" in path
// //         `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
// //         {
// //           status,
// //           updated_by: JSON.parse(localStorage.getItem("user"))?.name,
// //           assignedDeveloper,
// //         },
// //         authConfig
// //       );
// //       alert("Status updated successfully");
// //       window.location.reload();
// //     } catch (error) {
// //       console.error("Error updating status:", error?.response?.data || error);
// //       alert("Failed to update status");
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-12">
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //         {/* Bug Image */}
// //         <div className="col-span-1">
// //           <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
// //             <FaBug className="mr-2 text-indigo-600 inline-block" /> Defect
// //             Details
// //           </h5>
// //           <div className="my-4">
// //             <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center">
// //               <FaCamera className="text-gray-600 mr-2" /> Bug Picture
// //             </label>
// //             <div className="mt-2">
// //               <img
// //                 src={getImageUrl(bug.bug_picture)}
// //                 alt="Bug"
// //                 className="w-48 h-48 object-cover rounded-lg"
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Defect Details */}
// //         <div className="col-span-2">
// //           {/* Nav */}
// //           <div className="mb-5">
// //             <Link
// //               to={`/single-project/${projectId}/all-defects`}
// //               className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// //             >
// //               All Defects
// //             </Link>
// //             {[
// //               "superadmin",
// //               "admin",
// //               "project_manager",
// //               "developer_lead",
// //             ].includes(userRole) && (
// //               <Link
// //                 to={`/single-project/${projectId}/assign-defect/${defectId}`}
// //                 className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// //               >
// //                 Assign Defect to Developer
// //               </Link>
// //             )}
// //             <Link
// //               to={`/single-project/${projectId}`}
// //               className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// //             >
// //               Project Dashboard
// //             </Link>
// //           </div>

// //           {/* First Row */}
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //             <div>
// //               <div className="flex items-center">
// //                 <FaProjectDiagram className="text-orange-500 mr-2" size={24} />
// //                 <label className="text-sm font-medium leading-6 text-gray-900">
// //                   Project Name
// //                 </label>
// //               </div>
// //               <input
// //                 type="text"
// //                 value={bug.project_name || "N/A"}
// //                 readOnly
// //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// //               />
// //             </div>

// //             <div>
// //               <div className="flex items-center">
// //                 <FaListAlt className="text-blue-500 mr-2" size={24} />
// //                 <label className="text-sm font-medium leading-6 text-gray-900">
// //                   Module Name
// //                 </label>
// //               </div>
// //               <input
// //                 type="text"
// //                 value={bug.module_name || "N/A"}
// //                 readOnly
// //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// //               />
// //             </div>

// //             <div>
// //               <div className="flex items-center">
// //                 <FaListAlt className="text-blue-500 mr-2" size={24} />
// //                 <label className="text-sm font-medium leading-6 text-gray-900">
// //                   Test Case Number
// //                 </label>
// //               </div>
// //               <input
// //                 type="text"
// //                 value={bug.test_case_number || "N/A"}
// //                 readOnly
// //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// //               />
// //             </div>
// //           </div>

// //           {/* Second Row */}
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
// //             <div>
// //               <div className="flex items-center">
// //                 <FaFileSignature className="text-green-500 mr-2" size={24} />
// //                 <label className="text-sm font-medium leading-6 text-gray-900">
// //                   Test Case Name
// //                 </label>
// //               </div>
// //               <input
// //                 type="text"
// //                 value={bug.test_case_name || "N/A"}
// //                 readOnly
// //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium leading-6 text-gray-900">
// //                 Expected Result
// //               </label>
// //               <input
// //                 type="text"
// //                 value={bug.expected_result || "N/A"}
// //                 readOnly
// //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium leading-6 text-gray-900">
// //                 Actual Result
// //               </label>
// //               <input
// //                 type="text"
// //                 value={bug.actual_result || "N/A"}
// //                 readOnly
// //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// //               />
// //             </div>
// //           </div>

// //           {/* Description & Steps */}
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
// //             <div>
// //               <label className="block text-sm font-medium leading-6 text-gray-900">
// //                 Description of Defect
// //               </label>
// //               <textarea
// //                 value={bug.description_of_defect || "N/A"}
// //                 readOnly
// //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600 resize-none overflow-auto"
// //                 style={{ whiteSpace: "pre-wrap", height: "auto" }}
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium leading-6 text-gray-900">
// //                 Steps to Replicate
// //               </label>
// //               <ul className="ml-4 shadow p-2 rounded">
// //                 {(bug.steps_to_replicate || []).map((step, index) => (
// //                   <li key={index}>
// //                     <span className="font-bold">Step:</span> {index + 1} |{" "}
// //                     <span className="font-bold"> Actual Step:</span> {step} |{" "}
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           </div>

// //           {/* Status + Assign */}
// //           <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium leading-6 text-gray-900">
// //                 Update Status
// //               </label>
// //               <select
// //                 value={status}
// //                 onChange={(e) => setStatus(e.target.value)}
// //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// //               >
// //                 {userRole && (
// //                   <>
// //                     {[
// //                       "superadmin",
// //                       "admin",
// //                       "project_manager",
// //                       "qa_lead",
// //                     ].includes(userRole) && (
// //                       <>
// //                         <option value="Open/New">Open/New</option>
// //                         <option value="Assigned">Assigned</option>
// //                         <option value="In-Progress">In-Progress</option>
// //                         <option value="Fixed">Fixed</option>
// //                         <option value="Re-opened">Re-opened</option>
// //                         <option value="Closed">Closed</option>
// //                         <option value="Unable-To-fix">Unable-To-fix</option>
// //                         <option value="Not-An-Error">Not-An-Error</option>
// //                         <option value="Request-For-Enhancement">
// //                           Request-For-Enhancement
// //                         </option>
// //                       </>
// //                     )}

// //                     {userRole === "developer" && (
// //                       <>
// //                         <option value="In-Progress">In-Progress</option>
// //                         <option value="Fixed">Fixed</option>
// //                         <option value="Unable-To-fix">Unable-To-fix</option>
// //                         <option value="Not-An-Error">Not-An-Error</option>
// //                         <option value="Request-For-Enhancement">
// //                           Request-For-Enhancement
// //                         </option>
// //                       </>
// //                     )}

// //                     {userRole === "test_engineer" && (
// //                       <>
// //                         <option value="Open/New">Open/New</option>
// //                         <option value="Re-opened">Re-opened</option>
// //                         <option value="Fixed">Fixed</option>
// //                       </>
// //                     )}
// //                   </>
// //                 )}
// //               </select>
// //             </div>

// //             {
// //               <div>
// //                 <label className="block text-sm font-medium leading-6 text-gray-900">
// //                   Assign Developer (optional)
// //                 </label>
// //                 <select
// //                   className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// //                   value={assignedDeveloper}
// //                   onChange={(e) => setAssignedDeveloper(e.target.value)}
// //                 >
// //                   <option value="">Select developer…</option>
// //                   {developers.map((d) => (
// //                     <option key={d._id} value={d._id}>
// //                       {d.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             }
// //           </div>

// //           {/* Update Button */}
// //           <button
// //             onClick={handleStatusUpdate}
// //             className="btn btn-sm bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4 mt-4"
// //           >
// //             Update Status
// //           </button>
// //         </div>
// //       </div>

// //       {/* Status Update History Table */}
// //       <div className="mt-10">
// //         <h3 className="text-xl font-semibold mb-4">Status Update History</h3>
// //         <table className="min-w-full bg-white border border-gray-300">
// //           <thead>
// //             <tr>
// //               <th className="p-3 text-sm font-semibold text-gray-600">
// //                 Defect ID
// //               </th>
// //               <th className="p-3 text-sm font-semibold text-gray-600">
// //                 Test Case Number
// //               </th>
// //               <th className="p-3 text-sm font-semibold text-gray-600">
// //                 Current Status
// //               </th>
// //               <th className="p-3 text-sm font-semibold text-gray-600">
// //                 Status Assigned Date
// //               </th>
// //               <th className="p-3 text-sm font-semibold text-gray-600">
// //                 Changed By
// //               </th>
// //               <th className="p-3 text-sm font-semibold text-gray-600">
// //                 Status Changed Date
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {historyData.map((entry, index) => (
// //               <tr
// //                 key={index}
// //                 className="border-b last:border-none hover:bg-gray-100"
// //               >
// //                 <td className="p-3 text-sm text-gray-600">{entry.bug_id}</td>
// //                 <td className="p-3 text-sm text-gray-600">
// //                   {entry.test_case_number}
// //                 </td>
// //                 <td className="p-3 text-sm text-gray-600">{entry.status}</td>
// //                 <td className="p-3 text-sm text-gray-600">
// //                   {new Date(entry.updated_at).toLocaleDateString()}
// //                 </td>
// //                 <td className="p-3 text-sm text-gray-600">
// //                   {entry.updated_by}
// //                 </td>
// //                 <td className="p-3 text-sm text-gray-600">
// //                   {new Date(entry.updated_at).toLocaleDateString()}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SingleDefect;

// //

// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useParams, Link } from "react-router-dom";
// import {
//   FaBug,
//   FaListAlt,
//   FaFileSignature,
//   FaProjectDiagram,
//   FaCamera,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const SingleDefect = () => {
//   const { projectId, defectId } = useParams();

//   const [bug, setBug] = useState(null);
//   const [status, setStatus] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [developers, setDevelopers] = useState([]);
//   const [assignedDeveloper, setAssignedDeveloper] = useState("");
//   const [historyData, setHistoryData] = useState([]);

//   // Build a safe axios config with Authorization header (or empty config)
//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
//   const authConfig = useMemo(
//     () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
//     [token]
//   );

//   // Only these roles can assign defects
//   const canAssign = useMemo(
//     () => ["superadmin", "admin", "test_lead"].includes(userRole),
//     [userRole]
//   );

//   useEffect(() => {
//     const fetchDefectAndAux = async () => {
//       try {
//         // defect (SINGULAR "defect" in path)
//         const res = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
//           authConfig
//         );
//         const data = res.data;
//         setBug(data);
//         setStatus(data.status || "");

//         if (Array.isArray(data.history)) setHistoryData(data.history);

//         // role
//         const loggedInUser = JSON.parse(localStorage.getItem("user"));
//         if (loggedInUser?.role) setUserRole(loggedInUser.role);

//         // developers for this project
//         const devRes = await axios.get(
//           `${globalBackendRoute}/api/projects/${projectId}/developers`,
//           authConfig
//         );
//         setDevelopers(devRes?.data?.developers || []);
//       } catch (err) {
//         console.error("Error fetching defect:", err?.response?.data || err);
//       }
//     };

//     if (projectId && defectId) fetchDefectAndAux();
//   }, [projectId, defectId, authConfig]);

//   if (!bug) return <div>Loading...</div>;

//   const getImageUrl = (bugImage) => {
//     if (bugImage) {
//       const normalizedPath = bugImage
//         .replace(/\\/g, "/")
//         .split("uploads/")
//         .pop();
//       return `${globalBackendRoute}/uploads/${normalizedPath}`;
//     }
//     return "https://via.placeholder.com/150";
//   };

//   const handleStatusUpdate = async () => {
//     if (status === "Open/New") {
//       alert("You cannot change the status back to 'Open/New'.");
//       return;
//     }

//     if (
//       status === "Closed" &&
//       !["admin", "project_manager", "superadmin", "qa_lead"].includes(userRole)
//     ) {
//       alert(
//         "Only admins, project managers, superadmins, or qa_lead can close defects."
//       );
//       return;
//     }

//     try {
//       await axios.put(
//         // SINGULAR "defect" in path
//         `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
//         {
//           status,
//           updated_by: JSON.parse(localStorage.getItem("user"))?.name,
//           assignedDeveloper,
//         },
//         authConfig
//       );
//       alert("Status updated successfully");
//       window.location.reload();
//     } catch (error) {
//       console.error("Error updating status:", error?.response?.data || error);
//       alert("Failed to update status");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Bug Image */}
//         <div className="col-span-1">
//           <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
//             <FaBug className="mr-2 text-indigo-600 inline-block" /> Defect
//             Details
//           </h5>
//           <div className="my-4">
//             <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center">
//               <FaCamera className="text-gray-600 mr-2" /> Bug Picture
//             </label>
//             <div className="mt-2">
//               <img
//                 src={getImageUrl(bug.bug_picture)}
//                 alt="Bug"
//                 className="w-48 h-48 object-cover rounded-lg"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Defect Details */}
//         <div className="col-span-2">
//           {/* Nav */}
//           <div className="mb-5">
//             <Link
//               to={`/single-project/${projectId}/all-defects`}
//               className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
//             >
//               All Defects
//             </Link>

//             {canAssign && (
//               <Link
//                 to={`/single-project/${projectId}/assign-defect/${defectId}`}
//                 className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
//               >
//                 Assign Defect to Developer
//               </Link>
//             )}

//             <Link
//               to={`/single-project/${projectId}`}
//               className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
//             >
//               Project Dashboard
//             </Link>
//           </div>

//           {/* First Row */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//             <div>
//               <div className="flex items-center">
//                 <FaProjectDiagram className="text-orange-500 mr-2" size={24} />
//                 <label className="text-sm font-medium leading-6 text-gray-900">
//                   Project Name
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 value={bug.project_name || "N/A"}
//                 readOnly
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               />
//             </div>

//             <div>
//               <div className="flex items-center">
//                 <FaListAlt className="text-blue-500 mr-2" size={24} />
//                 <label className="text-sm font-medium leading-6 text-gray-900">
//                   Module Name
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 value={bug.module_name || "N/A"}
//                 readOnly
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               />
//             </div>

//             <div>
//               <div className="flex items-center">
//                 <FaListAlt className="text-blue-500 mr-2" size={24} />
//                 <label className="text-sm font-medium leading-6 text-gray-900">
//                   Test Case Number
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 value={bug.test_case_number || "N/A"}
//                 readOnly
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               />
//             </div>
//           </div>

//           {/* Second Row */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
//             <div>
//               <div className="flex items-center">
//                 <FaFileSignature className="text-green-500 mr-2" size={24} />
//                 <label className="text-sm font-medium leading-6 text-gray-900">
//                   Test Case Name
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 value={bug.test_case_name || "N/A"}
//                 readOnly
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium leading-6 text-gray-900">
//                 Expected Result
//               </label>
//               <input
//                 type="text"
//                 value={bug.expected_result || "N/A"}
//                 readOnly
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium leading-6 text-gray-900">
//                 Actual Result
//               </label>
//               <input
//                 type="text"
//                 value={bug.actual_result || "N/A"}
//                 readOnly
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               />
//             </div>
//           </div>

//           {/* Description & Steps */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
//             <div>
//               <label className="block text-sm font-medium leading-6 text-gray-900">
//                 Description of Defect
//               </label>
//               <textarea
//                 value={bug.description_of_defect || "N/A"}
//                 readOnly
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600 resize-none overflow-auto"
//                 style={{ whiteSpace: "pre-wrap", height: "auto" }}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium leading-6 text-gray-900">
//                 Steps to Replicate
//               </label>
//               <ul className="ml-4 shadow p-2 rounded">
//                 {(bug.steps_to_replicate || []).map((step, index) => (
//                   <li key={index}>
//                     <span className="font-bold">Step:</span> {index + 1} |{" "}
//                     <span className="font-bold"> Actual Step:</span> {step} |{" "}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Status + Assign */}
//           <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium leading-6 text-gray-900">
//                 Update Status
//               </label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//               >
//                 {userRole && (
//                   <>
//                     {[
//                       "superadmin",
//                       "admin",
//                       "project_manager",
//                       "qa_lead",
//                     ].includes(userRole) && (
//                       <>
//                         <option value="Open/New">Open/New</option>
//                         <option value="Assigned">Assigned</option>
//                         <option value="In-Progress">In-Progress</option>
//                         <option value="Fixed">Fixed</option>
//                         <option value="Re-opened">Re-opened</option>
//                         <option value="Closed">Closed</option>
//                         <option value="Unable-To-fix">Unable-To-fix</option>
//                         <option value="Not-An-Error">Not-An-Error</option>
//                         <option value="Request-For-Enhancement">
//                           Request-For-Enhancement
//                         </option>
//                       </>
//                     )}

//                     {userRole === "developer" && (
//                       <>
//                         <option value="In-Progress">In-Progress</option>
//                         <option value="Fixed">Fixed</option>
//                         <option value="Unable-To-fix">Unable-To-fix</option>
//                         <option value="Not-An-Error">Not-An-Error</option>
//                         <option value="Request-For-Enhancement">
//                           Request-For-Enhancement
//                         </option>
//                       </>
//                     )}

//                     {userRole === "test_engineer" && (
//                       <>
//                         <option value="Open/New">Open/New</option>
//                         <option value="Re-opened">Re-opened</option>
//                         <option value="Fixed">Fixed</option>
//                       </>
//                     )}
//                   </>
//                 )}
//               </select>
//             </div>

//             {/* Assign Developer (only if canAssign) */}
//             {canAssign && (
//               <div>
//                 <label className="block text-sm font-medium leading-6 text-gray-900">
//                   Assign Developer (optional)
//                 </label>
//                 <select
//                   className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
//                   value={assignedDeveloper}
//                   onChange={(e) => setAssignedDeveloper(e.target.value)}
//                 >
//                   <option value="">Select developer…</option>
//                   {developers.map((d) => (
//                     <option key={d._id} value={d._id}>
//                       {d.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>

//           {/* Update Button */}
//           <button
//             onClick={handleStatusUpdate}
//             className="btn btn-sm bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4 mt-4"
//           >
//             Update Status
//           </button>
//         </div>
//       </div>

//       {/* Status Update History Table */}
//       <div className="mt-10">
//         <h3 className="text-xl font-semibold mb-4">Status Update History</h3>
//         <table className="min-w-full bg-white border border-gray-300">
//           <thead>
//             <tr>
//               <th className="p-3 text-sm font-semibold text-gray-600">
//                 Defect ID
//               </th>
//               <th className="p-3 text-sm font-semibold text-gray-600">
//                 Test Case Number
//               </th>
//               <th className="p-3 text-sm font-semibold text-gray-600">
//                 Current Status
//               </th>
//               <th className="p-3 text-sm font-semibold text-gray-600">
//                 Status Assigned Date
//               </th>
//               <th className="p-3 text-sm font-semibold text-gray-600">
//                 Changed By
//               </th>
//               <th className="p-3 text-sm font-semibold text-gray-600">
//                 Status Changed Date
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {historyData.map((entry, index) => (
//               <tr
//                 key={index}
//                 className="border-b last:border-none hover:bg-gray-100"
//               >
//                 <td className="p-3 text-sm text-gray-600">{entry.bug_id}</td>
//                 <td className="p-3 text-sm text-gray-600">
//                   {entry.test_case_number}
//                 </td>
//                 <td className="p-3 text-sm text-gray-600">{entry.status}</td>
//                 <td className="p-3 text-sm text-gray-600">
//                   {new Date(entry.updated_at).toLocaleDateString()}
//                 </td>
//                 <td className="p-3 text-sm text-gray-600">
//                   {entry.updated_by}
//                 </td>
//                 <td className="p-3 text-sm text-gray-600">
//                   {new Date(entry.updated_at).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SingleDefect;

//

//

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  FaBug,
  FaListAlt,
  FaFileSignature,
  FaProjectDiagram,
  FaCamera,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const SingleDefect = () => {
  const { projectId, defectId } = useParams();

  const [bug, setBug] = useState(null);
  const [status, setStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [assignedDeveloper, setAssignedDeveloper] = useState("");
  const [historyData, setHistoryData] = useState([]);

  // Build a safe axios config with Authorization header (or empty config)
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authConfig = useMemo(
    () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    [token]
  );

  // Only these roles can assign defects (per your requirement)
  const canAssign = useMemo(
    () => ["superadmin", "admin", "test_lead"].includes(userRole),
    [userRole]
  );

  useEffect(() => {
    const fetchDefectAndAux = async () => {
      try {
        // defect (SINGULAR "defect" in path)
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
          authConfig
        );
        const data = res.data;
        setBug(data);
        setStatus(data.status || "");

        if (Array.isArray(data.history)) setHistoryData(data.history);

        // role
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser?.role) setUserRole(loggedInUser.role);

        // developers for this project
        const devRes = await axios.get(
          `${globalBackendRoute}/api/projects/${projectId}/developers`,
          authConfig
        );
        setDevelopers(devRes?.data?.developers || []);
      } catch (err) {
        console.error("Error fetching defect:", err?.response?.data || err);
      }
    };

    if (projectId && defectId) fetchDefectAndAux();
  }, [projectId, defectId, authConfig]);

  if (!bug) return <div>Loading...</div>;

  const getImageUrl = (bugImage) => {
    if (bugImage) {
      const normalizedPath = bugImage
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  const handleStatusUpdate = async () => {
    if (status === "Open/New") {
      alert("You cannot change the status back to 'Open/New'.");
      return;
    }

    if (
      status === "Closed" &&
      !["admin", "project_manager", "superadmin", "qa_lead"].includes(userRole)
    ) {
      alert(
        "Only admins, project managers, superadmins, or qa_lead can close defects."
      );
      return;
    }

    try {
      await axios.put(
        // SINGULAR "defect" in path
        `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
        {
          status,
          updated_by: JSON.parse(localStorage.getItem("user"))?.name,
          assignedDeveloper,
        },
        authConfig
      );
      alert("Status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error?.response?.data || error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bug Image */}
        <div className="col-span-1">
          <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
            <FaBug className="mr-2 text-indigo-600 inline-block" /> Defect
            Details
          </h5>
          <div className="my-4">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center">
              <FaCamera className="text-gray-600 mr-2" /> Bug Picture
            </label>
            <div className="mt-2">
              <img
                src={getImageUrl(bug.bug_picture)}
                alt="Bug"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Defect Details */}
        <div className="col-span-2">
          {/* Nav */}
          <div className="mb-5">
            <Link
              to={`/single-project/${projectId}/all-defects`}
              className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
            >
              All Defects
            </Link>

            {canAssign && (
              <Link
                to={`/single-project/${projectId}/assign-defect/${defectId}`}
                className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
              >
                Assign Defect to Developer
              </Link>
            )}

            <Link
              to={`/single-project/${projectId}`}
              className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
            >
              Project Dashboard
            </Link>
          </div>

          {/* First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center">
                <FaProjectDiagram className="text-orange-500 mr-2" size={24} />
                <label className="text-sm font-medium leading-6 text-gray-900">
                  Project Name
                </label>
              </div>
              <input
                type="text"
                value={bug.project_name || "N/A"}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <div className="flex items-center">
                <FaListAlt className="text-blue-500 mr-2" size={24} />
                <label className="text-sm font-medium leading-6 text-gray-900">
                  Module Name
                </label>
              </div>
              <input
                type="text"
                value={bug.module_name || "N/A"}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <div className="flex items-center">
                <FaListAlt className="text-blue-500 mr-2" size={24} />
                <label className="text-sm font-medium leading-6 text-gray-900">
                  Test Case Number
                </label>
              </div>
              <input
                type="text"
                value={bug.test_case_number || "N/A"}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <div className="flex items-center">
                <FaFileSignature className="text-green-500 mr-2" size={24} />
                <label className="text-sm font-medium leading-6 text-gray-900">
                  Test Case Name
                </label>
              </div>
              <input
                type="text"
                value={bug.test_case_name || "N/A"}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Expected Result
              </label>
              <input
                type="text"
                value={bug.expected_result || "N/A"}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Actual Result
              </label>
              <input
                type="text"
                value={bug.actual_result || "N/A"}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Description & Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Description of Defect
              </label>
              <textarea
                value={bug.description_of_defect || "N/A"}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600 resize-none overflow-auto"
                style={{ whiteSpace: "pre-wrap", height: "auto" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Steps to Replicate
              </label>
              <ul className="ml-4 shadow p-2 rounded">
                {(bug.steps_to_replicate || []).map((step, index) => (
                  <li key={index}>
                    <span className="font-bold">Step:</span> {index + 1} |{" "}
                    <span className="font-bold"> Actual Step:</span> {step} |{" "}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Status + Assign */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
              >
                {userRole && (
                  <>
                    {[
                      "superadmin",
                      "admin",
                      "project_manager",
                      "qa_lead",
                    ].includes(userRole) && (
                      <>
                        <option value="Open/New">Open/New</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Re-opened">Re-opened</option>
                        <option value="Closed">Closed</option>
                        <option value="Unable-To-fix">Unable-To-fix</option>
                        <option value="Not-An-Error">Not-An-Error</option>
                        <option value="Request-For-Enhancement">
                          Request-For-Enhancement
                        </option>
                      </>
                    )}

                    {userRole === "developer" && (
                      <>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Unable-To-fix">Unable-To-fix</option>
                        <option value="Not-An-Error">Not-An-Error</option>
                        <option value="Request-For-Enhancement">
                          Request-For-Enhancement
                        </option>
                      </>
                    )}

                    {userRole === "test_engineer" && (
                      <>
                        <option value="Open/New">Open/New</option>
                        <option value="Re-opened">Re-opened</option>
                        <option value="Fixed">Fixed</option>
                      </>
                    )}
                  </>
                )}
              </select>
            </div>

            {/* Assign Developer (only if canAssign) + info panel */}
            {canAssign && (
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Assign Developer (optional)
                </label>
                <select
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
                  value={assignedDeveloper}
                  onChange={(e) => setAssignedDeveloper(e.target.value)}
                >
                  <option value="">Select developer…</option>
                  {developers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                {/* Info panel with the points you requested */}
                <div className="mt-3 text-sm text-gray-700 bg-gray-50 border rounded p-3 leading-6">
                  <div className="font-semibold mb-1">
                    Who assigns defects to developers?
                  </div>
                  <ul className="list-disc ml-5">
                    <li>
                      <strong>Test Lead / QA Lead</strong> triages new bugs and
                      prioritizes them.
                    </li>
                    <li>
                      <strong>Development Lead / Engineering Manager</strong>{" "}
                      (or component owner) typically assigns the bug to the
                      appropriate developer (often during triage).
                    </li>
                    <li>
                      In smaller teams, the <strong>Project Manager</strong> or{" "}
                      <strong>Scrum Master</strong> may route/assign, but the
                      technical assignment usually comes from the Dev Lead.
                    </li>
                    <li>
                      In some Scrum teams, developers <strong>pull bugs</strong>{" "}
                      from a prioritized backlog instead of being explicitly
                      assigned.
                    </li>
                    <li className="mt-1">
                      In this app, <strong>superadmin</strong> and{" "}
                      <strong>admin</strong> can also assign defects.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Update Button */}
          <button
            onClick={handleStatusUpdate}
            className="btn btn-sm bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4 mt-4"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Status Update History Table */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Status Update History</h3>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-600">
                Defect ID
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600">
                Test Case Number
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600">
                Current Status
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600">
                Status Assigned Date
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600">
                Changed By
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600">
                Status Changed Date
              </th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((entry, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-gray-100"
              >
                <td className="p-3 text-sm text-gray-600">{entry.bug_id}</td>
                <td className="p-3 text-sm text-gray-600">
                  {entry.test_case_number}
                </td>
                <td className="p-3 text-sm text-gray-600">{entry.status}</td>
                <td className="p-3 text-sm text-gray-600">
                  {new Date(entry.updated_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {entry.updated_by}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {new Date(entry.updated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SingleDefect;
