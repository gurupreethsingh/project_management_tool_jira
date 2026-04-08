const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const ACCESS_TOKEN_SECRET =
  process.env.JWT_SECRET || "dev_access_secret_change_me";
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_me";

const ACCESS_TOKEN_EXPIRE = process.env.JWT_ACCESS_EXPIRE || "15m";
const REFRESH_TOKEN_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const normalizeText = (value = "") => String(value).trim();

const ALLOWED_ROLES = [
  "accountant",
  "admin",
  "alumni_relations",
  "business_analyst",
  "content_creator",
  "course_coordinator",
  "customer_support",
  "data_scientist",
  "dean",
  "department_head",
  "developer_lead",
  "developer",
  "event_coordinator",
  "exam_controller",
  "hr_manager",
  "hr",
  "intern",
  "legal_advisor",
  "librarian",
  "maintenance_staff",
  "marketing_manager",
  "operations_manager",
  "product_owner",
  "project_manager",
  "qa_lead",
  "recruiter",
  "registrar",
  "researcher",
  "sales_executive",
  "student",
  "superadmin",
  "support_engineer",
  "teacher",
  "tech_lead",
  "test_engineer",
  "user",
  "ux_ui_designer",
];

const buildUserResponse = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  dateOfBirth: user.dateOfBirth,
  gender: user.gender,
  addressLine1: user.addressLine1,
  addressLine2: user.addressLine2,
  city: user.city,
  state: user.state,
  country: user.country,
  postalCode: user.postalCode,
  nationality: user.nationality,
  preferredCurrency: user.preferredCurrency,
  profileImage: user.profileImage,
});

const createAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: false, // change to true in production with HTTPS
  sameSite: "lax",
  path: "/api/users",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const sendAuthResponse = (user, statusCode, res, message) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

  return res.status(statusCode).json({
    success: true,
    message,
    token: accessToken,
    user: buildUserResponse(user),
  });
};

exports.registerUser = async (req, res) => {
  try {
    const fullName = normalizeText(req.body.fullName);
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role: "user",
    });

    return sendAuthResponse(user, 201, res, "User registered successfully.");
  } catch (error) {
    console.error("REGISTER USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return sendAuthResponse(user, 200, res, "Login successful.");
  } catch (error) {
    console.error("LOGIN USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed.",
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing.",
      });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const accessToken = createAccessToken(user);

    return res.status(200).json({
      success: true,
      token: accessToken,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token.",
    });
  }
};

exports.logoutUser = async (_req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/api/users",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("LOGOUT USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed.",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email.",
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Email matched. You can now reset your password.",
      resetToken,
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Forgot password failed.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const password = String(req.body.password || "");

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or expired.",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Reset password failed.",
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch profile.",
    });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const updateData = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth || null,
      gender: req.body.gender,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      postalCode: req.body.postalCode,
      nationality: req.body.nationality,
      preferredCurrency: req.body.preferredCurrency,
      profileImage: req.body.profileImage,
    };

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update profile.",
    });
  }
};

exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch users.",
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const role = normalizeText(req.body.role).toLowerCase();

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user,
    });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update user role.",
    });
  }
};
