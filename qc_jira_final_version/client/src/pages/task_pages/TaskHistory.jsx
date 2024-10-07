// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// const TaskHistory = () => {
//   const { projectId, taskId } = useParams();
//   const [task, setTask] = useState(null);
//   const [history, setHistory] = useState([]);

//   // Function to apply color coding to status
//   const getStatusClass = (status) => {
//     switch (status) {
//       case "new":
//         return "bg-blue-100 rounded text-center";
//       case "re-assigned":
//         return "bg-orange-500 rounded text-center text-white";
//       case "assigned":
//         return "bg-blue-500 rounded  text-white text-center";
//       case "in-progress":
//         return "bg-orange-100 rounded  text-center";
//       case "finished":
//         return "bg-green-100 rounded  text-center";
//       case "closed":
//         return "bg-gray-300 rounded  text-center";
//       case "pending":
//         return "bg-red-500 rounded  text-white text-center";
//       default:
//         return "";
//     }
//   };

//   const fetchTaskDetails = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/single-project/${projectId}/single-task/${taskId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setTask(response.data.task);
//       // Fix: Access the nested `statusChanges` inside `history`
//       setHistory(response.data.task.history[0]?.statusChanges || []);
//     } catch (error) {
//       console.error("Error fetching task details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTaskDetails();
//   }, [projectId, taskId]);

