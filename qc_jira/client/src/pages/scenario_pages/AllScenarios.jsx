import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  FaSort,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

export default function AllScenarios() {
  const { projectId } = useParams();
  const [scenarios, setScenarios] = useState([]);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [filteredScenarioCount, setFilteredScenarioCount] = useState(0);

  // Module filter
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/single-project/${projectId}/view-all-scenarios`
        );
        const data = response.data || [];
        setScenarios(data);
        setTotalScenarios(data.length);
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      }
    };
    fetchScenarios();
  }, [projectId]);

  // Debounce search for snappier typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const norm = (v) => (v ?? "").toString().toLowerCase();

  // Build module chips (+ counts) from current dataset
  const modules = useMemo(() => {
    const counts = new Map(); // id -> { _id, name, count }
    for (const s of scenarios) {
      const id = s?.module?._id || "__unassigned__";
      const name = s?.module?.name || "Unassigned";
      if (!counts.has(id)) counts.set(id, { _id: id, name, count: 0 });
      counts.get(id).count += 1;
    }
    return Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [scenarios]);

  // Filter (search + module)
  const filtered = useMemo(() => {
    const q = norm(debouncedQuery);
    return scenarios.filter((scenario) => {
      if (selectedModuleId) {
        const mId = scenario?.module?._id || "__unassigned__";
        if (mId !== selectedModuleId) return false;
      }
      const fields = [
        norm(scenario.scenario_text),
        norm(scenario.scenario_number),
        norm(scenario?.createdBy?.name),
        norm(scenario?.project?.project_name),
        norm(scenario?.module?.name || "Unassigned"),
      ];
      return q ? fields.some((f) => f.includes(q)) : true;
    });
  }, [scenarios, debouncedQuery, selectedModuleId]);

  // Keep filtered count and total pages in sync
  useEffect(() => {
    setFilteredScenarioCount(filtered.length);
    const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(p, pages));
  }, [filtered, itemsPerPage]);

  const handleSort = () => {
    const sorted = [...scenarios].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setScenarios(sorted);
    setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
  };

  // Pagination slice after filtering
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const handleDelete = async (scenarioId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scenario? This will delete all its history as well."
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      alert("Scenario deleted successfully.");
      const updated = scenarios.filter((s) => s._id !== scenarioId);
      setScenarios(updated);
      setTotalScenarios(updated.length);
    } catch (error) {
      console.error("Error deleting scenario:", error);
      alert("Error deleting scenario");
    }
  };

  const onModuleClick = (id) => {
    setSelectedModuleId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };

  const clearModuleSelection = () => {
    setSelectedModuleId(null);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header / Controls */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              All Scenarios for Project: {projectId}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Total Scenarios: {totalScenarios}
            </p>
            {(searchQuery || selectedModuleId) && (
              <p className="text-xs text-gray-600">
                Showing {filteredScenarioCount} result(s)
                {searchQuery ? <> for “{searchQuery}”</> : null}
                {selectedModuleId ? " in selected module" : null}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <FaThList
              className={`text-lg cursor-pointer ${view === "list" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-lg cursor-pointer ${view === "card" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setView("card")}
              title="Card view"
            />
            <FaTh
              className={`text-lg cursor-pointer ${view === "grid" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setView("grid")}
              title="Grid view"
            />

            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={handleSort}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm inline-flex items-center"
            >
              <FaSort className="mr-1" />
              Sort ({sortOrder === "asc" ? "Oldest" : "Newest"})
            </button>

            <a
              href={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              Project Dashboard
            </a>
          </div>
        </div>

        {/* Module chips row */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700">Filter by Module</h3>
            <button
              onClick={clearModuleSelection}
              className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
            >
              Clear
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {modules.map((m) => {
              const active = selectedModuleId === m._id;
              return (
                <button
                  key={m._id}
                  onClick={() => onModuleClick(m._id)}
                  className={[
                    "whitespace-nowrap px-3 py-1 rounded-full border text-[12px]",
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                  ].join(" ")}
                  title={`${m.name} (${m.count})`}
                >
                  {m.name} <span className="opacity-70 ml-1">({m.count})</span>
                </button>
              );
            })}
            {modules.length === 0 && (
              <span className="text-slate-500 text-sm">No modules found</span>
            )}
          </div>
        </div>

        {/* List View (compact, single global header) */}
        {view === "list" && (
          <div className="mt-5">
            {/* global header */}
            <div className="grid grid-cols-[56px,120px,1fr,160px,160px,140px,40px,40px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
              <div>#</div>
              <div>Scenario</div>
              <div>Text</div>
              <div>Module</div>
              <div>Project</div>
              <div>Created By</div>
              <div className="text-center">View</div>
              <div className="text-center">Del</div>
            </div>

            {/* rows */}
            <div className="divide-y divide-slate-200">
              {current.map((s, idx) => (
                <div
                  key={s._id}
                  className="grid grid-cols-[56px,120px,1fr,160px,160px,140px,40px,40px] items-center text-[12px] px-3 py-2"
                >
                  <div className="text-slate-700">{indexOfFirst + idx + 1}</div>

                  <div className="text-slate-900 font-medium truncate">
                    {s.scenario_number}
                  </div>

                  <div className="text-slate-700 line-clamp-2">
                    {s.scenario_text}
                  </div>

                  <div className="truncate">
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {s?.module?.name || "Unassigned"}
                    </span>
                  </div>

                  <div className="text-slate-700 truncate">
                    {s?.project?.project_name}
                  </div>

                  <div className="text-indigo-700 font-semibold truncate">
                    {s?.createdBy?.name}
                  </div>

                  {/* View column */}
                  <div className="flex justify-center">
                    <Link
                      to={`/single-project/${projectId}/scenario-history/${s._id}`}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="View"
                    >
                      <FaEye className="text-sm" />
                    </Link>
                  </div>

                  {/* Delete column */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-rose-600 hover:text-rose-800"
                      title="Delete"
                    >
                      <FaTrashAlt className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid View */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-8">
            {current.map((s) => (
              <div key={s._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>Scenario: {s.scenario_number}</span>
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {s?.module?.name || "Unassigned"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
                    {s.scenario_text}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/single-project/${projectId}/scenario-history/${s._id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-rose-500 hover:text-rose-700 text-sm"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {current.map((s) => (
              <div key={s._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>Scenario: {s.scenario_number}</span>
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {s?.module?.name || "Unassigned"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 break-words whitespace-normal mt-1">
                    {s.scenario_text}
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Link
                    to={`/single-project/${projectId}/scenario-history/${s._id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-rose-500 hover:text-rose-700 text-sm"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
