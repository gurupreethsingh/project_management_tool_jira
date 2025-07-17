import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaProjectDiagram,
  FaTrashAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AllAssignedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState(""); // Add the missing state for searchTerm
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(10);

  useEffect(() => {
    fetchAssignedProjects();
  }, [searchTerm, currentPage, view]);

  const fetchAssignedProjects = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).id; // Fetch userId from localStorage
    try {
      const response = await axios.get(
        `http://localhost:5000/user-assigned-projects/${userId}?search=${searchTerm}`
      );
      setProjects(response.data.assignedProjects); // Ensure you are receiving the assigned projects list
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
    setCurrentPage(1); // Reset to the first page when changing views
    if (viewType === "grid") {
      setProjectsPerPage(10); // 5 per row, 2 rows
    } else if (viewType === "card") {
      setProjectsPerPage(8); // 4 per row, 2 rows
    } else {
      setProjectsPerPage(5); // Default for list view
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update the search term based on input
  };

  // Pagination Logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderProjects = () => {
    if (view === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 shadow-lg rounded-lg flex flex-col items-center relative"
            >
              <FaProjectDiagram className="text-4xl text-blue-500 mb-2" />
              <h3 className="text-xs font-semibold text-gray-600">
                {project.project_name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 text-center">
                {project.description}
              </p>
              <Link
                to={`/single-project/${project._id}`}
                className="mt-2 text-xs text-indigo-600"
              >
                View Project Details
              </Link>
            </div>
          ))}
        </div>
      );
    } else if (view === "card") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center relative"
            >
              <FaProjectDiagram className="text-5xl text-green-500 mb-2" />
              <h3 className="text-xs font-bold text-gray-600">
                {project.project_name}
              </h3>
              <p className="text-xs text-gray-400 mt-2 text-center">
                {project.description}
              </p>
              <Link
                to={`/single-project/${project._id}`}
                className="mt-2 text-xs text-indigo-600"
              >
                View Project Details
              </Link>
            </div>
          ))}
        </div>
      );
    } else if (view === "list") {
      return (
        <div className="space-y-4">
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 shadow-lg rounded-lg flex justify-between items-center relative"
            >
              <div className="flex items-center">
                <FaProjectDiagram className="text-3xl text-purple-500 mr-4" />
                <h3 className="text-xs font-semibold text-gray-600">
                  {project.project_name}
                </h3>
              </div>
              <p className="text-xs text-gray-400">{project.description}</p>
              <Link
                to={`/single-project/${project._id}`}
                className="text-xs text-indigo-600"
              >
                View Project Details
              </Link>
            </div>
          ))}
        </div>
      );
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(projects.length / projectsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="mt-8 flex justify-center">
        <ul className="inline-flex space-x-2">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-lg text-white bg-indigo-500 hover:bg-indigo-700 ${
                  number === currentPage ? "bg-indigo-700" : ""
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* All Assigned Projects title */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <h3 className="text-2xl font-bold text-start text-indigo-600">
            All Assigned Projects
          </h3>

          <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Search Projects"
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 border border-gray-300 rounded-lg w-full md:w-auto"
            />

            <div className="flex space-x-4 justify-center md:justify-start">
              <FaThList
                className={`text-xl cursor-pointer ${
                  view === "list" ? "text-indigo-600" : "text-gray-600"
                }`}
                onClick={() => handleViewChange("list")}
              />
              <FaThLarge
                className={`text-xl cursor-pointer ${
                  view === "card" ? "text-indigo-600" : "text-gray-600"
                }`}
                onClick={() => handleViewChange("card")}
              />
              <FaTh
                className={`text-xl cursor-pointer ${
                  view === "grid" ? "text-indigo-600" : "text-gray-600"
                }`}
                onClick={() => handleViewChange("grid")}
              />
            </div>
          </div>
        </div>

        {/* Render Projects */}
        {renderProjects()}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default AllAssignedProjects;
