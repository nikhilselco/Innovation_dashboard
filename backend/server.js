require("dotenv").config();
const http = require("http");
const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const { startExcelMonitor } = require("./src/polling/excel-monitor.service");
const { initSocket } = require("./src/realtime/socket.service");
const app = express();

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://65.1.91.55",
  "https://innovation.selcofoundation.org",
];

app.use(compression());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);
// Dashboard data should always be fetched fresh - without this, browsers can
// send a conditional revalidation request and get back an empty 304, which
// breaks callers expecting a JSON body (e.g. longlist's .map()).
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use(dashboardRoutes);

app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback: any non-API GET request (e.g. /explorer/5, a client-side
// route) gets index.html so React Router can take over on the client.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
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

const server = http.createServer(app);
initSocket(server, ALLOWED_ORIGINS);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await startExcelMonitor();
});