const nodemailer = require("nodemailer");
const {
  CareerOpportunity,
  CareerApplication,
} = require("../models/CareersModel");

// ======================================================
// HELPERS
// ======================================================
function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
}

function parseNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function buildOpportunityFilters(query = {}) {
  const filters = {
    isDeleted: false,
  };

  if (query.status) filters.status = query.status;
  if (query.opportunityType) filters.opportunityType = query.opportunityType;
  if (query.department) filters.department = query.department;
  if (query.workMode) filters.workMode = query.workMode;
  if (query.employmentType) filters.employmentType = query.employmentType;
  if (query.experienceLevel) filters.experienceLevel = query.experienceLevel;

  if (query.isFeatured !== undefined) {
    filters.isFeatured = parseBoolean(query.isFeatured);
  }

  if (query.search) {
    filters.$text = { $search: String(query.search).trim() };
  }

  return filters;
}

function buildPublicOpportunityFilters(query = {}) {
  const filters = buildOpportunityFilters(query);
  filters.status = "published";
  return filters;
}

function buildApplicationFilters(query = {}) {
  const filters = {
    isDeleted: false,
  };

  if (query.status) filters.status = query.status;
  if (query.opportunityType)
    filters.opportunityTypeSnapshot = query.opportunityType;
  if (query.email) filters.email = String(query.email).trim().toLowerCase();
  if (query.city) filters.city = query.city;
  if (query.country) filters.country = query.country;
  if (query.applicationSource)
    filters.applicationSource = query.applicationSource;
  if (query.opportunityId) filters.opportunity = query.opportunityId;

  if (query.minExperience !== undefined || query.maxExperience !== undefined) {
    filters.totalExperienceYears = {};
    if (query.minExperience !== undefined) {
      filters.totalExperienceYears.$gte = parseNumber(query.minExperience, 0);
    }
    if (query.maxExperience !== undefined) {
      filters.totalExperienceYears.$lte = parseNumber(query.maxExperience, 100);
    }
  }

  if (query.search) {
    filters.$text = { $search: String(query.search).trim() };
  }

  return filters;
}

