import { useEffect, useState } from "react";
import { getSummary, getLongList } from "../api/dashboardApi";
import { FIELDS, isBenchmarked } from "../utils/helpers";
import { useMinLoadingTime } from "./useMinLoadingTime";

function deriveSectors(longList) {
  const counts = {};
  longList.forEach((row) => {
    const sector = row[FIELDS.sector] || "Unknown";
    counts[sector] = (counts[sector] || 0) + 1;
  });
  return Object.entries(counts).map(([sector, count]) => ({ sector, count }));
}

function deriveBenchmarkStatus(longList) {
  let benchmarked = 0;
  let pending = 0;
  longList.forEach((row) => (isBenchmarked(row) ? benchmarked++ : pending++));
  return { benchmarked, pending };
}

export function useDashboard() {
  const [data, setData] = useState({
    summary: null,
    sectors: null,
    benchmarkStatus: null,
    longList: null,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getSummary(), getLongList()])
      .then(([summary, longList]) => {
        if (cancelled) return;
        setData({
          summary,
          sectors: deriveSectors(longList),
          benchmarkStatus: deriveBenchmarkStatus(longList),
          longList,
          lastUpdated: summary.lastUpdated,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const displayLoading = useMinLoadingTime(loading);

  const retry = () => {
    setLoading(true);
    setError(null);
    setRetryCount((c) => c + 1);
  };
  return { ...data, loading: displayLoading, error, retry };
}