const express = require("express");
const {
  getDashboardSummary,
  getLongList,
  getCalendar,
  getSectorSummary,
  getBenchmarkStatus,
  getLastUpdated,
} = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/api/dashboard/summary", getDashboardSummary);
router.get("/api/dashboard/longlist", getLongList);
router.get("/api/dashboard/calendar", getCalendar);
router.get("/api/dashboard/sectors", getSectorSummary);
router.get("/api/dashboard/benchmark-status", getBenchmarkStatus);
router.get("/api/dashboard/last-updated", getLastUpdated);

module.exports = router;
