// // // // import React, { useState, useEffect, useMemo } from "react";
// // // // import axios from "axios";
// // // // import { useParams, Link } from "react-router-dom";
// // // // import {
// // // //   FaBug,
// // // //   FaListAlt,
// // // //   FaFileSignature,
// // // //   FaProjectDiagram,
// // // //   FaCamera,
// // // // } from "react-icons/fa";
// // // // import globalBackendRoute from "../../config/Config";

// // // // const SingleDefect = () => {
// // // //   const { projectId, defectId } = useParams();

// // // //   const [bug, setBug] = useState(null);
// // // //   const [status, setStatus] = useState("");
// // // //   const [userRole, setUserRole] = useState("");
// // // //   const [developers, setDevelopers] = useState([]);
// // // //   const [assignedDeveloper, setAssignedDeveloper] = useState("");
// // // //   const [historyData, setHistoryData] = useState([]);

// // // //   // Build a safe axios config with Authorization header (or empty config)
// // // //   const token =
// // // //     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
// // // //   const authConfig = useMemo(
// // // //     () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
// // // //     [token]
// // // //   );

// // // //   useEffect(() => {
// // // //     const fetchDefectAndAux = async () => {
// // // //       try {
// // // //         // defect (SINGULAR "defect" in path)
// // // //         const res = await axios.get(
// // // //           `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
// // // //           authConfig
// // // //         );
// // // //         const data = res.data;
// // // //         setBug(data);
// // // //         setStatus(data.status || "");

// // // //         if (Array.isArray(data.history)) setHistoryData(data.history);

// // // //         // role
// // // //         const loggedInUser = JSON.parse(localStorage.getItem("user"));
// // // //         if (loggedInUser?.role) setUserRole(loggedInUser.role);

// // // //         // developers for this project
// // // //         const devRes = await axios.get(
// // // //           `${globalBackendRoute}/api/projects/${projectId}/developers`,
// // // //           authConfig
// // // //         );
// // // //         setDevelopers(devRes?.data?.developers || []);
// // // //       } catch (err) {
// // // //         console.error("Error fetching defect:", err?.response?.data || err);
// // // //       }
// // // //     };

// // // //     if (projectId && defectId) fetchDefectAndAux();
// // // //   }, [projectId, defectId, authConfig]);

// // // //   if (!bug) return <div>Loading...</div>;

// // // //   const getImageUrl = (bugImage) => {
// // // //     if (bugImage) {
// // // //       const normalizedPath = bugImage
// // // //         .replace(/\\/g, "/")
// // // //         .split("uploads/")
// // // //         .pop();
// // // //       return `${globalBackendRoute}/uploads/${normalizedPath}`;
// // // //     }
// // // //     return "https://via.placeholder.com/150";
// // // //   };

// // // //   const handleStatusUpdate = async () => {
// // // //     if (status === "Open/New") {
// // // //       alert("You cannot change the status back to 'Open/New'.");
// // // //       return;
// // // //     }

// // // //     if (
// // // //       status === "Closed" &&
// // // //       !["admin", "project_manager", "superadmin", "qa_lead"].includes(userRole)
// // // //     ) {
// // // //       alert(
// // // //         "Only admins, project managers, superadmins, or qa_lead can close defects."
// // // //       );
// // // //       return;
// // // //     }

// // // //     try {
// // // //       await axios.put(
// // // //         // SINGULAR "defect" in path
// // // //         `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
// // // //         {
// // // //           status,
// // // //           updated_by: JSON.parse(localStorage.getItem("user"))?.name,
// // // //           assignedDeveloper,
// // // //         },
// // // //         authConfig
// // // //       );
// // // //       alert("Status updated successfully");
// // // //       window.location.reload();
// // // //     } catch (error) {
// // // //       console.error("Error updating status:", error?.response?.data || error);
// // // //       alert("Failed to update status");
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="container mx-auto px-4 py-12">
// // // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// // // //         {/* Bug Image */}
// // // //         <div className="col-span-1">
// // // //           <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
// // // //             <FaBug className="mr-2 text-indigo-600 inline-block" /> Defect
// // // //             Details
// // // //           </h5>
// // // //           <div className="my-4">
// // // //             <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center">
// // // //               <FaCamera className="text-gray-600 mr-2" /> Bug Picture
// // // //             </label>
// // // //             <div className="mt-2">
// // // //               <img
// // // //                 src={getImageUrl(bug.bug_picture)}
// // // //                 alt="Bug"
// // // //                 className="w-48 h-48 object-cover rounded-lg"
// // // //               />
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Defect Details */}
// // // //         <div className="col-span-2">
// // // //           {/* Nav */}
// // // //           <div className="mb-5">
// // // //             <Link
// // // //               to={`/single-project/${projectId}/all-defects`}
// // // //               className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// // // //             >
// // // //               All Defects
// // // //             </Link>
// // // //             {[
// // // //               "superadmin",
// // // //               "admin",
// // // //               "project_manager",
// // // //               "developer_lead",
// // // //             ].includes(userRole) && (
// // // //               <Link
// // // //                 to={`/single-project/${projectId}/assign-defect/${defectId}`}
// // // //                 className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// // // //               >
// // // //                 Assign Defect to Developer
// // // //               </Link>
// // // //             )}
// // // //             <Link
// // // //               to={`/single-project/${projectId}`}
// // // //               className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// // // //             >
// // // //               Project Dashboard
// // // //             </Link>
// // // //           </div>

// // // //           {/* First Row */}
// // // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// // // //             <div>
// // // //               <div className="flex items-center">
// // // //                 <FaProjectDiagram className="text-orange-500 mr-2" size={24} />
// // // //                 <label className="text-sm font-medium leading-6 text-gray-900">
// // // //                   Project Name
// // // //                 </label>
// // // //               </div>
// // // //               <input
// // // //                 type="text"
// // // //                 value={bug.project_name || "N/A"}
// // // //                 readOnly
// // // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // // //               />
// // // //             </div>

// // // //             <div>
// // // //               <div className="flex items-center">
// // // //                 <FaListAlt className="text-blue-500 mr-2" size={24} />
// // // //                 <label className="text-sm font-medium leading-6 text-gray-900">
// // // //                   Module Name
// // // //                 </label>
// // // //               </div>
// // // //               <input
// // // //                 type="text"
// // // //                 value={bug.module_name || "N/A"}
// // // //                 readOnly
// // // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // // //               />
// // // //             </div>

