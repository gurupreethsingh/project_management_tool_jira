const mongoose = require("mongoose");
const Internship = require("../models/InternshipModel");

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

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const toNumberOrDefault = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === "")
    return defaultValue;
  const num = Number(value);
  return Number.isNaN(num) ? defaultValue : num;
};

const sanitizeInternshipPayload = (body = {}) => {
  const payload = {};

  // ============================================================
  // BASIC INFO
  // ============================================================
  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.slug !== undefined) {
    payload.slug = String(body.slug).trim().toLowerCase();
  }
  if (body.applyType !== undefined) payload.applyType = "internship";

  // ============================================================
  // INTERNSHIP DETAILS
  // ============================================================
  if (body.department !== undefined) {
    payload.department = String(body.department).trim();
  }

  if (body.domain !== undefined) {
    payload.domain = String(body.domain).trim();
  }

  if (body.mode !== undefined) {
    payload.mode = String(body.mode).trim();
  }

  if (body.preferredLocation !== undefined) {
    payload.preferredLocation = String(body.preferredLocation).trim();
  }

  if (body.duration !== undefined) {
    payload.duration = String(body.duration).trim();
  }

  if (body.openingsCount !== undefined) {
    payload.openingsCount = toNumberOrDefault(body.openingsCount, 1);
  }

  if (body.totalStudentsAllowed !== undefined) {
    payload.totalStudentsAllowed = toNumberOrDefault(
      body.totalStudentsAllowed,
      0,
    );
  }

  // ============================================================
  // TRAINING / PROJECT
  // ============================================================
  if (body.trainingDetails !== undefined) {
    payload.trainingDetails = String(body.trainingDetails).trim();
  }

  if (body.projectDetails !== undefined) {
    payload.projectDetails = String(body.projectDetails).trim();
  }

  if (body.techStack !== undefined) {
    payload.techStack = toArray(body.techStack).map((item) =>
      item.toLowerCase(),
    );
  }

  // ============================================================
  // PAYMENT / FEES
  // ============================================================
  if (body.paymentType !== undefined) {
    payload.paymentType = String(body.paymentType).trim();
  }

  if (body.stipendAmount !== undefined) {
    payload.stipendAmount = toNumberOrNull(body.stipendAmount);
  }

  if (body.feesAmount !== undefined) {
    payload.feesAmount = toNumberOrNull(body.feesAmount);
  }

  if (body.currency !== undefined) {
    payload.currency = String(body.currency).trim();
  }

  if (body.feesPaymentStatus !== undefined) {
    payload.feesPaymentStatus = String(body.feesPaymentStatus).trim();
  }

  // ============================================================
  // DATES
  // ============================================================
  if (body.startDate !== undefined) {
    payload.startDate = body.startDate ? new Date(body.startDate) : null;
  }

  if (body.endDate !== undefined) {
    payload.endDate = body.endDate ? new Date(body.endDate) : null;
  }

  if (body.applicationDeadline !== undefined) {
    payload.applicationDeadline = body.applicationDeadline
      ? new Date(body.applicationDeadline)
      : null;
  }

  // ============================================================
  // STUDENT TRACKING
  // ============================================================
  if (body.totalApplications !== undefined) {
    payload.totalApplications = toNumberOrDefault(body.totalApplications, 0);
  }

  if (body.totalSelectedStudents !== undefined) {
    payload.totalSelectedStudents = toNumberOrDefault(
      body.totalSelectedStudents,
      0,
    );
  }

  if (body.totalActiveInterns !== undefined) {
    payload.totalActiveInterns = toNumberOrDefault(body.totalActiveInterns, 0);
  }

  if (body.totalCompletedInterns !== undefined) {
    payload.totalCompletedInterns = toNumberOrDefault(
      body.totalCompletedInterns,
      0,
    );
  }

  if (body.totalDroppedInterns !== undefined) {
    payload.totalDroppedInterns = toNumberOrDefault(
      body.totalDroppedInterns,
      0,
    );
  }

  // ============================================================
  // SUBMISSION STATUS
  // ============================================================
  if (body.submissionStatus !== undefined) {
    payload.submissionStatus = {
      synopsisSubmitted: toBoolean(
        body.submissionStatus?.synopsisSubmitted,
        false,
      ),
      codeSubmitted: toBoolean(body.submissionStatus?.codeSubmitted, false),
      projectReportSubmitted: toBoolean(
        body.submissionStatus?.projectReportSubmitted,
        false,
      ),
      vivaCompleted: toBoolean(body.submissionStatus?.vivaCompleted, false),
    };
  }

  // ============================================================
  // DOCUMENT STATUS
  // ============================================================
  if (body.documents !== undefined) {
    payload.documents = {
      acceptanceLetterGenerated: toBoolean(
        body.documents?.acceptanceLetterGenerated,
        false,
      ),
      certificateGenerated: toBoolean(
        body.documents?.certificateGenerated,
        false,
      ),
    };
  }

  // ============================================================
  // CONTENT
  // ============================================================
  if (body.shortDescription !== undefined) {
    payload.shortDescription = String(body.shortDescription).trim();
  }

  if (body.description !== undefined) {
    payload.description = String(body.description).trim();
  }

  if (body.skills !== undefined) {
    payload.skills = toArray(body.skills).map((item) => item.toLowerCase());
  }

  if (body.tags !== undefined) {
    payload.tags = toArray(body.tags).map((item) => item.toLowerCase());
  }

  // ============================================================
  // STATUS
  // ============================================================
  if (body.isPublished !== undefined) {
    payload.isPublished = toBoolean(body.isPublished);
  }

  if (body.isDeleted !== undefined) {
    payload.isDeleted = toBoolean(body.isDeleted);
  }

  // ============================================================
  // META
  // ============================================================
  if (body.viewsCount !== undefined) {
    payload.viewsCount = toNumberOrDefault(body.viewsCount, 0);
  }

  return payload;
};

