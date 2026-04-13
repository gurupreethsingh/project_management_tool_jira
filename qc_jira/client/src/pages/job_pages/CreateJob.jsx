import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

const labelClass = "mb-1 block text-xs font-semibold text-slate-700";
const cardClass = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";
const sectionTitleClass = "text-sm font-bold text-slate-800";

const emptyJobForm = {
  title: "",
  slug: "",
  applyType: "job",
  department: "",
  experienceLevel: "",
  employmentMode: "",
  preferredLocation: "",
  openingsCount: 1,
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "INR",
  isSalaryVisible: false,
  shortDescription: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  skills: "",
  tags: "",
  applicationDeadline: "",
  externalApplyLink: "",
  isPublished: false,
};

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyJobForm);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  };

  const normalizeBaseUrl = () => {
    let base = (globalBackendRoute || "").trim();

    if (!base) return "http://localhost:5000";

    if (base.endsWith("/")) {
      base = base.slice(0, -1);
    }

    if (base.endsWith("/api")) {
      base = base.slice(0, -4);
    }

    return base;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const convertCommaSeparatedTextToArray = (value) =>
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const buildPayload = () => {
    return {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      applyType: formData.applyType,
      department: formData.department.trim(),
      experienceLevel: formData.experienceLevel.trim(),
      employmentMode: formData.employmentMode,
      preferredLocation: formData.preferredLocation.trim(),
      openingsCount: Number(formData.openingsCount) || 1,
      salaryMin: formData.salaryMin === "" ? null : Number(formData.salaryMin),
      salaryMax: formData.salaryMax === "" ? null : Number(formData.salaryMax),
      salaryCurrency: formData.salaryCurrency.trim() || "INR",
      isSalaryVisible: formData.isSalaryVisible,
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      responsibilities: convertCommaSeparatedTextToArray(
        formData.responsibilities,
      ),
      requirements: convertCommaSeparatedTextToArray(formData.requirements),
      benefits: convertCommaSeparatedTextToArray(formData.benefits),
      skills: convertCommaSeparatedTextToArray(formData.skills),
      tags: convertCommaSeparatedTextToArray(formData.tags),
      applicationDeadline: formData.applicationDeadline || null,
      externalApplyLink: formData.externalApplyLink.trim(),
      isPublished: formData.isPublished,
    };
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setServerError("Job title is required.");
      return false;
    }

    if (
      formData.salaryMin !== "" &&
      formData.salaryMax !== "" &&
      Number(formData.salaryMin) > Number(formData.salaryMax)
    ) {
      setServerError("Salary Min cannot be greater than Salary Max.");
      return false;
    }

    if (Number(formData.openingsCount) < 1) {
      setServerError("Openings count must be at least 1.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    setServerError("");

    if (!validateForm()) return;

    const token = getToken();
    const baseUrl = normalizeBaseUrl();
    const requestUrl = `${baseUrl}/api/jobs`;

    if (!token) {
      setServerError("No auth token found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const payload = buildPayload();

      const response = await axios.post(requestUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setServerMessage(response?.data?.message || "Job created successfully.");
      setFormData(emptyJobForm);

      setTimeout(() => {
        navigate("/all-created-jobs");
      }, 800);
    } catch (error) {
      console.error("Create job error:", error);
      console.error("Create job response data:", error?.response?.data);
      console.error("Create job response status:", error?.response?.status);

      setServerError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to create job.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  px-4 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto w-full">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-4 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Create New Job
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Add a new job opening with compact details and publish settings.
          </p>
        </div>

        {serverMessage ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {serverMessage}
          </div>
        ) : null}

        {serverError ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {serverError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className={cardClass}>
              <h2 className={sectionTitleClass}>Basic Information</h2>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div>
                  <label className={labelClass}>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Senior React Developer"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="senior-react-developer"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Apply Type</label>
                    <select
                      name="applyType"
                      value={formData.applyType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="job">Job</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Engineering"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Experience</label>
                    <input
                      type="text"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      placeholder="2-5 years"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mode</label>
                    <select
                      name="employmentMode"
                      value={formData.employmentMode}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Openings</label>
                    <input
                      type="number"
                      min="1"
                      name="openingsCount"
                      value={formData.openingsCount}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Preferred Location</label>
                  <input
                    type="text"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    placeholder="Bangalore"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h2 className={sectionTitleClass}>Salary and Publish Options</h2>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Salary Min</label>
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      placeholder="300000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Salary Max</label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      placeholder="800000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Currency</label>
                    <input
                      type="text"
                      name="salaryCurrency"
                      value={formData.salaryCurrency}
                      onChange={handleChange}
                      placeholder="INR"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="isSalaryVisible"
                      checked={formData.isSalaryVisible}
                      onChange={handleChange}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                    />
                    Make salary visible
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                    />
                    Publish immediately
                  </label>
                </div>

                <div>
                  <label className={labelClass}>Application Deadline</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>External Apply Link</label>
                  <input
                    type="text"
                    name="externalApplyLink"
                    value={formData.externalApplyLink}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com/careers/apply"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Descriptions</h2>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass}>Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Short introduction for cards and listings."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Full Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Detailed job description..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className={cardClass}>
              <h2 className={sectionTitleClass}>
                Responsibilities and Requirements
              </h2>

              <div className="mt-3 space-y-3">
                <div>
                  <label className={labelClass}>
                    Responsibilities (comma separated)
                  </label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows={4}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Requirements (comma separated)
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={4}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h2 className={sectionTitleClass}>Benefits, Skills and Tags</h2>

              <div className="mt-3 space-y-3">
                <div>
                  <label className={labelClass}>
                    Benefits (comma separated)
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="react, node.js, mongodb"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="urgent, hiring, frontend"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/all-created-jobs")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Job..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