// // // //             <div>
// // // //               <div className="flex items-center">
// // // //                 <FaListAlt className="text-blue-500 mr-2" size={24} />
// // // //                 <label className="text-sm font-medium leading-6 text-gray-900">
// // // //                   Test Case Number
// // // //                 </label>
// // // //               </div>
// // // //               <input
// // // //                 type="text"
// // // //                 value={bug.test_case_number || "N/A"}
// // // //                 readOnly
// // // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // // //               />
// // // //             </div>
// // // //           </div>

// // // //           {/* Second Row */}
// // // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
// // // //             <div>
// // // //               <div className="flex items-center">
// // // //                 <FaFileSignature className="text-green-500 mr-2" size={24} />
// // // //                 <label className="text-sm font-medium leading-6 text-gray-900">
// // // //                   Test Case Name
// // // //                 </label>
// // // //               </div>
// // // //               <input
// // // //                 type="text"
// // // //                 value={bug.test_case_name || "N/A"}
// // // //                 readOnly
// // // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // // //               />
// // // //             </div>

// // // //             <div>
// // // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // // //                 Expected Result
// // // //               </label>
// // // //               <input
// // // //                 type="text"
// // // //                 value={bug.expected_result || "N/A"}
// // // //                 readOnly
// // // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // // //               />
// // // //             </div>

// // // //             <div>
// // // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // // //                 Actual Result
// // // //               </label>
// // // //               <input
// // // //                 type="text"
// // // //                 value={bug.actual_result || "N/A"}
// // // //                 readOnly
// // // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // // //               />
// // // //             </div>
// // // //           </div>

// // // //           {/* Description & Steps */}
// // // //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
// // // //             <div>
// // // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // // //                 Description of Defect
// // // //               </label>
// // // //               <textarea
// // // //                 value={bug.description_of_defect || "N/A"}
// // // //                 readOnly
// // // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600 resize-none overflow-auto"
// // // //                 style={{ whiteSpace: "pre-wrap", height: "auto" }}
// // // //               />
// // // //             </div>

// // // //             <div>
// // // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // // //                 Steps to Replicate
// // // //               </label>
// // // //               <ul className="ml-4 shadow p-2 rounded">
// // // //                 {(bug.steps_to_replicate || []).map((step, index) => (
// // // //                   <li key={index}>
// // // //                     <span className="font-bold">Step:</span> {index + 1} |{" "}
// // // //                     <span className="font-bold"> Actual Step:</span> {step} |{" "}
// // // //                   </li>
// // // //                 ))}
// // // //               </ul>
// // // //             </div>
// // // //           </div>

// // // //           {/* Status + Assign */}
// // // //           <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
// // // //             <div>
// // // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // // //                 Update Status
// // // //               </label>
// // // //               <select
// // // //                 value={status}
// // // //                 onChange={(e) => setStatus(e.target.value)}
// // // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // // //               >
// // // //                 {userRole && (
// // // //                   <>
// // // //                     {[
// // // //                       "superadmin",
// // // //                       "admin",
// // // //                       "project_manager",
// // // //                       "qa_lead",
// // // //                     ].includes(userRole) && (
// // // //                       <>
// // // //                         <option value="Open/New">Open/New</option>
// // // //                         <option value="Assigned">Assigned</option>
// // // //                         <option value="In-Progress">In-Progress</option>
// // // //                         <option value="Fixed">Fixed</option>
// // // //                         <option value="Re-opened">Re-opened</option>
// // // //                         <option value="Closed">Closed</option>
// // // //                         <option value="Unable-To-fix">Unable-To-fix</option>
// // // //                         <option value="Not-An-Error">Not-An-Error</option>
// // // //                         <option value="Request-For-Enhancement">
// // // //                           Request-For-Enhancement
// // // //                         </option>
// // // //                       </>
// // // //                     )}

// // // //                     {userRole === "developer" && (
// // // //                       <>
// // // //                         <option value="In-Progress">In-Progress</option>
// // // //                         <option value="Fixed">Fixed</option>
// // // //                         <option value="Unable-To-fix">Unable-To-fix</option>
// // // //                         <option value="Not-An-Error">Not-An-Error</option>
// // // //                         <option value="Request-For-Enhancement">
// // // //                           Request-For-Enhancement
// // // //                         </option>
// // // //                       </>
// // // //                     )}

// // // //                     {userRole === "test_engineer" && (
// // // //                       <>
// // // //                         <option value="Open/New">Open/New</option>
// // // //                         <option value="Re-opened">Re-opened</option>
// // // //                         <option value="Fixed">Fixed</option>
// // // //                       </>
// // // //                     )}
// // // //                   </>
// // // //                 )}
// // // //               </select>
// // // //             </div>

// // // //             {
// // // //               <div>
// // // //                 <label className="block text-sm font-medium leading-6 text-gray-900">
// // // //                   Assign Developer (optional)
// // // //                 </label>
// // // //                 <select
// // // //                   className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // // //                   value={assignedDeveloper}
// // // //                   onChange={(e) => setAssignedDeveloper(e.target.value)}
// // // //                 >
// // // //                   <option value="">Select developer…</option>
// // // //                   {developers.map((d) => (
// // // //                     <option key={d._id} value={d._id}>
// // // //                       {d.name}
// // // //                     </option>
// // // //                   ))}
// // // //                 </select>
// // // //               </div>
// // // //             }
// // // //           </div>

