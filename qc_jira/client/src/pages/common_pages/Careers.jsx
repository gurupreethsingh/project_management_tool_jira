import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  FaBook,
  FaFileUpload,
  FaGraduationCap,
  FaLaptopCode,
  FaLinkedin,
  FaGithub,
  FaUniversity,
  FaCode,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaBriefcase,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import globalBackendRoute from "../../config/Config";
import careersHeroBanner from "../../assets/images/careers_banner.jpg";

const SECTION_TITLE_STYLE = "text-sm sm:text-base font-semibold text-slate-900";
const SECTION_DESC_STYLE = "text-xs sm:text-sm text-slate-600 leading-relaxed";
const INPUT_STYLE =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
const LABEL_STYLE =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-600";
const CARD_STYLE =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]";
const PRIMARY_BUTTON_STYLE =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60";
const SECONDARY_BUTTON_STYLE =
  "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700";
const SECONDARY_BADGE_STYLE =
  "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-md";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  applyType: "internship",
  desiredRole: "",
  experienceLevel: "",
  preferredLocation: "",
  portfolioUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  aboutYou: "",
  collegeName: "",
  universityName: "",
  degree: "",
  department: "",
  specialization: "",
  yearOfStudy: "",
  semester: "",
  graduationYear: "",
  cgpa: "",
  totalYears: "",
  currentCompany: "",
  currentDesignation: "",
  currentCTC: "",
  expectedCTC: "",
  noticePeriod: "",
  skills: "",
  certifications: "",
  jobId: "",
};

function getSafeErrorMessage(error) {
  const apiMessage = error?.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage.trim();
  }

  const status = error?.response?.status;

  if (status === 400) {
    return "Please check the entered details and try again.";
  }

  if (status === 413) {
    return "Uploaded file is too large. Please upload smaller files and try again.";
  }

  if (status === 415) {
    return "Unsupported file type. Please upload PDF, DOC, DOCX, PNG, JPG, or JPEG files.";
  }

  if (!navigator.onLine) {
    return "You appear to be offline. Please check your internet connection and try again.";
  }

  return "We could not submit your application right now. Please try again in a moment.";
}

function validateFiles(selectedFiles) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  const maxFiles = 10;
  const maxFileSize = 10 * 1024 * 1024;

  if (selectedFiles.length > maxFiles) {
    return {
      valid: false,
      message: "You can upload up to 10 files only.",
    };
  }

  for (const file of selectedFiles) {
    if (file.size > maxFileSize) {
      return {
        valid: false,
        message: `${file.name} is larger than 10 MB.`,
      };
    }

    if (file.type && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: `${file.name} has an unsupported file type.`,
      };
    }
  }

  return { valid: true, message: "" };
}

function normalizeOpportunityType(value = "") {
  const lower = String(value).toLowerCase();
  if (lower.includes("job")) return "Job";
  return "Internship";
}

