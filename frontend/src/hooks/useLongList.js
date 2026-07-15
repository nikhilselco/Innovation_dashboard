import { useEffect, useState } from "react";
import { getLongList } from "../api/dashboardApi";
import { useMinLoadingTime } from "./useMinLoadingTime";

export function useLongList() {
  const [solutions, setSolutions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getLongList()
      .then((data) => {
        if (!cancelled) setSolutions(data);
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

  return { solutions, loading: useMinLoadingTime(loading), error };
}
