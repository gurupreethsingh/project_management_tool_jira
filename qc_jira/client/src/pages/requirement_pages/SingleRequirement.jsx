import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaEdit,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const GET_SINGLE_REQUIREMENT = (id) =>
  `${globalBackendRoute}/api/single-requirement/${id}`;
const UPDATE_REQUIREMENT_ROUTE = (id) => `/update-requirement/${id}`;
const PROJECT_REQUIREMENTS_ROUTE = (projectId) =>
  `/all-requirements/${projectId}`;
const MODULE_REQUIREMENTS_ROUTE = (projectId, moduleName) =>
  `/module-requirements/${projectId}/${encodeURIComponent(moduleName)}`;

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

export default function SingleRequirement() {
  // ---- ROUTER ----
  const { id } = useParams();
  const { projectId } = useParams();
  const navigate = useNavigate();

  // ---- STATE (always declared; order never changes) ----
  const [reqData, setReqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [role, setRole] = useState("");

  // Lightbox UI state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  // ---- EFFECT: get role (once) ----
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role) setRole(user.role);
    } catch (_) {}
  }, []);

  // ---- EFFECT: fetch requirement by id ----
  useEffect(() => {
    let isMounted = true;
    const fetchOne = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(GET_SINGLE_REQUIREMENT(id), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!isMounted) return;
        setReqData(res?.data || null);
      } catch (err) {
        if (!isMounted) return;
        setFetchError(
          err?.response?.data?.error || "Failed to fetch requirement"
        );
        setReqData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOne();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // ---- DERIVED: permissions, normalized images, cover, etc. ----
  const canEdit = useMemo(() => {
    const r = (role || "").toLowerCase();
    return r === "superadmin" || r === "project_manager";
  }, [role]);

  // Safely unwrap reqData without causing re-renders in hook order
  const {
    _id,
    project_id,
    project_name,
    requirement_number,
    build_name_or_number,
    module_name,
    requirement_title,
    description,
    images = [],
    steps = [],
    createdAt,
  } = reqData || {};

  // Normalize gallery images (array of strings)
  const normalizedImages = useMemo(() => {
    const base = Array.isArray(images) ? images : [];
    return base.map(normalizeImageUrl);
  }, [images]);

  // Choose cover and “rest”
  const cover = useMemo(
    () => (normalizedImages[0] ? normalizedImages[0] : normalizeImageUrl(null)),
    [normalizedImages]
  );

  // ---- LIGHTBOX CALLBACKS (stable) ----
  const openLightbox = useCallback(
    (startIdx = 0) => {
      const gallery = normalizedImages.length ? normalizedImages : [cover];
      setLightboxImages(gallery);
      setLightboxIdx(Math.max(0, Math.min(startIdx, gallery.length - 1)));
      setLightboxOpen(true);
    },
    [normalizedImages, cover]
  );

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const prevImg = useCallback(
    (e) => {
      e?.stopPropagation?.();
      setLightboxIdx((i) => (i === 0 ? lightboxImages.length - 1 : i - 1));
    },
    [lightboxImages.length]
  );
  const nextImg = useCallback(
    (e) => {
      e?.stopPropagation?.();
      setLightboxIdx((i) => (i === lightboxImages.length - 1 ? 0 : i + 1));
    },
    [lightboxImages.length]
  );

  // ---- EFFECT: keyboard nav for lightbox (always called) ----
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, closeLightbox, prevImg, nextImg]);

  // ---- RENDER: build content but return once at the end (no early returns before hooks) ----
  let content = null;

  if (loading) {
    content = (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading requirement…</div>
      </div>
    );
  } else if (fetchError || !reqData) {
    content = (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="mt-6 rounded-lg border p-6 bg-white">
          <p className="text-red-600 font-medium">
            {fetchError || "Requirement not found."}
          </p>
        </div>
      </div>
    );
  } else {
    content = (
      <>
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-4">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900">
                Single Requirement
              </h2>
              {project_id && (
                <Link
                  to={PROJECT_REQUIREMENTS_ROUTE(project_id)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View all requirements for this project
                </Link>
              )}

              {project_id && module_name && (
                <Link
                  to={MODULE_REQUIREMENTS_ROUTE(project_id, module_name)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View {module_name} module list
                </Link>
              )}
            </div>

            {canEdit && _id && (
              <Link
                to={UPDATE_REQUIREMENT_ROUTE(_id)}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                title="Update requirement"
              >
                <FaEdit />
                Update
              </Link>
            )}

            {project_id && (
              <Link
                to={`/single-project/${project_id}`}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 text-sm"
              >
                Project Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Full-width hero image */}
        <div className="w-75 mx-auto">
          <img
            src={cover}
            alt={requirement_title || "Requirement"}
            className="w-full max-h-[70vh] object-cover cursor-zoom-in"
            onClick={() => openLightbox(0)}
          />
        </div>

        <div className="mx-auto max-w-6xl px-6 lg:px-8 pb-12">
          {/* Header */}
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {requirement_title || "(Untitled Requirement)"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {project_name && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                  Project: {project_name}
                </span>
              )}
              {module_name && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                  Module: {module_name}
                </span>
              )}
              {requirement_number && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                  Req#: {requirement_number}
                </span>
              )}
              {build_name_or_number && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                  Build: {build_name_or_number}
                </span>
              )}
              {createdAt && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                  Created: {new Date(createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {normalizedImages.length > 0 ? (
              normalizedImages.map((src, idx) => (
                <button
                  key={idx}
                  className="border rounded-md overflow-hidden hover:shadow"
                  onClick={() => openLightbox(idx)}
                  title={`Open image ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt={`Img ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500">No additional images.</div>
            )}
          </div>

          {/* Description */}
          <div className="mt-8 rounded-lg shadow-md bg-white p-3">
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line">
              {description || "No description provided."}
            </p>
          </div>

          {/* Steps */}
          <div className="mt-8 rounded-lg border bg-white p-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Development Steps
            </h2>
            {Array.isArray(steps) && steps.length > 0 ? (
              <ol className="mt-4 space-y-3">
                {steps.map((s, i) => {
                  const n = s?.step_number ?? i + 1;
                  const forWhom = s?.for || "Both";
                  const stepImg = s?.image_url
                    ? normalizeImageUrl(s.image_url)
                    : null;
                  return (
                    <li key={i} className="p-3 rounded-md border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Step {n}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                          For: {forWhom}
                        </span>
                      </div>
                      {stepImg && (
                        <div className="mt-2">
                          <img
                            src={stepImg}
                            alt={`Step ${n}`}
                            className="w-full max-h-64 object-cover rounded-md cursor-zoom-in"
                            onClick={() => openLightbox(0)} // opens gallery; customize if you want step images merged
                          />
                        </div>
                      )}
                      <p className="mt-2 text-gray-700 whitespace-pre-line">
                        {s?.instruction || "No instruction."}
                      </p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-2 text-gray-600">No steps added yet.</p>
            )}
          </div>
        </div>

        {/* LIGHTBOX */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              title="Close"
            >
              <FaTimes className="text-gray-700" />
            </button>

            <button
              className="absolute left-4 p-3 rounded-full bg-white/90 hover:bg-white"
              onClick={prevImg}
              title="Previous"
            >
              <FaChevronLeft className="text-gray-800" />
            </button>

            <img
              src={lightboxImages[lightboxIdx]}
              alt="Zoomed"
              className="max-w-[95vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-4 p-3 rounded-full bg-white/90 hover:bg-white"
              onClick={nextImg}
              title="Next"
            >
              <FaChevronRight className="text-gray-800" />
            </button>
          </div>
        )}
      </>
    );
  }

  // Single, final return (no hooks after this)
  return <div className="bg-white">{content}</div>;
}
