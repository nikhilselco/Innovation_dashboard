import { useMemo, useState } from "react";
import KPICard from "../components/dashboard/KPICard";
import KanbanColumn from "../components/tracker/KanbanColumn";
import DocHeatmap from "../components/tracker/DocHeatmap";
import PendingByFieldChart from "../components/tracker/PendingByFieldChart";
import SectorStatusChart from "../components/tracker/SectorStatusChart";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { useLongList } from "../hooks/useLongList";
import { FIELDS, DOC_FIELDS, getSector, getDocStatus, isPriority } from "../utils/helpers";
import { downloadCsv } from "../utils/csv";

function BenchmarkTrackerPage() {
  const { solutions, loading, error, retry } = useLongList();
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [valueChainFilter, setValueChainFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [priorityOnly, setPriorityOnly] = useState(true);

  const filterOptions = useMemo(() => {
    if (!solutions) return { sectors: [], valueChains: [], years: [] };

    const sectors = new Set();
    const valueChains = new Set();
    const years = new Set();
    solutions.forEach((row) => {
      sectors.add(getSector(row));
      if (row[FIELDS.valueChain]) valueChains.add(row[FIELDS.valueChain].trim());
      if (row[FIELDS.updateYear]) years.add(String(row[FIELDS.updateYear]));
    });
    return {
      sectors: [...sectors].sort(),
      valueChains: [...valueChains].sort(),
      years: [...years].sort().reverse(),
    };
  }, [solutions]);

  const filtered = useMemo(() => {
    if (!solutions) return [];
    const searchLower = search.trim().toLowerCase();

    return solutions.filter((row) => {
      if (sectorFilter && getSector(row) !== sectorFilter) return false;
      if (valueChainFilter && row[FIELDS.valueChain]?.trim() !== valueChainFilter) return false;
      if (yearFilter && String(row[FIELDS.updateYear]) !== yearFilter) return false;
      if (priorityOnly && !isPriority(row)) return false;
      if (searchLower && !(row[FIELDS.name] || "").toLowerCase().includes(searchLower)) return false;
      return true;
    });
  }, [solutions, search, sectorFilter, valueChainFilter, yearFilter, priorityOnly]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  const priorityCount = filtered.filter(isPriority).length;
  const notStarted = [];
  const inProgress = [];
  const done = [];

  filtered.forEach((row) => {
    const { status } = getDocStatus(row);
    if (status === "done") done.push(row);
    else if (status === "in-progress") inProgress.push(row);
    else notStarted.push(row);
  });

  const hasActiveFilters = search || sectorFilter || valueChainFilter || yearFilter || !priorityOnly;

  const clearFilters = () => {
    setSearch("");
    setSectorFilter("");
    setValueChainFilter("");
    setYearFilter("");
    setPriorityOnly(true);
  };

  const exportCsv = () => {
    downloadCsv(
      "benchmark-tracker-report.csv",
      filtered,
      [
        { label: "Solution", value: (r) => r[FIELDS.name] },
        { label: "Sector", value: (r) => getSector(r) },
        { label: "Value Chain", value: (r) => r[FIELDS.valueChain]?.trim() },
        { label: "Priority", value: (r) => (isPriority(r) ? "Yes" : "No") },
        { label: "Status", value: (r) => getDocStatus(r).status },
        { label: "Docs Filled", value: (r) => getDocStatus(r).filled },
        { label: "Docs Total", value: (r) => getDocStatus(r).total },
        ...DOC_FIELDS.map((f) => ({
          label: f.label,
          value: (r) => (r[f.key] && String(r[f.key]).trim() ? "Yes" : "No"),
        })),
      ]
    );
  };

  return (
    <main className="dashboard-content">
      <div className="page-title-row">
        <div>
          <h2>Benchmarking Tracker</h2>
          <p>See which solutions are documented, in progress, or still pending.</p>
        </div>
        <button type="button" className="export-btn" onClick={exportCsv}>
          <i className="ti ti-download" aria-hidden="true"></i> Export CSV
        </button>
      </div>

      <div className="search-box tracker-search">
        <i className="ti ti-search" aria-hidden="true"></i>
        <input
          type="text"
          placeholder="Search solutions by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <span className="filter-label">Filters</span>

        <div className="select-wrapper filter-select-wrapper">
          <select
            className="sort-select filter-select"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="">Sector</option>
            {filterOptions.sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <i className="ti ti-chevron-down select-wrapper-icon" aria-hidden="true"></i>
        </div>

        <div className="select-wrapper filter-select-wrapper">
          <select
            className="sort-select filter-select"
            value={valueChainFilter}
            onChange={(e) => setValueChainFilter(e.target.value)}
          >
            <option value="">Value Chain</option>
            {filterOptions.valueChains.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <i className="ti ti-chevron-down select-wrapper-icon" aria-hidden="true"></i>
        </div>

        <div className="select-wrapper filter-select-wrapper">
          <select className="sort-select filter-select" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="">Year</option>
            {filterOptions.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <i className="ti ti-chevron-down select-wrapper-icon" aria-hidden="true"></i>
        </div>

        <button type="button" className={`chip${priorityOnly ? " active" : ""}`} onClick={() => setPriorityOnly((p) => !p)}>
          <i className="ti ti-star" style={{ fontSize: 11 }} aria-hidden="true"></i> Priority only
        </button>

        {hasActiveFilters && (
          <button type="button" className="chip" onClick={clearFilters}>
            <i className="ti ti-x" style={{ fontSize: 11 }} aria-hidden="true"></i> Clear filters
          </button>
        )}
      </div>

      <div className="kpi-grid">
        <KPICard icon="ti-target" tone="brand" label="In View" value={filtered.length} sub={`${priorityCount} priority`} />
        <KPICard icon="ti-circle-check" tone="success" label="Done" value={done.length} sub="Benchmarked" />
        <KPICard icon="ti-progress" tone="warning" label="In Progress" value={inProgress.length} sub="Partially documented" />
        <KPICard icon="ti-clock" tone="danger" label="Not Started" value={notStarted.length} sub="No documentation yet" />
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <p className="card-title">Benchmarking Pipeline</p>
        <div className="kanban-board">
          <KanbanColumn title="Not Started" tone="danger" items={notStarted} />
          <KanbanColumn title="In Progress" tone="warning" items={inProgress} />
          <KanbanColumn title="Done" tone="success" items={done} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <DocHeatmap solutions={filtered} />
      </div>

      <div className="dashboard-grid">
        <SectorStatusChart solutions={filtered} />
        <PendingByFieldChart solutions={filtered} />
      </div>
    </main>
  );
}

export default BenchmarkTrackerPage;