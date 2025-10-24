import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FaFileAlt, FaCalendarAlt, FaUserTie, FaUsers } from "react-icons/fa";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    deadline: "",
    developers: [],
    testEngineers: [],
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [testEngineers, setTestEngineers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/users/developers`
        );
        setDevelopers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching developers:", error);
      }
    };

    const fetchTestEngineers = async () => {
      try {
        const res = await axios.get(
          `${globalBackendRoute}/api/users/test-engineers`
        );
        setTestEngineers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching test engineers:", error);
      }
    };

    fetchDevelopers();
    fetchTestEngineers();
  }, []);

  const validateForm = () => {
    const formErrors = {};
    if (!formData.projectName.trim())
      formErrors.projectName = "Project name cannot be empty.";
    if (!formData.startDate) formErrors.startDate = "Start date is required.";
    if (!formData.deadline) formErrors.deadline = "Deadline is required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDropdownChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setFormData({ ...formData, [name]: selectedValues });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userToken = localStorage.getItem("token");
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      const creatorId = user?._id || user?.id;

      // Send createdBy so backend passes schema validation even if req.user is absent
      const payload = {
        ...formData,
        createdBy: creatorId,
      };

      const response = await axios.post(
        `${globalBackendRoute}/api/create-project`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Project created successfully!");
        setFormData({
          projectName: "",
          description: "",
          startDate: "",
          endDate: "",
          deadline: "",
          developers: [],
          testEngineers: [],
        });
        setErrors({});
        alert("Project Created Successfully.");
        navigate("/all-projects");
      } else {
        setErrors({ submit: "Project creation failed." });
      }
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message || error?.message || "Server error";
      console.error(
        "Error during project creation:",
        error?.response?.data || error
      );
      setErrors({ submit: serverMsg });
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center">
        <MdOutlineWorkOutline
          className="text-indigo-600 mx-auto mb-2"
          size={48}
        />
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create New Project
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="projectName"
              className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
            >
              <FaFileAlt className="text-green-500 mr-2 inline-block" /> Project
              Name
            </label>
            <div className="w-2/3">
              <input
                id="projectName"
                name="projectName"
                type="text"
                required
                value={formData.projectName}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.projectName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.projectName}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="description"
              className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
            >
              <FaFileAlt className="text-blue-500 mr-2 inline-block" />{" "}
              Description
            </label>
            <div className="w-2/3">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="startDate"
              className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
            >
              <FaCalendarAlt className="text-purple-500 mr-2 inline-block" />{" "}
              Start Date
            </label>
            <div className="w-2/3">
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.startDate && (
                <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="endDate"
              className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
            >
              <FaCalendarAlt className="text-orange-500 mr-2 inline-block" />{" "}
              End Date
            </label>
            <div className="w-2/3">
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="deadline"
              className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
            >
              <FaCalendarAlt className="text-red-500 mr-2 inline-block" />{" "}
              Deadline
            </label>
            <div className="w-2/3">
              <input
                id="deadline"
                name="deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.deadline && (
                <p className="mt-2 text-sm text-red-600">{errors.deadline}</p>
              )}
            </div>
          </div>

          {/* Developers */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="developers"
              className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
            >
              <FaUserTie className="text-green-500 mr-2 inline-block" />{" "}
              Developers
            </label>
            <div className="w-2/3">
              <select
                id="developers"
                name="developers"
                multiple
                value={formData.developers}
                onChange={handleDropdownChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {developers.map((developer) => (
                  <option key={developer._id} value={developer._id}>
                    {developer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Test Engineers */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="testEngineers"
              className="block w-1/3 text-sm font-medium leading-6 text-gray-900"
            >
              <FaUsers className="text-blue-500 mr-2 inline-block" /> Test
              Engineers
            </label>
            <div className="w-2/3">
              <select
                id="testEngineers"
                name="testEngineers"
                multiple
                value={formData.testEngineers}
                onChange={handleDropdownChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {testEngineers.map((testEngineer) => (
                  <option key={testEngineer._id} value={testEngineer._id}>
                    {testEngineer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errors.submit && <div className="text-red-600">{errors.submit}</div>}
          {successMessage && (
            <div className="text-green-600">{successMessage}</div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