const buildAdminFilters = (query = {}) => {
  const filters = {};

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { department: { $regex: query.search, $options: "i" } },
      { domain: { $regex: query.search, $options: "i" } },
      { preferredLocation: { $regex: query.search, $options: "i" } },
      { duration: { $regex: query.search, $options: "i" } },
      { paymentType: { $regex: query.search, $options: "i" } },
      { trainingDetails: { $regex: query.search, $options: "i" } },
      { projectDetails: { $regex: query.search, $options: "i" } },
      { shortDescription: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { skills: { $in: [new RegExp(query.search, "i")] } },
      { tags: { $in: [new RegExp(query.search, "i")] } },
    ];
  }

  if (query.department) {
    filters.department = { $regex: query.department, $options: "i" };
  }

  if (query.domain) {
    filters.domain = { $regex: query.domain, $options: "i" };
  }

  if (query.mode) {
    filters.mode = query.mode;
  }

  if (query.preferredLocation) {
    filters.preferredLocation = {
      $regex: query.preferredLocation,
      $options: "i",
    };
  }

  if (query.duration) {
    filters.duration = query.duration;
  }

  if (query.paymentType) {
    filters.paymentType = query.paymentType;
  }

  if (query.feesPaymentStatus !== undefined && query.feesPaymentStatus !== "") {
    filters.feesPaymentStatus = query.feesPaymentStatus;
  }

  if (query.isPublished !== undefined && query.isPublished !== "") {
    filters.isPublished = toBoolean(query.isPublished);
  }

  if (query.isDeleted !== undefined && query.isDeleted !== "") {
    filters.isDeleted = toBoolean(query.isDeleted);
  }

  if (query.skills) {
    const skillsArray = toArray(query.skills).map((item) => item.toLowerCase());
    if (skillsArray.length) {
      filters.skills = { $in: skillsArray };
    }
  }

  if (query.tags) {
    const tagsArray = toArray(query.tags).map((item) => item.toLowerCase());
    if (tagsArray.length) {
      filters.tags = { $in: tagsArray };
    }
  }

  if (query.startDateFrom || query.startDateTo) {
    filters.startDate = {};
    if (query.startDateFrom)
      filters.startDate.$gte = new Date(query.startDateFrom);
    if (query.startDateTo) filters.startDate.$lte = new Date(query.startDateTo);
  }

  if (query.endDateFrom || query.endDateTo) {
    filters.endDate = {};
    if (query.endDateFrom) filters.endDate.$gte = new Date(query.endDateFrom);
    if (query.endDateTo) filters.endDate.$lte = new Date(query.endDateTo);
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
      { domain: { $regex: query.search, $options: "i" } },
      { preferredLocation: { $regex: query.search, $options: "i" } },
      { duration: { $regex: query.search, $options: "i" } },
      { paymentType: { $regex: query.search, $options: "i" } },
      { shortDescription: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { skills: { $in: [new RegExp(query.search, "i")] } },
      { tags: { $in: [new RegExp(query.search, "i")] } },
    ];
  }

  if (query.department) {
    filters.department = { $regex: query.department, $options: "i" };
  }

  if (query.domain) {
    filters.domain = { $regex: query.domain, $options: "i" };
  }

  if (query.mode) {
    filters.mode = query.mode;
  }

  if (query.preferredLocation) {
    filters.preferredLocation = {
      $regex: query.preferredLocation,
      $options: "i",
    };
  }

  if (query.duration) {
    filters.duration = query.duration;
  }

  if (query.paymentType) {
    filters.paymentType = query.paymentType;
  }

  if (query.skills) {
    const skillsArray = toArray(query.skills).map((item) => item.toLowerCase());
    if (skillsArray.length) {
      filters.skills = { $in: skillsArray };
    }
  }

  if (query.tags) {
    const tagsArray = toArray(query.tags).map((item) => item.toLowerCase());
    if (tagsArray.length) {
      filters.tags = { $in: tagsArray };
    }
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
    "domain",
    "duration",
    "preferredLocation",
    "viewsCount",
    "totalApplications",
    "totalSelectedStudents",
    "startDate",
    "endDate",
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
// CREATE INTERNSHIP
// ============================================================

exports.createInternship = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found in token",
      });
    }

    const internshipData = {
      ...sanitizeInternshipPayload(req.body),
      applyType: "internship",
      createdBy: userId,
    };

    const internship = new Internship(internshipData);
    await internship.save();

    return res.status(201).json({
      success: true,
      message: "Internship created successfully",
      data: internship,
    });
  } catch (error) {
    console.error("createInternship error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate slug or unique field already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create internship",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL INTERNSHIPS - ADMIN
// ============================================================

exports.getAllInternshipsAdmin = async (req, res) => {
  try {
    const filters = buildAdminFilters(req.query);
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const internships = await Internship.find(filters)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Internship.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Internships fetched successfully",
      data: internships,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      filters,
    });
  } catch (error) {
    console.error("getAllInternshipsAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch internships",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL INTERNSHIPS - PUBLIC
// ============================================================

exports.getAllInternshipsPublic = async (req, res) => {
  try {
    const filters = buildPublicFilters(req.query);
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const internships = await Internship.find(filters)
      .select("-isDeleted")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Internship.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Public internships fetched successfully",
      data: internships,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      filters,
    });
  } catch (error) {
    console.error("getAllInternshipsPublic error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public internships",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE INTERNSHIP - ADMIN
// ============================================================

exports.getInternshipByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findById(id)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role");

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship fetched successfully",
      data: internship,
    });
  } catch (error) {
    console.error("getInternshipByIdAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch internship",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE INTERNSHIP - PUBLIC
// ============================================================

exports.getInternshipByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findOne({
      _id: id,
      isPublished: true,
      isDeleted: false,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Published internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Public internship fetched successfully",
      data: internship,
    });
  } catch (error) {
    console.error("getInternshipByIdPublic error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public internship",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE INTERNSHIP BY SLUG - PUBLIC
// ============================================================

exports.getInternshipBySlugPublic = async (req, res) => {
  try {
    const { slug } = req.params;

    const internship = await Internship.findOne({
      slug: String(slug).trim().toLowerCase(),
      isPublished: true,
      isDeleted: false,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Published internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship fetched successfully",
      data: internship,
    });
  } catch (error) {
    console.error("getInternshipBySlugPublic error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch internship by slug",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE INTERNSHIP
// ============================================================

exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const payload = sanitizeInternshipPayload(req.body);
    payload.updatedBy = req.user?._id;
    payload.applyType = "internship";

    if (payload.title && !payload.slug) {
      payload.slug = payload.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const updatedInternship = await Internship.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role");

    if (!updatedInternship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship updated successfully",
      data: updatedInternship,
    });
  } catch (error) {
    console.error("updateInternship error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate slug or unique field already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update internship",
      error: error.message,
    });
  }
};

// ============================================================
// SOFT DELETE INTERNSHIP
// ============================================================

exports.softDeleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        isPublished: false,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship soft deleted successfully",
      data: internship,
    });
  } catch (error) {
    console.error("softDeleteInternship error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to soft delete internship",
      error: error.message,
    });
  }
};

