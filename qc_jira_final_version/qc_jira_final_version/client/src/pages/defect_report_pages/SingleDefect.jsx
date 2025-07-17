import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FaBug,
  FaListAlt,
  FaFileSignature,
  FaProjectDiagram,
  FaCamera,
} from "react-icons/fa";

const SingleDefect = () => {
  const { projectId, defectId } = useParams();
  const [bug, setBug] = useState(null);
  const [status, setStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [developers, setDevelopers] = useState([]); // For developer dropdown
  const [assignedDeveloper, setAssignedDeveloper] = useState(""); // Selected developer
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchDefect = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/single-project/${projectId}/defect/${defectId}`
        );
        setBug(response.data);
        setStatus(response.data.status);

        // Set historyData from response data
        if (response.data.history) {
          setHistoryData(response.data.history); // Update historyData with the fetched history
        }

        // Fetch the user role from localStorage
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser && loggedInUser.role) {
          setUserRole(loggedInUser.role);
        }

        // Fetch developers associated with the project
        const developerResponse = await axios.get(
          `http://localhost:5000/api/developers/single-project/${projectId}/developers`
        );
        setDevelopers(developerResponse.data.developers);
      } catch (error) {
        console.error("Error fetching defect:", error);
      }
    };

    fetchDefect();
  }, [projectId, defectId]);

  if (!bug) {
    return <div>Loading...</div>;
  }

  const getImageUrl = (bugImage) => {
    if (bugImage) {
      const normalizedPath = bugImage
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `http://localhost:5000/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150"; // Default placeholder image
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
        `http://localhost:5000/single-project/${projectId}/defect/${defectId}`,
        {
          status,
          updated_by: JSON.parse(localStorage.getItem("user")).name, // Pass the logged-in user's name
          assignedDeveloper, // Pass the assigned developer
        }
      );
      alert("Status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bug Image */}
        <div className="col-span-1">
          <h5 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
            <FaBug className="mr-2 text-indigo-600" /> Defect Details
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
          {/* Navigation Links */}
          <div className="mb-5">
            <a
              href={`/single-project/${projectId}/all-defects`}
              className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
            >
              All Defects
            </a>
            {/* Conditionally render the "Assign Defect to Developer" link based on user role */}
            {[
              "superadmin",
              "admin",
              "project_manager",
              "developer_lead",
            ].includes(userRole) && (
              <a
                href={`/single-project/${projectId}/assign-defect/${defectId}`}
                className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
              >
                Assign Defect to Developer
              </a>
            )}
            <a
              href={`/single-project/${projectId}`}
              className="rounded mr-2 bg-indigo-700 text-white py-1 px-3 hover:bg-indigo-900 transition-colors duration-100"
            >
              Project Dashboard
            </a>
          </div>

          {/* First Row - Project Details */}
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

          {/* Second Row - Test Case Details */}
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

          {/* Additional Details */}
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
                {bug.steps_to_replicate.map((step, index) => (
                  <li key={index}>
                    <span className="font-bold">Step:</span> {index + 1} |{" "}
                    <span className="font-bold"> Actual Step:</span> {step} |{" "}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Status Update */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-1 gap-4">
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
          </div>

          {/* Update Button */}
          <button
            onClick={handleStatusUpdate}
            className="btn btn-sm bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4  mt-4"
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
