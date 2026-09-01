const { getAllDashboardData } = require("../services/excel/excel.service");
const { getFileLastModified } = require("../services/graph/graph.service");
const { setCache, getCache } = require("../cache/dashboard-cache");
const { emitDataUpdated } = require("../realtime/socket.service");

const POLL_INTERVAL_MS = 30 * 1000;
let monitorInterval;
let lastSeenModified = null;

async function refreshCache() {
  try {
    const lastModified = await getFileLastModified();
    if (lastModified && lastModified === lastSeenModified) {
      return;
    }

    const { longList, valueChain, calendar } = await getAllDashboardData();
    setCache({ longList, valueChain, calendar, lastUpdated: lastModified });
    lastSeenModified = lastModified;
    emitDataUpdated({ lastUpdated: getCache().lastUpdated });
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