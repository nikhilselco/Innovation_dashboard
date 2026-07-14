import { useEffect, useState } from "react";
import {
  getSummary,
  getSectors,
  getBenchmarkStatus,
  getLongList,
  getLastUpdated,
} from "../api/dashboardApi";

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

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getSummary(),
      getSectors(),
      getBenchmarkStatus(),
      getLongList(),
      getLastUpdated(),
    ])
      .then(([summary, sectors, benchmarkStatus, longList, lastUpdated]) => {
        if (cancelled) return;
        setData({
          summary,
          sectors,
          benchmarkStatus,
          longList,
          lastUpdated: lastUpdated.lastUpdated,
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
  }, []);

  return { ...data, loading, error };
}
