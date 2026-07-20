import { useEffect, useState } from "react";
import { getLongList, invalidateCache } from "../api/dashboardApi";
import { subscribeToDataUpdates } from "../api/realtime";
import { useMinLoadingTime } from "./useMinLoadingTime";

export function useLongList() {
  const [solutions, setSolutions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getLongList()
      .then((data) => {
        if (!cancelled) {
          setSolutions(data);
          setError(null);
        }
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

  // Server pushes this event only when the source Excel data actually
  // changed, so this triggers a silent refetch - no loading flash, since
  // nothing here sets `loading` back to true.
  useEffect(() => {
    return subscribeToDataUpdates(() => {
      invalidateCache();
      setRetryCount((c) => c + 1);
    });
  }, []);

  const retry = () => {
    setLoading(true);
    setError(null);
    setRetryCount((c) => c + 1);
  };

  return { solutions, loading: useMinLoadingTime(loading), error, retry };
}