const mongoose = require("mongoose");
const Job = require("../models/JobModel");

// ============================================================
// HELPERS
// ============================================================

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const toBoolean = (value, defaultValue = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return defaultValue;
};

const sanitizeJobPayload = (body = {}) => {
  const payload = {};

  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.slug !== undefined)
    payload.slug = String(body.slug).trim().toLowerCase();

  if (body.applyType !== undefined) payload.applyType = body.applyType;
  if (body.department !== undefined)
    payload.department = String(body.department).trim();
  if (body.experienceLevel !== undefined)
    payload.experienceLevel = String(body.experienceLevel).trim();
  if (body.employmentMode !== undefined)
    payload.employmentMode = String(body.employmentMode).trim();
  if (body.preferredLocation !== undefined)
    payload.preferredLocation = String(body.preferredLocation).trim();

  if (body.openingsCount !== undefined)
    payload.openingsCount = Number(body.openingsCount);

  if (body.salaryMin !== undefined && body.salaryMin !== "")
    payload.salaryMin = Number(body.salaryMin);
  if (body.salaryMax !== undefined && body.salaryMax !== "")
    payload.salaryMax = Number(body.salaryMax);
  if (body.salaryCurrency !== undefined)
    payload.salaryCurrency = String(body.salaryCurrency).trim();

  if (body.isSalaryVisible !== undefined)
    payload.isSalaryVisible = toBoolean(body.isSalaryVisible);

  if (body.shortDescription !== undefined)
    payload.shortDescription = String(body.shortDescription).trim();
  if (body.description !== undefined)
    payload.description = String(body.description).trim();

  if (body.responsibilities !== undefined)
    payload.responsibilities = toArray(body.responsibilities);

  if (body.requirements !== undefined)
    payload.requirements = toArray(body.requirements);

  if (body.benefits !== undefined) payload.benefits = toArray(body.benefits);

  if (body.skills !== undefined)
    payload.skills = toArray(body.skills).map((item) => item.toLowerCase());

  if (body.tags !== undefined)
    payload.tags = toArray(body.tags).map((item) => item.toLowerCase());

  if (body.applicationDeadline !== undefined) {
    payload.applicationDeadline = body.applicationDeadline
      ? new Date(body.applicationDeadline)
      : null;
  }

  if (body.externalApplyLink !== undefined)
    payload.externalApplyLink = String(body.externalApplyLink).trim();

  if (body.isPublished !== undefined)
    payload.isPublished = toBoolean(body.isPublished);

  if (body.isDeleted !== undefined)
    payload.isDeleted = toBoolean(body.isDeleted);

  if (body.viewsCount !== undefined)
    payload.viewsCount = Number(body.viewsCount);

  if (body.applicationsCount !== undefined)
    payload.applicationsCount = Number(body.applicationsCount);

  return payload;
};

const buildAdminFilters = (query = {}) => {
  const filters = {};

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { department: { $regex: query.search, $options: "i" } },
      { preferredLocation: { $regex: query.search, $options: "i" } },
      { experienceLevel: { $regex: query.search, $options: "i" } },
      { shortDescription: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { skills: { $in: [new RegExp(query.search, "i")] } },
      { tags: { $in: [new RegExp(query.search, "i")] } },
    ];
  }

  if (query.applyType) filters.applyType = query.applyType;
  if (query.department)
    filters.department = { $regex: query.department, $options: "i" };
  if (query.experienceLevel)
    filters.experienceLevel = { $regex: query.experienceLevel, $options: "i" };
  if (query.employmentMode) filters.employmentMode = query.employmentMode;
  if (query.preferredLocation)
    filters.preferredLocation = {
      $regex: query.preferredLocation,
      $options: "i",
    };

  if (query.isPublished !== undefined && query.isPublished !== "") {
    filters.isPublished = toBoolean(query.isPublished);
  }

  if (query.isDeleted !== undefined && query.isDeleted !== "") {
    filters.isDeleted = toBoolean(query.isDeleted);
  }

  if (query.skills) {
    const skillsArray = toArray(query.skills).map((item) => item.toLowerCase());
    if (skillsArray.length) filters.skills = { $in: skillsArray };
  }

  if (query.tags) {
    const tagsArray = toArray(query.tags).map((item) => item.toLowerCase());
    if (tagsArray.length) filters.tags = { $in: tagsArray };
  }

  if (query.salaryMin !== undefined && query.salaryMin !== "") {
    filters.salaryMin = {
      ...(filters.salaryMin || {}),
      $gte: Number(query.salaryMin),
    };
  }

  if (query.salaryMax !== undefined && query.salaryMax !== "") {
    filters.salaryMax = {
      ...(filters.salaryMax || {}),
      $lte: Number(query.salaryMax),
    };
  }

  if (query.deadlineStatus) {
    const now = new Date();

    if (query.deadlineStatus === "active") {
      filters.$or = [
        ...(filters.$or || []),
        { applicationDeadline: null },
        { applicationDeadline: { $gte: now } },
      ];
    }

    if (query.deadlineStatus === "expired") {
      filters.applicationDeadline = { $lt: now };
    }
  }

  return filters;
};

