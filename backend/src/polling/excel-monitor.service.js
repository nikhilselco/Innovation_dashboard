const { getAllDashboardData } = require("../services/excel/excel.service");
const { setCache } = require("../cache/dashboard-cache");

const POLL_INTERVAL_MS = 30 * 1000;

let monitorInterval;

async function refreshCache() {
  try {
    const { longList, valueChain, calendar } = await getAllDashboardData();

    setCache({ longList, valueChain, calendar });

    console.log(
      `[excel-monitor] cache refreshed at ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error("[excel-monitor] refresh failed:", error.message);
  }
}

async function startExcelMonitor() {
  await refreshCache();
  monitorInterval = setInterval(refreshCache, POLL_INTERVAL_MS);
}

function stopExcelMonitor() {
  clearInterval(monitorInterval);
}

module.exports = {
  startExcelMonitor,
  stopExcelMonitor,
};
