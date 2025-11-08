// // // import React, { useEffect, useState } from "react";
// // // import { useParams, Link, useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import {
// // //   FaUser,
// // //   FaPlus,
// // //   FaFileAlt,
// // //   FaCodeBranch,
// // //   FaBug,
// // //   FaChartBar,
// // //   FaLaptopCode,
// // //   FaHardHat,
// // //   FaCalendarAlt,
// // //   FaFolderOpen,
// // //   FaClock,
// // //   FaNetworkWired,
// // //   FaTasks,
// // //   FaShieldAlt,
// // //   FaProjectDiagram,
// // //   FaUserShield,
// // //   FaUserFriends,
// // //   FaUserCog,
// // //   FaUserTie,
// // //   FaUsers,
// // //   FaBusinessTime,
// // // } from "react-icons/fa";
// // // import globalBackendRoute from "../../config/Config";

// // // const SingleProject = () => {
// // //   const { projectId } = useParams();
// // //   const [userRole, setUserRole] = useState(null);
// // //   const [project, setProject] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [totalTestCases, setTotalTestCases] = useState(0);
// // //   const [totalDefects, setTotalDefects] = useState(0);
// // //   const navigate = useNavigate();

// // //   // after: const { projectId } = useParams();
// // //   useEffect(() => {
// // //     if (projectId && /^[0-9a-fA-F]{24}$/.test(projectId)) {
// // //       localStorage.setItem("lastProjectId", projectId);
// // //     }
// // //   }, [projectId]);

// // //   // read once for ids we need elsewhere
// // //   const loggedInUser = JSON.parse(localStorage.getItem("user"));
// // //   const developerId = loggedInUser ? loggedInUser.id : null;

// // //   useEffect(() => {
// // //     fetchProject();
// // //     fetchTestCaseCount();
// // //     fetchDefectsCount();
// // //     const user = JSON.parse(localStorage.getItem("user"));
// // //     if (user?.role) setUserRole(user.role);
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [projectId]);

// // //   const fetchProject = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");
// // //       const response = await axios.get(
// // //         `${globalBackendRoute}/api/single-project/${projectId}`,
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       setProject(response.data);
// // //       setLoading(false);
// // //     } catch (error) {
// // //       if (error.response?.status === 401) {
// // //         alert("Unauthorized access. Please log in.");
// // //         navigate("/login");
// // //       } else {
// // //         console.error("Error fetching project:", error.message);
// // //         setError("Failed to load project data.");
// // //         setLoading(false);
// // //       }
// // //     }
// // //   };

// // //   const fetchTestCaseCount = async () => {
// // //     try {
// // //       const res = await axios.get(
// // //         `${globalBackendRoute}/api/projects/${projectId}/test-cases-count`
// // //       );
// // //       setTotalTestCases(res.data.totalTestCases || 0);
// // //     } catch (err) {
// // //       console.error(
// // //         "Error fetching test case count:",
// // //         err?.response?.status,
// // //         err?.message
// // //       );
// // //       setTotalTestCases(0);
// // //     }
// // //   };

// // //   const fetchDefectsCount = async () => {
// // //     try {
// // //       const res = await axios.get(
// // //         `${globalBackendRoute}/api/single-project/${projectId}/defects-count`
// // //       );
// // //       setTotalDefects(res.data.totalDefects || 0);
// // //     } catch (err) {
// // //       console.error(
// // //         "Error fetching defects count:",
// // //         err?.response?.status,
// // //         err?.message
// // //       );
// // //       setTotalDefects(0);
// // //     }
// // //   };

// // //   if (loading) return <div className="text-center p-4">Loading...</div>;
// // //   if (error)
// // //     return <div className="text-center p-4 text-rose-700">{error}</div>;
// // //   if (!project) return null;

// // //   // ----- role helpers -----
// // //   const normRole = (userRole || "").toLowerCase();
// // //   const ALLOWED_REQUIREMENT_ROLES = new Set([
// // //     "superadmin",
// // //     "admin",
// // //     "project_manager",
// // //     "developer_lead",
// // //     "qa_lead",
// // //   ]);
// // //   const canCreateRequirement = ALLOWED_REQUIREMENT_ROLES.has(normRole);

// // //   const user = JSON.parse(localStorage.getItem("user"));
// // //   const userId = user?.id;

// // //   const taskLink = [
// // //     "superadmin",
// // //     "admin",
// // //     "qa_lead",
// // //     "project_manager",
// // //   ].includes(normRole)
// // //     ? `/single-project/${projectId}/view-all-tasks`
// // //     : `/single-project/${projectId}/user-assigned-tasks/${userId}`;

// // //   const totalScenarios = project.totalScenarios || 0;

// // //   // ----- light button base classes -----
// // //   const baseBtn =
// // //     "px-3 py-2 text-sm rounded-md border transition-colors duration-150 flex items-center justify-center";