// ============================================================
// RESTORE INTERNSHIP
// ============================================================

exports.restoreInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship restored successfully",
      data: internship,
    });
  } catch (error) {
    console.error("restoreInternship error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to restore internship",
      error: error.message,
    });
  }
};

// ============================================================
// HARD DELETE INTERNSHIP
// ============================================================

exports.hardDeleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const deletedInternship = await Internship.findByIdAndDelete(id);

    if (!deletedInternship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship permanently deleted successfully",
      data: deletedInternship,
    });
  } catch (error) {
    console.error("hardDeleteInternship error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to permanently delete internship",
      error: error.message,
    });
  }
};

// ============================================================
// PUBLISH INTERNSHIP
// ============================================================

exports.publishInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isPublished: true,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found or deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship published successfully",
      data: internship,
    });
  } catch (error) {
    console.error("publishInternship error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to publish internship",
      error: error.message,
    });
  }
};

// ============================================================
// UNPUBLISH INTERNSHIP
// ============================================================

exports.unpublishInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findByIdAndUpdate(
      id,
      {
        isPublished: false,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship unpublished successfully",
      data: internship,
    });
  } catch (error) {
    console.error("unpublishInternship error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unpublish internship",
      error: error.message,
    });
  }
};

// ============================================================
// TOGGLE PUBLISH INTERNSHIP
// ============================================================

