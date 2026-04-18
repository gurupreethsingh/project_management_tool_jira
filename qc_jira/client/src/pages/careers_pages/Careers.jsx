"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import {
  CareerHero,
  CareerSearchToolbar,
  OpportunityCard,
  PageSkeletonGrid,
  PaginationBar,
} from "../../components/careers_components/CareersShared";

const JOBS_PUBLIC_API = `${globalBackendRoute}/api/jobs/public`;
const INTERNSHIPS_PUBLIC_API = `${globalBackendRoute}/api/internships/public`;
const CAREERS_API = `${globalBackendRoute}/api/careers`;

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  country: "India",
  totalExperienceYears: 0,
  currentCompany: "",
  currentRole: "",
  highestQualification: "",
  collegeName: "",
  graduationYear: "",
  skills: "",
  portfolioUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  resumeUrl: "",
  coverLetter: "",
  whyShouldWeHireYou: "",
  expectedSalaryOrStipend: "",
  noticePeriodDays: "",
  availableFrom: "",
  applicationSource: "careers-page",
};

const filterOptions = {
  opportunityType: [
    { value: "all", label: "All Types" },
    { value: "job", label: "Jobs" },
    { value: "internship", label: "Internships" },
  ],
  workMode: [
    { value: "all", label: "All Work Modes" },
    { value: "onsite", label: "Onsite" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ],
  experienceLevel: [
    { value: "all", label: "All Experience" },
    { value: "fresher", label: "Fresher" },
    { value: "0-1 years", label: "0-1 years" },
    { value: "1-2 years", label: "1-2 years" },
    { value: "2-4 years", label: "2-4 years" },
    { value: "4-6 years", label: "4-6 years" },
    { value: "6+ years", label: "6+ years" },
  ],
  sortBy: [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "title_asc", label: "Title A-Z" },
    { value: "title_desc", label: "Title Z-A" },
    { value: "featured_first", label: "Featured First" },
  ],
};

const ApplyModal = memo(function ApplyModal({
  open,
  opportunity,
  formData,
  applying,
  onClose,
  onChange,
  onSubmit,
}) {
  return (
    <AnimatePresence>
      {open && opportunity ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="service-badge-heading">
                  Apply for {opportunity?.title}
                </p>
                <p className="mt-2 service-small-paragraph">
                  Fill in your details to submit your application.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={onSubmit}
              className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                placeholder="First Name"
                required
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                placeholder="Last Name"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Email"
                type="email"
                required
              />
              <Input
                name="phone"
                value={formData.phone}
                onChange={onChange}
                placeholder="Phone Number"
              />
              <Input
                name="city"
                value={formData.city}
                onChange={onChange}
                placeholder="City"
              />
              <Input
                name="state"
                value={formData.state}
                onChange={onChange}
                placeholder="State"
              />
              <Input
                name="country"
                value={formData.country}
                onChange={onChange}
                placeholder="Country"
              />
              <Input
                name="totalExperienceYears"
                value={formData.totalExperienceYears}
                onChange={onChange}
                placeholder="Total Experience (years)"
                type="number"
                min="0"
              />
              <Input
                name="currentCompany"
                value={formData.currentCompany}
                onChange={onChange}
                placeholder="Current Company"
              />
              <Input
                name="currentRole"
                value={formData.currentRole}
                onChange={onChange}
                placeholder="Current Role"
              />
              <Input
                name="highestQualification"
                value={formData.highestQualification}
                onChange={onChange}
                placeholder="Highest Qualification"
              />
              <Input
                name="collegeName"
                value={formData.collegeName}
                onChange={onChange}
                placeholder="College Name"
              />
              <Input
                name="graduationYear"
                value={formData.graduationYear}
                onChange={onChange}
                placeholder="Graduation Year"
                type="number"
              />

              <Input
                name="skills"
                value={formData.skills}
                onChange={onChange}
                placeholder="Skills (comma separated)"
                className="md:col-span-2"
              />

              <Input
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={onChange}
                placeholder="Portfolio URL"
              />
              <Input
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={onChange}
                placeholder="LinkedIn URL"
              />
              <Input
                name="githubUrl"
                value={formData.githubUrl}
                onChange={onChange}
                placeholder="GitHub URL"
              />
              <Input
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={onChange}
                placeholder="Resume URL"
              />
              <Input
                name="expectedSalaryOrStipend"
                value={formData.expectedSalaryOrStipend}
                onChange={onChange}
                placeholder="Expected Salary / Stipend"
                type="number"
              />
              <Input
                name="noticePeriodDays"
                value={formData.noticePeriodDays}
                onChange={onChange}
                placeholder="Notice Period (days)"
                type="number"
              />
              <Input
                name="availableFrom"
                value={formData.availableFrom}
                onChange={onChange}
                type="date"
                className="md:col-span-2"
              />

              <TextArea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={onChange}
                placeholder="Cover Letter"
                className="md:col-span-2"
              />

              <TextArea
                name="whyShouldWeHireYou"
                value={formData.whyShouldWeHireYou}
                onChange={onChange}
                placeholder="Why should we hire you?"
                className="md:col-span-2"
              />

              <div className="mt-2 flex flex-col justify-end gap-3 md:col-span-2 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-[13px] font-extrabold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-[13px] font-extrabold text-white disabled:opacity-60"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
});

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-700 outline-none focus:border-slate-400 ${className}`}
    />
  );
}

function TextArea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      rows={4}
      className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-700 outline-none resize-none focus:border-slate-400 ${className}`}
    />
  );
}

