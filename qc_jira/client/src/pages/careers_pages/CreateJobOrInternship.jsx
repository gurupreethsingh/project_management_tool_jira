import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaCode,
  FaClipboardList,
  FaBuilding,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const initialFormData = {
  applyType: "",
  fullName: "Ecoders Hiring Team",
  email: "",
  phone: "",
  desiredRole: "",
  experienceLevel: "",
  preferredLocation: "",
  aboutYou: "",
  skills: "",
  source: "admin_dashboard",
};

const inputBaseClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const inputWithIconClass =
  "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-600";

const primaryBtnClass =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60";

const secondaryBtnClass =
  "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700";

const cardClass = "rounded-2xl border border-slate-200 bg-white shadow-sm";
const selectedTypeBtn = "border-white bg-white text-slate-900 shadow-md";
const unselectedTypeBtn =
  "border-white/20 bg-white/10 text-white hover:bg-white/15";

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    sessionStorage.getItem("token") ||
    ""
  );
}

function getSafeErrorMessage(error) {
  const apiMessage = error?.response?.data?.message;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage.trim();
  }

  const status = error?.response?.status;

  if (status === 401) {
    return "You are not authorized. Please login again.";
  }

  if (status === 403) {
    return "You do not have permission to create this record.";
  }

  if (!navigator.onLine) {
    return "You appear to be offline. Please check your internet connection.";
  }

  return "Could not create the record right now. Please try again.";
}

