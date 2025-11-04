// src/pages/tasks/AssignTask.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const AssignTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const api = `${globalBackendRoute}/api`;
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // Project + users
  const [projectName, setProjectName] = useState("");
  const [testEngineers, setTestEngineers] = useState([]);
  const [developers, setDevelopers] = useState([]);

  // Task fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");

  // Modules
  const [moduleOptions, setModuleOptions] = useState([]); // [{_id,name,key}]
  const [selectedModuleIds, setSelectedModuleIds] = useState([]); // existing module ids
  const [newModuleInput, setNewModuleInput] = useState("");
  const [newModuleNames, setNewModuleNames] = useState([]); // new names to create

  // UX
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setLoadErr("");

        const [proj, tes, devs, mods] = await Promise.all([
          axios.get(`${api}/single-project/${projectId}`, { headers }),
          axios.get(`${api}/projects/${projectId}/test-engineers`, { headers }),
          axios.get(`${api}/projects/${projectId}/developers`, { headers }),
          axios.get(`${api}/projects/${projectId}/modules`, { headers }),
        ]);

        setProjectName(
          proj?.data?.projectName || proj?.data?.project_name || ""
        );
        setTestEngineers(tes?.data?.testEngineers || []);
        setDevelopers(devs?.data?.developers || []);
        setModuleOptions(mods?.data || []);
      } catch (e) {
        console.error("AssignTask load error:", e?.response || e);
        setLoadErr(
          e?.response?.data?.message || "Failed to load project/users/modules."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [projectId, api, headers]);

  const validateDates = () => {
    if (!startDate || !deadline) return true;
    return new Date(startDate) <= new Date(deadline);
  };

  const toggleModuleId = (id) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addNewModule = () => {
    const v = (newModuleInput || "").trim();
    if (!v) return;

    const existsByName = moduleOptions.some(
      (m) => (m?.name || "").trim().toLowerCase() === v.toLowerCase()
    );
    const alreadyNew = newModuleNames.some(
      (n) => n.trim().toLowerCase() === v.toLowerCase()
    );
    if (existsByName || alreadyNew) {
      setStatusMsg("Module already exists or added.");
      return;
    }

    setNewModuleNames((prev) => [...prev, v]);
    setNewModuleInput("");
  };

  const removeNewModule = (name) => {
    setNewModuleNames((prev) => prev.filter((n) => n !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");

    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();
    const createdBy = user?.id || user?._id;

    if (!createdBy) {
      setStatusMsg("Not authenticated. Please sign in again.");
      return;
    }
    if (!validateDates()) {
      setStatusMsg("Start date must be before or equal to end date.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title,
        description,
        project: projectId,
        startDate,
        deadline,
        priority,
        assignedUsers: assignedTo ? [assignedTo] : [],
        moduleIds: selectedModuleIds,
        moduleNames: newModuleNames,
      };

      await axios.post(`${api}/tasks`, payload, { headers });

      navigate(`/single-project/${projectId}/view-all-tasks`);
    } catch (e) {
      console.error("AssignTask submit error:", e?.response || e);
      setStatusMsg(
        e?.response?.data?.message || "Failed to assign task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold mb-4">
          Assign Task — Project: {loading ? "Loading…" : projectName || "—"}
        </h2>
        <Link
          to={`/single-project/${projectId}`}
          className="btn btn-sm text-white bg-indigo-600 hover:bg-indigo-900"
        >
          Project Dashboard
        </Link>
      </div>

      {loading && <div className="text-sm text-gray-600">Loading…</div>}
      {loadErr && <div className="text-sm text-red-600 mb-3">{loadErr}</div>}

      {!loading && !loadErr && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {statusMsg && <div className="text-sm text-red-600">{statusMsg}</div>}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="border p-2 rounded w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="border p-2 rounded w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details for the assignee"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Priority + Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                className="border p-2 rounded w-full"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Assign To (Test Engineer / Developer)
              </label>
              <select
                className="border p-2 rounded w-full"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="">Select a user</option>
                {testEngineers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} — Test Engineer
                  </option>
                ))}
                {developers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} — Developer
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modules */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Modules (select one or more)
            </label>

            {moduleOptions.length === 0 ? (
              <div className="text-xs text-gray-500 mb-2">
                No modules found for this project. You can create new ones
                below.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
                {moduleOptions.map((m) => (
                  <label
                    key={m._id}
                    className="flex items-center gap-2 border rounded p-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedModuleIds.includes(m._id)}
                      onChange={() => toggleModuleId(m._id)}
                    />
                    <span className="text-sm">
                      {m.name}{" "}
                      <span className="text-xs text-gray-400">({m.key})</span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* New module adder */}
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Create new module(s)
              </label>
              <div className="flex gap-2">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Type a module name (e.g., Header) and click Add"
                  value={newModuleInput}
                  onChange={(e) => setNewModuleInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addNewModule}
                  className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Add
                </button>
              </div>

              {newModuleNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newModuleNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 rounded"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => removeNewModule(name)}
                        className="text-emerald-700 hover:text-emerald-900"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${
              submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {submitting ? "Assigning…" : "Assign Task"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AssignTask;
