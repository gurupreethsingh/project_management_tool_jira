import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaFolderOpen,
  FaHashtag,
  FaInfoCircle,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const GET_REQS_BY_MODULE = (pid, m) =>
  `${globalBackendRoute}/api/projects/${pid}/modules/${encodeURIComponent(m)}/requirements`;

const SINGLE_REQUIREMENT_ROUTE = (id) => `/single-requirement/${id}`;
const PROJECT_REQUIREMENTS_ROUTE = (projectId) => `/all-requirements/${projectId}`;

export default function SingleModuleRequirements() {
  const { projectId, moduleName } = useParams();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    let isMounted = true;
    const fetchReqs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(GET_REQS_BY_MODULE(projectId, moduleName), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!isMounted) return;
        setRequirements(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!isMounted) return;
        setRequirements([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReqs();
    return () => {
      isMounted = false;
    };
  }, [projectId, moduleName]);

  const getCoverImage = (req) => {
    const first = Array.isArray(req.images) && req.images.length ? req.images[0] : null;
    if (!first) return "https://via.placeholder.com/600x400?text=Requirement";
    const normalizedPath = String(first).replace(/\\/g, "/").split("uploads/").pop();
    return `${globalBackendRoute}/uploads/${normalizedPath}`;
  };

  // >>> NEW: decide what to show as the card title
  const getDisplayTitle = (r) => {
    const title = (r.requirement_title || "").trim();
    const mod = (r.module_name || "").trim();
    if (!title) return r.requirement_number || "(Untitled Requirement)";
    // treat "Requirement for <module>" as auto-generated
    const isAuto =
      mod &&
      title.toLowerCase() === `requirement for ${mod.toLowerCase()}`;
    return isAuto ? (r.requirement_number || title) : title;
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let arr = requirements.filter((r) => {
      if (!query) return true;
      return [
        r.requirement_title,
        r.requirement_number,
        r.description,
        r.build_name_or_number,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase())
        .some((s) => s.includes(query));
    });

    arr.sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "Oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "Req# ↑":
          return String(a.requirement_number ?? "").localeCompare(
            String(b.requirement_number ?? ""),
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        case "Req# ↓":
          return String(b.requirement_number ?? "").localeCompare(
            String(a.requirement_number ?? ""),
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        default:
          return 0;
      }
    });

    return arr;
  }, [requirements, q, sortBy]);

  return (
    <div className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {moduleName} — Requirements
            </h2>
            <Link
              to={PROJECT_REQUIREMENTS_ROUTE(projectId)}
              className="text-xs sm:text-sm text-indigo-600 underline"
            >
              View all modules
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <input
              className="border rounded-md px-2 py-1.5 text-sm"
              placeholder="Search in module…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="border rounded-md px-2 py-1.5 text-sm bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Req# ↑</option>
              <option>Req# ↓</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="text-gray-500 col-span-full">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500 col-span-full">No requirements in this module.</div>
          ) : (
            filtered.map((r) => (
              <button
                key={r._id}
                onClick={() => navigate(SINGLE_REQUIREMENT_ROUTE(r._id))}
                className="bg-white rounded-lg shadow hover:shadow-md transition text-left"
                title="Open requirement"
              >
                <img
                  src={getCoverImage(r)}
                  alt={getDisplayTitle(r)}
                  className="w-full h-44 object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold">
                    <FaFolderOpen className="text-teal-600" />
                    <span className="line-clamp-1">
                      {getDisplayTitle(r)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2 flex items-start gap-2">
                    <FaInfoCircle className="mt-0.5 text-amber-600 flex-shrink-0" />
                    <span>{r.description || "No description"}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                    {r.requirement_number && (
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                        <FaHashtag /> {r.requirement_number}
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-full bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200 inline-flex items-center gap-1">
                      <FaCalendarAlt /> {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
                      <FaTag /> {r.status ?? "Unknown"}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