function parseSkills(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function ToastStack({ toasts, onRemove }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,380px)] flex-col gap-3">
      {toasts.map((toast) => {
        const toneClass =
          toast.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-sky-200 bg-sky-50 text-sky-800";

        const icon =
          toast.type === "success" ? (
            <FaCheckCircle className="mt-0.5 shrink-0" />
          ) : toast.type === "error" ? (
            <FaExclamationCircle className="mt-0.5 shrink-0" />
          ) : (
            <FaInfoCircle className="mt-0.5 shrink-0" />
          );

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg ${toneClass}`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="mt-1 text-sm">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(toast.id)}
                className="rounded-md p-1 opacity-70 transition hover:opacity-100"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FormField({ label, required = false, children }) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function CreateJobOrInternship() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  useMemo(() => parseSkills(formData.skills), [formData.skills]);

  const showToast = (type, title, message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const resetForm = (keepType = false) => {
    setFormData((prev) => ({
      ...initialFormData,
      applyType: keepType ? prev.applyType : "",
      email: keepType ? prev.email : "",
      phone: keepType ? prev.phone : "",
    }));
  };

  const handleTypeSelection = (type) => {
    setFormData((prev) => ({
      ...initialFormData,
      applyType: type,
      email: prev.email,
      phone: prev.phone,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!formData.applyType) {
      showToast(
        "error",
        "Select type",
        "Please select Job or Internship first.",
      );
      return;
    }

    if (!formData.email.trim()) {
      showToast(
        "error",
        "Missing contact email",
        "Please enter the contact email for this posting.",
      );
      return;
    }

    if (!formData.desiredRole.trim()) {
      showToast(
        "error",
        "Missing title",
        formData.applyType === "job"
          ? "Please enter the job title."
          : "Please enter the internship title.",
      );
      return;
    }

    if (!formData.aboutYou.trim()) {
      showToast(
        "error",
        "Missing description",
        "Please enter the job or internship description.",
      );
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showToast(
        "error",
        "Authentication required",
        "Admin token not found. Please login again.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("fullName", "Ecoders Hiring Team");
      fd.append("email", formData.email.trim());
      fd.append("phone", formData.phone.trim());
      fd.append("applyType", formData.applyType);
      fd.append("desiredRole", formData.desiredRole.trim());
      fd.append("experienceLevel", formData.experienceLevel.trim());
      fd.append("preferredLocation", formData.preferredLocation.trim());
      fd.append("aboutYou", formData.aboutYou.trim());
      fd.append("skills", parseSkills(formData.skills));
      fd.append("source", "admin_dashboard");

      const response = await axios.post(
        `${globalBackendRoute}/api/careers`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        },
      );

      const isSuccess =
        response?.status === 201 || response?.data?.status === true;

      if (isSuccess) {
        showToast(
          "success",
          `${formData.applyType === "job" ? "Job" : "Internship"} created`,
          `${formData.desiredRole} was created successfully.`,
        );
        resetForm(true);
      } else {
        showToast(
          "error",
          "Creation failed",
          "Unexpected response received from the server.",
        );
      }
    } catch (error) {
      showToast("error", "Creation failed", getSafeErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <ToastStack toasts={toasts} onRemove={removeToast} />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 px-5 py-6 text-white shadow-lg sm:px-6 sm:py-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                Super Admin Career Management
              </p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                Create Job or Internship Details
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-white/85">
                Create only the posting details that candidates will later see
                and apply for. Candidate profile fields are intentionally
                removed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-auto">
              <button
                type="button"
                onClick={() => handleTypeSelection("job")}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  formData.applyType === "job"
                    ? selectedTypeBtn
                    : unselectedTypeBtn
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <FaBriefcase />
                  Job
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelection("internship")}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  formData.applyType === "internship"
                    ? selectedTypeBtn
                    : unselectedTypeBtn
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <FaGraduationCap />
                  Internship
                </span>
              </button>
            </div>
          </div>
        </div>

        {!formData.applyType ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <FaInfoCircle className="text-xl" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Select what you want to create
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              Choose either <b>Job</b> or <b>Internship</b> above. Then the
              correct posting form will open below.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className={`${cardClass} p-4 sm:p-5`}>
                <div className="mb-4 flex items-start gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-indigo-600">
                    {formData.applyType === "job" ? (
                      <FaBriefcase />
                    ) : (
                      <FaGraduationCap />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                      Posting Basics
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      These are the main fields that appear on the card and
                      details view.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <FormField label="Title" required>
                    <input
                      name="desiredRole"
                      type="text"
                      value={formData.desiredRole}
                      onChange={handleChange}
                      className={inputBaseClass}
                      placeholder={
                        formData.applyType === "job"
                          ? "Senior Frontend Developer"
                          : "Full Stack Internship"
                      }
                      required
                    />
                  </FormField>

                  <FormField label="Experience Level">
                    <input
                      name="experienceLevel"
                      type="text"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className={inputBaseClass}
                      placeholder={
                        formData.applyType === "job"
                          ? "2-4 years"
                          : "Fresher / Final Year"
                      }
                    />
                  </FormField>

                  <FormField label="Preferred Location">
                    <div className="relative">
                      <FaMapMarkerAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        name="preferredLocation"
                        type="text"
                        value={formData.preferredLocation}
                        onChange={handleChange}
                        className={inputWithIconClass}
                        placeholder="Remote / Bengaluru / Hybrid"
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              <div className={`${cardClass} p-4 sm:p-5`}>
                <div className="mb-4 flex items-start gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-indigo-600">
                    <FaBuilding />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                      Contact Details
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      These are admin-side contact fields for the posting.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <FormField label="Contact Email" required>
                    <div className="relative">
                      <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputWithIconClass}
                        placeholder="careers@company.com"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField label="Contact Phone">
                    <div className="relative">
                      <FaPhoneAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputWithIconClass}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </FormField>

                  <FormField label="Skills Required">
                    <textarea
                      name="skills"
                      rows={5}
                      value={formData.skills}
                      onChange={handleChange}
                      className={inputBaseClass}
                      placeholder="React, Node.js, MongoDB, Selenium, Java"
                    />
                  </FormField>
                </div>
              </div>

              <div className={`${cardClass} p-4 sm:p-5`}>
                <div className="mb-4 flex items-start gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-indigo-600">
                    <FaClipboardList />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                      Description
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      Add the full job or internship details candidates should
                      see.
                    </p>
                  </div>
                </div>

                <FormField label="Description" required>
                  <textarea
                    name="aboutYou"
                    rows={12}
                    value={formData.aboutYou}
                    onChange={handleChange}
                    className={inputBaseClass}
                    placeholder={
                      formData.applyType === "job"
                        ? "Describe the role, responsibilities, requirements, benefits, and hiring process."
                        : "Describe the internship, duration, learning outcomes, tasks, and eligibility."
                    }
                    required
                  />
                </FormField>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
              <div className="flex items-start gap-3">
                <FaCode className="mt-0.5 shrink-0" />
                <p>
                  This form now contains only posting-related fields.
                  Candidate-only fields like GitHub, portfolio, college, current
                  company, resume, and applicant experience details are removed.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm text-slate-600">
                This creates a record using your current admin careers create
                route and can be used as the current source for visible job or
                internship cards.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => resetForm(true)}
                  className={secondaryBtnClass}
                  disabled={submitting}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={primaryBtnClass}
                >
                  {submitting
                    ? "Creating..."
                    : `Create ${formData.applyType === "job" ? "Job" : "Internship"}`}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
