// src/pages/requirements/UpdateRequirement.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const GET_SINGLE_REQUIREMENT = (id) =>
  `${globalBackendRoute}/api/single-requirement/${id}`;
const PUT_REQUIREMENT = (id) =>
  `${globalBackendRoute}/api/update-requirement/${id}`;
const PROJECT_REQUIREMENTS_ROUTE = (projectId) =>
  `/all-requirements/${projectId}`;

const normalizeImageUrl = (urlOrPath) => {
  if (!urlOrPath)
    return "https://via.placeholder.com/1200x600?text=Requirement";
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const normalizedPath = String(urlOrPath)
    .replace(/\\/g, "/")
    .split("uploads/")
    .pop();
  return `${globalBackendRoute}/uploads/${normalizedPath}`;
};

export default function UpdateRequirement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // form state
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [build, setBuild] = useState("");
  const [reqNumber, setReqNumber] = useState("");
  const [images, setImages] = useState([]); // existing images
  const [newImages, setNewImages] = useState([]); // files to upload
  const [replaceAllImages, setReplaceAllImages] = useState(false);

  const [steps, setSteps] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchOne = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(GET_SINGLE_REQUIREMENT(id), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!isMounted) return;
        const d = res?.data;
        setProjectId(d?.project_id || "");
        setTitle(d?.requirement_title || "");
        setModuleName(d?.module_name || "");
        setDescription(d?.description || "");
        setBuild(d?.build_name_or_number || "");
        setReqNumber(d?.requirement_number || "");
        setImages(Array.isArray(d?.images) ? d.images : []);
        setSteps(
          Array.isArray(d?.steps) && d.steps.length
            ? d.steps.map((s, i) => ({
                step_number: s?.step_number ?? i + 1,
                instruction: s?.instruction || "",
                for: s?.for || "Both",
              }))
            : [{ step_number: 1, instruction: "", for: "Both" }]
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err?.response?.data?.error || "Failed to load requirement");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOne();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const normalizedImages = useMemo(
    () => (images || []).map(normalizeImageUrl),
    [images]
  );
  const cover = normalizedImages[0] || normalizeImageUrl(null);

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      { step_number: prev.length + 1, instruction: "", for: "Both" },
    ]);
  };

  const handleRemoveStep = (idx) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((s, i2) => ({ ...s, step_number: i2 + 1 }))
    );
  };

  const handleStepChange = (idx, field, value) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      // basic editable fields
      form.append("requirement_title", title);
      form.append("description", description);
      if (build) form.append("build_name_or_number", build);
      if (moduleName) form.append("module_name", moduleName);

      // steps as JSON (FULL REPLACEMENT)
      const stepsPayload = steps.map((s, idx) => ({
        step_number: idx + 1,
        instruction: String(s.instruction || "").trim(),
        for: s.for || "Both",
      }));
      form.append("steps", JSON.stringify(stepsPayload));
      form.append("steps_replace", "true"); // tell backend to replace steps

      // images
      if (replaceAllImages) {
        form.append("clear_images", "true"); // backend will clear existing gallery
      }
      newImages.forEach((f) => form.append("images", f)); // append new images

      // updated_by (optional; if you have auth middleware it will use req.user)
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?._id) form.append("updated_by", user._id);
      } catch (_) {}

      const res = await axios.put(PUT_REQUIREMENT(id), form, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      setMsg("✅ Requirement updated successfully.");
      // Refresh current data from response
      const d = res?.data?.data;
      if (d) {
        setImages(Array.isArray(d?.images) ? d.images : []);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading requirement…</div>
      </div>
    );
  }

  if (error && !projectId) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="mt-6 rounded-lg border p-6 bg-white">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Top actions */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back
            </button>

            {projectId && (
              <Link
                to={PROJECT_REQUIREMENTS_ROUTE(projectId)}
                className="text-sm text-indigo-600 hover:underline"
              >
                View all requirements for this project
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Full-width preview of current cover */}
      <div className="w-full">
        <img
          src={cover}
          alt={title || "Requirement"}
          className="w-75 max-h-[60vh] object-cover mx-auto rounded"
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 pb-14">
        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Title / Module / Build / Req# (Req# read-only for safety) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Requirement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Module
              </label>
              <input
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Module name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Build
              </label>
              <input
                value={build}
                onChange={(e) => setBuild(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., v1.2.3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirement #
              </label>
              <input
                value={reqNumber}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Describe the requirement..."
            />
          </div>

          {/* Images */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Images</h3>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={replaceAllImages}
                  onChange={(e) => setReplaceAllImages(e.target.checked)}
                />
                Replace all existing images with these
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {normalizedImages.map((src, idx) => (
                <a key={idx} href={src} target="_blank" rel="noreferrer">
                  <img
                    src={src}
                    alt={`Img ${idx + 1}`}
                    className="w-full h-24 object-cover border rounded-md"
                  />
                </a>
              ))}
              {!normalizedImages.length && (
                <div className="text-sm text-gray-500">No images yet.</div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewImages(Array.from(e.target.files || []))}
              className="block w-full text-sm text-gray-700"
            />
            <p className="text-xs text-gray-500">
              Tip: If you check “Replace all...”, old gallery images will be
              cleared on save. Otherwise, new images will be appended to the
              gallery and also auto-mapped to steps (by order) on backend.
            </p>
          </div>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Steps</h3>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
              >
                <FaPlus /> Add Step
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {steps.map((s, idx) => (
                <div key={idx} className="border rounded-md p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        Step {idx + 1}
                      </span>
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={s.for}
                        onChange={(e) =>
                          handleStepChange(idx, "for", e.target.value)
                        }
                      >
                        <option>Both</option>
                        <option>Dev</option>
                        <option>QA</option>
                      </select>
                    </div>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="inline-flex items-center gap-1 text-xs text-red-600"
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    className="mt-2 w-full border rounded-md px-3 py-2"
                    placeholder="Instruction..."
                    value={s.instruction}
                    onChange={(e) =>
                      handleStepChange(idx, "instruction", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              On save, steps are fully replaced with the list above. If you
              attach new images, the backend will map them by order to steps
              that don’t already have a step image.
            </p>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaSave /> Save Changes
            </button>
            {msg && <span className="text-sm text-emerald-700">{msg}</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
