import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
} from "react-icons/fa";

const ViewAllTasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskState, setTaskState] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cardsPerPage] = useState(5); // Show 5 cards in the list view
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("user"))?.role;
    setUserRole(role);
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/single-project/${projectId}/view-all-tasks`
      );
      const fetchedTasks = response.data.tasks;
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
      setTotalPages(Math.ceil(fetchedTasks.length / cardsPerPage));
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  // Search and filter functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    const filtered = tasks.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(searchQuery);
      const descriptionMatch = task.description
        .toLowerCase()
        .includes(searchQuery);
      const priorityMatch = task.priority.toLowerCase().includes(searchQuery);
      const statusMatch = task.status.toLowerCase().includes(searchQuery);

      const startDateMatch = task.startDate
        ? moment(task.startDate).format("DD/MM/YYYY").includes(searchQuery)
        : false;
      const deadlineMatch = task.deadline
        ? moment(task.deadline).format("DD/MM/YYYY").includes(searchQuery)
        : false;

      const assignedUsersMatch = task.assignedUsers.some((user) =>
        user.name.toLowerCase().includes(searchQuery)
      );

      return (
        titleMatch ||
        descriptionMatch ||
        priorityMatch ||
        statusMatch ||
        startDateMatch ||
        deadlineMatch ||
        assignedUsersMatch
      );
    });

    setFilteredTasks(filtered);
    setTotalPages(Math.ceil(filtered.length / cardsPerPage));
  };

  // Sorting functionality
  const sortTasks = () => {
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });
    setFilteredTasks(sortedTasks);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // Pagination controls
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleTaskUpdate = async (taskId, field, value) => {
    const updatedTask = { ...taskState[taskId], [field]: value };

    // Get the userId from localStorage (ensure the logged-in user's data is stored in localStorage)
    const userId = JSON.parse(localStorage.getItem("user"))?.id;

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    setTaskState((prevState) => ({ ...prevState, [taskId]: updatedTask }));

    let data = { status: updatedTask.status, role: userRole, userId }; // Include userId in the data payload

    if (["admin", "superadmin", "qa_lead"].includes(userRole)) {
      data.deadline = updatedTask.deadline;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${taskId}/update`,
        data
      );
      alert(response.data.message);

      // Optionally reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error.message);
      alert(
        "Failed to update task: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 rounded text-center";
      case "re-assigned":
        return "bg-orange-500 rounded text-center text-white";
      case "in-progress":
        return "bg-orange-100 rounded  text-center";
      case "finished":
        return "bg-green-100 rounded  text-center";
      case "closed":
        return "bg-gray-300 rounded  text-center";
      case "pending":
        return "bg-red-500 rounded text-white  text-center";
      default:
        return "";
    }
  };

  const formatDateForInput = (date) => {
    return date ? moment(date).format("YYYY-MM-DD") : "";
  };

  const renderStatusOptions = (currentStatus, userRole) => {
    const allOptions = {
      superadmin: [
        "re-assigned",
        "in-progress",
        "finished",
        "closed",
        "pending",
      ],
      developer: ["in-progress", "finished"],
      test_engineer: ["in-progress", "finished"],
    };

    if (currentStatus === "closed") {
      return <option value="closed">Closed</option>;
    }

    const roleOptions =
      userRole === "superadmin" ||
      userRole === "admin" ||
      userRole === "project_manager" ||
      userRole === "qa_lead"
        ? allOptions.superadmin
        : allOptions[userRole] || [];

    const filteredOptions = roleOptions.filter(
      (option) => option !== currentStatus
    );

    return filteredOptions.map((status) => (
      <option key={status} value={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </option>
    ));
  };
  0;

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left font-semibold tracking-tight text-indigo-600 sm:text-1xl">
              All Tasks for Project: {projectId}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Total Tasks: {tasks.length}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                Showing {filteredTasks.length} result(s) for "{searchQuery}"
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4 flex-wrap">
            {sortOrder === "desc" ? (
              <FaSortAmountDownAlt
                className="text-xl cursor-pointer text-gray-500"
                onClick={sortTasks}
                title="Sort by latest"
              />
            ) : (
              <FaSortAmountUpAlt
                className="text-xl cursor-pointer text-gray-500"
                onClick={sortTasks}
                title="Sort by oldest"
              />
            )}
            <FaThList
              className={`text-xl cursor-pointer ${
                viewMode === "list" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setViewMode("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                viewMode === "card" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setViewMode("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                viewMode === "grid" ? "text-blue-400" : "text-gray-500"
              }`}
              onClick={() => setViewMode("grid")}
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div>
              <Link
                to={`/single-project/${projectId}`}
                className="bg-indigo-700 text-white px-3 py-2 rounded-md hover:bg-indigo-900"
              >
                Project Dashboard
              </Link>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="mt-10 space-y-6">
            {filteredTasks
              .slice(
                (currentPage - 1) * cardsPerPage,
                currentPage * cardsPerPage
              )
              .map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-lg shadow p-4"
                >
                  <div className="flex flex-1 space-x-4">
                    <div className="flex flex-col w-2/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Title
                      </span>
                      <span className="text-sm text-gray-900">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex flex-col w-3/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Description
                      </span>
                      <span className="text-sm text-gray-900">
                        {task.description}
                      </span>
                    </div>
                    <div className="flex flex-col w-2/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Priority
                      </span>
                      <span className="text-sm text-gray-900">
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex flex-col w-2/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600 text-center">
                        Status
                      </span>
                      <span
                        className={`text-sm font-bold ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div className="flex flex-col w-2/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Start Date
                      </span>
                      <span className="text-sm text-gray-900">
                        {task.startDate
                          ? moment(task.startDate).format("DD/MM/YYYY")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col w-2/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        End Date
                      </span>
                      <span className="text-sm text-gray-900">
                        {task.deadline
                          ? moment(task.deadline).format("DD/MM/YYYY")
                          : "No deadline"}
                      </span>
                    </div>
                    <div className="flex flex-col w-2/12 border-r pr-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Assigned Users
                      </span>
                      <div>
                        {task.assignedUsers.map((user) => (
                          <span key={user._id}>{user.name} </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col w-2/12">
                      <span className="text-sm font-semibold text-gray-600">
                        Update Deadline
                      </span>
                      <input
                        type="date"
                        value={formatDateForInput(
                          taskState[task._id]?.deadline || task.deadline || ""
                        )}
                        onChange={(e) =>
                          handleTaskUpdate(task._id, "deadline", e.target.value)
                        }
                        className="border border-gray-300 p-2 rounded"
                      />
                    </div>
                    <div className="flex flex-col w-1/12">
                      <select
                        value={""}
                        onChange={(e) =>
                          handleTaskUpdate(task._id, "status", e.target.value)
                        }
                        className="bg-white border border-gray-300 px-2 py-1 rounded-lg"
                        disabled={task.status === "closed"}
                      >
                        <option value="" disabled hidden>
                          Change status
                        </option>
                        {renderStatusOptions(task.status, userRole)}
                      </select>
                    </div>
                    <div>
                      <Link
                        to={`/single-project/${projectId}/single-task/${task._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        History
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div>{/* Add grid or card view rendering if necessary */}</div>
        )}

        <div className="flex justify-center items-center space-x-2 mt-10">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            <FaArrowRight className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllTasks;
