import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

const labelClass = "mb-1 block text-xs font-semibold text-slate-700";
const cardClass = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";
const sectionTitleClass = "text-sm font-bold text-slate-800";

const emptyInternshipForm = {
  title: "",
  slug: "",
  applyType: "internship",
  department: "",
  domain: "",
  mode: "",
  preferredLocation: "",
  duration: "",
  openingsCount: 1,
  totalStudentsAllowed: "",
  trainingDetails: "",
  projectDetails: "",
  techStack: "",
  paymentType: "",
  stipendAmount: "",
  feesAmount: "",
  currency: "INR",
  feesPaymentStatus: "Pending",
  startDate: "",
  endDate: "",
  applicationDeadline: "",
  totalApplications: "",
  totalSelectedStudents: "",
  totalActiveInterns: "",
  totalCompletedInterns: "",
  totalDroppedInterns: "",
  synopsisSubmitted: false,
  codeSubmitted: false,
  projectReportSubmitted: false,
  vivaCompleted: false,
  acceptanceLetterGenerated: false,
  certificateGenerated: false,
  shortDescription: "",
  description: "",
  skills: "",
  tags: "",
  isPublished: false,
};

const CreateInternship = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyInternshipForm);
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
      applyType: "internship",
      department: formData.department.trim(),
      domain: formData.domain.trim(),
      mode: formData.mode,
      preferredLocation: formData.preferredLocation.trim(),
      duration: formData.duration,
      openingsCount: Number(formData.openingsCount) || 1,
      totalStudentsAllowed:
        formData.totalStudentsAllowed === ""
          ? 0
          : Number(formData.totalStudentsAllowed),
      trainingDetails: formData.trainingDetails.trim(),
      projectDetails: formData.projectDetails.trim(),
      techStack: convertCommaSeparatedTextToArray(formData.techStack),
      paymentType: formData.paymentType,
      stipendAmount:
        formData.stipendAmount === "" ? null : Number(formData.stipendAmount),
      feesAmount:
        formData.feesAmount === "" ? null : Number(formData.feesAmount),
      currency: formData.currency.trim() || "INR",
      feesPaymentStatus: formData.feesPaymentStatus,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      applicationDeadline: formData.applicationDeadline || null,
      totalApplications:
        formData.totalApplications === ""
          ? 0
          : Number(formData.totalApplications),
      totalSelectedStudents:
        formData.totalSelectedStudents === ""
          ? 0
          : Number(formData.totalSelectedStudents),
      totalActiveInterns:
        formData.totalActiveInterns === ""
          ? 0
          : Number(formData.totalActiveInterns),
      totalCompletedInterns:
        formData.totalCompletedInterns === ""
          ? 0
          : Number(formData.totalCompletedInterns),
      totalDroppedInterns:
        formData.totalDroppedInterns === ""
          ? 0
          : Number(formData.totalDroppedInterns),
      submissionStatus: {
        synopsisSubmitted: formData.synopsisSubmitted,
        codeSubmitted: formData.codeSubmitted,
        projectReportSubmitted: formData.projectReportSubmitted,
        vivaCompleted: formData.vivaCompleted,
      },
      documents: {
        acceptanceLetterGenerated: formData.acceptanceLetterGenerated,
        certificateGenerated: formData.certificateGenerated,
      },
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      skills: convertCommaSeparatedTextToArray(formData.skills),
      tags: convertCommaSeparatedTextToArray(formData.tags),
      isPublished: formData.isPublished,
    };
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setServerError("Internship title is required.");
      return false;
    }

    if (!formData.duration) {
      setServerError("Internship duration is required.");
      return false;
    }

    if (Number(formData.openingsCount) < 1) {
      setServerError("Openings count must be at least 1.");
      return false;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      setServerError("Start date cannot be after end date.");
      return false;
    }

    if (
      formData.totalStudentsAllowed !== "" &&
      Number(formData.totalStudentsAllowed) < 0
    ) {
      setServerError("Total students allowed cannot be negative.");
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
    const requestUrl = `${baseUrl}/api/internships`;

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

      setServerMessage(
        response?.data?.message || "Internship created successfully.",
      );
      setFormData(emptyInternshipForm);

      setTimeout(() => {
        navigate("/all-created-internships");
      }, 800);
    } catch (error) {
      console.error("Create internship error:", error);
      console.error("Create internship response data:", error?.response?.data);
      console.error(
        "Create internship response status:",
        error?.response?.status,
      );

      setServerError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to create internship.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto w-full">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-4 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Create New Internship
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Add a new internship with compact details, tracking, and publish
            settings.
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
                  <label className={labelClass}>Internship Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Full Stack Web Development Internship"
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
                    placeholder="full-stack-web-development-internship"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

                  <div>
                    <label className={labelClass}>Domain</label>
                    <input
                      type="text"
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      placeholder="MERN Stack"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <div>
                    <label className={labelClass}>Mode</label>
                    <select
                      name="mode"
                      value={formData.mode}
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
                    <label className={labelClass}>Duration</label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
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

                  <div>
                    <label className={labelClass}>Students Allowed</label>
                    <input
                      type="number"
                      min="0"
                      name="totalStudentsAllowed"
                      value={formData.totalStudentsAllowed}
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
              <h2 className={sectionTitleClass}>Payment and Timeline</h2>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <div>
                    <label className={labelClass}>Payment Type</label>
                    <select
                      name="paymentType"
                      value={formData.paymentType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Stipend">Stipend</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Stipend</label>
                    <input
                      type="number"
                      name="stipendAmount"
                      value={formData.stipendAmount}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Fees</label>
                    <input
                      type="number"
                      name="feesAmount"
                      value={formData.feesAmount}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Currency</label>
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="INR"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Fees Status</label>
                    <select
                      name="feesPaymentStatus"
                      value={formData.feesPaymentStatus}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
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

                <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
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

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="acceptanceLetterGenerated"
                      checked={formData.acceptanceLetterGenerated}
                      onChange={handleChange}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                    />
                    Acceptance Letter Generated
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="certificateGenerated"
                      checked={formData.certificateGenerated}
                      onChange={handleChange}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                    />
                    Certificate Generated
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Training and Project Details</h2>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass}>Training Details</label>
                <textarea
                  name="trainingDetails"
                  value={formData.trainingDetails}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Daily training plan, modules, mentorship details..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Project Details</label>
                <textarea
                  name="projectDetails"
                  value={formData.projectDetails}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Project scope, milestones, deliverables..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="react, node.js, mongodb"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Student Tracking</h2>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className={labelClass}>Total Applied</label>
                <input
                  type="number"
                  min="0"
                  name="totalApplications"
                  value={formData.totalApplications}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Selected</label>
                <input
                  type="number"
                  min="0"
                  name="totalSelectedStudents"
                  value={formData.totalSelectedStudents}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Active Interns</label>
                <input
                  type="number"
                  min="0"
                  name="totalActiveInterns"
                  value={formData.totalActiveInterns}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Completed</label>
                <input
                  type="number"
                  min="0"
                  name="totalCompletedInterns"
                  value={formData.totalCompletedInterns}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Dropped</label>
                <input
                  type="number"
                  min="0"
                  name="totalDroppedInterns"
                  value={formData.totalDroppedInterns}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Submission Status</h2>

            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="synopsisSubmitted"
                  checked={formData.synopsisSubmitted}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                />
                Synopsis Submitted
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="codeSubmitted"
                  checked={formData.codeSubmitted}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                />
                Code Submitted
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="projectReportSubmitted"
                  checked={formData.projectReportSubmitted}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                />
                Project Report Submitted
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="vivaCompleted"
                  checked={formData.vivaCompleted}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                />
                Viva Completed
              </label>
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
                  placeholder="Short introduction for internship cards and listings."
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
                  placeholder="Detailed internship description..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={sectionTitleClass}>Skills and Tags</h2>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  placeholder="internship, training, project"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/all-created-internships")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Internship..." : "Create Internship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInternship;