exports.togglePublishInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const existingInternship = await Internship.findById(id);

    if (!existingInternship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (existingInternship.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Deleted internship cannot be published",
      });
    }

    existingInternship.isPublished = !existingInternship.isPublished;
    existingInternship.updatedBy = req.user?._id;
    await existingInternship.save();

    return res.status(200).json({
      success: true,
      message: existingInternship.isPublished
        ? "Internship published successfully"
        : "Internship unpublished successfully",
      data: existingInternship,
    });
  } catch (error) {
    console.error("togglePublishInternship error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle publish status",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE INTERNSHIP STATUS
// ============================================================

exports.updateInternshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished, isDeleted } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const updateData = {
      updatedBy: req.user?._id,
    };

    if (isPublished !== undefined) {
      updateData.isPublished = toBoolean(isPublished);
    }

    if (isDeleted !== undefined) {
      updateData.isDeleted = toBoolean(isDeleted);
    }

    if (updateData.isDeleted === true) {
      updateData.isPublished = false;
    }

    const internship = await Internship.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship status updated successfully",
      data: internship,
    });
  } catch (error) {
    console.error("updateInternshipStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update internship status",
      error: error.message,
    });
  }
};

// ============================================================
// INCREMENT VIEW COUNT
// ============================================================

exports.incrementInternshipViews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findOneAndUpdate(
      {
        _id: id,
        isPublished: true,
        isDeleted: false,
      },
      { $inc: { viewsCount: 1 } },
      { new: true },
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Published internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship view count incremented",
      data: {
        _id: internship._id,
        viewsCount: internship.viewsCount,
      },
    });
  } catch (error) {
    console.error("incrementInternshipViews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to increment internship views",
      error: error.message,
    });
  }
};

// ============================================================
// INCREMENT APPLICATION COUNT
// ============================================================

exports.incrementInternshipApplications = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findByIdAndUpdate(
      id,
      { $inc: { totalApplications: 1 } },
      { new: true },
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship application count incremented",
      data: {
        _id: internship._id,
        totalApplications: internship.totalApplications,
      },
    });
  } catch (error) {
    console.error("incrementInternshipApplications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to increment internship applications",
      error: error.message,
    });
  }
};

// ============================================================
// DECREMENT APPLICATION COUNT
// ============================================================

