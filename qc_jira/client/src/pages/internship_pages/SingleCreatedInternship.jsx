import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const sectionCard =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";

const SingleCreatedInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const fetchSingleInternship = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await axios.get(
        `${globalBackendRoute}/api/internships/${id}`,
        {
          headers: authHeaders,
        },
      );

      setInternship(response?.data?.data || null);
    } catch (error) {
      console.error("Fetch single internship error:", error);
      setServerError(
        error?.response?.data?.message || "Failed to fetch internship details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleInternship();
  }, [id]);

  const doAction = async (type) => {
    try {
      setServerMessage("");
      setServerError("");

      let response = null;

      if (type === "publish") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/${id}/publish`,
          {},
          { headers: authHeaders },
        );
      } else if (type === "unpublish") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/${id}/unpublish`,
          {},
          { headers: authHeaders },
        );
      } else if (type === "restore") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/${id}/restore`,
          {},
          { headers: authHeaders },
        );
      } else if (type === "soft-delete") {
        const confirmed = window.confirm(
          "Are you sure you want to soft delete this internship?",
        );
        if (!confirmed) return;

        response = await axios.delete(
          `${globalBackendRoute}/api/internships/${id}/soft-delete`,
          {
            headers: authHeaders,
          },
        );
      } else if (type === "hard-delete") {
        const confirmed = window.confirm(
          "This will permanently delete this internship. Continue?",
        );
        if (!confirmed) return;

        response = await axios.delete(
          `${globalBackendRoute}/api/internships/${id}/hard-delete`,
          {
            headers: authHeaders,
          },
        );

        setServerMessage(
          response?.data?.message || "Internship permanently deleted.",
        );

        setTimeout(() => {
          navigate("/all-created-internships");
        }, 700);
        return;
      } else if (type === "acceptance-letter") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/${id}/generate-acceptance-letter`,
          {},
          { headers: authHeaders },
        );
      } else if (type === "certificate") {
        response = await axios.patch(
          `${globalBackendRoute}/api/internships/${id}/generate-certificate`,
          {},
          { headers: authHeaders },
        );
      }

      setServerMessage(response?.data?.message || "Action completed.");
      fetchSingleInternship();
    } catch (error) {
      console.error("Single internship action error:", error);
      setServerError(
        error?.response?.data?.message || "Failed to perform action.",
      );
    }
  };

  const renderArrayList = (label, arr) => (
    <div className={sectionCard}>
      <h3 className="text-sm font-bold text-slate-800">{label}</h3>
      {Array.isArray(arr) && arr.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {arr.map((item, index) => (
            <li
              key={`${label}-${index}`}
              className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          No {label.toLowerCase()} added.
        </p>
      )}
    </div>
  );

  const getStatusBadge = () => {
    if (!internship) return null;

    if (internship.isDeleted) {
      return (
        <span className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
          Deleted
        </span>
      );
    }

    if (internship.isPublished) {
      return (
        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
          Open
        </span>
      );
    }

    return (
      <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
        Closed
      </span>
    );
  };

  const getBooleanBadge = (value, yesLabel = "Yes", noLabel = "No") => {
    return value ? (
      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        {yesLabel}
      </span>
    ) : (
      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
        {noLabel}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-3 py-6">
        <div className="mx-auto w-full max-w-[98%] rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
          Loading internship details...
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-white px-3 py-6">
        <div className="mx-auto w-full max-w-[98%] rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm font-medium text-rose-700 shadow-sm">
          {serverError || "Internship not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-3 py-4 sm:px-4 lg:px-5">
      <div className="mx-auto w-full max-w-[98%]">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                {internship.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {getStatusBadge()}
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  internship
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {internship.department || "No department"}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {internship.preferredLocation || "No location"}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {internship.duration || "No duration"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/update-internship/${internship._id}`}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Update Internship
              </Link>

              {!internship.isDeleted && !internship.isPublished ? (
                <button
                  onClick={() => doAction("publish")}
                  className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Open
                </button>
              ) : null}

              {!internship.isDeleted && internship.isPublished ? (
                <button
                  onClick={() => doAction("unpublish")}
                  className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                >
                  Close
                </button>
              ) : null}

              {internship.isDeleted ? (
                <button
                  onClick={() => doAction("restore")}
                  className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Restore
                </button>
              ) : (
                <button
                  onClick={() => doAction("soft-delete")}
                  className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Soft Delete
                </button>
              )}

              <button
                onClick={() => doAction("acceptance-letter")}
                className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                Acceptance Letter
              </button>

              <button
                onClick={() => doAction("certificate")}
                className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
              >
                Certificate
              </button>

              <button
                onClick={() => doAction("hard-delete")}
                className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                Permanent Delete
              </button>
            </div>
          </div>
        </div>

        {serverMessage ? (
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {serverMessage}
          </div>
        ) : null}

        {serverError ? (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {serverError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">
                Short Description
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-700">
                {internship.shortDescription || "No short description added."}
              </p>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">
                Full Description
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-700">
                {internship.description || "No full description added."}
              </p>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">
                Training Details
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-700">
                {internship.trainingDetails || "No training details added."}
              </p>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">
                Project Details
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-700">
                {internship.projectDetails || "No project details added."}
              </p>
            </div>

            {renderArrayList("Tech Stack", internship.techStack)}
          </div>

          <div className="space-y-4">
            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">Overview</h2>
              <div className="mt-3 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Slug</span>
                  <span className="text-right">{internship.slug || "-"}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Department</span>
                  <span>{internship.department || "-"}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Domain</span>
                  <span>{internship.domain || "-"}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Mode</span>
                  <span>{internship.mode || "-"}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Duration</span>
                  <span>{internship.duration || "-"}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Location</span>
                  <span>{internship.preferredLocation || "-"}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Openings</span>
                  <span>{internship.openingsCount || 0}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Students Allowed</span>
                  <span>{internship.totalStudentsAllowed || 0}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <span className="font-semibold">Views</span>
                  <span>{internship.viewsCount || 0}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">Applications</span>
                  <span>{internship.totalApplications || 0}</span>
                </div>
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">Payment</h2>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {internship.paymentType || "-"}
                </p>
                <p>
                  <span className="font-semibold">Stipend:</span>{" "}
                  {internship.stipendAmount ?? "-"} {internship.currency || ""}
                </p>
                <p>
                  <span className="font-semibold">Fees:</span>{" "}
                  {internship.feesAmount ?? "-"} {internship.currency || ""}
                </p>
                <p>
                  <span className="font-semibold">Fees Status:</span>{" "}
                  {internship.feesPaymentStatus || "-"}
                </p>
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">
                Student Tracking
              </h2>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <p>
                  <span className="font-semibold">Applied:</span>{" "}
                  {internship.totalApplications || 0}
                </p>
                <p>
                  <span className="font-semibold">Selected:</span>{" "}
                  {internship.totalSelectedStudents || 0}
                </p>
                <p>
                  <span className="font-semibold">Active:</span>{" "}
                  {internship.totalActiveInterns || 0}
                </p>
                <p>
                  <span className="font-semibold">Completed:</span>{" "}
                  {internship.totalCompletedInterns || 0}
                </p>
                <p>
                  <span className="font-semibold">Dropped:</span>{" "}
                  {internship.totalDroppedInterns || 0}
                </p>
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">
                Submission Status
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {getBooleanBadge(
                  internship?.submissionStatus?.synopsisSubmitted,
                  "Synopsis Submitted",
                  "Synopsis Pending",
                )}
                {getBooleanBadge(
                  internship?.submissionStatus?.codeSubmitted,
                  "Code Submitted",
                  "Code Pending",
                )}
                {getBooleanBadge(
                  internship?.submissionStatus?.projectReportSubmitted,
                  "Report Submitted",
                  "Report Pending",
                )}
                {getBooleanBadge(
                  internship?.submissionStatus?.vivaCompleted,
                  "Viva Completed",
                  "Viva Pending",
                )}
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">
                Documents Status
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {getBooleanBadge(
                  internship?.documents?.acceptanceLetterGenerated,
                  "Acceptance Letter Generated",
                  "Acceptance Letter Pending",
                )}
                {getBooleanBadge(
                  internship?.documents?.certificateGenerated,
                  "Certificate Generated",
                  "Certificate Pending",
                )}
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">Timeline</h2>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <p>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {internship.startDate
                    ? new Date(internship.startDate).toLocaleDateString()
                    : "Not set"}
                </p>
                <p>
                  <span className="font-semibold">End Date:</span>{" "}
                  {internship.endDate
                    ? new Date(internship.endDate).toLocaleDateString()
                    : "Not set"}
                </p>
                <p>
                  <span className="font-semibold">Deadline:</span>{" "}
                  {internship.applicationDeadline
                    ? new Date(
                        internship.applicationDeadline,
                      ).toLocaleDateString()
                    : "Not set"}
                </p>
                <p>
                  <span className="font-semibold">Created:</span>{" "}
                  {internship.createdAt
                    ? new Date(internship.createdAt).toLocaleString()
                    : "-"}
                </p>
                <p>
                  <span className="font-semibold">Updated:</span>{" "}
                  {internship.updatedAt
                    ? new Date(internship.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {internship.skills?.length ? (
                  internship.skills.map((item, index) => (
                    <span
                      key={`skill-${index}`}
                      className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No skills added.</p>
                )}
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-sm font-bold text-slate-800">Tags</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {internship.tags?.length ? (
                  internship.tags.map((item, index) => (
                    <span
                      key={`tag-${index}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No tags added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCreatedInternship;