// // // //           {/* Update Button */}
// // // //           <button
// // // //             onClick={handleStatusUpdate}
// // // //             className="btn btn-sm bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4 mt-4"
// // // //           >
// // // //             Update Status
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Status Update History Table */}
// // // //       <div className="mt-10">
// // // //         <h3 className="text-xl font-semibold mb-4">Status Update History</h3>
// // // //         <table className="min-w-full bg-white border border-gray-300">
// // // //           <thead>
// // // //             <tr>
// // // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // // //                 Defect ID
// // // //               </th>
// // // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // // //                 Test Case Number
// // // //               </th>
// // // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // // //                 Current Status
// // // //               </th>
// // // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // // //                 Status Assigned Date
// // // //               </th>
// // // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // // //                 Changed By
// // // //               </th>
// // // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // // //                 Status Changed Date
// // // //               </th>
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody>
// // // //             {historyData.map((entry, index) => (
// // // //               <tr
// // // //                 key={index}
// // // //                 className="border-b last:border-none hover:bg-gray-100"
// // // //               >
// // // //                 <td className="p-3 text-sm text-gray-600">{entry.bug_id}</td>
// // // //                 <td className="p-3 text-sm text-gray-600">
// // // //                   {entry.test_case_number}
// // // //                 </td>
// // // //                 <td className="p-3 text-sm text-gray-600">{entry.status}</td>
// // // //                 <td className="p-3 text-sm text-gray-600">
// // // //                   {new Date(entry.updated_at).toLocaleDateString()}
// // // //                 </td>
// // // //                 <td className="p-3 text-sm text-gray-600">
// // // //                   {entry.updated_by}
// // // //                 </td>
// // // //                 <td className="p-3 text-sm text-gray-600">
// // // //                   {new Date(entry.updated_at).toLocaleDateString()}
// // // //                 </td>
// // // //               </tr>
// // // //             ))}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SingleDefect;

// // // //

// // // import React, { useState, useEffect, useMemo } from "react";
// // // import axios from "axios";
// // // import { useParams, Link } from "react-router-dom";
// // // import {
// // //   FaBug,
// // //   FaListAlt,
// // //   FaFileSignature,
// // //   FaProjectDiagram,
// // //   FaCamera,
// // // } from "react-icons/fa";
// // // import globalBackendRoute from "../../config/Config";

// // // const SingleDefect = () => {
// // //   const { projectId, defectId } = useParams();

// // //   const [bug, setBug] = useState(null);
// // //   const [status, setStatus] = useState("");
// // //   const [userRole, setUserRole] = useState("");
// // //   const [developers, setDevelopers] = useState([]);
// // //   const [assignedDeveloper, setAssignedDeveloper] = useState("");
// // //   const [historyData, setHistoryData] = useState([]);

// // //   // Build a safe axios config with Authorization header (or empty config)
// // //   const token =
// // //     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
// // //   const authConfig = useMemo(
// // //     () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
// // //     [token]
// // //   );

// // //   // Only these roles can assign defects
// // //   const canAssign = useMemo(
// // //     () => ["superadmin", "admin", "test_lead"].includes(userRole),
// // //     [userRole]
// // //   );

// // //   useEffect(() => {
// // //     const fetchDefectAndAux = async () => {
// // //       try {
// // //         // defect (SINGULAR "defect" in path)
// // //         const res = await axios.get(
// // //           `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
// // //           authConfig
// // //         );
// // //         const data = res.data;
// // //         setBug(data);
// // //         setStatus(data.status || "");

// // //         if (Array.isArray(data.history)) setHistoryData(data.history);

// // //         // role
// // //         const loggedInUser = JSON.parse(localStorage.getItem("user"));
// // //         if (loggedInUser?.role) setUserRole(loggedInUser.role);

// // //         // developers for this project
// // //         const devRes = await axios.get(
// // //           `${globalBackendRoute}/api/projects/${projectId}/developers`,
// // //           authConfig
// // //         );
// // //         setDevelopers(devRes?.data?.developers || []);
// // //       } catch (err) {
// // //         console.error("Error fetching defect:", err?.response?.data || err);
// // //       }
// // //     };

// // //     if (projectId && defectId) fetchDefectAndAux();
// // //   }, [projectId, defectId, authConfig]);

// // //   if (!bug) return <div>Loading...</div>;

// // //   const getImageUrl = (bugImage) => {
// // //     if (bugImage) {
// // //       const normalizedPath = bugImage
// // //         .replace(/\\/g, "/")
// // //         .split("uploads/")
// // //         .pop();
// // //       return `${globalBackendRoute}/uploads/${normalizedPath}`;
// // //     }
// // //     return "https://via.placeholder.com/150";
// // //   };

// // //   const handleStatusUpdate = async () => {
// // //     if (status === "Open/New") {
// // //       alert("You cannot change the status back to 'Open/New'.");
// // //       return;
// // //     }

// // //     if (
// // //       status === "Closed" &&
// // //       !["admin", "project_manager", "superadmin", "qa_lead"].includes(userRole)
// // //     ) {
// // //       alert(
// // //         "Only admins, project managers, superadmins, or qa_lead can close defects."
// // //       );
// // //       return;
// // //     }

// // //     try {
// // //       await axios.put(
// // //         // SINGULAR "defect" in path
// // //         `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
// // //         {
// // //           status,
// // //           updated_by: JSON.parse(localStorage.getItem("user"))?.name,
// // //           assignedDeveloper,
// // //         },
// // //         authConfig
// // //       );
// // //       alert("Status updated successfully");
// // //       window.location.reload();
// // //     } catch (error) {
// // //       console.error("Error updating status:", error?.response?.data || error);
// // //       alert("Failed to update status");
// // //     }
// // //   };

// // //   return (
// // //     <div className="container mx-auto px-4 py-12">
// // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// // //         {/* Bug Image */}
// // //         <div className="col-span-1">
// // //           <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
// // //             <FaBug className="mr-2 text-indigo-600 inline-block" /> Defect
// // //             Details
// // //           </h5>
// // //           <div className="my-4">
// // //             <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center">
// // //               <FaCamera className="text-gray-600 mr-2" /> Bug Picture
// // //             </label>
// // //             <div className="mt-2">
// // //               <img
// // //                 src={getImageUrl(bug.bug_picture)}
// // //                 alt="Bug"
// // //                 className="w-48 h-48 object-cover rounded-lg"
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Defect Details */}
// // //         <div className="col-span-2">
// // //           {/* Nav */}
// // //           <div className="mb-5">
// // //             <Link
// // //               to={`/single-project/${projectId}/all-defects`}
// // //               className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// // //             >
// // //               All Defects
// // //             </Link>

// // //             {canAssign && (
// // //               <Link
// // //                 to={`/single-project/${projectId}/assign-defect/${defectId}`}
// // //                 className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// // //               >
// // //                 Assign Defect to Developer
// // //               </Link>
// // //             )}

// // //             <Link
// // //               to={`/single-project/${projectId}`}
// // //               className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
// // //             >
// // //               Project Dashboard
// // //             </Link>
// // //           </div>

