const URL_PATTERN = /https?:\/\/\S+/;

export function extractUrl(value) {
  if (typeof value !== "string") return null;

  const match = value.match(URL_PATTERN);
  return match ? match[0] : null;
}

export function getLinkLabel(value) {
  if (typeof value !== "string") return value;

  const url = extractUrl(value);
  if (!url) return value;

  const title = value.replace(/https?:\/\/\S+/g, "").replace(/[,\s]+/g, " ").trim();
  return title || url;
}

export const FIELDS = {
  srNo: "Sr No.",
  sector: "Sector",
  priority: "Priority for benchmarking?",
  valueChain: "Value chains ",
  segment: "Value chain segment",
  activity: "Nodal Point (Activity)",
  name: "Solution Package Name",
  benchmarked: "Benchmarked  (Yes/ No)",
  implementations: "No. of implementations done & documentation linked here",
  investment: "~ Investment into the work by SELCO Foundation (consolidated over years)",
  suitability: "End user suitability",
  innovationType: "Innovation type \nDirect/modified/Repurpose/New",
  benchmarkDoc: "Benchmark document",
  packageOfPractice: "Package of practice",
  techSpecs: "Tech specs",
  solarSpecs: "Solar specifications",
  omDetails: "O& M Details",
  championSites: "Champion sites",
  caseStudy: "Case studies with champions and with enabling conditions",
  video: "Video of the solution package",
  businessModel: "Business Model",
  vendors: "Vendors - Market Research",
  techExperts: "Tech specific experts",
  builtEnv: "Built Environment designs",
  otherDocs: "Links to other documents (Testing reports)",
  marketResearch: "Market research- solution wise",
  updateYear: "Update Year",
  comments: "Comments",
};

// Kept as a named alias since several components import it directly.
export const VALUE_CHAIN_FIELD = FIELDS.valueChain;

export function isBenchmarked(row) {
  const value = row[FIELDS.benchmarked];
  return typeof value === "string" && value.trim().toLowerCase() === "yes";
}

export function isPriority(row) {
  const value = row[FIELDS.priority];
  return typeof value === "string" && value.trim().toLowerCase() === "yes";
}

// A few sector values in the source Excel are variants of the same real
// sector and should be treated as one everywhere sectors are grouped/filtered.
const SECTOR_ALIASES = {
  "Agriculture - NTFP": "Agriculture",
};

export function getSector(row) {
  const raw = row[FIELDS.sector] || "Unknown";
  return SECTOR_ALIASES[raw] || raw;
}

export function getImplementationsCount(row) {
  return Number(row[FIELDS.implementations]) || 0;
}

export function hasContent(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

// The set of real documentation columns tracked per solution, used for the
// Benchmark Tracker's completeness reporting (heatmap, pending-by-field
// chart, kanban progress, CSV export). Every key here is a real Excel column.
export const DOC_FIELDS = [
  { key: FIELDS.benchmarkDoc, label: "Benchmark Doc", short: "BMrk" },
  { key: FIELDS.packageOfPractice, label: "Package of Practice", short: "PoP" },
  { key: FIELDS.techSpecs, label: "Tech Specs", short: "Tech" },
  { key: FIELDS.solarSpecs, label: "Solar Specs", short: "Solar" },
  { key: FIELDS.omDetails, label: "O&M Details", short: "O&M" },
  { key: FIELDS.caseStudy, label: "Case Study", short: "Case" },
  { key: FIELDS.video, label: "Video", short: "Video" },
  { key: FIELDS.businessModel, label: "Business Model", short: "Biz" },
];

export function getDocStatus(row) {
  const filled = DOC_FIELDS.filter((f) => hasContent(row[f.key])).length;
  const total = DOC_FIELDS.length;
  const benchmarked = isBenchmarked(row);

  let status = "not-started";
  if (benchmarked) status = "done";
  else if (filled > 0) status = "in-progress";

  return { filled, total, percent: Math.round((filled / total) * 100), status };
}
