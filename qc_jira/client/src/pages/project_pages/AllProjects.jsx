// src/pages/project_pages/AllProjects.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaProjectDiagram,
  FaTrashAlt,
  FaSearch,
  FaDownload,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";
import globalBackendRoute from "../../config/Config";

/* ---------- Search utils ---------- */
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "please",
  "pls",
  "plz",
  "show",
  "find",
  "search",
  "look",
  "list",
  "project",
  "projects",
  "named",
  "called",
]);

const norm = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const tokenize = (raw) => {
  const t = String(raw || "").trim();
  if (!t) return [];
  return t
    .split(/\s+/)
    .map(norm)
    .filter(Boolean)
    .filter((x) => !STOP_WORDS.has(x));
};

/* ---------- JWT role helper ---------- */
function extractRoleFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const d = jwtDecode(token);

    const candidates = [
      d?.role,
      d?.user?.role,
      d?.data?.role,
      Array.isArray(d?.roles) ? d.roles[0] : undefined,
      Array.isArray(d?.authorities) ? d.authorities[0] : undefined,
      d?.claims?.role,
    ]
      .filter(Boolean)
      .map((r) => String(r).toLowerCase());

    const clean = (r) =>
      r
        .replace(/^role[_-]/, "")
        .replace(/^roles?[_-]/, "")
        .trim();

    for (const r of candidates) {
      const c = clean(r);
      if (c) return c;
    }
    return "";
  } catch {
    return "";
  }
}