function normalizeOpportunity(item, type) {
  const workModeValue =
    item?.workMode ||
    item?.mode ||
    item?.jobMode ||
    item?.internshipMode ||
    item?.locationType ||
    item?.work_type ||
    "";

  const experienceValue =
    item?.experienceLevel ||
    item?.experience ||
    item?.requiredExperience ||
    item?.experienceRange ||
    item?.eligibility ||
    "";

  const createdAtValue =
    item?.createdAt ||
    item?.updatedAt ||
    item?.publishedAt ||
    item?.datePosted ||
    new Date().toISOString();

  return {
    ...item,
    _id: item?._id || item?.id,
    title: item?.title || item?.jobTitle || item?.internshipTitle || "Untitled",
    slug: item?.slug || item?._id || item?.id,
    opportunityType: type,
    workMode: String(workModeValue || "").toLowerCase(),
    experienceLevel: String(experienceValue || "").toLowerCase(),
    createdAt: createdAtValue,
    isFeatured: Boolean(item?.isFeatured || item?.featured),
    companyName: item?.companyName || item?.company || "ECODERS",
    location:
      item?.location || item?.jobLocation || item?.internshipLocation || "",
    description:
      item?.description ||
      item?.shortDescription ||
      item?.summary ||
      item?.aboutRole ||
      "",
    department: item?.department || "",
  };
}

