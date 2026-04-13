const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();

// ===== ROUTE MODULES =====
const attendanceRoutes = require("./routes/AttendanceRoutes");
const developerRoutes = require("./routes/developer_routes");
const notificationRoutes = require("./routes/NotificationRoutes");
const requirementRoutes = require("./routes/RequirementRoutes");
const blogRoutes = require("./routes/BlogRoutes");
const subscriptionRoutes = require("./routes/SubscriptionRoutes");
const projectRoutes = require("./routes/ProjectRoutes");
const scenarioRoutes = require("./routes/ScenarioRoutes");
const taskRoutes = require("./routes/TaskRoutes");
const defectRoutes = require("./routes/DefectRoutes");
const contactRoutes = require("./routes/ContactRoutes");
const userRoutes = require("./routes/UserRoutes");
const eventRoutes = require("./routes/EventRoutes");
const reportRoutes = require("./routes/ReportRoutes");
const toDoRoutes = require("./routes/ToDoRoutes");
const testExecutionRoutes = require("./routes/TestExecutionRoutes");
const jobRoutes = require("./routes/JobRoutes");
const internshipRoutes = require("./routes/InternshipRoutes");

dotenv.config();

// ===== CORS =====
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
  }),
);

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ===== CACHE / EXPORT HELPERS =====
const nocache = (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
};

const skipCompression = (req, _res, next) => {
  req.headers["x-no-compression"] = "1";
  next();
};

app.get(
  "/api/attendance/export.xlsx",
  skipCompression,
  nocache,
  (_req, _res, next) => next(),
);

app.get(
  "/api/attendance/export.test.xlsx",
  skipCompression,
  nocache,
  (_req, _res, next) => next(),
);

// ===== HEALTH CHECK =====
app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// ===== ROUTE MOUNTS =====
app.use("/api/developers", developerRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", notificationRoutes);
app.use("/api", requirementRoutes);
app.use("/api", blogRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", projectRoutes);
app.use("/api", scenarioRoutes);
app.use("/api", taskRoutes);
app.use("/api", defectRoutes);
app.use("/api", contactRoutes);
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", reportRoutes);
app.use("/api/todos", toDoRoutes);
app.use("/api", testExecutionRoutes);
app.use("/api", jobRoutes); // ✅ fixed mount
app.use("/api", internshipRoutes);

// ===== 404 HANDLER =====
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===== DB + SERVER =====
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecoders_jira")
  .then(() => console.log("Connected to mongodb."))
  .catch((err) => console.log("Connection to mongo db failed,", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Connected to server successfully at port number ${PORT}`);
});
