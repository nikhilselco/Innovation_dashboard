import { useMemo, useState } from "react";
import KPICard from "../components/dashboard/KPICard";
import SectorChart from "../components/dashboard/SectorChart";
import BenchmarkStatusChart from "../components/dashboard/BenchmarkChart";
import RecentSolutionsTable from "../components/dashboard/RecentSolutionsTable";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { useDashboard } from "../hooks/useDashboard";
import { FIELDS, isBenchmarked, isPriority } from "../utils/helpers";

function DashboardPage() {
  const { longList, loading, error, retry } = useDashboard();

  const [sectorFilter, setSectorFilter] = useState("");
  const [valueChainFilter, setValueChainFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityOnly, setPriorityOnly] = useState(false);

  const filterOptions = useMemo(() => {
    if (!longList) return { sectors: [], valueChains: [], years: [] };

    const sectors = new Set();
    const valueChains = new Set();
    const years = new Set();

    longList.forEach((row) => {
      if (row[FIELDS.sector]) sectors.add(row[FIELDS.sector]);
      if (row[FIELDS.valueChain]) valueChains.add(row[FIELDS.valueChain].trim());
      if (row[FIELDS.updateYear]) years.add(String(row[FIELDS.updateYear]));
    });

    return {
      sectors: [...sectors].sort(),
      valueChains: [...valueChains].sort(),
      years: [...years].sort().reverse(),
    };
  }, [longList]);

  const filtered = useMemo(() => {
    if (!longList) return [];

    return longList.filter((row) => {
      if (sectorFilter && row[FIELDS.sector] !== sectorFilter) return false;
      if (valueChainFilter && row[FIELDS.valueChain]?.trim() !== valueChainFilter) return false;
      if (yearFilter && String(row[FIELDS.updateYear]) !== yearFilter) return false;
      if (statusFilter === "benchmarked" && !isBenchmarked(row)) return false;
      if (statusFilter === "pending" && isBenchmarked(row)) return false;
      if (priorityOnly && !isPriority(row)) return false;
      return true;
    });
  }, [longList, sectorFilter, valueChainFilter, yearFilter, statusFilter, priorityOnly]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  const totalSolutions = filtered.length;
  const benchmarkedSolutions = filtered.filter(isBenchmarked).length;
  const pendingSolutions = totalSolutions - benchmarkedSolutions;
  const totalValueChains = new Set(
    filtered.map((row) => row[FIELDS.valueChain]?.trim()).filter(Boolean)
  ).size;
  const sectorCounts = {};
  filtered.forEach((row) => {
    const sector = row[FIELDS.sector] || "Unknown";
    sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
  });
  const sectors = Object.entries(sectorCounts).map(([sector, count]) => ({ sector, count }));

  const percentBenchmarked = totalSolutions
    ? ((benchmarkedSolutions / totalSolutions) * 100).toFixed(1)
    : "0.0";
  const percentPending = totalSolutions
    ? ((pendingSolutions / totalSolutions) * 100).toFixed(1)
    : "0.0";

  const hasActiveFilters =
    sectorFilter || valueChainFilter || yearFilter || statusFilter || priorityOnly;

  const clearFilters = () => {
    setSectorFilter("");
    setValueChainFilter("");
    setYearFilter("");
    setStatusFilter("");
    setPriorityOnly(false);
  };

  return (
    <main className="dashboard-content">
      <div className="page-title-row">
        <div>
          <h2>Overall Dashboard</h2>
          <p>High-level overview of benchmarking progress and solution distribution.</p>
        </div>
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
          <select
            className="sort-select filter-select"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">Year</option>
            {filterOptions.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <i className="ti ti-chevron-down select-wrapper-icon" aria-hidden="true"></i>
        </div>

        <div className="select-wrapper filter-select-wrapper">
          <select
            className="sort-select filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="benchmarked">Benchmarked</option>
            <option value="pending">Pending</option>
          </select>
          <i className="ti ti-chevron-down select-wrapper-icon" aria-hidden="true"></i>
        </div>

        <button
          type="button"
          className={`chip${priorityOnly ? " active" : ""}`}
          onClick={() => setPriorityOnly((p) => !p)}
        >
          <i className="ti ti-star" style={{ fontSize: 11 }} aria-hidden="true"></i> Priority only
        </button>

        {hasActiveFilters && (
          <button type="button" className="chip" onClick={clearFilters}>
            <i className="ti ti-x" style={{ fontSize: 11 }} aria-hidden="true"></i> Clear filters
          </button>
        )}
      </div>

      <div className="kpi-grid">
        <KPICard
          icon="ti-package"
          tone="brand"
          label="Total Solutions"
          value={totalSolutions}
          sub={`Across ${sectors.length} sectors`}
        />
        <KPICard
          icon="ti-circle-check"
          tone="success"
          label="Benchmarked"
          value={benchmarkedSolutions}
          valueSuffix={`/ ${totalSolutions}`}
          sub={`${percentBenchmarked}% benchmarked`}
        />
        <KPICard
          icon="ti-clock"
          tone="warning"
          label="Pending"
          value={pendingSolutions}
          sub={`${percentPending}% awaiting benchmarking`}
        />
        <KPICard
          icon="ti-sitemap"
          tone="info"
          label="Value Chains"
          value={totalValueChains}
          sub="Distinct value chains in view"
        />
      </div>

      <div className="dashboard-grid">
        <SectorChart data={sectors} />
        <BenchmarkStatusChart benchmarked={benchmarkedSolutions} pending={pendingSolutions} />
      </div>

      <RecentSolutionsTable solutions={filtered} />
    </main>
  );
}

export default DashboardPage;
