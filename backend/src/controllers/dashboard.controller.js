const { getCache } = require("../cache/dashboard-cache");
const { asyncHandler } = require("../utils/async-handler");

const BENCHMARK_COLUMN = "Benchmarked  (Yes/ No)";

function groupCount(rows, key) {
  const counts = {};
  rows.forEach((row) => {
    const value = row[key] || "Unknown";
    counts[value] = (counts[value] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function countBenchmarkStatus(longList) {
  let benchmarked = 0;
  let pending = 0;
  longList.forEach((row) => {
    const value = row[BENCHMARK_COLUMN];
    if (typeof value === "string" && value.trim().toLowerCase() === "yes") {
      benchmarked++;
    } else {
      pending++;
    }
  });
  return { benchmarked, pending };
}

const getDashboardSummary = asyncHandler((req, res) => {
  const cache = getCache();
  const { benchmarked, pending } = countBenchmarkStatus(cache.longList);
  res.json({
    totalSolutions: cache.longList.length,
    totalValueChains: cache.valueChain.length,
    benchmarkedSolutions: benchmarked,
    pendingSolutions: pending,
    lastUpdated: cache.lastUpdated,
  });
});

const getLongList = asyncHandler((req, res) => {
  const cache = getCache();
  res.json(cache.longList);
});

const getCalendar = asyncHandler((req, res) => {
  const cache = getCache();
  res.json(cache.calendar);
});

const getSectorSummary = asyncHandler((req, res) => {
  const cache = getCache();
  const grouped = groupCount(cache.longList, "Sector").map(
    ({ name, count }) => ({ sector: name, count })
  );
  res.json(grouped);
});

const getBenchmarkStatus = asyncHandler((req, res) => {
  const cache = getCache();
  const { benchmarked, pending } = countBenchmarkStatus(cache.longList);
  res.json({ benchmarked, pending, lastUpdated: cache.lastUpdated });
});

const getLastUpdated = asyncHandler((req, res) => {
  const cache = getCache();
  res.json({ lastUpdated: cache.lastUpdated });
});

module.exports = {
  getDashboardSummary,
  getLongList,
  getCalendar,
  getSectorSummary,
  getBenchmarkStatus,
  getLastUpdated,
};
