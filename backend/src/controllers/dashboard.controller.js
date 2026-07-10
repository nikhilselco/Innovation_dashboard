const { getCache } = require("../cache/dashboard-cache");

const BENCHMARK_COLUMN = "Benchmarked  (Yes/ No)";

function groupCount(rows, key) {
  const counts = {};

  rows.forEach((row) => {
    const value = row[key] || "Unknown";
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function getDashboardData(req, res) {
  const cache = getCache();

  res.json({
    lastUpdated: cache.lastUpdated,
    longListCount: cache.longList.length,
    valueChainCount: cache.valueChain.length,
    calendarCount: cache.calendar.length,
    longList: cache.longList,
    valueChain: cache.valueChain,
    calendar: cache.calendar,
  });
}

function getDashboardSummary(req, res) {
  const cache = getCache();

  let benchmarkedSolutions = 0;
  let pendingSolutions = 0;

  cache.longList.forEach((row) => {
    const value = row[BENCHMARK_COLUMN];

    if (typeof value === "string" && value.trim().toLowerCase() === "yes") {
      benchmarkedSolutions++;
    } else {
      pendingSolutions++;
    }
  });

  res.json({
    totalSolutions: cache.longList.length,
    totalValueChains: cache.valueChain.length,
    benchmarkedSolutions,
    pendingSolutions,
    lastUpdated: cache.lastUpdated,
  });
}

function getLongList(req, res) {
  const cache = getCache();
  res.json(cache.longList);
}

function getValueChain(req, res) {
  const cache = getCache();
  res.json(cache.valueChain);
}

function getCalendar(req, res) {
  const cache = getCache();
  res.json(cache.calendar);
}

function getSectorSummary(req, res) {
  const cache = getCache();

  const grouped = groupCount(cache.longList, "Sector").map(
    ({ name, count }) => ({ sector: name, count })
  );

  res.json(grouped);
}

function getValueChainSummary(req, res) {
  const cache = getCache();

  const grouped = groupCount(cache.valueChain, "Sector").map(
    ({ name, count }) => ({ sector: name, count })
  );

  res.json(grouped);
}

function getBenchmarkStatus(req, res) {
  const cache = getCache();

  let benchmarked = 0;
  let pending = 0;

  cache.longList.forEach((row) => {
    const value = row[BENCHMARK_COLUMN];

    if (typeof value === "string" && value.trim().toLowerCase() === "yes") {
      benchmarked++;
    } else {
      pending++;
    }
  });

  res.json({ benchmarked, pending, lastUpdated: cache.lastUpdated });
}

function getLastUpdated(req, res) {
  const cache = getCache();
  res.json({ lastUpdated: cache.lastUpdated });
}

module.exports = {
  getDashboardData,
  getDashboardSummary,
  getLongList,
  getValueChain,
  getCalendar,
  getSectorSummary,
  getValueChainSummary,
  getBenchmarkStatus,
  getLastUpdated,
};
