const express = require("express");
const {
  getDashboardData,
  getDashboardSummary,
  getLongList,
  getValueChain,
  getCalendar,
  getSectorSummary,
  getValueChainSummary,
  getBenchmarkStatus,
  getLastUpdated,
} = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/dashboard-data", getDashboardData);
router.get("/api/dashboard/summary", getDashboardSummary);
router.get("/api/dashboard/longlist", getLongList);
router.get("/api/dashboard/valuechain", getValueChain);
router.get("/api/dashboard/calendar", getCalendar);
router.get("/api/dashboard/sectors", getSectorSummary);
router.get("/api/dashboard/value-chain-summary", getValueChainSummary);
router.get("/api/dashboard/benchmark-status", getBenchmarkStatus);
router.get("/api/dashboard/last-updated", getLastUpdated);

module.exports = router;