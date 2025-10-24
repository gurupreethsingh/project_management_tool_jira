import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/Config";

export default function SingleScenario() {
  const { projectId, scenarioId } = useParams();
  const [scenario, setScenario] = useState(null);
  const [changes, setChanges] = useState([]);
  const [updatedText, setUpdatedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const userId = useMemo(() => localStorage.getItem("userId"), []);

  const fetchScenario = async () => {
    try {
      const { data } = await axios.get(
        `${globalBackendRoute}/api/single-project/${projectId}/scenario-history/${scenarioId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setScenario(data.scenario);
      setChanges(data.changes || []);
      setUpdatedText(data.scenario?.scenario_text || "");
    } catch (err) {
      console.error("Error fetching scenario details:", err);
      alert("Failed to load scenario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, scenarioId]);

  const handleUpdateScenario = async () => {
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
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      // optimistic update of scenario body
      setScenario((prev) => (prev ? { ...prev, scenario_text: updatedText } : prev));
      // refresh history (fast follow-up call, keeps UI in sync)
      fetchScenario();
      alert("Scenario updated successfully.");
    } catch (err) {
      console.error("Error updating scenario:", err);
      alert("Error updating scenario");
    } finally {
      setSaving(false);
    }
  };

  const createdAtText = useMemo(
    () => (scenario?.createdAt ? new Date(scenario.createdAt).toLocaleString() : ""),
    [scenario?.createdAt]
  );

  if (loading) return <div className="p-6 text-sm text-slate-600">Loading…</div>;
  if (!scenario) return <div className="p-6 text-sm text-rose-700">Scenario not found.</div>;

  const moduleName = scenario?.module?.name || "Unassigned";

  return (
    <div className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex justify-between items-center gap-3 flex-wrap mb-4">
          <div>
            <h2 className="font-semibold tracking-tight text-indigo-600 text-lg">
              Project: {scenario?.project?.project_name || "—"}
            </h2>
            <p className="text-xs text-slate-600">
              Scenario: <span className="font-semibold text-slate-800">{scenario.scenario_number}</span>{" "}
              · Module:{" "}
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                {moduleName}
              </span>
            </p>
            <p className="text-[11px] text-slate-500">
              Created by <span className="font-medium text-indigo-700">{scenario?.createdBy?.name || "Unknown"}</span>{" "}
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
              state={{ scenarioNumber: scenario.scenario_number, scenarioText: scenario.scenario_text }}
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

        {/* Editor Card */}
        <div className="bg-white rounded-lg shadow border border-slate-200 p-4">
          <label htmlFor="scenario_text" className="block text-sm font-semibold text-slate-700">
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
              onClick={handleUpdateScenario}
              disabled={saving}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : "Update Scenario"}
            </button>
          </div>
        </div>

        {/* History */}
        <div className="mt-8 bg-white rounded-lg shadow border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Changes History</h3>
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
                      <td className="py-2 pr-4 text-indigo-700 font-medium">{c?.user?.name || "Unknown"}</td>
                      <td className="py-2 pr-4 text-slate-700">{c?.previous_text}</td>
                      <td className="py-2 text-slate-600">
                        {c?.time ? new Date(c.time).toLocaleString() : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[13px] text-slate-600">No changes have been made to this scenario yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
