// index.js
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

// 2. give a name to your api backend. app = express()
dotenv.config();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ], // Replace with your frontend's URL
    credentials: true, // Enable credentials
  })
);

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// index.js (near the top, after app = express() and before route mounts)
const nocache = (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
};
const skipCompression = (req, _res, next) => {
  // tell any compression middleware/proxy to skip this response
  req.headers["x-no-compression"] = "1";
  next();
};

// Important: register these BEFORE app.use("/api", attendanceRoutes)
app.get(
  "/api/attendance/export.xlsx",
  skipCompression,
  nocache,
  (req, res, next) => next()
);
app.get(
  "/api/attendance/export.test.xlsx",
  skipCompression,
  nocache,
  (req, res, next) => next()
);

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

// ===== DB + SERVER ====
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecoders_jira")
  .then(() => console.log("Connected to mongodb."))
  .catch((err) => console.log("Connection to mongo db failed,", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Connected to server successfully at port number ${PORT}`);
});