const AllProjects = () => {
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(15); // 0 === All

  useEffect(() => {
    setRole(extractRoleFromToken());
  }, []);

  const canExport = ["superadmin", "admin", "project_manager"].includes(role);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${globalBackendRoute}/api/all-projects`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const all = Array.isArray(res.data?.projects)
          ? res.data.projects
          : Array.isArray(res.data)
          ? res.data
          : [];
        setProjects(all);
      } catch (e) {
        console.error("Error fetching projects:", e);
        setProjects([]);
      }
    })();
  }, []);

  const filteredProjects = useMemo(() => {
    const tokens = tokenize(searchTerm);
    if (!tokens.length) return projects;
    return projects.filter((p) => {
      const hay = norm(
        [
          p?.project_name || "",
          p?.description || "",
          p?.status || "",
          p?.owner?.name || "",
          p?.owner?.email || "",
          (Array.isArray(p?.tags) ? p.tags.join(" ") : "") || "",
        ].join(" ")
      );
      return tokens.some((t) => hay.includes(t));
    });
  }, [projects, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, view, projectsPerPage]);

  const handleViewChange = (v) => setView(v);

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${globalBackendRoute}/api/delete-project/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      alert("Project deleted.");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      console.error("Delete error:", e);
      alert("Failed to delete project.");
    }
  };

  // Pagination
  const total = filteredProjects.length;
  const perPage = projectsPerPage === 0 ? total : projectsPerPage;
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, perPage)));
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentProjects =
    projectsPerPage === 0
      ? filteredProjects
      : filteredProjects.slice(indexOfFirst, indexOfLast);

  const paginate = (page) => setCurrentPage(page);

  // ----------- EXPORTS -----------
  const buildClientTable = () =>
    filteredProjects.map((p) => ({
      ID: p._id,
      Name: p.project_name || "",
      Description: (p.description || "").replace(/\n/g, " "),
      Domain: p.domain || "",
      StartDate: p.startDate
        ? new Date(p.startDate).toISOString().slice(0, 10)
        : "",
      EndDate: p.endDate ? new Date(p.endDate).toISOString().slice(0, 10) : "",
      Deadline: p.deadline
        ? new Date(p.deadline).toISOString().slice(0, 10)
        : "",
      CreatedBy: p.createdBy?.name || "",
      CreatedAt: p.createdAt
        ? new Date(p.createdAt).toISOString().replace("T", " ").slice(0, 16)
        : "",
      UpdatedAt: p.updatedAt
        ? new Date(p.updatedAt).toISOString().replace("T", " ").slice(0, 16)
        : "",
    }));

  const exportCSV = () => {
    const data = buildClientTable();
    if (!data.length) return alert("Nothing to export.");
    const header = Object.keys(data[0]).join(",");
    const body = data
      .map((row) =>
        Object.values(row)
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + "\n" + body], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projects_${new Date()
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 12)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    try {
      const data = buildClientTable();
      if (!data.length) return alert("Nothing to export.");
      const ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Projects");
      ws["!cols"] = [
        { wch: 24 },
        { wch: 28 },
        { wch: 60 },
        { wch: 16 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 22 },
        { wch: 20 },
        { wch: 20 },
      ];
      const filename = `projects_${new Date()
        .toISOString()
        .replace(/[-:T]/g, "")
        .slice(0, 12)}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (e) {
      console.error("Client XLSX export failed:", e);
      alert(`Client XLSX export failed: ${e?.message || e}`);
    }
  };

  const exportServerXLSX = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      const token = localStorage.getItem("token");

      const url = `${globalBackendRoute}/api/projects/export.xlsx?${params.toString()}`;
      const res = await axios.get(url, {
        responseType: "arraybuffer",
        validateStatus: () => true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const ct = (res.headers["content-type"] || "").toLowerCase();
      const ok =
        ct.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) &&
        res.status >= 200 &&
        res.status < 300;

      if (!ok) {
        let msg = `Export failed (status ${res.status}).`;
        try {
          const decoder = new TextDecoder("utf-8");
          const text = decoder.decode(new Uint8Array(res.data || []));
          msg += `\n${text.slice(0, 600)}`;
        } catch {}
        alert(msg);
        return;
      }

      const blob = new Blob([res.data], { type: ct });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `projects_${new Date()
        .toISOString()
        .replace(/[-:T]/g, "")
        .slice(0, 12)}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error("Server export failed:", e);
      alert(`Server export failed: ${e?.message || e}`);
    }
  };

  // -------------------- RENDER --------------------
  const renderProjects = () => {
    if (view === "grid") {
      return (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 shadow rounded-xl flex flex-col items-center relative"
            >
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                onClick={() => handleDeleteProject(project._id)}
                title="Delete project"
                aria-label="Delete project"
              >
                <FaTrashAlt />
              </button>
              <FaProjectDiagram className="text-3xl text-blue-500 mb-2" />
              <h3 className="text-sm font-semibold text-gray-700 text-center line-clamp-2">
                {project.project_name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 text-center line-clamp-3">
                {project.description}
              </p>
              <Link
                to={`/single-project/${project._id}`}
                className="mt-2 text-xs text-indigo-600 hover:underline"
              >
                View Project Details
              </Link>
            </div>
          ))}
          {!currentProjects.length && (
            <div className="col-span-full text-sm text-slate-500">
              No projects match your search.
            </div>
          )}
        </div>
      );
    } else if (view === "card") {
      return (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-5 rounded-xl shadow flex flex-col items-center relative"
            >
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                onClick={() => handleDeleteProject(project._id)}
                title="Delete project"
                aria-label="Delete project"
              >
                <FaTrashAlt />
              </button>
              <FaProjectDiagram className="text-4xl text-green-500 mb-2" />
              <h3 className="text-sm font-bold text-gray-700 text-center line-clamp-2">
                {project.project_name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 text-center line-clamp-3">
                {project.description}
              </p>
              <Link
                to={`/single-project/${project._id}`}
                className="mt-2 text-xs text-indigo-600 hover:underline"
              >
                View Project Details
              </Link>
            </div>
          ))}
          {!currentProjects.length && (
            <div className="col-span-full text-sm text-slate-500">
              No projects match your search.
            </div>
          )}
        </div>
      );
    } else if (view === "list") {
      return (
        <div className="space-y-3">
          <div className="hidden sm:grid grid-cols-4 font-semibold text-xs text-indigo-700 border-b pb-2">
            <div>Project Name</div>
            <div>Description</div>
            <div>View</div>
            <div>Delete</div>
          </div>
          {currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-3 rounded-xl shadow flex flex-col sm:grid sm:grid-cols-4 sm:items-center text-sm"
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <FaProjectDiagram className="text-purple-500" />
                <span className="text-gray-700 font-medium line-clamp-1">
                  {project.project_name}
                </span>
              </div>
              <div className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-0 text-center line-clamp-2">
                {project.description}
              </div>
              <div className="text-indigo-600 hover:underline mb-2 sm:mb-0 text-center">
                <Link to={`/single-project/${project._id}`}>View</Link>
              </div>
              <div className="text-center">
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteProject(project._id)}
                  title="Delete project"
                  aria-label="Delete project"
                >
                  <FaTrashAlt className="inline" />
                </button>
              </div>
            </div>
          ))}
          {!currentProjects.length && (
            <div className="text-sm text-slate-500">
              No projects match your search.
            </div>
          )}
        </div>
      );
    }
  };

  const renderPagination = () => {
    if (projectsPerPage === 0 || pageCount <= 1) return null;
    const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
    return (
      <div className="mt-6 flex justify-center">
        <ul className="inline-flex flex-wrap gap-2">
          {pageNumbers.map((n) => (
            <li key={n}>
              <button
                onClick={() => paginate(n)}
                className={`px-2.5 py-1 rounded-md text-white text-xs transition ${
                  n === currentPage
                    ? "bg-indigo-700"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {n}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Flat Header Row (no card, no border, no shadow) */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {/* Title + counts */}
          <div className="flex flex-col">
            <h3 className="text-xl sm:text-2xl font-bold text-indigo-600">
              All Projects
            </h3>
            <div className="mt-0.5 text-[10px] sm:text-xs text-slate-600">
              <span className="font-medium">Total:</span> {projects.length}
              <span className="mx-1">|</span>
              <span className="font-medium">Showing:</span>{" "}
              {filteredProjects.length}
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              spellCheck={false}
              placeholder="Search (name, description, status, tags)…"
              className="w-full pl-8 pr-2 py-2 border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-xs"
            />
          </div>

          {/* Create/Edit */}
          <div className="flex-shrink-0">
            <Link
              to={`/create-project`}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs px-4 py-2 shadow-sm hover:bg-indigo-700 transition whitespace-nowrap"
              title="Create or Edit Project"
            >
              Create / Edit
            </Link>
          </div>

          {/* Right-side cluster: rows + exports + views */}
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {/* Rows */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600">Rows</span>
              <select
                className="px-2 py-1.5 border rounded-md text-[10px]"
                value={projectsPerPage}
                onChange={(e) => setProjectsPerPage(Number(e.target.value))}
                title="Projects per page"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={0}>All</option>
              </select>
            </div>

            {/* Export buttons (only if allowed) */}
            {canExport && (
              <>
                <button
                  onClick={exportXLSX}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-md bg-white hover:bg-slate-50 text-[10px]"
                  title="Export Excel (filtered on client)"
                >
                  <FaDownload className="text-[11px]" />
                  <span className="hidden sm:inline">Client</span>
                </button>
                <button
                  onClick={exportServerXLSX}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-md bg-white hover:bg-slate-50 text-[10px]"
                  title="Export Excel from server (DB)"
                >
                  <FaDownload className="text-[11px]" />
                  <span className="hidden sm:inline">Server</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-md bg-white hover:bg-slate-50 text-[10px]"
                  title="Export CSV (filtered)"
                >
                  <FaDownload className="text-[11px]" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </>
            )}

            {/* View toggles */}
            <button
              className={`p-1.5 rounded-md border text-xs ${
                view === "list"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
              onClick={() => handleViewChange("list")}
              title="List view"
              aria-label="List view"
            >
              <FaThList />
            </button>
            <button
              className={`p-1.5 rounded-md border text-xs ${
                view === "card"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
              onClick={() => handleViewChange("card")}
              title="Card view"
              aria-label="Card view"
            >
              <FaThLarge />
            </button>
            <button
              className={`p-1.5 rounded-md border text-xs ${
                view === "grid"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
              onClick={() => handleViewChange("grid")}
              title="Grid view"
              aria-label="Grid view"
            >
              <FaTh />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-2">{renderProjects()}</div>
        {renderPagination()}
      </div>
    </div>
  );
};

export default AllProjects;