// // //           {/* First Row */}
// // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// // //             <div>
// // //               <div className="flex items-center">
// // //                 <FaProjectDiagram className="text-orange-500 mr-2" size={24} />
// // //                 <label className="text-sm font-medium leading-6 text-gray-900">
// // //                   Project Name
// // //                 </label>
// // //               </div>
// // //               <input
// // //                 type="text"
// // //                 value={bug.project_name || "N/A"}
// // //                 readOnly
// // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // //               />
// // //             </div>

// // //             <div>
// // //               <div className="flex items-center">
// // //                 <FaListAlt className="text-blue-500 mr-2" size={24} />
// // //                 <label className="text-sm font-medium leading-6 text-gray-900">
// // //                   Module Name
// // //                 </label>
// // //               </div>
// // //               <input
// // //                 type="text"
// // //                 value={bug.module_name || "N/A"}
// // //                 readOnly
// // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // //               />
// // //             </div>

// // //             <div>
// // //               <div className="flex items-center">
// // //                 <FaListAlt className="text-blue-500 mr-2" size={24} />
// // //                 <label className="text-sm font-medium leading-6 text-gray-900">
// // //                   Test Case Number
// // //                 </label>
// // //               </div>
// // //               <input
// // //                 type="text"
// // //                 value={bug.test_case_number || "N/A"}
// // //                 readOnly
// // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* Second Row */}
// // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
// // //             <div>
// // //               <div className="flex items-center">
// // //                 <FaFileSignature className="text-green-500 mr-2" size={24} />
// // //                 <label className="text-sm font-medium leading-6 text-gray-900">
// // //                   Test Case Name
// // //                 </label>
// // //               </div>
// // //               <input
// // //                 type="text"
// // //                 value={bug.test_case_name || "N/A"}
// // //                 readOnly
// // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // //               />
// // //             </div>

// // //             <div>
// // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // //                 Expected Result
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 value={bug.expected_result || "N/A"}
// // //                 readOnly
// // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // //               />
// // //             </div>

// // //             <div>
// // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // //                 Actual Result
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 value={bug.actual_result || "N/A"}
// // //                 readOnly
// // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* Description & Steps */}
// // //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
// // //             <div>
// // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // //                 Description of Defect
// // //               </label>
// // //               <textarea
// // //                 value={bug.description_of_defect || "N/A"}
// // //                 readOnly
// // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600 resize-none overflow-auto"
// // //                 style={{ whiteSpace: "pre-wrap", height: "auto" }}
// // //               />
// // //             </div>

// // //             <div>
// // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // //                 Steps to Replicate
// // //               </label>
// // //               <ul className="ml-4 shadow p-2 rounded">
// // //                 {(bug.steps_to_replicate || []).map((step, index) => (
// // //                   <li key={index}>
// // //                     <span className="font-bold">Step:</span> {index + 1} |{" "}
// // //                     <span className="font-bold"> Actual Step:</span> {step} |{" "}
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //           </div>

// // //           {/* Status + Assign */}
// // //           <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
// // //             <div>
// // //               <label className="block text-sm font-medium leading-6 text-gray-900">
// // //                 Update Status
// // //               </label>
// // //               <select
// // //                 value={status}
// // //                 onChange={(e) => setStatus(e.target.value)}
// // //                 className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // //               >
// // //                 {userRole && (
// // //                   <>
// // //                     {[
// // //                       "superadmin",
// // //                       "admin",
// // //                       "project_manager",
// // //                       "qa_lead",
// // //                     ].includes(userRole) && (
// // //                       <>
// // //                         <option value="Open/New">Open/New</option>
// // //                         <option value="Assigned">Assigned</option>
// // //                         <option value="In-Progress">In-Progress</option>
// // //                         <option value="Fixed">Fixed</option>
// // //                         <option value="Re-opened">Re-opened</option>
// // //                         <option value="Closed">Closed</option>
// // //                         <option value="Unable-To-fix">Unable-To-fix</option>
// // //                         <option value="Not-An-Error">Not-An-Error</option>
// // //                         <option value="Request-For-Enhancement">
// // //                           Request-For-Enhancement
// // //                         </option>
// // //                       </>
// // //                     )}

// // //                     {userRole === "developer" && (
// // //                       <>
// // //                         <option value="In-Progress">In-Progress</option>
// // //                         <option value="Fixed">Fixed</option>
// // //                         <option value="Unable-To-fix">Unable-To-fix</option>
// // //                         <option value="Not-An-Error">Not-An-Error</option>
// // //                         <option value="Request-For-Enhancement">
// // //                           Request-For-Enhancement
// // //                         </option>
// // //                       </>
// // //                     )}

// // //                     {userRole === "test_engineer" && (
// // //                       <>
// // //                         <option value="Open/New">Open/New</option>
// // //                         <option value="Re-opened">Re-opened</option>
// // //                         <option value="Fixed">Fixed</option>
// // //                       </>
// // //                     )}
// // //                   </>
// // //                 )}
// // //               </select>
// // //             </div>

