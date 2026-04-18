"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import {
  ApplicationCard,
  CareerHero,
  CareerSearchToolbar,
  CareerStatGrid,
  PageSkeletonGrid,
  PaginationBar,
} from "../../components/careers_components/CareersShared";

const CAREERS_API = `${globalBackendRoute}/api/careers`;

function getAuthHeaders() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    "";

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

const AllCareerApplications = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [opportunityType, setOpportunityType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (String(user?.role || "").toLowerCase() !== "superadmin") {
      navigate("/home");
    }
  }, [user, navigate]);

  const fetchCounts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${CAREERS_API}/admin/application-counts`,
        getAuthHeaders(),
      );
      setCounts(response.data || {});
    } catch (err) {
      console.error("Error fetching application counts:", err);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit,
        sortBy,
      };

      if (search.trim()) params.search = search.trim();
      if (status !== "all") params.status = status;
      if (opportunityType !== "all") params.opportunityType = opportunityType;

      const response = await axios.get(
        `${CAREERS_API}/admin/all-applications`,
        {
          ...getAuthHeaders(),
          params,
        },
      );

      setItems(response?.data?.items || []);
      setPagination(
        response?.data?.pagination || {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, search, status, opportunityType]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setPage(1);
      fetchApplications();
    },
    [fetchApplications],
  );

  const heroStats = useMemo(
    () => [
      { label: "Total", value: counts.total || 0 },
      { label: "Applied", value: counts.applied || 0 },
      { label: "Accepted", value: counts.accepted || 0 },
      { label: "Rejected", value: counts.rejected || 0 },
    ],
    [counts],
  );

  const gridStats = useMemo(
    () => [
      { label: "Under review", value: counts.underReview || 0 },
      { label: "Shortlisted", value: counts.shortlisted || 0 },
      { label: "Interview", value: counts.interviewScheduled || 0 },
      { label: "Delayed", value: counts.delayed || 0 },
      { label: "Jobs", value: counts.jobs || 0 },
      { label: "Internships", value: counts.internships || 0 },
      { label: "Page", value: page },
    ],
    [counts, page],
  );

  const filterConfig = useMemo(
    () => [
      {
        key: "status",
        value: status,
        onChange: (e) => {
          setStatus(e.target.value);
          setPage(1);
        },
        options: [
          { value: "all", label: "All Status" },
          { value: "applied", label: "Applied" },
          { value: "under_review", label: "Under Review" },
          { value: "shortlisted", label: "Shortlisted" },
          { value: "interview_scheduled", label: "Interview Scheduled" },
          { value: "accepted", label: "Accepted" },
          { value: "rejected", label: "Rejected" },
          { value: "delayed", label: "Delayed" },
        ],
        colSpan: "xl:col-span-2",
      },
      {
        key: "type",
        value: opportunityType,
        onChange: (e) => {
          setOpportunityType(e.target.value);
          setPage(1);
        },
        options: [
          { value: "all", label: "All Types" },
          { value: "job", label: "Jobs" },
          { value: "internship", label: "Internships" },
        ],
        colSpan: "xl:col-span-2",
      },
      {
        key: "sort",
        value: sortBy,
        onChange: (e) => {
          setSortBy(e.target.value);
          setPage(1);
        },
        options: [
          { value: "latest", label: "Latest" },
          { value: "oldest", label: "Oldest" },
          { value: "name_asc", label: "Name A-Z" },
          { value: "name_desc", label: "Name Z-A" },
          { value: "experience_desc", label: "Experience" },
        ],
        colSpan: "xl:col-span-2",
      },
    ],
    [status, opportunityType, sortBy],
  );

  return (
    <div className="service-page-wrap min-h-screen bg-slate-50">
      <CareerHero
        title={
          <>
            Review all{" "}
            <span className="service-hero-title-highlight">
              career applications
            </span>{" "}
            in one place
          </>
        }
        subtitle="Filter, search, and review every job and internship application from a single responsive admin view."
        statCards={heroStats}
      />

      <main className="service-main-wrap">
        <div className="container mx-auto space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <CareerStatGrid stats={gridStats} />

          <CareerSearchToolbar
            search={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            onSubmit={handleSearchSubmit}
            filters={filterConfig}
          />

          {loading ? (
            <PageSkeletonGrid count={6} columns="grid-cols-1 lg:grid-cols-2" />
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-[16px] font-extrabold text-slate-800">
                No applications found
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
              {items.map((item) => (
                <ApplicationCard
                  key={item._id}
                  item={item}
                  onOpen={() =>
                    navigate(`/single-career-application/${item._id}`)
                  }
                />
              ))}
            </section>
          )}

          <PaginationBar
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>
    </div>
  );
};

export default memo(AllCareerApplications);
