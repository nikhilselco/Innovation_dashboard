const URL_PATTERN = /https?:\/\/\S+/;

export function extractUrl(value) {
  if (typeof value !== "string") return null;

  const match = value.match(URL_PATTERN);
  return match ? match[0] : null;
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

export function getImplementationsCount(row) {
  return Number(row[FIELDS.implementations]) || 0;
}

export function hasContent(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}
