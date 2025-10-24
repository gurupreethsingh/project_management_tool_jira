import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch, FaEye } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

export default function AllDefects() {
  const { projectId } = useParams();

  // auth (optional; matches your other pages)
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  const [defects, setDefects] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDefects, setFilteredDefects] = useState([]);

  // Priority counts: low, medium, high
  const [priorityCounts, setPriorityCounts] = useState({
    low: 0,
    medium: 0,
    high: 0,
  });

  // Severity counts: minor, major, critical, blocker
  const [severityCounts, setSeverityCounts] = useState({
    minor: 0,
    major: 0,
    critical: 0,
    blocker: 0,
  });

  // Status counts: Open/New, Assigned, In-progress, Fixed, Re-opened, Closed
  const [statusCounts, setStatusCounts] = useState({
    openNew: 0,
    assigned: 0,
    inProgress: 0,
    fixed: 0,
    reopened: 0,
    closed: 0,
  });

  const colors = {
    low: "bg-teal-200 text-teal-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-200 text-red-800",
  };

  const severityColors = {
    minor: "bg-purple-200 text-purple-800",
    major: "bg-orange-200 text-orange-800",
    critical: "bg-red-300 text-red-800",
    blocker: "bg-gray-400 text-gray-800",
  };

  const statusColors = {
    "Open/New": "bg-red-200 text-red-800",
    Assigned: "bg-yellow-200 text-yellow-800",
    "In-progress": "bg-blue-200 text-blue-800",
    Fixed: "bg-green-200 text-green-800",
    "Re-opened": "bg-purple-200 text-purple-800",
    Closed: "bg-gray-300 text-gray-800",
  };

  // Fetch defects data
  useEffect(() => {
    const fetchDefects = async () => {
      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/all-defects`,
          { headers: authHeader }
        );
        const defectsData = response.data || [];
        setDefects(defectsData);
        setFilteredDefects(defectsData);

        // Initialize counts
        const _priorityCounts = { low: 0, medium: 0, high: 0 };
        const _severityCounts = { minor: 0, major: 0, critical: 0, blocker: 0 };
        const _statusCounts = {
          openNew: 0,
          assigned: 0,
          inProgress: 0,
          fixed: 0,
          reopened: 0,
          closed: 0,
        };

        // Calculate counts
        defectsData.forEach((defect) => {
          const priority = (defect.priority || "").toLowerCase();
          if (priority in _priorityCounts) _priorityCounts[priority]++;

          const severity = (defect.severity || "").toLowerCase();
          if (severity in _severityCounts) _severityCounts[severity]++;

          switch (defect.status) {
            case "Open/New":
              _statusCounts.openNew++;
              break;
            case "Assigned":
              _statusCounts.assigned++;
              break;
            case "In-progress":
              _statusCounts.inProgress++;
              break;
            case "Fixed":
              _statusCounts.fixed++;
              break;
            case "Re-opened":
              _statusCounts.reopened++;
              break;
            case "Closed":
              _statusCounts.closed++;
              break;
            default:
              break;
          }
        });

        setPriorityCounts(_priorityCounts);
        setSeverityCounts(_severityCounts);
        setStatusCounts(_statusCounts);
      } catch (error) {
        console.error("Error fetching defects:", error);
      }
    };
    fetchDefects();
  }, [projectId, authHeader]);

  // Filter by priority
  const filterDefects = (priority) => {
    if (priority === "all") {
      setFilteredDefects(defects);
    } else {
      setFilteredDefects(
        defects.filter(
          (defect) => (defect.priority || "").toLowerCase() === priority
        )
      );
    }
  };

  // Filter by severity
  const filterBySeverity = (severity) => {
    if (severity === "all") {
      setFilteredDefects(defects);
    } else {
      setFilteredDefects(
        defects.filter(
          (defect) => (defect.severity || "").toLowerCase() === severity
        )
      );
    }
  };

  // Filter by status
  const filterByStatus = (status) => {
    if (status === "all") {
      setFilteredDefects(defects);
    } else {
      setFilteredDefects(defects.filter((defect) => defect.status === status));
    }
  };

  // Combine search with current dataset
  useEffect(() => {
    let filtered = defects;

    if (searchQuery) {
      filtered = filtered.filter((defect) =>
        [defect.test_case_name, defect.module_name, defect.status]
          .filter(Boolean)
          .map((field) => field.toLowerCase())
          .some((field) => field.includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredDefects(filtered);
  }, [searchQuery, defects]);

  const getStatusColor = (status) =>
    statusColors[status] || "bg-gray-100 text-gray-800";

  const getImageUrl = (bugImage) => {
    if (bugImage) {
      const normalizedPath = bugImage
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `${globalBackendRoute}/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <h2 className="font-medium tracking-tight text-gray-700">
              All Project Defects ({defects.length} total)
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center space-x-2">
            <FaThList
              className={`text-sm cursor-pointer ${
                view === "list" ? "text-indigo-500" : "text-gray-500"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-sm cursor-pointer ${
                view === "card" ? "text-indigo-500" : "text-gray-500"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-sm cursor-pointer ${
                view === "grid" ? "text-indigo-500" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
            />

            <div className="relative">
              <FaSearch className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                className="pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Search defects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <Link
                to={`/single-project/${projectId}`}
                className=" btn btn-sm bg-indigo-600 hover:bg-indigo-800 font-semibold text-white"
              >
                Project Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center items-center mt-3 space-x-2">
          <button
            onClick={() => filterDefects("low")}
            className={`text-xs px-2 py-1 rounded ${colors.low}`}
          >
            Low ({priorityCounts.low})
          </button>
          <button
            onClick={() => filterDefects("medium")}
            className={`text-xs px-2 py-1 rounded ${colors.medium}`}
          >
            Medium ({priorityCounts.medium})
          </button>
          <button
            onClick={() => filterDefects("high")}
            className={`text-xs px-2 py-1 rounded ${colors.high}`}
          >
            High ({priorityCounts.high})
          </button>

          <button
            onClick={() => filterBySeverity("minor")}
            className={`text-xs px-2 py-1 rounded ${severityColors.minor}`}
          >
            Minor ({severityCounts.minor})
          </button>
          <button
            onClick={() => filterBySeverity("major")}
            className={`text-xs px-2 py-1 rounded ${severityColors.major}`}
          >
            Major ({severityCounts.major})
          </button>
          <button
            onClick={() => filterBySeverity("critical")}
            className={`text-xs px-2 py-1 rounded ${severityColors.critical}`}
          >
            Critical ({severityCounts.critical})
          </button>
          <button
            onClick={() => filterBySeverity("blocker")}
            className={`text-xs px-2 py-1 rounded ${severityColors.blocker}`}
          >
            Blocker ({severityCounts.blocker})
          </button>

          <button
            onClick={() => filterByStatus("Open/New")}
            className={`text-xs px-2 py-1 rounded ${statusColors["Open/New"]}`}
          >
            Open/New ({statusCounts.openNew})
          </button>
          <button
            onClick={() => filterByStatus("Assigned")}
            className={`text-xs px-2 py-1 rounded ${statusColors.Assigned}`}
          >
            Assigned ({statusCounts.assigned})
          </button>
          <button
            onClick={() => filterByStatus("In-progress")}
            className={`text-xs px-2 py-1 rounded ${statusColors["In-progress"]}`}
          >
            In-progress ({statusCounts.inProgress})
          </button>
          <button
            onClick={() => filterByStatus("Fixed")}
            className={`text-xs px-2 py-1 rounded ${statusColors.Fixed}`}
          >
            Fixed ({statusCounts.fixed})
          </button>
          <button
            onClick={() => filterByStatus("Re-opened")}
            className={`text-xs px-2 py-1 rounded ${statusColors["Re-opened"]}`}
          >
            Re-opened ({statusCounts.reopened})
          </button>
          <button
            onClick={() => filterByStatus("Closed")}
            className={`text-xs px-2 py-1 rounded ${statusColors.Closed}`}
          >
            Closed ({statusCounts.closed})
          </button>

          <button
            onClick={() => filterByStatus("all")}
            className="text-xs px-2 py-1 rounded bg-gray-200"
          >
            All
          </button>
        </div>

        {/* Defects Display */}
        <div className="mt-6">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredDefects
                .filter((defect) =>
                  [defect.test_case_name, defect.module_name, defect.status]
                    .filter(Boolean)
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((defect) => (
                  <Link
                    to={`/single-project/${projectId}/defect/${defect._id}`}
                    key={defect._id}
                    className="flex flex-col items-start relative"
                  >
                    <img
                      src={getImageUrl(defect.bug_picture)}
                      alt={defect.test_case_name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <h3 className="mt-2 text-xs font-medium text-gray-800 text-left">
                      {defect.test_case_name}
                    </h3>
                    <p className="text-xs text-gray-600 text-left">
                      Module: {defect.module_name}
                    </p>
                    <p
                      className={`text-xs p-1 rounded ${getStatusColor(
                        defect.status
                      )}`}
                    >
                      Status: {defect.status}
                    </p>
                  </Link>
                ))}
            </div>
          )}

          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDefects
                .filter((defect) =>
                  [defect.test_case_name, defect.module_name, defect.status]
                    .filter(Boolean)
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((defect) => (
                  <Link
                    to={`/single-project/${projectId}/defect/${defect._id}`}
                    key={defect._id}
                    className="flex flex-col items-start bg-white rounded-lg shadow"
                  >
                    <img
                      src={getImageUrl(defect.bug_picture)}
                      alt={defect.test_case_name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <h3 className="mt-2 text-sm font-medium text-gray-800 text-left">
                      {defect.test_case_name}
                    </h3>
                    <p className="text-xs text-gray-600 text-left">
                      Module: {defect.module_name}
                    </p>
                    <p
                      className={`text-xs p-1 rounded ${getStatusColor(
                        defect.status
                      )}`}
                    >
                      Status: {defect.status}
                    </p>
                  </Link>
                ))}
            </div>
          )}

          {view === "list" && (
            <div className="mt-10 space-y-6">
              {filteredDefects
                .filter((defect) =>
                  [defect.test_case_name, defect.module_name, defect.status]
                    .filter(Boolean)
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((defect) => (
                  <div
                    key={defect._id}
                    className="flex items-center justify-between bg-white rounded-lg shadow relative p-4"
                  >
                    <div className="flex flex-1 space-x-4">
                      <div className="w-16 h-16">
                        <img
                          src={getImageUrl(defect.bug_picture)}
                          alt={defect.test_case_name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                        <span className="text-sm font-semibold text-gray-600">
                          Test Case Name
                        </span>
                        <span className="text-sm text-gray-900">
                          {defect.test_case_name}
                        </span>
                      </div>

                      <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                        <span className="text-sm font-semibold text-gray-600">
                          Test Case Number
                        </span>
                        <span className="text-sm text-gray-900">
                          {defect.test_case_number}
                        </span>
                      </div>

                      <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                        <span className="text-sm font-semibold text-gray-600">
                          Module
                        </span>
                        <span className="text-sm text-gray-900">
                          {defect.module_name}
                        </span>
                      </div>

                      <div className="flex flex-col w-2/12 border-r pr-2 border-gray-300">
                        <span className="text-sm font-semibold text-gray-600">
                          Status
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            defect.status === "Closed"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {defect.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-4 items-center w-2/12">
                      <Link
                        to={`/single-project/${projectId}/defect/${defect._id}`}
                        className="text-blue-400 hover:text-blue-500 text-sm"
                      >
                        <FaEye className="text-lg" />
                      </Link>

                      <Link
                        to={`/bug-history/${defect._id}`}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        <span className="inline-flex items-center">
                          <FaThList className="mr-2" />
                          Bug History
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
