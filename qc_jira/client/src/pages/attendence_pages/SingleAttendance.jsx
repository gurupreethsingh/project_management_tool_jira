// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import globalBackendRoute from "../../config/Config";
// import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";

// const SingleAttendance = () => {
//   const { id } = useParams(); // userId
//   const navigate = useNavigate();
//   const [attendances, setAttendances] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${globalBackendRoute}/api/get-single-attendance/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setAttendances(res.data || []);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching single user attendance:", error);
//         setLoading(false);
//       }
//     };
//     fetchAttendance();
//   }, [id]);

//   const statusColor = (status) => {
//     switch (status?.toLowerCase()) {
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
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-indigo-600">
//           Attendance for User: {id}
//         </h2>
//         <button
//           className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
//           onClick={() => navigate(-1)}
//         >
//           <FaArrowLeft /> Back
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : attendances.length === 0 ? (
//         <p className="text-center text-gray-500">No attendance records found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {attendances.map((record) => (
//             <div
//               key={record._id}
//               className="p-4 border rounded shadow-sm bg-gray-50 hover:shadow-md transition"
//             >
//               <h3 className="font-semibold text-indigo-700 text-lg mb-2">
//                 {record.project?.project_name || "Project Name"}
//               </h3>
//               <p className="text-sm">Date: {new Date(record.date).toLocaleDateString()}</p>
//               <p className="text-sm">Hours Worked: {record.hoursWorked}</p>
//               <p className="text-sm">Task: {record.taskDescription || "N/A"}</p>
//               <p className="text-sm">Location: {record.location}</p>
//               <p className="text-sm">Shift: {record.shift}</p>
//               <p className="text-sm">Is Billable: {record.isBillable ? "Yes" : "No"}</p>
//               <p className={`mt-2 px-2 py-1 rounded w-fit text-sm ${statusColor(record.status)}`}>
//                 Status: {record.status}
//               </p>
//               {record.remarks && (
//                 <p className="text-xs text-red-500 mt-1">Remarks: {record.remarks}</p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SingleAttendance;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const SingleAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${globalBackendRoute}/api/get-single-attendance/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAttendance(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${globalBackendRoute}/api/approve-attendance/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Attendance approved successfully.");
      navigate("/view-all-attendance"); // ✅ Redirect after approve
    } catch (error) {
      console.error("Error approving attendance:", error);
      alert("Failed to approve attendance.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-attendance/${id}`);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (!attendance) return <div className="text-center mt-8">No attendance found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600 border-b pb-2">
        Attendance Details
      </h2>

      <div className="space-y-3 text-gray-800">
        <p>
          <strong>Employee Name:</strong>{" "}
          {attendance.employee?.name || "N/A"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(attendance.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Hours Worked:</strong> {attendance.hoursWorked}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              attendance.status === "Approved"
                ? "text-green-600"
                : attendance.status === "Rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {attendance.status}
          </span>
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        {attendance.status !== "Approved" && (
          <button
            onClick={handleApprove}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Approve Attendance
          </button>
        )}

        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Edit Attendance
        </button>
      </div>
    </div>
  );
};

export default SingleAttendance;


