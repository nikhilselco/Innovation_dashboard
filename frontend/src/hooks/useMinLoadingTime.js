import { useEffect, useRef, useState } from "react";

export function useMinLoadingTime(isLoading, minMs = 300) {
  const [displayLoading, setDisplayLoading] = useState(isLoading);
  const startRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      startRef.current = Date.now();
      const timer = setTimeout(() => setDisplayLoading(true), 0);
      return () => clearTimeout(timer);
    }
    const elapsed = startRef.current ? Date.now() - startRef.current : minMs;
    const remaining = Math.max(minMs - elapsed, 0);
    const timer = setTimeout(() => setDisplayLoading(false), remaining);
    return () => clearTimeout(timer);
  }, [isLoading, minMs]);
  return displayLoading;
}