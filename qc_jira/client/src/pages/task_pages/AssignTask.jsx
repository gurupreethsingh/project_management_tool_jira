import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AssignTask = () => {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState(""); // State to hold the project name
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium"); // Default priority
  const [testEngineers, setTestEngineers] = useState([]); // State to hold test engineers
  const [developers, setDevelopers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch test engineers and project details associated with the project
  useEffect(() => {
    fetchTestEngineers();
    fetchDevelopers();
    fetchProjectDetails(); // Fetch project name
  }, [projectId]);

  const fetchTestEngineers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/projects/${projectId}/test-engineers`
      );
      // Set the fetched test engineers in state
      setTestEngineers(response.data.testEngineers);
    } catch (error) {
      console.error("Error fetching test engineers:", error.message);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/projects/${projectId}/developers`
      );
      setDevelopers(response.data.developers);
    } catch (error) {
      console.error("Error fetching developers:", error.message);
    }
  };

  // Fetch the project details to get the project name
  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/single-project/${projectId}`
      );
      setProjectName(response.data.projectName); // Set the project name from the response
    } catch (error) {
      console.error("Error fetching project details:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId"); // Fetch the logged-in user's ID

    try {
      await axios.post(
        `http://localhost:5000/projects/${projectId}/assign-task`,
        {
          title,
          description,
          startDate,
          deadline,
          assignedTo,
          priority,
          createdBy: userId, // Pass the logged-in user's ID as `createdBy`
        }
      );
      alert("Task successfully assigned!");
      navigate(`/single-project/${projectId}/view-all-tasks`);
    } catch (error) {
      setError("Failed to assign task");
      alert("Error assigning task. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-lg font-bold mb-4">
          Assign Task, Project Name: {projectName || "Loading..."}
        </h2>
        <a
          href={`/single-project/${projectId}`}
          className="btn btn-sm text-white bg-indigo-600 hover:bg-indigo-900"
        >
          Project Dashboard
        </a>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Assign Task To Test Engineer / Developer
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">
              Select a Test Engineer / Developer To Assign Task
            </option>
            {testEngineers.map((engineer) => (
              <option key={engineer._id} value={engineer._id}>
                {engineer.name} - Test-Engineer
              </option>
            ))}

            {developers.map((dev) => (
              <option key={dev._id} value={dev._id}>
                {dev.name} - Developer
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default AssignTask;