// // //   // ---------- small list renderer for each role ----------
// // //   const RoleList = ({ title, colorClasses, icon, list }) => {
// // //     const items = Array.isArray(list) ? list : [];
// // //     return (
// // //       <div
// // //         className={`p-4 rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}
// // //       >
// // //         <h3 className={`text-md font-semibold mb-2 ${colorClasses.title}`}>
// // //           {icon}
// // //           {title}
// // //         </h3>
// // //         {items.length > 0 ? (
// // //           <ul>
// // //             {items.map((u, idx) => (
// // //               <li
// // //                 key={u?._id || `${title}-${u?.name || "unknown"}-${idx}`}
// // //                 className="flex items-center text-slate-700"
// // //               >
// // //                 <FaUser className={`${colorClasses.icon} mr-2`} />
// // //                 {u?.name || "Unnamed"}
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         ) : (
// // //           <p className="text-slate-600">No {title.toLowerCase()} assigned.</p>
// // //         )}
// // //       </div>
// // //     );
// // //   };

// // //   // Colors/icons per section (compact but distinct)
// // //   const style = {
// // //     dev: {
// // //       bg: "bg-sky-50",
// // //       border: "border-sky-100",
// // //       title: "text-sky-800",
// // //       icon: "text-sky-500",
// // //     },
// // //     te: {
// // //       bg: "bg-emerald-50",
// // //       border: "border-emerald-100",
// // //       title: "text-emerald-800",
// // //       icon: "text-emerald-500",
// // //     },
// // //     super: {
// // //       bg: "bg-fuchsia-50",
// // //       border: "border-fuchsia-100",
// // //       title: "text-fuchsia-800",
// // //       icon: "text-fuchsia-500",
// // //     },
// // //     pm: {
// // //       bg: "bg-indigo-50",
// // //       border: "border-indigo-100",
// // //       title: "text-indigo-800",
// // //       icon: "text-indigo-500",
// // //     },
// // //     admin: {
// // //       bg: "bg-teal-50",
// // //       border: "border-teal-100",
// // //       title: "text-teal-800",
// // //       icon: "text-teal-500",
// // //     },
// // //     hr: {
// // //       bg: "bg-amber-50",
// // //       border: "border-amber-100",
// // //       title: "text-amber-800",
// // //       icon: "text-amber-500",
// // //     },
// // //     testlead: {
// // //       bg: "bg-cyan-50",
// // //       border: "border-cyan-100",
// // //       title: "text-cyan-800",
// // //       icon: "text-cyan-500",
// // //     },
// // //     qalead: {
// // //       bg: "bg-purple-50",
// // //       border: "border-purple-100",
// // //       title: "text-purple-800",
// // //       icon: "text-purple-500",
// // //     },
// // //     devlead: {
// // //       bg: "bg-lime-50",
// // //       border: "border-lime-100",
// // //       title: "text-lime-800",
// // //       icon: "text-lime-500",
// // //     },
// // //     ba: {
// // //       bg: "bg-rose-50",
// // //       border: "border-rose-100",
// // //       title: "text-rose-800",
// // //       icon: "text-rose-500",
// // //     },
// // //   };

// // //   // Fallbacks: support snake_cased or camelCased backend keys
// // //   const devs = project.developers || project?.Developers || [];
// // //   const tests = project.testEngineers || project?.test_engineers || [];
// // //   const superAdmins = project.superAdmins || project.super_admins || [];
// // //   const projectManagers =
// // //     project.projectManagers || project.project_managers || [];
// // //   const admins = project.admins || [];
// // //   const hrs = project.hrs || project.hr || [];
// // //   const testLeads = project.testLeads || project.test_leads || [];
// // //   const qaLeads = project.qaLeads || project.qa_leads || [];
// // //   const developerLeads =
// // //     project.developerLeads || project.developer_leads || [];
// // //   const bas =
// // //     project.bas || project.business_analysts || project.businessAnalysts || [];

// // //   return (
// // //     <div className="container mx-auto p-4 bg-white">
// // //       {/* Project Info (UNCHANGED) */}
// // //       <div className="bg-white shadow rounded-lg p-4 mb-4 border border-slate-200">
// // //         <h1 className="text-2xl font-semibold text-slate-800 flex items-center">
// // //           <FaFolderOpen className="mr-2 text-indigo-400" />
// // //           <span className="font-extrabold">Project Name: </span>
// // //           <span className="text-indigo-700 ml-2 font-serif">
// // //             {project.projectName}
// // //           </span>
// // //         </h1>
// // //         <div className="flex justify-between flex-wrap items-center">
// // //           <p className="font-medium text-slate-700 flex items-center mt-2">
// // //             <FaFileAlt className="mr-2 text-indigo-400" />
// // //             Description: <span className="ml-1">{project.description}</span>
// // //           </p>
// // //           <p className="font-medium text-slate-700 flex items-center mt-1">
// // //             <FaCalendarAlt className="mr-2 text-emerald-500" />
// // //             <span className="font-bold">Start Date:</span>
// // //             <span className="text-emerald-700 ml-2">
// // //               {project.startDate
// // //                 ? new Date(project.startDate).toLocaleDateString()
// // //                 : "—"}
// // //             </span>
// // //           </p>
// // //           <p className="font-medium text-slate-700 flex items-center mt-1">
// // //             <FaClock className="mr-2 text-rose-400" />
// // //             Deadline:
// // //             <span className="text-rose-700 ml-2">
// // //               {project.deadline
// // //                 ? new Date(project.deadline).toLocaleDateString()
// // //                 : "—"}
// // //             </span>
// // //           </p>
// // //           <p className="font-medium text-slate-700 flex items-center mt-1">
// // //             <FaLaptopCode className="mr-2 text-indigo-400" />
// // //             Domain:
// // //             <span className="text-indigo-700 ml-2">
// // //               {project.domain || "—"}
// // //             </span>
// // //           </p>
// // //         </div>
// // //       </div>

// // //       {/* Action Buttons (UNCHANGED) */}
// // //       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
// // //         <Link
// // //           to={`/single-project/${projectId}/add-scenario`}
// // //           className={`${baseBtn} bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200`}
// // //         >
// // //           <FaPlus className="mr-1" />
// // //           Add Scenario
// // //         </Link>

// // //         <Link
// // //           to={`/single-project/${projectId}/view-all-scenarios`}
// // //           className={`${baseBtn} bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200`}
// // //         >
// // //           <FaFolderOpen className="mr-1" />
// // //           View Scenarios
// // //         </Link>

// // //         <Link
// // //           to={`/single-project/${projectId}/all-test-cases`}
// // //           className={`${baseBtn} bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200`}
// // //         >
// // //           <FaFileAlt className="mr-1" />
// // //           View Test Cases
// // //         </Link>

// // //         {(normRole === "superadmin" ||
// // //           normRole === "admin" ||
// // //           normRole === "project_manager" ||
// // //           normRole === "qa_lead" ||
// // //           normRole === "test_lead" ||
// // //           normRole === "test_engineer" ||
// // //           normRole === "developer_lead" ||
// // //           normRole === "developer" ||
// // //           normRole === "test_engineer") && (
// // //           <>
// // //             <Link
// // //               to={`/single-project/${projectId}/add-defect`}
// // //               className={`${baseBtn} bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200`}
// // //             >
// // //               <FaBug className="mr-1" />
// // //               Add Defect
// // //             </Link>
// // //             <Link
// // //               to={`/single-project/${projectId}/all-defects`}
// // //               className={`${baseBtn} bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200`}
// // //             >
// // //               <FaBug className="mr-1" />
// // //               View Defects
// // //             </Link>
// // //           </>
// // //         )}

// // //         {normRole === "developer" && (
// // //           <Link
// // //             to={`/single-project/${projectId}/developer/${developerId}/view-assigned-defects`}
// // //             className={`${baseBtn} bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100`}
// // //           >
// // //             <FaBug className="mr-1" />
// // //             Assigned Defects
// // //           </Link>
// // //         )}

// // //         {(normRole === "superadmin" ||
// // //           normRole === "admin" ||
// // //           normRole === "project_manager" ||
// // //           normRole === "qa_lead" ||
// // //           normRole === "test_lead" ||
// // //           normRole === "test_engineer" ||
// // //           normRole === "developer_lead" ||
// // //           normRole === "developer") && (
// // //           <Link
// // //             to={`/single-project/${projectId}/all-defects`}
// // //             className={`${baseBtn} bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100`}
// // //           >
// // //             <FaBug className="mr-1" />
// // //             Bug Bucket
// // //           </Link>
// // //         )}

// // //         <Link
// // //           to={`/single-project/${projectId}/traceability-matrix`}
// // //           className={`${baseBtn} bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200`}
// // //         >
// // //           <FaChartBar className="mr-1" />
// // //           Traceability Matrix
// // //         </Link>

// // //         {(normRole === "superadmin" ||
// // //           normRole === "admin" ||
// // //           normRole === "project_manager" ||
// // //           normRole === "developer_lead" ||
// // //           normRole === "qa_lead" ||
// // //           normRole === "test_engineer" ||
// // //           normRole === "test_lead") && (
// // //           <Link
// // //             to={`/single-project/${projectId}/test-case-execution`}
// // //             className={`${baseBtn} bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200`}
// // //           >
// // //             <FaNetworkWired className="mr-1" />
// // //             Execute Test Cases
// // //           </Link>
// // //         )}

// // //         {(normRole === "superadmin" ||
// // //           normRole === "admin" ||
// // //           normRole === "project_manager" ||
// // //           normRole === "developer_lead" ||
// // //           normRole === "qa_lead" ||
// // //           normRole === "test_lead") && (
// // //           <Link
// // //             to={`/projects/${projectId}/assign-task`}
// // //             className={`${baseBtn} bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200`}
// // //           >
// // //             <FaTasks className="mr-1" />
// // //             Add Task
// // //           </Link>
// // //         )}

// // //         <Link
// // //           to={taskLink}
// // //           className={`${baseBtn} bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100`}
// // //         >
// // //           <FaFolderOpen className="mr-1" />
// // //           View Tasks
// // //         </Link>

// // //         {/* Requirement Management */}
// // //         {canCreateRequirement && (
// // //           <Link
// // //             to={`/create-requirement/${projectId}`}
// // //             className={`${baseBtn} bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200`}
// // //           >
// // //             <FaPlus className="mr-1" />
// // //             Create Requirement
// // //           </Link>
// // //         )}

// // //         <Link
// // //           to={`/all-requirements/${projectId}`}
// // //           className={`${baseBtn} bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100`}
// // //         >
// // //           <FaFolderOpen className="mr-1" />
// // //           View Requirements
// // //         </Link>
// // //       </div>

// // //       {/* Users Involved (EXTENDED) */}
// // //       <div className="bg-white shadow rounded-lg p-4 mb-4 border border-slate-200">
// // //         <h2 className="text-lg font-semibold text-slate-800">Users Involved</h2>

// // //         {/* First row: Developers & Test Engineers (UNCHANGED content, wrapped in RoleList for consistency) */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
// // //           <RoleList
// // //             title="Developers"
// // //             colorClasses={style.dev}
// // //             icon={<FaLaptopCode className="mr-2 inline text-sky-500" />}
// // //             list={devs}
// // //           />
// // //           <RoleList
// // //             title="Test Engineers"
// // //             colorClasses={style.te}
// // //             icon={<FaHardHat className="mr-2 inline text-emerald-500" />}
// // //             list={tests}
// // //           />
// // //         </div>

// // //         {/* New roles — compact grid */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
// // //           <RoleList
// // //             title="Super Admins"
// // //             colorClasses={style.super}
// // //             icon={<FaShieldAlt className="mr-2 inline text-fuchsia-500" />}
// // //             list={superAdmins}
// // //           />
// // //           <RoleList
// // //             title="Project Managers"
// // //             colorClasses={style.pm}
// // //             icon={<FaProjectDiagram className="mr-2 inline text-indigo-500" />}
// // //             list={projectManagers}
// // //           />
// // //           <RoleList
// // //             title="Admins"
// // //             colorClasses={style.admin}
// // //             icon={<FaUserShield className="mr-2 inline text-teal-500" />}
// // //             list={admins}
// // //           />
// // //           <RoleList
// // //             title="HRs"
// // //             colorClasses={style.hr}
// // //             icon={<FaUserFriends className="mr-2 inline text-amber-500" />}
// // //             list={hrs}
// // //           />
// // //           <RoleList
// // //             title="Test Leads"
// // //             colorClasses={style.testlead}
// // //             icon={<FaUserCog className="mr-2 inline text-cyan-500" />}
// // //             list={testLeads}
// // //           />
// // //           <RoleList
// // //             title="QA Leads"
// // //             colorClasses={style.qalead}
// // //             icon={<FaUserCog className="mr-2 inline text-purple-500" />}
// // //             list={qaLeads}
// // //           />
// // //           <RoleList
// // //             title="Developer Leads"
// // //             colorClasses={style.devlead}
// // //             icon={<FaUserTie className="mr-2 inline text-lime-500" />}
// // //             list={developerLeads}
// // //           />
// // //           <RoleList
// // //             title="Business Analysts"
// // //             colorClasses={style.ba}
// // //             icon={<FaBusinessTime className="mr-2 inline text-rose-500" />}
// // //             list={bas}
// // //           />
// // //         </div>
// // //       </div>

// // //       {/* Summary Cards (UNCHANGED) */}
// // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //         <div className="bg-amber-50 p-4 rounded-lg flex items-center border border-amber-100">
// // //           <FaFileAlt className="text-3xl text-amber-500 mr-4" />
// // //           <div>
// // //             <h3 className="text-sm font-semibold text-amber-900">
// // //               Total Scenarios
// // //             </h3>
// // //             <p className="text-lg text-amber-900">{totalScenarios}</p>
// // //           </div>
// // //         </div>

// // //         <div className="bg-emerald-50 p-4 rounded-lg flex items-center border border-emerald-100">
// // //           <FaCodeBranch className="text-3xl text-emerald-500 mr-4" />
// // //           <div>
// // //             <h3 className="text-sm font-semibold text-emerald-900">
// // //               Total Test Cases
// // //             </h3>
// // //             <p className="text-xl text-emerald-900">{totalTestCases}</p>
// // //           </div>
// // //         </div>

// // //         <div className="bg-rose-50 p-4 rounded-lg flex items-center border border-rose-100">
// // //           <FaBug className="text-3xl text-rose-500 mr-4" />
// // //           <div>
// // //             <h3 className="text-lg font-semibold text-rose-900">
// // //               Total Defects
// // //             </h3>
// // //             <p className="text-xl text-rose-900">{totalDefects}</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SingleProject;

// // // till here old layout.

// // //

// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaUser,
//   FaPlus,
//   FaFileAlt,
//   FaCodeBranch,
//   FaBug,
//   FaChartBar,
//   FaLaptopCode,
//   FaHardHat,
//   FaCalendarAlt,
//   FaFolderOpen,
//   FaClock,
//   FaNetworkWired,
//   FaTasks,
//   FaShieldAlt,
//   FaProjectDiagram,
//   FaUserShield,
//   FaUserFriends,
//   FaUserCog,
//   FaUserTie,
//   FaUsers,
//   FaBusinessTime,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const SingleProject = () => {
//   const { projectId } = useParams();
//   const [userRole, setUserRole] = useState(null);
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalTestCases, setTotalTestCases] = useState(0);
//   const [totalDefects, setTotalDefects] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (projectId && /^[0-9a-fA-F]{24}$/.test(projectId)) {
//       localStorage.setItem("lastProjectId", projectId);
//     }
//   }, [projectId]);