exports.decrementInternshipApplications = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const existingInternship = await Internship.findById(id);

    if (!existingInternship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (existingInternship.totalApplications <= 0) {
      return res.status(400).json({
        success: false,
        message: "Applications count is already 0",
      });
    }

    existingInternship.totalApplications -= 1;
    await existingInternship.save();

    return res.status(200).json({
      success: true,
      message: "Internship application count decremented",
      data: {
        _id: existingInternship._id,
        totalApplications: existingInternship.totalApplications,
      },
    });
  } catch (error) {
    console.error("decrementInternshipApplications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to decrement internship applications",
      error: error.message,
    });
  }
};

// ============================================================
// GENERATE ACCEPTANCE LETTER STATUS
// ============================================================

exports.generateAcceptanceLetter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findByIdAndUpdate(
      id,
      {
        "documents.acceptanceLetterGenerated": true,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Acceptance letter marked as generated successfully",
      data: internship,
    });
  } catch (error) {
    console.error("generateAcceptanceLetter error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate acceptance letter status",
      error: error.message,
    });
  }
};

// ============================================================
// GENERATE CERTIFICATE STATUS
// ============================================================

exports.generateInternshipCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const internship = await Internship.findByIdAndUpdate(
      id,
      {
        "documents.certificateGenerated": true,
        updatedBy: req.user?._id,
      },
      { new: true },
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Internship certificate marked as generated successfully",
      data: internship,
    });
  } catch (error) {
    console.error("generateInternshipCertificate error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate internship certificate status",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE SUBMISSION STATUS
// ============================================================

exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      synopsisSubmitted,
      codeSubmitted,
      projectReportSubmitted,
      vivaCompleted,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship id",
      });
    }

    const updateData = {
      updatedBy: req.user?._id,
    };

    if (synopsisSubmitted !== undefined) {
      updateData["submissionStatus.synopsisSubmitted"] =
        toBoolean(synopsisSubmitted);
    }

    if (codeSubmitted !== undefined) {
      updateData["submissionStatus.codeSubmitted"] = toBoolean(codeSubmitted);
    }

    if (projectReportSubmitted !== undefined) {
      updateData["submissionStatus.projectReportSubmitted"] = toBoolean(
        projectReportSubmitted,
      );
    }

    if (vivaCompleted !== undefined) {
      updateData["submissionStatus.vivaCompleted"] = toBoolean(vivaCompleted);
    }

    const internship = await Internship.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission status updated successfully",
      data: internship,
    });
  } catch (error) {
    console.error("updateSubmissionStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update submission status",
      error: error.message,
    });
  }
};

// ============================================================
// COUNTS SUMMARY
// ============================================================

exports.getInternshipCountsSummary = async (_req, res) => {
  try {
    const now = new Date();

    const [
      totalInternships,
      publishedInternships,
      draftInternships,
      deletedInternships,
      activeInternships,
      expiredInternships,
      paidInternships,
      unpaidInternships,
      stipendInternships,
    ] = await Promise.all([
      Internship.countDocuments({}),
      Internship.countDocuments({ isPublished: true, isDeleted: false }),
      Internship.countDocuments({ isPublished: false, isDeleted: false }),
      Internship.countDocuments({ isDeleted: true }),
      Internship.countDocuments({
        isDeleted: false,
        isPublished: true,
        $or: [
          { applicationDeadline: null },
          { applicationDeadline: { $gte: now } },
        ],
      }),
      Internship.countDocuments({
        isDeleted: false,
        applicationDeadline: { $lt: now },
      }),
      Internship.countDocuments({ paymentType: "Paid", isDeleted: false }),
      Internship.countDocuments({ paymentType: "Unpaid", isDeleted: false }),
      Internship.countDocuments({ paymentType: "Stipend", isDeleted: false }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Internship counts fetched successfully",
      data: {
        totalInternships,
        publishedInternships,
        draftInternships,
        deletedInternships,
        activeInternships,
        expiredInternships,
        paidInternships,
        unpaidInternships,
        stipendInternships,
      },
    });
  } catch (error) {
    console.error("getInternshipCountsSummary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch internship counts summary",
      error: error.message,
    });
  }
};

// ============================================================
// COUNT BY DEPARTMENT
// ============================================================