function getSortObject(sortBy = "latest") {
  switch (sortBy) {
    case "oldest":
      return { createdAt: 1 };
    case "title_asc":
      return { title: 1 };
    case "title_desc":
      return { title: -1 };
    case "deadline_asc":
      return { applicationDeadline: 1, createdAt: -1 };
    case "deadline_desc":
      return { applicationDeadline: -1, createdAt: -1 };
    case "featured_first":
      return { isFeatured: -1, createdAt: -1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
}

function getApplicationSortObject(sortBy = "latest") {
  switch (sortBy) {
    case "oldest":
      return { createdAt: 1 };
    case "name_asc":
      return { fullName: 1 };
    case "name_desc":
      return { fullName: -1 };
    case "status_asc":
      return { status: 1, createdAt: -1 };
    case "experience_desc":
      return { totalExperienceYears: -1, createdAt: -1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
}

function getPagination(query = {}) {
  const page = Math.max(parseNumber(query.page, 1), 1);
  const limit = Math.min(Math.max(parseNumber(query.limit, 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function buildOpportunityPayload(
  body = {},
  currentUserId = null,
  isUpdate = false,
) {
  const payload = {
    title: body.title,
    opportunityType: body.opportunityType,
    department: body.department,
    location: body.location,
    workMode: body.workMode,
    employmentType: body.employmentType,
    experienceLevel: body.experienceLevel,
    experienceMinYears: parseNumber(body.experienceMinYears, 0),
    experienceMaxYears: parseNumber(body.experienceMaxYears, 0),
    openings: parseNumber(body.openings, 1),
    stipendMin: parseNumber(body.stipendMin, 0),
    stipendMax: parseNumber(body.stipendMax, 0),
    salaryMin: parseNumber(body.salaryMin, 0),
    salaryMax: parseNumber(body.salaryMax, 0),
    currency: body.currency || "INR",
    skillsRequired: parseStringArray(body.skillsRequired),
    qualifications: parseStringArray(body.qualifications),
    responsibilities: parseStringArray(body.responsibilities),
    benefits: parseStringArray(body.benefits),
    shortDescription: body.shortDescription,
    fullDescription: body.fullDescription,
    applicationDeadline: body.applicationDeadline || null,
    status: body.status || "published",
    isFeatured: parseBoolean(body.isFeatured, false),
  };

  if (isUpdate) {
    payload.updatedBy = currentUserId || null;
  } else {
    payload.createdBy = currentUserId || null;
    payload.updatedBy = currentUserId || null;
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });

  return payload;
}

function buildApplicationPayload(
  body = {},
  opportunity,
  applicantUserId = null,
) {
  return {
    opportunity: opportunity._id,
    applicantUser: applicantUserId || null,
    opportunityTypeSnapshot: opportunity.opportunityType,
    opportunityTitleSnapshot: opportunity.title,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    city: body.city,
    state: body.state,
    country: body.country || "India",
    totalExperienceYears: parseNumber(body.totalExperienceYears, 0),
    currentCompany: body.currentCompany,
    currentRole: body.currentRole,
    highestQualification: body.highestQualification,
    collegeName: body.collegeName,
    graduationYear: body.graduationYear || null,
    skills: parseStringArray(body.skills),
    portfolioUrl: body.portfolioUrl,
    linkedinUrl: body.linkedinUrl,
    githubUrl: body.githubUrl,
    resumeUrl: body.resumeUrl,
    coverLetter: body.coverLetter,
    whyShouldWeHireYou: body.whyShouldWeHireYou,
    expectedSalaryOrStipend: parseNumber(body.expectedSalaryOrStipend, 0),
    noticePeriodDays: parseNumber(body.noticePeriodDays, 0),
    availableFrom: body.availableFrom || null,
    applicationSource: body.applicationSource || "careers-page",
  };
}

function ensureSuperadmin(req, res) {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }

  const role = String(req.user.role || "").toLowerCase();
  if (role !== "superadmin") {
    res.status(403).json({ message: "Superadmin access required" });
    return false;
  }

  return true;
}

async function sendEmail({ to, subject, html, text }) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error("SMTP configuration missing");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

// ======================================================
// PUBLIC / COMMON
// ======================================================

// GET ALL PUBLIC OPPORTUNITIES
exports.getAllPublishedOpportunities = async (req, res) => {
  try {
    const filters = buildPublicOpportunityFilters(req.query);
    const sort = getSortObject(req.query.sortBy);
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      CareerOpportunity.find(filters).sort(sort).skip(skip).limit(limit).lean(),
      CareerOpportunity.countDocuments(filters),
    ]);

    return res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching public opportunities:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET SINGLE PUBLIC OPPORTUNITY BY ID OR SLUG
exports.getSinglePublishedOpportunity = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let item = await CareerOpportunity.findOne({
      slug: idOrSlug,
      status: "published",
      isDeleted: false,
    }).lean();

    if (!item && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      item = await CareerOpportunity.findOne({
        _id: idOrSlug,
        status: "published",
        isDeleted: false,
      }).lean();
    }

    if (!item) {
      return res.status(404).json({ message: "Career opportunity not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching single public opportunity:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PUBLIC APPLY FOR OPPORTUNITY
exports.applyForOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await CareerOpportunity.findOne({
      _id: opportunityId,
      status: "published",
      isDeleted: false,
    });

    if (!opportunity) {
      return res
        .status(404)
        .json({ message: "Opportunity not found or closed" });
    }

    const applicantEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    if (!applicantEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await CareerApplication.findOne({
      opportunity: opportunity._id,
      email: applicantEmail,
      isDeleted: false,
    });

    if (existing) {
      return res.status(409).json({
        message: "You have already applied for this opportunity",
      });
    }

    const payload = buildApplicationPayload(
      req.body,
      opportunity,
      req.user ? req.user._id || req.user.id : null,
    );

    const application = await CareerApplication.create(payload);

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error applying for opportunity:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET MY APPLICATIONS (optional authenticated endpoint)
exports.getMyApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }

    const items = await CareerApplication.find({
      applicantUser: req.user._id || req.user.id,
      isDeleted: false,
    })
      .populate(
        "opportunity",
        "title slug opportunityType location workMode status",
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching my applications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// SUPERADMIN - OPPORTUNITY CRUD
// ======================================================

exports.createOpportunity = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const payload = buildOpportunityPayload(
      req.body,
      req.user._id || req.user.id,
      false,
    );
    const item = await CareerOpportunity.create(payload);

    return res.status(201).json({
      message: "Career opportunity created successfully",
      item,
    });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllOpportunitiesAdmin = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const filters = buildOpportunityFilters(req.query);
    const sort = getSortObject(req.query.sortBy);
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      CareerOpportunity.find(filters).sort(sort).skip(skip).limit(limit).lean(),
      CareerOpportunity.countDocuments(filters),
    ]);

    return res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin opportunities:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.getSingleOpportunityAdmin = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const { id } = req.params;

    const item = await CareerOpportunity.findOne({
      _id: id,
      isDeleted: false,
    }).lean();

    if (!item) {
      return res.status(404).json({ message: "Career opportunity not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching admin single opportunity:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.updateOpportunity = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const { id } = req.params;
    const payload = buildOpportunityPayload(
      req.body,
      req.user._id || req.user.id,
      true,
    );

    const item = await CareerOpportunity.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: payload },
      { new: true, runValidators: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Career opportunity not found" });
    }

    return res.status(200).json({
      message: "Career opportunity updated successfully",
      item,
    });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteOpportunity = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const { id } = req.params;

    const item = await CareerOpportunity.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          status: "archived",
          updatedBy: req.user._id || req.user.id,
        },
      },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Career opportunity not found" });
    }

    return res.status(200).json({
      message: "Career opportunity deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// BULK UPDATE OPPORTUNITIES
exports.bulkUpdateOpportunityStatus = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const { status } = req.body;

    if (!ids.length || !status) {
      return res.status(400).json({ message: "ids and status are required" });
    }

    const result = await CareerOpportunity.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        $set: {
          status,
          updatedBy: req.user._id || req.user.id,
        },
      },
    );

    return res.status(200).json({
      message: "Opportunity statuses updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error bulk updating opportunities:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// OPPORTUNITY COUNT
exports.getOpportunityCounts = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const baseFilter = { isDeleted: false };

    const [
      total,
      published,
      draft,
      closed,
      archived,
      jobs,
      internships,
      featured,
    ] = await Promise.all([
      CareerOpportunity.countDocuments(baseFilter),
      CareerOpportunity.countDocuments({ ...baseFilter, status: "published" }),
      CareerOpportunity.countDocuments({ ...baseFilter, status: "draft" }),
      CareerOpportunity.countDocuments({ ...baseFilter, status: "closed" }),
      CareerOpportunity.countDocuments({ ...baseFilter, status: "archived" }),
      CareerOpportunity.countDocuments({
        ...baseFilter,
        opportunityType: "job",
      }),
      CareerOpportunity.countDocuments({
        ...baseFilter,
        opportunityType: "internship",
      }),
      CareerOpportunity.countDocuments({ ...baseFilter, isFeatured: true }),
    ]);

    return res.status(200).json({
      total,
      published,
      draft,
      closed,
      archived,
      jobs,
      internships,
      featured,
    });
  } catch (error) {
    console.error("Error fetching opportunity counts:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// SUPERADMIN - APPLICATION MANAGEMENT
// ======================================================

exports.getAllApplicationsAdmin = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const filters = buildApplicationFilters(req.query);
    const sort = getApplicationSortObject(req.query.sortBy);
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      CareerApplication.find(filters)
        .populate(
          "opportunity",
          "title slug opportunityType department location workMode",
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      CareerApplication.countDocuments(filters),
    ]);

    return res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.getSingleApplicationAdmin = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const { id } = req.params;

    const item = await CareerApplication.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate(
        "opportunity",
        "title slug opportunityType department location workMode",
      )
      .populate("applicantUser", "name email")
      .lean();

    if (!item) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching single application:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const { id } = req.params;
    const { status, statusReason, adminNotes } = req.body;

    const item = await CareerApplication.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          status,
          statusReason: statusReason || "",
          adminNotes: adminNotes || "",
          reviewedBy: req.user._id || req.user.id,
          reviewedAt: new Date(),
        },
      },
      { new: true, runValidators: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({
      message: "Application status updated successfully",
      item,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const { id } = req.params;

    const item = await CareerApplication.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// BULK UPDATE APPLICATION STATUS
exports.bulkUpdateApplicationStatus = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const { status, statusReason = "", adminNotes = "" } = req.body;

    if (!ids.length || !status) {
      return res.status(400).json({ message: "ids and status are required" });
    }

    const result = await CareerApplication.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        $set: {
          status,
          statusReason,
          adminNotes,
          reviewedBy: req.user._id || req.user.id,
          reviewedAt: new Date(),
        },
      },
    );

    return res.status(200).json({
      message: "Application statuses updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error bulk updating application status:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// BULK DELETE APPLICATIONS
exports.bulkDeleteApplications = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];

    if (!ids.length) {
      return res.status(400).json({ message: "ids are required" });
    }

    const result = await CareerApplication.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: { isDeleted: true } },
    );

    return res.status(200).json({
      message: "Applications deleted successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting applications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// APPLICATION COUNTS
exports.getApplicationCounts = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const baseFilter = { isDeleted: false };

    const [
      total,
      applied,
      underReview,
      shortlisted,
      interviewScheduled,
      accepted,
      rejected,
      delayed,
      jobs,
      internships,
    ] = await Promise.all([
      CareerApplication.countDocuments(baseFilter),
      CareerApplication.countDocuments({ ...baseFilter, status: "applied" }),
      CareerApplication.countDocuments({
        ...baseFilter,
        status: "under_review",
      }),
      CareerApplication.countDocuments({
        ...baseFilter,
        status: "shortlisted",
      }),
      CareerApplication.countDocuments({
        ...baseFilter,
        status: "interview_scheduled",
      }),
      CareerApplication.countDocuments({ ...baseFilter, status: "accepted" }),
      CareerApplication.countDocuments({ ...baseFilter, status: "rejected" }),
      CareerApplication.countDocuments({ ...baseFilter, status: "delayed" }),
      CareerApplication.countDocuments({
        ...baseFilter,
        opportunityTypeSnapshot: "job",
      }),
      CareerApplication.countDocuments({
        ...baseFilter,
        opportunityTypeSnapshot: "internship",
      }),
    ]);

    return res.status(200).json({
      total,
      applied,
      underReview,
      shortlisted,
      interviewScheduled,
      accepted,
      rejected,
      delayed,
      jobs,
      internships,
    });
  } catch (error) {
    console.error("Error fetching application counts:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// SEND EMAIL TO SELECTED CANDIDATES
exports.sendEmailToSelectedCandidates = async (req, res) => {
  try {
    if (!ensureSuperadmin(req, res)) return;

    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const { subject, message, html = "" } = req.body;

    if (!ids.length || !subject || !message) {
      return res.status(400).json({
        message: "ids, subject, and message are required",
      });
    }

    const applications = await CareerApplication.find({
      _id: { $in: ids },
      isDeleted: false,
    });

    if (!applications.length) {
      return res.status(404).json({ message: "No applications found" });
    }

    const results = [];
    for (const application of applications) {
      try {
        await sendEmail({
          to: application.email,
          subject,
          text: message,
          html: html || `<p>${message}</p>`,
        });

        application.emailLogs.push({
          subject,
          message,
          sentAt: new Date(),
          sentBy: req.user._id || req.user.id,
        });

        await application.save();

        results.push({
          applicationId: application._id,
          email: application.email,
          success: true,
        });
      } catch (emailError) {
        results.push({
          applicationId: application._id,
          email: application.email,
          success: false,
          error: emailError.message,
        });
      }
    }

    return res.status(200).json({
      message: "Email dispatch completed",
      results,
    });
  } catch (error) {
    console.error("Error sending emails to candidates:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