const buildPublicFilters = (query = {}) => {
  const filters = {
    isPublished: true,
    isDeleted: false,
  };

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { department: { $regex: query.search, $options: "i" } },
      { preferredLocation: { $regex: query.search, $options: "i" } },
      { shortDescription: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { skills: { $in: [new RegExp(query.search, "i")] } },
      { tags: { $in: [new RegExp(query.search, "i")] } },
    ];
  }

  if (query.applyType) filters.applyType = query.applyType;
  if (query.department)
    filters.department = { $regex: query.department, $options: "i" };
  if (query.employmentMode) filters.employmentMode = query.employmentMode;
  if (query.preferredLocation)
    filters.preferredLocation = {
      $regex: query.preferredLocation,
      $options: "i",
    };

  if (query.skills) {
    const skillsArray = toArray(query.skills).map((item) => item.toLowerCase());
    if (skillsArray.length) filters.skills = { $in: skillsArray };
  }

  if (query.tags) {
    const tagsArray = toArray(query.tags).map((item) => item.toLowerCase());
    if (tagsArray.length) filters.tags = { $in: tagsArray };
  }

  if (query.deadlineStatus === "active") {
    const now = new Date();
    filters.$or = [
      ...(filters.$or || []),
      { applicationDeadline: null },
      { applicationDeadline: { $gte: now } },
    ];
  }

  if (query.deadlineStatus === "expired") {
    filters.applicationDeadline = { $lt: new Date() };
  }

  return filters;
};

const buildSortOption = (sortBy = "createdAt", order = "desc") => {
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "title",
    "department",
    "applyType",
    "preferredLocation",
    "viewsCount",
    "applicationsCount",
    "applicationDeadline",
  ];

  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const finalOrder = order === "asc" ? 1 : -1;

  return { [finalSortBy]: finalOrder };
};

const getPagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// ============================================================
// CREATE JOB
// ============================================================

exports.createJob = async (req, res) => {
  try {
    // 🔥 IMPORTANT: get user from token middleware
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found in token",
      });
    }

    const jobData = {
      ...req.body,
      createdBy: userId, // ✅ FIX
    };

    const job = new Job(jobData);
    await job.save();

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("createJob error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL JOBS - ADMIN
// ============================================================

exports.getAllJobsAdmin = async (req, res) => {
  try {
    const filters = buildAdminFilters(req.query);
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const jobs = await Job.find(filters)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      filters,
    });
  } catch (error) {
    console.error("getAllJobsAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL JOBS - PUBLIC
// ============================================================

exports.getAllJobsPublic = async (req, res) => {
  try {
    const filters = buildPublicFilters(req.query);
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const jobs = await Job.find(filters)
      .select("-isDeleted")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Public jobs fetched successfully",
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      filters,
    });
  } catch (error) {
    console.error("getAllJobsPublic error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public jobs",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE JOB - ADMIN
// ============================================================

exports.getJobByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const job = await Job.findById(id)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    console.error("getJobByIdAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE JOB - PUBLIC
// ============================================================

exports.getJobByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const job = await Job.findOne({
      _id: id,
      isPublished: true,
      isDeleted: false,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Published job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Public job fetched successfully",
      data: job,
    });
  } catch (error) {
    console.error("getJobByIdPublic error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public job",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE JOB BY SLUG - PUBLIC
// ============================================================

exports.getJobBySlugPublic = async (req, res) => {
  try {
    const { slug } = req.params;

    const job = await Job.findOne({
      slug: String(slug).trim().toLowerCase(),
      isPublished: true,
      isDeleted: false,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Published job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    console.error("getJobBySlugPublic error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job by slug",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE JOB
// ============================================================

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const payload = sanitizeJobPayload(req.body);
    payload.updatedBy = req.user?._id;

    if (payload.title && !payload.slug) {
      payload.slug = payload.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const updatedJob = await Job.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role");

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error("updateJob error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate slug or unique field already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// ============================================================
// SOFT DELETE JOB
// ============================================================

exports.softDeleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const job = await Job.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        isPublished: false,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job soft deleted successfully",
      data: job,
    });
  } catch (error) {
    console.error("softDeleteJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to soft delete job",
      error: error.message,
    });
  }
};

// ============================================================
// RESTORE JOB
// ============================================================

exports.restoreJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const job = await Job.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job restored successfully",
      data: job,
    });
  } catch (error) {
    console.error("restoreJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to restore job",
      error: error.message,
    });
  }
};

// ============================================================
// HARD DELETE JOB
// ============================================================

exports.hardDeleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job permanently deleted successfully",
      data: deletedJob,
    });
  } catch (error) {
    console.error("hardDeleteJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to permanently delete job",
      error: error.message,
    });
  }
};