exports.countInternshipsByDepartment = async (_req, res) => {
  try {
    const data = await Internship.aggregate([
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
      message: "Department-wise internship counts fetched successfully",
      data,
    });
  } catch (error) {
    console.error("countInternshipsByDepartment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch department-wise internship counts",
      error: error.message,
    });
  }
};

// ============================================================
// COUNT BY LOCATION
// ============================================================

exports.countInternshipsByLocation = async (_req, res) => {
  try {
    const data = await Internship.aggregate([
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
      message: "Location-wise internship counts fetched successfully",
      data,
    });
  } catch (error) {
    console.error("countInternshipsByLocation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch location-wise internship counts",
      error: error.message,
    });
  }
};

// ============================================================
// COUNT BY DURATION
// ============================================================

exports.countInternshipsByDuration = async (_req, res) => {
  try {
    const data = await Internship.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$duration",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          duration: "$_id",
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
      message: "Duration-wise internship counts fetched successfully",
      data,
    });
  } catch (error) {
    console.error("countInternshipsByDuration error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch duration-wise internship counts",
      error: error.message,
    });
  }
};

// ============================================================
// COUNT BY PAYMENT TYPE
// ============================================================

exports.countInternshipsByPaymentType = async (_req, res) => {
  try {
    const data = await Internship.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$paymentType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          paymentType: "$_id",
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
      message: "Payment-type-wise internship counts fetched successfully",
      data,
    });
  } catch (error) {
    console.error("countInternshipsByPaymentType error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment-type-wise internship counts",
      error: error.message,
    });
  }
};

// ============================================================
// FILTER OPTIONS
// ============================================================

exports.getInternshipFilterOptions = async (_req, res) => {
  try {
    const [
      departments,
      domains,
      locations,
      durations,
      paymentTypes,
      modes,
      skills,
      tags,
    ] = await Promise.all([
      Internship.distinct("department", { isDeleted: false }),
      Internship.distinct("domain", { isDeleted: false }),
      Internship.distinct("preferredLocation", { isDeleted: false }),
      Internship.distinct("duration", { isDeleted: false }),
      Internship.distinct("paymentType", { isDeleted: false }),
      Internship.distinct("mode", { isDeleted: false }),
      Internship.distinct("skills", { isDeleted: false }),
      Internship.distinct("tags", { isDeleted: false }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Internship filter options fetched successfully",
      data: {
        departments: departments.filter(Boolean),
        domains: domains.filter(Boolean),
        locations: locations.filter(Boolean),
        durations: durations.filter(Boolean),
        paymentTypes: paymentTypes.filter(Boolean),
        modes: modes.filter(Boolean),
        skills: skills.filter(Boolean),
        tags: tags.filter(Boolean),
      },
    });
  } catch (error) {
    console.error("getInternshipFilterOptions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch internship filter options",
      error: error.message,
    });
  }
};

// ============================================================
// BULK SOFT DELETE
// ============================================================

exports.bulkSoftDeleteInternships = async (req, res) => {
  try {
    const { internshipIds } = req.body;

    if (!Array.isArray(internshipIds) || !internshipIds.length) {
      return res.status(400).json({
        success: false,
        message: "internshipIds array is required",
      });
    }

    const validIds = internshipIds.filter((id) => isValidObjectId(id));

    const result = await Internship.updateMany(
      { _id: { $in: validIds } },
      {
        isDeleted: true,
        isPublished: false,
        updatedBy: req.user?._id,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Internships soft deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkSoftDeleteInternships error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk soft delete internships",
      error: error.message,
    });
  }
};

// ============================================================
// BULK HARD DELETE
// ============================================================

exports.bulkHardDeleteInternships = async (req, res) => {
  try {
    const { internshipIds } = req.body;

    if (!Array.isArray(internshipIds) || !internshipIds.length) {
      return res.status(400).json({
        success: false,
        message: "internshipIds array is required",
      });
    }

    const validIds = internshipIds.filter((id) => isValidObjectId(id));

    const result = await Internship.deleteMany({
      _id: { $in: validIds },
    });

    return res.status(200).json({
      success: true,
      message: "Internships permanently deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkHardDeleteInternships error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk hard delete internships",
      error: error.message,
    });
  }
};

