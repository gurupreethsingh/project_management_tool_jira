import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";

export default function SingleScenario() {
  const { projectId, scenarioId } = useParams(); // Fetch both projectId (id) and scenarioId from URL
  const [scenario, setScenario] = useState(null); // Store scenario data
  const [changes, setChanges] = useState([]); // Store scenario changes
  const [updatedText, setUpdatedText] = useState(""); // Store updated text

  // Function to fetch scenario data and changes history
  const fetchScenario = async () => {
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage
      const response = await axios.get(
        `http://localhost:5000/single-project/${projectId}/scenario-history/${scenarioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Authorization header with token
          },
        }
      );
      console.log(response.data.changes); // Check if changes are being fetched
      setScenario(response.data.scenario);
      setChanges(response.data.changes);
      setUpdatedText(response.data.scenario.scenario_text); // Set initial text to the current scenario text
    } catch (error) {
      console.error("Error fetching scenario details:", error);
    }
  };

  useEffect(() => {
    fetchScenario();
  }, [projectId, scenarioId]);

  const handleUpdateScenario = async () => {
    const userId = localStorage.getItem("userId"); // Ensure the userId is fetched correctly
    console.log("User ID found while updating: ", userId); // Check userId here
    const token = localStorage.getItem("token"); // Fetch token from localStorage
    console.log("Token received while updating scenario: ", token); // Log the token

    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/single-project/scenario/${scenarioId}`,
        {
          scenario_text: updatedText,
          userId: userId, // Pass the logged-in user's ID here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        }
      );
      alert("Scenario updated successfully");
      window.location.reload(); // Refresh the page to see the updated changes
    } catch (error) {
      console.error("Error updating scenario:", error);
      alert("Error updating scenario");
    }
  };

  if (!scenario) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Scenario Info */}
        <div className="bg-white p-6 rounded-md shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-600 mb-4">
              Project : {scenario.project.project_name}
            </h2>
            <div className="flex space-x-4">
              {/* Button to view all scenarios */}
              <Link
                to={`/single-project/${projectId}/view-all-scenarios`} // Ensure this route matches your View All Scenarios page
                className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
              >
                View All Scenarios
              </Link>

              {/* Link to add a new test case based on the scenario */}
              <Link
                to={`/single-project/${projectId}/scenario/${scenarioId}/add-test-case`}
                state={{
                  scenarioNumber: scenario.scenario_number,
                  scenarioText: scenario.scenario_text, // Pass the scenario_text to the next page
                }} // Pass scenario number through state
                className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
              >
                Add Test Case
              </Link>

              {/* Link to view test cases based on the scenario */}
              <Link
                to={`/single-project/${projectId}/all-test-cases`}
                className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
              >
                View All Test Cases
              </Link>

              {/* Link to view test cases based on the scenario */}
              <Link
                to={`/single-project/${projectId}`}
                className="bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
              >
                Project Dashboard
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-600">
              Scenario Number: {scenario.scenario_number}
            </h3>
            <p className="text-sm text-gray-500">
              Written by: {scenario.createdBy.name} on{" "}
              {new Date(scenario.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Current Scenario Text */}
          <div className="bg-gray-100 p-4 rounded-md">
            <label
              htmlFor="scenario_text"
              className="block text-lg font-medium text-gray-700"
            >
              Current Scenario Text
            </label>
            <textarea
              id="scenario_text"
              name="scenario_text"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={updatedText}
              onChange={(e) => setUpdatedText(e.target.value)}
            />
            <button
              onClick={handleUpdateScenario}
              className="mt-4 bg-indigo-700 btn btn-sm text-light hover:bg-indigo-900"
            >
              Update Scenario
            </button>
          </div>
        </div>

        {/* Scenario Changes History */}
        <div className="mt-10 bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            Changes History
          </h3>
          {changes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Changed By
                    </th>
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Previous Text
                    </th>
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Change Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {changes.map((change, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border border-gray-300">
                        {change.user ? change.user.name : "Unknown"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {change.previous_text}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {new Date(change.time).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">
              No changes have been made to this scenario yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