// ============================================================
// PUBLISH JOB
// ============================================================

exports.publishJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const job = await Job.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isPublished: true,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job published successfully",
      data: job,
    });
  } catch (error) {
    console.error("publishJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to publish job",
      error: error.message,
    });
  }
};

// ============================================================
// UNPUBLISH JOB
// ============================================================

exports.unpublishJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const job = await Job.findByIdAndUpdate(
      id,
      {
        isPublished: false,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job unpublished successfully",
      data: job,
    });
  } catch (error) {
    console.error("unpublishJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unpublish job",
      error: error.message,
    });
  }
};

// ============================================================
// TOGGLE PUBLISH JOB
// ============================================================

exports.togglePublishJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const existingJob = await Job.findById(id);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (existingJob.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Deleted job cannot be published",
      });
    }

    existingJob.isPublished = !existingJob.isPublished;
    existingJob.updatedBy = req.user?._id;
    await existingJob.save();

    return res.status(200).json({
      success: true,
      message: existingJob.isPublished
        ? "Job published successfully"
        : "Job unpublished successfully",
      data: existingJob,
    });
  } catch (error) {
    console.error("togglePublishJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle publish status",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE STATUS
// ============================================================

exports.updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished, isDeleted } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const updateData = {
      updatedBy: req.user?._id,
    };

    if (isPublished !== undefined)
      updateData.isPublished = toBoolean(isPublished);
    if (isDeleted !== undefined) updateData.isDeleted = toBoolean(isDeleted);

    if (updateData.isDeleted === true) {
      updateData.isPublished = false;
    }

    const job = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("updateJobStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job status",
      error: error.message,
    });
  }
};

// ============================================================
// INCREMENT VIEW COUNT
// ============================================================

exports.incrementJobViews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const job = await Job.findOneAndUpdate(
      {
        _id: id,
        isPublished: true,
        isDeleted: false,
      },
      { $inc: { viewsCount: 1 } },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Published job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job view count incremented",
      data: {
        _id: job._id,
        viewsCount: job.viewsCount,
      },
    });
  } catch (error) {
    console.error("incrementJobViews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to increment job views",
      error: error.message,
    });
  }
};

// ============================================================
// INCREMENT APPLICATION COUNT
// ============================================================

exports.incrementApplicationsCount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const job = await Job.findByIdAndUpdate(
      id,
      { $inc: { applicationsCount: 1 } },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applications count incremented",
      data: {
        _id: job._id,
        applicationsCount: job.applicationsCount,
      },
    });
  } catch (error) {
    console.error("incrementApplicationsCount error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to increment applications count",
      error: error.message,
    });
  }
};

// ============================================================
// DECREMENT APPLICATION COUNT
// ============================================================

exports.decrementApplicationsCount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    const existingJob = await Job.findById(id);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (existingJob.applicationsCount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Applications count is already 0",
      });
    }

    existingJob.applicationsCount -= 1;
    await existingJob.save();

    return res.status(200).json({
      success: true,
      message: "Applications count decremented",
      data: {
        _id: existingJob._id,
        applicationsCount: existingJob.applicationsCount,
      },
    });
  } catch (error) {
    console.error("decrementApplicationsCount error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to decrement applications count",
      error: error.message,
    });
  }
};

