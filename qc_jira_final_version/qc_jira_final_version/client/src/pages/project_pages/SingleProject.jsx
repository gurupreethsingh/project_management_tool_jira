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
//   FaBell,
//   FaCalendarAlt,
//   FaFolderOpen,
//   FaClock,
//   FaNetworkWired,
//   FaTasks,
// } from "react-icons/fa";

// const SingleProject = () => {
//   const { projectId } = useParams(); // Use 'id' for projectId
//   const [userRole, setUserRole] = useState(null);
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [notifications, setNotifications] = useState(3); // Example notification count
//   const [totalTestCases, setTotalTestCases] = useState(0); // Store test case count
//   const [totalDefects, setTotalDefects] = useState(0);
//   const navigate = useNavigate(); // For navigation
//   const loggedInUser = JSON.parse(localStorage.getItem("user"));
//   const developerId = loggedInUser ? loggedInUser.id : null;

//   useEffect(() => {
//     fetchProject();
//     fetchTestCaseCount(); // Fetch test case count directly from the database
//     fetchDefectsCount();
//   }, [projectId]);

//   useEffect(() => {
//     // Assuming the user role is stored in localStorage under "user"
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user && user.role) {
//       setUserRole(user.role);
//     }
//   }, []);

//   const fetchProject = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:5000/single-project/${projectId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setProject(response.data);
//       setLoading(false);
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         alert("Unauthorized access. Please log in.");
//         navigate("/login"); // Redirect to login page
//       } else {
//         console.error("Error fetching project:", error.message);
//         setError("Failed to load project data.");
//         setLoading(false);
//       }
//     }
//   };

//   const fetchTestCaseCount = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/projects/${projectId}/test-cases-count`
//       );
//       setTotalTestCases(response.data.totalTestCases); // Set the total test case count from the response
//     } catch (error) {
//       console.error("Error fetching test case count:", error.message);
//     }
//   };

//   const fetchDefectsCount = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/single-project/${projectId}/defects-count`
//       );
//       setTotalDefects(response.data.totalDefects); // Update state with fetched defect count
//     } catch (error) {
//       console.error("Error fetching defects count:", error.message);
//     }
//   };

//   const handleNotificationsClick = () => {
//     setNotifications(0); // Reset notification count
//     // Add logic to fetch and display notifications here.
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         {error}
//       </div>
//     );
//   }

//   const totalScenarios = project.totalScenarios || 0; // Use totalScenarios from backend response

//   const user = JSON.parse(localStorage.getItem("user"));
//   const role = user?.role;
//   const userId = user?.id;

//   const taskLink = [
//     "superadmin",
//     "admin",
//     "qa_lead",
//     "project_manager",
//   ].includes(role)
//     ? `/single-project/${projectId}/view-all-tasks`
//     : `/single-project/${projectId}/user-assigned-tasks/${userId}`;

//   return (
//     <div className="container mx-auto p-4 bg-white">
//       {/* Notification icon */}
//       <div className="flex justify-end mb-4">
//         <div className="relative">
//           <FaBell
//             className="text-gray-600 text-2xl cursor-pointer"
//             onClick={handleNotificationsClick}
//           />
//           {notifications > 0 && (
//             <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
//               {notifications}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons at the top */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
//         {/* Add Scenario Button */}
//         <Link
//           to={`/single-project/${projectId}/add-scenario`}
//           className="bg-blue-500 text-white px-2 py-1 rounded-md text-center hover:bg-blue-600 text-sm flex items-center justify-center"
//         >
//           <FaPlus className="mr-1" />
//           <span>Add Scenario</span>
//         </Link>

//         {/* View All Scenarios */}
//         <Link
//           to={`/single-project/${projectId}/view-all-scenarios`}
//           className="bg-blue-400 text-white px-2 py-1 rounded-md text-center hover:bg-blue-500 text-sm flex items-center justify-center"
//         >
//           <FaFolderOpen className="mr-1" />
//           <span>View All Scenarios</span>
//         </Link>

//         {/* View Test Cases */}
//         <Link
//           to={`/single-project/${projectId}/all-test-cases`}
//           className="bg-green-400 text-white px-2 py-1 rounded-md text-center hover:bg-green-500 text-sm flex items-center justify-center"
//         >
//           <FaFileAlt className="mr-1" />
//           <span>View Test Cases</span>
//         </Link>

//         {/* Add Defect Button: visible for superadmin, admin, project_manager, qa_lead, and test_engineer */}
//         {[
//           "superadmin",
//           "admin",
//           "project_manager",
//           "qa_lead",
//           "test_engineer",
//         ].includes(userRole) && (
//           <Link
//             to={`/single-project/${projectId}/add-defect`}
//             className="bg-red-500 text-white px-2 py-1 rounded-md text-center hover:bg-red-600 text-sm flex items-center justify-center"
//           >
//             <FaBug className="mr-1" />
//             <span>Add Defect</span>
//           </Link>
//         )}

//         {[
//           "superadmin",
//           "admin",
//           "project_manager",
//           "qa_lead",
//           "test_engineer",
//         ].includes(userRole) && (
//           <Link
//             to={`/single-project/${projectId}/all-defects`}
//             className="bg-red-500 text-white px-2 py-1 rounded-md text-center hover:bg-red-600 text-sm flex items-center justify-center"
//           >
//             <FaBug className="mr-1" />
//             <span>View All Defects</span>
//           </Link>
//         )}

//         {["developer"].includes(userRole) && (
//           <Link
//             to={`/single-project/${projectId}/developer/${developerId}/view-assigned-defects`}
//             className="bg-red-500 text-white px-2 py-1 rounded-md text-center hover:bg-red-600 text-sm flex items-center justify-center"
//           >
//             <FaBug className="mr-1" />
//             <span>View Assigned Defects</span>
//           </Link>
//         )}

//         {/* Conditionally show the Bug Bucket button based on user role */}
//         {(userRole === "superadmin" ||
//           userRole === "admin" ||
//           userRole === "qa_lead") && (
//           <Link
//             to={`/single-project/${projectId}/view-defects`}
//             className="bg-red-400 text-white px-2 py-1 rounded-md text-center hover:bg-red-500 text-sm flex items-center justify-center"
//           >
//             <FaBug className="mr-1" />
//             <span>Bug Bucket</span>
//           </Link>
//         )}

//         {/* Traceability Matrix */}
//         <Link
//           to={`/single-project/${projectId}/traceability-matrix`}
//           className="bg-indigo-500 text-white px-2 py-1 rounded-md text-center hover:bg-indigo-600 text-sm flex items-center justify-center"
//         >
//           <FaChartBar className="mr-1" />
//           <span>Traceability Matrix</span>
//         </Link>

//         {/* Test Case Execution */}
//         {/* <Link
//           to={`/single-project/${projectId}/test-case-execution`}
//           className="bg-gray-500 text-white px-2 py-1 rounded-md text-center hover:bg-gray-600 text-sm flex items-center justify-center"
//         >
//           <FaNetworkWired className="mr-1" />
//           <span>Test Case Execution</span>
//         </Link> */}

//         {(userRole === "superadmin" ||
//           userRole === "admin" ||
//           userRole === "project_manager" ||
//           userRole === "developer_lead" ||
//           userRole === "qa_lead") && (
//           <Link
//             to={`/single-project/${projectId}/test-case-execution`}
//             className="bg-gray-500 text-white px-2 py-1 rounded-md text-center hover:bg-gray-600 text-sm flex items-center justify-center"
//           >
//             <FaNetworkWired className="mr-1" />
//             <span>Test Case Execution</span>
//           </Link>
//         )}

//         {/* Conditionally show the Add Task button based on user role */}
//         {(userRole === "superadmin" ||
//           userRole === "admin" ||
//           userRole === "project_manager" ||
//           userRole === "developer_lead" ||
//           userRole === "qa_lead") && (
//           <Link
//             to={`/projects/${projectId}/assign-task`}
//             className="bg-yellow-500 text-white px-2 py-1 rounded-md text-center hover:bg-yellow-600 text-sm flex items-center justify-center"
//           >
//             <FaTasks className="mr-1" />
//             <span>Add Task</span>
//           </Link>
//         )}

//         <Link
//           to={taskLink}
//           className="bg-yellow-400 text-white px-2 py-1 rounded-md text-center hover:bg-yellow-500 text-sm flex items-center justify-center"
//         >
//           <FaFolderOpen className="mr-1" />
//           <span>View Tasks</span>
//         </Link>
//       </div>

//       {/* Project Details */}
//       <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
//         <h1 className="text-2xl mb-2 text-gray-700 flex items-center font-bold">
//           <FaFolderOpen className="mr-2 text-indigo-500" />
//           Project Name :{" "}
//           <span className="text-indigo-600 ml-2 font-semibold font-serif">
//             {project.projectName}
//           </span>
//         </h1>
//         <p className="text-1xl font-bold text-gray-600 flex items-center mb-2">
//           <FaFileAlt className="mr-2 text-indigo-500" />
//           Project Description : <span>{project.description}</span>
//         </p>
//         <p className="text-gray-600 flex items-center mb-2 font-bold">
//           <FaCalendarAlt className="mr-2 text-green-500" />
//           Start Date :{" "}
//           <span className="text-green-700 ml-2">
//             {new Date(project.startDate).toLocaleDateString()}
//           </span>
//         </p>
//         <p className="text-gray-600 flex items-center mb-2 font-bold">
//           <FaClock className="mr-2 text-red-500" />
//           Deadline :{" "}
//           <span className="text-red-700 ml-2">
//             {new Date(project.deadline).toLocaleDateString()}
//           </span>
//         </p>
//         <p className="text-gray-600 flex items-center mb-2 font-bold">
//           <FaLaptopCode className="mr-2 text-indigo-500" />
//           Domain :{" "}
//           <span className="text-indigo-700 ml-2">{project.domain}</span>
//         </p>
//       </div>

//       {/* Users Involved */}
//       <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
//         <h2 className="text-sm font-semibold ">Users Involved</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Developers */}
//           <div className="bg-blue-100 p-4 rounded-lg shadow-md">
//             <h3 className="text-sm font-bold flex items-center mb-2">
//               <FaLaptopCode className="mr-2 text-blue-500" /> Developers
//             </h3>
//             {project.developers && project.developers.length > 0 ? (
//               <ul className="space-y-2">
//                 {project.developers.map((developer) => (
//                   <li key={developer._id} className="flex items-center">
//                     <FaUser className="text-blue-500 mr-2" /> {developer.name}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No developers assigned.</p>
//             )}
//           </div>

//           {/* Test Engineers */}
//           <div className="bg-green-100 p-4 rounded-lg shadow-md">
//             <h3 className="text-sm font-bold flex items-center mb-2">
//               <FaHardHat className="mr-2 text-green-500" /> Test Engineers
//             </h3>
//             {project.testEngineers && project.testEngineers.length > 0 ? (
//               <ul className="space-y-2">
//                 {project.testEngineers.map((engineer) => (
//                   <li key={engineer._id} className="flex items-center">
//                     <FaUser className="text-green-500 mr-2" /> {engineer.name}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No test engineers assigned.</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         {/* Total Scenarios Card */}
//         <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center">
//           <FaFileAlt className="text-3xl text-yellow-500 mr-4" />
//           <div>
//             <h3 className="text-sm font-bold">Total Scenarios</h3>
//             <p className="text-lg">{totalScenarios}</p>
//           </div>
//         </div>

//         {/* Total Test Cases */}
//         <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center">
//           <FaCodeBranch className="text-3xl text-green-500 mr-4" />
//           <div>
//             <h3 className="text-sm font-bold">Total Test Cases</h3>
//             <p className="text-xl">{totalTestCases}</p>
//           </div>
//         </div>

//         {/* Total Defects */}
//         <div className="bg-red-100 p-4 rounded-lg shadow-md flex items-center">
//           <FaBug className="text-3xl text-red-500 mr-4" />
//           <div>
//             <h3 className="text-lg font-bold">Total Defects</h3>
//             <p className="text-xl">{totalDefects}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleProject;

//

// 👇 your existing imports
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
  FaBell,
  FaCalendarAlt,
  FaFolderOpen,
  FaClock,
  FaNetworkWired,
  FaTasks,
} from "react-icons/fa";

