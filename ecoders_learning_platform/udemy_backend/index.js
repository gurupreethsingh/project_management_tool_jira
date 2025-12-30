const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

// ---- Route imports ----
const addressRoutes = require("./routes/AddressRoutes");
const attendanceRoutes = require("./routes/AttendanceRoutes");
const blogRoutes = require("./routes/BlogRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const contactRoutes = require("./routes/ContactRoutes");
const courseRoutes = require("./routes/CourseRoutes");
const DashboardGenRoutes = require("./routes/DashboardGenRoutes");
const examRoutes = require("./routes/ExamRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const subCategoryRoutes = require("./routes/SubCategoryRoutes");
const subscriptionRoutes = require("./routes/SubscriptionRoutes");
const userRoutes = require("./routes/UserRoutes");
const wishlistRoutes = require("./routes/WishlistRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");
const degreeRoutes = require("./routes/DegreeRoutes");
const semesterRoutes = require("./routes/SemesterRoutes");
const studentAdmissionRoutes = require("./routes/StudentAdmissionRoutes");
const QuizRoutes = require("./routes/QuizRoutes");
const questionRoutes = require("./routes/QuestionRoutes");
const instructorRoutes = require("./routes/InstructorRoutes");
const activityRoutes = require("./routes/ActivityRoutes");
const chatRoutes = require("./routes/ChatInteractionRoutes");
const simpleChatBotRoutes = require("./routes/SimpleChatBotRoutes");
const uiGenRoutes = require("./routes/UiGenRoutes");
const roadmapGenRoutes = require("./routes/RoadmapGenRoutes");
const ExamGenRoutes = require("./routes/ExamGenRoutes");
const aiTutorRoutes = require("./routes/AiTutorRoutes");
const textCodeRoutes = require("./routes/TextCodeRoutes");

const app = express();

// ---- CORS ----
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
]);
if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.add(process.env.FRONTEND_ORIGIN);
}

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.has(origin)) return cb(null, true);

      const localVite = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/;
      if (localVite.test(origin)) return cb(null, true);

      const lanVite =
        /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):517\d$/;
      if (lanVite.test(origin)) return cb(null, true);

      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "X-Requested-With",
      "X-Session-Id",
      "X-Channel",
    ],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.options(/.*/, cors());

// Health
app.get("/health", (_req, res) =>
  res.json({ ok: true, service: "api", env: process.env.NODE_ENV || "dev" })
);

// ---- Routes ----
app.use("/api", addressRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", blogRoutes);
app.use("/api", cartRoutes);
app.use("/api", categoryRoutes);
app.use("/api", contactRoutes);
app.use("/api", courseRoutes);
app.use("/api/chat-interactions", chatRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", degreeRoutes);
app.use("/api", examRoutes);
app.use("/api", notificationRoutes);
app.use("/api", orderRoutes);
app.use("/api", subCategoryRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", userRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", semesterRoutes);
app.use("/api", studentAdmissionRoutes);
app.use("/api", questionRoutes);
app.use("/api", QuizRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api", activityRoutes);
app.use("/api", uiGenRoutes);
app.use("/api", simpleChatBotRoutes);
app.use("/api/dashboard-gen", DashboardGenRoutes);
app.use("/api/roadmap-gen", roadmapGenRoutes);
app.use("/api/exam-gen", ExamGenRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);
app.use("/api/text-code", textCodeRoutes);

// ---- Mongo ----
const DATABASE_URI = process.env.DATABASE;
mongoose
  .connect(DATABASE_URI)
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// ---- Server ----
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.FRONTEND_ORIGIN) {
    console.log(`🔗 Allowing frontend origin: ${process.env.FRONTEND_ORIGIN}`);
  }
});
