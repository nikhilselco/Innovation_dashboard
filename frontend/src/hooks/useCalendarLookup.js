import { useEffect, useState } from "react";
import { getCalendar } from "../api/dashboardApi";
import { buildExpectedDateLookup } from "../utils/helpers";

// Returns null while loading, then a normalized-name -> expected-date Map.
// Kept separate from useLongList since it's only needed where the expected
// date is actually shown, not on every page that lists solutions.
export function useCalendarLookup() {
  const [lookup, setLookup] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCalendar()
      .then((rows) => {
        if (!cancelled) setLookup(buildExpectedDateLookup(rows));
      })
      .catch(() => {
        if (!cancelled) setLookup(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return lookup;
}
