let cache = {
  longList: [],
  valueChain: [],
  calendar: [],
  lastUpdated: null,
};

// lastUpdated is expected to be part of `data` (the source file's own
// last-modified time) - stamping it here with the current time would make
// every server restart look like a fresh data change, even when the Excel
// file itself hasn't been touched.
function setCache(data) {
  cache = { ...cache, ...data };
}

function getCache() {
  return cache;
}

module.exports = {
  setCache,
  getCache,
};