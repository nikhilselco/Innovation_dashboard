const URL_PATTERN = /https?:\/\/\S+/;

export function extractUrl(value) {
  if (typeof value !== "string") return null;

  const match = value.match(URL_PATTERN);
  return match ? match[0] : null;
}

export const BENCHMARK_FIELD = "Benchmarked  (Yes/ No)";
export const VALUE_CHAIN_FIELD = "Value chains ";

export function isBenchmarked(row) {
  const value = row[BENCHMARK_FIELD];
  return typeof value === "string" && value.trim().toLowerCase() === "yes";
}
