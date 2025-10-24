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

const AddScenario = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // form
  const [scenarioText, setScenarioText] = useState("");
  const [useExistingModule, setUseExistingModule] = useState(true);
  const [moduleId, setModuleId] = useState("");
  const [newModuleName, setNewModuleName] = useState("");

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

  // ---- load modules for dropdown ----
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
          // pick first by default if any
          if (data.length && !moduleId) setModuleId(data[0]._id);
        } else {
          setModules([]);
        }
      } catch (e) {
        // silent; show empty dropdown
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
    // debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 300);
  };

  const handlePickSuggestion = (text) => {
    setScenarioText(text);
    setSuggestions([]);
  };

  // ---- basic validation ----
  const validate = () => {
    const e = {};
    if (!scenarioText.trim())
      e.scenario_text = "Scenario text cannot be empty.";

    if (useExistingModule) {
      if (!moduleId) e.module = "Please select a module.";
    } else {
      if (!newModuleName.trim()) e.module = "Please enter a new module name.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // If creating a new module, create-or-get it first to retrieve its id (optional)
      let payload = { scenario_text: scenarioText };
      if (useExistingModule) {
        payload.moduleId = moduleId;
      } else {
        // You can either pass module_name to add-scenario
        // or pre-create here with POST /modules then pass moduleId.
        // We'll pass module_name directly to keep the flow simple.
        payload.module_name = newModuleName.trim();
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
        setNewModuleName("");
        // optional: refresh modules in case a new one was created server-side
        // navigate to list
        alert("Scenario added successfully.");
        navigate(`/single-project/${projectId}/view-all-scenarios`);
      } else {
        // handle duplicate (409) specially
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
    } catch (err) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // Highlight if we think there’s a likely duplicate
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

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <MdOutlineAdminPanelSettings
          className="text-indigo-600 mx-auto mb-2"
          size={48}
        />
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Add Scenario
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
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
                        title={`Module: ${s?.module?.name || "—"}`}
                      >
                        {s.scenario_text}
                        {s.module?.name ? (
                          <span className="ml-2 text-xs text-gray-500">
                            ({s.module.name})
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

          {/* Module picker */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex gap-4 items-center">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  checked={useExistingModule}
                  onChange={() => setUseExistingModule(true)}
                />
                <span className="text-sm text-gray-800">
                  Select existing module
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  checked={!useExistingModule}
                  onChange={() => setUseExistingModule(false)}
                />
                <span className="text-sm text-gray-800">Create new module</span>
              </label>
            </div>

            {useExistingModule ? (
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Module
                </label>
                <select
                  disabled={loadingMods}
                  className="mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                >
                  {loadingMods ? (
                    <option>Loading modules…</option>
                  ) : modules.length ? (
                    modules.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No modules found</option>
                  )}
                </select>
                {errors.module && (
                  <p className="mt-2 text-sm text-red-600">{errors.module}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  New module name
                </label>
                <input
                  type="text"
                  className="mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  placeholder="e.g., Homepage"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Similar names (e.g., “home page”, “HOME_PAGE”) are normalized
                  server-side to avoid duplicates.
                </p>
                {errors.module && (
                  <p className="mt-2 text-sm text-red-600">{errors.module}</p>
                )}
              </div>
            )}
          </div>

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
};

export default AddScenario;
