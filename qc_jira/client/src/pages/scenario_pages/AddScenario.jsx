import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

export default function AddScenario() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // form
  const [scenarioText, setScenarioText] = useState("");

  // picker mode
  const [mode, setMode] = useState("existing"); // "existing" | "new"

  // existing modules selection (multi)
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);

  // new module names (comma separated)
  const [newModuleNamesCSV, setNewModuleNamesCSV] = useState("");

  // data
  const [modules, setModules] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // ui
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingMods, setLoadingMods] = useState(false);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = useMemo(() => localStorage.getItem("token") || "", []);
  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  // ---- load modules for multi-select ----
  useEffect(() => {
    const loadModules = async () => {
      if (!projectId) return;
      try {
        setLoadingMods(true);
        const res = await fetch(
          `${globalBackendRoute}/api/single-projects/${projectId}/modules`,
          { headers: authHeaders }
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setModules(data);
        } else {
          setModules([]);
        }
      } catch {
        setModules([]);
      } finally {
        setLoadingMods(false);
      }
    };
    loadModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // ---- autosuggest search with debounce ----
  const debounceRef = useRef(null);
  const runSearch = useCallback(
    async (q) => {
      if (!q?.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        setSearching(true);
        const url = `${globalBackendRoute}/api/single-projects/${projectId}/scenarios/search?q=${encodeURIComponent(
          q
        )}`;
        const res = await fetch(url, { headers: authHeaders });
        const data = await res.json();
        if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    },
    [authHeaders, projectId]
  );

  const handleScenarioChange = (e) => {
    const value = e.target.value;
    setScenarioText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 300);
  };

  const handlePickSuggestion = (text) => {
    setScenarioText(text);
    setSuggestions([]);
  };

  // existing modules selection handlers
  const toggleModuleId = (id) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllModules = () => {
    setSelectedModuleIds(modules.map((m) => m._id));
  };

  const clearAllModules = () => setSelectedModuleIds([]);

  // ---- validation ----
  const validate = () => {
    const e = {};
    if (!scenarioText.trim())
      e.scenario_text = "Scenario text cannot be empty.";

    if (mode === "existing") {
      if (!selectedModuleIds.length) e.modules = "Select at least one module.";
    } else {
      const list = parseCSV(newModuleNamesCSV);
      if (!list.length)
        e.modules =
          "Enter at least one module name (comma separated) or switch to existing.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---- helpers ----
  const parseCSV = (csv) =>
    (csv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  // duplicate indicator
  const likelyDuplicate = useMemo(() => {
    if (!scenarioText.trim() || !suggestions.length) return false;
    const norm = (s) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    const mine = norm(scenarioText);
    return suggestions.some((s) => norm(s.scenario_text) === mine);
  }, [scenarioText, suggestions]);

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Build payload for multi-module create
      const payload = { scenario_text: scenarioText };

      if (mode === "existing") {
        payload.moduleIds = selectedModuleIds; // array of ids
      } else {
        payload.module_names = parseCSV(newModuleNamesCSV); // array of names
      }

      const res = await fetch(
        `${globalBackendRoute}/api/single-projects/${projectId}/add-scenario`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMessage("Scenario added successfully!");
        setScenarioText("");
        setNewModuleNamesCSV("");
        setSelectedModuleIds([]);
        alert("Scenario added successfully.");
        navigate(`/single-project/${projectId}/view-all-scenarios`);
      } else {
        if (res.status === 409) {
          setErrors({
            submit:
              data?.error ||
              data?.message ||
              "A similar scenario already exists.",
          });
        } else {
          setErrors({
            submit: data?.error || data?.message || "Error adding scenario.",
          });
        }
      }
    } catch {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <MdOutlineAdminPanelSettings
          className="text-indigo-600 mx-auto mb-2"
          size={48}
        />
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Add Scenario
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Scenario Text */}
          <div>
            <label
              htmlFor="scenario_text"
              className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
            >
              <FaFileAlt className="text-green-500 mr-2" /> Scenario Text
            </label>
            <div className="mt-2 relative">
              <input
                id="scenario_text"
                name="scenario_text"
                type="text"
                required
                value={scenarioText}
                onChange={handleScenarioChange}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Describe the scenario…"
              />
              {errors.scenario_text && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.scenario_text}
                </p>
              )}
              {likelyDuplicate && (
                <p className="mt-2 text-sm text-amber-600">
                  Heads up: a very similar scenario already exists.
                </p>
              )}

              {/* Suggestions */}
              {(searching || suggestions.length > 0) && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searching && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Searching…
                    </div>
                  )}
                  {!searching &&
                    suggestions.map((s) => (
                      <button
                        type="button"
                        key={s._id}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => handlePickSuggestion(s.scenario_text)}
                        title={
                          Array.isArray(s.modules) && s.modules.length
                            ? `Modules: ${s.modules
                                .map((m) => m.name)
                                .join(", ")}`
                            : "Modules: —"
                        }
                      >
                        {s.scenario_text}
                        {Array.isArray(s.modules) && s.modules.length ? (
                          <span className="ml-2 text-xs text-gray-500">
                            ({s.modules.map((m) => m.name).join(", ")})
                          </span>
                        ) : null}
                      </button>
                    ))}
                  {!searching && suggestions.length === 0 && scenarioText && (
                    <div className="px-3 py-2 text-sm text-gray-400">
                      No similar scenarios found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mode Switch */}
          <div className="flex gap-4 items-center">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="mr-2"
                checked={mode === "existing"}
                onChange={() => setMode("existing")}
              />
              <span className="text-sm text-gray-800">
                Select existing module(s)
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="mr-2"
                checked={mode === "new"}
                onChange={() => setMode("new")}
              />
              <span className="text-sm text-gray-800">
                Create new module(s)
              </span>
            </label>
          </div>

          {/* Existing: multi-select checkboxes */}
          {mode === "existing" ? (
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Choose one or more modules
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
                    onClick={selectAllModules}
                    disabled={!modules.length}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="text-[11px] px-2 py-1 border rounded-md bg-slate-50 hover:bg-slate-100"
                    onClick={clearAllModules}
                    disabled={!modules.length}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-2 border rounded-md p-2 max-h-56 overflow-auto">
                {loadingMods ? (
                  <div className="text-sm text-gray-500">Loading modules…</div>
                ) : modules.length ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modules.map((m) => (
                      <li key={m._id} className="flex items-center">
                        <input
                          id={`mod-${m._id}`}
                          type="checkbox"
                          className="mr-2"
                          checked={selectedModuleIds.includes(m._id)}
                          onChange={() => toggleModuleId(m._id)}
                        />
                        <label
                          htmlFor={`mod-${m._id}`}
                          className="text-sm text-gray-800"
                        >
                          {m.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">No modules found.</div>
                )}
              </div>
              {errors.modules && (
                <p className="mt-2 text-sm text-red-600">{errors.modules}</p>
              )}
            </div>
          ) : (
            // New: CSV input
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                New module names (comma separated)
              </label>
              <input
                type="text"
                className="mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                value={newModuleNamesCSV}
                onChange={(e) => setNewModuleNamesCSV(e.target.value)}
                placeholder="e.g., Homepage, Auth, Billing"
              />
              <p className="mt-1 text-xs text-gray-500">
                Names are normalized server-side to avoid duplicates. You can
                enter one or many names separated by commas.
              </p>
              {errors.modules && (
                <p className="mt-2 text-sm text-red-600">{errors.modules}</p>
              )}
            </div>
          )}

          {/* Submit errors/success */}
          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}
          {successMessage && (
            <div className="text-green-600 text-sm">{successMessage}</div>
          )}

          {/* Actions */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add Scenario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