// ============================================================
// BULK RESTORE
// ============================================================

exports.bulkRestoreInternships = async (req, res) => {
  try {
    const { internshipIds } = req.body;

    if (!Array.isArray(internshipIds) || !internshipIds.length) {
      return res.status(400).json({
        success: false,
        message: "internshipIds array is required",
      });
    }

    const validIds = internshipIds.filter((id) => isValidObjectId(id));

    const result = await Internship.updateMany(
      { _id: { $in: validIds } },
      {
        isDeleted: false,
        updatedBy: req.user?._id,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Internships restored successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkRestoreInternships error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk restore internships",
      error: error.message,
    });
  }
};

// ============================================================
// BULK PUBLISH
// ============================================================

exports.bulkPublishInternships = async (req, res) => {
  try {
    const { internshipIds } = req.body;

    if (!Array.isArray(internshipIds) || !internshipIds.length) {
      return res.status(400).json({
        success: false,
        message: "internshipIds array is required",
      });
    }

    const validIds = internshipIds.filter((id) => isValidObjectId(id));

    const result = await Internship.updateMany(
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
      message: "Internships published successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkPublishInternships error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk publish internships",
      error: error.message,
    });
  }
};

// ============================================================
// BULK UNPUBLISH
// ============================================================

exports.bulkUnpublishInternships = async (req, res) => {
  try {
    const { internshipIds } = req.body;

    if (!Array.isArray(internshipIds) || !internshipIds.length) {
      return res.status(400).json({
        success: false,
        message: "internshipIds array is required",
      });
    }

    const validIds = internshipIds.filter((id) => isValidObjectId(id));

    const result = await Internship.updateMany(
      { _id: { $in: validIds } },
      {
        isPublished: false,
        updatedBy: req.user?._id,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Internships unpublished successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkUnpublishInternships error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk unpublish internships",
      error: error.message,
    });
  }
};

// ============================================================
// BULK UPDATE STATUS
// ============================================================

exports.bulkUpdateInternshipStatus = async (req, res) => {
  try {
    const { internshipIds, isPublished, isDeleted } = req.body;

    if (!Array.isArray(internshipIds) || !internshipIds.length) {
      return res.status(400).json({
        success: false,
        message: "internshipIds array is required",
      });
    }

    const validIds = internshipIds.filter((id) => isValidObjectId(id));

    const updateData = {
      updatedBy: req.user?._id,
    };

    if (isPublished !== undefined) {
      updateData.isPublished = toBoolean(isPublished);
    }

    if (isDeleted !== undefined) {
      updateData.isDeleted = toBoolean(isDeleted);
    }

    if (updateData.isDeleted === true) {
      updateData.isPublished = false;
    }

    const result = await Internship.updateMany(
      { _id: { $in: validIds } },
      updateData,
    );

    return res.status(200).json({
      success: true,
      message: "Internships status updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("bulkUpdateInternshipStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk update internship status",
      error: error.message,
    });
  }
};

// ============================================================
// GET DELETED INTERNSHIPS
// ============================================================

exports.getDeletedInternships = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const internships = await Internship.find({ isDeleted: true })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Internship.countDocuments({ isDeleted: true });

    return res.status(200).json({
      success: true,
      message: "Deleted internships fetched successfully",
      data: internships,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getDeletedInternships error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch deleted internships",
      error: error.message,
    });
  }
};

// ============================================================
// GET PUBLISHED INTERNSHIPS
// ============================================================

exports.getPublishedInternshipsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const internships = await Internship.find({
      isPublished: true,
      isDeleted: false,
    })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Internship.countDocuments({
      isPublished: true,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      message: "Published internships fetched successfully",
      data: internships,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getPublishedInternshipsAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch published internships",
      error: error.message,
    });
  }
};

// ============================================================
// GET DRAFT INTERNSHIPS
// ============================================================

exports.getDraftInternshipsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = buildSortOption(req.query.sortBy, req.query.order);

    const internships = await Internship.find({
      isPublished: false,
      isDeleted: false,
    })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Internship.countDocuments({
      isPublished: false,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      message: "Draft internships fetched successfully",
      data: internships,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getDraftInternshipsAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch draft internships",
      error: error.message,
    });
  }
};
