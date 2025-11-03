const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

// Load env
dotenv.config();

// ---- Route imports ----
const addressRoutes = require("./routes/AddressRoutes");
const attendanceRoutes = require("./routes/AttendanceRoutes");
const blogRoutes = require("./routes/BlogRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const contactRoutes = require("./routes/ContactRoutes");
const courseRoutes = require("./routes/CourseRoutes");
const examRoutes = require("./routes/ExamRoutes.js");
const notificationRoutes = require("./routes/NotificationRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const subCategoryRoutes = require("./routes/SubCategoryRoutes");
const subscriptionRoutes = require("./routes/SubscriptionRoutes");
const userRoutes = require("./routes/UserRoutes");
const wishlistRoutes = require("./routes/WishlistRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");
const degreeRoutes = require("./routes/DegreeRoutes");
const semesterRoutes = require("./routes/SemesterRoutes.js");
const studentAdmissionRoutes = require("./routes/StudentAdmissionRoutes.js");
const QuizRoutes = require("./routes/QuizRoutes.js");
const questionRoutes = require("./routes/QuestionRoutes");
const instructorRoutes = require("./routes/InstructorRoutes");
const activityRoutes = require("./routes/ActivityRoutes.js");
const chatRoutes = require("./routes/ChatInteractionRoutes.js");
const simpleChatBotRoutes = require("./routes/SimpleChatBotRoutes.js");
const uiGenRoutes = require("./routes/UiGenRoutes");

// ---- App ----
const app = express();

// ---- CORS (browser -> Node only) ----
// Allow localhost Vite dev ports + optional FRONTEND_ORIGIN + LAN Vite URLs
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
      // Non-browser or same-origin requests (e.g., curl, server-to-server)
      if (!origin) return cb(null, true);

      if (allowedOrigins.has(origin)) return cb(null, true);

      // localhost / 127.0.0.1 on 5170–5179
      const localVite = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/;
      if (localVite.test(origin)) return cb(null, true);

      // LAN dev: 192.168.x.x:5170–5179, 10.x.x.x:517x, 172.16–31.x.x:517x
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

// Body + cookies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Optional preflight helper
app.options(/.*/, cors());

// ---- Health route ----
app.get("/health", (_req, res) =>
  res.json({ ok: true, service: "api", env: process.env.NODE_ENV || "dev" })
);

// ---- Register routes ----
app.use("/api", addressRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", blogRoutes);
app.use("/api", cartRoutes);
app.use("/api", categoryRoutes);
app.use("/api", contactRoutes);
app.use("/api", courseRoutes);
app.use("/api", chatRoutes);
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
app.use("/api", uiGenRoutes); // exposes /api/ui-gen/...

// 👉 This exposes: /api/ai/ask, /api/ai/model-info, /api/ai/reload (Node -> Flask)
app.use("/api", simpleChatBotRoutes);

// ---- MongoDB ----
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
