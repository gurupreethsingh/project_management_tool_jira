"use client";

import React, { memo } from "react";
import {
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaClock,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaUserTie,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";
import careersBanner from "../../assets/images/about_banner.jpg";

export const CAREERS_HERO_STYLE = {
  backgroundImage: `url(${careersBanner})`,
};

export const CAREERS_HERO_TAGS = [
  "CAREERS",
  "JOBS",
  "INTERNSHIPS",
  "GROWTH",
  "TEAM",
];

export const statusColorMap = {
  applied: "bg-orange-50 text-orange-700 border-orange-100",
  under_review: "bg-slate-100 text-slate-700 border-slate-200",
  shortlisted: "bg-blue-50 text-blue-700 border-blue-100",
  interview_scheduled: "bg-purple-50 text-purple-700 border-purple-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
  delayed: "bg-amber-50 text-amber-700 border-amber-100",
};

export function getStatusClasses(status) {
  return (
    statusColorMap[status] || "bg-slate-100 text-slate-700 border-slate-200"
  );
}

export function formatOpportunityType(type) {
  return type === "internship" ? "Internship" : "Job";
}

export function formatMoneyRange(item) {
  const currency = item?.currency || "INR";

  if (item?.opportunityType === "internship") {
    if (item?.stipendMin || item?.stipendMax) {
      return `${currency} ${item?.stipendMin || 0} - ${item?.stipendMax || 0}`;
    }
    return "Stipend not specified";
  }

  if (item?.salaryMin || item?.salaryMax) {
    return `${currency} ${item?.salaryMin || 0} - ${item?.salaryMax || 0}`;
  }
  return "Salary not specified";
}

export const CareerHero = memo(function CareerHero({
  title,
  subtitle,
  statCards = [],
}) {
  return (
    <section className="service-hero-section" style={CAREERS_HERO_STYLE}>
      <div className="service-hero-overlay-1" />
      <div className="service-hero-overlay-2" />
      <div className="service-hero-overlay-3" />

      <div className="service-hero-container">
        <div className="service-hero-layout">
          <div className="max-w-4xl">
            <div className="service-tag-row">
              {CAREERS_HERO_TAGS.map((item) => (
                <span key={item} className="service-tag-pill">
                  {item}
                </span>
              ))}
            </div>

            <h1 className="service-hero-title">{title}</h1>

            <p className="service-hero-text">{subtitle}</p>

            <div className="service-hero-status">
              <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
              Hiring across roles and internship tracks
            </div>

            {!!statCards.length && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl bg-white/12 border border-white/15 backdrop-blur-sm px-4 py-4"
                  >
                    <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-white/75">
                      {card.label}
                    </p>
                    <p className="mt-2 text-xl sm:text-2xl font-black text-white">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export const CareerSearchToolbar = memo(function CareerSearchToolbar({
  search,
  onSearchChange,
  onSubmit,
  filters = [],
  rightActions = null,
}) {
  return (
    <section className="rounded-3xl bg-white border border-slate-200 shadow-sm px-4 sm:px-5 py-4 sm:py-5">
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3"
      >
        <div className="xl:col-span-4 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]" />
          <input
            type="text"
            value={search}
            onChange={onSearchChange}
            placeholder="Search by role, candidate, email, location..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-[13px] font-semibold text-slate-700 outline-none focus:border-slate-400"
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.key} className={filter.colSpan || "xl:col-span-2"}>
            <select
              value={filter.value}
              onChange={filter.onChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-700 outline-none focus:border-slate-400"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="xl:col-span-2">
          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 py-3 text-[13px] font-extrabold text-white hover:opacity-95 transition"
          >
            Search
          </button>
        </div>
      </form>

      {rightActions ? <div className="mt-3">{rightActions}</div> : null}
    </section>
  );
});

export const CareerStatGrid = memo(function CareerStatGrid({ stats = [] }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5"
        >
          <p className="service-badge-heading">{item.label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
});

export const OpportunityCard = memo(function OpportunityCard({
  item,
  onView,
  onApply,
}) {
  return (
    <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 text-[10px] sm:text-[11px] font-extrabold">
            {item?.opportunityType === "internship" ? (
              <FaGraduationCap />
            ) : (
              <FaBriefcase />
            )}
            {formatOpportunityType(item?.opportunityType)}
          </div>

          <h3 className="mt-3 text-[18px] sm:text-[20px] font-black text-slate-900 leading-snug">
            {item?.title}
          </h3>
        </div>

        {item?.isFeatured ? (
          <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 text-[10px] font-extrabold">
            Featured
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 text-[12px] sm:text-[13px] text-slate-600">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-slate-900" />
          <span>{item?.location || "Location not specified"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-slate-900" />
          <span>{item?.workMode || "Work mode not specified"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-slate-900" />
          <span>{item?.experienceLevel || "Experience not specified"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaRupeeSign className="text-slate-900" />
          <span>{formatMoneyRange(item)}</span>
        </div>
      </div>

      <p className="mt-4 service-small-paragraph line-clamp-3">
        {item?.shortDescription || item?.fullDescription}
      </p>

      {!!item?.skillsRequired?.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.skillsRequired.slice(0, 5).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-full bg-slate-100 px-3 py-1 text-[10px] sm:text-[11px] font-bold text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onView}
          className="rounded-2xl border border-slate-200 bg-slate-50 py-3 text-[12px] font-extrabold text-slate-700 hover:bg-slate-100 transition"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={onApply}
          className="rounded-2xl bg-slate-900 py-3 text-[12px] font-extrabold text-white hover:opacity-95 transition"
        >
          Apply Now
        </button>
      </div>
    </article>
  );
});

export const ApplicationCard = memo(function ApplicationCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] sm:text-[11px] font-extrabold text-slate-700">
            {item?.opportunityTypeSnapshot === "internship" ? (
              <FaGraduationCap />
            ) : (
              <FaBriefcase />
            )}
            {item?.opportunityTypeSnapshot}
          </div>

          <h3 className="mt-3 text-[18px] sm:text-[20px] font-black text-slate-900">
            {item?.fullName ||
              `${item?.firstName || ""} ${item?.lastName || ""}`}
          </h3>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-extrabold ${getStatusClasses(
            item?.status,
          )}`}
        >
          {item?.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-[12px] sm:text-[13px] text-slate-600">
        <div className="flex items-center gap-2">
          <FaUserTie className="text-slate-900" />
          <span>{item?.opportunityTitleSnapshot}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-slate-900" />
          <span>{item?.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-slate-900" />
          <span>{item?.totalExperienceYears || 0} years experience</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-slate-900" />
          <span>
            Applied on{" "}
            {item?.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>

      {!!item?.skills?.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.skills.slice(0, 5).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-full bg-orange-50 px-3 py-1 text-[10px] sm:text-[11px] font-bold text-orange-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </button>
  );
});

export const InfoBlock = memo(function InfoBlock({ label, value }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
      <p className="service-badge-heading">{label}</p>
      <p className="mt-2 text-[13px] sm:text-[14px] font-bold text-slate-900 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
});

export const LongTextBlock = memo(function LongTextBlock({ title, value }) {
  if (!value) return null;

  return (
    <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
      <h3 className="service-badge-heading">{title}</h3>
      <p className="mt-3 service-paragraph whitespace-pre-wrap">{value}</p>
    </section>
  );
});

export const PageSkeletonGrid = memo(function PageSkeletonGrid({
  count = 6,
  columns = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
}) {
  return (
    <div className={`grid ${columns} gap-4 sm:gap-5`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 animate-pulse"
        >
          <div className="h-5 w-1/3 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
          <div className="mt-5 h-10 w-full rounded-2xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
});

export const PaginationBar = memo(function PaginationBar({
  page,
  totalPages,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-extrabold text-slate-700 disabled:opacity-50"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`rounded-full px-4 py-2 text-[12px] font-extrabold ${
              page === pageNumber
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-extrabold text-slate-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
});
