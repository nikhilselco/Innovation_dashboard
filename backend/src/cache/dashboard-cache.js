let cache = {
  longList: [],
  valueChain: [],
  calendar: [],
  lastUpdated: null,
};

function setCache(data) {
  cache = {
    ...cache,
    ...data,
    lastUpdated: new Date().toISOString(),
  };
}

function getCache() {
  return cache;
}

module.exports = {
  setCache,
  getCache,
};