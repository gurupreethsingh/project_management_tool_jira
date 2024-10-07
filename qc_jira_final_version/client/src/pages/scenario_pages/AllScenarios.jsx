import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // To get the project ID from URL
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaEye,
  FaTrashAlt,
  FaArrowLeft,
  FaArrowRight,
  FaSort, // Icon for sorting
} from "react-icons/fa";

export default function AllScenarios() {
  const { projectId } = useParams(); // Get project projectId from URL
  const [scenarios, setScenarios] = useState([]); // State to hold fetched scenarios
  const [view, setView] = useState("list"); // Set list view as default
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc"); // State for sort order
  const [totalScenarios, setTotalScenarios] = useState(0); // Total count of all scenarios
  const [filteredScenarioCount, setFilteredScenarioCount] = useState(0); // Filtered count of scenarios based on search

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/single-project/${projectId}/view-all-scenarios` // Backend route to fetch scenarios based on the project
        );
        setScenarios(response.data);
        setTotalScenarios(response.data.length); // Set total scenarios count
        setFilteredScenarioCount(response.data.length); // Initially, set filtered count as total count
        setTotalPages(Math.ceil(response.data.length / itemsPerPage)); // Set total pages
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      }
    };

    fetchScenarios();
  }, [projectId, itemsPerPage]);

  // Handle search logic across multiple fields including user names and project names
  const filteredScenarios = scenarios.filter((scenario) =>
    [
      scenario.scenario_text,
      scenario.scenario_number,
      scenario.createdBy.name,
      scenario.project.project_name,
    ]
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    setFilteredScenarioCount(filteredScenarios.length); // Update filtered count whenever search changes
  }, [searchQuery, filteredScenarios]);

  // Handle sorting scenarios by creation date
  const handleSort = () => {
    const sortedScenarios = [...scenarios].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setScenarios(sortedScenarios);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentScenarios = filteredScenarios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle delete scenario functionality
  const handleDelete = async (scenarioId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scenario? This will delete all its history as well."
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token"); // Get the JWT token from localStorage

    try {
      await axios.delete(
        `http://localhost:5000/single-project/scenario/${scenarioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      alert("Scenario deleted successfully.");
      // Refresh scenarios after deletion
      const updatedScenarios = scenarios.filter(
        (scenario) => scenario._id !== scenarioId
      );
      setScenarios(updatedScenarios);
      setFilteredScenarioCount(updatedScenarios.length); // Update filtered count after deletion
    } catch (error) {
      console.error("Error deleting scenario:", error);
      alert("Error deleting scenario");
    }
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left font-semibold tracking-tight text-indigo-600 sm:text-1xl">
              All Scenarios for Project : {projectId}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Total Scenarios: {totalScenarios}{" "}
              {/* Display total scenario count */}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                Showing {filteredScenarioCount} result(s) for "{searchQuery}"
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4 flex-wrap">
            <FaThList
              className={`text-xl cursor-pointer ${view === "list" ? "text-blue-400" : "text-gray-500"
                }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${view === "card" ? "text-blue-400" : "text-gray-500"
                }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${view === "grid" ? "text-blue-400" : "text-gray-500"
                }`}
              onClick={() => setView("grid")}
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </div>
            <button
              onClick={handleSort}
              className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-900 flex items-center btn btn-sm"
            >
              <FaSort className="mr-2" />
              Sort ({sortOrder === "asc" ? "Oldest" : "Newest"})
            </button>

            <a href={`/single-project/${projectId}`}
              className="btn btn-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-900"
            >Project Dashboard
            </a>
          </div>
        </div>

        {/* List View */}
        {view === "list" && (
          <div className="mt-10 space-y-6">
            {currentScenarios.map((scenario, index) => (
              <div
                key={scenario._id}
                className="flex items-center justify-between bg-white rounded-lg shadow relative p-4"
              >
                <div className="flex flex-1 space-x-4">
                  {/* Serial Number Column */}
                  <div className="flex flex-col w-1/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Serial Number
                    </span>
                    <span className="text-sm text-gray-900">
                      {indexOfFirstItem + index + 1}
                    </span>
                  </div>

                  {/* Scenario Number Column */}
                  <div className="flex flex-col w-1/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Scenario Number
                    </span>
                    <span className="text-sm text-gray-900">
                      {scenario.scenario_number}
                    </span>
                  </div>

                  {/* Scenario Text Column (Taking the most space) */}
                  <div className="flex flex-col w-6/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Scenario Text
                    </span>
                    <span className="text-sm text-gray-600 break-words">
                      {scenario.scenario_text}
                    </span>
                  </div>

                  {/* Project Column */}
                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Project
                    </span>
                    <span className="text-sm text-gray-600">
                      {scenario.project.project_name}
                    </span>
                  </div>

                  {/* Created By Column */}
                  <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                    <span className="text-sm font-semibold text-gray-600">
                      Created By
                    </span>
                    <span className="text-sm text-indigo-600 font-bold">
                      {scenario.createdBy.name}
                    </span>
                  </div>
                </div>

                {/* Icons for View and Delete */}
                <div className="flex space-x-4 items-center w-1/12">
                  <Link
                    to={`/single-project/${projectId}/scenario-history/${scenario._id}`}
                    className="text-blue-400 hover:text-blue-500 text-sm"
                  >
                    <FaEye className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDelete(scenario._id)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    <FaTrashAlt className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}




        {/* Grid View */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-10">
            {currentScenarios.map((scenario, index) => (
              <div
                key={scenario._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Scenario Number: {scenario.scenario_number}
                  </div>
                  <div className="text-sm text-gray-600 break-words whitespace-normal">
                    {scenario.scenario_text}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/single-project/${projectId}/scenario-history/${scenario._id}`}
                    className="text-blue-400 hover:text-blue-500 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(scenario._id)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Card View */}
        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {currentScenarios.map((scenario, index) => (
              <div
                key={scenario._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    Scenario Number: {scenario.scenario_number}
                  </div>
                  <div className="text-sm text-gray-600 break-words whitespace-normal">
                    {scenario.scenario_text}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/single-project/${projectId}/scenario-history/${scenario._id}`}
                    className="text-blue-400 hover:text-blue-500 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(scenario._id)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-10">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaArrowRight className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