const SingleProject = () => {
  const { projectId } = useParams();
  const [userRole, setUserRole] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [totalDefects, setTotalDefects] = useState(0);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const developerId = loggedInUser ? loggedInUser.id : null;

  useEffect(() => {
    fetchProject();
    fetchTestCaseCount();
    fetchDefectsCount();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) setUserRole(user.role);
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/single-project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        `http://localhost:5000/projects/${projectId}/test-cases-count`
      );
      setTotalTestCases(res.data.totalTestCases);
    } catch (err) {
      console.error("Error fetching test case count:", err.message);
    }
  };

  const fetchDefectsCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/single-project/${projectId}/defects-count`
      );
      setTotalDefects(res.data.totalDefects);
    } catch (err) {
      console.error("Error fetching defects count:", err.message);
    }
  };

  const handleNotificationsClick = () => setNotifications(0);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

  const totalScenarios = project.totalScenarios || 0;
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const userId = user?.id;

  const taskLink = [
    "superadmin",
    "admin",
    "qa_lead",
    "project_manager",
  ].includes(role)
    ? `/single-project/${projectId}/view-all-tasks`
    : `/single-project/${projectId}/user-assigned-tasks/${userId}`;

  return (
    <div className="container mx-auto p-4 bg-white">
      {/* Notification Icon */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <FaBell
            className="text-gray-600 text-2xl cursor-pointer"
            onClick={handleNotificationsClick}
          />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
        <Link
          to={`/single-project/${projectId}/add-scenario`}
          className="btn-blue"
        >
          <FaPlus className="mr-1" />
          Add Scenario
        </Link>

        <Link
          to={`/single-project/${projectId}/view-all-scenarios`}
          className="btn-blue-alt"
        >
          <FaFolderOpen className="mr-1" />
          View Scenarios
        </Link>

        <Link
          to={`/single-project/${projectId}/all-test-cases`}
          className="btn-green"
        >
          <FaFileAlt className="mr-1" />
          View Test Cases
        </Link>

        {(userRole === "superadmin" ||
          userRole === "admin" ||
          userRole === "project_manager" ||
          userRole === "qa_lead" ||
          userRole === "test_engineer") && (
          <>
            <Link
              to={`/single-project/${projectId}/add-defect`}
              className="btn-red"
            >
              <FaBug className="mr-1" />
              Add Defect
            </Link>
            <Link
              to={`/single-project/${projectId}/all-defects`}
              className="btn-red"
            >
              <FaBug className="mr-1" />
              View Defects
            </Link>
          </>
        )}

        {userRole === "developer" && (
          <Link
            to={`/single-project/${projectId}/developer/${developerId}/view-assigned-defects`}
            className="btn-red"
          >
            <FaBug className="mr-1" />
            Assigned Defects
          </Link>
        )}

        {(userRole === "superadmin" ||
          userRole === "admin" ||
          userRole === "qa_lead") && (
          <Link
            to={`/single-project/${projectId}/view-defects`}
            className="btn-red-alt"
          >
            <FaBug className="mr-1" />
            Bug Bucket
          </Link>
        )}

        <Link
          to={`/single-project/${projectId}/traceability-matrix`}
          className="btn-indigo"
        >
          <FaChartBar className="mr-1" />
          Traceability Matrix
        </Link>

        {(userRole === "superadmin" ||
          userRole === "admin" ||
          userRole === "project_manager" ||
          userRole === "developer_lead" ||
          userRole === "qa_lead") && (
          <Link
            to={`/single-project/${projectId}/test-case-execution`}
            className="btn-gray"
          >
            <FaNetworkWired className="mr-1" />
            Execute Test Cases
          </Link>
        )}

        {(userRole === "superadmin" ||
          userRole === "admin" ||
          userRole === "project_manager" ||
          userRole === "developer_lead" ||
          userRole === "qa_lead") && (
          <Link
            to={`/projects/${projectId}/assign-task`}
            className="btn-yellow"
          >
            <FaTasks className="mr-1" />
            Add Task
          </Link>
        )}

        <Link to={taskLink} className="btn-yellow-alt">
          <FaFolderOpen className="mr-1" />
          View Tasks
        </Link>

        {/* 🔵 NEW BUTTONS for Requirement Management */}
        <Link
          to={`/create-requirement/${projectId}`}
          className="bg-purple-500 text-white px-2 py-1 rounded-md text-sm hover:bg-purple-600 flex items-center justify-center"
        >
          <FaPlus className="mr-1" />
          Create Requirement
        </Link>

        <Link
          to={`/view-requirements/${projectId}`}
          className="bg-purple-400 text-white px-2 py-1 rounded-md text-sm hover:bg-purple-500 flex items-center justify-center"
        >
          <FaFolderOpen className="mr-1" />
          View Requirements
        </Link>
      </div>

      {/* Project Info */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center">
          <FaFolderOpen className="mr-2 text-indigo-500" />
          Project Name:
          <span className="text-indigo-600 ml-2 font-serif">
            {project.projectName}
          </span>
        </h1>
        <p className="font-bold text-gray-600 flex items-center">
          <FaFileAlt className="mr-2 text-indigo-500" />
          Description: <span>{project.description}</span>
        </p>
        <p className="font-bold text-gray-600 flex items-center">
          <FaCalendarAlt className="mr-2 text-green-500" />
          Start Date:
          <span className="text-green-700 ml-2">
            {new Date(project.startDate).toLocaleDateString()}
          </span>
        </p>
        <p className="font-bold text-gray-600 flex items-center">
          <FaClock className="mr-2 text-red-500" />
          Deadline:
          <span className="text-red-700 ml-2">
            {new Date(project.deadline).toLocaleDateString()}
          </span>
        </p>
        <p className="font-bold text-gray-600 flex items-center">
          <FaLaptopCode className="mr-2 text-indigo-500" />
          Domain:
          <span className="text-indigo-700 ml-2">{project.domain}</span>
        </p>
      </div>

      {/* Users Involved */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold">Users Involved</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-md font-bold mb-2">
              <FaLaptopCode className="mr-2 inline text-blue-500" />
              Developers
            </h3>
            {project.developers?.length > 0 ? (
              <ul>
                {project.developers.map((dev) => (
                  <li key={dev._id} className="flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    {dev.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No developers assigned.</p>
            )}
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-md font-bold mb-2">
              <FaHardHat className="mr-2 inline text-green-500" />
              Test Engineers
            </h3>
            {project.testEngineers?.length > 0 ? (
              <ul>
                {project.testEngineers.map((eng) => (
                  <li key={eng._id} className="flex items-center">
                    <FaUser className="mr-2 text-green-500" />
                    {eng.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No test engineers assigned.</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
          <FaFileAlt className="text-3xl text-yellow-500 mr-4" />
          <div>
            <h3 className="text-sm font-bold">Total Scenarios</h3>
            <p className="text-lg">{totalScenarios}</p>
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg flex items-center">
          <FaCodeBranch className="text-3xl text-green-500 mr-4" />
          <div>
            <h3 className="text-sm font-bold">Total Test Cases</h3>
            <p className="text-xl">{totalTestCases}</p>
          </div>
        </div>

        <div className="bg-red-100 p-4 rounded-lg flex items-center">
          <FaBug className="text-3xl text-red-500 mr-4" />
          <div>
            <h3 className="text-lg font-bold">Total Defects</h3>
            <p className="text-xl">{totalDefects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProject;