function normalizeSkills(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export default function Careers() {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(initialFormData);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [fileError, setFileError] = useState("");

  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [opportunityQuery, setOpportunityQuery] = useState("");
  const [opportunityType, setOpportunityType] = useState("All");

  useEffect(() => {
    let isMounted = true;

    const fetchOpportunities = async () => {
      setLoadingOpportunities(true);

      try {
        const response = await axios.get(
          `${globalBackendRoute}/api/careers/public`,
          {
            params: {
              limit: 50,
            },
          },
        );

        if (!isMounted) return;

        const rawItems = Array.isArray(response?.data?.items)
          ? response.data.items
          : [];

        const mapped = rawItems
          .filter((item) => !item?.isDeleted)
          .map((item) => ({
            id: item?._id || Math.random().toString(36).slice(2),
            title: item?.desiredRole || "Untitled Opportunity",
            type: normalizeOpportunityType(item?.applyType),
            location: item?.preferredLocation || "Location not specified",
            experience: item?.experienceLevel || "Not specified",
            summary:
              item?.aboutYou || "Opportunity details will be updated soon.",
            posted: item?.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "Recently",
            skills: normalizeSkills(item?.skills),
            sourceItem: item,
          }));

        setOpportunities(mapped);
      } catch (_error) {
        if (!isMounted) return;
        setOpportunities([]);
      } finally {
        if (isMounted) {
          setLoadingOpportunities(false);
        }
      }
    };

    fetchOpportunities();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedFileNames = useMemo(() => {
    if (!files.length) return "";
    return files.map((file) => file.name).join(", ");
  }, [files]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      const matchesType =
        opportunityType === "All" || item.type === opportunityType;

      const q = opportunityQuery.trim().toLowerCase();
      const haystack = [
        item.title,
        item.location,
        item.experience,
        item.summary,
        ...(item.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !q || haystack.includes(q);

      return matchesType && matchesQuery;
    });
  }, [opportunities, opportunityQuery, opportunityType]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesChange = (e) => {
    const nextFiles = Array.from(e.target.files || []);
    setFileError("");

    if (!nextFiles.length) {
      setFiles([]);
      return;
    }

    const validation = validateFiles(nextFiles);

    if (!validation.valid) {
      setFiles([]);
      setFileError(validation.message);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFiles(nextFiles);
  };

  const handleSelectOpportunity = (item) => {
    setFormData((prev) => ({
      ...prev,
      jobId: item.id || "",
      applyType: item.type.toLowerCase() === "job" ? "job" : "internship",
      desiredRole: item.title || prev.desiredRole,
      preferredLocation: item.location || prev.preferredLocation,
      experienceLevel:
        item.experience && item.experience !== "Not specified"
          ? item.experience
          : prev.experienceLevel,
    }));

    scrollToForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFiles([]);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitMessage("");
    setSubmitError("");
    setFileError("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.aboutYou.trim()
    ) {
      setSubmitError("Please fill in full name, email, and about yourself.");
      return;
    }

    const currentFileValidation = validateFiles(files);
    if (!currentFileValidation.valid) {
      setFileError(currentFileValidation.message);
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("fullName", formData.fullName.trim());
      fd.append("email", formData.email.trim());
      fd.append("phone", formData.phone.trim());
      fd.append("applyType", formData.applyType);
      fd.append("desiredRole", formData.desiredRole.trim());
      fd.append("experienceLevel", formData.experienceLevel.trim());
      fd.append("preferredLocation", formData.preferredLocation.trim());
      fd.append("portfolioUrl", formData.portfolioUrl.trim());
      fd.append("linkedinUrl", formData.linkedinUrl.trim());
      fd.append("githubUrl", formData.githubUrl.trim());
      fd.append("aboutYou", formData.aboutYou.trim());
      fd.append("jobId", formData.jobId.trim());
      fd.append("source", "career_page");

      fd.append("collegeName", formData.collegeName.trim());
      fd.append("universityName", formData.universityName.trim());
      fd.append("degree", formData.degree.trim());
      fd.append("department", formData.department.trim());
      fd.append("specialization", formData.specialization.trim());
      fd.append("yearOfStudy", formData.yearOfStudy.trim());
      fd.append("semester", formData.semester.trim());
      fd.append("graduationYear", formData.graduationYear.trim());
      fd.append("cgpa", formData.cgpa.trim());

      fd.append("totalYears", formData.totalYears.trim());
      fd.append("currentCompany", formData.currentCompany.trim());
      fd.append("currentDesignation", formData.currentDesignation.trim());
      fd.append("currentCTC", formData.currentCTC.trim());
      fd.append("expectedCTC", formData.expectedCTC.trim());
      fd.append("noticePeriod", formData.noticePeriod.trim());

      fd.append("skills", formData.skills.trim());
      fd.append("certifications", formData.certifications.trim());

      files.forEach((file) => {
        fd.append("files", file);
      });

      const response = await axios.post(
        `${globalBackendRoute}/api/careers/apply`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        },
      );

      const isSuccess =
        response?.status === 201 || response?.data?.status === true;

      if (isSuccess) {
        setSubmitMessage(
          `Your ${
            formData.applyType === "job" ? "job" : "internship"
          } application has been submitted successfully. Our team will review it and contact you by email or phone.`,
        );
        resetForm();
      } else {
        setSubmitError("We received an unexpected response. Please try again.");
      }
    } catch (error) {
      setSubmitError(getSafeErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${careersHeroBanner})` }}
      >
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/55 via-violet-800/30 to-fuchsia-700/25" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                Careers · Jobs · Internships
              </p>

              <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Apply for jobs and internships at{" "}
                <span className="bg-gradient-to-r from-indigo-200 via-violet-200 to-pink-200 bg-clip-text text-transparent">
                  Ecoders
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
                Explore current opportunities and apply directly without login.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className={SECONDARY_BADGE_STYLE}>
                  <FaLaptopCode className="text-indigo-200" />
                  Real project exposure
                </span>
                <span className={SECONDARY_BADGE_STYLE}>
                  <FaBook className="text-emerald-200" />
                  Guided mentorship
                </span>
                <span className={SECONDARY_BADGE_STYLE}>
                  <FaBriefcase className="text-amber-200" />
                  Jobs & internships
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className={PRIMARY_BUTTON_STYLE}
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className={`${CARD_STYLE} p-5 sm:p-6`}>
              <h2 className="text-lg font-semibold text-slate-900">
                Important confirmation
              </h2>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <FaInfoCircle className="mt-0.5 shrink-0 text-sky-600" />
                  <p>
                    Anyone can open this page and see available jobs and
                    internships.
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <FaInfoCircle className="mt-0.5 shrink-0 text-sky-600" />
                  <p>Anyone can apply directly without login.</p>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <FaInfoCircle className="mt-0.5 shrink-0 text-sky-600" />
                  <p>
                    Admin-only management routes remain protected in the
                    backend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className={`${CARD_STYLE} p-4 sm:p-5`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Current Opportunities
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Browse all public jobs and internships.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[520px]">
                <div className="relative">
                  <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={opportunityQuery}
                    onChange={(e) => setOpportunityQuery(e.target.value)}
                    placeholder="Search opportunities"
                    className={`${INPUT_STYLE} pl-10`}
                  />
                </div>

                <select
                  value={opportunityType}
                  onChange={(e) => setOpportunityType(e.target.value)}
                  className={INPUT_STYLE}
                >
                  <option value="All">All</option>
                  <option value="Internship">Internship</option>
                  <option value="Job">Job</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              {loadingOpportunities ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                  Loading opportunities...
                </div>
              ) : filteredOpportunities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No current job or internship opportunities to display yet.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Please check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredOpportunities.map((item) => (
                    <OpportunityCard
                      key={item.id}
                      item={item}
                      onApply={() => handleSelectOpportunity(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section ref={formRef} id="apply" className="pb-10 sm:pb-12 lg:pb-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className={`${CARD_STYLE} p-4 sm:p-5 lg:p-6`}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Application Form
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Apply for the selected role or submit a direct application.
                </p>
              </div>

              <div className="w-full sm:w-[220px]">
                <label className={LABEL_STYLE}>Apply Type</label>
                <select
                  name="applyType"
                  value={formData.applyType}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                >
                  <option value="internship">Internship</option>
                  <option value="job">Job</option>
                </select>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              noValidate
            >
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-4">
                  <CompactSection
                    icon={<FaEnvelope className="text-indigo-600" />}
                    title="Basic Details"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <FormField label="Full Name" required>
                        <input
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="Enter your full name"
                          required
                        />
                      </FormField>

                      <FormField label="Email" required>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="Enter your email"
                          required
                        />
                      </FormField>

                      <FormField label="Phone Number">
                        <div className="relative">
                          <FaPhoneAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`${INPUT_STYLE} pl-10`}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </FormField>

                      <FormField
                        label={
                          formData.applyType === "job"
                            ? "Desired Job Role"
                            : "Desired Internship Role"
                        }
                      >
                        <input
                          name="desiredRole"
                          type="text"
                          value={formData.desiredRole}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="Full Stack Developer / QA Intern / AI Engineer"
                        />
                      </FormField>

                      <FormField label="Experience Level">
                        <input
                          name="experienceLevel"
                          type="text"
                          value={formData.experienceLevel}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="Fresher / 1-3 years / Final Year"
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
                            className={`${INPUT_STYLE} pl-10`}
                            placeholder="Remote / Bengaluru / Hybrid"
                          />
                        </div>
                      </FormField>
                    </div>
                  </CompactSection>
                </div>

                <div className="xl:col-span-4">
                  <CompactSection
                    icon={<FaGraduationCap className="text-violet-600" />}
                    title="Education"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <FormField label="College Name">
                        <input
                          name="collegeName"
                          type="text"
                          value={formData.collegeName}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="Enter college name"
                        />
                      </FormField>

                      <FormField label="University Name">
                        <div className="relative">
                          <FaUniversity className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            name="universityName"
                            type="text"
                            value={formData.universityName}
                            onChange={handleChange}
                            className={`${INPUT_STYLE} pl-10`}
                            placeholder="Enter university"
                          />
                        </div>
                      </FormField>

                      <FormField label="Degree">
                        <input
                          name="degree"
                          type="text"
                          value={formData.degree}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="B.E / B.Tech / MCA"
                        />
                      </FormField>

                      <FormField label="Department">
                        <input
                          name="department"
                          type="text"
                          value={formData.department}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="CSE / ISE / ECE / IT"
                        />
                      </FormField>

                      <FormField label="Specialization">
                        <input
                          name="specialization"
                          type="text"
                          value={formData.specialization}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="AI / Data Science / Web"
                        />
                      </FormField>

                      <FormField label="Year of Study">
                        <input
                          name="yearOfStudy"
                          type="text"
                          value={formData.yearOfStudy}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="2nd Year / Final Year"
                        />
                      </FormField>

                      <FormField label="Semester">
                        <input
                          name="semester"
                          type="text"
                          value={formData.semester}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="Semester 5 / 8"
                        />
                      </FormField>

                      <FormField label="Graduation Year">
                        <input
                          name="graduationYear"
                          type="number"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="2027"
                        />
                      </FormField>

                      <FormField label="CGPA / Percentage">
                        <input
                          name="cgpa"
                          type="text"
                          value={formData.cgpa}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="8.2 CGPA / 78%"
                        />
                      </FormField>
                    </div>
                  </CompactSection>
                </div>

                <div className="xl:col-span-4">
                  <CompactSection
                    icon={<FaCode className="text-emerald-600" />}
                    title="Profile & Application Details"
                  >
                    <div className="grid grid-cols-1 gap-3">
                      {formData.applyType === "job" && (
                        <>
                          <FormField label="Total Experience">
                            <input
                              name="totalYears"
                              type="text"
                              value={formData.totalYears}
                              onChange={handleChange}
                              className={INPUT_STYLE}
                              placeholder="2 years"
                            />
                          </FormField>

                          <FormField label="Current Company">
                            <input
                              name="currentCompany"
                              type="text"
                              value={formData.currentCompany}
                              onChange={handleChange}
                              className={INPUT_STYLE}
                              placeholder="Current company"
                            />
                          </FormField>

                          <FormField label="Current Designation">
                            <input
                              name="currentDesignation"
                              type="text"
                              value={formData.currentDesignation}
                              onChange={handleChange}
                              className={INPUT_STYLE}
                              placeholder="Software Engineer"
                            />
                          </FormField>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <FormField label="Current CTC">
                              <input
                                name="currentCTC"
                                type="text"
                                value={formData.currentCTC}
                                onChange={handleChange}
                                className={INPUT_STYLE}
                                placeholder="6 LPA"
                              />
                            </FormField>

                            <FormField label="Expected CTC">
                              <input
                                name="expectedCTC"
                                type="text"
                                value={formData.expectedCTC}
                                onChange={handleChange}
                                className={INPUT_STYLE}
                                placeholder="8 LPA"
                              />
                            </FormField>
                          </div>

                          <FormField label="Notice Period">
                            <input
                              name="noticePeriod"
                              type="text"
                              value={formData.noticePeriod}
                              onChange={handleChange}
                              className={INPUT_STYLE}
                              placeholder="30 days"
                            />
                          </FormField>
                        </>
                      )}

                      <FormField label="Portfolio URL">
                        <input
                          name="portfolioUrl"
                          type="url"
                          value={formData.portfolioUrl}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="https://yourportfolio.com"
                        />
                      </FormField>

                      <FormField label="LinkedIn URL">
                        <div className="relative">
                          <FaLinkedin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            name="linkedinUrl"
                            type="url"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            className={`${INPUT_STYLE} pl-10`}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                      </FormField>

                      <FormField label="GitHub URL">
                        <div className="relative">
                          <FaGithub className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            name="githubUrl"
                            type="url"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            className={`${INPUT_STYLE} pl-10`}
                            placeholder="https://github.com/yourprofile"
                          />
                        </div>
                      </FormField>

                      <FormField label="Skills">
                        <textarea
                          name="skills"
                          rows={2}
                          value={formData.skills}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="React, Node.js, MongoDB, Selenium"
                        />
                      </FormField>

                      <FormField label="Certifications">
                        <textarea
                          name="certifications"
                          rows={2}
                          value={formData.certifications}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="AWS, Coursera React, NPTEL Java"
                        />
                      </FormField>

                      <FormField label="About You" required>
                        <textarea
                          name="aboutYou"
                          rows={4}
                          value={formData.aboutYou}
                          onChange={handleChange}
                          className={INPUT_STYLE}
                          placeholder="Write a short summary about your background, projects, strengths, and why you want to join Ecoders."
                          required
                        />
                      </FormField>
                    </div>
                  </CompactSection>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FaFileUpload className="text-indigo-600" />
                  <div>
                    <h3 className={SECTION_TITLE_STYLE}>Upload Documents</h3>
                    <p className={SECTION_DESC_STYLE}>
                      Resume, portfolio, certificates, or supporting files.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                  <label
                    htmlFor="career-files-input"
                    className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
                  >
                    <div>
                      <FaFileUpload className="mx-auto mb-2 text-xl text-indigo-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Click here to select files
                      </span>
                      <p className="mt-1 text-xs text-slate-500">
                        PDF, DOC, DOCX, PNG, JPG supported
                      </p>
                    </div>

                    <input
                      id="career-files-input"
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFilesChange}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setFiles([]);
                      setFileError("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className={SECONDARY_BUTTON_STYLE}
                  >
                    Clear Files
                  </button>
                </div>

                {selectedFileNames && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Selected Files
                    </p>
                    <p className="mt-1 break-words text-sm text-slate-700">
                      {selectedFileNames}
                    </p>
                  </div>
                )}

                {fileError && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {fileError}
                  </div>
                )}
              </div>

              {submitMessage && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="mt-0.5 shrink-0" />
                    <span>{submitMessage}</span>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {submitError}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
                  By submitting this form, you agree to be contacted regarding
                  career opportunities at Ecoders.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className={SECONDARY_BUTTON_STYLE}
                    disabled={submitting}
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={PRIMARY_BUTTON_STYLE}
                  >
                    {submitting
                      ? "Submitting Application..."
                      : `Submit ${
                          formData.applyType === "job" ? "Job" : "Internship"
                        } Application`}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function CompactSection({ icon, title, children }) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-xl bg-white p-2 shadow-sm">{icon}</div>
        <h3 className={SECTION_TITLE_STYLE}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, required = false, children }) {
  return (
    <div>
      <label className={LABEL_STYLE}>
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function OpportunityCard({ item, onApply }) {
  const badgeClasses =
    item.type === "Job"
      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1 text-xs text-slate-500">{item.location}</p>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${badgeClasses}`}
        >
          <FaBriefcase className="text-[11px]" />
          {item.type}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.summary}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1">
          <FaClock className="text-orange-400" />
          {item.experience}
        </span>
        <span className="inline-flex items-center gap-1">
          <FaMapMarkerAlt className="text-emerald-500" />
          {item.location}
        </span>
      </div>

      {item.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Posted: {item.posted}
        </span>

        <button
          type="button"
          onClick={onApply}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Apply
        </button>
      </div>
    </article>
  );
}
