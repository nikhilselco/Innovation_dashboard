import { useEffect, useRef, useState } from "react";

// Keeps `loading` true for at least `minMs`, even if the real fetch resolves
// sooner, so a skeleton never flashes for an imperceptible/jarring instant.
export function useMinLoadingTime(isLoading, minMs = 300) {
  const [displayLoading, setDisplayLoading] = useState(isLoading);
  const startRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      startRef.current = Date.now();
      setDisplayLoading(true);
      return;
    }

    const elapsed = startRef.current ? Date.now() - startRef.current : minMs;
    const remaining = Math.max(minMs - elapsed, 0);

    if (remaining === 0) {
      setDisplayLoading(false);
      return;
    }

    const timer = setTimeout(() => setDisplayLoading(false), remaining);
    return () => clearTimeout(timer);
  }, [isLoading, minMs]);

  return displayLoading;
}
