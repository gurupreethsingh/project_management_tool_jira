import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass = "mb-1 block text-xs font-semibold text-slate-700";

const cardClass = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";

const initialState = {
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

const UpdateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const arrayToCommaText = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

  const convertCommaSeparatedTextToArray = (value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const fetchJobForEdit = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await axios.get(`${globalBackendRoute}/api/jobs/${id}`, {
        headers: authHeaders,
      });

      const job = response?.data?.data;

      if (!job) {
        setServerError("Job not found.");
        return;
      }

      setFormData({
        title: job.title || "",
        slug: job.slug || "",
        applyType: job.applyType || "job",
        department: job.department || "",
        experienceLevel: job.experienceLevel || "",
        employmentMode: job.employmentMode || "",
        preferredLocation: job.preferredLocation || "",
        openingsCount: job.openingsCount || 1,
        salaryMin:
          job.salaryMin === null || job.salaryMin === undefined
            ? ""
            : job.salaryMin,
        salaryMax:
          job.salaryMax === null || job.salaryMax === undefined
            ? ""
            : job.salaryMax,
        salaryCurrency: job.salaryCurrency || "INR",
        isSalaryVisible: !!job.isSalaryVisible,
        shortDescription: job.shortDescription || "",
        description: job.description || "",
        responsibilities: arrayToCommaText(job.responsibilities),
        requirements: arrayToCommaText(job.requirements),
        benefits: arrayToCommaText(job.benefits),
        skills: arrayToCommaText(job.skills),
        tags: arrayToCommaText(job.tags),
        applicationDeadline: job.applicationDeadline
          ? new Date(job.applicationDeadline).toISOString().split("T")[0]
          : "",
        externalApplyLink: job.externalApplyLink || "",
        isPublished: !!job.isPublished,
      });
    } catch (error) {
      console.error("Fetch job for update error:", error);
      setServerError(
        error?.response?.data?.message || "Failed to fetch job details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobForEdit();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "openingsCount" ||
              name === "salaryMin" ||
              name === "salaryMax"
            ? value
            : value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    setServerError("");

    if (!validateForm()) return;

    try {
      setUpdating(true);

      const payload = buildPayload();

      const response = await axios.put(
        `${globalBackendRoute}/api/jobs/${id}`,
        payload,
        {
          headers: authHeaders,
        },
      );

      setServerMessage(response?.data?.message || "Job updated successfully.");

      setTimeout(() => {
        navigate(`/single-created-job/${id}`);
      }, 800);
    } catch (error) {
      console.error("Update job error:", error);
      setServerError(error?.response?.data?.message || "Failed to update job.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-3 py-6">
        <div className="mx-auto w-full max-w-[98%] rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
          Loading job for update...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-3 py-4 sm:px-4 lg:px-5">
      <div className="mx-auto w-full max-w-[98%]">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Update Job
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Edit job details in a clean and compact layout.
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className={cardClass}>
              <h2 className="text-sm font-bold text-slate-800">
                Basic Information
              </h2>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div>
                  <label className={labelClass}>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
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
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Experience Level</label>
                    <input
                      type="text"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Employment Mode</label>
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
                    <label className={labelClass}>Openings Count</label>
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
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h2 className="text-sm font-bold text-slate-800">
                Salary and Publish Options
              </h2>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Salary Min</label>
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleChange}
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
                    Mark as published
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
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-sm font-bold text-slate-800">Descriptions</h2>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass}>Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
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
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className={cardClass}>
              <h2 className="text-sm font-bold text-slate-800">
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
              <h2 className="text-sm font-bold text-slate-800">
                Benefits, Skills and Tags
              </h2>
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
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/single-created-job/${id}`)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="rounded-lg bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updating ? "Updating Job..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJob;