//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const developerId = loggedInUser ? loggedInUser.id : null;

//   useEffect(() => {
//     fetchProject();
//     fetchTestCaseCount();
//     fetchDefectsCount();
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user?.role) setUserRole(user.role);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId]);

//   const fetchProject = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${globalBackendRoute}/api/single-project/${projectId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setProject(response.data);
//       setLoading(false);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         alert("Unauthorized access. Please log in.");
//         navigate("/login");
//       } else {
//         console.error("Error fetching project:", error.message);
//         setError("Failed to load project data.");
//         setLoading(false);
//       }
//     }
//   };

//   const fetchTestCaseCount = async () => {
//     try {
//       const res = await axios.get(
//         `${globalBackendRoute}/api/projects/${projectId}/test-cases-count`
//       );
//       setTotalTestCases(res.data.totalTestCases || 0);
//     } catch (err) {
//       console.error(
//         "Error fetching test case count:",
//         err?.response?.status,
//         err?.message
//       );
//       setTotalTestCases(0);
//     }
//   };

//   const fetchDefectsCount = async () => {
//     try {
//       const res = await axios.get(
//         `${globalBackendRoute}/api/single-project/${projectId}/defects-count`
//       );
//       setTotalDefects(res.data.totalDefects || 0);
//     } catch (err) {
//       console.error(
//         "Error fetching defects count:",
//         err?.response?.status,
//         err?.message
//       );
//       setTotalDefects(0);
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-[40vh] flex items-center justify-center text-slate-600">
//         Loading project...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-[40vh] flex items-center justify-center text-rose-700">
//         {error}
//       </div>
//     );

