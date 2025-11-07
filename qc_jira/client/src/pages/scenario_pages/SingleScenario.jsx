import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

const UNASSIGNED_LABEL = "Unassigned";

export default function SingleScenario() {
  const { projectId, scenarioId } = useParams();
  const [scenario, setScenario] = useState(null);
  const [changes, setChanges] = useState([]);
  const [updatedText, setUpdatedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // modules state (for management)
  const [allModules, setAllModules] = useState([]); // [{_id, name}, ...]
  const [selectedForReplace, setSelectedForReplace] = useState([]); // multi-select state
  const [addModuleId, setAddModuleId] = useState(""); // quick add select

  const token = useMemo(() => localStorage.getItem("token"), []);
  const userId = useMemo(() => localStorage.getItem("userId"), []);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const fetchScenario = async () => {
    try {
      const { data } = await axios.get(
        `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
        { headers: authHeaders }
      );
      setScenario(data.scenario);
      setChanges(data.changes || []);
      setUpdatedText(data.scenario?.scenario_text || "");

      // initialize the replace multiselect from scenario.modules
      const currentIds = (data.scenario?.modules || [])
        .filter(Boolean)
        .map((m) => (typeof m === "object" ? m._id : m));
      setSelectedForReplace(currentIds);
    } catch (err) {
      console.error("Error fetching scenario details:", err);
      alert("Failed to load scenario.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllModules = async () => {
    try {
      const { data } = await axios.get(
        `${globalBackendRoute}/api/single-projects/${projectId}/modules`,
        { headers: authHeaders }
      );
      setAllModules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading modules:", err);
      setAllModules([]);
    }
  };

  useEffect(() => {
    fetchScenario();
    fetchAllModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, scenarioId]);

  const handleUpdateScenarioText = async () => {
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }
    if (!updatedText.trim()) {
      alert("Scenario text cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        { scenario_text: updatedText, userId },
        { headers: authHeaders }
      );
      // optimistic
      setScenario((prev) =>
        prev ? { ...prev, scenario_text: updatedText } : prev
      );
      await fetchScenario();
      alert("Scenario updated successfully.");
    } catch (err) {
      console.error("Error updating scenario:", err);
      alert("Error updating scenario");
    } finally {
      setSaving(false);
    }
  };

  /* --------------------- Module helpers & actions --------------------- */

  const getAssignedModules = (s) =>
    Array.isArray(s?.modules) ? s.modules.filter(Boolean) : [];

  const assignedModules = getAssignedModules(scenario);
  const assignedIds = new Set(assignedModules.map((m) => String(m._id)));

  const unassignedLabel = assignedModules.length === 0 ? UNASSIGNED_LABEL : "";

  // Quick add: add another module (non-replacing)
  const handleAddModule = async () => {
    if (!addModuleId) return;
    try {
      await axios.post(
        `${globalBackendRoute}/api/single-projects/${projectId}/scenarios/transfer`,
        { scenarioIds: [scenarioId], toModuleId: addModuleId },
        { headers: authHeaders }
      );
      await fetchScenario();
      alert("Module added to scenario.");
      setAddModuleId("");
    } catch (err) {
      console.error("Error adding module:", err);
      alert("Failed to add module.");
    }
  };

  // Remove a single module: we replace the full set minus this id
  const handleRemoveModule = async (removeId) => {
    const nextIds = (scenario?.modules || [])
      .map((m) => (typeof m === "object" ? m._id : m))
      .filter((id) => String(id) !== String(removeId));

    try {
      await axios.put(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        { moduleIds: nextIds, userId }, // full replacement, controller keeps legacy `module` in sync
        { headers: authHeaders }
      );
      await fetchScenario();
      alert("Module removed from scenario.");
    } catch (err) {
      console.error("Error removing module:", err);
      alert("Failed to remove module.");
    }
  };

  // Make Unassigned: clear all modules
  const handleMakeUnassigned = async () => {
    try {
      await axios.post(
        `${globalBackendRoute}/api/single-projects/${projectId}/scenarios/detach`,
        { scenarioIds: [scenarioId] },
        { headers: authHeaders }
      );
      await fetchScenario();
      alert("Scenario is now Unassigned.");
    } catch (err) {
      console.error("Error detaching scenario:", err);
      alert("Failed to make Unassigned.");
    }
  };

  // Full replace using the multiselect
  const handleReplaceModules = async () => {
    try {
      await axios.put(
        `${globalBackendRoute}/api/single-project/scenario/${scenarioId}`,
        { moduleIds: selectedForReplace, userId },
        { headers: authHeaders }
      );
      await fetchScenario();
      alert("Modules updated.");
    } catch (err) {
      console.error("Error replacing modules:", err);
      alert("Failed to replace modules.");
    }
  };

  const toggleReplaceSelection = (id) => {
    setSelectedForReplace((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const createdAtText = useMemo(
    () =>
      scenario?.createdAt ? new Date(scenario.createdAt).toLocaleString() : "",
    [scenario?.createdAt]
  );

  if (loading)
    return <div className="p-6 text-sm text-slate-600">Loading…</div>;
  if (!scenario)
    return <div className="p-6 text-sm text-rose-700">Scenario not found.</div>;

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex justify-between items-center gap-3 flex-wrap mb-4">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              Project: {scenario?.project?.project_name || "—"}
            </h2>

            {/* Scenario + Modules */}
            <div className="text-xs text-slate-600 mt-1">
              <span>
                Scenario:{" "}
                <span className="font-semibold text-slate-800">
                  {scenario.scenario_number}
                </span>
              </span>
              <span className="mx-2">·</span>
              <span className="font-semibold text-slate-700">
                Modules:
              </span>{" "}
              {assignedModules.length ? (
                <span className="inline-flex flex-wrap gap-1 align-middle">
                  {assignedModules.map((m) => (
                    <span
                      key={m._id}
                      className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
                      title={m.name}
                    >
                      {m.name}
                      <button
                        className="ml-1 text-[11px] text-indigo-700 hover:text-indigo-900"
                        onClick={() => handleRemoveModule(m._id)}
                        title="Remove from this scenario"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                  {unassignedLabel}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              Created by{" "}
              <span className="font-medium text-indigo-700">
                {scenario?.createdBy?.name || "Unknown"}
              </span>{" "}
              on {createdAtText}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/single-project/${projectId}/view-all-scenarios`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              View All Scenarios
            </Link>
            <Link
              to={`/single-project/${projectId}/scenario/${scenarioId}/add-test-case`}
              state={{
                scenarioNumber: scenario.scenario_number,
                scenarioText: scenario.scenario_text,
              }}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              Add Test Case
            </Link>
            <Link
              to={`/single-project/${projectId}/all-test-cases`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              View All Test Cases
            </Link>
            <Link
              to={`/single-project/${projectId}`}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
            >
              Project Dashboard
            </Link>
          </div>
        </div>

        {/* Scenario Text Editor */}
        <div className="bg-white rounded-lg shadow border border-slate-200 p-4">
          <label
            htmlFor="scenario_text"
            className="block text-sm font-semibold text-slate-700"
          >
            Scenario Text
          </label>
          <textarea
            id="scenario_text"
            className="w-full mt-2 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            rows={5}
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleUpdateScenarioText}
              disabled={saving}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : "Update Scenario"}
            </button>
          </div>
        </div>

        {/* Module Management */}
        <div className="mt-8 bg-white rounded-lg shadow border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Manage Modules
          </h3>

          {/* Quick add to another module */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={addModuleId}
              onChange={(e) => setAddModuleId(e.target.value)}
            >
              <option value="">Select module to add…</option>
              {allModules
                .filter((m) => !assignedIds.has(String(m._id)))
                .map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
            </select>
            <button
              onClick={handleAddModule}
              disabled={!addModuleId}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm disabled:opacity-60"
            >
              Add
            </button>

            <button
              onClick={handleMakeUnassigned}
              className="ml-auto px-3 py-1.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 text-sm"
              title="Clear all modules for this scenario"
            >
              Make Unassigned
            </button>
          </div>

          {/* Replace entire set via multi-select */}
          <div className="mt-5">
            <p className="text-[12px] text-slate-600 mb-2">
              Or select modules below and click <b>Save Modules</b> to replace
              the entire set.
            </p>
            <div className="max-h-56 overflow-auto border rounded-md p-2">
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {allModules.map((m) => {
                  const id = String(m._id);
                  const checked = selectedForReplace.includes(id);
                  return (
                    <li key={id} className="flex items-center">
                      <input
                        id={`rep-${id}`}
                        type="checkbox"
                        className="mr-2"
                        checked={checked}
                        onChange={() => toggleReplaceSelection(id)}
                      />
                      <label
                        htmlFor={`rep-${id}`}
                        className="text-[12px] text-slate-800"
                      >
                        {m.name}
                      </label>
                    </li>
                  );
                })}
                {allModules.length === 0 && (
                  <li className="text-[12px] text-slate-500">
                    No modules found for this project.
                  </li>
                )}
              </ul>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleReplaceModules}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
              >
                Save Modules
              </button>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="mt-8 bg-white rounded-lg shadow border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Changes History
          </h3>
          {changes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-[12px] text-slate-600 border-b border-slate-200">
                    <th className="text-left py-2 pr-4">Changed By</th>
                    <th className="text-left py-2 pr-4">Previous Text</th>
                    <th className="text-left py-2">Change Time</th>
                  </tr>
                </thead>
                <tbody className="text-[12px]">
                  {changes.map((c, i) => (
                    <tr key={i} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-4 text-indigo-700 font-medium">
                        {c?.user?.name || "Unknown"}
                      </td>
                      <td className="py-2 pr-4 text-slate-700">
                        {c?.previous_text}
                      </td>
                      <td className="py-2 text-slate-600">
                        {c?.time ? new Date(c.time).toLocaleString() : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[13px] text-slate-600">
              No changes have been made to this scenario yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
