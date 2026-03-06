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
  const [mode, setMode] = useState("existing"); // "existing" | "new"
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
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

  // ✅ module search (client-side filter)
  const [moduleSearch, setModuleSearch] = useState("");

  // ✅ live duplicate warning while typing
  const [dupWarning, setDupWarning] = useState("");
  const lastDupKeyRef = useRef(""); // prevents repeated alerts for same text

  const token = useMemo(() => localStorage.getItem("token") || "", []);
  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token],
  );

  // ------------------ ✅ Validation helpers ------------------
  const sanitizeScenarioText = useCallback(
    (raw) => String(raw || "").trim(),
    [],
  );

  const validateScenarioText = useCallback(
    (raw) => {
      const cleaned = sanitizeScenarioText(raw);

      if (!cleaned) {
        return {
          ok: false,
          cleaned: "",
          msg: "Scenario text cannot be empty.",
        };
      }

      // Must contain at least one letter A-Z
      const hasLetter = /[a-zA-Z]/.test(cleaned);
      if (!hasLetter) {
        return {
          ok: false,
          cleaned,
          msg: "Scenario must contain at least one letter (A–Z). Only numbers or only symbols are not allowed.",
        };
      }

      return { ok: true, cleaned, msg: "" };
    },
    [sanitizeScenarioText],
  );

  // A normalizer for duplicate detection
  const normForDup = useCallback((s) => {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }, []);

  // ✅ NEW: module CSV cleaner (prettier + avoids sending empty)
  const parseCSV = useCallback((csv) => {
    return String(csv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, []);

  // ✅ NEW: (optional UX) front-end module name check to match backend rules
  // NOTE: Backend is the source of truth. This is only to show user early error.
  const validateModuleName = useCallback((raw) => {
    const t = String(raw || "").trim();
    if (!t) return { ok: false, msg: "Module name cannot be empty." };
    if (!/[A-Za-z]/.test(t))
      return {
        ok: false,
        msg: "Module name must contain at least one letter.",
      };
    if (/\d/.test(t))
      return { ok: false, msg: "Module name cannot contain numbers." };
    if (/[^A-Za-z\s]/.test(t))
      return {
        ok: false,
        msg: "Module name cannot contain special characters.",
      };

    // collapse spaces then camel-case length check (same as server)
    const collapsed = t.replace(/\s+/g, " ");
    const words = collapsed.split(" ").filter(Boolean);
    const displayName = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("");

    if (displayName.length > 100)
      return {
        ok: false,
        msg: "Module name cannot be more than 100 characters.",
      };

    return { ok: true, msg: "" };
  }, []);

  // ---- load modules ----
  useEffect(() => {
    const loadModules = async () => {
      if (!projectId) return;
      try {
        setLoadingMods(true);
        const res = await fetch(
          `${globalBackendRoute}/api/single-projects/${projectId}/modules`,
          { headers: authHeaders },
        );
        const data = await res.json();
        setModules(Array.isArray(data) ? data : []);
      } catch {
        setModules([]);
      } finally {
        setLoadingMods(false);
      }
    };
    loadModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // total module count
  const totalModulesCount = useMemo(() => modules.length, [modules]);

  // filtered modules
  const filteredModules = useMemo(() => {
    const q = String(moduleSearch || "")
      .trim()
      .toLowerCase();
    if (!q) return modules;

    return (modules || []).filter((m) =>
      String(m?.name || "")
        .toLowerCase()
        .includes(q),
    );
  }, [modules, moduleSearch]);

  const noModuleMatch = useMemo(() => {
    const q = String(moduleSearch || "").trim();
    if (!q) return false;
    return (
      !loadingMods &&
      Array.isArray(modules) &&
      modules.length > 0 &&
      filteredModules.length === 0
    );
  }, [moduleSearch, loadingMods, modules, filteredModules]);

  // ---- autosuggest search with debounce ----
  const debounceRef = useRef(null);

  const runSearch = useCallback(
    async (q) => {
      const cleaned = String(q || "").trim();
      if (!cleaned) {
        setSuggestions([]);
        return;
      }
      try {
        setSearching(true);
        const url = `${globalBackendRoute}/api/single-projects/${projectId}/scenarios/search?q=${encodeURIComponent(
          cleaned,
        )}`;
        const res = await fetch(url, { headers: authHeaders });
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    },
    [authHeaders, projectId],
  );

  const handleScenarioChange = (e) => {
    const value = e.target.value;
    setScenarioText(value);

    // clear old validation error while typing
    setErrors((prev) => {
      if (!prev?.scenario_text) return prev;
      const cp = { ...prev };
      delete cp.scenario_text;
      return cp;
    });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 300);
  };

  const handleScenarioBlur = () => {
    setScenarioText((prev) => sanitizeScenarioText(prev));
  };

  const handlePickSuggestion = (text) => {
    const cleaned = sanitizeScenarioText(text);
    setScenarioText(cleaned);
    setSuggestions([]);
  };

  // existing modules selection
  const toggleModuleId = (id) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAllModules = () => {
    // select only currently visible (filtered) modules
    setSelectedModuleIds(filteredModules.map((m) => m._id));
  };

  const clearAllModules = () => setSelectedModuleIds([]);

  // ---- validation ----
  const validate = useCallback(() => {
    const e = {};

    const check = validateScenarioText(scenarioText);
    if (!check.ok) e.scenario_text = check.msg;

    if (mode === "existing") {
      if (!selectedModuleIds.length) e.modules = "Select at least one module.";
    } else {
      const list = parseCSV(newModuleNamesCSV);
      if (!list.length) {
        e.modules =
          "Enter at least one module name (comma separated) or switch to existing.";
      } else {
        // ✅ optional: pre-validate each module name to avoid 400 from backend
        for (const name of list) {
          const v = validateModuleName(name);
          if (!v.ok) {
            e.modules = v.msg;
            break;
          }
        }
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [
    mode,
    newModuleNamesCSV,
    scenarioText,
    selectedModuleIds,
    validateScenarioText,
    parseCSV,
    validateModuleName,
  ]);

  // live duplicate indicator (while typing)
  const likelyDuplicate = useMemo(() => {
    const cleaned = sanitizeScenarioText(scenarioText);
    if (!cleaned || !suggestions.length) return false;

    const mine = normForDup(cleaned);
    if (!mine) return false;

    return suggestions.some((s) => normForDup(s?.scenario_text) === mine);
  }, [scenarioText, suggestions, sanitizeScenarioText, normForDup]);

  // alert while typing behavior (non-blocking banner)
  useEffect(() => {
    const cleaned = sanitizeScenarioText(scenarioText);
    const key = normForDup(cleaned);

    if (!cleaned || !likelyDuplicate) {
      setDupWarning("");
      lastDupKeyRef.current = "";
      return;
    }

    if (key && lastDupKeyRef.current !== key) {
      lastDupKeyRef.current = key;
      setDupWarning(
        "A very similar scenario already exists. Please review the suggestions.",
      );
    }
  }, [likelyDuplicate, scenarioText, sanitizeScenarioText, normForDup]);

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    // force-trim before validating & submitting
    const check = validateScenarioText(scenarioText);
    if (!check.ok) {
      setErrors((prev) => ({ ...prev, scenario_text: check.msg }));
      return;
    }

    if (scenarioText !== check.cleaned) setScenarioText(check.cleaned);

    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const payload = { scenario_text: check.cleaned };

      if (mode === "existing") {
        payload.moduleIds = selectedModuleIds;
      } else {
        payload.module_names = parseCSV(newModuleNamesCSV);
      }

      const res = await fetch(
        `${globalBackendRoute}/api/single-projects/${projectId}/add-scenario`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMessage("Scenario added successfully!");
        setScenarioText("");
        setNewModuleNamesCSV("");
        setSelectedModuleIds([]);
        setSuggestions([]);
        setDupWarning("");
        lastDupKeyRef.current = "";
        setModuleSearch("");
        alert("Scenario added successfully.");
        navigate(`/single-project/${projectId}/view-all-scenarios`);
        return;
      }

      // ✅ NEW: show strict backend validation messages (400)
      if (res.status === 400) {
        setErrors({
          submit:
            data?.error ||
            data?.message ||
            "Invalid input. Please check scenario/module values.",
        });
        return;
      }

      // duplicate scenario (or module) conflict
      if (res.status === 409) {
        setErrors({
          submit:
            data?.error ||
            data?.message ||
            "A similar scenario already exists.",
        });
        return;
      }

      setErrors({
        submit: data?.error || data?.message || "Error adding scenario.",
      });
    } catch {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6 sm:py-8 bg-slate-50/40">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <MdOutlineAdminPanelSettings
            className="text-indigo-600 mx-auto mb-2"
            size={40}
          />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Add Scenario
          </h2>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-500">
            Create a new scenario and link it to existing or new modules.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 border border-slate-200/70 rounded-xl shadow-sm p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Scenario Text */}
            <div>
              <label
                htmlFor="scenario_text"
                className="block text-sm font-medium leading-6 text-slate-900 flex items-center"
              >
                <FaFileAlt className="text-indigo-500 mr-2" />
                Scenario Text
              </label>

              <div className="mt-2 relative">
                <input
                  id="scenario_text"
                  name="scenario_text"
                  type="text"
                  value={scenarioText}
                  onChange={handleScenarioChange}
                  onBlur={handleScenarioBlur}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Describe the scenario…"
                />

                {errors.scenario_text && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.scenario_text}
                  </p>
                )}

                {dupWarning && !errors.scenario_text && (
                  <p className="mt-1 text-xs text-amber-600">{dupWarning}</p>
                )}

                {(searching || suggestions.length > 0) && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto text-sm">
                    {searching && (
                      <div className="px-3 py-2 text-xs text-slate-500">
                        Searching…
                      </div>
                    )}

                    {!searching &&
                      suggestions.map((s) => (
                        <button
                          type="button"
                          key={s._id}
                          className="block w-full text-left px-3 py-2 hover:bg-slate-50 text-xs text-slate-800"
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
                            <span className="ml-2 text-[10px] text-slate-500">
                              ({s.modules.map((m) => m.name).join(", ")})
                            </span>
                          ) : null}
                        </button>
                      ))}

                    {!searching && suggestions.length === 0 && scenarioText && (
                      <div className="px-3 py-2 text-xs text-slate-400">
                        No similar scenarios found.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="mt-1 text-[10px] text-slate-500">
                Note: Leading/trailing spaces are removed automatically.
                Scenario must include at least one letter (A–Z).
              </p>
            </div>

            {/* Mode Switch */}
            <div className="flex flex-wrap gap-4 items-center">
              <label className="inline-flex items-center text-xs sm:text-sm text-slate-800">
                <input
                  type="radio"
                  className="mr-2 accent-indigo-600"
                  checked={mode === "existing"}
                  onChange={() => setMode("existing")}
                />
                Select existing module(s)
              </label>
              <label className="inline-flex items-center text-xs sm:text-sm text-slate-800">
                <input
                  type="radio"
                  className="mr-2 accent-indigo-600"
                  checked={mode === "new"}
                  onChange={() => setMode("new")}
                />
                Create new module(s)
              </label>
            </div>

            {/* Existing modules */}
            {mode === "existing" ? (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-sm font-medium text-slate-900">
                    Choose one or more modules{" "}
                    <span className="text-[11px] font-normal text-slate-500">
                      (Total: {totalModulesCount})
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={moduleSearch}
                      onChange={(e) => setModuleSearch(e.target.value)}
                      className="w-44 sm:w-56 rounded-md border border-slate-200 bg-white py-1.5 px-2 text-[11px] text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Search modules…"
                      disabled={!modules.length || loadingMods}
                    />

                    <button
                      type="button"
                      className="text-[10px] px-2 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100"
                      onClick={selectAllModules}
                      disabled={!filteredModules.length}
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      className="text-[10px] px-2 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100"
                      onClick={clearAllModules}
                      disabled={!modules.length}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-2 border border-slate-200 rounded-md p-2 max-h-56 overflow-auto bg-white">
                  {loadingMods ? (
                    <div className="text-xs text-slate-500">
                      Loading modules…
                    </div>
                  ) : modules.length ? (
                    filteredModules.length ? (
                      <div className="flex flex-wrap gap-3 text-xs">
                        {filteredModules.map((m) => (
                          <label
                            key={m._id}
                            htmlFor={`mod-${m._id}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                          >
                            <input
                              id={`mod-${m._id}`}
                              type="checkbox"
                              className="accent-indigo-600"
                              checked={selectedModuleIds.includes(m._id)}
                              onChange={() => toggleModuleId(m._id)}
                            />
                            <span className="text-slate-800">{m.name}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">
                        No module created as of not.
                      </div>
                    )
                  ) : (
                    <div className="text-xs text-slate-500">
                      No modules found.
                    </div>
                  )}
                </div>

                {noModuleMatch && (
                  <p className="mt-1 text-xs text-slate-500">
                    No module created as of not.
                  </p>
                )}

                {errors.modules && (
                  <p className="mt-1 text-xs text-red-600">{errors.modules}</p>
                )}
              </div>
            ) : (
              // New modules CSV
              <div>
                <label className="block text-sm font-medium text-slate-900">
                  New module names (comma separated)
                </label>
                <input
                  type="text"
                  className="mt-2 block w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={newModuleNamesCSV}
                  onChange={(e) => setNewModuleNamesCSV(e.target.value)}
                  placeholder="e.g., Homepage, Auth, Billing"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Names are normalized server-side to avoid duplicates. You can
                  enter one or many names separated by commas.
                </p>
                {errors.modules && (
                  <p className="mt-1 text-xs text-red-600">{errors.modules}</p>
                )}
              </div>
            )}

            {/* Submit messages */}
            {errors.submit && (
              <div className="text-xs text-red-600">{errors.submit}</div>
            )}
            {successMessage && (
              <div className="text-xs text-emerald-600">{successMessage}</div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-pill bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
              >
                {submitting ? "Adding…" : "Add Scenario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
