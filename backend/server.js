require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const { startExcelMonitor } = require("./src/polling/excel-monitor.service");
const app = express();

const ALLOWED_ORIGINS = [
  "https://dashboard-benchmarking.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);
app.use(dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    error: error.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await startExcelMonitor();
});