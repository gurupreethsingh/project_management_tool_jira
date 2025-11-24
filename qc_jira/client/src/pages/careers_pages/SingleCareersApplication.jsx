// src/pages/admin/SingleCareersApplication.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaUserTie,
  FaClock,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const STATUS_LABELS = {
  pending: "Pending review",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  rejected: "Rejected",
  on_hold: "On hold",
};

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  shortlisted: "bg-sky-50 text-sky-700 border-sky-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  on_hold: "bg-slate-50 text-slate-700 border-slate-200",
};

function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || "Pending";
  const classes =
    STATUS_COLORS[status] || "bg-slate-50 text-slate-700 border-slate-200";

  let icon = <FaHourglassHalf className="text-[11px]" />;
  if (status === "accepted") icon = <FaCheckCircle className="text-[11px]" />;
  if (status === "rejected") icon = <FaTimesCircle className="text-[11px]" />;
  if (status === "shortlisted") icon = <FaUserTie className="text-[11px]" />;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${classes}`}
    >
      {icon}
      {label}
    </span>
  );
}

export default function SingleCareersApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailStatus, setEmailStatus] = useState(""); // optional status change
  const [emailSending, setEmailSending] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailError, setEmailError] = useState("");

  const fetchApp = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        setLoadError(
          "You are not authorized. Please log in again as admin / superadmin."
        );
        setLoading(false);
        return;
      }

      const res = await axios.get(`${globalBackendRoute}/api/careers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.status) {
        setApp(res.data.item);
        setEmailSubject(
          `Update on your ${res.data.item.applyType} application at Ecoders`
        );
      } else {
        setLoadError(res.data?.message || "Failed to load application.");
      }
    } catch (err) {
      console.error("SingleCareersApplication fetch error:", err);
      if (err?.response?.status === 401) {
        setLoadError(
          "Unauthorized (401). Please ensure you are logged in as admin / superadmin."
        );
      } else {
        setLoadError("Error loading application.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!app) return;
    try {
      setSavingStatus(true);
      setStatusError("");
      setStatusSuccess("");

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        setStatusError(
          "You are not authorized. Please log in again as admin / superadmin."
        );
        setSavingStatus(false);
        return;
      }

      const res = await axios.patch(
        `${globalBackendRoute}/api/careers/${app._id}/status`,
        { status: newStatus, sendEmail: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.status) {
        setApp(res.data.item);
        setStatusSuccess(`Status updated to "${newStatus}".`);
      } else {
        setStatusError(res.data?.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      if (err?.response?.status === 401) {
        setStatusError(
          "Unauthorized (401). Please ensure you are logged in as admin / superadmin."
        );
      } else {
        setStatusError("Error updating status.");
      }
    } finally {
      setSavingStatus(false);
    }
  };

  const handleEmailSend = async (e) => {
    e.preventDefault();
    if (!app) return;
    if (!emailSubject.trim() || !emailBody.trim()) {
      setEmailError("Subject and message are required.");
      return;
    }

    try {
      setEmailSending(true);
      setEmailMsg("");
      setEmailError("");

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        setEmailError(
          "You are not authorized. Please log in again as admin / superadmin."
        );
        setEmailSending(false);
        return;
      }

      const payload = {
        subject: emailSubject,
        body: emailBody,
      };
      if (emailStatus) {
        payload.status = emailStatus;
      }

      const res = await axios.post(
        `${globalBackendRoute}/api/careers/${app._id}/email`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.status) {
        setApp(res.data.item);
        setEmailMsg("Email sent successfully.");
      } else {
        setEmailError(res.data?.message || "Failed to send email.");
      }
    } catch (err) {
      console.error("Email send error:", err);
      if (err?.response?.status === 401) {
        setEmailError(
          "Unauthorized (401). Please ensure you are logged in as admin / superadmin."
        );
      } else {
        setEmailError("Error sending email.");
      }
    } finally {
      setEmailSending(false);
    }
  };

  // 🔹 NEW: view / open file in new tab with auth token
  const handleViewFile = async (file) => {
    if (!app) return;

    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        alert(
          "You are not authorized. Please log in again as admin / superadmin."
        );
        return;
      }

      const url = `${globalBackendRoute}/api/careers/${app._id}/files/${file._id}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/octet-stream",
      });

      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("Error viewing file:", err);
      alert("Error opening file. Check console for details.");
    }
  };

  // Loading / error states
  if (loading && !app) {
    return (
      <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-slate-600 mb-4"
        >
          <FaArrowLeft /> Back
        </button>
        <p className="text-xs text-slate-500">Loading application…</p>
      </div>
    );
  }

  if (loadError && !app) {
    return (
      <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-slate-600 mb-4"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {loadError}
        </div>
      </div>
    );
  }

  if (!app) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto container px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Header */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-slate-600 mb-4 hover:text-slate-800"
        >
          <FaArrowLeft /> Back to applications
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold text-slate-900">
              {app.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {app.applyType === "job" ? "Job" : "Internship"} application •{" "}
              {app.desiredRole || "No specific role"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-xs sm:text-sm">
            <StatusBadge status={app.status || "pending"} />
            <p className="text-[11px] text-slate-500">
              Applied:{" "}
              {app.createdAt ? new Date(app.createdAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1.1fr)] gap-5">
          {/* Left: Application details + status buttons */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 text-xs sm:text-sm">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
                Applicant details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Detail label="Name" value={app.fullName} />
                <Detail
                  label="Apply type"
                  value={app.applyType === "job" ? "Job" : "Internship"}
                />
                <Detail label="Desired role" value={app.desiredRole || "—"} />
                <Detail
                  label="Experience level"
                  value={app.experienceLevel || "—"}
                />
                <Detail
                  label="Preferred location"
                  value={app.preferredLocation || "—"}
                  icon={<FaMapMarkerAlt className="text-slate-500" />}
                />
                <Detail
                  label="Portfolio / GitHub"
                  value={app.portfolioUrl || "—"}
                  isLink={!!app.portfolioUrl}
                  icon={<FaGlobe className="text-slate-500" />}
                />
                <Detail
                  label="LinkedIn"
                  value={app.linkedinUrl || "—"}
                  isLink={!!app.linkedinUrl}
                  icon={<FaGlobe className="text-slate-500" />}
                />
                <Detail
                  label="Email"
                  value={app.email}
                  icon={<FaEnvelope className="text-slate-500" />}
                />
                <Detail
                  label="Phone"
                  value={app.phone || "—"}
                  icon={<FaPhone className="text-slate-500" />}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 text-xs sm:text-sm">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
                About the candidate
              </h2>
              <p className="whitespace-pre-wrap text-slate-700">
                {app.aboutYou}
              </p>
            </div>

            {app.files && app.files.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 text-xs sm:text-sm">
                <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
                  Attachments
                </h2>
                <ul className="space-y-1 text-[11px] sm:text-xs">
                  {app.files.map((f) => (
                    <li key={f._id}>
                      <button
                        type="button"
                        onClick={() => handleViewFile(f)}
                        className="text-indigo-600 hover:underline"
                      >
                        {f.originalName}{" "}
                        <span className="text-slate-400">
                          ({Math.round(f.size / 1024)} KB)
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 text-xs sm:text-sm">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
                Status &amp; actions
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 mb-2">
                Update the application status. Emails are sent separately in the
                panel on the right.
              </p>
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  label="Mark as shortlisted"
                  onClick={() => handleStatusUpdate("shortlisted")}
                  variant="sky"
                  disabled={savingStatus}
                />
                <ActionButton
                  label="Accept"
                  onClick={() => handleStatusUpdate("accepted")}
                  variant="emerald"
                  disabled={savingStatus}
                />
                <ActionButton
                  label="Reject"
                  onClick={() => handleStatusUpdate("rejected")}
                  variant="rose"
                  disabled={savingStatus}
                />
                <ActionButton
                  label="Set on hold"
                  onClick={() => handleStatusUpdate("on_hold")}
                  variant="slate"
                  disabled={savingStatus}
                />
                <ActionButton
                  label="Reset to pending"
                  onClick={() => handleStatusUpdate("pending")}
                  variant="amber"
                  disabled={savingStatus}
                />
              </div>
              {statusSuccess && (
                <p className="mt-2 text-[11px] text-emerald-600">
                  {statusSuccess}
                </p>
              )}
              {statusError && (
                <p className="mt-2 text-[11px] text-rose-600">{statusError}</p>
              )}
            </div>
          </div>

          {/* Right: Email panel */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 text-xs sm:text-sm">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
              Email applicant
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 mb-3">
              Use this panel to send a custom email when the application is
              accepted or rejected. You can optionally update the status at the
              same time.
            </p>

            <form onSubmit={handleEmailSend} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Subject line for the applicant"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Message
                </label>
                <textarea
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Hi ${app.fullName},

Thank you for your application...

(Explain if they are accepted, rejected, or shortlisted, and any next steps.)`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Also update status (optional)
                </label>
                <select
                  value={emailStatus}
                  onChange={(e) => setEmailStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Do not change status</option>
                  <option value="accepted">Set to accepted</option>
                  <option value="rejected">Set to rejected</option>
                  <option value="shortlisted">Set to shortlisted</option>
                  <option value="on_hold">Set to on hold</option>
                  <option value="pending">Set to pending</option>
                </select>
              </div>

              {emailMsg && (
                <p className="text-[11px] text-emerald-600">{emailMsg}</p>
              )}
              {emailError && (
                <p className="text-[11px] text-rose-600">{emailError}</p>
              )}

              <button
                type="submit"
                disabled={emailSending}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-2 text-xs sm:text-sm font-medium text-white shadow-md hover:shadow-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {emailSending ? "Sending…" : "Send email"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small helpers */

function Detail({ label, value, icon, isLink }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">
        {label}
      </div>
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-800">
        {icon && <span>{icon}</span>}
        {isLink && value && value !== "—" ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <span className="break-all">{value}</span>
        )}
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, variant, disabled }) {
  const palette = {
    emerald: "border-emerald-500 bg-emerald-50 text-emerald-700",
    rose: "border-rose-500 bg-rose-50 text-rose-700",
    sky: "border-sky-500 bg-sky-50 text-sky-700",
    amber: "border-amber-500 bg-amber-50 text-amber-700",
    slate: "border-slate-400 bg-slate-50 text-slate-700",
  }[variant || "slate"];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] sm:text-xs shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${palette}`}
    >
      {label}
    </button>
  );
}