// ============================================================
// COUNTS SUMMARY
// ============================================================

exports.getJobCountsSummary = async (_req, res) => {
  try {
    const now = new Date();

    const [
      totalJobs,
      publishedJobs,
      draftJobs,
      deletedJobs,
      activeJobs,
      expiredJobs,
      totalInternships,
      totalRegularJobs,
    ] = await Promise.all([
      Job.countDocuments({}),
      Job.countDocuments({ isPublished: true, isDeleted: false }),
      Job.countDocuments({ isPublished: false, isDeleted: false }),
      Job.countDocuments({ isDeleted: true }),
      Job.countDocuments({
        isDeleted: false,
        isPublished: true,
        $or: [
          { applicationDeadline: null },
          { applicationDeadline: { $gte: now } },
        ],
      }),
      Job.countDocuments({
        isDeleted: false,
        applicationDeadline: { $lt: now },
      }),
      Job.countDocuments({ applyType: "internship", isDeleted: false }),
      Job.countDocuments({ applyType: "job", isDeleted: false }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Job counts fetched successfully",
      data: {
        totalJobs,
        publishedJobs,
        draftJobs,
        deletedJobs,
        activeJobs,
        expiredJobs,
        totalInternships,
        totalRegularJobs,
      },
    });
  } catch (error) {
    console.error("getJobCountsSummary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job counts summary",
      error: error.message,
    });
  }
};

// ============================================================
// COUNT BY DEPARTMENT
// ============================================================

exports.countJobsByDepartment = async (_req, res) => {
  try {
    const data = await Job.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Department-wise job counts fetched successfully",
      data,
    });
  } catch (error) {
    console.error("countJobsByDepartment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch department-wise counts",
      error: error.message,
    });
  }
};

// ============================================================
// COUNT BY LOCATION
// ============================================================

exports.countJobsByLocation = async (_req, res) => {
  try {
    const data = await Job.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$preferredLocation",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          preferredLocation: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Location-wise job counts fetched successfully",
      data,
    });
  } catch (error) {
    console.error("countJobsByLocation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch location-wise counts",
      error: error.message,
    });
  }
};

// ============================================================
// COUNT BY TYPE
// ============================================================

exports.countJobsByType = async (_req, res) => {
  try {
    const data = await Job.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$applyType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          applyType: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Type-wise job counts fetched successfully",
      data,
    });
  } catch (error) {
    console.error("countJobsByType error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch type-wise counts",
      error: error.message,
    });
  }
};

// ============================================================
// FILTER OPTIONS
// ============================================================

exports.getJobFilterOptions = async (_req, res) => {
  try {
    const [departments, locations, applyTypes, employmentModes, skills, tags] =
      await Promise.all([
        Job.distinct("department", { isDeleted: false }),
        Job.distinct("preferredLocation", { isDeleted: false }),
        Job.distinct("applyType", { isDeleted: false }),
        Job.distinct("employmentMode", { isDeleted: false }),
        Job.distinct("skills", { isDeleted: false }),
        Job.distinct("tags", { isDeleted: false }),
      ]);

    return res.status(200).json({
      success: true,
      message: "Job filter options fetched successfully",
      data: {
        departments: departments.filter(Boolean),
        locations: locations.filter(Boolean),
        applyTypes: applyTypes.filter(Boolean),
        employmentModes: employmentModes.filter(Boolean),
        skills: skills.filter(Boolean),
        tags: tags.filter(Boolean),
      },
    });
  } catch (error) {
    console.error("getJobFilterOptions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job filter options",
      error: error.message,
    });
  }
};

// ============================================================
// BULK SOFT DELETE
// ============================================================

exports.bulkSoftDeleteJobs = async (req, res) => {
  try {
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || !jobIds.length) {
      return res.status(400).json({
        success: false,
        message: "jobIds array is required",
      });
    }

    const validIds = jobIds.filter((id) => isValidObjectId(id));

    const result = await Job.updateMany(
      { _id: { $in: validIds } },
      {
        isDeleted: true,
        isPublished: false,
        updatedBy: req.user?._id,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Jobs soft deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkSoftDeleteJobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk soft delete jobs",
      error: error.message,
    });
  }
};