const Careers = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isLoggedIn = !!token;

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [opportunityType, setOpportunityType] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user?.name?.split(" ")?.[0] || "",
        lastName:
          prev.lastName || user?.name?.split(" ")?.slice(1).join(" ") || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [isLoggedIn, user]);

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsResponse, internshipsResponse] = await Promise.all([
        axios.get(JOBS_PUBLIC_API),
        axios.get(INTERNSHIPS_PUBLIC_API),
      ]);

      const rawJobs =
        jobsResponse?.data?.items ||
        jobsResponse?.data?.jobs ||
        jobsResponse?.data?.data ||
        jobsResponse?.data ||
        [];

      const rawInternships =
        internshipsResponse?.data?.items ||
        internshipsResponse?.data?.internships ||
        internshipsResponse?.data?.data ||
        internshipsResponse?.data ||
        [];

      const jobs = Array.isArray(rawJobs)
        ? rawJobs.map((item) => normalizeOpportunity(item, "job"))
        : [];

      const internships = Array.isArray(rawInternships)
        ? rawInternships.map((item) => normalizeOpportunity(item, "internship"))
        : [];

      setAllItems([...jobs, ...internships]);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      setError("Could not load career opportunities.");
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    setPage(1);
  }, []);

  const openApplyModal = useCallback((opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowApplyModal(true);
  }, []);

  const closeApplyModal = useCallback(() => {
    setShowApplyModal(false);
    setSelectedOpportunity(null);
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleApply = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedOpportunity?._id) return;

      try {
        setApplying(true);

        const payload = {
          ...formData,
          totalExperienceYears: Number(formData.totalExperienceYears || 0),
          expectedSalaryOrStipend: Number(
            formData.expectedSalaryOrStipend || 0,
          ),
          noticePeriodDays: Number(formData.noticePeriodDays || 0),
          graduationYear: formData.graduationYear
            ? Number(formData.graduationYear)
            : undefined,
          skills: formData.skills,
          opportunityType: selectedOpportunity?.opportunityType,
          opportunityId: selectedOpportunity?._id,
          opportunityTitle: selectedOpportunity?.title,
        };

        const authToken =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("userToken");

        const headers = authToken
          ? { Authorization: `Bearer ${authToken}` }
          : {};

        await axios.post(
          `${CAREERS_API}/apply/${selectedOpportunity._id}`,
          payload,
          { headers },
        );

        alert("Application submitted successfully.");
        setFormData(initialForm);
        closeApplyModal();
      } catch (err) {
        console.error("Error applying for opportunity:", err);
        alert(err?.response?.data?.message || "Failed to submit application.");
      } finally {
        setApplying(false);
      }
    },
    [selectedOpportunity, formData, closeApplyModal],
  );

  const filteredAndSortedItems = useMemo(() => {
    let result = [...allItems];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((item) => {
        const haystack = [
          item?.title,
          item?.description,
          item?.location,
          item?.department,
          item?.companyName,
          item?.experienceLevel,
          item?.workMode,
          item?.opportunityType,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    if (opportunityType !== "all") {
      result = result.filter(
        (item) =>
          String(item?.opportunityType || "").toLowerCase() === opportunityType,
      );
    }

    if (workMode !== "all") {
      result = result.filter((item) =>
        String(item?.workMode || "")
          .toLowerCase()
          .includes(workMode.toLowerCase()),
      );
    }

    if (experienceLevel !== "all") {
      result = result.filter((item) =>
        String(item?.experienceLevel || "")
          .toLowerCase()
          .includes(experienceLevel.toLowerCase()),
      );
    }

    result.sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      }

      if (sortBy === "oldest") {
        return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
      }

      if (sortBy === "title_asc") {
        return String(a?.title || "").localeCompare(String(b?.title || ""));
      }

      if (sortBy === "title_desc") {
        return String(b?.title || "").localeCompare(String(a?.title || ""));
      }

      if (sortBy === "featured_first") {
        if (Boolean(a?.isFeatured) === Boolean(b?.isFeatured)) return 0;
        return a?.isFeatured ? -1 : 1;
      }

      return 0;
    });

    return result;
  }, [allItems, search, opportunityType, workMode, experienceLevel, sortBy]);

  const pagination = useMemo(() => {
    const total = filteredAndSortedItems.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    return {
      page: safePage,
      limit,
      total,
      totalPages,
    };
  }, [filteredAndSortedItems.length, page, limit]);

  const paginatedItems = useMemo(() => {
    const currentPage = pagination.page;
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    return filteredAndSortedItems.slice(start, end);
  }, [filteredAndSortedItems, pagination.page, limit]);

  useEffect(() => {
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  const stats = useMemo(() => {
    const jobs = filteredAndSortedItems.filter(
      (i) => i.opportunityType === "job",
    ).length;

    const internships = filteredAndSortedItems.filter(
      (i) => i.opportunityType === "internship",
    ).length;

    return [
      { label: "Open roles", value: pagination.total || 0 },
      { label: "Jobs", value: jobs },
      { label: "Internships", value: internships },
      { label: "Page", value: pagination.page },
    ];
  }, [filteredAndSortedItems, pagination.total, pagination.page]);

  const filterConfig = useMemo(
    () => [
      {
        key: "type",
        value: opportunityType,
        onChange: (e) => {
          setOpportunityType(e.target.value);
          setPage(1);
        },
        options: filterOptions.opportunityType,
        colSpan: "xl:col-span-2",
      },
      {
        key: "mode",
        value: workMode,
        onChange: (e) => {
          setWorkMode(e.target.value);
          setPage(1);
        },
        options: filterOptions.workMode,
        colSpan: "xl:col-span-2",
      },
      {
        key: "experience",
        value: experienceLevel,
        onChange: (e) => {
          setExperienceLevel(e.target.value);
          setPage(1);
        },
        options: filterOptions.experienceLevel,
        colSpan: "xl:col-span-2",
      },
      {
        key: "sort",
        value: sortBy,
        onChange: (e) => {
          setSortBy(e.target.value);
          setPage(1);
        },
        options: filterOptions.sortBy,
        colSpan: "xl:col-span-1",
      },
    ],
    [opportunityType, workMode, experienceLevel, sortBy],
  );

  return (
    <div className="service-page-wrap min-h-screen bg-slate-50">
      <CareerHero
        title={
          <>
            Build your career with{" "}
            <span className="service-hero-title-highlight">
              jobs & internships
            </span>{" "}
            designed for real growth
          </>
        }
        subtitle="Explore all published jobs and internships, filter by work mode and experience, and apply from one unified responsive careers page."
        statCards={stats}
      />

      <main className="service-main-wrap">
        <div className="container mx-auto space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <CareerSearchToolbar
            search={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            onSubmit={handleSearchSubmit}
            filters={filterConfig}
          />

          {loading ? (
            <PageSkeletonGrid count={6} />
          ) : error ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center">
              <p className="text-[14px] font-extrabold text-rose-700">
                {error}
              </p>
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-[16px] font-extrabold text-slate-800">
                No opportunities found
              </p>
              <p className="mt-2 service-small-paragraph">
                Try changing filters or search terms.
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedItems.map((item) => (
                <OpportunityCard
                  key={`${item.opportunityType}-${item._id}`}
                  item={item}
                  onView={() =>
                    navigate(
                      `/${
                        item.opportunityType === "job"
                          ? "single-created-job"
                          : "single-created-internship"
                      }/${item._id}`,
                    )
                  }
                  onApply={() => openApplyModal(item)}
                />
              ))}
            </section>
          )}

          <PaginationBar
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>

      <ApplyModal
        open={showApplyModal}
        opportunity={selectedOpportunity}
        formData={formData}
        applying={applying}
        onClose={closeApplyModal}
        onChange={handleFormChange}
        onSubmit={handleApply}
      />
    </div>
  );
};

export default memo(Careers);