//   if (!task) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="bg-gray-50 py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         {/* Task Details Section */}
//         <div className="bg-white p-6 rounded-md shadow-lg">
//           <div className="flex justify-between items-center">
//             <h2 className="text-3xl font-bold text-gray-600 mb-4">
//               Task Title: {task.title}
//             </h2>
//             <div className="flex flex-wrap">
//               <div className="flex space-x-4">
//                 <Link
//                   to={`/single-project/${projectId}/view-all-tasks`}
//                   className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900 m-1"
//                 >
//                   All Tasks
//                 </Link>
//               </div>
//               <div className="flex space-x-4">
//                 <Link
//                   to={`/single-project/${projectId}`}
//                   className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900 m-1"
//                 >
//                   Project Dashboard
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <div className="mb-3">
//             <h3 className="text-xl font-semibold text-gray-600">
//               Task Description : {task.description}
//             </h3>
//             <p className="mt-3">
//               Current Status:{" "}
//               <span className={`text-sm p-1 ${getStatusClass(task.status)}`}>
//                 {task.status}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Task History Table */}
//         <div className="mt-10 bg-white p-6 rounded-md shadow-lg">
//           <h3 className="text-2xl font-bold text-gray-700 mb-4">
//             Task History
//           </h3>
//           {history.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full table-auto border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="px-4 py-2 border border-gray-300 text-left">
//                       User
//                     </th>
//                     <th className="px-4 py-2 border border-gray-300 text-left">
//                       Status
//                     </th>
//                     <th className="px-4 py-2 border border-gray-300 text-left">
//                       Created / Updated Date
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {history.map((change, index) => (
//                     <tr key={index}>
//                       <td className="px-4 py-2 border border-gray-300">
//                         {change.changedBy?.name || "Unknown"}
//                       </td>
//                       <td
//                         className={`px-4 py-2 border border-gray-300 ${getStatusClass(
//                           change.status
//                         )}`}
//                       >
//                         {change.status}
//                       </td>
//                       <td className="px-4 py-2 border border-gray-300">
//                         {new Date(change.changedAt).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-600">No history available for this task.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskHistory;

//

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// const TaskHistory = () => {
//   const { projectId, taskId } = useParams();
//   const [task, setTask] = useState(null);
//   const [history, setHistory] = useState([]);

//   // Function to apply color coding to status
//   const getStatusClass = (status) => {
//     switch (status) {
//       case "new":
//         return "bg-blue-100 rounded text-center";
//       case "re-assigned":
//         return "bg-orange-500 rounded text-center text-white";
//       case "assigned":
//         return "bg-blue-500 rounded  text-white text-center";
//       case "in-progress":
//         return "bg-orange-100 rounded  text-center";
//       case "finished":
//         return "bg-green-100 rounded  text-center";
//       case "closed":
//         return "bg-gray-300 rounded  text-center";
//       case "pending":
//         return "bg-red-500 rounded  text-white text-center";
//       default:
//         return "";
//     }
//   };

//   // Fetch task details and history
//   const fetchTaskDetails = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/single-project/${projectId}/single-task/${taskId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setTask(response.data.task);
//       console.log("Task data:", response.data.task); // Debugging log

//       // Fetch all status changes from the main history array (ignoring statusChanges inside)
//       setHistory(response.data.task.history || []);
//     } catch (error) {
//       console.error("Error fetching task details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTaskDetails();
//   }, [projectId, taskId]);

//   if (!task) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="bg-gray-50 py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         {/* Task Details Section */}
//         <div className="bg-white p-6 rounded-md shadow-lg">
//           <div className="flex justify-between items-center">
//             <h2 className="text-3xl font-bold text-gray-600 mb-4">
//               Task Title: {task.title}
//             </h2>
//             <div className="flex flex-wrap">
//               <div className="flex space-x-4">
//                 <Link
//                   to={`/single-project/${projectId}/view-all-tasks`}
//                   className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900 m-1"
//                 >
//                   All Tasks
//                 </Link>
//               </div>
//               <div className="flex space-x-4">
//                 <Link
//                   to={`/single-project/${projectId}`}
//                   className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900 m-1"
//                 >
//                   Project Dashboard
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <div className="mb-3">
//             <h3 className="text-xl font-semibold text-gray-600">
//               Task Description : {task.description}
//             </h3>
//             <p className="mt-3">
//               Current Status:{" "}
//               <span className={`text-sm p-1 ${getStatusClass(task.status)}`}>
//                 {task.status}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Task History Table */}
//         <div className="mt-10 bg-white p-6 rounded-md shadow-lg">
//           <h3 className="text-2xl font-bold text-gray-700 mb-4">
//             Task History
//           </h3>
//           {history.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full table-auto border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="px-4 py-2 border border-gray-300 text-left">
//                       Status
//                     </th>
//                     <th className="px-4 py-2 border border-gray-300 text-left">
//                       Changed At
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {history.map((change, index) => (
//                     <tr key={index}>
//                       <td
//                         className={`px-4 py-2 border border-gray-300 ${getStatusClass(
//                           change.status
//                         )}`}
//                       >
//                         {change.status}
//                       </td>
//                       <td className="px-4 py-2 border border-gray-300">
//                         {new Date(change.changedAt).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-600">No history available for this task.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskHistory;

//

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const TaskHistory = () => {
  const { projectId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [history, setHistory] = useState([]);

  // Function to apply color coding to status
  const getStatusClass = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 rounded text-center";
      case "re-assigned":
        return "bg-orange-500 rounded text-center text-white";
      case "assigned":
        return "bg-blue-500 rounded  text-white text-center";
      case "in-progress":
        return "bg-orange-100 rounded  text-center";
      case "finished":
        return "bg-green-100 rounded  text-center";
      case "closed":
        return "bg-gray-300 rounded  text-center";
      case "pending":
        return "bg-red-500 rounded  text-white text-center";
      default:
        return "";
    }
  };

  // Fetch task details and history
  const fetchTaskDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:5000/single-project/${projectId}/single-task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTask(response.data.task);

      // Fetch status changes from the nested history
      const statusChanges = response.data.task.history
        .map((entry) => entry.statusChanges)
        .flat();
      setHistory(statusChanges || []);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [projectId, taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Task Details Section */}
        <div className="bg-white p-6 rounded-md shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-600 mb-4">
              Task Title: {task.title}
            </h2>
            <div className="flex flex-wrap">
              <div className="flex space-x-4">
                <Link
                  to={`/single-project/${projectId}/view-all-tasks`}
                  className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900 m-1"
                >
                  All Tasks
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link
                  to={`/single-project/${projectId}`}
                  className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900 m-1"
                >
                  Project Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-xl font-semibold text-gray-600">
              Task Description : {task.description}
            </h3>
            <p className="mt-3">
              Current Status:{" "}
              <span className={`text-sm p-1 ${getStatusClass(task.status)}`}>
                {task.status}
              </span>
            </p>
          </div>
        </div>

        {/* Task History Table */}
        <div className="mt-10 bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            Task History
          </h3>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      User
                    </th>
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Status
                    </th>
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Changed At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((change, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border border-gray-300">
                        {/* Display "Unknown" if changedBy is not provided */}
                        {change.changedBy?.name || "Unknown"}
                      </td>
                      <td
                        className={`px-4 py-2 border border-gray-300 ${getStatusClass(
                          change.status
                        )}`}
                      >
                        {change.status || "Unknown"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {new Date(change.changedAt).toLocaleString() !==
                        "Invalid Date"
                          ? new Date(change.changedAt).toLocaleString()
                          : "Invalid Date"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No history available for this task.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