// // //             {/* Assign Developer (only if canAssign) */}
// // //             {canAssign && (
// // //               <div>
// // //                 <label className="block text-sm font-medium leading-6 text-gray-900">
// // //                   Assign Developer (optional)
// // //                 </label>
// // //                 <select
// // //                   className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
// // //                   value={assignedDeveloper}
// // //                   onChange={(e) => setAssignedDeveloper(e.target.value)}
// // //                 >
// // //                   <option value="">Select developer…</option>
// // //                   {developers.map((d) => (
// // //                     <option key={d._id} value={d._id}>
// // //                       {d.name}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Update Button */}
// // //           <button
// // //             onClick={handleStatusUpdate}
// // //             className="btn btn-sm bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4 mt-4"
// // //           >
// // //             Update Status
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Status Update History Table */}
// // //       <div className="mt-10">
// // //         <h3 className="text-xl font-semibold mb-4">Status Update History</h3>
// // //         <table className="min-w-full bg-white border border-gray-300">
// // //           <thead>
// // //             <tr>
// // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // //                 Defect ID
// // //               </th>
// // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // //                 Test Case Number
// // //               </th>
// // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // //                 Current Status
// // //               </th>
// // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // //                 Status Assigned Date
// // //               </th>
// // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // //                 Changed By
// // //               </th>
// // //               <th className="p-3 text-sm font-semibold text-gray-600">
// // //                 Status Changed Date
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {historyData.map((entry, index) => (
// // //               <tr
// // //                 key={index}
// // //                 className="border-b last:border-none hover:bg-gray-100"
// // //               >
// // //                 <td className="p-3 text-sm text-gray-600">{entry.bug_id}</td>
// // //                 <td className="p-3 text-sm text-gray-600">
// // //                   {entry.test_case_number}
// // //                 </td>
// // //                 <td className="p-3 text-sm text-gray-600">{entry.status}</td>
// // //                 <td className="p-3 text-sm text-gray-600">
// // //                   {new Date(entry.updated_at).toLocaleDateString()}
// // //                 </td>
// // //                 <td className="p-3 text-sm text-gray-600">
// // //                   {entry.updated_by}
// // //                 </td>
// // //                 <td className="p-3 text-sm text-gray-600">
// // //                   {new Date(entry.updated_at).toLocaleDateString()}
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SingleDefect;

// // //

// // //

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

// //   // Only these roles can assign defects (per your requirement)
// //   const canAssign = useMemo(
// //     () => ["superadmin", "admin", "test_lead"].includes(userRole),
// //     [userRole]
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

// //             {canAssign && (
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

// //             {/* Assign Developer (only if canAssign) + info panel */}
// //             {canAssign && (
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

// //                 {/* Info panel with the points you requested */}
// //                 <div className="mt-3 text-sm text-gray-700 bg-gray-50 border rounded p-3 leading-6">
// //                   <div className="font-semibold mb-1">
// //                     Who assigns defects to developers?
// //                   </div>
// //                   <ul className="list-disc ml-5">
// //                     <li>
// //                       <strong>Test Lead / QA Lead</strong> triages new bugs and
// //                       prioritizes them.
// //                     </li>
// //                     <li>
// //                       <strong>Development Lead / Engineering Manager</strong>{" "}
// //                       (or component owner) typically assigns the bug to the
// //                       appropriate developer (often during triage).
// //                     </li>
// //                     <li>
// //                       In smaller teams, the <strong>Project Manager</strong> or{" "}
// //                       <strong>Scrum Master</strong> may route/assign, but the
// //                       technical assignment usually comes from the Dev Lead.
// //                     </li>
// //                     <li>
// //                       In some Scrum teams, developers <strong>pull bugs</strong>{" "}
// //                       from a prioritized backlog instead of being explicitly
// //                       assigned.
// //                     </li>
// //                     <li className="mt-1">
// //                       In this app, <strong>superadmin</strong> and{" "}
// //                       <strong>admin</strong> can also assign defects.
// //                     </li>
// //                   </ul>
// //                 </div>
// //               </div>
// //             )}
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

// //

// //

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

// const cls = (...a) => a.filter(Boolean).join(" ");

// // Priority badge colors
// const priorityColors = {
//   low: "bg-emerald-100 text-emerald-700 border-emerald-300",
//   medium: "bg-amber-100 text-amber-700 border-amber-300",
//   high: "bg-rose-100 text-rose-700 border-rose-300",
// };

// // Severity badge colors
// const severityColors = {
//   minor: "bg-sky-100 text-sky-700 border-sky-300",
//   major: "bg-orange-100 text-orange-700 border-orange-300",
//   critical: "bg-red-100 text-red-700 border-red-300",
//   blocker: "bg-slate-300 text-slate-800 border-slate-400",
// };

// // Status badge colors (supporting both In-progress & In-Progress variants)
// const statusColors = {
//   "Open/New": "bg-rose-100 text-rose-700 border-rose-300",
//   Assigned: "bg-amber-100 text-amber-700 border-amber-300",
//   "In-progress": "bg-blue-100 text-blue-700 border-blue-300",
//   "In-Progress": "bg-blue-100 text-blue-700 border-blue-300",
//   Fixed: "bg-emerald-100 text-emerald-700 border-emerald-300",
//   "Re-opened": "bg-purple-100 text-purple-700 border-purple-300",
//   Closed: "bg-slate-200 text-slate-800 border-slate-300",
//   "Unable-To-fix": "bg-slate-100 text-slate-700 border-slate-200",
//   "Not-An-Error": "bg-slate-100 text-slate-700 border-slate-200",
//   "Request-For-Enhancement": "bg-indigo-100 text-indigo-700 border-indigo-300",
// };

// const getStatusBadge = (status) =>
//   statusColors[status] || "bg-slate-100 text-slate-700 border-slate-200";

// const SingleDefect = () => {
//   const { projectId, defectId } = useParams();

//   const [bug, setBug] = useState(null);
//   const [status, setStatus] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [developers, setDevelopers] = useState([]);
//   const [assignedDeveloper, setAssignedDeveloper] = useState("");
//   const [historyData, setHistoryData] = useState([]);
//   const [showImageModal, setShowImageModal] = useState(false);

//   // auth config
//   const token =
//     localStorage.getItem("userToken") || localStorage.getItem("token") || "";
//   const authConfig = useMemo(
//     () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
//     [token]
//   );

//   // Only these can assign (kept for top button visibility)
//   const canAssign = useMemo(
//     () => ["superadmin", "admin", "test_lead"].includes(userRole),
//     [userRole]
//   );

//   useEffect(() => {
//     const fetchDefectAndAux = async () => {
//       try {
//         const res = await axios.get(
//           `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
//           authConfig
//         );
//         const data = res.data;
//         setBug(data);
//         setStatus(data.status || "");

//         if (Array.isArray(data.history)) setHistoryData(data.history);

//         const loggedInUser = JSON.parse(localStorage.getItem("user"));
//         if (loggedInUser?.role) setUserRole(loggedInUser.role);

//         // keep assignedDeveloper in state so API behavior remains unchanged
//         if (data.assignedDeveloper || data.assigned_to) {
//           setAssignedDeveloper(data.assignedDeveloper || data.assigned_to);
//         }

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

//   if (!bug)
//     return (
//       <div className="bg-white py-6 sm:py-8 text-[13px]">
//         <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//           Loading defect details…
//         </div>
//       </div>
//     );

//   const getImageUrl = (bugImage) => {
//     if (bugImage) {
//       const normalizedPath = String(bugImage)
//         .replace(/\\/g, "/")
//         .split("uploads/")
//         .pop();
//       return `${globalBackendRoute}/uploads/${normalizedPath}`;
//     }
//     return "https://via.placeholder.com/300x300?text=Bug";
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
//         `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
//         {
//           status,
//           updated_by: JSON.parse(localStorage.getItem("user"))?.name,
//           // keep assignedDeveloper in payload to avoid changing backend behavior
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

//   const priorityKey = (bug.priority || "").toLowerCase();
//   const severityKey = (bug.severity || "").toLowerCase();
//   const statusClass = getStatusBadge(bug.status);

//   return (
//     <div className="bg-white py-6 sm:py-8 text-[13px]">
//       <div className="mx-auto container px-2 sm:px-3 lg:px-4">
//         {/* Top bar (match All Defects style) */}
//         <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
//           <div className="min-w-[220px]">
//             <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px] flex items-center gap-2">
//               <FaBug className="text-indigo-500" />
//               Defect Details
//             </h2>
//             <div className="text-[11px] text-gray-600 mt-0.5">
//               {bug.bug_id ? `Defect ID: ${bug.bug_id}` : `Defect: ${defectId}`}
//             </div>

//             {/* Pill summary like All Defects */}
//             <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
//               {bug.priority && (
//                 <span
//                   className={cls(
//                     "inline-flex items-center px-2 py-0.5 rounded-full border font-medium",
//                     priorityColors[priorityKey] ||
//                       "bg-slate-100 text-slate-700 border-slate-200"
//                   )}
//                 >
//                   Priority: {bug.priority}
//                 </span>
//               )}
//               {bug.severity && (
//                 <span
//                   className={cls(
//                     "inline-flex items-center px-2 py-0.5 rounded-full border font-medium",
//                     severityColors[severityKey] ||
//                       "bg-slate-100 text-slate-700 border-slate-200"
//                   )}
//                 >
//                   Severity: {bug.severity}
//                 </span>
//               )}
//               {bug.status && (
//                 <span
//                   className={cls(
//                     "inline-flex items-center px-2 py-0.5 rounded-full border font-semibold",
//                     statusClass
//                   )}
//                 >
//                   Status: {bug.status}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Right-side actions (icons/buttons similar placement) */}
//           <div className="flex items-center gap-2 flex-wrap">
//             <Link
//               to={`/single-project/${projectId}/all-defects`}
//               className="px-3 py-1.5 bg-slate-50 border rounded-md text-[11px] hover:bg-slate-100"
//             >
//               All Defects
//             </Link>

//             {canAssign && (
//               <Link
//                 to={`/single-project/${projectId}/assign-defect/${defectId}`}
//                 className="px-3 py-1.5 bg-slate-50 border rounded-md text-[11px] hover:bg-slate-100"
//               >
//                 Assign Defect to Developer
//               </Link>
//             )}

//             <Link
//               to={`/single-project/${projectId}`}
//               className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-[11px]"
//             >
//               Project Dashboard
//             </Link>
//           </div>
//         </div>

//         {/* Main content grid: image + fields (aligned with All Defects look) */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Bug Image with clickable modal */}
//           <div className="col-span-1">
//             <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
//               <FaCamera className="text-gray-600" /> Bug Screenshot
//             </label>
//             <div
//               className="inline-block rounded-lg border border-slate-200 p-1 bg-slate-50 cursor-pointer hover:shadow-sm transition"
//               onClick={() => setShowImageModal(true)}
//               title="Click to view full size"
//             >
//               <img
//                 src={getImageUrl(bug.bug_picture)}
//                 alt="Bug"
//                 className="w-40 h-40 object-cover rounded-md"
//               />
//             </div>
//           </div>

//           {/* Defect primary info */}
//           <div className="col-span-2 space-y-3">
//             {/* Row 1 */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <FaProjectDiagram className="text-orange-500" />
//                   <span className="text-xs font-semibold text-slate-800">
//                     Project Name
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={bug.project_name || "N/A"}
//                   readOnly
//                   className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
//                 />
//               </div>

//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <FaListAlt className="text-blue-500" />
//                   <span className="text-xs font-semibold text-slate-800">
//                     Module Name
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={bug.module_name || "N/A"}
//                   readOnly
//                   className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
//                 />
//               </div>

//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <FaListAlt className="text-blue-500" />
//                   <span className="text-xs font-semibold text-slate-800">
//                     Test Case Number
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={bug.test_case_number || "N/A"}
//                   readOnly
//                   className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
//                 />
//               </div>
//             </div>

//             {/* Row 2 */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <FaFileSignature className="text-green-500" />
//                   <span className="text-xs font-semibold text-slate-800">
//                     Test Case Name
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={bug.test_case_name || "N/A"}
//                   readOnly
//                   className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
//                 />
//               </div>

//               <div>
//                 <span className="block text-xs font-semibold text-slate-800 mb-1">
//                   Expected Result
//                 </span>
//                 <input
//                   type="text"
//                   value={bug.expected_result || "N/A"}
//                   readOnly
//                   className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
//                 />
//               </div>

//               <div>
//                 <span className="block text-xs font-semibold text-slate-800 mb-1">
//                   Actual Result
//                 </span>
//                 <input
//                   type="text"
//                   value={bug.actual_result || "N/A"}
//                   readOnly
//                   className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Description & Steps */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
//           <div>
//             <span className="block text-xs font-semibold text-slate-800 mb-1">
//               Description of Defect
//             </span>
//             <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] whitespace-pre-wrap max-h-56 overflow-auto">
//               {bug.description_of_defect || "N/A"}
//             </div>
//           </div>

//           <div>
//             <span className="block text-xs font-semibold text-slate-800 mb-1">
//               Steps to Replicate
//             </span>
//             <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] max-h-56 overflow-auto">
//               {Array.isArray(bug.steps_to_replicate) &&
//               bug.steps_to_replicate.length ? (
//                 <ul className="list-decimal ml-4 space-y-1">
//                   {bug.steps_to_replicate.map((step, index) => (
//                     <li key={index}>{step}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 "N/A"
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Status Update (no assign dropdown, no info box) */}
//         <div className="mt-5 max-w-md">
//           <span className="block text-xs font-semibold text-slate-800 mb-1">
//             Update Status
//           </span>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="block w-full rounded-md border border-slate-200 bg-white py-1.5 px-2 text-[12px]"
//           >
//             {userRole && (
//               <>
//                 {["superadmin", "admin", "project_manager", "qa_lead"].includes(
//                   userRole
//                 ) && (
//                   <>
//                     <option value="Open/New">Open/New</option>
//                     <option value="Assigned">Assigned</option>
//                     <option value="In-Progress">In-Progress</option>
//                     <option value="Fixed">Fixed</option>
//                     <option value="Re-opened">Re-opened</option>
//                     <option value="Closed">Closed</option>
//                     <option value="Unable-To-fix">Unable-To-fix</option>
//                     <option value="Not-An-Error">Not-An-Error</option>
//                     <option value="Request-For-Enhancement">
//                       Request-For-Enhancement
//                     </option>
//                   </>
//                 )}

//                 {userRole === "developer" && (
//                   <>
//                     <option value="In-Progress">In-Progress</option>
//                     <option value="Fixed">Fixed</option>
//                     <option value="Unable-To-fix">Unable-To-fix</option>
//                     <option value="Not-An-Error">Not-An-Error</option>
//                     <option value="Request-For-Enhancement">
//                       Request-For-Enhancement
//                     </option>
//                   </>
//                 )}

//                 {userRole === "test_engineer" && (
//                   <>
//                     <option value="Open/New">Open/New</option>
//                     <option value="Re-opened">Re-opened</option>
//                     <option value="Fixed">Fixed</option>
//                   </>
//                 )}
//               </>
//             )}
//           </select>

//           <button
//             onClick={handleStatusUpdate}
//             className="mt-3 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] hover:bg-indigo-800"
//           >
//             Update Status
//           </button>
//         </div>

//         {/* Status Update History (styled like All Defects list view) */}
//         <div className="mt-8">
//           <h3 className="text-sm font-semibold text-slate-800 mb-2">
//             Status Update History
//           </h3>

//           {!historyData || historyData.length === 0 ? (
//             <div className="text-[12px] text-slate-500">
//               No status history available.
//             </div>
//           ) : (
//             <div className="mt-2">
//               {/* Header row */}
//               <div className="grid grid-cols-[40px,1.2fr,1.4fr,1.1fr,1.1fr,1.1fr] items-center text-[11px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
//                 <div>#</div>
//                 <div>Status</div>
//                 <div>Changed By</div>
//                 <div>Defect ID</div>
//                 <div>Test Case</div>
//                 <div>Changed At</div>
//               </div>

//               {/* Rows */}
//               <div className="divide-y divide-slate-100">
//                 {historyData.map((entry, index) => {
//                   const rowStatusClass = getStatusBadge(entry.status);
//                   return (
//                     <div
//                       key={index}
//                       className="grid grid-cols-[40px,1.2fr,1.4fr,1.1fr,1.1fr,1.1fr] items-center text-[11px] px-3 py-2"
//                     >
//                       <div className="text-slate-700">{index + 1}</div>

//                       <div>
//                         <span
//                           className={cls(
//                             "inline-flex items-center px-2 py-0.5 rounded-full border font-semibold",
//                             rowStatusClass
//                           )}
//                         >
//                           {entry.status}
//                         </span>
//                       </div>

//                       <div className="text-slate-700 truncate">
//                         {entry.updated_by || "—"}
//                       </div>

//                       <div className="text-slate-700 truncate">
//                         {entry.bug_id || bug.bug_id || "—"}
//                       </div>

//                       <div className="text-slate-700 truncate">
//                         {entry.test_case_number || bug.test_case_number || "—"}
//                       </div>

//                       <div className="text-slate-600">
//                         {entry.updated_at
//                           ? new Date(entry.updated_at).toLocaleString()
//                           : "—"}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Full-size image modal */}
//       {showImageModal && (
//         <div
//           className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
//           onClick={() => setShowImageModal(false)}
//         >
//           <img
//             src={getImageUrl(bug.bug_picture)}
//             alt="Bug full view"
//             className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SingleDefect;

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

const cls = (...a) => a.filter(Boolean).join(" ");

// Priority badge colors
const priorityColors = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  high: "bg-rose-100 text-rose-700 border-rose-300",
};

// Severity badge colors
const severityColors = {
  minor: "bg-sky-100 text-sky-700 border-sky-300",
  major: "bg-orange-100 text-orange-700 border-orange-300",
  critical: "bg-red-100 text-red-700 border-red-300",
  blocker: "bg-slate-300 text-slate-800 border-slate-400",
};

// Status badge colors
const statusColors = {
  "Open/New": "bg-rose-100 text-rose-700 border-rose-300",
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

const SingleDefect = () => {
  const { projectId, defectId } = useParams();

  const [bug, setBug] = useState(null);
  const [status, setStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [assignedDeveloper, setAssignedDeveloper] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authConfig = useMemo(
    () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    [token]
  );

  const canAssign = useMemo(
    () => ["superadmin", "admin", "test_lead"].includes(userRole),
    [userRole]
  );

  useEffect(() => {
    const fetchDefectAndAux = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`,
          authConfig
        );
        const data = res.data;
        setBug(data);
        setStatus(data.status || "");

        if (Array.isArray(data.history)) setHistoryData(data.history);

        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser?.role) setUserRole(loggedInUser.role);

        if (data.assignedDeveloper || data.assigned_to) {
          setAssignedDeveloper(data.assignedDeveloper || data.assigned_to);
        }

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

  if (!bug)
    return (
      <div className="bg-white py-6 sm:py-8 text-[13px]">
        <div className="mx-auto container px-2 sm:px-3 lg:px-4">
          Loading defect details…
        </div>
      </div>
    );

  const getImageUrl = (bugImage) => {
    if (bugImage) {
      const normalizedPath = String(bugImage)
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/300x300?text=Bug";
  };

  // Once defect is not Open/New (or assigned), don't allow going back to Open/New.
  const canSelectOpenNew =
    (bug.status === "Open/New" ||
      bug.status === "Open" ||
      bug.status === "New") &&
    !bug.assignedDeveloper &&
    !bug.assigned_to;

  const handleStatusUpdate = async () => {
    // Guard: no going back to Open/New after it has progressed / been assigned.
    if (status === "Open/New" && !canSelectOpenNew) {
      alert("You cannot change the status back to 'Open/New' for this defect.");
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

  const priorityKey = (bug.priority || "").toLowerCase();
  const severityKey = (bug.severity || "").toLowerCase();
  const statusClass = getStatusBadge(bug.status);

  return (
    <div className="bg-white py-6 sm:py-8 text-[13px]">
      <div className="mx-auto container px-2 sm:px-3 lg:px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <div className="min-w-[220px]">
            <h2 className="font-semibold tracking-tight text-indigo-600 text-[16px] flex items-center gap-2">
              <FaBug className="text-indigo-500" />
              Defect Details
            </h2>
            <div className="text-[11px] text-gray-600 mt-0.5">
              {bug.bug_id ? `Defect ID: ${bug.bug_id}` : `Defect: ${defectId}`}
            </div>

            <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
              {bug.priority && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-medium",
                    priorityColors[priorityKey] ||
                      "bg-slate-100 text-slate-700 border-slate-200"
                  )}
                >
                  Priority: {bug.priority}
                </span>
              )}
              {bug.severity && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-medium",
                    severityColors[severityKey] ||
                      "bg-slate-100 text-slate-700 border-slate-200"
                  )}
                >
                  Severity: {bug.severity}
                </span>
              )}
              {bug.status && (
                <span
                  className={cls(
                    "inline-flex items-center px-2 py-0.5 rounded-full border font-semibold",
                    statusClass
                  )}
                >
                  Status: {bug.status}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/single-project/${projectId}/all-defects`}
              className="px-3 py-1.5 bg-slate-50 border rounded-md text-[11px] hover:bg-slate-100"
            >
              All Defects
            </Link>

            {canAssign && (
              <Link
                to={`/single-project/${projectId}/assign-defect/${defectId}`}
                className="px-3 py-1.5 bg-slate-50 border rounded-md text-[11px] hover:bg-slate-100"
              >
                Assign Defect to Developer
              </Link>
            )}

            <Link
              to={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-[11px]"
            >
              Project Dashboard
            </Link>
          </div>
        </div>

        {/* Main layout: left image, right all fields/sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px,minmax(0,1.9fr)] gap-4">
          {/* Left: Image only */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FaCamera className="text-gray-600" /> Bug Screenshot
            </label>
            <div
              className="inline-block rounded-lg border border-slate-200 p-1 bg-slate-50 cursor-pointer hover:shadow-sm transition"
              onClick={() => setShowImageModal(true)}
              title="Click to view full size"
            >
              <img
                src={getImageUrl(bug.bug_picture)}
                alt="Bug"
                className="w-40 h-40 object-cover rounded-md"
              />
            </div>
          </div>

          {/* Right: all details + description + steps + status update */}
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaProjectDiagram className="text-orange-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Project Name
                  </span>
                </div>
                <input
                  type="text"
                  value={bug.project_name || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaListAlt className="text-blue-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Module Name
                  </span>
                </div>
                <input
                  type="text"
                  value={bug.module_name || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaListAlt className="text-blue-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Test Case Number
                  </span>
                </div>
                <input
                  type="text"
                  value={bug.test_case_number || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaFileSignature className="text-green-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Test Case Name
                  </span>
                </div>
                <input
                  type="text"
                  value={bug.test_case_name || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Expected Result
                </span>
                <input
                  type="text"
                  value={bug.expected_result || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Actual Result
                </span>
                <input
                  type="text"
                  value={bug.actual_result || "N/A"}
                  readOnly
                  className="block w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2 text-[12px]"
                />
              </div>
            </div>

            {/* Description & Steps (two columns inside right side) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Description of Defect
                </span>
                <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] whitespace-pre-wrap max-h-48 overflow-auto">
                  {bug.description_of_defect || "N/A"}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 mb-1">
                  Steps to Replicate
                </span>
                <div className="border border-slate-200 bg-slate-50 rounded-md p-2 text-[12px] max-h-48 overflow-auto">
                  {Array.isArray(bug.steps_to_replicate) &&
                  bug.steps_to_replicate.length ? (
                    <ul className="list-decimal ml-4 space-y-1">
                      {bug.steps_to_replicate.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
            </div>

            {/* Status Update (on right side) */}
            <div className="max-w-xs">
              <span className="block text-xs font-semibold text-slate-800 mb-1">
                Update Status
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full rounded-md border border-slate-200 bg-white py-1.5 px-2 text-[12px]"
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
                        {canSelectOpenNew && (
                          <option value="Open/New">Open/New</option>
                        )}
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
                        {canSelectOpenNew && (
                          <option value="Open/New">Open/New</option>
                        )}
                        <option value="Re-opened">Re-opened</option>
                        <option value="Fixed">Fixed</option>
                      </>
                    )}
                  </>
                )}
              </select>

              <button
                onClick={handleStatusUpdate}
                className="mt-3 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] hover:bg-indigo-800"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Status Update History (full width, list-style like All Defects) */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Defect Status Update History
          </h3>

          {!historyData || historyData.length === 0 ? (
            <div className="text-[12px] text-slate-500">
              No status history available.
            </div>
          ) : (
            <div className="mt-2">
              {/* Header */}
              <div className="grid grid-cols-[40px,1.2fr,1.4fr,1.1fr,1.1fr,1.4fr] items-center text-[11px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
                <div>#</div>
                <div>Status</div>
                <div>Changed By</div>
                <div>Defect ID</div>
                <div>Test Case</div>
                <div>Changed At</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100">
                {historyData.map((entry, index) => {
                  const rowStatusClass = getStatusBadge(entry.status);
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-[40px,1.2fr,1.4fr,1.1fr,1.1fr,1.4fr] items-center text-[11px] px-3 py-2"
                    >
                      <div className="text-slate-700">{index + 1}</div>

                      <div>
                        <span
                          className={cls(
                            "inline-flex items-center px-2 py-0.5 rounded-full border font-semibold",
                            rowStatusClass
                          )}
                        >
                          {entry.status}
                        </span>
                      </div>

                      <div className="text-slate-700 truncate">
                        {entry.updated_by || "—"}
                      </div>

                      <div className="text-slate-700 truncate">
                        {entry.bug_id || bug.bug_id || "—"}
                      </div>

                      <div className="text-slate-700 truncate">
                        {entry.test_case_number || bug.test_case_number || "—"}
                      </div>

                      <div className="text-slate-600">
                        {entry.updated_at
                          ? new Date(entry.updated_at).toLocaleString()
                          : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-size image modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={getImageUrl(bug.bug_picture)}
            alt="Bug full view"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default SingleDefect;
