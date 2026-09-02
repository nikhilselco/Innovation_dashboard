import api from "./axios";

// Long enough to survive normal back-and-forth navigation between pages
// (e.g. Dashboard and Explorer both use the long list) without refetching,
// short enough that data doesn't go too stale relative to the backend's
// own 30s Excel refresh cycle.
const CACHE_TTL_MS = 60000;
const cache = new Map();

export function invalidateCache() {
  cache.clear();
}

function withCache(key, fetcher) {
  return () => {
    const cached = cache.get(key);
    const isFresh = cached && Date.now() - cached.time < CACHE_TTL_MS;
    if (isFresh) return cached.promise;
    const promise = fetcher().catch((err) => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, { promise, time: Date.now() });
    return promise;
  };
}

export const getSummary = withCache("summary", async () => {
  const res = await api.get("/api/dashboard/summary");
  return res.data;
});

export const getSectors = withCache("sectors", async () => {
  const res = await api.get("/api/dashboard/sectors");
  return res.data;
});

export const getBenchmarkStatus = withCache("benchmark-status", async () => {
  const res = await api.get("/api/dashboard/benchmark-status");
  return res.data;
});

export const getLongList = withCache("longlist", async () => {
  const res = await api.get("/api/dashboard/longlist");
  // The source Excel sheet has duplicate "Sr No." values for a handful of
  // rows, so it can't be trusted as a unique key/id. Stamp a real one here,
  // once, so every consumer (Explorer routing, list keys, search) is safe.
  return res.data.map((row, index) => ({ ...row, __uid: index }));
});

export const getLastUpdated = withCache("last-updated", async () => {
  const res = await api.get("/api/dashboard/last-updated");
  return res.data;
});

export const getCalendar = withCache("calendar", async () => {
  const res = await api.get("/api/dashboard/calendar");
  return res.data;
});