// ============================================================
// BULK HARD DELETE
// ============================================================

exports.bulkHardDeleteJobs = async (req, res) => {
  try {
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || !jobIds.length) {
      return res.status(400).json({
        success: false,
        message: "jobIds array is required",
      });
    }

    const validIds = jobIds.filter((id) => isValidObjectId(id));

    const result = await Job.deleteMany({
      _id: { $in: validIds },
    });

    return res.status(200).json({
      success: true,
      message: "Jobs permanently deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkHardDeleteJobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk hard delete jobs",
      error: error.message,
    });
  }
};

// ============================================================
// BULK RESTORE
// ============================================================

exports.bulkRestoreJobs = async (req, res) => {
  try {
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || !jobIds.length) {
      return res.status(400).json({
        success: false,
        message: "jobIds array is required",
      });
    }

    const validIds = jobIds.filter((id) => isValidObjectId(id));

    const result = await Job.updateMany(
      { _id: { $in: validIds } },
      {
        isDeleted: false,
        updatedBy: req.user?._id,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Jobs restored successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkRestoreJobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk restore jobs",
      error: error.message,
    });
  }
};

// ============================================================
// BULK PUBLISH
// ============================================================

exports.bulkPublishJobs = async (req, res) => {
  try {
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || !jobIds.length) {
      return res.status(400).json({
        success: false,
        message: "jobIds array is required",
      });
    }

    const validIds = jobIds.filter((id) => isValidObjectId(id));

    const result = await Job.updateMany(
      {
        _id: { $in: validIds },
        isDeleted: false,
      },
      {
        isPublished: true,
        updatedBy: req.user?._id,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Jobs published successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkPublishJobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk publish jobs",
      error: error.message,
    });
  }
};

// ============================================================
// BULK UNPUBLISH
// ============================================================

exports.bulkUnpublishJobs = async (req, res) => {
  try {
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || !jobIds.length) {
      return res.status(400).json({
        success: false,
        message: "jobIds array is required",
      });
    }

    const validIds = jobIds.filter((id) => isValidObjectId(id));

    const result = await Job.updateMany(
      { _id: { $in: validIds } },
      {
        isPublished: false,
        updatedBy: req.user?._id,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Jobs unpublished successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkUnpublishJobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk unpublish jobs",
      error: error.message,
    });
  }
};

// ============================================================
// BULK UPDATE STATUS
// ============================================================

exports.bulkUpdateJobStatus = async (req, res) => {
  try {
    const { jobIds, isPublished, isDeleted } = req.body;

    if (!Array.isArray(jobIds) || !jobIds.length) {
      return res.status(400).json({
        success: false,
        message: "jobIds array is required",
      });
    }

    const validIds = jobIds.filter((id) => isValidObjectId(id));

    const updateData = {
      updatedBy: req.user?._id,
    };

    if (isPublished !== undefined)
      updateData.isPublished = toBoolean(isPublished);
    if (isDeleted !== undefined) updateData.isDeleted = toBoolean(isDeleted);

    if (updateData.isDeleted === true) {
      updateData.isPublished = false;
    }

    const result = await Job.updateMany({ _id: { $in: validIds } }, updateData);

    return res.status(200).json({
      success: true,
      message: "Jobs status updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkUpdateJobStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk update job status",
      error: error.message,
    });
  }
};

// ============================================================
// GET DELETED JOBS
// ============================================================

exports.getDeletedJobs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const jobs = await Job.find({ isDeleted: true })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({ isDeleted: true });

    return res.status(200).json({
      success: true,
      message: "Deleted jobs fetched successfully",
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getDeletedJobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch deleted jobs",
      error: error.message,
    });
  }
};

// ============================================================
// GET PUBLISHED JOBS
// ============================================================

exports.getPublishedJobsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const jobs = await Job.find({
      isPublished: true,
      isDeleted: false,
    })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({
      isPublished: true,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      message: "Published jobs fetched successfully",
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getPublishedJobsAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch published jobs",
      error: error.message,
    });
  }
};

// ============================================================
// GET DRAFT JOBS
// ============================================================

exports.getDraftJobsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const jobs = await Job.find({
      isPublished: false,
      isDeleted: false,
    })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({
      isPublished: false,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      message: "Draft jobs fetched successfully",
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getDraftJobsAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch draft jobs",
      error: error.message,
    });
  }
};
