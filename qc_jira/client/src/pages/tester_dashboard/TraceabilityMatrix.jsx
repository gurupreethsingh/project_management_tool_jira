import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

export default function TraceabilityMatrix() {
  const { projectId } = useParams();

  // raw data
  const [matrix, setMatrix] = useState([]);
  const [scenarios, setScenarios] = useState([]);

  // ui state
  const [view, setView] = useState("list"); // list | grid | card
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // counters (top summary)
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [defectReportCount, setDefectReportCount] = useState(0);
  const [missingTestCasesCount, setMissingTestCasesCount] = useState(0);

  // module filter (same behavior as AllScenarios)
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // fetch matrix + scenarios (so modules match AllScenarios 1:1)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const auth = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined;

        const [matrixRes, scenariosRes] = await Promise.all([
          axios.get(
            `${globalBackendRoute}/api/projects/${projectId}/traceability-matrix`,
            auth
          ),
          axios.get(
            `${globalBackendRoute}/api/single-project/${projectId}/view-all-scenarios`,
            auth
          ),
        ]);

        const m = Array.isArray(matrixRes.data) ? matrixRes.data : [];
        const s = Array.isArray(scenariosRes.data) ? scenariosRes.data : [];

        setMatrix(m);
        setScenarios(s);

        // counters from matrix
        setTotalScenarios(m.length);
        setTotalTestCases(m.filter((i) => i.testCaseNumber).length);
        setPassCount(m.filter((i) => i.testCaseStatus === "Pass").length);
        setFailCount(m.filter((i) => i.testCaseStatus === "Fail").length);
        setDefectReportCount(
          m.filter((i) => i.defectReportStatus === "Present").length
        );
        setMissingTestCasesCount(
          m.filter((i) => !i.testCaseNumber || i.testCaseNumber === "Missing")
            .length
        );

        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching data:", err?.message || err);
      }
    })();
  }, [projectId]);

  // responsive page size
  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      if (view === "card") setCardsPerPage(w >= 1024 ? 6 : 4);
      else if (view === "grid") setCardsPerPage(w >= 1024 ? 8 : 6);
      else setCardsPerPage(w >= 1366 ? 5 : 4); // list
    };
    apply();
    const onResize = () => apply();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [view]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 180);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const norm = (v) => (v ?? "").toString().toLowerCase();

  // --- build a lookup from scenarioNumber -> module { _id, name } using the exact AllScenarios shape
  const scenarioNumToModule = useMemo(() => {
    const map = new Map();
    for (const s of scenarios) {
      // AllScenarios data shape: s.module?._id / s.module?.name
      const key = s?.scenario_number?.toString();
      if (!key) continue;
      map.set(key, {
        _id: s?.module?._id || "__unassigned__",
        name: s?.module?.name || "Unassigned",
      });
    }
    return map;
  }, [scenarios]);

  // module chips (+ counts) using the same logic as AllScenarios
  const modules = useMemo(() => {
    const counts = new Map(); // id -> { _id, name, count }
    // count by module id from scenario lookup
    for (const row of matrix) {
      const sn = row?.scenarioNumber?.toString();
      const m = scenarioNumToModule.get(sn) || {
        _id: "__unassigned__",
        name: "Unassigned",
      };
      if (!counts.has(m._id))
        counts.set(m._id, { _id: m._id, name: m.name, count: 0 });
      counts.get(m._id).count += 1;
    }
    return Array.from(counts.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [matrix, scenarioNumToModule]);

  // filter (search + module)
  const filtered = useMemo(() => {
    const q = norm(debouncedQuery);
    return matrix.filter((row) => {
      // module filter identical to AllScenarios (by id)
      if (selectedModuleId) {
        const sn = row?.scenarioNumber?.toString();
        const m = scenarioNumToModule.get(sn) || { _id: "__unassigned__" };
        if (m._id !== selectedModuleId) return false;
      }
      // search fields
      const fields = [
        row.scenarioNumber,
        row.scenarioText,
        row.testCaseNumber,
        row.defectNumber,
        row.testCaseStatus,
        row.defectReportStatus,
        (scenarioNumToModule.get(row?.scenarioNumber?.toString()) || {}).name ||
          "Unassigned",
      ].map(norm);
      return q ? fields.some((f) => f.includes(q)) : true;
    });
  }, [matrix, debouncedQuery, selectedModuleId, scenarioNumToModule]);

  // pagination
  useEffect(() => {
    const pages = Math.max(1, Math.ceil(filtered.length / cardsPerPage));
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(p, pages) || 1);
  }, [filtered, cardsPerPage]);

  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);

  // view helpers
  const getNumberOfColumns = (viewType) => {
    const w = window.innerWidth;
    if (viewType === "grid") return w >= 1366 ? "grid-cols-4" : "grid-cols-3";
    if (viewType === "card") return w >= 1366 ? "grid-cols-2" : "grid-cols-1";
    return "grid-cols-1";
  };

  const onModuleClick = (id) => {
    setSelectedModuleId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
  };
  const clearModuleSelection = () => {
    setSelectedModuleId(null);
    setCurrentPage(1);
  };

  const getRowModule = (row) => {
    const sn = row?.scenarioNumber?.toString();
    return (
      scenarioNumToModule.get(sn) || {
        _id: "__unassigned__",
        name: "Unassigned",
      }
    );
  };

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header / Controls (matches AllScenarios) */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              Traceability Matrix for Project: {projectId}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Total Scenarios: {totalScenarios} | Expected TestCases:{" "}
              {totalTestCases} |{" "}
              <span className="text-rose-600">
                Missing Test Cases: {missingTestCasesCount}
              </span>{" "}
              | <span className="text-emerald-600">Pass: {passCount}</span> |{" "}
              <span className="text-rose-600">Fail: {failCount}</span> |{" "}
              <span className="text-rose-600">
                Missing Defect Reports: {defectReportCount}
              </span>
            </p>
            {searchQuery && (
              <p className="text-xs text-gray-600">
                Showing {filtered.length} result(s) for “{searchQuery}”
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <FaThList
              className={`text-lg cursor-pointer ${
                view === "list" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-lg cursor-pointer ${
                view === "card" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("card")}
              title="Card view"
            />
            <FaTh
              className={`text-lg cursor-pointer ${
                view === "grid" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("grid")}
              title="Grid view"
            />

            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link
              to={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              Project Dashboard
            </Link>
          </div>
        </div>

        {/* Module chips row — identical behavior to AllScenarios */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700">
              Filter by Module
            </h3>
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

        {/* LIST VIEW — compact, single global header (same layout spirit as AllScenarios) */}
        {view === "list" && (
          <div className="mt-5">
            <div className="grid grid-cols-[56px,120px,1fr,160px,140px,120px,120px,120px] items-center text-[12px] font-semibold text-slate-600 px-3 py-2 border-b border-slate-200">
              <div>#</div>
              <div>Scenario</div>
              <div>Text</div>
              <div>Module</div>
              <div>TestCase #</div>
              <div>Status</div>
              <div>Defect #</div>
              <div>Defect Report</div>
            </div>

            <div className="divide-y divide-slate-200">
              {current.map((it, idx) => {
                const m = getRowModule(it);
                return (
                  <div
                    key={`${it.scenarioNumber}-${idx}`}
                    className="grid grid-cols-[56px,120px,1fr,160px,140px,120px,120px,120px] items-center text-[12px] px-3 py-2"
                  >
                    <div className="text-slate-700">
                      {indexOfFirst + idx + 1}
                    </div>

                    <div className="text-slate-900 font-medium truncate">
                      {it.scenarioNumber}
                    </div>

                    <div className="text-slate-700 line-clamp-2">
                      {it.scenarioText}
                    </div>

                    <div className="truncate">
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        {m.name}
                      </span>
                    </div>

                    <div
                      className={`truncate ${
                        it.testCaseNumber === "Missing"
                          ? "text-rose-600 font-semibold"
                          : "text-slate-800"
                      }`}
                    >
                      {it.testCaseNumber || "N/A"}
                    </div>

                    <div
                      className={`font-semibold ${
                        it.testCaseStatus === "Fail"
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {it.testCaseStatus || "N/A"}
                    </div>

                    <div className="text-slate-800 truncate">
                      {it.defectNumber || "N/A"}
                    </div>

                    <div
                      className={`font-semibold ${
                        it.defectReportStatus === "Present"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {it.defectReportStatus || "N/A"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && (
          <div className={`grid ${getNumberOfColumns("grid")} gap-4 mt-8`}>
            {current.map((it, idx) => {
              const m = getRowModule(it);
              return (
                <div
                  key={`${it.scenarioNumber}-grid-${idx}`}
                  className="bg-white rounded-lg shadow p-4 border border-slate-200"
                >
                  <div className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                    <span>Scenario: {it.scenarioNumber}</span>
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {m.name}
                    </span>
                  </div>
                  <div className="text-sm text-slate-700 mt-1">
                    {it.scenarioText}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                    <div className="border rounded-md p-2">
                      <div className="text-slate-500">Test Case #</div>
                      <div
                        className={`font-medium ${
                          it.testCaseNumber === "Missing"
                            ? "text-rose-600"
                            : "text-slate-800"
                        }`}
                      >
                        {it.testCaseNumber || "N/A"}
                      </div>
                    </div>
                    <div className="border rounded-md p-2">
                      <div className="text-slate-500">Status</div>
                      <div
                        className={`font-semibold ${
                          it.testCaseStatus === "Fail"
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {it.testCaseStatus || "N/A"}
                      </div>
                    </div>
                    <div className="border rounded-md p-2">
                      <div className="text-slate-500">Defect #</div>
                      <div className="font-medium text-slate-800">
                        {it.defectNumber || "N/A"}
                      </div>
                    </div>
                    <div className="border rounded-md p-2">
                      <div className="text-slate-500">Defect Report</div>
                      <div
                        className={`font-semibold ${
                          it.defectReportStatus === "Present"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {it.defectReportStatus || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CARD VIEW */}
        {view === "card" && (
          <div className={`grid ${getNumberOfColumns("card")} gap-4 mt-8`}>
            {current.map((it, idx) => {
              const m = getRowModule(it);
              return (
                <div
                  key={`${it.scenarioNumber}-card-${idx}`}
                  className="bg-white rounded-lg shadow p-4 border border-slate-200"
                >
                  <div className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                    <span>Scenario: {it.scenarioNumber}</span>
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {m.name}
                    </span>
                  </div>
                  <div className="text-sm text-slate-700 mt-1">
                    {it.scenarioText}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                    <div className="border rounded-md p-2">
                      <div className="text-slate-500">Test Case #</div>
                      <div
                        className={`font-medium ${
                          it.testCaseNumber === "Missing"
                            ? "text-rose-600"
                            : "text-slate-800"
                        }`}
                      >
                        {it.testCaseNumber || "N/A"}
                      </div>
                    </div>
                    <div className="border rounded-md p-2">
                      <div className="text-slate-500">Status</div>
                      <div
                        className={`font-semibold ${
                          it.testCaseStatus === "Fail"
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {it.testCaseStatus || "N/A"}
                      </div>
                    </div>
                    <div className="border rounded-md p-2">
                      <div className="text-slate-500">Defect #</div>
                      <div className="font-medium text-slate-800">
                        {it.defectNumber || "N/A"}
                      </div>
                    </div>
                    <div className="border rounded-md p-2">
                      <div className="text-slate-500">Defect Report</div>
                      <div
                        className={`font-semibold ${
                          it.defectReportStatus === "Present"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {it.defectReportStatus || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
