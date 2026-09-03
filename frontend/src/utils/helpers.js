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

// Accepts any real-world typo of "yes" (Y, Yeah, Yess, Yes., ...) instead of
// requiring an exact match - these columns are manually maintained in Excel
// by different people over time, so exact-match was silently miscounting
// typos as "no".
function isYes(value) {
  return typeof value === "string" && value.trim().toLowerCase().startsWith("y");
}

export function isBenchmarked(row) {
  return isYes(row[FIELDS.benchmarked]);
}

export function isPriority(row) {
  return isYes(row[FIELDS.priority]);
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

// ---------- Expected completion date (Calendar_benchmarking solutions sheet) ----------

const CALENDAR_NAME_FIELD = "Solution Name";
const CALENDAR_DATE_FIELD = "Completion due date";

function normalizeSolutionName(name) {
  return (name || "")
    .toString()
    .replace(new RegExp("[\\u200B-\\u200D\\uFEFF]", "g"), "") // zero-width chars present in some Excel cells
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// The Calendar sheet's "Solution Name" doesn't always match the long list's
// "Solution Package Name" exactly. Only pairs a human has manually confirmed
// refer to the same real solution are listed here (keyed by normalized
// Calendar name -> normalized long list name) - an unconfirmed guess would
// risk showing the wrong due date against the wrong solution, so anything
// not listed here is left unlinked rather than fuzzy-matched.
const CALENDAR_NAME_ALIASES = {
  "bamboo knot removing machine": "bamboo external knot removing machine",
  "bamboo splitter machine": "bamboo radial splitter machine",
  "weeder - dry land weeders": "dry land weeders",
  "paper plate making ( tbd)": "paper plate making",
  "bamboo round stick making machine": "bamboo round stitck making machine",
  "egg incubator new": "egg incubator",
  "power hammer": "blacksmith-power hammer",
  "chilli pounding": "chilli pounding machine",
  "camphor making": "camphor tablet making",
  "bamboo squre stick macking machine/broom stick making machine":
    "bamboo square stick machine/ broom making machine",
  "bamboo cross cutting machine": "bamboo cross cutter machine",
  "bamboo thin sliver machine": "bamboo thin slivering machine",
  "bamboo slicer machine": "bamboo heavy duty slicer machine",
  "double row paddy weeder": "paddy weeders - double row",
};

// The sheet mixes real Excel dates (parsed upstream to "YYYY-MM-DD") with
// plain typed text ("DD-MM-YYYY"), and a few cells are blank/broken and
// come through as an epoch date - normalize all of that into one clean,
// human-readable label, keeping the parsed Date too (for overdue checks and
// sorting) - or null if there's nothing usable.
function parseCalendarDate(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith("1970-")) return null;

  let date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    date = new Date(`${trimmed}T00:00:00Z`);
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split("-");
    date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  } else {
    return { date: null, label: trimmed };
  }

  if (Number.isNaN(date.getTime())) return { date: null, label: trimmed };
  const label = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return { date, label };
}

// Builds a normalized-solution-name -> { date, label } lookup from the raw
// Calendar sheet rows, so a pending long-list solution can be matched to its
// expected completion date.
export function buildExpectedDateLookup(calendarRows) {
  const lookup = new Map();
  (calendarRows || []).forEach((row) => {
    const calName = normalizeSolutionName(row[CALENDAR_NAME_FIELD]);
    if (!calName) return;
    const parsed = parseCalendarDate(row[CALENDAR_DATE_FIELD]);
    if (!parsed) return;

    lookup.set(calName, parsed);
    const alias = CALENDAR_NAME_ALIASES[calName];
    if (alias) lookup.set(alias, parsed);
  });
  return lookup;
}

// Returns { label, overdue, date } for a pending solution's expected
// completion date, or null if there's no confirmed calendar match.
export function getExpectedDate(row, lookup) {
  if (!lookup) return null;
  const entry = lookup.get(normalizeSolutionName(row[FIELDS.name]));
  if (!entry) return null;
  return {
    label: entry.label,
    date: entry.date,
    overdue: entry.date ? entry.date.getTime() < Date.now() : false,
  };
}
