import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaProjectDiagram } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const AssignDefect = () => {
  const { projectId, defectId } = useParams(); // projectId and defectId from the URL
  const [developers, setDevelopers] = useState([]); // List of developers
  const [selectedDeveloper, setSelectedDeveloper] = useState(""); // Selected developer ID
  const [projectName, setProjectName] = useState(""); // Project name
  const [defect, setDefect] = useState({}); // Store defect details
  const navigate = useNavigate(); // Use for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project details (including project name)
        const projectResponse = await axios.get(
          `${globalBackendRoute}/api/projects/${projectId}`
        );
        setProjectName(projectResponse.data.project_name);

        // Fetch defect details associated with this project and defect ID
        const defectResponse = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/defect/${defectId}`
        );
        setDefect(defectResponse.data);

        // Fetch developers associated with the project
        const developerResponse = await axios.get(
          `${globalBackendRoute}/api/developers/single-project/${projectId}/developers`
        );
        setDevelopers(developerResponse.data.developers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId, defectId]);

  const handleAssign = async () => {
    if (!selectedDeveloper) {
      alert("Please select a developer");
      return;
    }

    try {
      // Get the logged-in user from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const developer = developers.find((dev) => dev._id === selectedDeveloper);

      await axios.post(
        `${globalBackendRoute}/api/single-project/${projectId}/assign-defect`,
        {
          projectName, // Project name from state
          moduleName: defect.module_name, // Module name from defect state
          defectId: defect._id, // Defect ID from defect state
          defectBugId: defect.bug_id, // Defect bug ID from defect state
          expectedResult: defect.expected_result, // Expected result from defect state
          actualResult: defect.actual_result, // Actual result from defect state
          assignedTo: selectedDeveloper, // Developer ID from the dropdown
          assignedBy: loggedInUser.id, // Use the user ID from localStorage
        }
      );

      alert(`Defect successfully assigned to ${developer.name}!`);
      navigate(`/single-project/${projectId}/all-defects`); // Navigate to "All Defects" page
    } catch (error) {
      console.error("Error assigning defect:", error);
      alert("Failed to assign defect");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Project Details + Buttons */}
        <div className="col-span-2 flex justify-between">
          <div className="flex items-center mb-2">
            <FaProjectDiagram className="text-orange-500 mr-2" size={24} />
            <span className="text-lg font-semibold leading-6 text-gray-700">
              Project Name: {projectName || "N/A"}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() =>
                navigate(`/single-project/${projectId}/all-defects`)
              }
              className="btn btn-sm bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-800 transition"
            >
              View All Defect
            </button>
            <button
              onClick={() => navigate(`/single-project/${projectId}`)}
              className="btn btn-sm bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-800 transition"
            >
              Project Dashboard
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Module Name
          </label>
          <input
            type="text"
            value={defect.module_name || "N/A"}
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
            value={defect.expected_result || "N/A"}
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
            value={defect.actual_result || "N/A"}
            readOnly
            className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Defect ID
          </label>
          <input
            type="text"
            value={defect.bug_id || "N/A"}
            readOnly
            className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Developer Dropdown */}
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Assign Developer
          </label>
          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Select Developer</option>
            {developers.map((developer) => (
              <option key={developer._id} value={developer._id}>
                {developer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assign Button */}
        <div className="col-span-2 block">
          <button
            onClick={handleAssign}
            className="btn btn-sm bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4 py-1 mt-4"
          >
            Assign Defect to Developer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignDefect;