//   if (!project) return null;

//   // ----- role helpers -----
//   const normRole = (userRole || "").toLowerCase();
//   const ALLOWED_REQUIREMENT_ROLES = new Set([
//     "superadmin",
//     "admin",
//     "project_manager",
//     "developer_lead",
//     "qa_lead",
//   ]);
//   const canCreateRequirement = ALLOWED_REQUIREMENT_ROLES.has(normRole);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?.id;

//   const taskLink = [
//     "superadmin",
//     "admin",
//     "qa_lead",
//     "project_manager",
//   ].includes(normRole)
//     ? `/single-project/${projectId}/view-all-tasks`
//     : `/single-project/${projectId}/user-assigned-tasks/${userId}`;

//   const totalScenarios = project.totalScenarios || 0;

//   // ----- controls button style -----
//   const baseBtn =
//     "inline-flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-sm rounded-full border border-slate-300 text-slate-900 font-medium whitespace-nowrap transition-all hover:bg-slate-900 hover:text-white hover:-translate-y-0.5";

//   // ----- role data with fallbacks -----
//   const devs = project.developers || project.Developers || [];
//   const tests = project.testEngineers || project.test_engineers || [];
//   const superAdmins = project.superAdmins || project.super_admins || [];
//   const projectManagers =
//     project.projectManagers || project.project_managers || [];
//   const admins = project.admins || [];
//   const hrs = project.hrs || project.hr || [];
//   const testLeads = project.testLeads || project.test_leads || [];
//   const qaLeads = project.qaLeads || project.qa_leads || [];
//   const developerLeads =
//     project.developerLeads || project.developer_leads || [];
//   const bas =
//     project.bas || project.business_analysts || project.businessAnalysts || [];

