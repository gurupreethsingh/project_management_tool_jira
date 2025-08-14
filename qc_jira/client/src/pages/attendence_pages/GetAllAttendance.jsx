

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import {
//   FaEye,
//   FaTrash,
//   FaThList,
//   FaThLarge,
//   FaTh,
//   FaSearch,
//   FaSortAlphaDown,
//   FaSortAmountDown,
//   FaArrowLeft,
//   FaArrowRight,
// } from "react-icons/fa";
// import globalBackendRoute from "../../config/Config";

// const GetAllAttendance = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState("list");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [sortField, setSortField] = useState("date");
//   const [statusFilter, setStatusFilter] = useState("");

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${globalBackendRoute}/api/view-all-attendance`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setAttendance(res.data);
//       } catch (error) {
//         console.error("Error fetching attendance:", error);
//       }
//     };
//     fetchAttendance();
//   }, []);

//   const handleDelete = async (id) => {
//     if (
//       !window.confirm("Are you sure you want to delete this attendance record?")
//     )
//       return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${globalBackendRoute}/api/delete-attendance/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAttendance(attendance.filter((item) => item._id !== id));
//     } catch (error) {
//       console.error("Error deleting attendance:", error);
//     }
//   };

//   const handleSort = (field) => {
//     setSortField(field);
//     const sorted = [...attendance].sort((a, b) => {
//       const valA = field.includes(".")
//         ? field.split(".").reduce((obj, key) => obj?.[key] || "", a)
//         : a[field] || "";
//       const valB = field.includes(".")
//         ? field.split(".").reduce((obj, key) => obj?.[key] || "", b)
//         : b[field] || "";

//       const valueA = typeof valA === "string" ? valA.toLowerCase() : valA;
//       const valueB = typeof valB === "string" ? valB.toLowerCase() : valB;

//       return sortOrder === "asc"
//         ? valueA > valueB
//           ? 1
//           : -1
//         : valueA < valueB
//         ? 1
//         : -1;
//     });
//     setAttendance(sorted);
//     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//   };

//   const filteredData = attendance.filter((entry) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       (!statusFilter ||
//         entry.status?.trim().toLowerCase() === statusFilter.toLowerCase()) &&
//       (entry?.employee?.name?.toLowerCase().includes(query) ||
//         entry?.project?.project_name?.toLowerCase().includes(query) ||
//         entry?.taskDescription?.toLowerCase().includes(query))
//     );
//   });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const statusCounts = attendance.reduce(
//     (acc, curr) => {
//       const status = curr.status?.trim().toLowerCase();
//       acc.total++;
//       if (status === "pending") acc.pending++;
//       if (status === "approved") acc.approved++;
//       return acc;
//     },
//     { total: 0, pending: 0, approved: 0 }
//   );

//   const statusBgColor = (status) => {
//     switch (status?.trim().toLowerCase()) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "approved":
//         return "bg-green-100 text-green-700";
//       case "rejected":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="p-6 md:p-10 bg-white min-h-screen">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <div className="w-full md:w-auto">
//           <h2 className="text-2xl font-bold text-indigo-600">
//             All Attendance Records
//           </h2>
//           <p className="text-sm text-gray-600">
//             Total: {statusCounts.total} | Pending: {statusCounts.pending} |
//             Approved: {statusCounts.approved}
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2 items-center">
//           <div className="relative">
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search project, task or employee"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-1.5 border rounded-md text-sm"
//             />
//           </div>

//           <select
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="border px-3 py-1.5 rounded-md text-sm"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//           </select>

//           <button
//             onClick={() => handleSort("date")}
//             className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
//           >
//             <FaSortAmountDown /> Sort by Date ({sortOrder})
//           </button>

//           <button
//             onClick={() => handleSort("project.project_name")}
//             className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
//           >
//             <FaSortAlphaDown /> Sort by Project
//           </button>

//           <FaThList
//             className={`text-lg cursor-pointer ${
//               viewMode === "list" ? "text-blue-500" : "text-gray-400"
//             }`}
//             onClick={() => setViewMode("list")}
//           />
//           <FaThLarge
//             className={`text-lg cursor-pointer ${
//               viewMode === "card" ? "text-blue-500" : "text-gray-400"
//             }`}
//             onClick={() => setViewMode("card")}
//           />
//           <FaTh
//             className={`text-lg cursor-pointer ${
//               viewMode === "grid" ? "text-blue-500" : "text-gray-400"
//             }`}
//             onClick={() => setViewMode("grid")}
//           />
//         </div>
//       </div>

//       {viewMode === "list" && (
//         <div className="space-y-6">
//           <div className="grid grid-cols-7 gap-4 font-semibold text-sm border-b pb-2">
//             <p>#</p>
//             <p>Employee</p>
//             <p>Project</p>
//             <p>Task</p>
//             <p>Date</p>
//             <p>Status</p>
//             <p>Actions</p>
//           </div>

//           {currentItems.map((entry, idx) => (
//             <div key={entry._id} className="bg-gray-50 p-3 rounded shadow-sm">
//               <div className="grid grid-cols-7 gap-4 items-center text-sm">
//                 <p>#{indexOfFirstItem + idx + 1}</p>
//                 <p>{entry.employee?.name || "N/A"}</p>
//                 <p>{entry.project?.project_name || "N/A"}</p>
//                 <p className="truncate max-w-xs">
//                   {entry.taskDescription || "N/A"}
//                 </p>
//                 <p>
//                   {entry.date
//                     ? new Date(entry.date).toLocaleDateString()
//                     : "N/A"}
//                 </p>
//                 <p
//                   className={`px-2 py-1 rounded text-xs w-fit ${statusBgColor(
//                     entry.status
//                   )}`}
//                 >
//                   {entry.status || "N/A"}
//                 </p>
//                 <div className="flex gap-3">
//                   <Link
//                     to={`/get-single-attendance/${entry._id}`}
//                     className="text-blue-600 hover:underline"
//                   >
//                     <FaEye />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(entry._id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {(viewMode === "card" || viewMode === "grid") && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//           {currentItems.map((entry) => (
//             <div
//               key={entry._id}
//               className="bg-white p-4 border rounded shadow-sm"
//             >
//               <h3 className="text-md font-semibold text-indigo-700 mb-2">
//                 {entry.project?.project_name || "Project"}
//               </h3>
//               <p className="text-sm">Employee: {entry.employee?.name}</p>
//               <p className="text-sm">Task: {entry.taskDescription}</p>
//               <p className="text-sm">
//                 Date: {new Date(entry.date).toLocaleDateString()}
//               </p>
//               <p
//                 className={`text-sm mt-1 px-2 py-1 rounded w-fit ${statusBgColor(
//                   entry.status
//                 )}`}
//               >
//                 Status: {entry.status || "N/A"}
//               </p>
//               <div className="mt-2 flex justify-between">
//                 <Link
//                   to={`/get-single-attendance/${entry._id}`}
//                   className="text-blue-600 hover:underline"
//                 >
//                   <FaEye />
//                 </Link>
//                 <button
//                   onClick={() => handleDelete(entry._id)}
//                   className="text-red-600 hover:underline"
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="flex justify-center items-center gap-4 mt-10">
//         <button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//           className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
//         >
//           <FaArrowLeft />
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//           className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
//         >
//           <FaArrowRight />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GetAllAttendance;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaTrash,
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaSortAlphaDown,
  FaSortAmountDown,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const GetAllAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortField, setSortField] = useState("date");
  const [statusFilter, setStatusFilter] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // ✅ Match your Login.jsx
        console.log("Fetched user from localStorage:", user);

        if (user?.role) {
          setUserRole(user.role);
        }

        const res = await axios.get(`${globalBackendRoute}/api/view-all-attendance`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAttendance(res.data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, []);

  const handleBackToDashboard = () => {
    switch (userRole) {
      case "superadmin":
        navigate("/super-admin-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "developer_lead":
        navigate("/developer-lead-dashboard");
        break;
      case "developer":
        navigate("/developer-dashboard");
        break;
      case "qa_lead":
        navigate("/qa-dashboard");
        break;
      case "test_engineer":
        navigate("/test-engineer-dashboard");
        break;
      default:
        navigate("/dashboard");
        break;
    }
  };

  const handleBack = () => {
    const role = userRole?.toLowerCase();
    console.log("Detected userRole:", role);

    if (role === "superadmin") {
      navigate("/super-admin-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "project_manager") {
      navigate("/project-manager-dashboard");
    } else {
      navigate("/employee-dashboard");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${globalBackendRoute}/api/delete-attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(attendance.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const handleSort = (field) => {
    setSortField(field);
    const sorted = [...attendance].sort((a, b) => {
      const valA = field.includes(".")
        ? field.split(".").reduce((obj, key) => obj?.[key] || "", a)
        : a[field] || "";
      const valB = field.includes(".")
        ? field.split(".").reduce((obj, key) => obj?.[key] || "", b)
        : b[field] || "";

      const valueA = typeof valA === "string" ? valA.toLowerCase() : valA;
      const valueB = typeof valB === "string" ? valB.toLowerCase() : valB;

      return sortOrder === "asc" ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });
    setAttendance(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredData = attendance.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return (
      (!statusFilter || entry.status?.trim().toLowerCase() === statusFilter.toLowerCase()) &&
      (entry?.employee?.name?.toLowerCase().includes(query) ||
        entry?.project?.project_name?.toLowerCase().includes(query) ||
        entry?.taskDescription?.toLowerCase().includes(query))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const statusCounts = attendance.reduce(
    (acc, curr) => {
      const status = curr.status?.trim().toLowerCase();
      acc.total++;
      if (status === "pending") acc.pending++;
      if (status === "approved") acc.approved++;
      return acc;
    },
    { total: 0, pending: 0, approved: 0 }
  );

  const statusBgColor = (status) => {
    switch (status?.trim().toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      {/* ✅ Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBackToDashboard}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
{/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-auto">
          <h2 className="text-2xl font-bold text-indigo-600">
            All Attendance Records
          </h2>
          <p className="text-sm text-gray-600">
            Total: {statusCounts.total} | Pending: {statusCounts.pending} | Approved: {statusCounts.approved}
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search project, task or employee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-1.5 border rounded-md text-sm"
            />
          </div>

          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-1.5 rounded-md text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>

          <button
            onClick={() => handleSort("date")}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
          >
            <FaSortAmountDown /> Sort by Date ({sortOrder})
          </button>

          <button
            onClick={() => handleSort("project.project_name")}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
          >
            <FaSortAlphaDown /> Sort by Project
          </button>

          <FaThList
            className={`text-lg cursor-pointer ${viewMode === "list" ? "text-blue-500" : "text-gray-400"}`}
            onClick={() => setViewMode("list")}
          />
          <FaThLarge
            className={`text-lg cursor-pointer ${viewMode === "card" ? "text-blue-500" : "text-gray-400"}`}
            onClick={() => setViewMode("card")}
          />
          <FaTh
            className={`text-lg cursor-pointer ${viewMode === "grid" ? "text-blue-500" : "text-gray-400"}`}
            onClick={() => setViewMode("grid")}
          />
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-6">
          <div className="grid grid-cols-7 gap-4 font-semibold text-sm border-b pb-2">
            <p>#</p>
            <p>Employee</p>
            <p>Project</p>
            <p>Task</p>
            <p>Date</p>
            <p>Status</p>
            <p>Actions</p>
          </div>

          {currentItems.map((entry, idx) => (
            <div key={entry._id} className="bg-gray-50 p-3 rounded shadow-sm">
              <div className="grid grid-cols-7 gap-4 items-center text-sm">
                <p>#{indexOfFirstItem + idx + 1}</p>
                <p>{entry.employee?.name || "N/A"}</p>
                <p>{entry.project?.project_name || "N/A"}</p>
                <p className="truncate max-w-xs">{entry.taskDescription || "N/A"}</p>
                <p>{entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}</p>
                <p className={`px-2 py-1 rounded text-xs w-fit ${statusBgColor(entry.status)}`}>
                  {entry.status || "N/A"}
                </p>
                <div className="flex gap-3">
                  <Link
                    to={`/get-single-attendance/${entry._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    <FaEye />
                  </Link>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="text-red-600 hover:underline"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card/Grid View */}
      {(viewMode === "card" || viewMode === "grid") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {currentItems.map((entry) => (
            <div key={entry._id} className="bg-white p-4 border rounded shadow-sm">
              <h3 className="text-md font-semibold text-indigo-700 mb-2">
                {entry.project?.project_name || "Project"}
              </h3>
              <p className="text-sm">Employee: {entry.employee?.name}</p>
              <p className="text-sm">Task: {entry.taskDescription}</p>
              <p className="text-sm">Date: {new Date(entry.date).toLocaleDateString()}</p>
              <p className={`text-sm mt-1 px-2 py-1 rounded w-fit ${statusBgColor(entry.status)}`}>
                Status: {entry.status || "N/A"}
              </p>
              <div className="mt-2 flex justify-between">
                <Link
                  to={`/get-single-attendance/${entry._id}`}
                  className="text-blue-600 hover:underline"
                >
                  <FaEye />
                </Link>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="text-red-600 hover:underline"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          <FaArrowLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>    
  );
};

export default GetAllAttendance;