//   const roleBlocks = [
//     { key: "Developers", list: devs },
//     { key: "Test Engineers", list: tests },
//     { key: "Super Admins", list: superAdmins },
//     { key: "Project Managers", list: projectManagers },
//     { key: "Admins", list: admins },
//     { key: "HRs", list: hrs },
//     { key: "Test Leads", list: testLeads },
//     { key: "QA Leads", list: qaLeads },
//     { key: "Developer Leads", list: developerLeads },
//     { key: "Business Analysts", list: bas },
//   ].filter((r) => Array.isArray(r.list) && r.list.length > 0);

//   const RoleRow = ({ title, list }) => (
//     <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-2">
//       <div className="w-44 flex items-center gap-2 text-xs font-semibold text-slate-800">
//         <span className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center">
//           <FaUser className="text-[10px] text-slate-700" />
//         </span>
//         <span>{title}</span>
//         <span className="text-[10px] font-normal text-slate-500">
//           ({list.length})
//         </span>
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {list.map((u, idx) => (
//           <span
//             key={u?._id || `${title}-${u?.name || "unknown"}-${idx}`}
//             className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-slate-300 rounded-full text-slate-900"
//           >
//             <FaUser className="text-[9px] text-slate-500" />
//             {u?.name || "Unnamed"}
//           </span>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white text-slate-900">
//       <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4">
//         {/* Breadcrumb */}
//         <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
//           <FaProjectDiagram className="text-slate-700" />
//           <span className="uppercase tracking-[0.16em]">Project Overview</span>
//           <span>/</span>
//           <span className="font-semibold text-slate-900 max-w-xs truncate">
//             {project.projectName}
//           </span>
//         </div>

//         {/* Header Row: Left = Project info, Right = Summary metrics */}
//         <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-3 border-b border-slate-200">
//           {/* Left: Project heading + meta */}
//           <div className="flex-1 flex flex-col gap-1.5">
//             <div className="flex flex-wrap items-baseline gap-3">
//               <h1 className="text-2xl font-semibold text-black">
//                 {project.projectName}
//               </h1>
//               <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
//                 Project Details
//               </span>
//             </div>
//             <p className="text-sm text-slate-600 max-w-4xl">
//               {project.description ||
//                 "No description provided for this project."}
//             </p>
//             <div className="flex flex-wrap gap-4 text-xs text-slate-700 mt-1">
//               <div className="flex items-center gap-1.5">
//                 <FaCalendarAlt className="text-slate-800" />
//                 <span>Start:</span>
//                 <span className="font-medium">
//                   {project.startDate
//                     ? new Date(project.startDate).toLocaleDateString()
//                     : "—"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <FaClock className="text-slate-800" />
//                 <span>Deadline:</span>
//                 <span className="font-medium">
//                   {project.deadline
//                     ? new Date(project.deadline).toLocaleDateString()
//                     : "—"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <FaLaptopCode className="text-slate-800" />
//                 <span>Domain:</span>
//                 <span className="font-medium">{project.domain || "—"}</span>
//               </div>
//             </div>
//           </div>

//           {/* Right: Summary metrics (one row, colored, responsive) */}
//           <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
//             <div className="text-[10px] uppercase tracking-wide text-slate-500">
//               Project Summary
//             </div>
//             <div className="flex flex-wrap gap-2 justify-start md:justify-end">
//               {/* Total Scenarios */}
//               <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100">
//                 <FaFileAlt className="text-indigo-500 text-sm" />
//                 <div className="flex flex-col leading-tight">
//                   <span className="text-[9px] uppercase tracking-wide text-indigo-500">
//                     Scenarios
//                   </span>
//                   <span className="text-sm font-semibold text-indigo-900">
//                     {totalScenarios}
//                   </span>
//                 </div>
//               </div>

//               {/* Total Test Cases */}
//               <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
//                 <FaCodeBranch className="text-emerald-500 text-sm" />
//                 <div className="flex flex-col leading-tight">
//                   <span className="text-[9px] uppercase tracking-wide text-emerald-500">
//                     Test Cases
//                   </span>
//                   <span className="text-sm font-semibold text-emerald-900">
//                     {totalTestCases}
//                   </span>
//                 </div>
//               </div>

//               {/* Total Defects */}
//               <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
//                 <FaBug className="text-rose-500 text-sm" />
//                 <div className="flex flex-col leading-tight">
//                   <span className="text-[9px] uppercase tracking-wide text-rose-500">
//                     Defects
//                   </span>
//                   <span className="text-sm font-semibold text-rose-900">
//                     {totalDefects}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Project Controls */}
//         <section className="space-y-1">
//           <div className="flex items-center justify-between gap-2">
//             <h2 className="text-xs font-semibold tracking-wide text-slate-800 uppercase">
//               Project Controls
//             </h2>
//             <span className="text-[10px] text-slate-500">
//               All key actions aligned in one toolbar
//             </span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Link
//               to={`/single-project/${projectId}/add-scenario`}
//               className={baseBtn}
//             >
//               <FaPlus className="text-[11px]" /> Add Scenario
//             </Link>
//             <Link
//               to={`/single-project/${projectId}/view-all-scenarios`}
//               className={baseBtn}
//             >
//               <FaFolderOpen className="text-[11px]" /> View Scenarios
//             </Link>
//             <Link
//               to={`/single-project/${projectId}/all-test-cases`}
//               className={baseBtn}
//             >
//               <FaFileAlt className="text-[11px]" /> View Test Cases
//             </Link>

//             {(normRole === "superadmin" ||
//               normRole === "admin" ||
//               normRole === "project_manager" ||
//               normRole === "qa_lead" ||
//               normRole === "test_lead" ||
//               normRole === "test_engineer" ||
//               normRole === "developer_lead" ||
//               normRole === "developer") && (
//               <>
//                 <Link
//                   to={`/single-project/${projectId}/add-defect`}
//                   className={baseBtn}
//                 >
//                   <FaBug className="text-[11px]" /> Add Defect
//                 </Link>
//                 <Link
//                   to={`/single-project/${projectId}/all-defects`}
//                   className={baseBtn}
//                 >
//                   <FaBug className="text-[11px]" /> View Defects
//                 </Link>
//                 <Link
//                   to={`/single-project/${projectId}/all-defects`}
//                   className={baseBtn}
//                 >
//                   <FaBug className="text-[11px]" /> Bug Bucket
//                 </Link>
//               </>
//             )}

//             {normRole === "developer" && developerId && (
//               <Link
//                 to={`/single-project/${projectId}/developer/${developerId}/view-assigned-defects`}
//                 className={baseBtn}
//               >
//                 <FaBug className="text-[11px]" /> My Defects
//               </Link>
//             )}

//             <Link
//               to={`/single-project/${projectId}/traceability-matrix`}
//               className={baseBtn}
//             >
//               <FaChartBar className="text-[11px]" /> Traceability Matrix
//             </Link>

//             {(normRole === "superadmin" ||
//               normRole === "admin" ||
//               normRole === "project_manager" ||
//               normRole === "developer_lead" ||
//               normRole === "qa_lead" ||
//               normRole === "test_engineer" ||
//               normRole === "test_lead") && (
//               <Link
//                 to={`/single-project/${projectId}/test-case-execution`}
//                 className={baseBtn}
//               >
//                 <FaNetworkWired className="text-[11px]" /> Execute Test Cases
//               </Link>
//             )}

//             {(normRole === "superadmin" ||
//               normRole === "admin" ||
//               normRole === "project_manager" ||
//               normRole === "developer_lead" ||
//               normRole === "qa_lead" ||
//               normRole === "test_lead") && (
//               <Link
//                 to={`/projects/${projectId}/assign-task`}
//                 className={baseBtn}
//               >
//                 <FaTasks className="text-[11px]" /> Add Task
//               </Link>
//             )}

//             <Link to={taskLink} className={baseBtn}>
//               <FaFolderOpen className="text-[11px]" /> View Tasks
//             </Link>

//             {canCreateRequirement && (
//               <Link to={`/create-requirement/${projectId}`} className={baseBtn}>
//                 <FaPlus className="text-[11px]" /> Create Requirement
//               </Link>
//             )}

//             <Link to={`/all-requirements/${projectId}`} className={baseBtn}>
//               <FaFolderOpen className="text-[11px]" /> View Requirements
//             </Link>
//           </div>
//         </section>

//         {/* Users Involved */}
//         <section className="pt-3 border-t border-slate-200">
//           <div className="flex items-center justify-between gap-2 mb-2">
//             <h2 className="text-xs font-semibold tracking-wide text-slate-800 uppercase flex items-center gap-1.5">
//               <FaUsers className="text-slate-800" />
//               Users Involved
//             </h2>
//             <span className="text-[10px] text-slate-500">
//               Only roles with assigned users are listed
//             </span>
//           </div>

//           {roleBlocks.length === 0 ? (
//             <p className="text-sm text-slate-500">
//               No users mapped to this project yet.
//             </p>
//           ) : (
//             <div className="border border-slate-200 rounded-md px-3 divide-y divide-slate-100">
//               {roleBlocks.map((rb) => (
//                 <RoleRow key={rb.key} title={rb.key} list={rb.list} />
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default SingleProject;

//

//

//

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaPlus,
  FaFileAlt,
  FaCodeBranch,
  FaBug,
  FaChartBar,
  FaLaptopCode,
  FaHardHat,
  FaCalendarAlt,
  FaFolderOpen,
  FaClock,
  FaNetworkWired,
  FaTasks,
  FaShieldAlt,
  FaProjectDiagram,
  FaUserShield,
  FaUserFriends,
  FaUserCog,
  FaUserTie,
  FaUsers,
  FaBusinessTime,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const SingleProject = () => {
  const { projectId } = useParams();
  const [userRole, setUserRole] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [totalDefects, setTotalDefects] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId && /^[0-9a-fA-F]{24}$/.test(projectId)) {
      localStorage.setItem("lastProjectId", projectId);
    }
  }, [projectId]);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const developerId = loggedInUser ? loggedInUser.id : null;

  useEffect(() => {
    fetchProject();
    fetchTestCaseCount();
    fetchDefectsCount();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) setUserRole(user.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${globalBackendRoute}/api/single-project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Unauthorized access. Please log in.");
        navigate("/login");
      } else {
        console.error("Error fetching project:", error.message);
        setError("Failed to load project data.");
        setLoading(false);
      }
    }
  };

  const fetchTestCaseCount = async () => {
    try {
      const res = await axios.get(
        `${globalBackendRoute}/api/projects/${projectId}/test-cases-count`
      );
      setTotalTestCases(res.data.totalTestCases || 0);
    } catch (err) {
      console.error(
        "Error fetching test case count:",
        err?.response?.status,
        err?.message
      );
      setTotalTestCases(0);
    }
  };

  const fetchDefectsCount = async () => {
    try {
      const res = await axios.get(
        `${globalBackendRoute}/api/single-project/${projectId}/defects-count`
      );
      setTotalDefects(res.data.totalDefects || 0);
    } catch (err) {
      console.error(
        "Error fetching defects count:",
        err?.response?.status,
        err?.message
      );
      setTotalDefects(0);
    }
  };

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-600">
        Loading project...
      </div>
    );

  if (error)
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-rose-700">
        {error}
      </div>
    );

  if (!project) return null;

  // ----- role helpers -----
  const normRole = (userRole || "").toLowerCase();
  const ALLOWED_REQUIREMENT_ROLES = new Set([
    "superadmin",
    "admin",
    "project_manager",
    "developer_lead",
    "qa_lead",
  ]);
  const canCreateRequirement = ALLOWED_REQUIREMENT_ROLES.has(normRole);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const taskLink = [
    "superadmin",
    "admin",
    "qa_lead",
    "project_manager",
  ].includes(normRole)
    ? `/single-project/${projectId}/view-all-tasks`
    : `/single-project/${projectId}/user-assigned-tasks/${userId}`;

  const totalScenarios = project.totalScenarios || 0;

  // ----- controls button style (aligned with AllProjects look) -----
  const baseBtn =
    "inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] md:text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium whitespace-nowrap shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition";

  // ----- role data with fallbacks -----
  const devs = project.developers || project.Developers || [];
  const tests = project.testEngineers || project.test_engineers || [];
  const superAdmins = project.superAdmins || project.super_admins || [];
  const projectManagers =
    project.projectManagers || project.project_managers || [];
  const admins = project.admins || [];
  const hrs = project.hrs || project.hr || [];
  const testLeads = project.testLeads || project.test_leads || [];
  const qaLeads = project.qaLeads || project.qa_leads || [];
  const developerLeads =
    project.developerLeads || project.developer_leads || [];
  const bas =
    project.bas || project.business_analysts || project.businessAnalysts || [];

  const roleBlocks = [
    { key: "Developers", list: devs },
    { key: "Test Engineers", list: tests },
    { key: "Super Admins", list: superAdmins },
    { key: "Project Managers", list: projectManagers },
    { key: "Admins", list: admins },
    { key: "HRs", list: hrs },
    { key: "Test Leads", list: testLeads },
    { key: "QA Leads", list: qaLeads },
    { key: "Developer Leads", list: developerLeads },
    { key: "Business Analysts", list: bas },
  ].filter((r) => Array.isArray(r.list) && r.list.length > 0);

  const RoleRow = ({ title, list }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-2">
      <div className="w-48 flex items-center gap-2 text-xs font-semibold text-slate-800">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center bg-white">
          <FaUser className="text-[10px] text-slate-600" />
        </span>
        <span>{title}</span>
        <span className="text-[10px] font-normal text-slate-500">
          ({list.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((u, idx) => (
          <span
            key={u?._id || `${title}-${u?.name || "unknown"}-${idx}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] border border-slate-200 rounded-full bg-white text-slate-800"
          >
            <FaUser className="text-[9px] text-slate-500" />
            {u?.name || "Unnamed"}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header Card (matches AllProjects style) */}
        <div className="bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 rounded-xl ">
          <div className="p-3 sm:p-4 space-y-3">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <FaProjectDiagram className="text-indigo-500" />
              <span className="uppercase tracking-[0.16em] text-slate-600">
                Project Overview
              </span>
              <span>/</span>
              <span className="font-semibold text-slate-900 max-w-xs truncate">
                {project.projectName}
              </span>
            </div>

            {/* Top Row: Left = project info, Right = summary badges */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left: Project core details */}
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-indigo-600 truncate">
                    {project.projectName}
                  </h1>
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-slate-500">
                    Project Details
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                  {project.description ||
                    "No description provided for this project."}
                </p>
                <div className="flex flex-wrap gap-4 text-[10px] sm:text-xs text-slate-700 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-slate-700" />
                    <span className="text-slate-500">Start:</span>
                    <span className="font-medium">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaClock className="text-slate-700" />
                    <span className="text-slate-500">Deadline:</span>
                    <span className="font-medium">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaLaptopCode className="text-slate-700" />
                    <span className="text-slate-500">Domain:</span>
                    <span className="font-medium">{project.domain || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Right: Summary metrics (chips, in one row on wide screens) */}
              <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100">
                    <FaFileAlt className="text-indigo-500 text-sm" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[8px] uppercase tracking-wide text-indigo-500 font-bold">
                        Total Scenarios
                      </span>
                      <span className="text-sm font-semibold text-indigo-900">
                        {totalScenarios}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <FaCodeBranch className="text-emerald-500 text-sm" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[8px] uppercase tracking-wide text-emerald-500 font-bold">
                        Total Test Cases
                      </span>
                      <span className="text-sm font-semibold text-emerald-900">
                        {totalTestCases}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                    <FaBug className="text-rose-500 text-sm" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[8px] uppercase tracking-wide text-rose-500 font-bold">
                        Total Defects
                      </span>
                      <span className="text-sm font-semibold text-rose-900">
                        {totalDefects}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Controls Toolbar */}
            <div className="pt-2 border-t border-slate-100 mt-1">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-[10px] sm:text-xs font-semibold tracking-wide text-slate-800 uppercase">
                  Project Controls
                </h2>
                <span className="text-[9px] sm:text-[10px] text-slate-500">
                  All key actions aligned in one toolbar
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Scenarios */}
                <Link
                  to={`/single-project/${projectId}/add-scenario`}
                  className={baseBtn}
                >
                  <FaPlus className="text-[10px]" />
                  Add Scenario
                </Link>
                <Link
                  to={`/single-project/${projectId}/view-all-scenarios`}
                  className={baseBtn}
                >
                  <FaFolderOpen className="text-[10px]" />
                  View Scenarios
                </Link>

                {/* Test Cases */}
                <Link
                  to={`/single-project/${projectId}/all-test-cases`}
                  className={baseBtn}
                >
                  <FaFileAlt className="text-[10px]" />
                  View Test Cases
                </Link>

                {/* Defects & Bug Bucket */}
                {(normRole === "superadmin" ||
                  normRole === "admin" ||
                  normRole === "project_manager" ||
                  normRole === "qa_lead" ||
                  normRole === "test_lead" ||
                  normRole === "test_engineer" ||
                  normRole === "developer_lead" ||
                  normRole === "developer") && (
                  <>
                    <Link
                      to={`/single-project/${projectId}/add-defect`}
                      className={baseBtn}
                    >
                      <FaBug className="text-[10px]" />
                      Add Defect
                    </Link>
                    <Link
                      to={`/single-project/${projectId}/all-defects`}
                      className={baseBtn}
                    >
                      <FaBug className="text-[10px]" />
                      View Defects
                    </Link>
                    <Link
                      to={`/single-project/${projectId}/all-defects`}
                      className={baseBtn}
                    >
                      <FaBug className="text-[10px]" />
                      Bug Bucket
                    </Link>
                  </>
                )}

                {/* Dev-only: Assigned Defects */}
                {normRole === "developer" && developerId && (
                  <Link
                    to={`/single-project/${projectId}/developer/${developerId}/view-assigned-defects`}
                    className={baseBtn}
                  >
                    <FaBug className="text-[10px]" />
                    My Defects
                  </Link>
                )}

                {/* Traceability */}
                <Link
                  to={`/single-project/${projectId}/traceability-matrix`}
                  className={baseBtn}
                >
                  <FaChartBar className="text-[10px]" />
                  Traceability Matrix
                </Link>

                {/* Execute Test Cases */}
                {(normRole === "superadmin" ||
                  normRole === "admin" ||
                  normRole === "project_manager" ||
                  normRole === "developer_lead" ||
                  normRole === "qa_lead" ||
                  normRole === "test_engineer" ||
                  normRole === "test_lead") && (
                  <Link
                    to={`/single-project/${projectId}/test-case-execution`}
                    className={baseBtn}
                  >
                    <FaNetworkWired className="text-[10px]" />
                    Execute Test Cases
                  </Link>
                )}

                {/* Tasks */}
                {(normRole === "superadmin" ||
                  normRole === "admin" ||
                  normRole === "project_manager" ||
                  normRole === "developer_lead" ||
                  normRole === "qa_lead" ||
                  normRole === "test_lead") && (
                  <Link
                    to={`/projects/${projectId}/assign-task`}
                    className={baseBtn}
                  >
                    <FaTasks className="text-[10px]" />
                    Add Task
                  </Link>
                )}
                <Link to={taskLink} className={baseBtn}>
                  <FaFolderOpen className="text-[10px]" />
                  View Tasks
                </Link>

                {/* Requirements */}
                {canCreateRequirement && (
                  <Link
                    to={`/create-requirement/${projectId}`}
                    className={baseBtn}
                  >
                    <FaPlus className="text-[10px]" />
                    Create Requirement
                  </Link>
                )}
                <Link to={`/all-requirements/${projectId}`} className={baseBtn}>
                  <FaFolderOpen className="text-[10px]" />
                  View Requirements
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Users Involved (card aligned with overall style) */}
        <section className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-3 sm:px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
              <h2 className="text-[11px] sm:text-xs font-semibold tracking-wide text-slate-800 uppercase flex items-center gap-1.5">
                <FaUsers className="text-indigo-500" />
                Users Involved
              </h2>
              <span className="text-[9px] sm:text-[10px] text-slate-500">
                Only roles with assigned users are listed
              </span>
            </div>

            <div className="px-3 sm:px-4 py-3">
              {roleBlocks.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-500">
                  No users mapped to this project yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {roleBlocks.map((rb) => (
                    <RoleRow key={rb.key} title={rb.key} list={rb.list} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SingleProject;
